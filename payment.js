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

    function sendToFirebase(itemId, quantity) {
    const firebaseURL = "https://vending-machine-97f0e-default-rtdb.firebaseio.com/vend.json";

    const data = {
        item: itemId,
        quantity: quantity,
        timestamp: Date.now()
    };

    fetch(firebaseURL, {
        method: "PUT",  // Use POST if you want to store multiple entries
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => console.log("Sent to Firebase:", res))
    .catch(err => console.error("Error sending to Firebase:", err));
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
            selectedItems.forEach(itemId => {
                const quantity = 1; // Replace this if user selects quantity
                sendToFirebase(itemId, quantity);
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
