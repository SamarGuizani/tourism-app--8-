-- Add videos array column to el_haouaria_activities if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'el_haouaria_activities' AND column_name = 'videos'
    ) THEN
        ALTER TABLE el_haouaria_activities ADD COLUMN videos TEXT[];
    END IF;
END $$;

-- Add videos array column to activities_chebba if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'activities_chebba' AND column_name = 'videos'
    ) THEN
        ALTER TABLE activities_chebba ADD COLUMN videos TEXT[];
    END IF;
END $$;

-- Add videos array column to mahdia_activities if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'mahdia_activities' AND column_name = 'videos'
    ) THEN
        ALTER TABLE mahdia_activities ADD COLUMN videos TEXT[];
    END IF;
END $$;

-- Update el_haouaria_activities with sample videos
UPDATE el_haouaria_activities
SET videos = ARRAY[
    'https://drive.google.com/file/d/1_LYX3ajI3gs2ldVA_nzJtpD8yk8Ugoev/view?usp=drivesdk',
    'https://drive.google.com/file/d/1Bvrj0EaxzCGX1-UtJNLHnZ-eZhQKobvI/view?usp=drivesdk'
]
WHERE id = 'boat-trip-standard';

-- Update activities_chebba with sample videos
UPDATE activities_chebba
SET videos = ARRAY[
    'https://drive.google.com/file/d/12kj10UxENtXUbW6-AwCcoTlL4UIQkxaB/view?usp=drivesdk',
    'https://drive.google.com/file/d/1_LYX3ajI3gs2ldVA_nzJtpD8yk8Ugoev/view?usp=drivesdk'
]
WHERE id = 'boat-tour';

-- Update mahdia_activities with sample videos
UPDATE mahdia_activities
SET videos = ARRAY[
    'https://drive.google.com/file/d/1Bvrj0EaxzCGX1-UtJNLHnZ-eZhQKobvI/view?usp=drivesdk',
    'https://drive.google.com/file/d/12kj10UxENtXUbW6-AwCcoTlL4UIQkxaB/view?usp=drivesdk'
]
WHERE id = 'boat-excursion';
