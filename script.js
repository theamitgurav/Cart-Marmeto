document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const checkoutButton = document.querySelector('.checkout-btn');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(price / 100);
    };

    const updateTotals = () => {
        let subtotal = 0;
        document.querySelectorAll('.cart-item').forEach(item => {
            const quantity = parseInt(item.querySelector('.quantity-input').value);
            const price = parseInt(item.dataset.price);
            subtotal += price * quantity;
        });
        subtotalElement.textContent = formatPrice(subtotal);
        totalElement.textContent = formatPrice(subtotal);
    };

    const createCartItemHTML = (item) => {
        return `
            <div class="cart-item" data-id="${item.id}" data-price="${item.price}">
                <div class="product-info">
                    <img src="${item.image}" alt="${item.title}">
                    <span>${item.title}</span>
                </div>
                <div>${formatPrice(item.price)}</div>
                <div>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                </div>
                <div>
                    <span class="item-subtotal">${formatPrice(item.price * item.quantity)}</span>
                    <i class="fas fa-trash remove-item"></i>
                </div>
            </div>
        `;
    };

    const fetchCartData = async () => {
        try {
            loader.style.display = 'flex';
            const response = await fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889');
            const data = await response.json();
            cartItemsContainer.innerHTML = '';
            data.items.forEach(item => {
                cartItemsContainer.innerHTML += createCartItemHTML(item);
            });
            updateTotals();
            setupEventListeners();
        } catch (error) {
            console.error('Error fetching cart data:', error);
        } finally {
            loader.style.display = 'none';
        }
    };

    const setupEventListeners = () => {
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const quantity = parseInt(e.target.value);
                const cartItem = e.target.closest('.cart-item');
                const price = parseInt(cartItem.dataset.price);
                const subtotalElement = cartItem.querySelector('.item-subtotal');
                subtotalElement.textContent = formatPrice(price * quantity);
                updateTotals();
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const cartItem = e.target.closest('.cart-item');
                cartItem.remove();
                updateTotals();
            });
        });
    };

    checkoutButton.addEventListener('click', () => {
        const cartItems = [];
        document.querySelectorAll('.cart-item').forEach(item => {
            cartItems.push({
                id: item.dataset.id,
                quantity: parseInt(item.querySelector('.quantity-input').value)
            });
        });
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Proceeding to checkout...');
        window.location.href = 'checkout.html';
    });

    fetchCartData();
});
