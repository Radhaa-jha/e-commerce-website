  // DOM Elements
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.querySelector('.nav-links');
        const cartIcon = document.getElementById('cart-icon');
        const cartModal = document.getElementById('cart-modal');
        const closeCart = document.getElementById('close-cart');
        const overlay = document.getElementById('overlay');
        const checkoutBtn = document.getElementById('checkout-btn');
        const checkoutModal = document.getElementById('checkout-modal');
        const closeCheckout = document.getElementById('close-checkout');
        const checkoutForm = document.getElementById('checkout-form');
        const orderConfirmation = document.getElementById('order-confirmation');
        const viewOrderBtn = document.getElementById('view-order-btn');
        const continueShoppingBtn = document.getElementById('continue-shopping-btn');
        const viewOrdersBtn = document.getElementById('view-orders');
        const ordersPage = document.getElementById('orders-page');
        const backToShopBtn = document.getElementById('back-to-shop');
        const emptyOrders = document.getElementById('empty-orders');
        const mainContent = document.querySelector('main');

        // Cart state
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let orders = JSON.parse(localStorage.getItem('orders')) || [];

        // Toggle mobile menu
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });

        // Toggle cart modal
        cartIcon.addEventListener('click', () => {
            cartModal.classList.add('active');
            overlay.classList.add('active');
        });

        closeCart.addEventListener('click', () => {
            cartModal.classList.remove('active');
            overlay.classList.remove('active');
        });

        // Open checkout modal
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty!');
                return;
            }
            checkoutModal.classList.add('active');
        });

        // Close checkout modal
        closeCheckout.addEventListener('click', () => {
            checkoutModal.classList.remove('active');
        });

        // Close modals when clicking on overlay
        overlay.addEventListener('click', () => {
            cartModal.classList.remove('active');
            checkoutModal.classList.remove('active');
            orderConfirmation.classList.remove('active');
            overlay.classList.remove('active');
        });

        // View orders
        viewOrdersBtn.addEventListener('click', (e) => {
            e.preventDefault();
            mainContent.classList.add('hidden');
            ordersPage.classList.remove('hidden');
            renderOrders();
        });

        // Back to shop from orders page
        backToShopBtn.addEventListener('click', () => {
            ordersPage.classList.add('hidden');
            mainContent.classList.remove('hidden');
        });

        // View order after confirmation
        viewOrderBtn.addEventListener('click', () => {
            orderConfirmation.classList.remove('active');
            overlay.classList.remove('active');
            mainContent.classList.add('hidden');
            ordersPage.classList.remove('hidden');
            renderOrders();
        });

        // Continue shopping after confirmation
        continueShoppingBtn.addEventListener('click', () => {
            orderConfirmation.classList.remove('active');
            overlay.classList.remove('active');
        });

        // Select payment method
        function selectPayment(method) {
            document.querySelectorAll('.payment-method').forEach(item => {
                item.classList.remove('active');
            });
            document.getElementById(method).parentElement.classList.add('active');
            document.getElementById(method).checked = true;
        }

        // Add to cart function
        function addToCart(name, price, image) {
            const existingItem = cart.find(item => item.name === name);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    name,
                    price,
                    image,
                    quantity: 1
                });
            }
            
            updateCart();
            showNotification(`${name} added to cart`);
        }

        // Buy now function
        function buyNow(name, price, image) {
            // Clear cart and add only this item
            cart = [{
                name,
                price,
                image,
                quantity: 1
            }];
            
            updateCart();
            cartModal.classList.add('active');
            overlay.classList.add('active');
        }

        // Update cart UI
        function updateCart() {
            const cartItems = document.getElementById('cart-items');
            const cartCount = document.querySelector('.cart-count');
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Render cart items
            if (cart.length === 0) {
                cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
                document.getElementById('cart-subtotal').textContent = '$0.00';
                document.getElementById('cart-total').textContent = '$5.00';
                return;
            }
            
            let cartHTML = '';
            let subtotal = 0;
            
            cart.forEach(item => {
                subtotal += item.price * item.quantity;
                
                cartHTML += `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${item.name}</h4>
                            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                            </div>
                            <button class="remove-item" onclick="removeItem('${item.name}')">Remove</button>
                        </div>
                    </div>
                `;
            });
            
            cartItems.innerHTML = cartHTML;
            
            const shipping = 5.00;
            const total = subtotal + shipping;
            
            document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
        }

        // Update item quantity
        function updateQuantity(name, change) {
            const item = cart.find(item => item.name === name);
            
            if (item) {
                item.quantity += change;
                
                if (item.quantity <= 0) {
                    cart = cart.filter(item => item.name !== name);
                }
                
                updateCart();
            }
        }

        // Remove item from cart
        function removeItem(name) {
            cart = cart.filter(item => item.name !== name);
            updateCart();
        }

        // Show notification
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            notification.style.position = 'fixed';
            notification.style.bottom = '20px';
            notification.style.right = '20px';
            notification.style.backgroundColor = '#2c3e50';
            notification.style.color = 'white';
            notification.style.padding = '12px 24px';
            notification.style.borderRadius = '4px';
            notification.style.zIndex = '1000';
            notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            notification.style.animation = 'slideIn 0.3s, fadeOut 0.5s 2.5s';
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Handle checkout form submission
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const address = document.getElementById('address').value;
            const phone = document.getElementById('phone').value;
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
            
            // Create order
            const order = {
                id: Date.now(),
                date: new Date().toLocaleDateString(),
                status: 'Processing',
                items: [...cart],
                shippingAddress: address,
                paymentMethod,
                customer: {
                    name,
                    email,
                    phone
                },
                total: cart.reduce((total, item) => total + (item.price * item.quantity), 0) + 5.00
            };
            
            // Add to orders
            orders.unshift(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Clear cart
            cart = [];
            updateCart();
            
            // Close modals and show confirmation
            cartModal.classList.remove('active');
            checkoutModal.classList.remove('active');
            orderConfirmation.classList.add('active');
            
            // Reset form
            checkoutForm.reset();
        });

        // Render orders
        function renderOrders() {
            const ordersList = document.getElementById('orders-list');
            
            if (orders.length === 0) {
                emptyOrders.classList.remove('hidden');
                ordersList.innerHTML = '';
                return;
            }
            
            emptyOrders.classList.add('hidden');
            
            let ordersHTML = '';
            
            orders.forEach(order => {
                ordersHTML += `
                    <div class="order-card">
                        <div class="order-header">
                            <div>
                                <span class="order-id">Order #${order.id}</span>
                                <span class="order-date">${order.date}</span>
                            </div>
                            <span class="order-status">${order.status}</span>
                        </div>
                        <div class="order-items">
                            ${order.items.map(item => `
                                <div class="order-item">
                                    <img src="${item.image}" alt="${item.name}" class="order-item-img">
                                    <div class="order-item-details">
                                        <h4 class="order-item-title">${item.name}</h4>
                                        <p class="order-item-price">$${item.price.toFixed(2)} × ${item.quantity}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="order-total">
                            <span>Total: $${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                `;
            });
            
            ordersList.innerHTML = ordersHTML;
        }

        // Initialize
        updateCart();