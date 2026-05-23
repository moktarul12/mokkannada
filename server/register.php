<?php
// Registration API
// Deploy to: /var/www/dromominds.com/apps/register.php
// Access: https://dromominds.com/apps/register.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true);

$name     = trim($input['name'] ?? '');
$email    = trim($input['email'] ?? '');
$phone    = trim($input['phone'] ?? '');
$language = trim($input['language'] ?? 'English');
$message  = trim($input['message'] ?? '');

// Validation
if (empty($name) || empty($email) || empty($phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name, email and phone are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email address']);
    exit;
}

$conn = getDB();

// Check duplicate email
$check = $conn->prepare("SELECT id FROM registrations WHERE email = ?");
$check->bind_param('s', $email);
$check->execute();
$check->store_result();
if ($check->num_rows > 0) {
    $check->close();
    $conn->close();
    http_response_code(409);
    echo json_encode(['success' => false, 'error' => 'This email is already registered']);
    exit;
}
$check->close();

$ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';

$stmt = $conn->prepare(
    "INSERT INTO registrations (name, email, phone, language, message, ip_address)
     VALUES (?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param('ssssss', $name, $email, $phone, $language, $message, $ip);

if ($stmt->execute()) {
    $id = $stmt->insert_id;
    $stmt->close();
    $conn->close();
    echo json_encode([
        'success'    => true,
        'message'    => 'Registration successful! We will contact you shortly.',
        'registration_id' => $id,
    ]);
} else {
    $stmt->close();
    $conn->close();
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Registration failed. Please try again.']);
}
