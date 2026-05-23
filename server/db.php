<?php
// Database configuration
// Deploy to: /var/www/dromominds.com/apps/db.php

define('DB_HOST', 'localhost');
define('DB_USER', 'root');         // Change to your MySQL user
define('DB_PASS', 'root123');             // Change to your MySQL password
define('DB_NAME', 'mokkannada');

function getDB() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Database connection failed']);
        exit;
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}
