const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Backup directory
const backupDir = path.join(__dirname, '../backups');

// Create backup directory if it doesn't exist
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Create a backup
const createBackup = async () => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `backup-${timestamp}`);
    
    // Create backup directory
    fs.mkdirSync(backupPath);
    
    // Backup MongoDB data
    const { stdout, stderr } = await execPromise(
      `mongodump --uri="${process.env.MONGODB_URI}" --out="${backupPath}/data"`
    );
    
    if (stderr) {
      console.error('Backup error:', stderr);
      throw new Error('Backup failed');
    }
    
    // Backup uploads directory
    const uploadsDir = path.join(__dirname, '../uploads');
    if (fs.existsSync(uploadsDir)) {
      fs.cpSync(uploadsDir, path.join(backupPath, 'uploads'), { recursive: true });
    }
    
    // Create backup info file
    const backupInfo = {
      timestamp: new Date(),
      database: process.env.MONGODB_URI,
      size: await getDirectorySize(backupPath)
    };
    
    fs.writeFileSync(
      path.join(backupPath, 'info.json'),
      JSON.stringify(backupInfo, null, 2)
    );
    
    // Clean up old backups
    await cleanOldBackups();
    
    return backupInfo;
  } catch (error) {
    console.error('Backup error:', error);
    throw error;
  }
};

// Restore from backup
const restoreBackup = async (backupId) => {
  try {
    const backupPath = path.join(backupDir, backupId);
    
    if (!fs.existsSync(backupPath)) {
      throw new Error('Backup not found');
    }
    
    // Restore MongoDB data
    const { stdout, stderr } = await execPromise(
      `mongorestore --uri="${process.env.MONGODB_URI}" "${backupPath}/data"`
    );
    
    if (stderr) {
      console.error('Restore error:', stderr);
      throw new Error('Restore failed');
    }
    
    // Restore uploads directory
    const uploadsDir = path.join(__dirname, '../uploads');
    const backupUploadsDir = path.join(backupPath, 'uploads');
    
    if (fs.existsSync(backupUploadsDir)) {
      if (fs.existsSync(uploadsDir)) {
        fs.rmSync(uploadsDir, { recursive: true });
      }
      fs.cpSync(backupUploadsDir, uploadsDir, { recursive: true });
    }
    
    return { message: 'Restore completed successfully' };
  } catch (error) {
    console.error('Restore error:', error);
    throw error;
  }
};

// List backups
const listBackups = async () => {
  try {
    const backups = fs.readdirSync(backupDir)
      .filter(file => fs.statSync(path.join(backupDir, file)).isDirectory())
      .map(async backupId => {
        const infoPath = path.join(backupDir, backupId, 'info.json');
        if (fs.existsSync(infoPath)) {
          const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
          return {
            id: backupId,
            ...info
          };
        }
        return null;
      });
    
    return (await Promise.all(backups)).filter(Boolean);
  } catch (error) {
    console.error('List backups error:', error);
    throw error;
  }
};

// Delete backup
const deleteBackup = async (backupId) => {
  try {
    const backupPath = path.join(backupDir, backupId);
    
    if (!fs.existsSync(backupPath)) {
      throw new Error('Backup not found');
    }
    
    fs.rmSync(backupPath, { recursive: true });
    return { message: 'Backup deleted successfully' };
  } catch (error) {
    console.error('Delete backup error:', error);
    throw error;
  }
};

// Clean old backups
const cleanOldBackups = async () => {
  try {
    const backups = await listBackups();
    const maxBackups = 5; // Keep only the last 5 backups
    
    if (backups.length > maxBackups) {
      const oldBackups = backups
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(maxBackups);
      
      for (const backup of oldBackups) {
        await deleteBackup(backup.id);
      }
    }
  } catch (error) {
    console.error('Clean old backups error:', error);
    throw error;
  }
};

// Get directory size
const getDirectorySize = async (dirPath) => {
  let size = 0;
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      size += await getDirectorySize(filePath);
    } else {
      size += stats.size;
    }
  }
  
  return size;
};

module.exports = {
  createBackup,
  restoreBackup,
  listBackups,
  deleteBackup
}; 