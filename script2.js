// script.js
// script.js file

function scan() {
  window.location.href = "index3.html";
}

document.addEventListener("DOMContentLoaded", () => {
  loadData();
  loadInputFieldData(); /////

  const sellTabletButton = document.getElementById("sell-tablet-button");
  if (sellTabletButton) {
    sellTabletButton.addEventListener("click", () => {
      const inputField = document.getElementById("sell-name");
      const inputField1 = document.getElementById("sell-quantity");
      if (inputField) {
        inputField.value = ""; // Clear the input field
        localStorage.removeItem("tabletName"); // Remove the saved value from localStorage
      }
      if (inputField1) {
        inputField1.value = "";
      }
    });
  }
});

function saveData() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
  localStorage.setItem("totalSales", totalSales.toFixed(2));
  localStorage.setItem("salesRecords", JSON.stringify(salesRecords));
  localStorage.setItem("topTotalSales", topTotal.toFixed(2));
  const sellNameInput = document.getElementById("sell-name");
  if (sellNameInput) {
    localStorage.setItem("tabletName", sellNameInput.value);
  }
}

function loadData() {
  const storedInventory = localStorage.getItem("inventory");
  const storedSalesRecords = localStorage.getItem("salesRecords");
  const storedTotalSales = localStorage.getItem("totalSales");
  const storedTopTotal = localStorage.getItem("topTotalSales");

  if (storedInventory) {
    inventory = JSON.parse(storedInventory);
    updateInventoryTable();
  }

  if (storedSalesRecords) {
    salesRecords = JSON.parse(storedSalesRecords);
    updateSalesTableFromRecords();
  }

  if (storedTotalSales) {
    totalSales = parseFloat(storedTotalSales);
    updateTotalSalesDisplay(); // Update total sales display
  }

  if (storedTopTotal) {
    topTotal = parseFloat(storedTopTotal); // Update top total
    document.querySelector("#sales-section span").innerText =topTotal.toFixed(2);
  }
}
function loadInputFieldData() {
  // Check if there's a saved value for the input field
  const savedTabletName = localStorage.getItem("tabletName");
  if (savedTabletName) {
    const inputField = document.getElementById("sell-name");
    if (inputField) {
      inputField.value = savedTabletName; // Set the saved value to the input field
    }
  }
}

function updateTotalSalesDisplay() {
  const totalSalesElement = document.getElementById("total-sales");
  totalSalesElement.innerText = totalSales.toFixed(2);
  document.getElementById("total-sales").innerText = totalSales.toFixed(2);
}

let inventory = [];
let totalSales = 0;
let salesRecords = []; // Array to store sales records
let cnt = 0;
let total = parseInt(localStorage.getItem("totalValue")) || 0;
let topTotal = parseFloat(localStorage.getItem("topTotalSales")) || 0;
document.addEventListener("DOMContentLoaded", loadData);

window.onload = function () {
  const storedInventory = localStorage.getItem("inventory");
  const storedTotalSales = localStorage.getItem("totalSales");
  const storedSalesRecords = localStorage.getItem("salesRecords"); // Load sales records
  const showInventory = localStorage.getItem("showInventory");
  const storedTopTotal = localStorage.getItem("topTotalSales");

  if (showInventory === "true") {
    showSection("inventory-section");
    localStorage.removeItem("showInventory");
  }

  if (storedInventory) {
    inventory = JSON.parse(storedInventory);
    updateInventoryTable();
  }

  if (storedTotalSales) {
    totalSales = parseFloat(storedTotalSales);
    document.getElementById("total-sales").innerText = totalSales.toFixed(2);
  }

  if (storedSalesRecords) {
    salesRecords = JSON.parse(storedSalesRecords);
    updateSalesTableFromRecords(); // Populate sales table from records
  }

  if (storedTopTotal) {
    // If a stored value exists, update the top total sales display
    document.querySelector("#sales-section span").innerText =
      parseFloat(storedTopTotal).toFixed(2);
  }
  loadInputFieldData();
};

// Function to show the relevant section
function showSection(sectionId) {
  document.getElementById("inventory-section").style.display = "none";
  document.getElementById("sales-section").style.display = "none";
  document.getElementById(sectionId).style.display = "block";
  document.getElementById("totalValue").innerText = total;
}

