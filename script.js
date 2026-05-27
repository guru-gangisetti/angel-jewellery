/* =========================================================================
   ANGEL JEWELLERY — COMPLETE MASTER RUNTIME ENGINE APPLICATIVE LOGIC
   ========================================================================= */

let productDatabase = [];    
let shoppingCart = [];       
let wishlistMemory = [];     
let adminOrdersCache = [];       
let currentAdminActiveTab = "pending";
let activeDiscount = { code: "", type: "", value: 0 };

const FREE_SHIPPING_THRESHOLD = 1000; 

const couponRegistry = {
    "ANGEL10": { type: "percentage", value: 10 },
    "WELCOME5": { type: "percentage", value: 5 },
    "FESTIVE2000": { type: "flat", value: 2000 },
    "LAUNCH2026": { type: "percentage", value: 15 }
};

async function loadProductDatabaseEngine() {
    try {
        const targetResponse = await fetch('data/products.json');
        if (!targetResponse.ok) throw new Error('Data stream failed verification handles');
        
        const fileContent = await targetResponse.json();
        
        if (fileContent && typeof fileContent === 'object' && Array.isArray(fileContent.products)) {
            productDatabase = fileContent.products;
        } else if (Array.isArray(fileContent)) {
            productDatabase = fileContent;
        } else {
            productDatabase = [];
        }
        
        filterCatalog();
    } catch (error) {
        console.error('Critical catalog database execution drop:', error);
        const grid = document.getElementById('productGrid');
        if (grid) grid.innerHTML = `<div class="no-results">Unable to load catalog matrix at this moment.</div>`;
    }
}

function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

function displayProducts(productsList) {
    const gridContainer = document.getElementById('productGrid');
    if (!gridContainer) return;
    
    gridContainer.innerHTML = "";

    if (productsList.length === 0) {
        gridContainer.innerHTML = `<div class="no-results">No masterpieces match your criteria.</div>`;
        return;
    }

    productsList.forEach(product => {
        const isSoldOut = product.badge && product.badge.toLowerCase() === 'sold out';
        const isFavorited = wishlistMemory.includes(product.id);
        
        const designCard = document.createElement('div');
        designCard.className = `product-card ${isSoldOut ? 'disabled-card' : ''}`;
        
        let badgeHTML = "";
        if (product.badge) {
            const urgencyClass = isSoldOut ? 'sold-out-alert' : (product.badge.toLowerCase() === 'new in' ? '' : 'urgency-alert');
            badgeHTML = `<span class="product-badge ${urgencyClass}">${product.badge}</span>`;
        }

        designCard.innerHTML = `
            <div class="product-img-wrapper">
                ${badgeHTML}
                <button class="wishlist-heart-btn ${isFavorited ? 'active' : ''}" onclick="toggleWishlistEngine(event, ${product.id}, this)" aria-label="Add to wishlist">
                    <i class="${isFavorited ? 'fas' : 'far'} fa-heart"></i>
                </button>
                <img src="${product.image}" loading="lazy" alt="${product.title}" onload="this.classList.add('loaded')">
                <div class="product-actions-overlay">
                    <button class="btn-mini-action" onclick="openQuickViewShield(${product.id})"><i class="fas fa-eye"></i> Quick View</button>
                </div>
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">${formatCurrency(product.price)}</p>
                
                <button class="btn-order-wa" onclick="${isSoldOut ? '' : `addToCartEngine(${product.id}); triggerCartNotification('${product.title}');`}" ${isSoldOut ? 'disabled' : ''}>
                    <i class="${isSoldOut ? 'fas fa-hourglass-start' : ''}"></i> ${isSoldOut ? 'Restocking Soon' : 'Add To Cart'}
                </button>
            </div>
        `;
        gridContainer.appendChild(designCard);
    });
}

function filterCurrentDataset() {
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
    
    const searchInput = document.getElementById('searchInput');
    const searchKeyword = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    const hideSoldOutCheckbox = document.getElementById('hideSoldOutCheckbox');
    const hideSoldOutActive = hideSoldOutCheckbox ? hideSoldOutCheckbox.checked : false;

    return productDatabase.filter(product => {
        const matchesCategory = (activeFilter === 'all' || product.category === activeFilter);
        const matchesSearch = product.title.toLowerCase().includes(searchKeyword) || 
                              product.category.toLowerCase().includes(searchKeyword);
                              
        const isSoldOut = product.badge && product.badge.toLowerCase() === 'sold out';
        const passesStockCheck = hideSoldOutActive ? !isSoldOut : true;

        return matchesCategory && matchesSearch && passesStockCheck;
    });
}

function filterCatalog() { 
    displayProducts(filterCurrentDataset()); 
    renderVaultSaleSection();
    renderTrendingSection();
}

function addToCartEngine(id) {
    const targetItem = productDatabase.find(p => p.id === id);
    if (!targetItem) return;

    const existingSelection = shoppingCart.find(item => item.id === id);
    if (existingSelection) {
        existingSelection.quantity += 1;
    } else {
        shoppingCart.push({ ...targetItem, quantity: 1 });
    }
    updateCartUI();
}

function changeQty(id, delta) {
    const targetItem = shoppingCart.find(item => item.id === id);
    if (!targetItem) return;

    targetItem.quantity += delta;
    if (targetItem.quantity <= 0) {
        shoppingCart = shoppingCart.filter(item => item.id !== id);
    }
    updateCartUI();
}

