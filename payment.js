window.goToPayment = function () {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const totalPrice = parseFloat(document.getElementById('total-price').textContent) * 100; // convert to paise

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
        key: "rzp_test_p7oleGr9Xev6y9",//rzp_live_ZAyGN8uREZ3HAN
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
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
};
