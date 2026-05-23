<?php
// Admin Dashboard - View all registrations
// Access: https://dromominds.com/apps/admin.php
// Protected by simple password

session_start();

$ADMIN_PASSWORD = 'mokkannada@admin2025'; // Change this!

// Login
if (isset($_POST['password'])) {
    if ($_POST['password'] === $ADMIN_PASSWORD) {
        $_SESSION['admin'] = true;
    } else {
        $error = 'Wrong password';
    }
}
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: admin.php');
    exit;
}

// Update status
if (isset($_SESSION['admin']) && isset($_POST['update_status'])) {
    require_once 'db.php';
    $conn = getDB();
    $id     = (int)$_POST['id'];
    $status = $_POST['status'];
    $allowed = ['new','contacted','enrolled','cancelled'];
    if (in_array($status, $allowed)) {
        $stmt = $conn->prepare("UPDATE registrations SET status=? WHERE id=?");
        $stmt->bind_param('si', $status, $id);
        $stmt->execute();
        $stmt->close();
    }
    $conn->close();
    header('Location: admin.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MokKannada – Registrations Admin</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0f2f5; color: #333; }
  .topbar { background: #E53935; color: #fff; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
  .topbar h1 { font-size: 20px; font-weight: 700; }
  .topbar a { color: #ffcdd2; text-decoration: none; font-size: 14px; }
  .container { max-width: 1100px; margin: 24px auto; padding: 0 16px; }
  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .stat-card { background: #fff; border-radius: 12px; padding: 20px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,.07); }
  .stat-num { font-size: 36px; font-weight: 800; }
  .stat-label { font-size: 13px; color: #666; margin-top: 4px; }
  .new-c { color: #1976D2; } .contacted-c { color: #F57C00; } .enrolled-c { color: #388E3C; } .cancelled-c { color: #999; }
  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.07); }
  th { background: #E53935; color: #fff; padding: 12px 14px; text-align: left; font-size: 13px; font-weight: 600; }
  td { padding: 12px 14px; font-size: 13px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
  tr:hover td { background: #fafafa; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .badge-new { background: #E3F2FD; color: #1976D2; }
  .badge-contacted { background: #FFF3E0; color: #F57C00; }
  .badge-enrolled { background: #E8F5E9; color: #388E3C; }
  .badge-cancelled { background: #EEEEEE; color: #9E9E9E; }
  select { border: 1px solid #ddd; border-radius: 6px; padding: 4px 8px; font-size: 12px; cursor: pointer; }
  .login-wrap { max-width: 380px; margin: 100px auto; background: #fff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,.1); text-align: center; }
  .login-wrap h2 { margin-bottom: 24px; color: #E53935; }
  .login-wrap input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 15px; margin-bottom: 16px; }
  .login-wrap button { width: 100%; padding: 12px; background: #E53935; color: #fff; border: none; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; }
  .error { color: #E53935; margin-bottom: 12px; font-size: 14px; }
  .export-btn { display: inline-block; margin-bottom: 16px; padding: 8px 20px; background: #388E3C; color: #fff; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; }
</style>
</head>
<body>

<?php if (!isset($_SESSION['admin'])): ?>
<div class="login-wrap">
  <h2>🔐 Admin Login</h2>
  <?php if (isset($error)): ?><p class="error"><?= htmlspecialchars($error) ?></p><?php endif; ?>
  <form method="POST">
    <input type="password" name="password" placeholder="Enter admin password" autofocus>
    <button type="submit">Login</button>
  </form>
</div>

<?php else:
  require_once 'db.php';
  $conn = getDB();

  $totals = $conn->query("SELECT status, COUNT(*) as cnt FROM registrations GROUP BY status")->fetch_all(MYSQLI_ASSOC);
  $counts = ['new'=>0,'contacted'=>0,'enrolled'=>0,'cancelled'=>0];
  $total  = 0;
  foreach ($totals as $r) { $counts[$r['status']] = $r['cnt']; $total += $r['cnt']; }

  $rows = $conn->query("SELECT * FROM registrations ORDER BY created_at DESC")->fetch_all(MYSQLI_ASSOC);
  $conn->close();
?>
<div class="topbar">
  <h1>📋 MokKannada – Live Session Registrations</h1>
  <a href="?logout=1">Logout</a>
</div>
<div class="container">
  <div class="stats">
    <div class="stat-card"><div class="stat-num"><?= $total ?></div><div class="stat-label">Total</div></div>
    <div class="stat-card"><div class="stat-num new-c"><?= $counts['new'] ?></div><div class="stat-label">New</div></div>
    <div class="stat-card"><div class="stat-num contacted-c"><?= $counts['contacted'] ?></div><div class="stat-label">Contacted</div></div>
    <div class="stat-card"><div class="stat-num enrolled-c"><?= $counts['enrolled'] ?></div><div class="stat-label">Enrolled</div></div>
    <div class="stat-card"><div class="stat-num cancelled-c"><?= $counts['cancelled'] ?></div><div class="stat-label">Cancelled</div></div>
  </div>

  <a class="export-btn" href="export.php">⬇ Export CSV</a>

  <table>
    <thead>
      <tr>
        <th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Language</th><th>Message</th><th>Status</th><th>Registered</th>
      </tr>
    </thead>
    <tbody>
    <?php foreach ($rows as $r): ?>
    <tr>
      <td><?= $r['id'] ?></td>
      <td><strong><?= htmlspecialchars($r['name']) ?></strong></td>
      <td><?= htmlspecialchars($r['email']) ?></td>
      <td><?= htmlspecialchars($r['phone']) ?></td>
      <td><?= htmlspecialchars($r['language']) ?></td>
      <td><?= htmlspecialchars(substr($r['message'],0,60)) ?><?= strlen($r['message'])>60?'…':'' ?></td>
      <td>
        <form method="POST" style="display:inline">
          <input type="hidden" name="id" value="<?= $r['id'] ?>">
          <select name="status" onchange="this.form.submit()">
            <?php foreach(['new','contacted','enrolled','cancelled'] as $s): ?>
            <option value="<?= $s ?>" <?= $r['status']===$s?'selected':'' ?>><?= ucfirst($s) ?></option>
            <?php endforeach; ?>
          </select>
          <input type="hidden" name="update_status" value="1">
        </form>
      </td>
      <td style="white-space:nowrap"><?= date('d M Y, h:i A', strtotime($r['created_at'])) ?></td>
    </tr>
    <?php endforeach; ?>
    <?php if (empty($rows)): ?>
    <tr><td colspan="8" style="text-align:center;padding:40px;color:#999">No registrations yet</td></tr>
    <?php endif; ?>
    </tbody>
  </table>
</div>
<?php endif; ?>
</body>
</html>
