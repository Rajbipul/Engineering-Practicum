const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "vending-machine-97f0e.firebaseapp.com",
  databaseURL: "https://vending-machine-97f0e-default-rtdb.firebaseio.com",
  projectId: "vending-machine-97f0e",
  storageBucket: "vending-machine-97f0e.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
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
                const entry = {
                    item: itemId,
                    quantity: 1,
                    name: name,
                    phone: phone,
                    payment_id: response.razorpay_payment_id,
                    timestamp: Date.now()
                };

                database.ref('vend').push(entry)
                    .then(() => console.log("✅ Data saved to Firebase!"))
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
