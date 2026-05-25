/* =========================================================================
   ANGEL JEWELLERY — COMPLETE MASTER RUNTIME ENGINE APPLICATIVE LOGIC
   ========================================================================= */

// --- GLOBAL APP STATE CONTROL DATA LAYERS ---
let productDatabase = [];    // Populated dynamically via loadProductDatabaseEngine()
let shoppingCart = [];       // Holds active checkout item sets
let wishlistMemory = [];     // Holds favorited product unique IDs
let activeDiscount = { code: "", type: "", value: 0 };

const FREE_SHIPPING_THRESHOLD = 25000; // Free delivery unlocks if purchase passes ₹25,000

// Active coupon registry codes dataset
const couponRegistry = {
    "ANGEL10": { type: "percentage", value: 10 },
    "WELCOME5": { type: "percentage", value: 5 },
    "FESTIVE2000": { type: "flat", value: 2000 },
    "LAUNCH2026": { type: "percentage", value: 15 }
};

// =========================================================================
// 1. ASYNCHRONOUS DATA FETCHING & INITIALIZATION
// =========================================================================
// =========================================================================
// REAL-TIME ASYNCHRONOUS LUXURY CATALOG DATABANK LOADING ENGINE
// =========================================================================
async function loadProductDatabaseEngine() {
    try {
        const targetResponse = await fetch('data/products.json');
        if (!targetResponse.ok) throw new Error('Data stream failed verification handles');
        
        const fileContent = await targetResponse.json();
        
        // SAFE EXTRACTOR: Gracefully unpacks the array list if it's wrapped in Sveltia's object key
        if (fileContent && typeof fileContent === 'object' && Array.isArray(fileContent.products)) {
            productDatabase = fileContent.products;
        } else if (Array.isArray(fileContent)) {
            productDatabase = fileContent;
        } else {
            productDatabase = [];
        }
        
        // Populate the storefront layout grid automatically once data arrives
        filterCatalog();
        //renderVaultSaleSection();
    } catch (error) {
        console.error('Critical catalog database execution drop:', error);
        const grid = document.getElementById('productGrid');
        if (grid) grid.innerHTML = `<div class="no-results">Unable to load catalog matrix at this moment.</div>`;
    }
}

// Helper utility: Currency structural formatter rule
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

