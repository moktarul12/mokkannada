<?php
// CSV export - linked from admin.php
session_start();
if (!isset($_SESSION['admin'])) { header('Location: admin.php'); exit; }

require_once 'db.php';
$conn = getDB();
$rows = $conn->query("SELECT id,name,email,phone,language,message,status,ip_address,created_at FROM registrations ORDER BY created_at DESC")->fetch_all(MYSQLI_ASSOC);
$conn->close();

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename="registrations_' . date('Y-m-d') . '.csv"');

$out = fopen('php://output', 'w');
fputcsv($out, ['ID','Name','Email','Phone','Language','Message','Status','IP','Registered At']);
foreach ($rows as $r) {
    fputcsv($out, array_values($r));
}
fclose($out);
