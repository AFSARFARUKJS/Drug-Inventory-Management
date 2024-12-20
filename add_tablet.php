<?php 
// Database connection
$host = "localhost";
$username = "root";
$password = "root"; // Replace with your database password
$database = "inventory_system"; // Replace with your database name

$conn = new mysqli($host, $username, "$password", $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $tabletName = $_POST['tablet_name'] ?? null;
    $expiryDate = $_POST['expiry_date'] ?? null;
    $quantity = $_POST['tablet_quantity'] ?? null;

    // Validate input
    if ($tabletName && $expiryDate && is_numeric($quantity) && $quantity > 0) {
        // Check if the tablet with the same expiry date already exists
        $stmt = $conn->prepare("SELECT quantity FROM inventory WHERE tablet_name = ? AND expiry_date = ?");
        if ($stmt === false) {
            die("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param("ss", $tabletName, $expiryDate);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            // Tablet exists, update the quantity
            $stmt->bind_result($currentQuantity);
            $stmt->fetch();
            $newQuantity = $currentQuantity + $quantity;

            $updateStmt = $conn->prepare("UPDATE inventory SET quantity = ? WHERE tablet_name = ? AND expiry_date = ?");
            if ($updateStmt === false) {
                die("Prepare failed: " . $conn->error);
            }
            $updateStmt->bind_param("iss", $newQuantity, $tabletName, $expiryDate);

            if ($updateStmt->execute()) {
                echo "Quantity updated successfully!";
            } else {
                echo "Error updating quantity: " . $updateStmt->error;
            }
            $updateStmt->close();
        } else {
            // Tablet does not exist, insert a new record
            $insertStmt = $conn->prepare("INSERT INTO inventory (tablet_name, quantity, price_per_unit, expiry_date) VALUES (?, ?, ?, ?)");
            if ($insertStmt === false) {
                die("Prepare failed: " . $conn->error);
            }
            $pricePerUnit = $_POST['tablet_price'] ?? null; // Ensure price is passed
            if (!$pricePerUnit || !is_numeric($pricePerUnit)) {
                die("Invalid price per unit.");
            }
            $insertStmt->bind_param("sids", $tabletName, $quantity, $pricePerUnit, $expiryDate);

            if ($insertStmt->execute()) {
                echo "Tablet added successfully!";
            } else {
                echo "Error adding tablet: " . $insertStmt->error;
            }
            $insertStmt->close();
        }
        $stmt->close();
    } else {
        echo "Invalid tablet name, expiry date, or quantity.";
    }
}

$conn->close();
?>