// =========================================================================
// 2. PRODUCTS FRONT-STORE GRID ARCHITECTURE RENDERERS
// =========================================================================
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
        
        // Establish visual configuration tags layout fields
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
                    <i class="${isSoldOut ? 'fas fa-hourglass-start' : 'fab fa-whatsapp'}"></i> ${isSoldOut ? 'Restocking Soon' : 'Add To Cart'}
                </button>
            </div>
        `;
        gridContainer.appendChild(designCard);
    });
}

// =========================================================================
// 3. REAL-TIME CATALOG MATRIX FILTERS & STOCK DROPOUT TOGGLES
// =========================================================================
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

    if (typeof renderVaultSaleSection === "function") {
        renderVaultSaleSection();
    }
}

// =========================================================================
// 4. BUSINESS LOGIC CORE ENGINES (CART & INTERFACE UPDATER COUNTERS)
// =========================================================================
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

// --- DYNAMIC CONTINUOUS DRAWERS RENDER ENGINE ---
function updateCartUI() {
    const cartItemsList = document.getElementById('cartItemsList');
    const cartCountBadge = document.getElementById('cartCountBadge');
    const cartTotalQty = document.getElementById('cartTotalQty');
    const cartFooterSection = document.getElementById('cartFooterSection');
    const shippingProgressBox = document.getElementById('shippingProgressBox');
    
    cartItemsList.innerHTML = "";
    let totalItemsCount = 0;
    let grandSubtotal = 0;

    if (shoppingCart.length === 0) {
        cartItemsList.innerHTML = `<div style="text-align:center; color:var(--text-muted); font-size:0.9rem; margin-top:40px; padding-bottom:40px;">Your cart is currently empty.</div>`;
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
    
    // COMFORT 2: DYNAMIC FREE SHIPPING BAR CALCULATOR 
    const progressBarFill = document.getElementById('shippingBarFill');
    const progressText = document.getElementById('shippingProgressText');
    
    if (progressBarFill && progressText) {
        const structuralPercentage = Math.min((grandSubtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
        progressBarFill.style.width = `${structuralPercentage}%`;
        
        if (grandSubtotal >= FREE_SHIPPING_THRESHOLD) {
            progressText.innerHTML = `✨ <span style="color:#25d366; font-weight:600;">Premium Shipping Unlocked!</span> Free Insured Express Courier Delivery`;
        } else {
            const gapAmount = FREE_SHIPPING_THRESHOLD - grandSubtotal;
            progressText.innerHTML = `Add <span style="color:var(--gold-primary); font-weight:600;">${formatCurrency(gapAmount)}</span> more for Free Insured Delivery`;
        }
    }
    
    // CALCULATE DISCOUNTS
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
}

// =========================================================================
// 5. WISHLIST DATA OPERATIONS LOOPS (WITH RE-STOCK ACTIONS HIDES)
// =========================================================================
function toggleWishlistEngine(event, id, targetButton) {
    if (event) event.stopPropagation(); // Stops parent grid card click events from firing

    const matchIndex = wishlistMemory.indexOf(id);
    if (matchIndex > -1) {
        wishlistMemory.splice(matchIndex, 1);
        if (targetButton) targetButton.classList.remove('active');
    } else {
        wishlistMemory.push(id);
        if (targetButton) targetButton.classList.add('active');
    }
    
    // Refresh visual state fields across catalog panels
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
        wishlistItemsList.innerHTML = `<div style="text-align:center; color:var(--text-muted); font-size:0.9rem; margin-top:40px;">Your wishlist is empty.</div>`;
        return;
    }

    wishlistMemory.forEach(id => {
        const item = productDatabase.find(p => p.id === id);
        if (!item) return;

        const isSoldOut = item.badge && item.badge.toLowerCase() === 'sold out';

        let actionButtonHTML = "";
        if (isSoldOut) {
            actionButtonHTML = `
                <button class="btn-luxury" disabled style="padding:4px 10px; font-size:0.65rem; letter-spacing:1px; border-color:rgba(255,255,255,0.05); color:var(--text-muted); cursor:not-allowed; background:rgba(255,255,255,0.01);">
                    <i class="fas fa-hourglass-start"></i> Restocking Soon
                </button>
            `;
        } else {
            actionButtonHTML = `
                <button onclick="addToCartEngine(${item.id}); toggleWishlistDrawer(); triggerCartNotification('${item.title}');" class="btn-luxury" style="padding:4px 10px; font-size:0.65rem; letter-spacing:1px; border-color:rgba(223,186,107,0.2);">
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
            <i class="fas fa-trash" onclick="toggleWishlistEngine(null, ${item.id}, null)" style="cursor:pointer; color:rgba(255,68,68,0.5); font-size:0.85rem; position:absolute; right:5px; top:15px;"></i>
        `;
        wishlistItemsList.appendChild(row);
    });
}

// =========================================================================
// 6. MICRO-COMFORT USER EXPERIENCE COMPONENT PLUGINS
// =========================================================================

// --- COMFORT 1: ADDRESS MEMORY INTERCEPT SYSTEM ---
function initializeAddressMemoryEngine() {
    const addressInput = document.getElementById('customerAddress');
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (!addressInput || !checkoutBtn) return;
    
    const savedAddress = localStorage.getItem('angel_customer_address');
    if (savedAddress) addressInput.value = savedAddress;
    
    checkoutBtn.addEventListener('click', () => {
        const addressText = addressInput.value.trim();
        const addressWarning = document.getElementById('addressWarning');
        
        if (!addressText) {
            if (addressWarning) addressWarning.style.display = "block";
            addressInput.focus();
            return;
        }
        
        if (addressWarning) addressWarning.style.display = "none";
        localStorage.setItem('angel_customer_address', addressText);
        
        // ➔ REDIRECT TO OPEN THE COMPREHENSIVE INVOICE LAYER
        openInvoiceScreen(addressText);
    });
}

// --- COMFORT 3: COUPON HELPER TAG GENERATION LOOP ---
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

// --- WHATSAPP ORDER DISPATCH PROCESSOR ---
// =========================================================================
// PREMIUM ORDER DISPATCH PROCESSOR & CART RECOVERY RESET
// =========================================================================
function executeWhatsAppOrderDispatch(shippingAddress) {
    let messageText = `✨ *ANGEL JEWELLERY — NEW ORDER DISPATCH* ✨\n\n`;
    let subtotalValue = 0;
    
    shoppingCart.forEach((item, index) => {
        const rowCost = item.price * item.quantity;
        subtotalValue += rowCost;
        messageText += `${index + 1}. *${item.title}* [x${item.quantity}] — ${formatCurrency(rowCost)}\n`;
    });
    
    messageText += `\n----------------------------------\n`;
    messageText += `*Gross Subtotal:* ${formatCurrency(subtotalValue)}\n`;
    
    let discountAmt = 0;
    if (activeDiscount.code) {
        if (activeDiscount.type === "percentage") discountAmt = (subtotalValue * activeDiscount.value) / 100;
        else if (activeDiscount.type === "flat") discountAmt = activeDiscount.value;
        messageText += `*Discount Applied (${activeDiscount.code}):* -${formatCurrency(discountAmt)}\n`;
    }
    
    const finalTotalCost = subtotalValue - discountAmt;
    messageText += `*Grand Net Payable:* ${formatCurrency(finalTotalCost)}\n`;
    
    const shippingMethod = finalTotalCost >= FREE_SHIPPING_THRESHOLD ? "Free Insured Express Courier" : "Standard Premium Delivery";
    messageText += `*Shipping Method:* ${shippingMethod}\n`;
    
    // Add dynamic luxury gift note profiles if active
    const giftCheckbox = document.getElementById('giftCheckbox');
    if (giftCheckbox && giftCheckbox.checked) {
        const giftMsg = document.getElementById('giftMessageInput').value.trim();
        messageText += `\n🎁 *Order Setting:* Luxury Gift Wrapping Assigned\n`;
        if (giftMsg) messageText += `📝 *Gift Message Note:* "${giftMsg}"\n`;
    }
    
    messageText += `----------------------------------\n\n`;
    messageText += `📍 *Delivery Shipping Address:* \n${shippingAddress}\n\n`;
    messageText += `💬 _Please click send to verify your order file setup. Our customer care concierge team will reach out immediately._`;

    const generatedLink = `https://wa.me/919985044066?text=${encodeURIComponent(messageText)}`;
    
    // 1. Launch order line on WhatsApp tab cleanly
    window.open(generatedLink, '_blank');
    
    // 2. CLEAR CART STATE DATA IMMEDIATELY AFTER THE HANDOFF
    shoppingCart = [];
    activeDiscount = { code: "", type: "", value: 0 };
    
    // 3. WIPE PERSISTENT STORAGE SESSIONS TRACKING
    if (localStorage.getItem('shoppingCart')) localStorage.removeItem('shoppingCart');
    if (localStorage.getItem('cart')) localStorage.removeItem('cart');
    
    // 4. RESET ALL FORM FIELD INPUT CHANNELS IN THE SIDEBAR
    if (document.getElementById('couponInput')) document.getElementById('couponInput').value = "";
    if (document.getElementById('couponStatusMessage')) document.getElementById('couponStatusMessage').style.display = "none";
    if (document.getElementById('giftCheckbox')) document.getElementById('giftCheckbox').checked = false;
    if (document.getElementById('giftMessageWrapper')) document.getElementById('giftMessageWrapper').style.display = "none";
    if (document.getElementById('giftMessageInput')) document.getElementById('giftMessageInput').value = "";
    if (document.getElementById('customerAddress')) document.getElementById('customerAddress').value = "";
    
    // 5. REFRESH CART UI MANIFEST VISUAL PANELS AND CLOSE DRAWER
    updateCartUI();
    toggleCartDrawer();
}

