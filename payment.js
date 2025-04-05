// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8ZDquSmJKBE_xTXRPHNfTgmAc14Z_NJ0",
  authDomain: "vending-machine-97f0e.firebaseapp.com",
  databaseURL: "https://vending-machine-97f0e-default-rtdb.firebaseio.com",
  projectId: "vending-machine-97f0e",
  storageBucket: "vending-machine-97f0e.firebasestorage.app",
  messagingSenderId: "109546646548",
  appId: "1:109546646548:web:4b084abba2a1a879c80b01",
  measurementId: "G-KF6NYKW3M6"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

window.goToPayment = function () {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const totalPrice = parseFloat(document.getElementById('total-price').textContent) * 100;

    const selectedItems = [];
    document.querySelectorAll('.product-checkbox:checked').forEach(checkbox => {
        selectedItems.push(checkbox.value);
    });

    if (totalPrice === 0) {
        alert("Please select at least one product.");
        return;
    }

    if (!name || !/^\d{10}$/.test(phone)) {
        alert("Please enter a valid name and 10-digit phone number.");
        return;
    }

    const options = {
        key: "rzp_test_p7oleGr9Xev6y9",
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
        handler: function (response) {
            selectedItems.forEach(itemId => {
    const quantity = 1; // or get quantity dynamically

    const data = {
        item: itemId,
        quantity: quantity,
        name: name,
        phone: phone,
        payment_id: response.razorpay_payment_id,
        timestamp: Date.now()
    };

    console.log("Sending data to Firebase:", data); // ✅ Log before sending

    fetch("https://vending-machine-97f0e-default-rtdb.firebaseio.com/vend.json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data) // ✅ Always stringify
    })
    .then(res => {
        if (!res.ok) throw new Error("Failed to post to Firebase");
        return res.json();
    })
    .then(result => console.log("✅ Firebase success:", result))
    .catch(err => console.error("❌ Firebase error:", err));
});

            alert(`✅ Payment successful! Transaction ID: ${response.razorpay_payment_id}`);
        },
        modal: {
            ondismiss: function () {
                console.log("Payment window closed");
            }
        }
    };

    const rzp = new Razorpay(options);
    rzp.open();
};