function removeFromCart(id) {
    shoppingCart = shoppingCart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const cartItemsList = document.getElementById('cartItemsList');
    const cartCountBadge = document.getElementById('cartCountBadge');
    const cartTotalQty = document.getElementById('cartTotalQty');
    const cartFooterSection = document.getElementById('cartFooterSection');
    const shippingProgressBox = document.getElementById('shippingProgressBox');
    
    if (!cartItemsList) return;
    cartItemsList.innerHTML = "";
    let totalItemsCount = 0;
    let grandSubtotal = 0;

    if (shoppingCart.length === 0) {
        cartItemsList.innerHTML = `<div style="text-align:center; color:var(--text-muted); font-size:0.9rem; padding: 40px 0;">Your cart is currently empty.</div>`;
        if (cartCountBadge) cartCountBadge.style.opacity = "0";
        if (cartFooterSection) cartFooterSection.style.display = "none";
        if (shippingProgressBox) shippingProgressBox.style.display = "none";
        
        activeDiscount = { code: "", type: "", value: 0 };
        if (document.getElementById('couponInput')) document.getElementById('couponInput').value = "";
        if (document.getElementById('couponStatusMessage')) document.getElementById('couponStatusMessage').style.display = "none";
        if (document.getElementById('giftCheckbox')) document.getElementById('giftCheckbox').checked = false;
        if (document.getElementById('giftMessageWrapper')) document.getElementById('giftMessageWrapper').style.display = "none";
        if (document.getElementById('giftMessageInput')) document.getElementById('giftMessageInput').value = "";
        return;
    }

    if (cartFooterSection) cartFooterSection.style.display = "flex";
    if (shippingProgressBox) shippingProgressBox.style.display = "block";

    shoppingCart.forEach(item => {
        totalItemsCount += item.quantity;
        grandSubtotal += (item.price * item.quantity);
        
        const itemRow = document.createElement('div');
        itemRow.className = "cart-item-row";
        itemRow.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div style="flex-grow:1;">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-meta">${item.category}</p>
                <p class="cart-item-price">${formatCurrency(item.price)}</p>
                <div class="cart-item-controls">
                    <i class="fas fa-minus" onclick="changeQty(${item.id}, -1)"></i>
                    <span>${item.quantity}</span>
                    <i class="fas fa-plus" onclick="changeQty(${item.id}, 1)"></i>
                </div>
            </div>
            <i class="fas fa-trash" onclick="removeFromCart(${item.id})"></i>
        `;
        cartItemsList.appendChild(itemRow);
    });

    if (cartCountBadge) {
        cartCountBadge.innerText = totalItemsCount;
        cartCountBadge.style.opacity = "1";
    }
    
    const progressBarFill = document.getElementById('shippingBarFill');
    const progressText = document.getElementById('shippingProgressText');
    
    if (progressBarFill && progressText) {
        const structuralPercentage = Math.min((grandSubtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
        progressBarFill.style.width = `${structuralPercentage}%`;
        
        if (grandSubtotal >= FREE_SHIPPING_THRESHOLD) {
            progressText.innerHTML = `✨ <span style="color:#25d366; font-weight:600;">Free Shipping Unlocked!</span>`;
        } else {
            const gapAmount = FREE_SHIPPING_THRESHOLD - grandSubtotal;
            progressText.innerHTML = `Add <span style="color:var(--pink-accent); font-weight:600;">${formatCurrency(gapAmount)}</span> more for Free Delivery`;
        }
    }
    
    let discountAmount = 0;
    if (activeDiscount.code) {
        if (activeDiscount.type === "percentage") discountAmount = (grandSubtotal * activeDiscount.value) / 100;
        else if (activeDiscount.type === "flat") discountAmount = activeDiscount.value;
        if (discountAmount > grandSubtotal) discountAmount = grandSubtotal;
    }
    let finalPayableTotal = grandSubtotal - discountAmount;

    let summaryHTML = `<div class="totals-row"><span>Items Subtotal:</span><span>${formatCurrency(grandSubtotal)}</span></div>`;
    if (discountAmount > 0) {
        summaryHTML += `<div class="totals-row discount-applied"><span>Discount (${activeDiscount.code}):</span><span>-${formatCurrency(discountAmount)}</span></div>`;
    }
    summaryHTML += `<div class="totals-row grand-payable"><span>Final Payable:</span><span>${formatCurrency(finalPayableTotal)}</span></div>`;
    
    if (cartTotalQty) cartTotalQty.innerHTML = summaryHTML;
    const primaryCheckoutButtonElement = document.getElementById('checkoutBtn');
    if (primaryCheckoutButtonElement) {
        primaryCheckoutButtonElement.innerHTML = `<i class="fas fa-lock"></i> Secure Checkout Panel`;
        primaryCheckoutButtonElement.style.display = "flex"; 
    }
}

function toggleWishlistEngine(event, id, targetButton) {
    if (event) event.stopPropagation();
    const matchIndex = wishlistMemory.indexOf(id);
    if (matchIndex > -1) {
        wishlistMemory.splice(matchIndex, 1);
        if (targetButton) targetButton.classList.remove('active');
    } else {
        wishlistMemory.push(id);
        if (targetButton) targetButton.classList.add('active');
    }
    updateWishlistUI();
    filterCatalog(); 
}

function updateWishlistUI() {
    const wishlistItemsList = document.getElementById('wishlistItemsList');
    const wishlistCountBadge = document.getElementById('wishlistCountBadge');
    if (!wishlistItemsList) return;
    
    wishlistItemsList.innerHTML = "";
    
    if (wishlistCountBadge) {
        wishlistCountBadge.innerText = wishlistMemory.length;
        wishlistCountBadge.style.opacity = wishlistMemory.length > 0 ? "1" : "0";
    }

    if (wishlistMemory.length === 0) {
        wishlistItemsList.innerHTML = `<div style="text-align:center; color:var(--text-muted); font-size:0.9rem; padding:40px 0;">Your wishlist is empty.</div>`;
        return;
    }

    wishlistMemory.forEach(id => {
        const item = productDatabase.find(p => p.id === id);
        if (!item) return;

        const isSoldOut = item.badge && item.badge.toLowerCase() === 'sold out';

        let actionButtonHTML = "";
        if (isSoldOut) {
            actionButtonHTML = `
                <button class="btn-luxury" disabled style="padding:6px 12px; font-size:0.65rem; letter-spacing:1px; color:var(--text-muted); background:#f1f0f5; border:none; cursor:not-allowed;">
                    Restocking Soon
                </button>
            `;
        } else {
            actionButtonHTML = `
                <button onclick="addToCartEngine(${item.id}); toggleWishlistDrawer(); triggerCartNotification('${item.title}');" class="btn-luxury" style="padding:6px 12px; font-size:0.65rem; letter-spacing:1px;">
                    Move To Cart
                </button>
            `;
        }

        const row = document.createElement('div');
        row.className = "cart-item-row";
        row.innerHTML = `
            <img src="${item.image}" alt="${item.title}" style="opacity: ${isSoldOut ? '0.5' : '1'};">
            <div style="flex-grow:1; opacity: ${isSoldOut ? '0.7' : '1'};">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price" style="margin-bottom:8px;">${formatCurrency(item.price)}</p>
                ${actionButtonHTML}
            </div>
            <i class="fas fa-trash" onclick="toggleWishlistEngine(null, ${item.id}, null)" style="cursor:pointer; color:var(--text-muted); font-size:0.95rem; position:absolute; right:20px; top:50%; transform:translateY(-50%);"></i>
        `;
        wishlistItemsList.appendChild(row);
    });
}

function applyStrictIndianPhoneValidationRules(inputElementId) {
    const phoneInputField = document.getElementById(inputElementId);
    if (!phoneInputField) return;

    phoneInputField.addEventListener('input', function(e) {
        let numericString = this.value.replace(/[^0-9]/g, ''); 
        if (numericString.length > 10) {
            numericString = numericString.slice(0, 10); 
        }
        this.value = numericString;
    });
}

function mountCouponHelperBadges() {
    const helpersGroup = document.getElementById('couponHelpersGroup');
    if (!helpersGroup) return;
    
    helpersGroup.innerHTML = "";
    Object.keys(couponRegistry).forEach(code => {
        const badge = document.createElement('span');
        badge.className = "coupon-tag-badge";
        badge.innerHTML = `<i class="fas fa-tag"></i> ${code}`;
        badge.addEventListener('click', () => {
            const inputField = document.getElementById('couponInput');
            if (inputField) {
                inputField.value = code;
                applyCouponEngineAction();
            }
        });
        helpersGroup.appendChild(badge);
    });
}

function applyCouponEngineAction() {
    const inputField = document.getElementById('couponInput');
    const statusMsg = document.getElementById('couponStatusMessage');
    if (!inputField || !statusMsg) return;

    const inputtedCode = inputField.value.toUpperCase().trim();
    
    if (couponRegistry[inputtedCode]) {
        activeDiscount = {
            code: inputtedCode,
            type: couponRegistry[inputtedCode].type,
            value: couponRegistry[inputtedCode].value
        };
        statusMsg.style.display = "block";
        statusMsg.style.color = "#25d366";
        statusMsg.innerText = `Coupon code ${inputtedCode} successfully applied!`;
        updateCartUI();
    } else {
        statusMsg.style.display = "block";
        statusMsg.style.color = "#ff4444";
        statusMsg.innerText = "Invalid luxury promotional key code.";
    }
}

function triggerCartNotification(title) {
    const toast = document.createElement('div');
    toast.className = "copied-toast";
    toast.innerHTML = `<i class="fas fa-check-circle"></i> Added ${title} to selection`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 2400);
}

function openQuickViewShield(id) {
    const product = productDatabase.find(p => p.id === id);
    if (!product) return;

    const modalShield = document.getElementById('quickviewModalShield');
    if (!modalShield) return;

    document.getElementById('qvImage').src = product.image;
    document.getElementById('qvTitle').innerText = product.title;
    document.getElementById('qvCategory').innerText = product.category.toUpperCase();
    
    const priceContainer = document.getElementById('qvPrice');
    if (priceContainer) {
        if (product.originalPrice && product.originalPrice > product.price) {
            priceContainer.innerHTML = `
                <span style="color: var(--purple-primary); margin-right: 12px;">${formatCurrency(product.price)}</span>
                <span style="color: var(--text-muted); font-size: 0.95rem; text-decoration: line-through; font-weight: 400;">${formatCurrency(product.originalPrice)}</span>
            `;
        } else {
            priceContainer.innerText = formatCurrency(product.price);
        }
    }
    
    const isSoldOut = product.badge && product.badge.toLowerCase() === 'sold out';
    const qvBtn = document.getElementById('qvAddToCartBtn');
    
    if (qvBtn) {
        if (isSoldOut) {
            qvBtn.innerText = "Restocking Soon";
            qvBtn.disabled = true;
            qvBtn.onclick = null;
        } else {
            qvBtn.innerText = "Add To Cart";
            qvBtn.disabled = false;
            qvBtn.onclick = () => {
                addToCartEngine(product.id);
                closeQuickViewShield();
                triggerCartNotification(product.title);
            };
        }
    }
    modalShield.style.display = "flex";
}

function closeQuickViewShield() {
    const modalShield = document.getElementById('quickviewModalShield');
    if (modalShield) modalShield.style.display = "none";
}

function toggleCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (!drawer) return;
    
    if (drawer.style.right === "0px") {
        drawer.style.right = "-100%";
        if (overlay) overlay.style.display = "none";
    } else {
        // Enforce closing the opposite layout sheet first to avoid layering locks
        const wishlist = document.getElementById('wishlistDrawer');
        if (wishlist) wishlist.style.right = "-100%";
        
        drawer.style.right = "0px";
        if (overlay) overlay.style.display = "block";
    }
}

function toggleWishlistDrawer() {
    const drawer = document.getElementById('wishlistDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (!drawer) return;
    
    if (drawer.style.right === "0px") {
        drawer.style.right = "-100%";
        if (overlay) overlay.style.display = "none";
    } else {
        const cart = document.getElementById('cartDrawer');
        if (cart) cart.style.right = "-100%";
        
        drawer.style.right = "0px";
        if (overlay) overlay.style.display = "block";
    }
}

window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const catalogControls = document.querySelector('.catalog-controls');
    const storySection = document.getElementById('story');
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    if (window.scrollY > 50) {
        if (header) header.classList.add('scrolled');
    } else {
        if (header) header.classList.remove('scrolled');
    }
    
    if (backToTopBtn) {
        if (window.scrollY > 400) backToTopBtn.classList.add('visible');
        else backToTopBtn.classList.remove('visible');
    }
    
    if (catalogControls && storySection) {
        const storyTop = storySection.getBoundingClientRect().top + window.scrollY;
        const readingZoneThreshold = storyTop - 240; 
        
        if (window.scrollY >= readingZoneThreshold) {
            catalogControls.style.opacity = '0';
            catalogControls.style.pointerEvents = 'none';
            catalogControls.style.transform = 'translateY(-10px)';
        } else {
            catalogControls.style.opacity = '1';
            catalogControls.style.pointerEvents = 'all';
            catalogControls.style.transform = 'translateY(0)';
        }
    }
});

window.addEventListener('DOMContentLoaded', () => {
    loadProductDatabaseEngine();
    mountCouponHelperBadges();
    applyStrictIndianPhoneValidationRules('invClientPhone');
    applyStrictIndianPhoneValidationRules('trackingPhoneInput');
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', filterCatalog);
    
    const hideSoldOutCheckbox = document.getElementById('hideSoldOutCheckbox');
    if (hideSoldOutCheckbox) hideSoldOutCheckbox.addEventListener('change', filterCatalog);
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterCatalog();
        });
    });

    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const wishlistBtn = document.getElementById('wishlistBtn');
    const closeWishlistBtn = document.getElementById('closeWishlistBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (cartBtn) cartBtn.addEventListener('click', toggleCartDrawer);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCartDrawer);
    if (wishlistBtn) wishlistBtn.addEventListener('click', toggleWishlistDrawer);
    if (closeWishlistBtn) closeWishlistBtn.addEventListener('click', toggleWishlistDrawer);
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            const cartDrawer = document.getElementById('cartDrawer');
            const wishlistDrawer = document.getElementById('wishlistDrawer');
            if (cartDrawer) cartDrawer.style.right = "-100%";
            if (wishlistDrawer) wishlistDrawer.style.right = "-100%";
            cartOverlay.style.display = "none";
        });
    }

    const applyCouponBtn = document.getElementById('applyCouponBtn');
    if (applyCouponBtn) applyCouponBtn.addEventListener('click', applyCouponEngineAction);

    const giftCheckbox = document.getElementById('giftCheckbox');
    if (giftCheckbox) {
        giftCheckbox.addEventListener('change', function() {
            const wrapper = document.getElementById('giftMessageWrapper');
            if (wrapper) wrapper.style.display = this.checked ? "block" : "none";
        });
    }

    const catalogJumpLinks = document.querySelectorAll('.nav-link-catalog');
    catalogJumpLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = document.getElementById('productGrid');
            if (targetSection) {
                const offsetPosition = targetSection.getBoundingClientRect().top + window.scrollY - 220;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    const clientNameInput = document.getElementById('invClientName');
    if (clientNameInput) {
        clientNameInput.addEventListener('input', () => {
            const err = document.getElementById('invNameValidationError');
            if (err) { err.style.display = "none"; err.innerText = ""; }
        });
    }

    const clientPhoneInput = document.getElementById('invClientPhone');
    if (clientPhoneInput) {
        clientPhoneInput.addEventListener('input', () => {
            const err = document.getElementById('invPhoneValidationError');
            if (err) { err.style.display = "none"; err.innerText = ""; }
        });
    }

    const clientAddressInput = document.getElementById('invClientAddress');
    if (clientAddressInput) {
        clientAddressInput.addEventListener('input', () => {
            const err = document.getElementById('invAddressValidationError');
            if (err) { err.style.display = "none"; err.innerText = ""; }
        });
    }

    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => { preloader.style.opacity = '0'; setTimeout(() => { preloader.remove(); }, 600); }, 400);
    }
});

let globalPayableAmountInPaise = 0; 

function openInvoiceScreen() {
    if (shoppingCart.length === 0) return;

    const invoiceOverlay = document.getElementById('invoiceOverlayScreen');
    const itemsContainer = document.getElementById('invoiceItemsContainer');
    const pricingSummary = document.getElementById('invoicePricingSummary');

    if (!invoiceOverlay || !itemsContainer || !pricingSummary) return;

    document.getElementById('invClientAddress').value = localStorage.getItem('angel_customer_address') || "";
    document.getElementById('invClientName').value = localStorage.getItem('angel_customer_name') || "";
    document.getElementById('invClientPhone').value = localStorage.getItem('angel_customer_phone') || "";

    itemsContainer.innerHTML = shoppingCart.map(item => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding-bottom:10px; border-bottom:1px solid #e8e8ef;">
            <div style="display:flex; align-items:center; gap:15px; text-align:left;">
                <img src="${item.image}" style="width:45px; height:45px; object-fit:cover; border-radius:4px; border:1px solid #e8e8ef;">
                <div>
                    <h4 style="margin:0; font-size:0.9rem; font-weight:600; color:var(--text-dark-primary);">${item.title}</h4>
                    <p style="margin:2px 0 0 0; font-size:0.75rem; color:var(--text-muted); font-weight:500;">Category: ${item.category} • Qty: ${item.quantity}</p>
                </div>
            </div>
            <span style="font-weight:600; font-size:0.9rem; color:var(--purple-primary);">${formatCurrency(item.price * item.quantity)}</span>
        </div>
    `).join('');

    let grandSubtotal = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discountAmount = 0;
    if (activeDiscount.code) {
        if (activeDiscount.type === "percentage") discountAmount = (grandSubtotal * activeDiscount.value) / 100;
        else if (activeDiscount.type === "flat") discountAmount = activeDiscount.value;
    }
    let finalPayableTotal = grandSubtotal - discountAmount;
    globalPayableAmountInPaise = finalPayableTotal * 100;

    pricingSummary.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-weight:500; color:var(--text-muted);">
            <span>Bag Subtotal:</span><span style="color:var(--text-dark-primary); font-weight:600;">${formatCurrency(grandSubtotal)}</span>
        </div>
        ${discountAmount > 0 ? `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; color:#25d366; font-weight:600;">
            <span>Coupon Promo (${activeDiscount.code}):</span><span>-${formatCurrency(discountAmount)}</span>
        </div>` : ''}
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; color:var(--text-muted); font-weight:500;">
            <span>Insured Vault Delivery:</span><span style="color:#25d366; font-weight:600;">FREE</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:1.1rem; font-weight:700; border-top:2px solid var(--purple-primary); padding-top:12px; margin-top:10px; color:var(--purple-primary);">
            <span>Total Gross Bill:</span><span>${formatCurrency(finalPayableTotal)}</span>
        </div>
    `;

    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.style.right = "-100%";
    if (overlay) overlay.style.display = "none";
    
    invoiceOverlay.style.display = 'flex';
}

function closeInvoiceScreen() {
    document.getElementById('invoiceOverlayScreen').style.display = 'none';
}

function initiateRazorpayPaymentProcess(event) {
    event.preventDefault();

    const name = document.getElementById('invClientName').value.trim();
    const phone = document.getElementById('invClientPhone').value.trim();
    const address = document.getElementById('invClientAddress').value.trim();
    
    const nameErrorElement = document.getElementById('invNameValidationError');
    const phoneErrorElement = document.getElementById('invPhoneValidationError');
    const addressErrorElement = document.getElementById('invAddressValidationError');

    let isFormSubmissionValid = true;

    if (nameErrorElement) { nameErrorElement.innerText = ""; nameErrorElement.style.display = "none"; }
    if (phoneErrorElement) { phoneErrorElement.innerText = ""; phoneErrorElement.style.display = "none"; }
    if (addressErrorElement) { addressErrorElement.innerText = ""; addressErrorElement.style.display = "none"; }

    if (!name) {
        if (nameErrorElement) {
            nameErrorElement.innerText = "Please enter Full Name.";
            nameErrorElement.style.display = "block";
        }
        if (isFormSubmissionValid) { document.getElementById('invClientName').focus(); }
        isFormSubmissionValid = false;
    }

    if (!phone) {
        if (phoneErrorElement) {
            phoneErrorElement.innerText = "Please enter 10-digit contact number. \n (For Ex: 9999988888)";
            phoneErrorElement.style.display = "block";
        }
        if (isFormSubmissionValid) { document.getElementById('invClientPhone').focus(); }
        isFormSubmissionValid = false;
    } else if (phone.length !== 10) {
        if (phoneErrorElement) {
            phoneErrorElement.innerText = "Please input a precise 10-digit mobile contact number.";
            phoneErrorElement.style.display = "block";
        }
        if (isFormSubmissionValid) { document.getElementById('invClientPhone').focus(); }
        isFormSubmissionValid = false;
    }

    if (!address) {
        if (addressErrorElement) {
            addressErrorElement.innerText = "Please enter valid shipping address.";
            addressErrorElement.style.display = "block";
        }
        if (isFormSubmissionValid) { document.getElementById('invClientAddress').focus(); }
        isFormSubmissionValid = false;
    }

    if (!isFormSubmissionValid) return;

    localStorage.setItem('angel_customer_name', name);
    localStorage.setItem('angel_customer_phone', phone);
    localStorage.setItem('angel_customer_address', address);

    const paymentOptions = {
        "key": "rzp_test_StZ7M1D8qRHUIN", 
        "amount": globalPayableAmountInPaise, 
        "currency": "INR",
        "name": "Angel Jewellery",
        "description": "Premium High-Fashion Order Settlement",
        "image": "angel-logo.png", 
        "handler": function (transactionResponse) {
            executePostPaidWhatsAppDispatch(transactionResponse.razorpay_payment_id, name, phone, address);
        },
        "prefill": {
            "name": name,
            "contact": phone
        },
        "theme": {
            "color": "#202c55" 
        }
    };

    const razorpayUiEngineInstance = new Razorpay(paymentOptions);
    razorpayUiEngineInstance.open();
}

function executePostPaidWhatsAppDispatch(paymentId, name, phone, address) {
    const confirmationScreen = document.getElementById('confirmationPageScreen');
    const confItemsManifest = document.getElementById('confItemsManifest');
    
    document.getElementById('confPaymentId').innerText = paymentId;
    document.getElementById('confClientMeta').innerText = `${name} (${phone})`;
    document.getElementById('confClientAddress').innerText = address;
    document.getElementById('confOrderDate').innerText = new Date().toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    confItemsManifest.innerHTML = shoppingCart.map(item => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; font-size:0.9rem; border-bottom:1px dashed #e8e8ef; padding-bottom:6px;">
            <span style="color:var(--text-dark-primary); font-weight:500;">${item.title} <small style="color:var(--text-muted); font-weight:600;">x${item.quantity}</small></span>
            <span style="font-weight:600; color:var(--purple-primary);">${formatCurrency(item.price * item.quantity)}</span>
        </div>
    `).join('');

    let subtotalValue = 0;
    let messageText = `✨ *ANGEL JEWELLERY — PAID ORDER MANIFEST* ✨\n\n`;
    messageText += `💳 *Payment ID:* \`${paymentId}\` (Verified via Razorpay)\n`;
    messageText += `🟢 *Status:* TRANSACTION SUCCESSFUL\n\n`;
    messageText += `👤 *Client:* ${name} (${phone})\n`;
    
    shoppingCart.forEach((item, index) => {
        const rowCost = item.price * item.quantity;
        subtotalValue += rowCost;
        messageText += `${index + 1}. *${item.title}* [x${item.quantity}] — ${formatCurrency(rowCost)}\n`;
    });
    
    let discountAmt = 0;
    if (activeDiscount.code) {
        if (activeDiscount.type === "percentage") discountAmt = (subtotalValue * activeDiscount.value) / 100;
        else if (activeDiscount.type === "flat") discountAmt = activeDiscount.value;
    }
    const finalTotalCost = subtotalValue - discountAmt;
    
    document.getElementById('confFinalTotal').innerText = formatCurrency(finalTotalCost);

    messageText += `\n💰 *Total Paid:* ${formatCurrency(finalTotalCost)}\n`;
    messageText += `📍 *Delivery Address:* \n${address}\n\n`;
    messageText += `💬 _Payment token validated. Please share to generate courier delivery slip profiles._`;

    const generatedLink = `https://wa.me/919985044066?text=${encodeURIComponent(messageText)}`;
    
    document.getElementById('confWhatsAppBtn').onclick = () => {
        window.open(generatedLink, '_blank');
    };
    
    fetch("https://sheetdb.io/api/v1/0lvmtng1nhhhi", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            data: [
                {
                    "Payment ID": paymentId,
                    "Date": new Date().toLocaleString('en-IN'),
                    "Client Name": name,
                    "Phone": phone,
                    "Address": address,
                    "Order Items": shoppingCart.map(i => `${i.title} (x${i.quantity})`).join(", "),
                    "Total Paid": formatCurrency(finalTotalCost),
                    "Status": "Paid"
                }
            ]
        })
    })
    .then(response => response.json())
    .catch(err => console.error("SheetDB network stream drop:", err));
    
    shoppingCart = [];
    activeDiscount = { code: "", type: "", value: 0 };
    if (localStorage.getItem('shoppingCart')) localStorage.removeItem('shoppingCart');
    
    if (document.getElementById('couponInput')) document.getElementById('couponInput').value = "";
    if (document.getElementById('customerAddress')) document.getElementById('customerAddress').value = "";
    
    updateCartUI();
    closeInvoiceScreen(); 
    confirmationScreen.style.display = 'flex';
}

