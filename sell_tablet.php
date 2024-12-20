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
    $sellQuantity = $_POST['sell_quantity'] ?? null;

    // Validate input
    if ($tabletName && is_numeric($sellQuantity) && $sellQuantity > 0) {
        // Prepare statement to check if the tablet exists
        $stmt = $conn->prepare("SELECT quantity, price_per_unit FROM inventory WHERE tablet_name = ?");
        if ($stmt === false) {
            die("Prepare failed: " . $conn->error);
        }
        $stmt->bind_param("s", $tabletName);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($currentQuantity, $pricePerUnit);
            $stmt->fetch();

            if ($currentQuantity >= $sellQuantity) {
                // Reduce the quantity in inventory
                $newQuantity = $currentQuantity - $sellQuantity;
                $updateStmt = $conn->prepare("UPDATE inventory SET quantity = ? WHERE tablet_name = ?");
                if ($updateStmt === false) {
                    die("Prepare failed: " . $conn->error);
                }
                $updateStmt->bind_param("is", $newQuantity, $tabletName);

                if ($updateStmt->execute()) {
                    // Insert into sales table
                    $totalPrice = $sellQuantity * $pricePerUnit;
                    $salesStmt = $conn->prepare(
                        "INSERT INTO sales (tablet_name, quantity, total_price, sale_date, sale_time) 
                        VALUES (?, ?, ?, NOW(), NOW())"
                    );
                    if ($salesStmt === false) {
                        die("Prepare failed: " . $conn->error);
                    }
                    $salesStmt->bind_param("sid", $tabletName, $sellQuantity, $totalPrice);

                    if ($salesStmt->execute()) {
                        echo "Sale completed successfully! Total price: $totalPrice";
                    } else {
                        echo "Error recording the sale: " . $salesStmt->error;
                    }
                    $salesStmt->close();
                } else {
                    echo "Error updating inventory: " . $updateStmt->error;
                }

                $updateStmt->close();
            } else {
                echo "Insufficient quantity available. Only $currentQuantity units left.";
            }
        } else {
            echo "Tablet not found in inventory.";
        }
        $stmt->close();
    } else {
        echo "Invalid tablet name or quantity.";
    }
}

$conn->close();
?>