function ScanToAdd(n, q, p, d) {
  const name = n;
  const quantity = parseInt(q);
  const price = parseFloat(p);
  const expiry = d;
  console.log(name, price, quantity, d);

  // Check if the item already exists in the inventory
  const existingTablet = inventory.find((item) => item.name === name);
  const existingexpiry = inventory.find((item) => item.expiry === expiry);
  if (existingTablet && existingexpiry) {
    existingTablet.quantity += quantity;
    existingTablet.price = price;
    existingTablet.expiry = expiry;
  } else {
    inventory.push({ name, quantity, price, expiry });
  }
  const formData = new FormData();
  formData.append("tablet_name", n);
  formData.append("tablet_quantity", quantity);
  formData.append("tablet_price", price);
  formData.append("expiry_date", expiry);

  // Send data to PHP file using Fetch API
  fetch("add_tablet.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      alert(data); // Display response from the server
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  updateInventoryTable();
  saveData();
}

function addToInventory() {
  const nameField = document.getElementById("tablet-name");
  const quantityField = document.getElementById("tablet-quantity");
  const priceField = document.getElementById("tablet-price");
  const expiryField = document.getElementById("expiry-date");

  const name = nameField.value.trim();
  const quantity = parseInt(quantityField.value, 10);
  const price = parseFloat(priceField.value);
  const expiry = expiryField.value.trim();

  if (
    !name ||
    isNaN(quantity) ||
    isNaN(price) ||
    !expiry ||
    quantity <= 0 ||
    price <= 0
  ) {
    alert("Please enter valid details.");
    return;
  }

  // Check if the tablet already exists in the inventory
  const existingTablet = inventory.find((item) => item.name === name);
  const existingexpiry = inventory.find((item) => item.expiry === expiry);
  if (existingTablet && existingexpiry) {
    existingTablet.quantity += quantity;
    existingTablet.price = price;
    existingTablet.expiry = expiry;
  } else {
    inventory.push({ name, quantity, price, expiry });
  }

  // Clear the input fields
  nameField.value = "";
  quantityField.value = "";
  priceField.value = "";
  expiryField.value = "";
  const formData = new FormData();
  formData.append("tablet_name", name);
  formData.append("tablet_quantity", quantity);
  formData.append("tablet_price", price);
  formData.append("expiry_date", expiry);

  // Send data to PHP file using Fetch API
  fetch("add_tablet.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      alert(data); // Display response from the server
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  updateInventoryTable();
  saveData();
}

function updateInventoryTable() {
  if (!inventory || inventory.length === 0) {
    console.warn("No inventory data available");
    return;
  }

  let cnt = 1; // Start count at 1 for table rows
  const tableBody = document.getElementById("inventory-rows");
  tableBody.innerHTML = "";

  inventory.forEach((item, index) => {
    const row = document.createElement("tr");

    // Ensure item properties exist to avoid undefined values
    const name = item.name || "N/A";
    const quantity = item.quantity ?? 0; // Default to 0 if undefined
    const expiry = item.expiry || "N/A";
    const price =
      typeof item.price === "number" ? item.price.toFixed(2) : "0.00";

    row.innerHTML = `
      <td>${cnt++}</td>
      <td>${name}</td>
      <td>${quantity}</td>
      <td>${expiry}</td>
      <td>₹ ${price}</td>
      <td><button onclick="deleteItem(${index})">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}

function deleteItem(index) {
  inventory.splice(index, 1);
  updateInventoryTable();
  saveData();
}

function sellTablet() {
  const name = document.getElementById("sell-name").value;
  const quantity = parseInt(document.getElementById("sell-quantity").value, 10);
  const tablet = inventory.find((item) => item.name === name);

  if (!tablet) {
    alert("Tablet not found in inventory.");
    return;
  }

  if (quantity > tablet.quantity) {
    alert("Not enough quantity in stock.");
    return;
  }

  const totalPrice = quantity * tablet.price;
  totalSales += totalPrice;
  tablet.quantity -= quantity;

  // Get current date and time
  const date = getCurrentDate();
  const time = getCurrentTime();

  // Store the sale record
  salesRecords.push({ name, quantity, totalPrice, date, time });
  saveData();

  // Save the updated sales records
  updateInventoryTable();
  updateSalesTable(name, quantity, totalPrice, date, time);
  updateTotalSalesDisplay();

  if (tablet.quantity < 50) {
    alert("Warning: Medicine under quantity.");
    sendEmailAlert(tablet.name, tablet.quantity);
  }
  const formData = new FormData();
  formData.append("tablet_name", name);
  formData.append("sell_quantity", quantity);

  fetch("sell_tablet.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((data) => {
      alert(data); // Show server response
      document.getElementById("sell-name").value = "";
      document.getElementById("sell-quantity").value = "";
      updateInventory(); // Refresh the inventory display
    })
    .catch((error) => {
      console.error("Error:", error);
      //  alert("An error occurred while processing the sale.");
    });
}

function sendEmailAlert(name, quantity) {
  const apiKey =
    "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"; // Replace with your actual Sendinblue API key

  const emailData = {
    sender: { email: "haribalaji250803@gmail.com" }, // Sender's email
    to: [{ email: "haribalaji2583@gmail.com" }], // Receiver's email
    subject: `Low Inventory Alert: ${name}`,
    htmlContent: `
      <h3>Inventory Alert</h3>
      <p>The quantity of <strong>${name}</strong> has dropped below 50.</p>
      <p>Only <strong>${quantity}</strong> units are remaining.</p>
    `,
  };

  fetch("https://api.sendinblue.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(emailData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.messageId) {
        console.log("Email alert sent:", data.messageId);
      } else {
        console.error("Failed to send email:", data);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function updateSalesTable(name, quantity, totalPrice, date, time) {
  const tableBody = document.getElementById("sales-rows");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${++cnt}</td>
    <td>${name}</td>
    <td>${quantity}</td>
    <td>${date}</td>
    <td>${time}</td>
    <td>${totalPrice.toFixed(2)}</td>
    
  `;

  tableBody.appendChild(row);
}

function updateSalesTableFromRecords() {
  const tableBody = document.getElementById("sales-rows");
  tableBody.innerHTML = ""; // Clear current sales table

  cnt = 0;
  salesRecords.forEach((record) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${++cnt}</td>
      <td>${record.name}</td>
      <td>${record.quantity}</td>
      <td>${record.date}</td>
      <td>${record.time}</td>
      <td>${record.totalPrice.toFixed(2)}</td>
      
    `;
    tableBody.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const overallTotalElement = document.getElementById("overalltotal");
  const savedTotal = localStorage.getItem("overallTotal");
  if (savedTotal !== null) {
    overallTotalElement.innerText = parseFloat(savedTotal).toFixed(2);
  } else {
    overallTotalElement.innerText = "0.00"; // Default value if nothing is saved
  }
});

function clearTotal() {
  topTotal = 0;
  document.querySelector("#sales-section span").innerText = topTotal.toFixed(2);
  localStorage.setItem("topTotalSales", topTotal.toFixed(2));
}

// Function to clear the bill details
function clearBill() {
  cnt = 0;
  totalSales = 0; // Reset total sales to 0

  const bottomTotal =
    parseFloat(document.getElementById("total-sales").innerText) || 0;
  const topTotalElement = document.querySelector("#sales-section span");
  const topTotal = parseFloat(topTotalElement.innerText) || 0;
  const newTopTotal = topTotal + bottomTotal;
  topTotalElement.innerText = newTopTotal.toFixed(2);

  localStorage.setItem("topTotalSales", newTopTotal.toFixed(2));

  document.getElementById("total-sales").innerText = "0.00";
  const salesTableBody = document.getElementById("sales-rows");
  salesTableBody.innerHTML = ""; // Clear the sales table

  salesRecords = []; // Reset sales records
  localStorage.removeItem("salesRecords"); // Clear sales records from localStorage

  // Optionally, clear any other input fields or reset the inventory display
  document.getElementById("sell-name").value = "";
  document.getElementById("sell-quantity").value = "";

  // Remove sales data from localStorage
  localStorage.removeItem("totalSales");
  saveData(); // Save the updated state
}

function domReady(fn) {
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(fn, 1000);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}
window.onload = function () {
  domReady(function () {
    // If found you qr code
    function onScanSuccess(decodeText) {
      alert("Successfully Scaned...");
      const ar = decodeText.split(",");
      // Check if the array contains the required number of elements
      if (ar.length === 4) {
        // Call the ScanToAdd function to add to the inventory
        ScanToAdd(ar[0], ar[1], ar[2], ar[3]);
      } else if (ar.length === 1) {
        console.log(ar[0]);
        const inputField = document.getElementById("sell-name");
        inputField.value = ar[0];
        localStorage.setItem("tabletName", ar[0]);
      } else {
        alert("Invalid QR code format. Please scan a valid code.");
      }
    }

    let htmlscanner = new Html5QrcodeScanner("my-qr-reader", {
      fps: 10,
      qrbos: 250,
    });
    htmlscanner.render(onScanSuccess);
  });
};
function back() {
  localStorage.setItem("showInventory", "true");
  window.location.href = "index2.html";
}

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Add leading zero
  const day = String(today.getDate()).padStart(2, "0"); // Add leading zero
  return `${day}-${month}-${year}`;
}

function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0"); // Add leading zero
  const amPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight
  return `${hours}:${minutes} ${amPm}`;
}
function billscan() {
  window.location.href = "index3.html";
}
