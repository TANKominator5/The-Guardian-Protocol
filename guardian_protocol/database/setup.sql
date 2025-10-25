-- Create entry_profile table for Guardian Protocol
CREATE TABLE IF NOT EXISTS entry_profile (
    id SERIAL PRIMARY KEY,
    entry_id VARCHAR(50) UNIQUE NOT NULL,
    primary_name VARCHAR(255) NOT NULL,
    aliases TEXT[] DEFAULT '{}',
    status VARCHAR(20) CHECK (status IN ('SAFE', 'ALERT')) NOT NULL DEFAULT 'SAFE',
    last_seen VARCHAR(20) NOT NULL,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1) NOT NULL,
    location VARCHAR(255) NOT NULL,
    card_id VARCHAR(50) NOT NULL,
    device_hash VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_entry_profile_entry_id ON entry_profile(entry_id);
CREATE INDEX IF NOT EXISTS idx_entry_profile_status ON entry_profile(status);
CREATE INDEX IF NOT EXISTS idx_entry_profile_last_seen ON entry_profile(last_seen);
CREATE INDEX IF NOT EXISTS idx_entry_profile_primary_name ON entry_profile(primary_name);

-- Insert sample data
INSERT INTO entry_profile (entry_id, primary_name, aliases, status, last_seen, confidence_score, location, card_id, device_hash) VALUES
('E-134', 'Amit Kumar', ARRAY['Amit Kr.', 'A. Kumar'], 'SAFE', '09:20', 0.89, 'Lab-1', 'CARD_8871', 'B4:F1:22:AA'),
('E-135', 'Sarah Johnson', ARRAY['S. Johnson'], 'SAFE', '08:45', 0.92, 'Office-2', 'CARD_8872', 'C5:G2:33:BB'),
('E-136', 'Michael Chen', ARRAY['M. Chen', 'Mike Chen'], 'ALERT', '07:30', 0.85, 'Unknown', 'CARD_8873', 'D6:H3:44:CC'),
('E-137', 'Emma Wilson', ARRAY['E. Wilson'], 'SAFE', '09:15', 0.88, 'Cafeteria', 'CARD_8874', 'E7:I4:55:DD'),
('E-138', 'David Martinez', ARRAY['D. Martinez', 'Dave M.'], 'SAFE', '09:05', 0.91, 'Main Gate', 'CARD_8875', 'F8:J5:66:EE'),
('E-139', 'Lisa Anderson', ARRAY['L. Anderson'], 'ALERT', '06:50', 0.79, 'Restricted Area', 'CARD_8876', 'G9:K6:77:FF'),
('E-140', 'John Smith', ARRAY['J. Smith', 'Johnny'], 'SAFE', '10:30', 0.94, 'Conference Room', 'CARD_8877', 'H0:L7:88:GG'),
('E-141', 'Maria Garcia', ARRAY['M. Garcia'], 'SAFE', '10:15', 0.87, 'Parking Lot', 'CARD_8878', 'I1:M8:99:HH'),
('E-142', 'Robert Brown', ARRAY['R. Brown', 'Bob'], 'ALERT', '05:45', 0.76, 'Security Office', 'CARD_8879', 'J2:N9:00:II'),
('E-143', 'Jennifer Lee', ARRAY['J. Lee', 'Jen'], 'SAFE', '11:00', 0.93, 'Reception', 'CARD_8880', 'K3:O0:11:JJ');

-- Enable Row Level Security (RLS) for better security
ALTER TABLE entry_profile ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
-- You may want to modify this based on your security requirements
CREATE POLICY "Allow all operations for authenticated users" ON entry_profile
    FOR ALL USING (auth.role() = 'authenticated');