// =========================================================================
// 7. UTILITY NOTIFICATIONS & DYNAMIC LIGHTBOX OVERLAYS
// =========================================================================
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
                <span style="color: #dfba6b; margin-right: 12px;">${formatCurrency(product.price)}</span>
                <span style="color: #555; font-size: 0.95rem; text-decoration: line-through; font-weight: 400;">${formatCurrency(product.originalPrice)}</span>
             Dino`;
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

// --- VISUAL SLIDE INTERACTION SWITCH CONSOLE ACTIONS ---
function toggleCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (!drawer) return;
    
    if (drawer.style.right === "0px") {
        drawer.style.right = "-100%";
        if (overlay) overlay.style.display = "none";
    } else {
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
        drawer.style.right = "0px";
        if (overlay) overlay.style.display = "block";
    }
}

// =========================================================================
// 8. GLOBAL SCROLL WATCHER & CINEMATIC LAYOUT ADJUSTMENT CONTROLLERS
// =========================================================================
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const catalogControls = document.querySelector('.catalog-controls');
    const storySection = document.getElementById('story');
    const faqSection = document.getElementById('faq');
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    if (window.scrollY > 50) {
        if (header) header.classList.add('scrolled');
    } else {
        if (header) header.classList.remove('scrolled');
    }
    
    // COMFORT 4: Manage dynamic back-to-top layout arrow visibility transitions
    if (backToTopBtn) {
        if (window.scrollY > 400) backToTopBtn.classList.add('visible');
        else backToTopBtn.classList.remove('visible');
    }
    
    // Smoothly push out catalog bar menu fields when browsing footer informational panels
    if (catalogControls && (storySection || faqSection)) {
        const storyTop = storySection ? storySection.getBoundingClientRect().top + window.scrollY : Infinity;
        const faqTop = faqSection ? faqSection.getBoundingClientRect().top + window.scrollY : Infinity;
        const readingZoneThreshold = Math.min(storyTop, faqTop) - 160; 
        
        if (window.scrollY >= readingZoneThreshold) {
            catalogControls.style.opacity = '0';
            catalogControls.style.pointerEvents = 'none';
            catalogControls.style.transform = 'translateY(-20px)';
        } else {
            catalogControls.style.opacity = '1';
            catalogControls.style.pointerEvents = 'all';
            catalogControls.style.transform = 'translateY(0)';
        }
    }
});

// =========================================================================
// 9. ENGINE INITIALIZATION LIFE-CYCLE LIFECYCLE INITIALIZER BINDINGS
// =========================================================================
window.addEventListener('DOMContentLoaded', () => {
    
    // 1. Kick off the asynchronous JSON administrative databank fetch
    loadProductDatabaseEngine();
    
    // 2. Initialize comfort automation systems
    initializeAddressMemoryEngine();
    mountCouponHelperBadges();
    
    // 3. Connect filter action click hooks
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

    // 4. Connect Drawer Toggle Openers
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const wishlistBtn = document.getElementById('wishlistBtn');
    const closeWishlistBtn = document.getElementById('closeWishlistBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartBtn) cartBtn.addEventListener('click', toggleCartDrawer);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCartDrawer);
    if (wishlistBtn) wishlistBtn.addEventListener('click', toggleWishlistDrawer);
    if (closeWishlistBtn) closeWishlistBtn.addEventListener('click', toggleWishlistDrawer);
    if (cartOverlay) cartOverlay.addEventListener('click', () => {
        const cartDrawer = document.getElementById('cartDrawer');
        const wishlistDrawer = document.getElementById('wishlistDrawer');
        if (cartDrawer) cartDrawer.style.right = "-100%";
        if (wishlistDrawer) wishlistDrawer.style.right = "-100%";
        cartOverlay.style.display = "none";
    });

    // 5. Connect Apply Manual Coupon Code Click Buttons
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    if (applyCouponBtn) applyCouponBtn.addEventListener('click', applyCouponEngineAction);

    // 6. Connect Luxury Gift Option Expanders
    const giftCheckbox = document.getElementById('giftCheckbox');
    if (giftCheckbox) {
        giftCheckbox.addEventListener('change', function() {
            const wrapper = document.getElementById('giftMessageWrapper');
            if (wrapper) wrapper.style.display = this.checked ? "block" : "none";
        });
    }

    // 7. Connect Precision Jump Scroll Core links
    const catalogJumpLinks = document.querySelectorAll('.nav-link-catalog');
    catalogJumpLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const catalogControls = document.querySelector('.catalog-controls');
            const targetSection = document.getElementById('productGrid');
            
            if (targetSection) {
                if (catalogControls) {
                    catalogControls.style.opacity = '1';
                    catalogControls.style.pointerEvents = 'all';
                    catalogControls.style.transform = 'translateY(0)';
                }
                const offsetPosition = targetSection.getBoundingClientRect().top + window.scrollY - 180;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // 8. SAFE BINDING: COMFORT 4 Back-to-top smooth click action
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // 9. Hide Preloader shield once assets finish rendering pathways
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => { preloader.style.opacity = '0'; setTimeout(() => { preloader.remove(); }, 600); }, 400);
    }
});
// =========================================================================
// ANGEL JEWELLERY — PREMIUM INVOICE GENERATOR & RAZORPAY OPERATOR
// =========================================================================

let globalPayableAmountInPaise = 0; // Tracks the price for Razorpay backend context

function openInvoiceScreen(addressText) {
    if (!shoppingCart || shoppingCart.length === 0) return;

    const invoiceOverlay = document.getElementById('invoiceOverlayScreen');
    const itemsContainer = document.getElementById('invoiceItemsContainer');
    const pricingSummary = document.getElementById('invoicePricingSummary');

    // Extract potential pre-existing names or numbers from address layout structure
    document.getElementById('invClientAddress').value = addressText;
    document.getElementById('invClientName').value = localStorage.getItem('angel_customer_name') || "";
    document.getElementById('invClientPhone').value = localStorage.getItem('angel_customer_phone') || "";

    // 1. Build Itemized Row Manifest
    itemsContainer.innerHTML = shoppingCart.map(item => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.03);">
            <div style="display:flex; align-items:center; gap:15px;">
                <img src="${item.image}" style="width:45px; height:45px; object-fit:cover; border-radius:4px; border:1px solid rgba(255,255,255,0.05);">
                <div>
                    <h4 style="margin:0; font-size:0.9rem; font-weight:500;">${item.title}</h4>
                    <p style="margin:2px 0 0 0; font-size:0.75rem; color:#666;">Category: ${item.category} • Qty: ${item.quantity}</p>
                </div>
            </div>
            <span style="font-weight:500; font-size:0.9rem;">${formatCurrency(item.price * item.quantity)}</span>
        </div>
    `).join('');

    // 2. Compute Financial Ledger Data Points
    let grandSubtotal = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discountAmount = 0;
    if (activeDiscount.code) {
        if (activeDiscount.type === "percentage") discountAmount = (grandSubtotal * activeDiscount.value) / 100;
        else if (activeDiscount.type === "flat") discountAmount = activeDiscount.value;
    }
    let finalPayableTotal = grandSubtotal - discountAmount;
    
    // Razorpay accepts balances in minor currency sub-units (Paise for Indian Rupees). Multiply by 100.
    globalPayableAmountInPaise = finalPayableTotal * 100;

    // 3. Render Financial Ledger Box
    pricingSummary.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
            <span style="color:#666;">Bag Subtotal:</span><span>${formatCurrency(grandSubtotal)}</span>
        </div>
        ${discountAmount > 0 ? `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; color:#25d366;">
            <span>Coupon Promo (${activeDiscount.code}):</span><span>-${formatCurrency(discountAmount)}</span>
        </div>` : ''}
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; color:#888;">
            <span>Insured Vault Delivery:</span><span style="color:#25d366; font-weight:600;">FREE</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:1.1rem; font-weight:600; border-top:1px solid rgba(255,255,255,0.1); padding-top:12px; margin-top:10px; color:#dfba6b;">
            <span>Total Gross Bill:</span><span>${formatCurrency(finalPayableTotal)}</span>
        </div>
    `;

    toggleCartDrawer(); // Close the sidebar cart drawer cleanly
    invoiceOverlay.style.display = 'flex';
}

function closeInvoiceScreen() {
    document.getElementById('invoiceOverlayScreen').style.display = 'none';
}

// 4. FIRE THE NATIVE SURFACE RAZORPAY STANDARD SHEET
function initiateRazorpayPaymentProcess(event) {
    event.preventDefault();

    const name = document.getElementById('invClientName').value.trim();
    const phone = document.getElementById('invClientPhone').value.trim();
    const address = document.getElementById('invClientAddress').value.trim();

    localStorage.setItem('angel_customer_name', name);
    localStorage.setItem('angel_customer_phone', phone);

    // Standard Client-Side Razorpay Configuration Setup Options Packet
    const paymentOptions = {
        "key": "rzp_test_StZ7M1D8qRHUIN", // ⚠️ Replace this with your Live or Test API key from Razorpay Dashboard
        "amount": globalPayableAmountInPaise, 
        "currency": "INR",
        "name": "Angel Jewellery",
        "description": "Premium High-Fashion Order Settlement",
        "image": "angel-logo.png", 
        "handler": function (transactionResponse) {
            // Fired instantly when transaction registers success states!
            executePostPaidWhatsAppDispatch(transactionResponse.razorpay_payment_id, name, phone, address);
        },
        "prefill": {
            "name": name,
            "contact": phone
        },
        "theme": {
            "color": "#111111" // Luxury brand dark coordination color hex
        }
    };

    const razorpayUiEngineInstance = new Razorpay(paymentOptions);
    razorpayUiEngineInstance.open();
}

// 5. SECURE COMPILATION UPON SUCCESSFUL PAYMENT VERIFICATION MATCHES
// =========================================================================
// POST-PAID CONFIRMATION VIEW ARCHITECTURE ENGINE
// =========================================================================
function executePostPaidWhatsAppDispatch(paymentId, name, phone, address) {
    const confirmationScreen = document.getElementById('confirmationPageScreen');
    const confItemsManifest = document.getElementById('confItemsManifest');
    
    // 1. Set Transaction Metrics Metadata Display
    document.getElementById('confPaymentId').innerText = paymentId;
    document.getElementById('confClientMeta').innerText = `${name} (${phone})`;
    document.getElementById('confClientAddress').innerText = address;
    document.getElementById('confOrderDate').innerText = new Date().toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    // 2. Map Selected Masterpieces Rows to Success Summary Card
    confItemsManifest.innerHTML = shoppingCart.map(item => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; font-size:0.9rem;">
            <span style="color:#aaa;">${item.title} <small style="color:#666;">x${item.quantity}</small></span>
            <span style="font-weight:500;">${formatCurrency(item.price * item.quantity)}</span>
        </div>
    `).join('');

    // 3. Compute Ledger Breakdown Pricing Fields for Display
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

    // 4. Wrap up the Clean Invoice Message Text for WhatsApp Handoff
    messageText += `\n💰 *Total Paid:* ${formatCurrency(finalTotalCost)}\n`;
    messageText += `📍 *Delivery Address:* \n${address}\n\n`;
    messageText += `💬 _Payment token validated. Please share to generate courier delivery slip profiles._`;

    const generatedLink = `https://wa.me/919985044066?text=${encodeURIComponent(messageText)}`;
    
    // Bind the link dynamically to the green summary action button
    document.getElementById('confWhatsAppBtn').onclick = () => {
        window.open(generatedLink, '_blank');
    };

    
    // --- SAFE GOOGLE SHEETS DISPATCH GATEWAY ---
    console.log("Streaming transaction data to secure Google ledger...");
    
    // --- BULLETPROOF SHEETDB DISPATCH GATEWAY ---
    console.log("Streaming transaction data to secure SheetDB ledger...");
    
    fetch("https://sheetdb.io/api/v1/0lvmtng1nhhhi", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            // The keys below must exactly match the column headers in row 1 of your sheet!
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
    .then(data => console.log("SheetDB integration success payload:", data))
    .catch(err => console.error("SheetDB network stream drop:", err));
    
    // 5. SECURE BACKGROUND ARCHITECTURE RESET LOOP
    shoppingCart = [];
    activeDiscount = { code: "", type: "", value: 0 };
    if (localStorage.getItem('shoppingCart')) localStorage.removeItem('shoppingCart');
    
    if (document.getElementById('couponInput')) document.getElementById('couponInput').value = "";
    if (document.getElementById('customerAddress')) document.getElementById('customerAddress').value = "";
    
    updateCartUI();
    closeInvoiceScreen(); // Remove invoice screen input overlay layer

    // Reveal the gorgeous luxury final confirmation page!
    confirmationScreen.style.display = 'flex';
}

