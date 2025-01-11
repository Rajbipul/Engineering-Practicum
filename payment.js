window.goToPayment = function () {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const amount = totalPrice;

    if (!name) {
        alert("Please enter your name.");
        return;
    }

    if (!/^\d{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    const options = {
        key: "rzp_live_ZAyGN8uREZ3HAN",//rzp_live_ZAyGN8uREZ3HAN
        amount: amount * 100,
        currency: "INR",
        name: "Vending Machine",
        description: "Payment for selected products",
        prefill: {
            name: name,
            contact: phone,
        },
        handler: function (response) {
            const paymentId = response.razorpay_payment_id;
            const message = `Payment Successful!%0AName: ${name}%0APayment ID: ${paymentId}%0AAmount Paid: Rs ${amount.toFixed(2)}%0AEnjoy your products!`;
            const whatsappURL = `https://wa.me/91${phone}?text=${message}`;
            window.open(whatsappURL, "_blank");
        },
        theme: {
            color: "#007bff",
        },
    };

    const razorpay = new Razorpay(options);
    razorpay.open();
};