function exitConfirmationAndReset() {
    document.getElementById('confirmationPageScreen').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function executeLiveOrderTrackingSearch() {
    const inputField = document.getElementById('trackingPhoneInput');
    const statusMsg = document.getElementById('trackingStatusMessage');
    const resultsContainer = document.getElementById('trackingResultsContainer');
    
    if (!inputField || !statusMsg || !resultsContainer) return;
    
    const plainPhoneNumberInput = inputField.value.trim();
    resultsContainer.innerHTML = ""; 
    
    if (!plainPhoneNumberInput) {
        statusMsg.style.display = "block";
        statusMsg.style.color = "var(--pink-accent)";
        statusMsg.innerText = "Please provide a valid contact registration number.";
        return;
    }
    
    statusMsg.style.display = "block";
    statusMsg.style.color = "var(--purple-primary)";
    statusMsg.innerText = "Searching...";

    const searchApiEndpoint = `https://sheetdb.io/api/v1/0lvmtng1nhhhi/search?Phone=${encodeURIComponent(plainPhoneNumberInput)}`;

    fetch(searchApiEndpoint)
        .then(response => {
            if (!response.ok) throw new Error("Database interface link dropped.");
            return response.json();
        })
        .then(matchingOrdersArray => {
            if (!matchingOrdersArray || matchingOrdersArray.length === 0) {
                statusMsg.style.color = "var(--pink-accent)";
                statusMsg.innerText = "No verified luxury transaction records discovered matching this number.";
                return;
            }

            statusMsg.style.color = "#25d366";
            statusMsg.innerText = `Found ${matchingOrdersArray.length} order(s):`;
            
            resultsContainer.innerHTML = matchingOrdersArray.map(order => {
                // Read row status parameter values safely from your sheet row array values
                const rawSheetStatus = (order['Status'] || '').trim().toLowerCase();
                
                // ➔ TWO-STAGE CHECKPOINT FILTER MATRIX:
                // If it explicitly equals "shipped", lock it in. Otherwise, fall back to "Order Placed".
                let displayStatusText = "Order Placed";
                let badgeBgColor = "rgba(32, 44, 85, 0.08)"; // Elegant corporate navy tint
                let badgeTextColor = "var(--purple-primary)";

                if (rawSheetStatus === 'shipped') {
                    displayStatusText = "Shipped";
                    badgeBgColor = "rgba(255, 20, 147, 0.1)"; // High-fashion vibrant pink accent tint
                    badgeTextColor = "var(--pink-accent)";
                }

                return `
                <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 25px; box-sizing: border-box; width: 100%; position: relative;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px; margin-bottom: 15px; font-size: 0.8rem; color: var(--text-muted); font-weight:600;">
                        <span>Ref ID: <strong style="color: var(--purple-primary); font-family: monospace;">${order['Payment ID']}</strong></span>
                        <span>${order['Date']}</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; background: #ffffff; padding: 12px 16px; border: 1px solid var(--border-subtle); border-radius: 4px;">
                        <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 0.5px;">
                            <i class="fas fa-box-open" style="margin-right: 6px; color: var(--purple-primary);"></i> Order Status
                        </span>
                        <span style="background: ${badgeBgColor}; color: ${badgeTextColor}; font-size: 0.7rem; padding: 6px 14px; border-radius: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.3s ease;">
                            ${displayStatusText}
                        </span>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <h4 style="margin: 0 0 6px 0; font-size: 0.75rem; text-transform: uppercase; color: var(--purple-primary); letter-spacing: 0.5px; font-weight:700;">Masterpieces Secured</h4>
                        <p style="margin: 0; color: #111116; font-size: 0.95rem; font-weight: 500; line-height: 1.5;">${order['Order Items']}</p>
                    </div>
                    <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px; margin-top: 12px; font-size: 0.85rem; color: var(--text-dark-primary); font-weight:500;">
                        <p style="margin: 0 0 4px 0;"><span style="color: var(--text-muted);">Consignee:</span> ${order['Client Name']}</p>
                        <p style="margin: 0;"><span style="color: var(--text-muted);">Destination:</span> ${order['Address']}</p>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top:1px solid var(--border-subtle); padding-top:10px; margin-top: 15px; font-size: 1.1rem; font-weight: 700; color: var(--purple-primary);">
                        <span>Settled Balance:</span>
                        <span>${order['Total Paid']}</span>
                    </div>
                </div>
                `;
            }).join('');
        })
        .catch(err => {
            console.error("Live ledger sync execution drop:", err);
            statusMsg.style.color = "var(--pink-accent)";
            statusMsg.innerText = "Fulfillment system extraction dropped. Please verify network links.";
        });
}

function openTrackingScreenOverlay(event) {
    if (event) event.preventDefault(); 
    
    const navMenu = document.getElementById('navMenu');
    if (navMenu) navMenu.classList.remove('active');

    const trackingOverlay = document.getElementById('trackingScreenOverlay');
    if (trackingOverlay) {
        document.getElementById('trackingPhoneInput').value = "";
        document.getElementById('trackingStatusMessage').style.display = "none";
        document.getElementById('trackingResultsContainer').innerHTML = "";
        trackingOverlay.style.display = 'flex';
    }
}

// Global Validation Enforcer Utility to attach to any input field element
function applyStrictIndianPhoneValidationRules(inputElementId) {
    const phoneInputField = document.getElementById(inputElementId);
    if (!phoneInputField) return;

    // Real-time listener strips non-numeric characters instantly on type
    phoneInputField.addEventListener('input', function(e) {
        let numericString = this.value.replace(/[^0-9]/g, ''); // RegEx drops letters, spaces, and symbols
        if (numericString.length > 10) {
            numericString = numericString.slice(0, 10); // Cuts off any input past the 10th digit
        }
        this.value = numericString;
    });
}

// Initialize validation tracking hooks on launch
window.addEventListener('DOMContentLoaded', () => {
    // Apply validation to both the Checkout Form input and the Tracking overlay input box
    applyStrictIndianPhoneValidationRules('invClientPhone');
    applyStrictIndianPhoneValidationRules('trackingPhoneInput');
});

function closeTrackingScreenOverlay() {
    document.getElementById('trackingScreenOverlay').style.display = 'none';
}

// =========================================================================
// ANGEL JEWELLERY — ADMINISTRATIVE CONSOLE WITH DATA SEGREGATION TABS
// =========================================================================
// =========================================================================
// ANGEL JEWELLERY — SECURE ADMINISTRATIVE AUTHENTICATION ENTRY GATE
// =========================================================================
function openAdminMasterConsole(event) {
    if (event) event.preventDefault();
    
    // ➔ THE GATEKEEPER PHRASE: Set your master operational passkey string here
    const MASTER_ADMIN_SECRET_KEY = "1234"; 

    // Present a clean browser entry validation block
    const inputtedPasskeyAttempt = prompt("🔒 Access Restricted: Enter Administrative Passcode:");

    // Security Fallback: Exit instantly if the user clicks 'Cancel' or leaves it empty
    if (inputtedPasskeyAttempt === null) return;

    // Strict Handshake Validation Check
    if (inputtedPasskeyAttempt.trim() !== MASTER_ADMIN_SECRET_KEY) {
        alert("❌ Security Alert: Invalid administrative credentials provided.");
        return; // Halt system compilation immediately
    }

    // ➔ KEY VALIDATION SUCCESSFUL: Run your native spreadsheet database extraction loops
    const adminOverlay = document.getElementById('adminMasterConsoleOverlay');
    const statusMsg = document.getElementById('adminConsoleStatus');
    const ordersContainer = document.getElementById('adminMasterOrdersContainer');
    
    if (!adminOverlay || !statusMsg || !ordersContainer) return;
    
    ordersContainer.innerHTML = ""; 
    statusMsg.innerText = "Fetching all orders...";
    adminOverlay.style.display = 'flex';

    fetch("https://sheetdb.io/api/v1/0lvmtng1nhhhi")
        .then(response => {
            if (!response.ok) throw new Error("Administrative link connection dropout.");
            return response.json();
        })
        .then(allOrdersArray => {
            adminOrdersCache = allOrdersArray || [];
            renderSegregatedAdminOrders();
        })
        .catch(err => {
            console.error("Admin dashboard runtime drop:", err);
            statusMsg.innerText = "Critical security handshake breakdown. Unable to authenticate spreadsheet rows.";
        });
}
// ➔ NEW INTERFACE CONTROLLER: Route tab button toggles smoothly
function switchAdminConsoleTab(targetTabKey) {
    currentAdminActiveTab = targetTabKey;
    
    const pendingBtn = document.getElementById('adminTabPendingBtn');
    const shippedBtn = document.getElementById('adminTabShippedBtn');
    
    if (targetTabKey === 'pending') {
        pendingBtn.style.cssText = "background: var(--purple-primary); color: #ffffff; border: 1px solid var(--purple-primary); padding: 10px 20px; font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; border-radius: 4px; cursor: pointer;";
        shippedBtn.style.cssText = "background: #f9f9fb; color: var(--text-muted); border: 1px solid #e8e8ef; padding: 10px 20px; font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; border-radius: 4px; cursor: pointer;";
    } else {
        shippedBtn.style.cssText = "background: var(--purple-primary); color: #ffffff; border: 1px solid var(--purple-primary); padding: 10px 20px; font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; border-radius: 4px; cursor: pointer;";
        pendingBtn.style.cssText = "background: #f9f9fb; color: var(--text-muted); border: 1px solid #e8e8ef; padding: 10px 20px; font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; border-radius: 4px; cursor: pointer;";
    }
    
    renderSegregatedAdminOrders();
}

// ➔ NEW ENGINE CORE: Separates data rows and builds cards dynamically
function renderSegregatedAdminOrders() {
    const statusMsg = document.getElementById('adminConsoleStatus');
    const ordersContainer = document.getElementById('adminMasterOrdersContainer');
    const pendingCountSpan = document.getElementById('adminPendingCount');
    const shippedCountSpan = document.getElementById('adminShippedCount');

    if (!ordersContainer || !adminOrdersCache) return;

    ordersContainer.innerHTML = "";

    // 1. Separate the dataset pool cleanly based on row values
    const pendingOrdersList = adminOrdersCache.filter(order => (order['Status'] || '').trim().toLowerCase() !== 'shipped');
    const shippedOrdersList = adminOrdersCache.filter(order => (order['Status'] || '').trim().toLowerCase() === 'shipped');

    // 2. Refresh tab counters dynamically
    if (pendingCountSpan) pendingCountSpan.innerText = pendingOrdersList.length;
    if (shippedCountSpan) shippedCountSpan.innerText = shippedOrdersList.length;

    // 3. Determine which list variant is currently being displayed
    const targetDisplayDataset = (currentAdminActiveTab === 'pending') ? pendingOrdersList : shippedOrdersList;

    if (statusMsg) {
        statusMsg.innerHTML = `Viewing <span style="color:var(--pink-accent); font-weight:700; text-transform:uppercase;">${currentAdminActiveTab}</span> stack. Total rows matched: <strong>${targetDisplayDataset.length}</strong>`;
    }

    if (targetDisplayDataset.length === 0) {
        ordersContainer.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted); font-size:0.9rem; background:var(--bg-surface); border-radius:4px; border:1px dashed var(--border-subtle)">No transactions recorded under this filter tab checkpoint.</div>`;
        return;
    }

    // 4. Chronologically layout row nodes
    const chronologicallyReversedStack = [...targetDisplayDataset].reverse();

    ordersContainer.innerHTML = chronologicallyReversedStack.map(order => {
        const rawStatus = (order['Status'] || '').trim();
        const isShipped = rawStatus.toLowerCase() === 'shipped';
        
        const displayStatus = isShipped ? "Shipped" : "Order Placed";
        const badgeStyle = isShipped 
            ? "background: rgba(255, 20, 147, 0.1); color: var(--pink-accent);" 
            : "background: rgba(32, 44, 85, 0.08); color: var(--purple-primary);";

        const cleanPhone = order['Phone'].replace(/[^0-9]/g, '');
        const clientMessage = `Hello ${order['Client Name']},\n\nYour Angel Jewellery order (Ref: ${order['Payment ID']}) status has been updated to: *${displayStatus}*! ✨\n\nThank you for choosing luxury.`;
        const whatsappUpdateLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(clientMessage)}`;

        let shippedActionButtonHTML = "";
        if (!isShipped) {
            shippedActionButtonHTML = `
                <button onclick="updateGoogleSheetRowStatus('${order['Payment ID']}', this)" style="background: var(--purple-primary); color: #ffffff; border: 1px solid var(--purple-primary); padding: 6px 12px; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s ease;">
                    <i class="fas fa-shipping-fast"></i> Mark Shipped
                </button>
            `;
        }

        return `
        <div style="background: #ffffff; border: 1px solid var(--border-subtle); border-radius: 6px; padding: 20px; box-sizing: border-box; width: 100%; display: flex; flex-wrap: wrap; gap: 15px; justify-content: space-between; align-items: flex-start; text-align:left; box-shadow: 0 4px 12px rgba(0,0,0,0.01);">
            <div style="flex: 1; min-width: 250px;">
                <span style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; display:block; margin-bottom:4px; font-family:monospace; font-weight:600;">Ref: ${order['Payment ID']}</span>
                <h4 style="margin: 0 0 8px 0; font-size: 1.1rem; font-weight: 600; color: var(--purple-primary);">${order['Client Name']}</h4>
                <p style="margin: 0 0 4px 0; font-size: 0.88rem; color: #111116; font-weight:500;"><strong style="color:var(--pink-accent);">Items:</strong> ${order['Order Items']}</p>
                <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted); font-weight:500;"><strong style="color:var(--text-dark-primary);">Ship To:</strong> ${order['Address']}</p>
            </div>
            
            <div style="text-align: right; min-width: 170px; display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                <span style="font-size: 0.75rem; color: var(--text-muted); display:block; font-weight:600;">${order['Date']}</span>
                <span style="font-size: 1.2rem; font-weight: 700; color: var(--purple-primary); display:block;">${order['Total Paid']}</span>
                
                <span id="badge-status-${order['Payment ID']}" style="${badgeStyle} font-size: 0.65rem; padding: 4px 10px; border-radius: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block;">
                    ${displayStatus}
                </span>

                <div style="display: flex; gap: 6px; margin-top: 4px; align-items: center;">
                    <div id="shipped-action-slot-${order['Payment ID']}">${shippedActionButtonHTML}</div>
                    <a href="${whatsappUpdateLink}" target="_blank" style="background: #ffffff; color: #25d366; border: 1px solid #25d366; padding: 6px 10px; font-size: 0.65rem; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; border-radius: 4px; display:inline-flex; align-items:center; gap:4px;" title="Send Status Alert via WhatsApp">
                        <i class="fab fa-whatsapp"></i> Update Alert
                    </a>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

function closeAdminMasterConsole() {
    document.getElementById('adminMasterConsoleOverlay').style.display = 'none';
}

// =========================================================================
// ANGEL JEWELLERY — BANNER CAROUSEL GLOBAL REACTION CORES (FIXED)
// =========================================================================
let currentCarouselActiveIndex = 0;
let carouselAutoRotationTimerHandle = null;
let isCarouselAutoPlayPaused = false;

function initializeLuxuryBannerCarousel() {
    const headerElement = document.getElementById('header');
    const track = document.getElementById('carouselSliderTrack');
    if (headerElement && track) {
        const headerHeight = headerElement.offsetHeight;
        track.parentElement.parentElement.style.marginTop = `${headerHeight}px`;
    }

    const indicatorsDock = document.getElementById('carouselIndicatorsDock');
    if (!track || !indicatorsDock) return;

    const slidesCount = track.children.length;
    if (slidesCount === 0) return;

    indicatorsDock.innerHTML = "";
    for (let i = 0; i < slidesCount; i++) {
        const indicatorDot = document.createElement('div');
        indicatorDot.style.cssText = `width: 8px; height: 8px; border-radius: 50%; background: ${i === 0 ? 'var(--purple-primary)' : '#e8e8ef'}; cursor: pointer; transition: background 0.3s;`;
        indicatorDot.onclick = () => jumpToSpecificCarouselSlide(i);
        indicatorsDock.appendChild(indicatorDot);
    }
    startCarouselAutoPlayCycle(slidesCount);
}

function toggleCarouselAutoPlayEngine() {
    const track = document.getElementById('carouselSliderTrack');
    const pauseIcon = document.getElementById('carouselPauseIcon');
    const buttonWrapper = document.getElementById('carouselPauseToggleBtn');
    
    if (!track) return;
    const slidesCount = track.children.length;

    if (isCarouselAutoPlayPaused) {
        isCarouselAutoPlayPaused = false;
        if (pauseIcon) pauseIcon.className = "fas fa-pause";
        if (buttonWrapper) buttonWrapper.title = "Pause Slideshow";
        startCarouselAutoPlayCycle(slidesCount);
    } else {
        isCarouselAutoPlayPaused = true;
        if (pauseIcon) pauseIcon.className = "fas fa-play";
        if (buttonWrapper) buttonWrapper.title = "Play Slideshow";
        if (carouselAutoRotationTimerHandle) clearInterval(carouselAutoRotationTimerHandle);
    }
}

function startCarouselAutoPlayCycle(totalSlidesCount) {
    if (carouselAutoRotationTimerHandle) clearInterval(carouselAutoRotationTimerHandle);
    if (isCarouselAutoPlayPaused) return;

    carouselAutoRotationTimerHandle = setInterval(() => {
        currentCarouselActiveIndex = (currentCarouselActiveIndex + 1) % totalSlidesCount;
        updateCarouselRenderPosition();
    }, 5000);
}

function shiftCarouselSlideDirection(directionStep) {
    const track = document.getElementById('carouselSliderTrack');
    if (!track) return;
    
    const totalSlides = track.children.length;
    currentCarouselActiveIndex += directionStep;
    
    if (currentCarouselActiveIndex >= totalSlides) currentCarouselActiveIndex = 0;
    if (currentCarouselActiveIndex < 0) currentCarouselActiveIndex = totalSlides - 1;

    updateCarouselRenderPosition();
    startCarouselAutoPlayCycle(totalSlides);
}

function jumpToSpecificCarouselSlide(targetIndex) {
    currentCarouselActiveIndex = targetIndex;
    updateCarouselRenderPosition();
    
    const track = document.getElementById('carouselSliderTrack');
    if (track) startCarouselAutoPlayCycle(track.children.length);
}

function updateCarouselRenderPosition() {
    const track = document.getElementById('carouselSliderTrack');
    const indicatorsDock = document.getElementById('carouselIndicatorsDock');
    if (!track || !indicatorsDock) return;

    track.style.transform = `translateX(-${currentCarouselActiveIndex * 100}%)`;
    Array.from(indicatorsDock.children).forEach((dot, index) => {
        dot.style.background = index === currentCarouselActiveIndex ? 'var(--purple-primary)' : '#e8e8ef';
    });
}
document.addEventListener("DOMContentLoaded", () => {
    initializeLuxuryBannerCarousel();
});

function renderVaultSaleSection() {
    const saleSection = document.getElementById('saleSection');
    const saleGrid = document.getElementById('saleProductGrid');
    
    if (!saleSection || !saleGrid) return;

    const saleItems = productDatabase.filter(product => product.originalPrice && product.originalPrice > product.price);
    if (saleItems.length === 0) {
        saleSection.style.display = 'none';
        return;
    }

    saleSection.style.display = 'block';
    saleGrid.innerHTML = "";

    saleItems.forEach(product => {
        const isSoldOut = product.badge && product.badge.toLowerCase() === 'sold out';
        const isFavorited = wishlistMemory.includes(product.id);
        
        const saleCard = document.createElement('div');
        saleCard.className = `product-card ${isSoldOut ? 'disabled-card' : ''}`;
        
        let badgeHTML = product.badge ? `<span class="product-badge urgency-alert" style="background: var(--pink-accent) !important;">${product.badge}</span>` : '';

        const pricingLayoutHTML = `
            <p class="product-price" style="display: flex; align-items: center; gap: 10px; margin: 0; justify-content:center;">
                <span style="color: var(--purple-primary); font-weight: 700;">${formatCurrency(product.price)}</span>
                <span style="color: var(--text-muted); font-size: 0.85rem; text-decoration: line-through; font-weight: 500;">${formatCurrency(product.originalPrice)}</span>
            </p>
        `;

        saleCard.innerHTML = `
            <div class="product-img-wrapper" style="background: #ffffff;">
                ${badgeHTML}
                <button class="wishlist-heart-btn ${isFavorited ? 'active' : ''}" onclick="toggleWishlistEngine(event, ${product.id}, this)" aria-label="Add to wishlist">
                    <i class="${isFavorited ? 'fas' : 'far'} fa-heart"></i>
                </button>
                <img src="${product.image}" loading="lazy" alt="${product.title}" onload="this.classList.add('loaded')">
                <div class="product-actions-overlay">
                    <button class="btn-mini-action" onclick="openQuickViewShield(${product.id})"><i class="fas fa-eye"></i> Quick View</button>
                </div>
            </div>
            <div class="product-info" style="background: #ffffff;">
                <p class="product-category" style="color: var(--pink-accent); font-weight:600;">${product.category} • Special Offer</p>
                <h3 class="product-title">${product.title}</h3>
                ${pricingLayoutHTML}
                <button class="btn-order-wa" onclick="${isSoldOut ? '' : `addToCartEngine(${product.id}); triggerCartNotification('${product.title}');`}" ${isSoldOut ? 'disabled' : ''} style="margin-top:15px; background: #ffffff;">
                    <i class="${isSoldOut ? 'fas fa-hourglass-start' : ''}"></i> ${isSoldOut ? 'Restocking Soon' : 'Add To Cart'}
                </button>
            </div>
        `;
        saleGrid.appendChild(saleCard);
    });
}

function renderTrendingSection() {
    const trendingSection = document.getElementById('trendingSection');
    const trendingGrid = document.getElementById('trendingProductGrid');
    
    if (!trendingSection || !trendingGrid) return;

    const trendingItems = productDatabase.filter(product => 
        (product.badge && product.badge.toLowerCase() === 'trending') || 
        product.trending === true
    );

    if (trendingItems.length === 0) {
        trendingSection.style.display = 'none';
        return;
    }

    trendingSection.style.display = 'block';
    trendingGrid.innerHTML = "";

    trendingItems.forEach(product => {
        const isSoldOut = product.badge && product.badge.toLowerCase() === 'sold out';
        const isFavorited = wishlistMemory.includes(product.id);
        
        const trendingCard = document.createElement('div');
        trendingCard.className = `product-card ${isSoldOut ? 'disabled-card' : ''}`;
        
        let badgeHTML = product.badge ? `<span class="product-badge urgency-alert" style="background: var(--pink-accent) !important;">${product.badge}</span>` : '';
        let pricingLayoutHTML = "";
        
        if (product.originalPrice && product.originalPrice > product.price) {
            pricingLayoutHTML = `
                <p class="product-price" style="display: flex; align-items: center; gap: 10px; margin: 0; justify-content:center;">
                    <span style="color: var(--purple-primary); font-weight: 700;">${formatCurrency(product.price)}</span>
                    <span style="color: var(--text-muted); font-size: 0.85rem; text-decoration: line-through; font-weight: 500;">${formatCurrency(product.originalPrice)}</span>
                </p>
            `;
        } else {
            pricingLayoutHTML = `<p class="product-price" style="margin: 0;">${formatCurrency(product.price)}</p>`;
        }

        trendingCard.innerHTML = `
            <div class="product-img-wrapper" style="background: #ffffff;">
                ${badgeHTML}
                <button class="wishlist-heart-btn ${isFavorited ? 'active' : ''}" onclick="toggleWishlistEngine(event, ${product.id}, this)" aria-label="Add to wishlist">
                    <i class="${isFavorited ? 'fas' : 'far'} fa-heart"></i>
                </button>
                <img src="${product.image}" loading="lazy" alt="${product.title}" onload="this.classList.add('loaded')">
                <div class="product-actions-overlay">
                    <button class="btn-mini-action" onclick="openQuickViewShield(${product.id})"><i class="fas fa-eye"></i> Quick View</button>
                </div>
            </div>
            <div class="product-info" style="background: #ffffff;">
                <p class="product-category">${product.category}</p>
                <h3 class="product-title">${product.title}</h3>
                ${pricingLayoutHTML}
                <button class="btn-order-wa" onclick="${isSoldOut ? '' : `addToCartEngine(${product.id}); triggerCartNotification('${product.title}');`}" ${isSoldOut ? 'disabled' : ''} style="margin-top:15px; background: #ffffff;">
                    <i class="${isSoldOut ? 'fas fa-hourglass-start' : ''}"></i> ${isSoldOut ? 'Restocking Soon' : 'Add To Cart'}
                </button>
            </div>
        `;
        trendingGrid.appendChild(trendingCard);
    });
}

// =========================================================================
// ANGEL JEWELLERY — AUTOMATIC MOBILE NAVIGATION DESK CLOSURE ENGINE
// =========================================================================
(function() {
    function forceMobileMenuClose() {
        const mobileNavMenu = document.getElementById('navMenu');
        const menuToggleButton = document.getElementById('menuToggle');
        
        if (mobileNavMenu) {
            mobileNavMenu.classList.remove('active');
        }
        if (menuToggleButton) {
            const toggleIcon = menuToggleButton.querySelector('i');
            if (toggleIcon) toggleIcon.className = "fas fa-bars"; 
        }
    }

    window.addEventListener('DOMContentLoaded', () => {
        const allNavLinks = document.querySelectorAll('#navMenu a, [href^="#"]');
        allNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(forceMobileMenuClose, 150);
            });
        });
    });
})();

