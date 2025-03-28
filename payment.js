window.goToPayment = function () {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const totalPrice = parseFloat(document.getElementById('total-price').textContent) * 100; // convert to paise
    
    // Get selected items (assuming checkboxes with class 'product-checkbox')
    const selectedItems = [];
    document.querySelectorAll('.product-checkbox:checked').forEach(checkbox => {
        selectedItems.push(checkbox.value); // assuming value="1", "2", "3" etc.
    });

    // Validation
    if (totalPrice === 0) {
        alert("Please select at least one product.");
        return;
    }

    if (!name) {
        alert("Please enter your name.");
        return;
    }

    if (!/^\d{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    const options = {
        key: "rzp_test_p7oleGr9Xev6y9", // Test key - replace with live key for production
        amount: totalPrice,
        currency: "INR",
        name: "Vending Machine",
        description: "Payment for selected products",
        prefill: {
            name: name,
            contact: phone,
        },
        theme: {
            color: "#007bff",
        },
        handler: function(response) {
            // Payment succeeded - notify ESP32 for each selected item
            selectedItems.forEach(itemId => {
                activateServo(itemId);
            });
            
            // Show success message
            alert(`Payment successful! Transaction ID: ${response.razorpay_payment_id}`);
            
            // Optional: Redirect or reset form
            // window.location.href = "success.html";
        },
        modal: {
            ondismiss: function() {
                // Optional: Handle when user closes the payment form
                console.log("Payment window closed");
            }
        }
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
};

// Function to activate servo on ESP32
function activateServo(itemId) {
    // Replace with your ESP32's IP address
    const esp32IP = "192.168.103.159"; 
    
    fetch(`http://${esp32IP}/payment-success?item=${itemId}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
        console.log(`Servo ${itemId} activated:`, data);
    })
    .catch(error => {
        console.error('Error activating servo:', error);
        // Optional: Show error to user or retry
    });
}
