// Cart management functions
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
    const cart = getCart();
    cart.push(product);
    saveCart(cart);
    updateCartCount();
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const cartCount = document.querySelector('#cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Page load event listener
document.addEventListener('DOMContentLoaded', () => {
    // Update cart count on all pages
    updateCartCount();

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const product = {
                name: productCard.querySelector('h3').textContent,
                brand: productCard.querySelector('.brand').textContent,
                price: productCard.querySelector('.price').textContent,
                image: productCard.querySelector('img').src
            };
            addToCart(product);
          //alert(`${product.name}has been added to your cart!`);
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-container input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const products = document.querySelectorAll('.product-card');
            products.forEach(product => {
                const name = product.querySelector('h3').textContent.toLowerCase();
                product.style.display = name.includes(searchTerm) ? 'block' : 'none';
            });
        });
    }

    // Cart page functionality
    const cartItemsContainer = document.querySelector('#cart-items');
    if (cartItemsContainer) {
        const cart = getCart();
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <h3>${item.name}</h3>
                        <p>${item.brand}</p>
                        <p>${item.price}</p>
                    </div>
                    <button class="remove-from-cart" data-index="${index}">Remove</button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });

            // Remove from cart
            const removeButtons = document.querySelectorAll('.remove-from-cart');
            removeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const index = button.getAttribute('data-index');
                    removeFromCart(index);
                    location.reload(); // Refresh to update cart display
                });
            });

            // Calculate and display total
            const total = cart.reduce((sum, item) => {
                const price = parseFloat(item.price.replace('₹', '').replace(',', ''));
                return sum + price;
            }, 0);
            const totalElement = document.createElement('p');
            totalElement.style.fontWeight = '700';
            totalElement.style.fontSize = '1.25rem';
            totalElement.style.color = '#16a34a'; /* Tailwind green-600 */
            totalElement.textContent = `Total: ₹${total.toFixed(2)}`;
            cartItemsContainer.appendChild(totalElement);
        }
    }
});