// =========================================================================
// ANGEL JEWELLERY — BACKGROUND CLOUD REALTIME GOOGLE SHEET STATUS UPDATER
// =========================================================================
function updateGoogleSheetRowStatus(paymentId, buttonElement) {
    if (!paymentId || !buttonElement) return;

    // Change button text visually to provide processing feedback
    buttonElement.disabled = true;
    buttonElement.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Syncing...`;

    // Target the precise row using its unique Razorpay Payment ID column parameter value match
    const sheetDbUpdateEndpoint = `https://sheetdb.io/api/v1/0lvmtng1nhhhi/Payment%20ID/${encodeURIComponent(paymentId)}`;

    fetch(sheetDbUpdateEndpoint, {
        method: 'PATCH', // Using PATCH to update only the designated Status cell box
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: {
                "Status": "Shipped" // Forces the spreadsheet cell box target value update
            }
        })
    })
    .then(response => response.json())
    .then(payloadResult => {
        if (payloadResult && payloadResult.updated >= 1) {
            console.log(`Sheet ledger successfully synchronized for ID: ${paymentId}`);

            // 1. Instantly transition the console badge UI layer from blue to pink
            const cachedOrderObjectIndex = adminOrdersCache.findIndex(o => o['Payment ID'] === paymentId);
            if (cachedOrderObjectIndex > -1) {
                adminOrdersCache[cachedOrderObjectIndex]['Status'] = 'Shipped';
            }
            setTimeout(renderSegregatedAdminOrders, 400);

            // 2. Remove the "Mark Shipped" button from view since action task completed
            const buttonSlot = document.getElementById(`shipped-action-slot-${paymentId}`);
            if (buttonSlot) buttonSlot.innerHTML = "";

            // 3. Optional Toast Notification feedback alert trigger
            const dynamicToast = document.createElement('div');
            dynamicToast.className = "copied-toast";
            dynamicToast.innerHTML = `<i class="fas fa-check-circle"></i> Ledger Status Synced!`;
            document.body.appendChild(dynamicToast);
            setTimeout(() => { dynamicToast.remove(); }, 2400);

        } else {
            throw new Error("Spreadsheet validation key row mapping verification reject error.");
        }
    })
    .catch(err => {
        console.error("Critical spreadsheet record edit synchronization error dropped:", err);
        buttonElement.disabled = false;
        buttonElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Retry`;
        alert("Failed to update status on server cloud. Verify network and try again.");
    });
}