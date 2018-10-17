CREATE TABLE IF NOT EXISTS users (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    oid VARCHAR(60) NOT NULL,
    display_name VARCHAR(20) NOT NULL,
    groups JSON,
    enabled INT(1) NOT NULL DEFAULT 1,
    created_on TIMESTAMP DEFAULT curret_timestamp,
    UNIQUE KEY unique_oid (oid)
);

INSERT INTO users (oid, display_name) VALUES
('fbee3b7d-17d3-470c-b211-7fcf7205d294', 'Cody Wikman'),
('00000000-0000-0000-0000-000000000000', 'Developer'); 