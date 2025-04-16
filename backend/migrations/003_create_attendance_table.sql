CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  childId INT NOT NULL,
  babysitterId INT NOT NULL,
  date DATE NOT NULL,
  sessionType ENUM('half-day', 'full-day') NOT NULL,
  status ENUM('present', 'absent') NOT NULL,
  checkInTime TIME,
  checkOutTime TIME,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (childId) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (babysitterId) REFERENCES babysitters(id) ON DELETE CASCADE,
  UNIQUE KEY unique_attendance (childId, date, sessionType)
);

-- Add attendanceStatus column to children table if it doesn't exist
ALTER TABLE children
ADD COLUMN IF NOT EXISTS attendanceStatus ENUM('present', 'absent') DEFAULT NULL; 