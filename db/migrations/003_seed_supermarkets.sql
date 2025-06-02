-- Migration: Seed initial supermarket data
-- Description: Insert Albert Heijn and Jumbo as the initial supermarket chains

-- Insert supermarket chains
INSERT INTO supermarkets (name, logo_url, website_url) VALUES
    ('Albert Heijn', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Albert_Heijn_Logo.svg/1200px-Albert_Heijn_Logo.svg.png', 'https://www.ah.nl'),
    ('Jumbo', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Jumbo_Logo.svg/1200px-Jumbo_Logo.svg.png', 'https://www.jumbo.com')
ON CONFLICT (name) DO NOTHING;

-- Note: Supermarket branches data for Noord-Holland will be added separately
-- as it requires more detailed location data that needs to be sourced