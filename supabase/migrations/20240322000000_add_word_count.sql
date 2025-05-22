-- Add word count columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS daily_word_count INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS last_submission_date DATE DEFAULT CURRENT_DATE NOT NULL; 