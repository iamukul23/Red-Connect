-- RedConnect Database Schema for PostgreSQL

-- Create database
-- CREATE DATABASE redconnect_db;

-- Use the database
-- \c redconnect_db;

-- Blood Groups table
CREATE TABLE blood_groups (
    id SERIAL PRIMARY KEY,
    blood_group VARCHAR(5) NOT NULL UNIQUE
);

-- Insert blood groups
INSERT INTO blood_groups (blood_group) VALUES 
('A+'), ('A-'), ('B+'), ('B-'), ('AB+'), ('AB-'), ('O+'), ('O-');

-- Donors table
CREATE TABLE donors (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    mobileno VARCHAR(15) NOT NULL,
    emailid VARCHAR(100),
    age INTEGER NOT NULL CHECK (age >= 18 AND age <= 65),
    gender VARCHAR(10) NOT NULL,
    blood_group_id INTEGER REFERENCES blood_groups(id),
    address TEXT NOT NULL,
    is_available BOOLEAN DEFAULT true,
    last_donation_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blood Requests table
CREATE TABLE blood_requests (
    id SERIAL PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    units_required INTEGER NOT NULL CHECK (units_required > 0),
    hospital_name VARCHAR(200) NOT NULL,
    hospital_address TEXT NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    urgency_level VARCHAR(20) NOT NULL CHECK (urgency_level IN ('immediate', 'urgent', 'normal')),
    additional_info TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'fulfilled', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Messages table
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin Users table (for future expansion)
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donations tracking table
CREATE TABLE donations (
    id SERIAL PRIMARY KEY,
    donor_id INTEGER REFERENCES donors(id),
    blood_request_id INTEGER REFERENCES blood_requests(id),
    donation_date DATE NOT NULL,
    units_donated INTEGER NOT NULL,
    blood_bank VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_donors_blood_group ON donors(blood_group_id);
CREATE INDEX idx_donors_mobile ON donors(mobileno);
CREATE INDEX idx_blood_requests_status ON blood_requests(status);
CREATE INDEX idx_blood_requests_urgency ON blood_requests(urgency_level);
CREATE INDEX idx_blood_requests_blood_group ON blood_requests(blood_group);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);

-- Triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON donors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blood_requests_updated_at BEFORE UPDATE ON blood_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing
INSERT INTO donors (fullname, mobileno, emailid, age, gender, blood_group_id, address, last_donation_date) VALUES
('John Doe', '1234567890', 'john@example.com', 25, 'Male', 1, '123 Main St, New York, NY', '2024-01-15'),
('Jane Smith', '1234567891', 'jane@example.com', 30, 'Female', 1, '456 Oak Ave, New York, NY', '2024-02-20'),
('Mike Johnson', '1234567892', 'mike@example.com', 35, 'Male', 3, '789 Pine St, Brooklyn, NY', '2024-03-10'),
('Sarah Wilson', '1234567893', 'sarah@example.com', 28, 'Female', 4, '321 Elm St, Manhattan, NY', '2024-01-05');

INSERT INTO blood_requests (patient_name, blood_group, units_required, hospital_name, hospital_address, contact_person, phone_number, urgency_level, additional_info, status) VALUES
('Emergency Patient 1', 'O+', 2, 'City General Hospital', '100 Hospital Way, New York, NY', 'Dr. Smith', '1234567800', 'immediate', 'Emergency surgery required', 'pending'),
('Patient A', 'A+', 1, 'Metro Medical Center', '200 Health Ave, New York, NY', 'Nurse Johnson', '1234567801', 'urgent', 'Scheduled surgery tomorrow', 'pending'),
('Patient B', 'B-', 3, 'Community Hospital', '300 Care St, Brooklyn, NY', 'Dr. Brown', '1234567802', 'normal', 'Routine transfusion', 'in_progress');

INSERT INTO contact_messages (name, email, phone, subject, message) VALUES
('Test User', 'test@example.com', '1234567890', 'general', 'This is a test message'),
('Another User', 'user@example.com', '1234567891', 'blood-donation', 'I want to know more about blood donation');

-- Views for common queries
CREATE VIEW donor_summary AS
SELECT 
    d.id,
    d.fullname,
    d.mobileno,
    d.emailid,
    d.age,
    d.gender,
    bg.blood_group,
    d.address,
    d.is_available,
    d.last_donation_date,
    d.created_at
FROM donors d
LEFT JOIN blood_groups bg ON d.blood_group_id = bg.id;

CREATE VIEW urgent_requests AS
SELECT *
FROM blood_requests
WHERE status = 'pending' AND urgency_level IN ('immediate', 'urgent')
ORDER BY 
    CASE urgency_level 
        WHEN 'immediate' THEN 1 
        WHEN 'urgent' THEN 2 
    END,
    created_at ASC;
