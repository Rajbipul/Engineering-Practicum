function changeQuantity(button, change) {
    const input = button.parentElement.querySelector('.quantity-input');
    let currentValue = parseInt(input.value) || 0;
    currentValue += change;
    if (currentValue >= 0) {
        input.value = currentValue;
    }
    updateTotal();
}

function updateTotal() {
    const quantityInputs = document.querySelectorAll('.quantity-input');
    let totalPrice = 0;

    quantityInputs.forEach(input => {
        const quantity = parseInt(input.value) || 0;
        const price = parseFloat(input.getAttribute('data-price')) || 0;
        totalPrice += quantity * price;
    });

    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}
