<?php
// Run this ONCE to create the database and table
// Access: https://dromominds.com/apps/setup.php?secret=mokkannada2025

$secret = $_GET['secret'] ?? '';
if ($secret !== 'mokkannada2025') {
    http_response_code(403);
    die('Forbidden');
}

require_once 'db.php';

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS);
if ($conn->connect_error) {
    die('Connection failed: ' . $conn->connect_error);
}
$conn->set_charset('utf8mb4');

// Create database
$conn->query("CREATE DATABASE IF NOT EXISTS `" . DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
$conn->select_db(DB_NAME);

// Create registrations table
$sql = "CREATE TABLE IF NOT EXISTS `registrations` (
    `id`         INT AUTO_INCREMENT PRIMARY KEY,
    `name`       VARCHAR(255) NOT NULL,
    `email`      VARCHAR(255) NOT NULL,
    `phone`      VARCHAR(30) NOT NULL,
    `language`   VARCHAR(50) DEFAULT 'English',
    `message`    TEXT,
    `status`     ENUM('new','contacted','enrolled','cancelled') DEFAULT 'new',
    `ip_address` VARCHAR(45),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

if ($conn->query($sql)) {
    echo '<h2 style="color:green">✅ Setup complete! Table created successfully.</h2>';
    echo '<p>Database: <strong>' . DB_NAME . '</strong></p>';
    echo '<p>Table: <strong>registrations</strong></p>';
    echo '<p><a href="admin.php">Go to Admin Dashboard →</a></p>';
} else {
    echo '<h2 style="color:red">❌ Error: ' . $conn->error . '</h2>';
}
$conn->close();
