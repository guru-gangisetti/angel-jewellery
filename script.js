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
async function loadProductDatabaseEngine() {
    try {
        // Reads live updates from the Git-backed Mobile Admin JSON stream
        const targetResponse = await fetch('data/products.json');
        if (!targetResponse.ok) throw new Error('Data stream failed verification handles');
        
        productDatabase = await targetResponse.json();
        
        // Populate the catalog grid automatically once data arrives
        filterCatalog();
    } catch (error) {
        console.error('Critical catalog database execution drop:', error);
        // Fallback interface indicator in case file path mapping is broken
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
        executeWhatsAppOrderDispatch(addressText);
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

    const generatedLink = `https://wa.me/919290066290?text=${encodeURIComponent(messageText)}`;
    window.open(generatedLink, '_blank');
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
    document.getElementById('qvPrice').innerText = formatCurrency(product.price);
    
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