// ============================================
// ZAMIYA COLLECTION - MAIN SCRIPT
// ============================================

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Close menu when a link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// ============================================
// SHOPPING CART FUNCTIONALITY
// ============================================

let cart = [];
const cartCountElement = document.getElementById('cartCount');

function addToCart(productName, price) {
    // Add item to cart
    cart.push({
        id: Date.now(),
        name: productName,
        price: price,
        quantity: 1
    });

    // Update cart count
    updateCartCount();

    // Show add to cart feedback
    showCartFeedback(productName);
}

function updateCartCount() {
    const cartCount = cart.length;
    cartCountElement.textContent = cartCount;

    // Save cart to localStorage
    localStorage.setItem('zamiyaCart', JSON.stringify(cart));
}

function showCartFeedback(productName) {
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #FF6B9D 0%, #FFA500 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 25px;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.4s ease-out;
    `;
    feedback.textContent = `✓ ${productName} added to cart!`;

    document.body.appendChild(feedback);

    // Remove after 3 seconds
    setTimeout(() => {
        feedback.style.animation = 'fadeOut 0.4s ease-out';
        setTimeout(() => feedback.remove(), 400);
    }, 3000);
}

// Load cart from localStorage on page load
function loadCart() {
    const savedCart = localStorage.getItem('zamiyaCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

loadCart();

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm) {
                // Show alert (can be replaced with actual search modal)
                alert(`Searching for: ${searchTerm}`);
                searchInput.value = '';
            }
        }
    });
}

// ============================================
// CONTACT FORM HANDLING
// ============================================

function handleContactForm(event) {
    event.preventDefault();

    const form = event.target;
    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const messageInput = form.querySelector('textarea');

    // Validate form
    if (!nameInput.value || !emailInput.value || !messageInput.value) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Get form data
    const formData = {
        name: nameInput.value,
        email: emailInput.value,
        message: messageInput.value,
        timestamp: new Date().toISOString()
    };

    // Save to localStorage (in real app, send to server)
    let messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    messages.push(formData);
    localStorage.setItem('contactMessages', JSON.stringify(messages));

    // Show success message
    showNotification('Message sent successfully! We will contact you soon.', 'success');

    // Reset form
    form.reset();
}

// ============================================
// NEWSLETTER SUBSCRIPTION
// ============================================

function handleNewsletter(event) {
    event.preventDefault();

    const form = event.target;
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput.value;

    if (!email || !isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Save subscription (in real app, send to server)
    let subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('subscribers', JSON.stringify(subscribers));
    }

    showNotification('Thank you for subscribing! Check your email for offers.', 'success');
    emailInput.value = '';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#4ECDC4' : type === 'error' ? '#FF1744' : '#4A90E2';

    notification.style.cssText = `
        position: fixed;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: ${bgColor};
        color: white;
        padding: 15px 30px;
        border-radius: 25px;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideInDown 0.4s ease-out;
        max-width: 90%;
    `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.4s ease-out';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}

// ============================================
// SMOOTH SCROLL ANIMATION
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.product-card, .category-card, .feature-card, .testimonial-card, .arrival-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ============================================
// FILTER PRODUCTS BY SEARCH
// ============================================

function filterProducts(searchTerm) {
    const productCards = document.querySelectorAll('.product-card');
    const searchTermLower = searchTerm.toLowerCase();

    productCards.forEach(card => {
        const productName = card.querySelector('.product-info h3')?.textContent.toLowerCase();
        const productDesc = card.querySelector('.product-description')?.textContent.toLowerCase();

        if (productName?.includes(searchTermLower) || productDesc?.includes(searchTermLower)) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.4s ease-out';
        } else {
            card.style.display = 'none';
        }
    });
}

// ============================================
// SORT PRODUCTS FUNCTIONALITY
// ============================================

function sortProducts(sortType) {
    const productsContainer = document.querySelector('.products-grid');
    const productCards = Array.from(document.querySelectorAll('.product-card'));

    productCards.sort((a, b) => {
        const priceA = parseInt(a.querySelector('.price').textContent.match(/\d+/)[0]);
        const priceB = parseInt(b.querySelector('.price').textContent.match(/\d+/)[0]);

        if (sortType === 'price-low') {
            return priceA - priceB;
        } else if (sortType === 'price-high') {
            return priceB - priceA;
        } else if (sortType === 'name') {
            const nameA = a.querySelector('.product-info h3').textContent;
            const nameB = b.querySelector('.product-info h3').textContent;
            return nameA.localeCompare(nameB);
        }
        return 0;
    });

    // Re-append sorted items
    productCards.forEach(card => productsContainer.appendChild(card));
}

// ============================================
// ADD FADE OUT ANIMATION
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// SCROLL TO TOP BUTTON
// ============================================

function createScrollTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #FF6B9D 0%, #FFA500 100%);
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        z-index: 999;
        font-size: 1.2rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(button);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
        } else {
            button.style.display = 'none';
        }
    });

    // Scroll to top on click
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effect
    button.addEventListener('mouseover', () => {
        button.style.transform = 'translateY(-5px)';
    });

    button.addEventListener('mouseout', () => {
        button.style.transform = 'translateY(0)';
    });
}

createScrollTopButton();

// ============================================
// PAGE LOAD ANIMATIONS
// ============================================

window.addEventListener('load', () => {
    // Add animation to header
    const header = document.querySelector('.header');
    header.style.animation = 'slideInDown 0.6s ease-out';
});

// ============================================
// PRICE RANGE FILTER (Optional)
// ============================================

function filterProductsByPrice(minPrice, maxPrice) {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        const priceText = card.querySelector('.price').textContent;
        const price = parseInt(priceText.match(/\d+/)[0]);

        if (price >= minPrice && price <= maxPrice) {
            card.style.display = 'block';
            card.style.opacity = '1';
        } else {
            card.style.display = 'none';
            card.style.opacity = '0.5';
        }
    });
}

// ============================================
// WISHLIST FUNCTIONALITY
// ============================================

let wishlist = [];

function addToWishlist(productName, productId) {
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('zamiyaWishlist', JSON.stringify(wishlist));
        showNotification(`${productName} added to wishlist!`, 'success');
    } else {
        showNotification(`${productName} is already in your wishlist`, 'info');
    }
}

function loadWishlist() {
    const savedWishlist = localStorage.getItem('zamiyaWishlist');
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
    }
}

loadWishlist();

// ============================================
// PRODUCT QUANTITY HANDLER
// ============================================

function updateQuantity(productId, quantity) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity = parseInt(quantity);
        if (product.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        updateCartCount();
        localStorage.setItem('zamiyaCart', JSON.stringify(cart));
    }
}

// ============================================
// DARK MODE TOGGLE (Optional)
// ============================================

function initDarkMode() {
    const darkModeToggle = localStorage.getItem('darkMode') === 'true';
    if (darkModeToggle) {
        document.body.style.backgroundColor = '#1a1a1a';
        document.body.style.color = '#f0f0f0';
    }
}

// Call on page load
initDarkMode();

// ============================================
// LIVE CHAT SIMULATION (Optional)
// ============================================

function createChatWidget() {
    const chatButton = document.createElement('button');
    chatButton.innerHTML = '<i class="fas fa-comments"></i>';
    chatButton.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
        color: white;
        border: none;
        cursor: pointer;
        z-index: 998;
        font-size: 1.5rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    chatButton.addEventListener('click', () => {
        showNotification('Chat support is coming soon! Contact us at +91-9161007123', 'info');
    });

    chatButton.addEventListener('mouseover', () => {
        chatButton.style.transform = 'scale(1.1)';
    });

    chatButton.addEventListener('mouseout', () => {
        chatButton.style.transform = 'scale(1)';
    });

    // Only show on larger screens
    if (window.innerWidth > 768) {
        document.body.appendChild(chatButton);
    }
}

createChatWidget();

// ============================================
// PAGE PERFORMANCE - Lazy Load Images
// ============================================

function lazyLoadImages() {
    const images = document.querySelectorAll('img');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

lazyLoadImages();

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log(
    '%c🎀 Welcome to Zamiya Collection! 🎀',
    'color: #FF6B9D; font-size: 20px; font-weight: bold;'
);
console.log(
    '%cTrendy & Cute Kids Fashion - Premium Quality Clothing',
    'color: #FFA500; font-size: 14px; margin: 10px 0;'
);
console.log(
    'For support, contact us at +91-9161007123'
);
