CREATE DATABASE IF NOT EXISTS daystar_daycare;
USE daystar_daycare;

-- Table for storing babysitter details
CREATE TABLE Babysitters (
    BabysitterID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100),
    PhoneNumber VARCHAR(15) NOT NULL,
    NationalID VARCHAR(20) NOT NULL UNIQUE,
    Age INT CHECK (Age BETWEEN 21 AND 35),
    NextOfKin VARCHAR(100) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for tracking babysitter payments
CREATE TABLE BabysitterPayments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    BabysitterID INT,
    PaymentAmount DECIMAL(10,2),
    SessionType ENUM('Half-day', 'Full-day'),
    NumChildren INT,
    PaymentDate DATE DEFAULT CURDATE(),
    FOREIGN KEY (BabysitterID) REFERENCES Babysitters(BabysitterID)
);

-- Table for child registration
CREATE TABLE Children (
    ChildID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Age INT NOT NULL,
    ParentName VARCHAR(100) NOT NULL,
    ParentPhone VARCHAR(15) NOT NULL,
    SpecialCare TEXT,
    SessionType ENUM('Half-day', 'Full-day'),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for tracking child attendance
CREATE TABLE Attendance (
    AttendanceID INT AUTO_INCREMENT PRIMARY KEY,
    ChildID INT,
    BabysitterID INT,
    CheckInTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    CheckOutTime DATETIME,
    FOREIGN KEY (ChildID) REFERENCES Children(ChildID),
    FOREIGN KEY (BabysitterID) REFERENCES Babysitters(BabysitterID)
);

-- Table for recording incidents
CREATE TABLE Incidents (
    IncidentID INT AUTO_INCREMENT PRIMARY KEY,
    ChildID INT,
    BabysitterID INT,
    Description TEXT NOT NULL,
    IncidentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ChildID) REFERENCES Children(ChildID),
    FOREIGN KEY (BabysitterID) REFERENCES Babysitters(BabysitterID)
);

-- Table for tracking financial records
CREATE TABLE Payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    ParentName VARCHAR(100) NOT NULL,
    ChildID INT,
    AmountPaid DECIMAL(10,2) NOT NULL,
    PaymentDate DATE DEFAULT CURDATE(),
    FOREIGN KEY (ChildID) REFERENCES Children(ChildID)
);

-- Table for tracking expenses
CREATE TABLE Expenses (
    ExpenseID INT AUTO_INCREMENT PRIMARY KEY,
    ExpenseCategory ENUM('Salaries', 'Toys', 'Maintenance', 'Utilities') NOT NULL,
    Amount DECIMAL(10,2) NOT NULL,
    ExpenseDate DATE DEFAULT CURDATE()
);

-- Table for notifications
CREATE TABLE Notifications (
    NotificationID INT AUTO_INCREMENT PRIMARY KEY,
    Recipient VARCHAR(100) NOT NULL,
    Message TEXT NOT NULL,
    NotificationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for user authentication (Manager, Babysitters)
CREATE TABLE Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role ENUM('Manager', 'Babysitter') NOT NULL
);

CREATE USER 'daycare_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON daystar_daycare.* TO 'daycare_user'@'localhost';
FLUSH PRIVILEGES;