// 6. DISMISS CONTAINER PANEL AND RESTORE HOME STORE VIEW FRONTEND
function exitConfirmationAndReset() {
    document.getElementById('confirmationPageScreen').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
// =========================================================================
// ANGEL JEWELLERY — LIVE CONCIERGE SEARCH TRACKING ENGINE
// =========================================================================
function executeLiveOrderTrackingSearch() {
    const inputField = document.getElementById('trackingPhoneInput');
    const statusMsg = document.getElementById('trackingStatusMessage');
    const resultsContainer = document.getElementById('trackingResultsContainer');
    
    if (!inputField || !statusMsg || !resultsContainer) return;
    
    const plainPhoneNumberInput = inputField.value.trim();
    resultsContainer.innerHTML = ""; // Clear out previous searches
    
    if (!plainPhoneNumberInput) {
        statusMsg.style.display = "block";
        statusMsg.style.color = "#ff4444";
        statusMsg.innerText = "Please provide a valid contact registration number.";
        return;
    }
    
    statusMsg.style.display = "block";
    statusMsg.style.color = "#dfba6b";
    statusMsg.innerText = "Compiling live records archive from ledger data slots...";

    // ➔ Target SheetDB Search API looking specifically inside the 'Phone' column
    const searchApiEndpoint = `https://sheetdb.io/api/v1/0lvmtng1nhhhi/search?Phone=${encodeURIComponent(plainPhoneNumberInput)}`;

    fetch(searchApiEndpoint)
        .then(response => {
            if (!response.ok) throw new Error("Database interface link dropped.");
            return response.json();
        })
        .then(matchingOrdersArray => {
            if (!matchingOrdersArray || matchingOrdersArray.length === 0) {
                statusMsg.style.color = "#ff4444";
                statusMsg.innerText = "No verified luxury transaction records discovered matching this number.";
                return;
            }

            statusMsg.style.color = "#25d366";
            statusMsg.innerText = `Discovered ${matchingOrdersArray.length} authenticated reservation order file(s):`;

            // Render each discovered spreadsheet row into a beautiful dark receipt card
            resultsContainer.innerHTML = matchingOrdersArray.map(order => `
                <div style="background: #161616; border: 1px solid rgba(255,255,255,0.05); border-radius: 6px; padding: 25px; box-sizing: border-box; width: 100%; position: relative;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px; margin-bottom: 15px; font-size: 0.8rem; color: #888;">
                        <span>Ref ID: <strong style="color: #fff; font-family: monospace;">${order['Payment ID']}</strong></span>
                        <span>${order['Date']}</span>
                    </div>

                    <div style="margin-bottom: 15px;">
                        <h4 style="margin: 0 0 6px 0; font-size: 0.75rem; text-transform: uppercase; color: #dfba6b; letter-spacing: 0.5px;">Masterpieces Secured</h4>
                        <p style="margin: 0; color: #fff; font-size: 0.95rem; font-weight: 500; line-height: 1.4;">${order['Order Items']}</p>
                    </div>

                    <div style="border-top: 1px solid rgba(255,255,255,0.03); padding-top: 12px; margin-top: 12px; font-size: 0.85rem; color: #aaa;">
                        <p style="margin: 0 0 4px 0;"><span style="color: #666;">Consignee:</span> ${order['Client Name']}</p>
                        <p style="margin: 0;"><span style="color: #666;">Destination:</span> ${order['Address']}</p>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dotted rgba(255,255,255,0.1); padding-top: 12px; margin-top: 15px;">
                        <span style="font-size: 0.75rem; text-transform: uppercase; color: #666; font-weight: 600;">Payment Status</span>
                        <span style="background: rgba(37, 211, 102, 0.1); color: #25d366; font-size: 0.7rem; padding: 4px 10px; border-radius: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Paid via Gateway</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; font-size: 1.05rem; font-weight: 600; color: #dfba6b;">
                        <span>Settled Balance:</span>
                        <span>${order['Total Paid']}</span>
                    </div>

                </div>
            `).join('');
        })
        .catch(err => {
            console.error("Live ledger sync execution drop:", err);
            statusMsg.style.color = "#ff4444";
            statusMsg.innerText = "Fulfillment system extraction dropped. Please verify network links.";
        });
}
// =========================================================================
// ANGEL JEWELLERY — FULL SCREEN TRACKING PAGE OVERLAY CONTROLLERS
// =========================================================================
function openTrackingScreenOverlay(event) {
    if (event) event.preventDefault(); // Stop default browser href jump
    
    // Close the mobile dropdown toggle menu panel if it's currently open
    const navMenu = document.getElementById('navMenu');
    if (navMenu) navMenu.classList.remove('active');

    const trackingOverlay = document.getElementById('trackingScreenOverlay');
    if (trackingOverlay) {
        // Reset old input states cleanly
        document.getElementById('trackingPhoneInput').value = "";
        document.getElementById('trackingStatusMessage').style.display = "none";
        document.getElementById('trackingResultsContainer').innerHTML = "";
        
        trackingOverlay.style.display = 'flex';
    }
}

function closeTrackingScreenOverlay() {
    document.getElementById('trackingScreenOverlay').style.display = 'none';
}
// =========================================================================
// ANGEL JEWELLERY — ADMINISTRATIVE SYSTEM CONTROLLERS
// =========================================================================

function openAdminMasterConsole(event) {
    if (event) event.preventDefault();
    
    const adminOverlay = document.getElementById('adminMasterConsoleOverlay');
    const statusMsg = document.getElementById('adminConsoleStatus');
    const ordersContainer = document.getElementById('adminMasterOrdersContainer');
    
    if (!adminOverlay || !statusMsg || !ordersContainer) return;
    
    ordersContainer.innerHTML = ""; // Clear out stale panel logs
    statusMsg.innerText = "Extracting complete operational transaction matrix from Google server...";
    adminOverlay.style.display = 'flex';

    // ➔ GET request reads the absolute entire spreadsheet array sequence cleanly
    fetch("https://sheetdb.io/api/v1/0lvmtng1nhhhi")
        .then(response => {
            if (!response.ok) throw new Error("Administrative link connection dropout.");
            return response.json();
        })
        .then(allOrdersArray => {
            if (!allOrdersArray || allOrdersArray.length === 0) {
                statusMsg.innerText = "The database file contains zero active order logs.";
                return;
            }

            statusMsg.innerHTML = `Connected. Total Orders Processed: <span style="color:#25d366; font-weight:600;">${allOrdersArray.length}</span>`;

            // Reverse the array sequence so the newest transactions stream up first!
            const chronologicallyReversedStack = allOrdersArray.reverse();

            // Construct clean, compact table-style tracking metrics rows
            ordersContainer.innerHTML = chronologicallyReversedStack.map(order => `
                <div style="background: #161616; border: 1px solid rgba(255,255,255,0.03); border-radius: 4px; padding: 20px; box-sizing: border-box; width: 100%; display: flex; flex-wrap: wrap; gap: 15px; justify-content: space-between; align-items: flex-start;">
                    
                    <div style="flex: 1; min-width: 250px;">
                        <span style="font-size:0.7rem; color:#666; text-transform:uppercase; display:block; margin-bottom:4px; font-family:monospace;">Ref: ${order['Payment ID']}</span>
                        <h4 style="margin: 0 0 8px 0; font-size: 1.05rem; font-weight: 500; color: #fff;">${order['Client Name']}</h4>
                        <p style="margin: 0 0 4px 0; font-size: 0.85rem; color: #aaa;"><strong style="color:#dfba6b;">Items:</strong> ${order['Order Items']}</p>
                        <p style="margin: 0; font-size: 0.85rem; color: #888;"><strong style="color:#666;">Ship To:</strong> ${order['Address']}</p>
                    </div>

                    <div style="text-align: right; min-width: 150px; display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; height: auto;">
                        <span style="font-size: 0.75rem; color: #666; display:block; margin-bottom:10px;">${order['Date']}</span>
                        <span style="font-size: 1.15rem; font-weight: 600; color: #dfba6b; display:block; margin-bottom:8px;">${order['Total Paid']}</span>
                        <a href="https://wa.me/${order['Phone'].replace(/[^0-9]/g, '')}" target="_blank" style="background: rgba(37,211,102,0.08); color: #25d366; border: 1px solid rgba(37,211,102,0.2); padding: 5px 12px; font-size: 0.7rem; text-decoration: none; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; border-radius: 2px;">
                            <i class="fab fa-whatsapp"></i> Chat Client
                        </a>
                    </div>

                </div>
            `).join('');
        })
        .catch(err => {
            console.error("Admin dashboard runtime drop:", err);
            statusMsg.innerText = "Critical security handshake breakdown. Unable to authenticate spreadsheet rows.";
        });
}

function closeAdminMasterConsole() {
    document.getElementById('adminMasterConsoleOverlay').style.display = 'none';
}
// =========================================================================
// ANGEL JEWELLERY — MASTER RUNTIME ENGINE BANNER CAROUSEL
// =========================================================================
let currentCarouselActiveIndex = 0;
let carouselAutoRotationTimerHandle = null;

function initializeLuxuryBannerCarousel() {
    const headerElement = document.getElementById('header');
    const track = document.getElementById('carouselSliderTrack');
     if (headerElement && track) {
        const headerHeight = headerElement.offsetHeight;
        // Dynamically applies a top margin to the carousel wrapper based on header size
        track.parentElement.parentElement.style.marginTop = `${headerHeight}px`;
    }

    const indicatorsDock = document.getElementById('carouselIndicatorsDock');
    if (!track) return;

    const slidesCount = track.children.length;
    if (slidesCount === 0) return;

    // 1. Build bottom indicator tracking navigation dots
    indicatorsDock.innerHTML = "";
    for (let i = 0; i < slidesCount; i++) {
        const indicatorDot = document.createElement('div');
        indicatorDot.style.cssText = `width: 8px; height: 8px; border-radius: 50%; background: ${i === 0 ? '#dfba6b' : 'rgba(255,255,255,0.2)'}; cursor: pointer; transition: background 0.3s;`;
        indicatorDot.onclick = () => jumpToSpecificCarouselSlide(i);
        indicatorsDock.appendChild(indicatorDot);
    }

    // 2. Spark automated slideshow rotation timeline
    startCarouselAutoPlayCycle(slidesCount);
}

function updateCarouselRenderPosition() {
    const track = document.getElementById('carouselSliderTrack');
    const indicatorsDock = document.getElementById('carouselIndicatorsDock');
    if (!track) return;

    // Move slider track via CSS transitions shifts
    track.style.transform = `translateX(-${currentCarouselActiveIndex * 100}%)`;

    // Toggle active coloring states across indicator dot frames
    Array.from(indicatorsDock.children).forEach((dot, index) => {
        dot.style.background = index === currentCarouselActiveIndex ? '#dfba6b' : 'rgba(255,255,255,0.2)';
    });
}

function shiftCarouselSlideDirection(directionStep) {
    const track = document.getElementById('carouselSliderTrack');
    if (!track) return;
    
    const totalSlides = track.children.length;
    
    // Cycle calculations loops wrap back around limits gracefully
    currentCarouselActiveIndex += directionStep;
    if (currentCarouselActiveIndex >= totalSlides) currentCarouselActiveIndex = 0;
    if (currentCarouselActiveIndex < 0) currentCarouselActiveIndex = totalSlides - 1;

    updateCarouselRenderPosition();
    
    // Reset automatic timers upon manual customer override actions
    startCarouselAutoPlayCycle(totalSlides);
}

function jumpToSpecificCarouselSlide(targetIndex) {
    currentCarouselActiveIndex = targetIndex;
    updateCarouselRenderPosition();
    
    const track = document.getElementById('carouselSliderTrack');
    if (track) startCarouselAutoPlayCycle(track.children.length);
}

function startCarouselAutoPlayCycle(totalSlidesCount) {
    if (carouselAutoRotationTimerHandle) clearInterval(carouselAutoRotationTimerHandle);
    
    // Smooth auto-advancement loop ticks every 5000ms (5 seconds)
    carouselAutoRotationTimerHandle = setInterval(() => {
        currentCarouselActiveIndex = (currentCarouselActiveIndex + 1) % totalSlidesCount;
        updateCarouselRenderPosition();
    }, 5000);
}

// ➔ BIND CAROUSEL TO INITIALIZE AUTOMATICALLY ONCE HTML STRUCTURE STANDS UP
window.addEventListener('DOMContentLoaded', initializeLuxuryBannerCarousel);

// =========================================================================
// ANGEL JEWELLERY — VAULT SALE DISTRIBUTION GRID ENGINE
// =========================================================================
function renderVaultSaleSection() {
    const saleSection = document.getElementById('saleSection');
    const saleGrid = document.getElementById('saleProductGrid');
    
    if (!saleSection || !saleGrid) return;

    // Filter database for elements that contain an active original price field
    const saleItems = productDatabase.filter(product => product.originalPrice && product.originalPrice > product.price);

    // If zero pieces match our sale criteria, keep the section hidden entirely
    if (saleItems.length === 0) {
        saleSection.style.display = 'none';
        return;
    }

    // Reveal the pristine sale frame area
    saleSection.style.display = 'block';
    saleGrid.innerHTML = "";

    saleItems.forEach(product => {
        const isSoldOut = product.badge && product.badge.toLowerCase() === 'sold out';
        const isFavorited = wishlistMemory.includes(product.id);
        
        const saleCard = document.createElement('div');
        saleCard.className = `product-card ${isSoldOut ? 'disabled-card' : ''}`;
        
        let badgeHTML = product.badge ? `<span class="product-badge urgency-alert" style="background:#ff4444;">${product.badge}</span>` : '';

        // --- STRIKE-OUT CURRENCY TYPOGRAPHY GENERATOR ---
        const pricingLayoutHTML = `
            <p class="product-price" style="display: flex; align-items: center; gap: 10px; margin: 0;">
                <span style="color: #dfba6b; font-weight: 500;">${formatCurrency(product.price)}</span>
                <span style="color: #666; font-size: 0.85rem; text-decoration: line-through; font-weight: 400;">${formatCurrency(product.originalPrice)}</span>
            </p>
        `;

        saleCard.innerHTML = `
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
                <p class="product-category" style="color: #ff4444;">${product.category} • Special Offer</p>
                <h3 class="product-title">${product.title}</h3>
                ${pricingLayoutHTML}
                <button class="btn-order-wa" onclick="${isSoldOut ? '' : `addToCartEngine(${product.id}); triggerCartNotification('${product.title}');`}" ${isSoldOut ? 'disabled' : ''} style="margin-top:15px;">
                    <i class="${isSoldOut ? 'fas fa-hourglass-start' : 'fab fa-whatsapp'}"></i> ${isSoldOut ? 'Restocking Soon' : 'Add To Cart'}
                </button>
            </div>
        `;
        saleGrid.appendChild(saleCard);
    });
}