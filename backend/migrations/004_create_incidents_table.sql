CREATE TABLE IF NOT EXISTS incidents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  childId INT NOT NULL,
  babysitterId INT NOT NULL,
  description TEXT NOT NULL,
  severity ENUM('low', 'medium', 'high') NOT NULL,
  actionTaken TEXT,
  date DATETIME NOT NULL,
  status ENUM('open', 'resolved') DEFAULT 'open',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (childId) REFERENCES children(id) ON DELETE CASCADE,
  FOREIGN KEY (babysitterId) REFERENCES babysitters(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  type ENUM('incident', 'attendance', 'payment', 'system') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  relatedId INT,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
); 