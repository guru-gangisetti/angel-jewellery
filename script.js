// =========================================================================
// ANGEL JEWELLERY — "AS SEEN ON INSTAGRAM" UGC SHOWCASE
// Curated manually for now — a live Instagram feed needs a Meta Graph API
// app + backend token, which is a bigger lift than this section warrants
// today. To add a new photo: drop the image into assets/ugc/ and push a
// new entry into the array below. Keep images square (1:1) for best fit.
// =========================================================================

const instagramShowcaseFeed = [
    { image: 'assets/ugc/ugc-1.webp', handle: '@priya.wears.gold' },
    { image: 'assets/ugc/ugc-2.webp', handle: '@meera.style' },
    { image: 'assets/ugc/ugc-3.jpeg', handle: '@ananya.k' },
    { image: 'assets/ugc/ugc-4.jpeg', handle: '@thejewelrydiaries' },
    { image: 'assets/ugc/ugc-5.webp', handle: '@radhika.official' },
    { image: 'assets/ugc/ugc-6.jpeg', handle: '@styledby.sn' }
];

const instagramProfileLink = 'https://www.instagram.com/angeljewelleryofficial?igsh=djNuZzlwMGY5NzBl';


function renderInstagramShowcaseGallery() {
    const grid = document.getElementById('ugcShowcaseGrid');
    if (!grid) return;

    grid.innerHTML = instagramShowcaseFeed.map(post => `
        <a href="${instagramProfileLink}" target="_blank" rel="noopener" class="ugc-showcase-tile" aria-label="View ${post.handle} on Instagram">
            <img src="${post.image}" loading="lazy" decoding="async" alt="Customer wearing Angel Jewellery"
                 onerror="this.closest('.ugc-showcase-tile').style.display='none'">
            <div class="ugc-showcase-overlay"><i class="fab fa-instagram"></i></div>
            <span class="ugc-showcase-handle">${post.handle}</span>
        </a>
    `).join('');
}


document.addEventListener('DOMContentLoaded', renderInstagramShowcaseGallery);

// =========================================================================
// 💎 ANGEL JEWELLERY — GLOBAL MULTI-GRID METADATA DECK LAYOUT OVERRIDES
// =========================================================================
if (typeof document !== 'undefined' && !document.getElementById('angelJewelryGlobalMobileCardOverrides')) {
    const mobileOverridesStyleNode = document.createElement("style");
    mobileOverridesStyleNode.id = "angelJewelryGlobalMobileCardOverrides";
    mobileOverridesStyleNode.innerHTML = `
        /* ➔ UNIFORM SYSTEM OVERRIDES FOR THE COLLECTION/MOSAIC MODAL CONTAINER */
        #stylePortfolioModalShield, 
        .mosaic-modal-window {
            font-family: 'Montserrat', sans-serif !important;
        }

        /* Enforce a tight, high-visibility 2-column layout by removing wasted horizontal space */
        #portfolioModalProductsGrid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important; 
            gap: 10px !important; /* Reduced from 12px to give images more width space */
            width: 100% !important;
            max-width: 100% !important;
            padding: 4px 0 !important;
            box-sizing: border-box !important;
            overflow-x: hidden !important; 
        }

        /* Default row layout configurations for Desktop Trust Badges */
        .modal-trust-badges-container {
            display: flex !important;
            justify-content: space-around !important;
            align-items: center !important;
            flex-direction: row !important;
        }
        .trust-badge-item {
            display: inline-flex !important;
            align-items: center !important;
            gap: 6px !important;
        }

        @media (max-width: 768px) {
            
            /* 📱 INVOICE CHECKOUT MODAL: MOBILE VIEWPORT RE-ARCHITECTURE */
            #invoiceOverlayScreen {
                padding: 0 !important;
                align-items: flex-start !important;
                background: #ffffff !important; /* Seamless layout background color blend */
            }

            /* Transform floating white panel card to span absolute full screen edge-to-edge */
            #invoiceOverlayScreen > div {
                width: 100% !important;
                max-width: 100% !important;
                min-height: 100vh !important;
                height: 100vh !important;
                margin: 0 !important;
                border-radius: 0 !important;
                padding: 16px !important;
                box-sizing: border-box !important;
                display: flex !important;
                flex-direction: column !important;
                overflow-y: auto !important; /* Safe fluid scrolling track for items list profiles */
                box-shadow: none !important;
            }

            /* Prevent elements from slipping out of bounding margins */
            #invoiceItemsContainer,
            #invoicePricingSummary,
            #invoiceOverlayScreen form {
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
            }

            /* Fix pricing totals layout alignment rows */
            #invoicePricingSummary > div {
                width: 100% !important;
                box-sizing: border-box !important;
            }

            /* 📱 MOSAIC MODAL: FORCING TRUE EDGE-TO-EDGE ABSOLUTE FULL SCREEN */
            #stylePortfolioModalShield {
                padding: 0 !important; /* Wipes out the framing margins visible in image_a0ed9b.jpg */
                align-items: flex-start !important;
                background: #ffffff !important; /* Seamless luxury backdrop integration */
            }

            /* Transform floating container box into a full viewport application canvas */
            #stylePortfolioModalShield > div {
                width: 100% !important;
                max-width: 100% !important;
                min-height: 100vh !important;
                height: 100vh !important;
                margin: 0 !important;
                border-radius: 0 !important; /* Cleans up round clip boundaries for native screen scaling */
                display: flex !important;
                flex-direction: column !important;
                box-sizing: border-box !important;
                box-shadow: none !important;
            }

            /* Maximize tile rendering canvas layout width by cutting excessive interior side gaps */
            #portfolioModalScrollBody {
                flex-grow: 1 !important;
                overflow-y: auto !important;
                padding: 10px 8px !important; /* Reduced from 16px to immediately scale up inner tiles */
                box-sizing: border-box !important;
                width: 100% !important;
                background: #ffffff !important;
            }
            
            /* Clean structural modifications for inner tiles to prevent squeezed dimensions */
            .mosaic-modal-tile {
                padding: 8px !important; /* Optimized card body footprint padding */
            }

            /* 📱 MOBILE VIEW CORRECTION FOR TRUST GUARANTEES (ONE BY ONE ROW) */
            .modal-trust-badges-container {
                flex-direction: column !important; /* Stacks trust badges vertically */
                align-items: flex-start !important; /* Left-align items */
                gap: 10px !important; /* Spacing between rows */
                padding-left: 4px !important;
            }
            
            .trust-badge-item {
                font-size: 0.78rem !important; /* Accessible text size scaling */
                width: 100% !important;
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
            }

            /* 📱 HERO CAROUSEL ADMIN DRAWER MODAL OVERRIDES (FIXED FOR image_a1e15e.png) */
            #adminCarouselConsoleOverlay {
                padding: 0 !important;
                align-items: flex-start !important;
                background: rgba(0, 0, 0, 0.5) !important;
            }

            /* Overwrite floating window bounds to fit absolute fullscreen device viewports */
            #adminCarouselConsoleOverlay > div:first-of-type {
                width: 100% !important;
                max-width: 100% !important;
                min-height: 100vh !important;
                height: 100vh !important;
                margin: 0 !important;
                border-radius: 0 !important; 
                display: flex !important;
                flex-direction: column !important;
                padding: 16px !important;
                box-sizing: border-box !important;
                overflow-y: auto !important; 
                background: #ffffff !important;
                box-shadow: none !important;
                position: relative !important; /* Required anchor link context for absolute child tracking */
            }

            /* ➔ THE OVERWRITE FORCE: Snaps flex blocks into vertical rows[cite: 1] */
            #adminCarouselConsoleOverlay > div:first-of-type > div,
            #adminCarouselConsoleOverlay div[style*="display: flex"],
            #adminCarouselConsoleOverlay div[style*="display:flex"] {
                flex-direction: column !important;
                display: flex !important;
                gap: 24px !important;
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
            }

            /* ➔ FIX FOR CLOSE MODAL OVERLAY POSITIONING (Addresses image_a233f2.png) */
            #adminCarouselConsoleOverlay button[onclick="closeAdminCarouselConsoleOverlay()"],
            #adminCarouselConsoleOverlay .close, 
            #adminCarouselConsoleOverlay span[onclick*="close"] {
                position: absolute !important;
                top: 20px !important;
                right: 20px !important;
                margin: 0 !important;
                z-index: 9999 !important;
                align-self: flex-end !important;
                transform: none !important;
                background: #ffffff !important;
                padding: 5px !important;
            }

            /* Separate table container layout and form elements completely[cite: 1] */
            #adminCarouselListTableContainer {
                width: 100% !important;
                max-width: 100% !important;
                overflow-x: auto !important; 
                box-sizing: border-box !important;
                margin: 0 0 10px 0 !important;
                flex: none !important;
            }

            /* Prevent the tabular element columns from shrinking away[cite: 1] */
            #adminCarouselListTableContainer table {
                width: 100% !important;
                min-width: 280px !important;
            }

            /* Force standard admin upload input forms out of the squashed side grid alignment[cite: 1] */
            #adminCarouselConsoleOverlay form,
            #adminCarouselCreatorForm {
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
                padding: 0 !important;
                margin: 10px 0 0 0 !important;
                flex: none !important;
            }
        }
    `;
    document.head.appendChild(mobileOverridesStyleNode);
}
/* =========================================================================
   ANGEL JEWELLERY — COMPLETE MASTER RUNTIME ENGINE APPLICATIVE LOGIC
   ========================================================================= */

let productDatabase = [];

let shoppingCart = [];       

let wishlistMemory = [];     

let activeDiscount = { code: "", type: "", value: 0 };

let currentSelectedFilterCategoryKey = "all"; 

let MASTER_LIVE_INVENTORY_CACHE = {};

let carouselRegistryCache = []


const FREE_SHIPPING_THRESHOLD = 1000; 



// Inject standard button transition/hover utility rules cleanly into the runtime context
if (typeof document !== 'undefined' && !document.getElementById('angelJewelryButtonHoverStyleTag')) {
    const styleSheetNode = document.createElement("style");
    styleSheetNode.id = "angelJewelryButtonHoverStyleTag";
    styleSheetNode.innerHTML = `
        .btn-order-wa {
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
        }
        .btn-order-wa:hover:not([disabled]) {
            background: var(--pink-accent, #ff1493) !important;
            color: #ffffff !important;
            box-shadow: 0 4px 12px rgba(255, 20, 147, 0.25) !important;
            transform: translateY(-1px);
        }
    `;
    document.head.appendChild(styleSheetNode);
}

// =========================================================================
// ANGEL JEWELLERY — HIGH-PERFORMANCE SUPABASE RELATIONAL DATABASE CHANNELS
// =========================================================================

async function loadProductDatabaseEngine() {
    try {
        console.log("Synchronizing live data matrix cleanly via direct Supabase API connection...");
        
        const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
        const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;
        
        // Pull relational entries natively
        const cleanFetchTargetUrl = `${sbUrl}/rest/v1/products?select=*,product_variants(*)&order=id.asc`;

        const databaseResponse = await fetch(cleanFetchTargetUrl, {
            method: 'GET',
            headers: {
                'apikey': sbKey,
                'Authorization': `Bearer ${sbKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!databaseResponse.ok) throw new Error(`Supabase returned status code: ${databaseResponse.status}`);
        const databasePayload = await databaseResponse.json();

        // Map fields explicitly from your new database columns
        productDatabase = databasePayload.map(item => {
            const parsedUniqueId = parseInt(item.id);
            const variations = item.product_variants || [];
            
            // ➔ THE CORRECTION: Extract default values from the first variant row if available!
            const defaultVariant = variations.length > 0 ? variations[0] : null;
            
            // Fallbacks if parent fields are null
            const verifiedPrice = defaultVariant ? parseFloat(defaultVariant.price) : (parseFloat(item.price) || 0);
            const verifiedImage = defaultVariant ? (defaultVariant.image_url || defaultVariant.image) : (item.image || 'assets/placeholder.png');
            
            const liveStockLevel = defaultVariant ? parseInt(defaultVariant.stock) : (parseInt(item.stock) ?? 0);
            const updatedStatus = liveStockLevel <= 0 ? "sold" : String(item.status || 'available').trim().toLowerCase();

            // Populate Master Cache safely
            MASTER_LIVE_INVENTORY_CACHE[parsedUniqueId] = {
                stock: liveStockLevel,
                status: updatedStatus,
                variants: variations
            };

            return {
                id: parsedUniqueId,
                title: item.title,
                price: verifiedPrice, // Safely assigned to show the variant price on grid cards!
                category: item.category || 'Luxury Collection',
                image: verifiedImage, // Safely assigned to show the variant image on grid cards!
                badge: updatedStatus === "sold" ? "Sold Out" : (item.badge || ''),
                description: item.description || '',
                style: item.style ? String(item.style).trim().toLowerCase() : '',
                created_at: item.created_at || null,
                product_variants: variations
            };
        });

        console.log(`✨ Success! Relational database maps aligned. Loaded ${productDatabase.length} items.`);

        if (typeof generateDynamicCatalogFilters === 'function') {
            generateDynamicCatalogFilters();
        }

    } catch (error) {
        console.error('Critical Supabase catalog extraction breakdown caught:', error);
    }
}
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

// =========================================================================
// ANGEL JEWELLERY — HARMONIZED INDESTRUCTIBLE SEARCH & FILTER ENGINE
// =========================================================================
// =========================================================================
// ANGEL JEWELLERY — SECTION COUNTDOWN TIMERS (Sale + Flash Vault)
// Sale end-date is admin-configurable below — edit it whenever you run a
// real timed promotion. The countdown hides itself if unset or already
// passed, so it can never show a stale or fake deadline.
// Flash Vault resets to midnight every day automatically, with zero
// maintenance needed — "today's ₹350 picks" is always literally true.
// =========================================================================

// ➔ EDIT THIS whenever you run a real sale with a real end date/time.
// Example: const SALE_SECTION_END_DATETIME = new Date('2026-07-31T23:59:59');

const SALE_SECTION_END_DATETIME = null;


function formatCountdownParts(msRemaining) {
    const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
}


function updateSaleCountdown() {
    const badge = document.getElementById('saleCountdownBadge');
    if (!badge) return;

    if (!SALE_SECTION_END_DATETIME || SALE_SECTION_END_DATETIME.getTime() <= Date.now()) {
        badge.style.display = 'none';
        return;
    }

    const { days, hours, minutes, seconds } = formatCountdownParts(SALE_SECTION_END_DATETIME.getTime() - Date.now());
    const dayPrefix = days > 0 ? `${days}d ` : '';
    badge.innerHTML = `<i class="fas fa-clock"></i> Sale ends in ${dayPrefix}${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    badge.style.display = 'inline-flex';
}


function updateFlashVaultCountdown() {
    const badge = document.getElementById('flashVaultCountdownBadge');
    if (!badge) return;

    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setHours(24, 0, 0, 0);

    const { hours, minutes, seconds } = formatCountdownParts(nextMidnight.getTime() - now.getTime());
    badge.innerHTML = `<i class="fas fa-clock"></i> Today's ₹350 picks end in ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    badge.style.display = 'inline-flex';
}

setInterval(() => {
    updateSaleCountdown();
    updateFlashVaultCountdown();
}, 1000);


document.addEventListener('DOMContentLoaded', () => {
    updateSaleCountdown();
    updateFlashVaultCountdown();
});

// =========================================================================
// ANGEL JEWELLERY — FIRST-TIME VISITOR WELCOME DISCOUNT
// Shows once ever per browser (localStorage flag). IMPORTANT: this only
// actually works at checkout if a matching coupon genuinely exists in
// your Coupons table — create one with code WELCOME10 (type: percentage,
// value: 10) via your existing admin Promo Codes panel. Without that,
// this is just a popup with no teeth.
// =========================================================================

const WELCOME_DISCOUNT_STORAGE_KEY = 'angelJewelleryWelcomeDiscountShown';

const WELCOME_DISCOUNT_CODE = 'WELCOME10';


function maybeShowWelcomeDiscountPopup() {
    let alreadyShown = true;
    try {
        alreadyShown = localStorage.getItem(WELCOME_DISCOUNT_STORAGE_KEY) === 'true';
    } catch (err) {
        alreadyShown = true; // fail safe: don't show if storage is unavailable
    }
    if (alreadyShown) return;

    setTimeout(() => {
        const modal = document.getElementById('welcomeDiscountModal');
        if (modal) modal.style.display = 'flex';
        try {
            localStorage.setItem(WELCOME_DISCOUNT_STORAGE_KEY, 'true');
        } catch (err) {
            console.error('Could not save welcome discount shown flag:', err);
        }
    }, 2500);
}


function closeWelcomeDiscountModal() {
    const modal = document.getElementById('welcomeDiscountModal');
    if (modal) modal.style.display = 'none';
}


function copyWelcomeDiscountCode() {
    navigator.clipboard.writeText(WELCOME_DISCOUNT_CODE).then(() => {
        const btn = document.getElementById('welcomeDiscountCopyBtn');
        if (!btn) return;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => { btn.innerHTML = originalHTML; }, 1800);
    }).catch(err => console.error('Clipboard copy failed:', err));
}


document.addEventListener('DOMContentLoaded', maybeShowWelcomeDiscountPopup);

// =========================================================================
// ANGEL JEWELLERY — INVENTORY DASHBOARD
// A dedicated admin view for managing stock across every product/variant
// at once, instead of opening each product's Edit form individually.
// =========================================================================


async function logStockHistoryEntry(variantId, productId, productTitle, colorName, changeType, previousStock, newStock, note = '') {
    try {
        const sbUrl = ANGEL_STORE_CONFIG?.DATABASE?.SUPABASE_URL;
        const sbKey = ANGEL_STORE_CONFIG?.DATABASE?.SUPABASE_ANON_KEY;
        if (!sbUrl || !sbKey) return;

        await fetch(`${sbUrl}/rest/v1/stock_history`, {
            method: 'POST',
            headers: {
                'apikey': sbKey,
                'Authorization': `Bearer ${sbKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                variant_id: variantId,
                product_id: productId,
                product_title: productTitle,
                color_name: colorName,
                change_type: changeType,
                previous_stock: previousStock,
                new_stock: newStock,
                change_amount: newStock - previousStock,
                note: note
            })
        });
    } catch (err) {
        console.error('Could not log stock history entry (stock update itself still succeeded):', err);
    }
}

// --- Inline single-row edit ---

function filterCatalog(passedSearchQuery) {
    const productGrid = document.getElementById('productGrid');

    if (!productDatabase || productDatabase.length === 0) {
        console.log("⏳ Catalog canvas waiting for single-source product stream synchronization...");
        return;
    }
    
    // A. READ SEARCH INPUT CONTENT Safely across inputs and passed arguments
    let searchStringQuery = "";
    if (passedSearchQuery !== undefined && passedSearchQuery !== null) {
        searchStringQuery = String(passedSearchQuery);
    } else {
        const liveInputEl = document.getElementById('searchInput');
        searchStringQuery = liveInputEl ? liveInputEl.value : "";
    }
    searchStringQuery = searchStringQuery.trim().toLowerCase();

    // B. COMBINED FILTER MATRIX ZONE
    if (productGrid && productDatabase && productDatabase.length > 0) {
        let filteredResults = productDatabase.filter(product => {
            if (!product) return false;

            // --- CRITERIA A: TAB CATEGORY SELECTION MATCHING ---
            let matchesCategoryTab = true;
            if (typeof currentSelectedFilterCategoryKey !== 'undefined' && currentSelectedFilterCategoryKey && currentSelectedFilterCategoryKey !== 'all') {
                const productCat = product.category || product.type || product.tag || '';
                const cleanProductCategory = String(productCat).trim().toLowerCase();
                const cleanSelectedTabKey = currentSelectedFilterCategoryKey.trim().toLowerCase();
                
                matchesCategoryTab = cleanProductCategory === cleanSelectedTabKey || 
                                     cleanProductCategory.includes(cleanSelectedTabKey) || 
                                     cleanSelectedTabKey.includes(cleanProductCategory);
            }

            // --- CRITERIA B: LIVE SEARCH TEXT MATCHING ---
            let matchesSearchText = true;
            if (searchStringQuery !== "") {
                const titleStr = String(product.title || product.name || '').toLowerCase();
                const descStr = String(product.description || product.desc || '').toLowerCase();
                const catStr = String(product.category || product.type || '').toLowerCase();

                matchesSearchText = titleStr.includes(searchStringQuery) || 
                                    descStr.includes(searchStringQuery) || 
                                    catStr.includes(searchStringQuery);
            }

            // --- CRITERIA C: HIDE SOLD OUT OPTION CHECK ---
            const hideSoldOutCheckbox = document.getElementById('hideSoldOutCheckbox');
            if (hideSoldOutCheckbox && hideSoldOutCheckbox.checked) {
                const isSoldOut = product.badge && product.badge.toLowerCase() === 'sold out';
                if (isSoldOut) return false;
            }

            return matchesCategoryTab && matchesSearchText;
        });

        // C. RENDERING CANVAS: Map your loaded items directly into your HTML grid
       if (filteredResults.length === 0) {
            productGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted, #777); font-weight: 500; font-family: 'Montserrat', sans-serif;">
                    <i class="fas fa-search" style="font-size: 2rem; color: #e8e8ef; display: block; margin-bottom: 12px;"></i>
                    No masterpieces discoverable matching your criteria.
                </div>`;
        } else {
            // A. Safely resolve your active category folder tracking key name
            const activeTabTracker = (typeof currentActiveTab !== 'undefined') 
                ? currentActiveTab 
                : (typeof currentSelectedFilterCategoryKey !== 'undefined' ? currentSelectedFilterCategoryKey : 'all');

            // B. Compile all individual product card layouts cleanly
            const compiledProductCardsHTML = filteredResults.map(product => {
                const isSoldOut = product.badge && product.badge.toLowerCase() === 'sold out';
                
                const rawPriceValue = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
                const displayPrice = rawPriceValue > 0 ? `₹${rawPriceValue.toLocaleString('en-IN')}` : 'Price on Request';
                const safeTitleString = (product.title || '').replace(/'/g, "\\'");
                const displayCategory = product.category || product.type || 'Luxury Collection';

                // Reuse the same live inventory cache the admin form and Flash Vault already read from
                const liveStockData = MASTER_LIVE_INVENTORY_CACHE[product.id];
                const liveStockCount = liveStockData ? liveStockData.stock : (parseInt(product.stock) || 0);
                const isLowStock = !isSoldOut && liveStockCount > 0 && liveStockCount <= 2;
                const isHealthyStock = !isSoldOut && liveStockCount > 2;

                const cardVariants = product.product_variants || product.Product_Variants || product.variants || [];
                const firstColorName = cardVariants.length > 0 ? cardVariants[0].color_name : 'Standard';
                const isFavorited = wishlistMemory.includes(`${product.id}|${firstColorName}`);
                let colorDotsHTML = "";

                if (cardVariants.length > 0 && cardVariants[0].color_name !== 'Standard') {
                    colorDotsHTML = `
                        <div class="card-color-swatches angel-card-swatches" style="display: flex; flex-direction: column; gap: 6px; width: 100%; position: relative; z-index: 5;">
                            <div style="display: flex; gap: 10px; align-items: center;">
                                ${cardVariants.map((v, vIdx) => `
                                    <span title="${v.color_name || 'Option'}" 
                                        onclick="event.stopPropagation(); handleCatalogCardDotClick(event, ${product.id}, ${v.id}, ${vIdx})"
                                        class="angel-card-swatch-dot catalog-variant-dot-${product.id} ${vIdx === 0 ? 'is-active' : ''}"
                                        data-variant-idx="${vIdx}"
                                        style="background: ${v.color_hex || '#ccc'};">
                                    </span>
                                `).join('')}
                            </div>
                            <span class="angel-card-active-color-label" id="catalog-card-colorname-${product.id}">${cardVariants[0].color_name || ''}</span>
                        </div>
                    `;
                }


                const defaultVariantId = cardVariants.length > 0 ? cardVariants[0].id : '';
                    return `<div class="angel-card ${isSoldOut ? 'is-disabled' : ''}" 
                        id="catalog-card-${product.id}"
                        data-active-variant-id="${defaultVariantId}"
                        onclick="openQuickViewShield(${product.id})">
                        

                        <div class="angel-card-media">
                            <img id="catalog-card-img-${product.id}" 
                                src="${product.image || 'assets/placeholder.png'}" 
                                loading="lazy" decoding="async"
                                alt="${product.title || 'Angel Jewellery piece'}"
                                onerror="this.src='assets/placeholder.png'">
                            ${product.badge ? `<span class="angel-card-badge" style="${getBadgeCustomStyles(product.badge)}">${product.badge}</span>` : ''}
                            <button class="angel-card-wishlist wishlist-heart-btn ${isFavorited ? 'active' : ''}" 
                                    onclick="event.stopPropagation(); toggleWishlistEngine(event, ${product.id}, this)" 
                                    aria-label="Add to wishlist">
                                <i class="${isFavorited ? 'fas' : 'far'} fa-heart" style="font-size: 0.8rem; color: ${isFavorited ? 'var(--pink-accent, #ff1493)' : '#202c55'};"></i>
                            </button>
                            ${isSoldOut ? `<div class="angel-card-soldout-scrim">Restocking Soon</div>` : ''}
                        </div>
                        
                        <div class="angel-card-body">
                            <p class="angel-card-eyebrow">${displayCategory}</p>

                            ${colorDotsHTML}

                            <h3 class="angel-card-title">${product.title}</h3>
                            
                            <span id="catalog-card-stockflag-${product.id}" class="angel-card-stock-flag ${isHealthyStock ? 'angel-card-stock-flag--available' : ''}" style="${(isLowStock || isHealthyStock) ? '' : 'display:none;'}">${isLowStock ? `<i class="fas fa-fire"></i> Only ${liveStockCount} left` : `<i class="fas fa-check-circle"></i> ${liveStockCount} in stock`}</span>

                            <div class="angel-card-price-row">
                                <span id="catalog-card-price-${product.id}" class="angel-card-price">${displayPrice}</span>
                            </div>
                            
                            <button class="angel-card-cta ${isSoldOut ? 'is-sold-out' : ''}" 
                                    onclick="event.stopPropagation(); if(!${isSoldOut}) { handleCatalogCardAddToCart(${product.id}, '${safeTitleString}'); }"
                                    ${isSoldOut ? 'disabled' : ''}>
                                <i class="${isSoldOut ? 'fas fa-hourglass-start' : 'fas fa-shopping-cart'}" style="font-size: 0.72rem;"></i> 
                                <span>${isSoldOut ? 'Restocking Soon!' : 'Add to Cart'}</span>
                            </button>
                        </div>
                    </div>`;
            }).join('');
            
            // C. ➔ THE IN-BOX TITLE CONDITION SEQUENCE (FIXED FOR GRID ALIGNMENT)
            if (activeTabTracker !== 'all' && activeTabTracker !== '') {
                productGrid.classList.add('filtered-collection-frame');
                productGrid.innerHTML = `
                    <!-- THE FIX: grid-column: 1 / -1 ensures the title spans the whole top row smoothly -->
                    <div class="in-box-collection-header" style="grid-column: 1 / -1; text-align: left; padding: 5px 0 0 0; border-bottom: 1px solid #cca43b; margin-bottom: 15px; width: 100%; box-sizing: border-box;">
                        <h2 style="color: #202c55; text-align:center; font-size: 1.35rem; font-weight: 600; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Montserrat';">${activeTabTracker}</h2>
                    </div>
                    
                    <!-- We drop back into your pristine product mapping array grid elements directly -->
                    ${compiledProductCardsHTML}
                `;
            } else {
                productGrid.classList.remove('filtered-collection-frame');
                productGrid.innerHTML = compiledProductCardsHTML;
            }
        }
    }

    // D. HOMEPAGE SHOWCASE ROUTERS — Fired independently with zero rendering block conflicts
    // if (productDatabase && productDatabase.length > 0) {
    //     if (typeof renderVaultSaleSection === 'function') renderVaultSaleSection();
    //     if (typeof renderTrendingSection === 'function') renderTrendingSection();
    // }
    // document.getElementById('collection-main-title').scrollIntoView({
    //                     behavior: "smooth",
    //                     block: "start"
    //                 });
}

// =========================================================================
// 2. VAULT SALE SECTION RENDERER (FIXED)
// =========================================================================

function renderVaultSaleSection() {
    const saleSection = document.getElementById('saleSection');
    const saleGrid = document.getElementById('saleProductGrid');
    
    if (!saleSection || !saleGrid || !productDatabase) return;

    const saleItems = productDatabase.filter(product => {
        if (!product) return false;

        const currentBadgeText = String(product.badge || '').trim().toLowerCase();
        if (currentBadgeText === 'sale' || currentBadgeText.includes('discount') || currentBadgeText.includes('off')) {
            return true;
        }

        if (product.sale === true || product.isSale === true || product.onSale === true) {
            return true;
        }

        const rawOriginalPrice = product.originalPrice || product.original_price || product.oldPrice;
        if (rawOriginalPrice) {
            const cleanCurrentPrice = typeof product.price === 'number' ? product.price : parseFloat(String(product.price).replace(/[^0-9.]/g, '')) || 0;
            const cleanOriginalPrice = typeof rawOriginalPrice === 'number' ? rawOriginalPrice : parseFloat(String(rawOriginalPrice).replace(/[^0-9.]/g, '')) || 0;
            return cleanOriginalPrice > cleanCurrentPrice;
        }

        return false;
    });

    console.log(`Vault Sale Module Evaluation: Found ${saleItems.length} matching offer items.`);

    if (saleItems.length === 0) {
        saleSection.style.setProperty("display", "none", "important");
        return;
    }

    saleSection.style.setProperty("display", "block", "important");
    saleGrid.innerHTML = "";

    saleItems.forEach(product => {
        const isSoldOut = product.badge && product.badge.toLowerCase() === 'sold out';
        const isFavorited = (typeof wishlistMemory !== 'undefined') ? wishlistMemory.includes(product.id) : false;
        
        // Create the card element frame first so it exists in memory!
        const saleCard = document.createElement('div');
        saleCard.className = `angel-card ${isSoldOut ? 'is-disabled' : ''}`;
        saleCard.setAttribute('onclick', `openQuickViewShield(${product.id})`);
        
        // Admin controls markup safely generated matching your authentication state variables

        const currentPriceValue = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
        const fallbackOldPrice = product.originalPrice || product.original_price || product.oldPrice;
        
        const originalPriceValue = fallbackOldPrice 
            ? (typeof fallbackOldPrice === 'number' ? fallbackOldPrice : parseFloat(fallbackOldPrice) || currentPriceValue)
            : Math.ceil(currentPriceValue * 1.25);

        const discountPercent = originalPriceValue > currentPriceValue 
            ? Math.round(((originalPriceValue - currentPriceValue) / originalPriceValue) * 100) 
            : 0;

        const liveStockData = MASTER_LIVE_INVENTORY_CACHE[product.id];
        const liveStockCount = liveStockData ? liveStockData.stock : (parseInt(product.stock) || 0);
        const isLowStock = !isSoldOut && liveStockCount > 0 && liveStockCount <= 2;
        const isHealthyStock = !isSoldOut && liveStockCount > 2;
        const stockFlagHTML = isLowStock 
            ? `<span class="angel-card-stock-flag"><i class="fas fa-fire"></i> Only ${liveStockCount} left</span>` 
            : (isHealthyStock ? `<span class="angel-card-stock-flag angel-card-stock-flag--available"><i class="fas fa-check-circle"></i> ${liveStockCount} in stock</span>` : '');

        const pricingLayoutHTML = `
            <div class="angel-card-price-row">
                <span class="angel-card-price">${formatCurrency(currentPriceValue)}</span>
                <span class="angel-card-price-was">${formatCurrency(originalPriceValue)}</span>
                ${discountPercent > 0 ? `<span class="angel-card-discount-pill">${discountPercent}% OFF</span>` : ''}
            </div>
        `;

        const safeTitleString = (product.title || '').replace(/'/g, "\\'");

        saleCard.innerHTML = `

            <div class="angel-card-media">
                <img src="${product.image}" loading="lazy" decoding="async" alt="${product.title}">
                <span class="angel-card-badge" style="background: linear-gradient(135deg, #cca43b, #b8862a); color: #fff;">${discountPercent > 0 ? discountPercent + '% Off' : (product.badge || 'Sale')}</span>
                <button class="angel-card-wishlist wishlist-heart-btn ${isFavorited ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleWishlistEngine(event, ${product.id}, this)" 
                        aria-label="Add to wishlist">
                    <i class="${isFavorited ? 'fas' : 'far'} fa-heart" style="font-size: 0.8rem; color: ${isFavorited ? 'var(--pink-accent, #ff1493)' : '#202c55'};"></i>
                </button>
                ${isSoldOut ? `<div class="angel-card-soldout-scrim">Restocking Soon</div>` : ''}
            </div>
            <div class="angel-card-body">
                <p class="angel-card-eyebrow">${product.category || 'Jewellery'} • Special Offer</p>
                <h3 class="angel-card-title">${product.title}</h3>
                ${stockFlagHTML}
                ${pricingLayoutHTML}
                <button class="angel-card-cta ${isSoldOut ? 'is-sold-out' : ''}" 
                        onclick="event.stopPropagation(); if(!${isSoldOut}) { handleCatalogCardAddToCart(${product.id}, '${safeTitleString}'); }"
                        ${isSoldOut ? 'disabled' : ''}>
                    <i class="${isSoldOut ? 'fas fa-hourglass-start' : 'fas fa-shopping-cart'}" style="font-size: 0.7rem;"></i> 
                    <span>${isSoldOut ? 'Restocking Soon' : 'Add to Cart'}</span>
                </button>
            </div>
        `;
        saleGrid.appendChild(saleCard);
    });
}

// =========================================================================
// 3. TRENDING SECTION RENDERER (FIXED)
// =========================================================================

function renderTrendingSection() {
    const trendingSection = document.getElementById('trendingSection');
    const trendingGrid = document.getElementById('trendingProductGrid');
    
    if (!trendingSection || !trendingGrid) return;

    const trendingItems = productDatabase.filter(product => 
        (product.badge && product.badge.toLowerCase() === 'trending') || 
        product.trending === true
    );

    if (trendingItems.length === 0) {
        trendingSection.style.setProperty("display", "none", "important");
        return;
    }

    trendingSection.style.setProperty("display", "block", "important");
    trendingGrid.innerHTML = "";

    trendingItems.forEach(product => {
        const isSoldOut = product.badge && product.badge.toLowerCase() === 'sold out';
        const isFavorited = wishlistMemory.includes(product.id);
        
        // Create the card element frame first so it exists in memory!
        const trendingCard = document.createElement('div');
        trendingCard.className = `angel-card ${isSoldOut ? 'is-disabled' : ''}`;
        trendingCard.setAttribute('onclick', `openQuickViewShield(${product.id})`);
        
        // Admin controls markup safely generated matching your authentication state variables

        const currentPriceValue = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
        const hasDiscount = product.originalPrice && product.originalPrice > product.price;
        const discountPercent = hasDiscount 
            ? Math.round(((product.originalPrice - currentPriceValue) / product.originalPrice) * 100) 
            : 0;

        const liveStockData = MASTER_LIVE_INVENTORY_CACHE[product.id];
        const liveStockCount = liveStockData ? liveStockData.stock : (parseInt(product.stock) || 0);
        const isLowStock = !isSoldOut && liveStockCount > 0 && liveStockCount <= 2;
        const isHealthyStock = !isSoldOut && liveStockCount > 2;
        const stockFlagHTML = isLowStock 
            ? `<span class="angel-card-stock-flag"><i class="fas fa-fire"></i> Only ${liveStockCount} left</span>` 
            : (isHealthyStock ? `<span class="angel-card-stock-flag angel-card-stock-flag--available"><i class="fas fa-check-circle"></i> ${liveStockCount} in stock</span>` : '');

        const pricingLayoutHTML = hasDiscount ? `
            <div class="angel-card-price-row">
                <span class="angel-card-price">${formatCurrency(currentPriceValue)}</span>
                <span class="angel-card-price-was">${formatCurrency(product.originalPrice)}</span>
                ${discountPercent > 0 ? `<span class="angel-card-discount-pill">${discountPercent}% OFF</span>` : ''}
            </div>
        ` : `
            <div class="angel-card-price-row"><span class="angel-card-price">${formatCurrency(currentPriceValue)}</span></div>
        `;

        const safeTitleString = (product.title || '').replace(/'/g, "\\'");

        trendingCard.innerHTML = `

            <div class="angel-card-media">
                <img src="${product.image}" loading="lazy" decoding="async" alt="${product.title}">
                <span class="angel-card-badge" style="background: linear-gradient(135deg, #202c55, #34407a); color: #fff;">${product.badge || 'Trending'}</span>
                <button class="angel-card-wishlist wishlist-heart-btn ${isFavorited ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleWishlistEngine(event, ${product.id}, this)" 
                        aria-label="Add to wishlist">
                    <i class="${isFavorited ? 'fas' : 'far'} fa-heart" style="font-size: 0.8rem; color: ${isFavorited ? 'var(--pink-accent, #ff1493)' : '#202c55'};"></i>
                </button>
                ${isSoldOut ? `<div class="angel-card-soldout-scrim">Restocking Soon</div>` : ''}
            </div>
            <div class="angel-card-body">
                <p class="angel-card-eyebrow">${product.category || 'Luxury Masterpiece'}</p>
                <h3 class="angel-card-title">${product.title}</h3>
                ${stockFlagHTML}
                ${pricingLayoutHTML}
                <button class="angel-card-cta ${isSoldOut ? 'is-sold-out' : ''}" 
                        onclick="event.stopPropagation(); if(!${isSoldOut}) { handleCatalogCardAddToCart(${product.id}, '${safeTitleString}'); }"
                        ${isSoldOut ? 'disabled' : ''}>
                    <i class="${isSoldOut ? 'fas fa-hourglass-start' : 'fas fa-shopping-cart'}" style="font-size: 0.7rem;"></i> 
                    <span>${isSoldOut ? 'Restocking Soon' : 'Add to Cart'}</span>
                </button>
            </div>
        `;
        trendingGrid.appendChild(trendingCard);
    });
}

// =========================================================================
// ANGEL JEWELLERY — "NEW THIS WEEK" ARRIVALS CAROUSEL
// Filters strictly on genuine created_at within the last 7 days. If
// nothing was actually added this week, the section hides entirely rather
// than padding itself out with older items relabeled as "new" — same
// honesty principle as the Flash Vault fix: no content pretending to be
// something it isn't.
// =========================================================================

function renderNewArrivalsSection() {
    const newArrivalsSection = document.getElementById('newArrivalsSection');
    const newArrivalsGrid = document.getElementById('newArrivalsProductGrid');

    if (!newArrivalsSection || !newArrivalsGrid) return;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newItems = productDatabase.filter(product => {
        if (!product.created_at) return false;
        const createdDate = new Date(product.created_at);
        if (isNaN(createdDate.getTime())) return false;
        const isSoldOut = product.badge && product.badge.toLowerCase() === 'sold out';
        return createdDate >= sevenDaysAgo && !isSoldOut;
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (newItems.length === 0) {
        newArrivalsSection.style.setProperty("display", "none", "important");
        return;
    }

    newArrivalsSection.style.setProperty("display", "block", "important");
    newArrivalsGrid.innerHTML = "";

    newItems.forEach(product => {
        const isFavorited = wishlistMemory.includes(product.id);

        const newArrivalCard = document.createElement('div');
        newArrivalCard.className = 'angel-card';
        newArrivalCard.setAttribute('onclick', `openQuickViewShield(${product.id})`);


        const currentPriceValue = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;

        const liveStockData = MASTER_LIVE_INVENTORY_CACHE[product.id];
        const liveStockCount = liveStockData ? liveStockData.stock : (parseInt(product.stock) || 0);
        const isLowStock = liveStockCount > 0 && liveStockCount <= 2;
        const isHealthyStock = liveStockCount > 2;
        const stockFlagHTML = isLowStock 
            ? `<span class="angel-card-stock-flag"><i class="fas fa-fire"></i> Only ${liveStockCount} left</span>` 
            : (isHealthyStock ? `<span class="angel-card-stock-flag angel-card-stock-flag--available"><i class="fas fa-check-circle"></i> ${liveStockCount} in stock</span>` : '');

        const safeTitleString = (product.title || '').replace(/'/g, "\\'");

        newArrivalCard.innerHTML = `

            <div class="angel-card-media">
                <img src="${product.image}" loading="lazy" decoding="async" alt="${product.title}">
                <span class="angel-card-badge" style="background: linear-gradient(135deg, #2a7b6a, #1f5f52); color: #fff;">New</span>
                <button class="angel-card-wishlist wishlist-heart-btn ${isFavorited ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleWishlistEngine(event, ${product.id}, this)" 
                        aria-label="Add to wishlist">
                    <i class="${isFavorited ? 'fas' : 'far'} fa-heart" style="font-size: 0.8rem; color: ${isFavorited ? 'var(--pink-accent, #ff1493)' : '#202c55'};"></i>
                </button>
            </div>
            <div class="angel-card-body">
                <p class="angel-card-eyebrow">${product.category || 'Luxury Masterpiece'}</p>
                <h3 class="angel-card-title">${product.title}</h3>
                ${stockFlagHTML}
                <div class="angel-card-price-row"><span class="angel-card-price">${formatCurrency(currentPriceValue)}</span></div>
                <button class="angel-card-cta" 
                        onclick="event.stopPropagation(); handleCatalogCardAddToCart(${product.id}, '${safeTitleString}');">
                    <i class="fas fa-shopping-cart" style="font-size: 0.7rem;"></i> 
                    <span>Add to Cart</span>
                </button>
            </div>
        `;
        newArrivalsGrid.appendChild(newArrivalCard);
    });
}

// =========================================================================
// ANGEL JEWELLERY — "RECENTLY VIEWED" STRIP
// Tracks product ids in localStorage (most-recent-first, capped at 10,
// deduplicated) whenever Quick View opens, and renders them back as a
// carousel. Hides entirely for first-time visitors with no view history,
// and quietly drops any id that no longer matches a real product (e.g.
// deleted since it was last viewed).
// =========================================================================

const RECENTLY_VIEWED_STORAGE_KEY = 'angelJewelleryRecentlyViewed';

const RECENTLY_VIEWED_MAX_ITEMS = 10;


function recordRecentlyViewedProduct(productId) {
    try {
        let viewedIds = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY)) || [];
        viewedIds = viewedIds.filter(id => id !== productId);
        viewedIds.unshift(productId);
        viewedIds = viewedIds.slice(0, RECENTLY_VIEWED_MAX_ITEMS);
        localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(viewedIds));
    } catch (err) {
        console.error('Could not save recently viewed history:', err);
    }
}


function renderRecentlyViewedSection() {
    const section = document.getElementById('recentlyViewedSection');
    const grid = document.getElementById('recentlyViewedProductGrid');
    if (!section || !grid) return;

    let viewedIds = [];
    try {
        viewedIds = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY)) || [];
    } catch (err) {
        viewedIds = [];
    }

    if (viewedIds.length === 0) {
        section.style.setProperty("display", "none", "important");
        return;
    }

    const viewedProducts = viewedIds
        .map(id => productDatabase.find(p => p.id === id))
        .filter(p => p !== undefined);

    if (viewedProducts.length === 0) {
        section.style.setProperty("display", "none", "important");
        return;
    }

    section.style.setProperty("display", "block", "important");
    grid.innerHTML = "";

    viewedProducts.forEach(product => {
        const isSoldOut = product.badge && product.badge.toLowerCase() === 'sold out';
        const isFavorited = wishlistMemory.includes(product.id);

        const card = document.createElement('div');
        card.className = `angel-card ${isSoldOut ? 'is-disabled' : ''}`;
        card.setAttribute('onclick', `openQuickViewShield(${product.id})`);

        const currentPriceValue = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
        const safeTitleString = (product.title || '').replace(/'/g, "\\'");

        const liveStockData = MASTER_LIVE_INVENTORY_CACHE[product.id];
        const liveStockCount = liveStockData ? liveStockData.stock : (parseInt(product.stock) || 0);
        const isLowStock = !isSoldOut && liveStockCount > 0 && liveStockCount <= 2;
        const isHealthyStock = !isSoldOut && liveStockCount > 2;
        const stockFlagHTML = isLowStock 
            ? `<span class="angel-card-stock-flag"><i class="fas fa-fire"></i> Only ${liveStockCount} left</span>` 
            : (isHealthyStock ? `<span class="angel-card-stock-flag angel-card-stock-flag--available"><i class="fas fa-check-circle"></i> ${liveStockCount} in stock</span>` : '');

        card.innerHTML = `
            <div class="angel-card-media">
                <img src="${product.image}" loading="lazy" decoding="async" alt="${product.title}">
                <button class="angel-card-wishlist wishlist-heart-btn ${isFavorited ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleWishlistEngine(event, ${product.id}, this)" 
                        aria-label="Add to wishlist">
                    <i class="${isFavorited ? 'fas' : 'far'} fa-heart" style="font-size: 0.8rem; color: ${isFavorited ? 'var(--pink-accent, #ff1493)' : '#202c55'};"></i>
                </button>
                ${isSoldOut ? `<div class="angel-card-soldout-scrim">Restocking Soon</div>` : ''}
            </div>
            <div class="angel-card-body">
                <p class="angel-card-eyebrow">${product.category || 'Luxury Masterpiece'}</p>
                <h3 class="angel-card-title">${product.title}</h3>
                ${stockFlagHTML}
                <div class="angel-card-price-row"><span class="angel-card-price">${formatCurrency(currentPriceValue)}</span></div>
                <button class="angel-card-cta ${isSoldOut ? 'is-sold-out' : ''}" 
                        onclick="event.stopPropagation(); if(!${isSoldOut}) { handleCatalogCardAddToCart(${product.id}, '${safeTitleString}'); }"
                        ${isSoldOut ? 'disabled' : ''}>
                    <i class="${isSoldOut ? 'fas fa-hourglass-start' : 'fas fa-shopping-cart'}" style="font-size: 0.7rem;"></i> 
                    <span>${isSoldOut ? 'Restocking Soon' : 'Add to Cart'}</span>
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}


function shareReferralViaWhatsApp() {
    const shareMessage = `Hey! I've been loving pieces from Angel Jewellery ✨ Check them out — mention my name when you message them to order and you'll get ₹100 off: ${window.location.origin}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(shareUrl, '_blank');
}


function addToCartEngine(productId) {
    const currentDb = (typeof productDatabase !== 'undefined') ? productDatabase : (window.productDatabase || []);
    const product = currentDb.find(p => p.id === productId);
    if (!product) return;

    let targetLineKey = `prod-${productId}`;
    let displayTitle = product.title;
    let finalPrice = product.price;
    let finalImage = product.image;
    let maxAllowedStock = parseInt(product.stock) || 0;
    let displayColor = "";

    // ➔ THE CORRECTION: Smart variant detection for both Main Page grid and Modal popups
    if (product.product_variants && product.product_variants.length > 0) {
        let chosenVariant = null;
        const cardEl = document.getElementById(`catalog-card-${productId}`);
        const isModalOpen = document.getElementById('quickviewModalShield') && document.getElementById('quickviewModalShield').style.display !== 'none';

        if (isModalOpen && window.activeVariantSelection) {
            // Case A: User is adding from the Quick View modal popup
            chosenVariant = window.activeVariantSelection;
        } else if (cardEl) {
            // Case B: User is adding directly from the main page card grid using active color dots
            const activeVariantId = cardEl.getAttribute('data-active-variant-id');
            if (activeVariantId) {
                chosenVariant = product.product_variants.find(v => v.id === parseInt(activeVariantId));
            }
        }

        // Fallback: If no variant was actively selected yet, default safely to the first row option (Index 0)
        if (!chosenVariant) {
            chosenVariant = product.product_variants[0];
        }

        targetLineKey = `variant-${chosenVariant.id}`;
        displayTitle = product.title;
        displayColor = chosenVariant.color_name;
        finalPrice = chosenVariant.price;
        finalImage = chosenVariant.image_url || product.image;
        maxAllowedStock = parseInt(chosenVariant.stock) || 0;
    }

    const existingSelection = shoppingCart.find(item => item.cartLineId === targetLineKey);
    const currentQtyInCart = existingSelection ? existingSelection.quantity : 0;

    if (maxAllowedStock <= 0) {
        alert(`We are sorry! This curation style is currently out of stock.`);
        return;
    }

    if (currentQtyInCart + 1 > maxAllowedStock) {
        alert(`Showroom Capacity Reached! Only ${maxAllowedStock} piece(s) are available, and you already have ${currentQtyInCart} inside your shopping bag.`);
        return;
    }

    if (existingSelection) {
        existingSelection.quantity += 1;
    } else {
        shoppingCart.push({
            cartLineId: targetLineKey,
            id: productId,
            title: displayTitle,
            color: displayColor,
            price: finalPrice,
            image: finalImage,
            quantity: 1,
            category: product.category || 'Luxury Collection'
        });
    }

    updateCartUI();
    
    if (typeof triggerCartNotification === 'function') {
        triggerCartNotification(displayColor ? `${displayTitle} (${displayColor})` : displayTitle);
    }
    
    // Close modal views safely if it was open, otherwise leave the storefront intact
    const modalShield = document.getElementById('quickviewModalShield');
    if (modalShield && modalShield.style.display !== 'none') {
        modalShield.style.display = "none";
    }
    window.activeVariantSelection = null; 
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

// =========================================================================
// ANGEL JEWELLERY — SHOPPING BAG ENGINE WITH VISUAL INLINE HIGHLIGHTS
// =========================================================================

function updateCartUI() {
    localStorage.setItem('shoppingCart', JSON.stringify(shoppingCart));
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
        
        // Hide shipping block if empty
        if (document.getElementById('checkoutShippingCalcBlock')) {
            document.getElementById('checkoutShippingCalcBlock').style.display = "none";
        }
        return;
    }

    if (cartFooterSection) cartFooterSection.style.display = "flex";
    if (shippingProgressBox) shippingProgressBox.style.display = "block";

    let isOversellingDetected = false;

    shoppingCart.forEach(item => {
        totalItemsCount += item.quantity;
        grandSubtotal += (item.price * item.quantity);

        // ➔ THE CRITICAL FIX: Extract true available stock for this SPECIFIC variant row
        let trueAvailableStock = 0;
        const currentDb = (typeof productDatabase !== 'undefined') ? productDatabase : (window.productDatabase || []);
        const parentProduct = currentDb.find(p => p.id === item.id);

        if (parentProduct && parentProduct.product_variants && parentProduct.product_variants.length > 0) {
            // If it's a variant line, find the exact row matching the color name
            const exactVariant = parentProduct.product_variants.find(v => v.color_name === item.color);
            trueAvailableStock = exactVariant ? parseInt(exactVariant.stock) : 0;
        } else {
            // Fallback for standard items without variants
            const liveCache = MASTER_LIVE_INVENTORY_CACHE[item.id];
            trueAvailableStock = liveCache ? (parseInt(liveCache.stock) || 0) : 0;
        }

        const isThisItemOversold = item.quantity > trueAvailableStock;

        let stockWarningLayout = "";
        let itemRowStyles = "display: flex; gap: 15px; padding: 15px; border-bottom: 1px solid #e8e8ef; position: relative; transition: all 0.3s ease; box-sizing: border-box; align-items: center;";

        if (isThisItemOversold) {
            isOversellingDetected = true;
            itemRowStyles += " background: #fffdfd; border: 1px solid #d9383a; border-radius: 6px; margin: 5px 0;";
            stockWarningLayout = `
                <div style="color: #d9383a; font-size: 0.72rem; font-weight: 700; margin-top: 5px; background: rgba(217, 56, 58, 0.06); padding: 4px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; font-family: 'Montserrat';">
                    <i class="fas fa-exclamation-triangle" style="font-size: 0.65rem;"></i> Max Available: ${trueAvailableStock} Piece${trueAvailableStock !== 1 ? 's' : ''}
                </div>
            `;
        }
        
        const itemRow = document.createElement('div');
        itemRow.style.cssText = itemRowStyles;
        itemRow.innerHTML = `
            <img src="${item.image}" alt="${item.title}" loading="lazy" decoding="async" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #e8e8ef;">
            <div style="flex-grow:1; text-align: left;">
                <h4 class="cart-item-title" style="margin: 0; font-size: 0.85rem; font-weight: 600; color: #111116; font-family: 'Montserrat';">${item.title} ${item.color ? `<span style="color:var(--pink-accent); font-size:0.75rem;">(${item.color})</span>` : ''}</h4>
                <p class="cart-item-meta" style="margin: 2px 0; font-size: 0.72rem; color: #777; font-family: 'Montserrat';">${item.category}</p>
                <p class="cart-item-price" style="margin: 2px 0 6px 0; font-size: 0.85rem; font-weight: 700; color: #202c55; font-family: 'Montserrat';">${formatCurrency(item.price)}</p>
                <div class="cart-item-controls" style="display: flex; align-items: center; gap: 12px; margin-top: 5px;">
                    <i class="fas fa-minus" onclick="changeQtyExplicit('${item.cartLineId}', -1)" style="cursor: pointer; font-size: 0.75rem; color: #777; padding: 4px;"></i>
                    <span style="font-size: 0.85rem; font-weight: 700; min-width: 15px; text-align: center; font-family: 'Montserrat'; color: ${isThisItemOversold ? '#d9383a' : '#111116'}">${item.quantity}</span>
                    <i class="fas fa-plus" onclick="changeQtyExplicit('${item.cartLineId}', 1)" style="cursor: pointer; font-size: 0.75rem; color: #777; padding: 4px;"></i>
                </div>
                ${stockWarningLayout}
            </div>
            <i class="fas fa-trash" onclick="removeFromCartExplicit('${item.cartLineId}')" style="cursor: pointer; color: #aaa; font-size: 0.9rem; padding: 5px; transition: color 0.2s;" onmouseover="this.style.color='#d9383a'" onmouseout="this.style.color='#aaa'"></i>
        `;
        cartItemsList.appendChild(itemRow);
    });

    if (isOversellingDetected) {
        const errorBanner = document.createElement('div');
        errorBanner.style.cssText = "background: #fff5f5; border: 1px solid #d9383a; border-radius: 6px; padding: 12px; margin: 10px 15px 20px 15px; font-family: 'Montserrat'; text-align: left; box-sizing: border-box;";
        errorBanner.innerHTML = `
            <h5 style="margin: 0 0 6px 0; color: #d9383a; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">⚠️ Stock Limit Exceeded</h5>
            <p style="margin: 0; color: #555; font-size: 0.75rem; line-height: 1.4; font-weight: 500;">Some pieces highlighted below exceed available showroom limits. Please use the minus buttons to adjust before checkout.</p>
        `;
        cartItemsList.insertBefore(errorBanner, cartItemsList.firstChild);
    }

    if (cartCountBadge) {
        cartCountBadge.innerText = totalItemsCount;
        cartCountBadge.style.opacity = "1";
    }
    
    // Calculate shipping progress triggers
    const SHIPPING_THRESHOLD_LIMIT = ANGEL_STORE_CONFIG.LOGISTICS.FREE_SHIPPING_THRESHOLD;
    const progressBarFill = document.getElementById('shippingBarFill');
    const progressText = document.getElementById('shippingProgressText');
    
    if (progressBarFill && progressText) {
        const structuralPercentage = Math.min((grandSubtotal / SHIPPING_THRESHOLD_LIMIT) * 100, 100);
        progressBarFill.style.width = `${structuralPercentage}%`;
        
        if (grandSubtotal >= SHIPPING_THRESHOLD_LIMIT) {
            progressText.innerHTML = `✨ <span style="color:#25d366; font-weight:600;">Free Shipping Unlocked!</span>`;
        } else {
            const gapAmount = SHIPPING_THRESHOLD_LIMIT - grandSubtotal;
            progressText.innerHTML = `Add <span style="color:var(--pink-accent); font-weight:600;">${formatCurrency(gapAmount)}</span> more for Free Delivery`;
        }
    }
    
    let discountAmount = 0;
    if (activeDiscount.code) {
        if (activeDiscount.type === "percentage") discountAmount = (grandSubtotal * activeDiscount.value) / 100;
        else if (activeDiscount.type === "flat") discountAmount = activeDiscount.value;
        if (discountAmount > grandSubtotal) discountAmount = grandSubtotal;
    }
    let netTotalBeforeShipping = grandSubtotal - discountAmount;

    // ➔ THE ELIGIBILITY CHECK: Runs cleanly using the calculated net total
    if (typeof evaluateShippingEligibilityState === 'function') {
        evaluateShippingEligibilityState(netTotalBeforeShipping);
    }

    let finalPayableTotal = netTotalBeforeShipping + currentCalculatedShippingFeeValue;

    let summaryHTML = `<div class="totals-row"><span>Items Subtotal:</span><span>${formatCurrency(grandSubtotal)}</span></div>`;
    if (discountAmount > 0) {
        summaryHTML += `<div class="totals-row discount-applied"><span>Discount (${activeDiscount.code}):</span><span>-${formatCurrency(discountAmount)}</span></div>`;
    }
    
    // Dynamically print delivery fees based on calculation status
    if (grandSubtotal >= SHIPPING_THRESHOLD_LIMIT) {
        summaryHTML += `<div class="totals-row"><span>Shipping Charges:</span><span style="color:#25d366; font-weight:700; text-transform:uppercase; font-size:0.75rem; letter-spacing:0.5px;">🎉 Free</span></div>`;
    } else if (currentCalculatedShippingFeeValue > 0) {
        summaryHTML += `<div class="totals-row"><span>Shipping Charges:</span><span style="color:#2a7b6a; font-weight:700;">${formatCurrency(currentCalculatedShippingFeeValue)}</span></div>`;
    } else {
        summaryHTML += `<div class="totals-row"><span>Shipping Charges:</span><span style="color:#ff1493; font-weight:600; font-size:0.75rem;">Calculation Pending</span></div>`;
    }

    summaryHTML += `<div class="totals-row grand-payable"><span>Final Payable:</span><span>${formatCurrency(finalPayableTotal)}</span></div>`;
    if (cartTotalQty) cartTotalQty.innerHTML = summaryHTML;
    
    finalTotalCost = finalPayableTotal; 

    // Handle checkout button configurations
    const primaryCheckoutButtonElement = document.getElementById('checkoutBtn');
    if (primaryCheckoutButtonElement) {
        if (isOversellingDetected) {
            primaryCheckoutButtonElement.innerHTML = `<i class="fas fa-ban"></i> Adjust Quantities to Unlock`;
            primaryCheckoutButtonElement.disabled = true;
            primaryCheckoutButtonElement.style.cssText = "margin-top: 20px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: 'Montserrat', sans-serif; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; padding: 14px 20px; border-radius: 6px; box-sizing: border-box; border: none; background: #e1e1e6 !important; color: #8e8e9f !important; cursor: not-allowed; box-shadow: none !important;";
        } else if (grandSubtotal < SHIPPING_THRESHOLD_LIMIT && !userShippingZipCodeVerified) {
            primaryCheckoutButtonElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> Calculate Shipping Above`;
            primaryCheckoutButtonElement.disabled = true;
            primaryCheckoutButtonElement.style.cssText = "margin-top: 20px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: 'Montserrat', sans-serif; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; padding: 14px 20px; border-radius: 6px; box-sizing: border-box; border: none; background: #f4f4f7 !important; color: #a1a1b5 !important; cursor: not-allowed;";
        } else {
            primaryCheckoutButtonElement.innerHTML = `<i class="fas fa-lock"></i> Secure Checkout Panel`;
            primaryCheckoutButtonElement.disabled = false;
            primaryCheckoutButtonElement.style.cssText = "margin-top: 20px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: 'Montserrat', sans-serif; font-size: 0.82rem; font-weight: 700; text-transform: uppercase; padding: 14px 20px; border-radius: 6px; box-sizing: border-box; border: none; background: var(--purple-primary, #202c55); color: #fff; cursor: pointer; transition: all 0.2s;";
        }
        primaryCheckoutButtonElement.style.display = "flex"; 
    }
}

// =========================================================================
// ANGEL JEWELLERY — INSTANT WISHLIST TOGGLE ENGINE (OUTLINE TO SOLID FILL)
// =========================================================================

function toggleWishlistEngine(event, productId, buttonElement) {
    if (event) event.stopPropagation(); // Stops the Quick View modal from opening

    // 1. Find what variant color is actively selected on the main grid card
    const cardEl = document.getElementById(`catalog-card-${productId}`);
    const currentDb = (typeof productDatabase !== 'undefined') ? productDatabase : (window.productDatabase || []);
    const product = currentDb.find(p => p.id === productId);
    
    let activeColorName = "Standard"; // Fallback for standalone items
    if (cardEl && product && product.product_variants && product.product_variants.length > 0) {
        const activeVariantId = cardEl.getAttribute('data-active-variant-id');
        if (activeVariantId) {
            const matched = product.product_variants.find(v => v.id === parseInt(activeVariantId));
            if (matched) activeColorName = matched.color_name;
        } else {
            activeColorName = product.product_variants[0].color_name;
        }
    }

    // Create a unique compound string key for this specific variation
    const wishlistStorageKey = `${productId}|${activeColorName}`;

    // 2. Add or remove this specific color from memory
    if (wishlistMemory.includes(wishlistStorageKey)) {
        wishlistMemory = wishlistMemory.filter(key => key !== wishlistStorageKey);
        if (buttonElement) {
            buttonElement.innerHTML = `<i class="far fa-heart" style="font-size: 0.85rem; color: #202c55; transition: color 0.2s ease;"></i>`;
            buttonElement.classList.remove('active');
        }
    } else {
        wishlistMemory.push(wishlistStorageKey);
        if (buttonElement) {
            buttonElement.innerHTML = `<i class="fas fa-heart" style="font-size: 0.85rem; color: var(--pink-accent, #ff1493); transition: color 0.2s ease;"></i>`;
            buttonElement.classList.add('active');
        }
    }

    // Save back to local storage cache
    localStorage.setItem('angel_wishlist_cache', JSON.stringify(wishlistMemory));
    
    // Refresh the Side Drawer view panel instantly
    updateWishlistUI();
}
// =========================================================================
// ANGEL JEWELLERY — WISHLIST UI CARDS RENDERING LOGIC
// =========================================================================

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

    wishlistMemory.forEach(wishlistKey => {
        // Parse out the components from the combined key
        const parts = wishlistKey.split('|');
        const id = parseInt(parts[0]);
        const colorName = parts[1] || "Standard";

        const currentDb = (typeof productDatabase !== 'undefined') ? productDatabase : (window.productDatabase || []);
        const item = currentDb.find(p => p.id === id);
        if (!item) return;

        const cardVariants = item.product_variants || item.Product_Variants || item.variants || [];
        
        let displayPrice = item.price;
        let displayImage = item.image || 'assets/placeholder.png';
        let displayColorTitle = colorName !== "Standard" ? ` <span style="color:var(--pink-accent, #ff1493); font-size:0.75rem; font-weight:600;">(${colorName})</span>` : ""; 
        let trueStockLevel = 0;

        // Find the exact variant match for the favorited color item row
        const matchedVariant = cardVariants.find(v => v.color_name === colorName) || (cardVariants.length > 0 ? cardVariants[0] : null);

        if (matchedVariant) {
            displayPrice = matchedVariant.price;
            displayImage = matchedVariant.image_url || displayImage;
            trueStockLevel = parseInt(matchedVariant.stock) || 0;
        } else {
            const liveCache = MASTER_LIVE_INVENTORY_CACHE[item.id];
            trueStockLevel = liveCache ? (parseInt(liveCache.stock) || 0) : (parseInt(item.stock) || 0);
        }

        const isSoldOut = trueStockLevel <= 0 || (item.badge && item.badge.toLowerCase() === 'sold out');
        let checkoutButtonMarkup = "";
        
        if (isSoldOut) {
            checkoutButtonMarkup = `
                <button type="button" disabled style="background: #e1e1e6 !important; color: #8e8e9f !important; border: 1px solid #dcdce0 !important; cursor: not-allowed; width: 100%; height: 38px; font-size: 0.7rem; font-weight: 600; font-family: 'Montserrat'; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 4px;">
                    <i class="fas fa-lock" style="font-size:0.65rem; margin-right:4px;"></i> Vault Restocking
                </button>
            `;
        } else {
            const safeTitleString = (item.title || '').replace(/'/g, "\\'");
            // We pass the exact variant color directly into the custom button configurations
            checkoutButtonMarkup = `
                <button type="button" onclick="handleCatalogCardAddToCart(${item.id}, '${safeTitleString}')" style="background: #202c55; color: #ffffff; border: none; border-radius: 4px; width: 100%; height: 38px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; font-family: 'Montserrat'; transition: background 0.2s;">
                    ADD TO CART
                </button>
            `;
        }

        const row = document.createElement('div');
        row.className = "cart-item-row";
        row.style.cssText = "display: flex; gap: 15px; padding: 15px; border-bottom: 1px solid #e8e8ef; position: relative; box-sizing: border-box; align-items: center;";
        row.innerHTML = `
            <img src="${displayImage}" alt="${item.title}" style="width: 55px; height: 55px; object-fit: cover; border-radius: 4px; border: 1px solid #e8e8ef; opacity: ${isSoldOut ? '0.5' : '1'};">
            <div style="flex-grow:1; text-align: left; padding-right: 25px; box-sizing: border-box;">
                <h4 class="cart-item-title" style="margin: 0; font-size: 0.82rem; font-weight: 600; color: #111116; font-family: 'Montserrat';">${item.title}${displayColorTitle}</h4>
                <p class="cart-item-price" style="margin: 2px 0 8px 0; font-size: 0.82rem; font-weight: 700; color: #202c55; font-family: 'Montserrat';">${formatCurrency(displayPrice)}</p>
                <div style="width: 100%; max-width: 140px;">
                    ${checkoutButtonMarkup}
                </div>
            </div>
            <!-- Trash can icon safely targets the combined string identifier to delete exactly that item option block -->
            <i class="fas fa-trash" onclick="toggleWishlistEngineFromDrawer('${wishlistKey}')" style="cursor:pointer; color:#aaa; font-size:0.9rem; position:absolute; right:15px; top:50%; transform:translateY(-50%); transition: color 0.2s;" onmouseover="this.style.color='#d9383a'" onmouseout="this.style.color='#aaa'"></i>
        `;
        wishlistItemsList.appendChild(row);
    });
}

// ➔ Helper method added to seamlessly clear specific variant tokens directly from the drawer items list view

function toggleWishlistEngineFromDrawer(wishlistKey) {
    wishlistMemory = wishlistMemory.filter(k => k !== wishlistKey);
    localStorage.setItem('angel_wishlist_cache', JSON.stringify(wishlistMemory));
    updateWishlistUI();
    
    // Force the main layout blocks to re-evaluate heart graphics configurations
    if (typeof filterCatalog === 'function') filterCatalog();
}


// =========================================================================
// SUPABASE PRODUCTION CHANNEL — PROMO CODES & DISCOUNT LOGIC (CRUD & LIVE VALIDATION)
// =========================================================================


let couponRegistryCache = []; // Dynamic local memory layer replacing hardcoded dictionary

// 1. READ CHANNEL: Fetch active promos from database & render consumer helper tag badges

async function loadLiveCouponDatabaseEngine() {
    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;
    const targetUrl = `${sbUrl}/rest/v1/Coupons?select=*&order=code.asc`;

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: { 'apikey': sbKey, 'Authorization': `Bearer ${sbKey}`, 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Supabase returned code: ${response.status}`);
        
        couponRegistryCache = await response.json();
        mountCouponHelperBadges(); // Automatically re-draw badges on client storefront
        
    } catch (err) {
        console.error("❌ Failed to synchronize active coupon registry layers:", err);
    }
}


function mountCouponHelperBadges() {
    const helpersGroup = document.getElementById('couponHelpersGroup');
    if (!helpersGroup) return;
    
    helpersGroup.innerHTML = "";
    couponRegistryCache.forEach(promo => {
        const badge = document.createElement('span');
        badge.className = "coupon-tag-badge";
        badge.innerHTML = `<i class="fas fa-tag"></i> ${promo.code}`;
        badge.addEventListener('click', () => {
            const inputField = document.getElementById('couponInput');
            if (inputField) {
                inputField.value = promo.code;
                applyCouponEngineAction();
            }
        });
        helpersGroup.appendChild(badge);
    });
}

// 2. STOREFRONT CHECKOUT ENGINE: Validates client inputs against database cache

function applyCouponEngineAction() {
    const inputField = document.getElementById('couponInput');
    const statusMsg = document.getElementById('couponStatusMessage');
    if (!inputField || !statusMsg) return;

    const inputtedCode = inputField.value.toUpperCase().trim();
    
    // Find matching coupon record inside our dynamic cached runtime array
    const matchedPromo = couponRegistryCache.find(c => c.code.toUpperCase() === inputtedCode);
    
    if (matchedPromo) {
        activeDiscount = {
            code: matchedPromo.code,
            type: matchedPromo.type,    // 'percentage' or 'flat'
            value: parseFloat(matchedPromo.value)
        };
        statusMsg.style.display = "block";
        statusMsg.style.color = "#25d366";
        statusMsg.innerText = `Coupon code ${matchedPromo.code} successfully applied!`;
        updateCartUI();
    } else {
        statusMsg.style.display = "block";
        statusMsg.style.color = "#ff4444";
        statusMsg.innerText = "Invalid luxury promotional key code.";
    }
}

// 3. ADMIN MANAGEMENT PANEL: Generate live interactive grid view for active promos

function triggerCartNotification(title) {
    const toast = document.createElement('div');
    toast.className = "copied-toast";
    toast.innerHTML = `<i class="fas fa-check-circle"></i> Added ${title} to selection`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 2400);

    // A brief sparkle + cart-icon pulse — kept quick and quiet so it reads
    // as a nice touch rather than a distraction. Hooked here rather than
    // in each individual "Add to Cart" button since every add-to-cart path
    // already calls this same notification function.
    spawnAddToCartSparkles();

    const cartBadge = document.getElementById('cartCountBadge');
    if (cartBadge) {
        cartBadge.classList.remove('cart-badge-pulse');
        void cartBadge.offsetWidth; // restart the animation if triggered again quickly
        cartBadge.classList.add('cart-badge-pulse');
    }
}


function spawnAddToCartSparkles() {
    const cartIconAnchor = document.getElementById('cartCountBadge');
    if (!cartIconAnchor) return;
    const rect = cartIconAnchor.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    const sparkleCount = 6;
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('span');
        sparkle.className = 'cart-sparkle-particle';
        sparkle.innerHTML = '✦';
        const angle = (Math.PI * 2 * i) / sparkleCount + (Math.random() * 0.6 - 0.3);
        const distance = 22 + Math.random() * 14;
        sparkle.style.left = `${originX}px`;
        sparkle.style.top = `${originY}px`;
        sparkle.style.setProperty('--sparkle-x', `${Math.cos(angle) * distance}px`);
        sparkle.style.setProperty('--sparkle-y', `${Math.sin(angle) * distance}px`);
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 950);
    }
}


// Global state memory tracker to lock down exactly which variant row is active
if (typeof window.activeVariantSelection === 'undefined') {
    window.activeVariantSelection = null;
}


function openQuickViewShield(id) {
    const currentDb = (typeof productDatabase !== 'undefined') ? productDatabase : (window.productDatabase || []);
    const product = currentDb.find(p => p.id === id);
    if (!product) return;

    recordRecentlyViewedProduct(id);

    // Pull variants safely
    const rawVariants = product.product_variants || product.Product_Variants || product.variants || [];
    
    // ➔ THE FILTER: Only treat it as a valid color variant list if there's more than 1 option
    // and the first option isn't just a placeholder like "Standard" or "Default"
    let modalVariants = [];
    if (rawVariants.length > 1) {
        modalVariants = rawVariants;
    } else if (rawVariants.length === 1) {
        const firstColorName = String(rawVariants[0].color_name || rawVariants[0].colorName || '').toLowerCase().trim();
        if (firstColorName !== '' && firstColorName !== 'standard' && firstColorName !== 'default') {
            modalVariants = rawVariants;
        }
    }

    let initialPrice = product.price;
    let initialImg = product.image;

    if (rawVariants.length > 0) {
        const firstVariant = rawVariants[0];
        initialPrice = firstVariant.price;
        initialImg = firstVariant.image_url || firstVariant.imageUrl || initialImg;
    }

    // 1. Clean up any previous dynamic rows to prevent rendering duplicate blocks
    const oldMobileBlock = document.getElementById('qvMobileVariantWrapperBlock');
    if (oldMobileBlock) oldMobileBlock.remove();
    const oldDesktopBlock = document.getElementById('qvDesktopVariantWrapperBlock');
    if (oldDesktopBlock) oldDesktopBlock.remove();
    const oldDynamicBlock = document.getElementById('qvDynamicVariantWrapperBlock');
    if (oldDynamicBlock) oldDynamicBlock.remove();

    // ➔ 2. CONDITIONAL INJECTION: Only build the HTML if there are actual valid variants to show
    if (modalVariants.length > 0) {
        window.activeVariantSelection = modalVariants[0];

        const generatePaletteHTML = (isMobileInstance) => {
            const suffix = isMobileInstance ? '-mob' : '-desk';
            return `
                <p class="qv-variant-label" style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #77778b; margin-bottom: 10px; padding:0; text-align: ${isMobileInstance ? 'center' : 'left'};">Select Color Profile:</p>
                <div class="qv-variant-flex-row" style="display: flex !important; flex-wrap: wrap !important; gap: 10px !important; width: 100% !important; justify-content: ${isMobileInstance ? 'center' : 'flex-start'} !important;">
                    ${modalVariants.map((variant, idx) => {
                        const variantStock = variant.stock !== undefined ? variant.stock : (variant.stock_level || 0);
                        const isSoldOut = parseInt(variantStock) <= 0;
                        
                        const colorHex = variant.color_hex || variant.colorHex || '#ccc';
                        const colorName = variant.color_name || variant.colorName || 'Standard';

                        const activeStyle = idx === 0 
                            ? "background: #202c55 !important; color: #ffffff !important; border-color: #202c55 !important;" 
                            : "background: #ffffff !important; color: #111116 !important; border-color: #e8e8ef !important;";
                        const disabledStyle = isSoldOut ? "opacity: 0.4; cursor: not-allowed;" : "";

                        return `
                            <button type="button"
                                    class="qv-new-variant-pill${suffix}" 
                                    data-variant-id="${variant.id}"
                                    style="display: inline-flex !important; align-items: center !important; gap: 8px !important; padding: 8px 14px !important; border: 1px solid !important; border-radius: 20px !important; cursor: pointer !important; font-size: 0.78rem !important; font-weight: 600 !important; font-family: 'Montserrat', sans-serif !important; transition: all 0.2s !important; ${activeStyle} ${disabledStyle}"
                                    ${isSoldOut ? 'disabled' : ''}>
                                <span style="width: 10px !important; height: 10px !important; border-radius: 50% !important; background: ${colorHex} !important; display: inline-block !important; border: 1px solid rgba(0,0,0,0.1) !important;"></span>
                                <span>${colorName}</span>
                            </button>
                        `;
                    }).join('')}
                </div>
            `;
        };

        // POSITION 1: Mobile Palette sits inside the Left column right after the Image
        const imgElement = document.getElementById('qvImage');
        if (imgElement) {
            const mobileWrapper = document.createElement('div');
            mobileWrapper.id = 'qvMobileVariantWrapperBlock';
            mobileWrapper.className = 'qv-variant-mobile-only-container';
            mobileWrapper.style.cssText = "margin-top: 15px; width: 100%; box-sizing: border-box; clear: both;";
            mobileWrapper.innerHTML = generatePaletteHTML(true);
            imgElement.parentNode.insertBefore(mobileWrapper, imgElement.nextSibling);
        }

        // POSITION 2: Desktop Palette sits in the Right column right above the Price field
        const priceBlock = document.getElementById('qvPrice');
        if (priceBlock) {
            const desktopWrapper = document.createElement('div');
            desktopWrapper.id = 'qvDesktopVariantWrapperBlock';
            desktopWrapper.className = 'qv-variant-desktop-only-container';
            desktopWrapper.style.cssText = "margin: 15px 0; width: 100%; box-sizing: border-box; clear: both;";
            desktopWrapper.innerHTML = generatePaletteHTML(false);
            priceBlock.parentNode.insertBefore(desktopWrapper, priceBlock);
        }

        // Synchronize Click Listeners across both element trees
        const setupSyncListeners = (selectorClass) => {
            document.querySelectorAll(selectorClass).forEach(btn => {
                btn.addEventListener('click', function() {
                    const chosenVariantId = parseInt(this.getAttribute('data-variant-id'));
                    const matchedVariant = modalVariants.find(v => v.id === chosenVariantId);
                    
                    if (!matchedVariant) return;
                    window.activeVariantSelection = matchedVariant;

                    document.querySelectorAll('.qv-new-variant-pill-mob, .qv-new-variant-pill-desk').forEach(b => {
                        const bId = parseInt(b.getAttribute('data-variant-id'));
                        if (bId === chosenVariantId) {
                            b.style.background = "#202c55"; b.style.color = "#ffffff"; b.style.borderColor = "#202c55";
                        } else {
                            b.style.background = "#ffffff"; b.style.color = "#111116"; b.style.borderColor = "#e8e8ef";
                        }
                    });

                    const variantImg = matchedVariant.image_url || matchedVariant.imageUrl;
                    if (variantImg) document.getElementById('qvImage').src = variantImg;
                    if (matchedVariant.price) document.getElementById('qvPrice').innerText = formatCurrency(matchedVariant.price);
                    
                    const variantStock = matchedVariant.stock !== undefined ? matchedVariant.stock : (matchedVariant.stock_level || 0);
                    updateTopRightScarcityBadge(variantStock);
                });
            });
        };

        setupSyncListeners('.qv-new-variant-pill-mob');
        setupSyncListeners('.qv-new-variant-pill-desk');

    } else {
        // Safe reset if no color mapping profiles are found
        window.activeVariantSelection = (rawVariants.length > 0) ? rawVariants[0] : null;
    }

    // Core Text Node Assignments
    document.getElementById('qvImage').src = (window.activeVariantSelection && (window.activeVariantSelection.image_url || window.activeVariantSelection.imageUrl)) ? (window.activeVariantSelection.image_url || window.activeVariantSelection.imageUrl) : product.image; 
    document.getElementById('qvTitle').innerText = product.title; 
    document.getElementById('qvCategory').innerText = String(product.category || '').toUpperCase(); 
    document.getElementById('qvPrice').innerText = formatCurrency(window.activeVariantSelection ? window.activeVariantSelection.price : product.price); 

    const descContainer = document.getElementById('qvDescription'); 
    if (descContainer) {
        descContainer.innerText = product.description ? product.description.trim() : "Handcrafted with premium materials. This elegant curation reflects unparalleled luxury and design precision."; 
    }

    const fallbackStock = parseInt(product.stock) || 0; 
    const currentStock = window.activeVariantSelection ? (window.activeVariantSelection.stock !== undefined ? window.activeVariantSelection.stock : window.activeVariantSelection.stock_level) : fallbackStock;
    updateTopRightScarcityBadge(currentStock); 

    const qvBtn = document.getElementById('qvAddToCartBtn'); 
    if (qvBtn) {
        qvBtn.innerHTML = `Add To Cart`; 
        qvBtn.disabled = false; 
        qvBtn.onclick = () => {
            addToCartEngine(product.id); 
        };
    }

    renderQuickViewPairingRecommendations(product);

    document.getElementById('quickviewModalShield').style.display = "flex"; 
    angelModalPushHistory(closeQuickViewShield);
}

// =========================================================================
// ANGEL JEWELLERY — "SIMILAR PRODUCTS" CROSS-SELL CAROUSEL
// Populates the previously-dormant qvPairingRecommendationSection: the
// markup already existed in the Quick View modal, but nothing ever filled
// it in. Matches same-category items first, tops up with same-style items
// if there aren't enough, and hides the whole section if nothing matches.
// =========================================================================

function renderQuickViewPairingRecommendations(currentProduct) {
    const section = document.getElementById('qvPairingRecommendationSection');
    const track = document.getElementById('qvPairingCarouselTrack');
    if (!section || !track) return;

    const currentDb = (typeof productDatabase !== 'undefined') ? productDatabase : (window.productDatabase || []);
    if (!currentDb || currentDb.length === 0) {
        section.style.display = 'none';
        return;
    }

    const currentCategory = String(currentProduct.category || '').trim().toLowerCase();
    const currentStyle = String(currentProduct.style || '').trim().toLowerCase();

    // Priority 1: other items in the same category
    let matches = currentDb.filter(p => p && p.id !== currentProduct.id &&
        String(p.category || '').trim().toLowerCase() === currentCategory);

    // Priority 2: top up with same-style items if category alone isn't enough
    if (matches.length < 4 && currentStyle) {
        const styleMatches = currentDb.filter(p => p && p.id !== currentProduct.id &&
            currentStyle === String(p.style || '').trim().toLowerCase() &&
            !matches.some(m => m.id === p.id));
        matches = matches.concat(styleMatches);
    }

    matches = matches.slice(0, 8);

    if (matches.length === 0) {
        section.style.display = 'none';
        track.innerHTML = '';
        return;
    }

    track.innerHTML = matches.map(p => {
        const safeTitle = (p.title || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const tilePrice = typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0;
        return `
            <div class="qv-pairing-tile" onclick="openQuickViewShield(${p.id})" title="${safeTitle}">
                <div class="qv-pairing-tile-img">
                    <img src="${p.image || 'assets/placeholder.png'}" loading="lazy" decoding="async" alt="${safeTitle}" onerror="this.src='assets/placeholder.png'">
                </div>
                <p class="qv-pairing-tile-title">${p.title}</p>
                <p class="qv-pairing-tile-price">${formatCurrency(tilePrice)}</p>
            </div>
        `;
    }).join('');

    section.style.display = 'block';
}


function updateTopRightScarcityBadge(stockCount) {
    const indicator = document.getElementById('qvVaultScarcityIndicator'); 
    if (!indicator) return;

    if (stockCount <= 0) {
        indicator.style.cssText = "display:inline-block; font-family:'Montserrat'; font-size:0.65rem; font-weight:700; text-transform:uppercase; padding:4px 10px; background:rgba(108,117,125,0.1); color:#6c757d; border-radius:2px;"; 
        indicator.innerHTML = `<i class="fas fa-times-circle"></i> Sold Out`; 
    } else if (stockCount <= 2) {
        indicator.style.cssText = "display:inline-block; font-family:'Montserrat'; font-size:0.65rem; font-weight:700; text-transform:uppercase; padding:4px 10px; background:rgba(255,20,147,0.08); color:#ff1493; border-radius:2px;"; 
        indicator.innerHTML = `<i class="fas fa-fire"></i> Only ${stockCount} Left!`; 
    } else {
        indicator.style.cssText = "display:inline-block; font-family:'Montserrat'; font-size:0.65rem; font-weight:700; text-transform:uppercase; padding:4px 10px; background:rgba(42,123,106,0.1); color:#2a7b6a; border-radius:2px;"; 
        indicator.innerHTML = `<i class="fas fa-check-circle"></i> ${stockCount} Available`;
    }
}

// =========================================================================
// ANGEL JEWELLERY — MOBILE BACK-BUTTON MODAL HANDLING
// On mobile, opening a modal (Quick View, Cart, Wishlist, Checkout) never
// told the browser's own history about it — so pressing the phone's
// physical back button had nothing "modal" to go back to, and instead
// left the site entirely. Fix: push a history entry when a modal opens,
// and intercept the back button to close the modal instead of navigating
// away. If nothing is open, back behaves exactly as it always did.
// =========================================================================

let angelModalStack = [];

let angelModalPopstateInProgress = false;


function angelModalPushHistory(closeCallback) {
    if (angelModalPopstateInProgress) return;
    angelModalStack.push(closeCallback);
    history.pushState({ angelModalDepth: angelModalStack.length }, '');
}

// Call when a modal is closed via an on-page action (X button, overlay
// click, "Back to Main" link) — NOT via the physical back button. This
// removes the matching history entry so a later back-press doesn't need
// an extra, confusing press just to actually leave the site.

function angelModalConsumeHistory() {
    if (angelModalPopstateInProgress) return;
    if (angelModalStack.length > 0) {
        angelModalStack.pop();
        history.back();
    }
}


window.addEventListener('popstate', function() {
    if (angelModalStack.length > 0) {
        angelModalPopstateInProgress = true;
        const closeCallback = angelModalStack.pop();
        try {
            if (typeof closeCallback === 'function') closeCallback();
        } finally {
            angelModalPopstateInProgress = false;
        }
    }
    // else: nothing tracked as open — let the browser leave the page as normal.
});


function closeQuickViewShield() {
    const modalShield = document.getElementById('quickviewModalShield');
    if (modalShield) modalShield.style.display = "none";
    angelModalConsumeHistory();
}


function toggleCartDrawer(event) {
    if (event) event.preventDefault();
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (!drawer) return;
    
    if (drawer.style.right === "0px") {
        drawer.style.right = "-100%";
        if (overlay) overlay.style.display = "none";
        angelModalConsumeHistory();
    } else {
        const wishlist = document.getElementById('wishlistDrawer');
        if (wishlist) wishlist.style.right = "-100%";
        
        drawer.style.right = "0px";
        if (overlay) overlay.style.display = "block";
        angelModalPushHistory(forceCloseCartDrawer);
    }
}


function toggleWishlistDrawer(event) {
    if (event) event.preventDefault();
    const drawer = document.getElementById('wishlistDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (!drawer) return;
    
    if (drawer.style.right === "0px") {
        drawer.style.right = "-100%";
        if (overlay) overlay.style.display = "none";
        angelModalConsumeHistory();
    } else {
        const cart = document.getElementById('cartDrawer');
        if (cart) cart.style.right = "-100%";
        
        drawer.style.right = "0px";
        if (overlay) overlay.style.display = "block";
        angelModalPushHistory(forceCloseWishlistDrawer);
    }
}

// Idempotent closers used specifically as back-button callbacks — these
// check current state before acting, so they can never accidentally
// re-open a drawer the way blindly re-calling the toggle function could.

function forceCloseCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && drawer.style.right === "0px") {
        drawer.style.right = "-100%";
        if (overlay) overlay.style.display = "none";
    }
}

function forceCloseWishlistDrawer() {
    const drawer = document.getElementById('wishlistDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer && drawer.style.right === "0px") {
        drawer.style.right = "-100%";
        if (overlay) overlay.style.display = "none";
    }
}

// =========================================================================
// ANGEL JEWELLERY — SANITIZED NATURAL SCROLL CONTROLLER
// =========================================================================

window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('backToTopBtn');
    
    // Smoothly apply shadow branding context as the page rolls past threshold
    if (window.scrollY > 15) {
        if (header) header.classList.add('scrolled');
    } else {
        if (header) header.classList.remove('scrolled');
    }
    
    // Back to top floating utility button toggle
    if (backToTopBtn) {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
});


window.addEventListener('DOMContentLoaded', () => {
    const storedCartPayload = localStorage.getItem('shoppingCart');
    if (storedCartPayload) {
        try {
            shoppingCart = JSON.parse(storedCartPayload);
            setTimeout(updateCartUI, 300); 
        } catch (storageError) {
            console.error("Failed to parse saved cart cache items matrix:", storageError);
            shoppingCart = [];
        }
    }
    const storedWishlistPayload = localStorage.getItem('wishlistMemory');
    if (storedWishlistPayload) {
        try {
            wishlistMemory = JSON.parse(storedWishlistPayload);
            // Re-trigger the Wishlist UI panel so it populates right away
            setTimeout(() => {
                if (typeof updateWishlistUI === 'function') updateWishlistUI();
            }, 350);
        } catch (wishlistStorageError) {
            console.error("Failed to parse saved wishlist cache items:", wishlistStorageError);
            wishlistMemory = [];
        }
    }
    loadProductDatabaseEngine();
    loadLiveCouponDatabaseEngine();
    initializeLuxuryBannerCarousel();
    setTimeout(renderFlashVaultShowroom, 800);
    applyStrictIndianPhoneValidationRules('invClientPhone');
    applyStrictIndianPhoneValidationRules('trackingPhoneInput');
    
    // Search parameter routing alignment
    let searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterCatalog(this.value);
        });
    }
    
    const hideSoldOutCheckbox = document.getElementById('hideSoldOutCheckbox');
    if (hideSoldOutCheckbox) {
        hideSoldOutCheckbox.addEventListener('change', function() {
            filterCatalog();
        });
    }

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
        const mobileNavigationLinks = navMenu.querySelectorAll('a');
        mobileNavigationLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
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
    // if (applyCouponBtn) applyCouponBtn.addEventListener('click', applyCouponEngineAction);

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
            const targetSection = document.getElementById('catalog');
            if (targetSection) {
                const offsetPosition = targetSection.getBoundingClientRect().top + window.scrollY - 90;
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

    const trackingInputField = document.getElementById("trackingPhoneInput");
    const trackingActionButton = document.getElementById("trackBtn");

    if (trackingInputField && trackingActionButton) {
        trackingInputField.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                trackingActionButton.click();
            }
        });
    }

    // Floating WhatsApp configuration setup
    const whatsappBubble = document.getElementById("whatsappFloatingBubble");
    if (whatsappBubble) {
        const defaultText = "Hello Angel Jewellery!";
        whatsappBubble.href = `${ANGEL_STORE_CONFIG.CONCIERGE_CHANNELS.WHATSAPP_LINK_URI}?text=${encodeURIComponent(defaultText)}`;
    }

    // Hydrate footer context contact anchors automatically
    const footerPhoneAnchor = document.getElementById("footerPhoneLink");
    const footerWhatsappSocialAnchor = document.getElementById("footerWhatsappSocial");

    if (footerPhoneAnchor) {
        footerPhoneAnchor.href = `tel:+${ANGEL_STORE_CONFIG.CONCIERGE_CHANNELS.WHATSAPP_PHONE_RAW}`;
    }

    if (footerWhatsappSocialAnchor) {
        const footerWelcomeMessage = "Hello Angel Jewellery! I am looking for details from your footer section links.";
        footerWhatsappSocialAnchor.href = `${ANGEL_STORE_CONFIG.CONCIERGE_CHANNELS.WHATSAPP_LINK_URI}?text=${encodeURIComponent(footerWelcomeMessage)}`;
    }

    const interactivePhoneBubble = document.getElementById("phoneFloatingBubble");
    if (interactivePhoneBubble) {
        interactivePhoneBubble.href = `tel:+${ANGEL_STORE_CONFIG.CONCIERGE_CHANNELS.WHATSAPP_PHONE_RAW}`;
    }

    const gridContainer = document.getElementById("trendingShowroomGridCanvas");
    if (!gridContainer || !ANGEL_STORE_CONFIG.TRENDING_COLLECTION) return;

    const curationItems = ANGEL_STORE_CONFIG.TRENDING_COLLECTION;

    // Compile trending gemstone showcase cards cleanly
    gridContainer.innerHTML = curationItems.map((item, itemIdx) => {
        const defaultVariant = item.variants[0];
        const swatchesHtml = item.variants.map((variant, varIdx) => `
            <button type="button" class="showroom-swatch-dot" 
                data-item-idx="${itemIdx}" 
                data-var-idx="${varIdx}" 
                style="width: 20px; height: 20px; border-radius: 50%; background-color: ${variant.hexColor}; border: 2px solid ${varIdx === 0 ? '#202c55' : '#ffffff'}; box-shadow: 0 0 0 1.5px ${varIdx === 0 ? '#202c55' : 'rgba(32,44,85,0.15)'}; cursor: pointer; padding: 0; outline: none; transition: all 0.3s ease;">
            </button>
        `).join('');

        return `
            <div class="trending-showcase-card" id="trendingCard_${itemIdx}" data-selected-var-idx="0" style="background: #ffffff; border: 1px solid var(--pink-accent); border-radius: 8px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 15px rgba(32,44,85,0.01); transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1); box-sizing: border-box; text-align: center;">
                <div style="width: 100%; background: #ffffff; padding: 10px; box-sizing: border-box; position: relative; overflow: hidden; margin-bottom: 20px;">
                    <img id="trendingVisual_${itemIdx}" src="${defaultVariant.imageFile}" alt="${item.title}" style="width: 100%; height: auto; max-height: 280px; object-fit: contain; display: block; margin: 0 auto; transition: opacity 0.25s ease;">
                </div>
                <div style="margin-bottom: 18px;">
                    <p style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #77778b; margin: 0 0 10px 0;">
                        Gemstone: <span id="trendingGemstoneLabel_${itemIdx}" style="color: #ff1493; font-weight: 800;">${defaultVariant.colorName}</span>
                    </p>
                    <div style="display: flex; gap: 10px; justify-content: center; align-items: center;">${swatchesHtml}</div>
                </div>
                <div style="margin-bottom: 22px;">
                    <h3 style="color: #202c55; font-size: 1.15rem; font-weight: 600; margin: 0 0 6px 0; letter-spacing: 0.5px;">${item.title}</h3>
                    <p style="color: #6c757d; font-size: 0.8rem; line-height: 1.5; margin: 0 0 12px 0; padding: 0 5px;">${item.description}</p>
                    <p style="color: #202c55; font-size: 1.1rem; font-weight: 700; margin: 0;">${item.basePrice}</p>
                </div>
                <button type="button" class="trending-acquire-action-btn" data-item-idx="${itemIdx}" style="background: #202c55; color: #ffffff; width: 100%; height: 44px; border: none; border-radius: 4px; font-family: 'Montserrat', sans-serif; font-size: 0.8rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.3s ease; outline: none;">
                    ADD TO CART
                </button>
            </div>`;
    }).join('');


    gridContainer.addEventListener("click", (event) => {
        const swatch = event.target.closest(".showroom-swatch-dot");
        if (!swatch) return;

        const itemIdx = parseInt(swatch.getAttribute("data-item-idx"));
        const varIdx = parseInt(swatch.getAttribute("data-var-idx"));
        const selectedVariant = curationItems[itemIdx].variants[varIdx];

        const cardElement = document.getElementById(`trendingCard_${itemIdx}`);
        const imageElement = document.getElementById(`trendingVisual_${itemIdx}`);
        const labelElement = document.getElementById(`trendingGemstoneLabel_${itemIdx}`);

        if (!cardElement || !imageElement || !labelElement) return;

        cardElement.setAttribute("data-selected-var-idx", varIdx);
        imageElement.style.opacity = "0.2";
        setTimeout(() => {
            imageElement.src = selectedVariant.imageFile;
            labelElement.textContent = selectedVariant.colorName;
            imageElement.style.opacity = "1";
        }, 150);

        cardElement.querySelectorAll(".showroom-swatch-dot").forEach((btn, idx) => {
            btn.style.boxShadow = idx === varIdx ? "0 0 0 1.5px #202c55" : "0 0 0 1.5px rgba(32,44,85,0.15)";
            btn.style.transform = idx === varIdx ? "scale(1.1)" : "scale(1)";
        });
    });

    // Handle checkout clicks from trending banner rows
    gridContainer.addEventListener("click", (event) => {
        const actionBtn = event.target.closest(".trending-acquire-action-btn");
        if (!actionBtn) return;

        const itemIdx = parseInt(actionBtn.getAttribute("data-item-idx"));
        const cardElement = document.getElementById(`trendingCard_${itemIdx}`);
        const currentVarIdx = parseInt(cardElement.getAttribute("data-selected-var-idx"));

        const baseItem = curationItems[itemIdx];
        const currentVariant = baseItem.variants[currentVarIdx];

        const compiledBespokeTitlePayload = `${baseItem.title} (${currentVariant.colorName})`;
        const numericCleanPriceValue = parseFloat(baseItem.basePrice.replace(/[^0-9.]/g, '')) || 0;
        const safeNumericVariantId = 202600 + (itemIdx * 10) + currentVarIdx;

        const structuredMockProductItem = {
            id: safeNumericVariantId, 
            title: compiledBespokeTitlePayload,
            price: numericCleanPriceValue,
            category: "Exclusive Selection",
            image: currentVariant.imageFile
        };

        const existingSelection = shoppingCart.find(item => item.id === safeNumericVariantId);
        if (existingSelection) {
            existingSelection.quantity += 1;
        } else {
            shoppingCart.push({ ...structuredMockProductItem, quantity: 1 });
        }
        
        updateCartUI();
        actionBtn.textContent = "Secured In Bag";
        actionBtn.style.background = "#ff1493";
        actionBtn.style.borderColor = "#ff1493";
        
        triggerCartNotification(compiledBespokeTitlePayload);
        
        setTimeout(() => {
            actionBtn.textContent = "ADD TO CART";
            actionBtn.style.background = "#202c55";
            actionBtn.style.borderColor = "#202c55";
        }, 1500);
    });
});



let globalPayableAmountInPaise = 0; 

// =========================================================================
// ANGEL JEWELLERY — ON-DEMAND RAZORPAY SDK LOADER
// Previously checkout.js was loaded render-blocking in <head> on every page
// view, even for visitors who never reach checkout. Now it's fetched once,
// lazily, the moment the invoice/checkout screen actually opens.
// =========================================================================

let razorpaySDKLoadPromise = null;

function loadRazorpaySDK() {
    if (window.Razorpay) return Promise.resolve();
    if (razorpaySDKLoadPromise) return razorpaySDKLoadPromise;

    razorpaySDKLoadPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existing) {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', () => reject(new Error('Failed to load Razorpay SDK')));
            return;
        }
        const scriptNode = document.createElement('script');
        scriptNode.src = 'https://checkout.razorpay.com/v1/checkout.js';
        scriptNode.onload = () => resolve();
        scriptNode.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
        document.head.appendChild(scriptNode);
    });
    return razorpaySDKLoadPromise;
}


function openInvoiceScreen() {
    if (shoppingCart.length === 0) return;

    // Kick off the Razorpay SDK fetch as soon as checkout opens, in the
    // background, so it's already loaded (or close to it) by the time the
    // customer finishes filling in the form and hits submit.
    loadRazorpaySDK().catch(err => console.error(err));

    const invoiceOverlay = document.getElementById('invoiceOverlayScreen');
    const itemsContainer = document.getElementById('invoiceItemsContainer');
    const pricingSummary = document.getElementById('invoicePricingSummary');

    if (!invoiceOverlay || !itemsContainer || !pricingSummary) return;

    document.getElementById('invClientAddress').value = localStorage.getItem('angel_customer_address') || "";
    document.getElementById('invClientName').value = localStorage.getItem('angel_customer_name') || "";
    document.getElementById('invClientPhone').value = localStorage.getItem('angel_customer_phone') || "";

    itemsContainer.innerHTML = shoppingCart.map(item => `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e8e8ef; width: 100%; box-sizing: border-box; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 12px; text-align: left; overflow: hidden; flex: 1;">
                <img src="${item.image}" style="width: 45px; height: 45px; min-width: 45px; object-fit: cover; border-radius: 4px; border: 1px solid #e8e8ef;">
                <div style="overflow: hidden;">
                    <h4 style="margin: 0; font-size: 0.85rem; font-weight: 600; color: var(--text-dark-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'Montserrat';">${item.title}</h4>
                    <p style="margin: 2px 0 0 0; font-size: 0.72rem; color: var(--text-muted); font-weight: 500; font-family: 'Montserrat';">Category: ${item.category} • Qty: ${item.quantity}</p>
                </div>
            </div>
            <span style="font-weight: 600; font-size: 0.88rem; color: var(--purple-primary); white-space: nowrap; font-family: 'Montserrat';">${formatCurrency(item.price * item.quantity)}</span>
        </div>
    `).join('');

    let grandSubtotal = shoppingCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discountAmount = 0;
    if (activeDiscount.code) {
        if (activeDiscount.type === "percentage") discountAmount = (grandSubtotal * activeDiscount.value) / 100;
        else if (activeDiscount.type === "flat") discountAmount = activeDiscount.value;
        if (discountAmount > grandSubtotal) discountAmount = grandSubtotal;
    }
    let netTotalBeforeShipping = grandSubtotal - discountAmount;

    // ➔ THE UPGRADE: FETCH CONFIG LOGISTICS PARAMETERS DYNAMICALLY
    const SHIPPING_THRESHOLD_LIMIT = ANGEL_STORE_CONFIG.LOGISTICS.FREE_SHIPPING_THRESHOLD;
    const FLAT_SHIPPING_CHARGE_RATE = ANGEL_STORE_CONFIG.LOGISTICS.FLAT_SHIPPING_FEE;

    let shippingChargeAmount = 0;
    if (netTotalBeforeShipping > 0 && netTotalBeforeShipping < SHIPPING_THRESHOLD_LIMIT) {
        shippingChargeAmount = FLAT_SHIPPING_CHARGE_RATE;
    } else {
        shippingChargeAmount = 0;
    }

    let finalPayableTotal = netTotalBeforeShipping + shippingChargeAmount;
    globalPayableAmountInPaise = finalPayableTotal * 100;

    pricingSummary.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-weight:500; color:var(--text-muted);">
            <span>Bag Subtotal:</span><span style="color:var(--text-dark-primary); font-weight:600;">${formatCurrency(grandSubtotal)}</span>
        </div>
        ${discountAmount > 0 ? `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; color:#25d366; font-weight:600;">
            <span>Coupon Promo (${activeDiscount.code}):</span><span>-${formatCurrency(discountAmount)}</span>
        </div>` : ''}
        
        <!-- DYNAMIC SHIPPING ENTRY ROW CONTAINER -->
        <div style="display:flex; justify-content:space-between; margin-bottom:10px; color:var(--text-muted); font-weight:500;">
            <span>Shipping Charges :</span>
            ${shippingChargeAmount === 0 && netTotalBeforeShipping >= SHIPPING_THRESHOLD_LIMIT ? 
                `<span style="color:#25d366; font-weight:700; text-transform:uppercase; font-size:0.8rem; letter-spacing:0.5px;">🎉 FREE</span>` : 
                `<span style="color:var(--text-dark-primary); font-weight:600;">${formatCurrency(shippingChargeAmount)}</span>`
            }
        </div>
        
        <div style="display:flex; justify-content:space-between; font-size:1.1rem; font-weight:700; border-top:2px solid var(--purple-primary); padding-top:12px; margin-top:10px; color:var(--purple-primary);">
            <span>Total Gross Bill:</span><span>${formatCurrency(finalPayableTotal)}</span>
        </div>
    `;

    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (drawer) drawer.style.right = "-100%";
    if (overlay) overlay.style.display = "none";
    
    // Add layout tracking fix if configured
    if (typeof document.body.classList.add === 'function') {
        document.body.classList.add('modal-open-active');
    }
    
    invoiceOverlay.style.display = 'flex';
    angelModalPushHistory(closeInvoiceScreen);
}


function closeInvoiceScreen() {
    document.getElementById('invoiceOverlayScreen').style.display = 'none';
    angelModalConsumeHistory();
}


async function initiateRazorpayPaymentProcess(event) {
    event.preventDefault();

    // Safety net: openInvoiceScreen() already started loading the SDK in the
    // background, but if the customer submits before it finishes, wait here.
    try {
        await loadRazorpaySDK();
    } catch (err) {
        console.error(err);
        alert("Payment gateway failed to load. Please check your internet connection and try again.");
        return;
    }

    const name = document.getElementById('invClientName').value.trim();
    const phone = document.getElementById('invClientPhone').value.trim();
    const address = document.getElementById('invClientAddress').value.trim();
    
    const nameErrorElement = document.getElementById('invNameValidationError');
    const phoneErrorElement = document.getElementById('invPhoneValidationError');
    const addressErrorElement = document.getElementById('invAddressValidationError');
    const indiaPhoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
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
            phoneErrorElement.innerText = "Please enter 10-digit contact number. \n (For Ex: 9999988888)";
            phoneErrorElement.style.display = "block";
        }
        if (isFormSubmissionValid) { document.getElementById('invClientPhone').focus(); }
        isFormSubmissionValid = false;
    }else if (!indiaPhoneRegex.test(phone)) {
        if (phoneErrorElement) {
            phoneErrorElement.innerText = "Please enter 10-digit contact number. \n (For Ex: 9999988888)";
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
        "key": ANGEL_STORE_CONFIG.PAYMENT_GATEWAY.RAZORPAY_KEY_ID, 
        "amount": globalPayableAmountInPaise, 
        "currency": ANGEL_STORE_CONFIG.PAYMENT_GATEWAY.CURRENCY_CODE,
        "name": ANGEL_STORE_CONFIG.PAYMENT_GATEWAY.MERCHANT_NAME,
        "description": "Angel Jewellery Checkout Window",
        "image": "angel-logo-new.webp", 
        "handler": function (transactionResponse) {
            // ➔ THE CRITICAL FLASH FIX: Immediately mask the screen
            const invoiceOverlay = document.getElementById('invoiceOverlayScreen');
            if (invoiceOverlay) {
                invoiceOverlay.style.setProperty('display', 'none', 'important'); // Hide invoice instantly
            }
            
            const luxuryLoader = document.getElementById('luxuryPaymentLoaderOverlay');
            if (luxuryLoader) {
                luxuryLoader.style.setProperty('display', 'flex', 'important'); // Force loading mask on home page
            }
            
            console.log("💳 Payment successful! Transaction ID:", transactionResponse.razorpay_payment_id);

            // Continue with the execution loop to process data
            executePostPaidWhatsAppDispatch(transactionResponse.razorpay_payment_id, name, phone, address);
        },
        "prefill": {
            "name": name,
            "contact": phone
        },
        "theme": {
            "color": ANGEL_STORE_CONFIG.PAYMENT_GATEWAY.THEME_HEX_COLOR 
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

    const generatedLink = `${ANGEL_STORE_CONFIG.CONCIERGE_CHANNELS.WHATSAPP_LINK_URI}?text=${encodeURIComponent(messageText)}`;
    
    document.getElementById('confWhatsAppBtn').onclick = () => {
        window.open(generatedLink, '_blank');
    };

    const orderImageUrlsString = shoppingCart.map(item => item.image || '').filter(url => url !== '').join(', ');
    
    // =========================================================================
    // SUPABASE PRODUCTION CHANNEL — SECURE ZERO-LIMIT ORDER SUBMISSION
    // =========================================================================
    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;

    // Flattening the payload and matching standard relational column keys
    const supabaseOrderPayload = {
        "payment_id": paymentId,
        "customer_name": name,
        "phone": phone,
        "address": address,
        "order_items": shoppingCart.map(i => `${i.title} (x${i.quantity})`).join(", "),
        "order_images": orderImageUrlsString,
        "total_amount": finalTotalCost, 
        "status": "Paid"
    };

   // Post data straight to your master Supabase Orders table index
   fetch(`${sbUrl}/rest/v1/Orders`, {
        method: "POST",
        headers: {
            "apikey": sbKey,
            "Authorization": `Bearer ${sbKey}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        },
        body: JSON.stringify(supabaseOrderPayload)
    })
    .then(async response => {
        if (!response.ok) throw new Error(`Supabase interface returned code: ${response.status}`);
        console.log("Supabase transaction logged successfully.");
        
        await executeSupabaseInventoryDeduction(shoppingCart);
        if (typeof loadProductDatabaseEngine === "function") {
             await loadProductDatabaseEngine(); 
        }
        
        // Wipe local runtime cart states
        shoppingCart = [];
        activeDiscount = { code: "", type: "", value: 0 };
        if (localStorage.getItem('shoppingCart')) localStorage.removeItem('shoppingCart');
        
        if (document.getElementById('couponInput')) document.getElementById('couponInput').value = "";
        if (document.getElementById('customerAddress')) document.getElementById('customerAddress').value = "";
        
        updateCartUI();
        closeInvoiceScreen(); 

        // Clear the transition loading mask
        const luxuryLoader = document.getElementById('luxuryPaymentLoaderOverlay');
        if (luxuryLoader) luxuryLoader.style.display = 'none';

        // ➔ TARGET RESOLUTION: Ensure this points to the exact screen container you use (e.g., confirmationScreen)
        if (confirmationScreen) {
            confirmationScreen.style.setProperty('display', 'flex', 'important');
        }
    })
    .catch(err => {
        console.error("Supabase network order submission stream drop:", err);
        
        // Fallback execution so the app doesn't freeze for the client if database fails
        shoppingCart = [];
        updateCartUI();
        closeInvoiceScreen(); 
        confirmationScreen.style.display = 'flex';
    });
}


function exitConfirmationAndReset() {
    document.getElementById('confirmationPageScreen').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =========================================================================
// SUPABASE PUBLIC CHANNEL — LIVE CLIENT ORDER VISUAL TRACKER WITH GLOBAL TOP NOTE
// =========================================================================

async function executeLiveOrderTrackingSearch() {
    const inputPhone = document.getElementById('trackingPhoneInput').value.trim();
    const statusMsg = document.getElementById('trackingStatusMessage');
    const container = document.getElementById('trackingResultsContainer');
    
    if (!inputPhone) {
        alert("Please enter a valid phone number.");
        return;
    }

    statusMsg.style.display = "block";
    statusMsg.innerHTML = `
        <div class="tracking-loading-row">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Retrieving your order history...</span>
        </div>
    `;
    container.innerHTML = "";

    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;
    const trackingUrl = `${sbUrl}/rest/v1/Orders?phone=eq.${inputPhone}&order=created_at.desc`;

    try {
        const response = await fetch(trackingUrl, {
            method: 'GET',
            headers: {
                'apikey': sbKey,
                'Authorization': `Bearer ${sbKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error("Failed to scan orders database index.");
        const customerOrders = await response.json();

        if (customerOrders.length === 0) {
            statusMsg.innerHTML = `<div class="tracking-empty-state">⚠️ No orders found for that phone number.</div>`;
            return;
        }

        statusMsg.innerHTML = `
            <p class="tracking-found-count">Found <strong>${customerOrders.length}</strong> order${customerOrders.length === 1 ? '' : 's'}:</p>
            <div class="tracking-policy-note">
                <i class="far fa-clock"></i>
                <span>Orders can be cancelled within 24 hours of placement.</span>
            </div>
        `;
        
        container.innerHTML = customerOrders.map(order => {
            const ordPaymentId = order.payment_id || 'N/A';
            const ordStatus = String(order.status || 'Paid').trim().toLowerCase();
            const isShipped = ordStatus === 'shipped';
            const isCancelled = ordStatus === 'cancelled';
            
            let displayStatus = "Order Placed";
            if (isShipped) displayStatus = "Shipped";
            if (isCancelled) displayStatus = "Cancelled";
            
            let badgeStyle = "background: rgba(32, 44, 85, 0.08); color: var(--purple-primary);";
            let cardAccentClass = "order-card--pending";
            if (isShipped) { badgeStyle = "background: rgba(255, 20, 147, 0.1); color: var(--pink-accent);"; cardAccentClass = "order-card--shipped"; }
            if (isCancelled) { badgeStyle = "background: rgba(217, 56, 58, 0.1); color: #d9383a;"; cardAccentClass = "order-card--cancelled"; }

            const ordDate = order.created_at ? new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'short' }) : 'N/A';
            const ordTotalAmount = order.total_amount ? (typeof order.total_amount === 'number' ? formatCurrency(order.total_amount) : order.total_amount) : '₹0';

            // 24-HOUR CANCELLATION TIMER MATHEMATICS
            const orderTimestamp = order.created_at ? new Date(order.created_at).getTime() : 0;
            const currentTimestamp = new Date().getTime();
            const hoursElapsed = orderTimestamp ? (currentTimestamp - orderTimestamp) / (1000 * 60 * 60) : 999;
            
            const isWithinCancellationWindow = hoursElapsed < 24;
            const isEligibleToCancel = isWithinCancellationWindow && !isShipped && !isCancelled;

            let cancellationControlMarkup = "";
            if (isEligibleToCancel) {
                cancellationControlMarkup = `
                    <button onclick="toggleCancellationFormView('${order.id}')" id="cancelTriggerBtn_${order.id}" class="order-action-btn order-action-btn--cancel-toggle">
                        <i class="fas fa-times-circle"></i> Cancel Order
                    </button>

                    <div id="cancelFormBlock_${order.id}" class="tracking-cancel-form" style="display: none;">
                        <h5>Cancellation Details</h5>
                        
                        <div class="tracking-cancel-field">
                            <label>Reason for Cancellation:</label>
                            <textarea id="cancelReason_${order.id}" placeholder="Please let us know your reason..."></textarea>
                        </div>

                        <div class="tracking-cancel-field">
                            <label>PhonePe Number for Refund:</label>
                            <input type="text" id="cancelPhonePe_${order.id}" maxlength="10" placeholder="e.g. 9876543210">
                        </div>

                        <div class="tracking-cancel-actions">
                            <button onclick="submitClientCancellationForm(event, ${order.id}, '${ordPaymentId}')" class="order-action-btn order-action-btn--refund">Confirm Cancel</button>
                            <button onclick="toggleCancellationFormView('${order.id}')" class="order-action-btn order-action-btn--ghost">Keep Order</button>
                        </div>
                    </div>
                `;
            }

            let logisticsMetadataHTML = ""; 
            if (isShipped) {
                const partner = order.courier || 'Standard Logistics';
                const trackingNum = order.tracking_number || 'N/A';
                logisticsMetadataHTML = `
                    <div class="tracking-logistics-pill">
                        <i class="fas fa-truck"></i> <span>${partner}: <strong>${trackingNum}</strong></span>
                    </div>
                `;
            }

            const itemNamesArray = (order.order_items || '').split(',').map(str => str.trim());
            const itemImagesArray = (order.order_images || '').split(',').map(str => str.trim());

            const inventoryRowsHTML = itemNamesArray.map((itemString, index) => {
                if (!itemString) return '';
                let parsedTitle = itemString;
                let parsedQuantity = "1";
                const qtyMatch = itemString.match(/\(x(\d+)\)/);
                if (qtyMatch) {
                    parsedTitle = itemString.replace(qtyMatch[0], '').trim();
                    parsedQuantity = qtyMatch[1];
                }
                const matchedImgUrl = itemImagesArray[index] || 'assets/placeholder.png';

                return `
                    <tr>
                        <td class="order-item-thumb-cell">
                            <img src="${matchedImgUrl}" loading="lazy" decoding="async" onerror="this.src='assets/placeholder.png'">
                        </td>
                        <td class="order-item-title-cell">${parsedTitle}</td>
                        <td class="order-item-qty-cell">×${parsedQuantity}</td>
                    </tr>
                `;
            }).join('');

            return `
            <div class="order-card ${cardAccentClass}">
                
                <div class="order-card-header">
                    <div class="order-card-header-left">
                        <span class="order-card-txn-id">Ref ID: <strong>#${ordPaymentId}</strong></span>
                        <h4>${order.customer_name}</h4>
                    </div>
                    <div class="order-card-header-right">
                        <div class="order-card-date-amount">
                            <span class="order-card-date">Ordered: ${ordDate}</span>
                            <span class="order-card-amount">${ordTotalAmount}</span>
                        </div>
                        <span class="order-card-status-badge" style="${badgeStyle}">${displayStatus}</span>
                        ${logisticsMetadataHTML}
                    </div>
                </div>

                <div class="order-card-items">
                    <table>
                        <thead>
                            <tr><th>Preview</th><th>Item</th><th>Qty</th></tr>
                        </thead>
                        <tbody>
                            ${inventoryRowsHTML}
                        </tbody>
                    </table>
                </div>

                <div class="order-card-footer">
                    <div class="order-card-address">
                        <i class="fas fa-map-marker-alt"></i>
                        <span><strong>Shipping To:</strong> ${order.address}</span>
                    </div>

                    ${cancellationControlMarkup}
                </div>

            </div>
            `;
        }).join('');

    } catch (error) {
        console.error("Tracking rendering breakdown caught:", error);
        statusMsg.innerHTML = `<span style="color:#d9383a; font-size:0.85rem;">Something went wrong loading your orders. Please try again shortly.</span>`;
    }
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


function closeTrackingScreenOverlay() {
    document.getElementById('trackingScreenOverlay').style.display = 'none';
}

// =========================================================================
// SUPABASE SECURE PANEL — SYNCING REAL DATA MATRIX FOR ANALYTICS
// =========================================================================

function copyShippingLabelToClipboard(name, phone, address, buttonElement) {
    const formattedLabelText = `CONSIGNEE: ${name}\nPHONE: ${phone}\nADDRESS: ${address}`;
    
    navigator.clipboard.writeText(formattedLabelText).then(() => {
        const originalButtonHtml = buttonElement.innerHTML;
        buttonElement.style.background = "#25d366";
        buttonElement.style.borderColor = "#25d366";
        buttonElement.style.color = "#ffffff";
        buttonElement.innerHTML = `<i class="fas fa-check"></i> Copied!`;
        
        setTimeout(() => {
            buttonElement.style.background = "transparent";
            buttonElement.style.borderColor = "var(--border-subtle, #e8e8ef)";
            buttonElement.style.color = "var(--text-dark-primary, #111116)";
            buttonElement.innerHTML = originalButtonHtml;
        }, 2000);
    }).catch(err => console.error("Clipboard copy failed:", err));
}




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
    loadProductDatabaseEngine();
    initializeLuxuryBannerCarousel();
});

// =========================================================================
// ANGEL JEWELLERY — THREE-TAB RESPONSIVE ADMINISTRATIVE CONSOLE LAYOUT
// =========================================================================

function generateDynamicCatalogFilters() {
    let foldersGrid = document.getElementById('jewelryCategoryFoldersGrid');
    const mainSectionTitle = document.getElementById('collection-main-title');
    const productGridCanvas = document.getElementById('productGrid');
    const navHeader = document.getElementById('showroomNavigationHeader');
    const navTitle = document.getElementById('activeShowroomCategoryTitle');

    if (!foldersGrid) foldersGrid = productGridCanvas;
    if (!foldersGrid || !productDatabase || productDatabase.length === 0) return;

    // Enforce folder gallery structural display setups
    if (currentSelectedFilterCategoryKey === "all") {
        if (productGridCanvas) productGridCanvas.style.setProperty("display", "none", "important");
        if (mainSectionTitle) mainSectionTitle.style.setProperty("display", "block", "important");
        if (navTitle) navTitle.style.setProperty("display", "none", "important");
        if (navHeader) navHeader.style.setProperty("display", "none", "important");
        
        foldersGrid.style.setProperty("display", "flex", "important");
        foldersGrid.style.setProperty("flex-wrap", "wrap", "important");
        foldersGrid.style.setProperty("justify-content", "center", "important");
        foldersGrid.style.setProperty("gap", "22px", "important");
    }

    const categoryMap = {};
    productDatabase.forEach(product => {
        if (product.category) {
            const cleanKey = product.category.trim();
            const lowerKey = cleanKey.toLowerCase();

            // ➔ THE FILTER UPGRADE: Ignore "flash" or "flash vault" completely from the circle grid listings
            if (lowerKey === 'flash' || lowerKey === 'flash vault') {
                return; // Skips adding this item to the folders map grid array
            }

            if (!categoryMap[cleanKey]) {
                categoryMap[cleanKey] = {
                    name: cleanKey,
                    itemCount: 0,
                    thumbnail: product.image || 'assets/placeholder.png'
                };
            }
            categoryMap[cleanKey].itemCount += 1;
        }
    });

    // Re-maps remaining premium categories into ultra-premium minimalist circle nodes
    // Re-maps remaining premium categories into true minimalist circle nodes
    foldersGrid.innerHTML = Object.values(categoryMap).map(folder => {
        return `
            <div class="category-node-card" onclick="selectShowroomCategoryFolder('${folder.name}')">
                <div class="category-node-circle">
                    <img src="${folder.thumbnail}" alt="${folder.name}" loading="lazy" decoding="async" onerror="this.src='assets/placeholder.png'">
                </div>
                <h3 class="category-node-name">${folder.name}</h3>
                <p class="category-node-count">${folder.itemCount} Piece${folder.itemCount === 1 ? '' : 's'}</p>
            </div>
        `;
    }).join('');
}

// =========================================================================
// ANGEL JEWELLERY — CATALOG LEVEL VIEW SCREEN NAVIGATION ROUTERS
// =========================================================================

function selectShowroomCategoryFolder(targetCategoryName) {
    currentSelectedFilterCategoryKey = targetCategoryName;

    const foldersGrid = document.getElementById('jewelryCategoryFoldersGrid');
    const productGridCanvas = document.getElementById('productGrid');
    const navHeader = document.getElementById('showroomNavigationHeader');
    const navTitle = document.getElementById('activeShowroomCategoryTitle');

    // 1. Hide the circles and reveal the product cards grid layer
    if (foldersGrid) foldersGrid.style.display = "none";
    if (productGridCanvas) productGridCanvas.style.setProperty("display", "grid", "important");
    
    // 2. Force open the empty wrapper section template block framework
    const parentSectionWrapper = productGridCanvas?.closest('.products-section');
    if (parentSectionWrapper) parentSectionWrapper.style.setProperty("display", "block", "important");
    
    // 3. Dynamic layout updates: Pop up the subtitle and the navigation row together
    if (navTitle) {
        navTitle.innerText = `${targetCategoryName} Collection`;
    }
    if (navHeader) {
        navHeader.style.setProperty("display", "flex", "important");
    }

    if (typeof filterCatalog === "function") {
        filterCatalog();
    }

    const scrollAnchor = document.getElementById('catalog') || productGridCanvas;
    if (scrollAnchor) {
        window.scrollTo({ top: scrollAnchor.offsetTop - 20, behavior: 'smooth' });
    }
}


function returnToMainShowroomFolders() {
    currentSelectedFilterCategoryKey = "all";

    const foldersGrid = document.getElementById('jewelryCategoryFoldersGrid');
    const productGridCanvas = document.getElementById('productGrid');
    const navHeader = document.getElementById('showroomNavigationHeader');
    const parentSectionWrapper = productGridCanvas?.closest('.products-section');

    // 1. Hide product layers
    if (productGridCanvas) productGridCanvas.style.display = "none";
    if (parentSectionWrapper) parentSectionWrapper.style.setProperty("display", "none", "important");
    
    // 2. Hide subtitle and back-action hub wrapper completely
    if (navHeader) navHeader.style.setProperty("display", "none", "important");

    // 3. Re-draw circle folders grid gallery back onto canvas lines
    if (foldersGrid) foldersGrid.style.setProperty("display", "flex", "important");

    if (typeof generateDynamicCatalogFilters === "function") {
        generateDynamicCatalogFilters();
    }
    if (typeof renderFlashVaultShowroom === 'function') {
        renderFlashVaultShowroom();
    }

    const scrollAnchor = document.getElementById('catalog');
    if (scrollAnchor) {
        window.scrollTo({ top: scrollAnchor.offsetTop - 20, behavior: 'smooth' });
    }
}


function applyCustomFilterTabButtonStyles(buttonNode, isCurrentlySelected) {
    const baseStyles = `padding: 10px 18px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 20px; cursor: pointer; transition: all 0.2s ease; white-space: nowrap; display: inline-block;`;
    if (isCurrentlySelected) {
        buttonNode.style.cssText = baseStyles + `background: var(--purple-primary, #202c55); color: #ffffff; border: 1px solid var(--purple-primary, #202c55); box-shadow: 0 2px 6px rgba(32, 44, 85, 0.12); font-weight: 700;`;
    } else {
        buttonNode.style.cssText = baseStyles + `background: #fff; color: var(--text-dark-primary, #111116); border: 1px solid #111116; font-weight: 600;`;
    }
}


function refreshFilterTabStylesAndTriggerRender() {
    const allTabButtons = document.querySelectorAll('.filter-category-tab-btn');
    allTabButtons.forEach(btn => {
        const buttonTargetKey = btn.getAttribute('data-category-target') || 'all';
        applyCustomFilterTabButtonStyles(btn, currentSelectedFilterCategoryKey === buttonTargetKey);
    });
    const liveInputEl = document.getElementById('searchInput');
    const currentSearchText = liveInputEl ? liveInputEl.value : "";
    filterCatalog(currentSearchText);
}

function getBadgeCustomStyles(badgeText) {
    const text = String(badgeText || '').trim().toLowerCase();
    let bgColor = 'var(--purple-primary, #202c55)';
    let textColor = '#ffffff';
    if (text === 'sale' || text.includes('off') || text.includes('discount')) bgColor = '#d9383a'; 
    else if (text === 'trending' || text === 'hot' || text === 'popular') bgColor = '#04693a'; 
    else if (text === 'new' || text === 'arrival') bgColor = '#2a7b6a'; 
    else if (text === 'limited' || text.includes('exclusive')) bgColor = 'var(--pink-accent, #ff1493)'; 
    else if (text === 'sold out' || text.includes('restock')) bgColor = '#6c757d'; 
    return `background: ${bgColor} !important; color: ${textColor} !important;`;
}

// =========================================================================
// SUPABASE PRODUCTION CHANNEL — LIVE STOCK BACKGROUND SYNCHRONIZATION
// =========================================================================

async function synchronizeLiveStorefrontInventory() {
    const sbUrl = ANGEL_STORE_CONFIG?.DATABASE?.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG?.DATABASE?.SUPABASE_ANON_KEY;
    
    if (!sbUrl || !sbKey) {
        console.error("❌ Inventory sync aborted: Supabase credentials missing inside config layers.");
        return;
    }

    try {
        // ➔ THE CORRECTION: URL updated to 'products' (lowercase) and performs a clean relational join request
        const queryUrl = `${sbUrl}/rest/v1/products?select=id,status,product_variants(id,sku,color_name,color_hex,price,stock,image_url,status)`;

        const response = await fetch(queryUrl, {
            method: 'GET',
            headers: {
                'apikey': sbKey,
                'Authorization': `Bearer ${sbKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`Supabase returned status code: ${response.status}`);
        
        const productsWithVariants = await response.json();
        
        // Clear or populate your master inventory cache map cleanly
       productsWithVariants.forEach(product => {
            const cleanProductId = parseInt(product.id);
            if (!isNaN(cleanProductId)) {
                const variants = product.product_variants || [];
                // ➔ THE FIX: products has no stock column of its own — stock only
                // ever lives on product_variants. Reading product.stock directly
                // was always undefined here, which reset every product's cached
                // stock to 0 on every sync. Derive it from the default (first)
                // variant instead, matching loadProductDatabaseEngine's convention.
                const defaultVariant = variants.length > 0 ? variants[0] : null;
                const liveStockLevel = defaultVariant ? (parseInt(defaultVariant.stock) || 0) : 0;

                // Map the parent item and attach its variations directly to the global master memory cache
                MASTER_LIVE_INVENTORY_CACHE[cleanProductId] = {
                    status: String(product.status || '').trim().toLowerCase(),
                    stock: liveStockLevel,
                    variants: variants // Clean array of variations nested inside
                };
                
                // Keep productDatabase instances strictly mirrored on background sync loops
                const localMatch = productDatabase.find(p => p.id === cleanProductId);
                if (localMatch) {
                    localMatch.product_variants = variants;
                }
            }
        });
        
        console.log("💎 Live Inventory Vault Synchronized successfully from Relational Database:", MASTER_LIVE_INVENTORY_CACHE);
        
        if (!productDatabase || productDatabase.length === 0) {
            await loadProductDatabaseEngine();
        } else {
            generateDynamicCatalogFilters();
            filterCatalog();
        }
        renderFlashVaultShowroom();
        renderTrendingSection();
        renderVaultSaleSection();
        renderNewArrivalsSection();
        renderRecentlyViewedSection();
        
    } catch (error) {
        console.error("❌ Inventory download sync failed. Store falling back to default availability states:", error);
    }
}

// =========================================================================
// SUPABASE LIVE DEDUCTION CHANNELS — DYNAMIC STOCK QUANTITY SYNCHRONIZATION
// =========================================================================

async function executeSupabaseInventoryDeduction(cartItemsArray) {
    if (!cartItemsArray || cartItemsArray.length === 0) return;

    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;

    for (const item of cartItemsArray) {
        try {
            const currentDb = (typeof productDatabase !== 'undefined') ? productDatabase : (window.productDatabase || []);
            const product = currentDb.find(p => p.id === item.id);
            if (!product || !product.product_variants) continue;

            // Find the exact variant row matching the purchased color
            const exactVariant = product.product_variants.find(v => v.color_name === item.color || (item.color === '' && v.color_name === 'Standard'));
            if (!exactVariant) continue;

            const currentStockLevel = parseInt(exactVariant.stock) || 0;
            const absoluteNewStockLevel = Math.max(0, currentStockLevel - parseInt(item.quantity));

            // ➔ THE CORRECTION: Point the endpoint request directly to lowercase product_variants table row
            const variantPatchUrl = `${sbUrl}/rest/v1/product_variants?id=eq.${exactVariant.id}`;
            
            await fetch(variantPatchUrl, {
                method: 'PATCH',
                headers: {
                    'apikey': sbKey,
                    'Authorization': `Bearer ${sbKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "stock": absoluteNewStockLevel,
                    "status": absoluteNewStockLevel <= 0 ? 'sold' : 'active'
                })
            });

            if (typeof logStockHistoryEntry === 'function') {
                await logStockHistoryEntry(exactVariant.id, product.id, product.title, exactVariant.color_name, 'sale', currentStockLevel, absoluteNewStockLevel);
            }

        } catch (err) {
            console.error(`Inventory deduction sync failure catch trace:`, err);
        }
    }
}


document.addEventListener("DOMContentLoaded", () => {
    synchronizeLiveStorefrontInventory();
});

// 3. DELETE CHANNEL: Instant Row Purging via the Trash can icon

let currentSelectedFeedbackFormRatingValue = 5;

// =========================================================================
// SUPABASE TESTIMONIALS ENGINE — LIVE 20 CARD FETCH WITH DOT PAGINATION
// =========================================================================


let MASTER_FEEDBACK_DATASET = []; // Stores up to 20 fetched reviews from Supabase

let feedbackCurrentPage = 0;

const REVIEWS_PER_PAGE_COUNT = 4;

let feedbackSwipeStartX = 0;

// =========================================================================
// ANGEL JEWELLERY — DYNAMIC INFINITE TEXTIMONIALS MARQUEE CORE ENGINE
// =========================================================================

async function loadLiveCustomerFeedbackShowroom() {
    const feedbackCanvas = document.getElementById('liveClientFeedbackGridCanvas');
    if (!feedbackCanvas) return;

    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;
    const feedbackUrl = `${sbUrl}/rest/v1/Feedback?select=*&order=created_at.desc&limit=20`;

    try {
        const response = await fetch(feedbackUrl, {
            method: 'GET',
            headers: { 'apikey': sbKey, 'Authorization': `Bearer ${sbKey}`, 'Content-Type': 'application/json' }
        });
        const masterDataset = await response.json();

        if (!masterDataset || masterDataset.length === 0) {
            feedbackCanvas.innerHTML = `<div style="width:100%; color:#777; font-size:0.88rem; padding:20px 0; text-align:center;">No reviews posted yet. Be the first to share your aura!</div>`;
            return;
        }

        // Helper mapper to standardize beautiful luxury cards layout
        const generateCardMarkupHTML = (review) => {
            const numericRating = parseInt(review.rating) || 5;
            return `
                <div class="review-card-unit">
                    <div style="background:#ffffff; border:1px solid #e8e8ef; border-radius:8px; padding:20px; box-sizing:border-box; text-align:left; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 4px 15px rgba(0,0,0,0.01); height:100%; min-height:180px;">
                        <div>
                            <div style="color:#cca43b; font-size:0.9rem; margin-bottom:8px;">${'★'.repeat(numericRating).padEnd(5, '☆')}</div>
                            <p style="color:#4a4a5a; font-size:0.78rem; line-height:1.5; font-style:italic; margin:0 0 12px 0;">"${review.review}"</p>
                        </div>
                        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px dotted #e8e8ef; padding-top:10px; margin-top:auto;">
                            <h4 style="color:#202c55; margin:0; font-size:0.75rem; font-weight:700; text-transform:uppercase; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:110px;">${review.name || 'Anonymous'}</h4>
                            <small style="color:#aaa; font-size:0.68rem;">${new Date(review.created_at).toLocaleDateString('en-IN', {day:'numeric', month:'short'})}</small>
                        </div>
                    </div>
                </div>`;
        };

        // Render initial batch array
        const baselineCardsHTML = masterDataset.map(review => generateCardMarkupHTML(review)).join('');
        
        // ➔ THE SEAMLESS CLONE TRICK: Multiplies track strings to simulate continuous flow loops
        feedbackCanvas.innerHTML = baselineCardsHTML + baselineCardsHTML;

        // Trigger the rolling continuous loop animation cleanly
        feedbackCanvas.classList.add('marquee-running-track');

        // Hide pagination dot docks safely if present anywhere in DOM framework logs
        const oldDotsDock = document.getElementById('feedbackCarouselPaginationDots');
        if (oldDotsDock) oldDotsDock.style.display = 'none';

    } catch (err) {
        console.error("Feedback showroom error:", err);
        feedbackCanvas.innerHTML = `<div style="width:100%; color:#cca43b; font-size:0.82rem; text-align:center;">Feedback showroom failed to connect.</div>`;
    }
}


function recalculateFeedbackPaginationMetrics() {
    const screenWidth = window.innerWidth;
    let itemsPerPage = REVIEWS_PER_PAGE_COUNT; // 4 per page on desktop windows

    if (screenWidth <= 640) itemsPerPage = 1;      // Mobile card row collapse
    else if (screenWidth <= 1024) itemsPerPage = 2; // Tablet split card layout

    const totalPages = Math.ceil(MASTER_FEEDBACK_DATASET.length / itemsPerPage);
    renderFeedbackCarouselPaginationDots(totalPages);
    slideFeedbackCarouselTrack();
}


function renderFeedbackCarouselPaginationDots(totalPages) {
    let dotsBar = document.getElementById('feedbackCarouselPaginationDots');
    
    // Create container dynamically below track if it's missing in HTML layout
    if (!dotsBar) {
        dotsBar = document.createElement('div');
        dotsBar.id = "feedbackCarouselPaginationDots";
        dotsBar.style.cssText = "display:flex; justify-content:center; align-items:center; gap:10px; margin-top:30px; width:100%;";
        document.getElementById('liveClientFeedbackGridCanvas').parentElement.after(dotsBar);
    }

    dotsBar.innerHTML = "";
    if (totalPages <= 1) return;

    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.style.width = (i === feedbackCurrentPage) ? "24px" : "8px";
        dot.style.height = "8px";
        dot.style.borderRadius = "20px";
        dot.style.background = (i === feedbackCurrentPage) ? "var(--pink-accent, #ff1493)" : "#e8e8ef";
        dot.style.cursor = "pointer";
        dot.style.transition = "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        
        dot.addEventListener('click', () => {
            feedbackCurrentPage = i;
            recalculateFeedbackPaginationMetrics();
        });
        dotsBar.appendChild(dot);
    }
}


function slideFeedbackCarouselTrack() {
    const canvas = document.getElementById('liveClientFeedbackGridCanvas');
    if (!canvas) return;
    const shiftOffset = feedbackCurrentPage * 100;
    canvas.style.transform = `translateX(-${shiftOffset}%)`;
}


function attachFeedbackGestureTracks(trackWindow) {
    if (!trackWindow) return;

    trackWindow.addEventListener('mousedown', (e) => { feedbackSwipeStartX = e.clientX; });
    trackWindow.addEventListener('mouseup', (e) => {
        const deltaX = e.clientX - feedbackSwipeStartX;
        handleFeedbackSwipeNavigation(deltaX);
    });

    trackWindow.addEventListener('touchstart', (e) => { feedbackSwipeStartX = e.touches[0].clientX; }, {passive: true});
    trackWindow.addEventListener('touchend', (e) => {
        const deltaX = e.changedTouches[0].clientX - feedbackSwipeStartX;
        handleFeedbackSwipeNavigation(deltaX);
    }, {passive: true});
}


function handleFeedbackSwipeNavigation(deltaX) {
    const screenWidth = window.innerWidth;
    let itemsPerPage = REVIEWS_PER_PAGE_COUNT;
    if (screenWidth <= 640) itemsPerPage = 1;
    else if (screenWidth <= 1024) itemsPerPage = 2;

    const totalPages = Math.ceil(MASTER_FEEDBACK_DATASET.length / itemsPerPage);

    if (deltaX > 50 && feedbackCurrentPage > 0) {
        feedbackCurrentPage--; // Swipe Right -> Previous Page
    } else if (deltaX < -50 && feedbackCurrentPage < totalPages - 1) {
        feedbackCurrentPage++; // Swipe Left -> Next Page
    }
    recalculateFeedbackPaginationMetrics();
}



async function submitCustomerFeedbackPipeline(event) {
    event.preventDefault();
    const submitBtn = document.getElementById('feedbackFormSubmitActionBtn');
    const originalText = submitBtn.innerText;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Submitting Review...`;

    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;

    const feedbackPayloadObject = {
        name: document.getElementById('feedbackFormClientName').value.trim(),
        rating: parseInt(document.getElementById('feedbackFormRatingValue').value) || 5,
        review: document.getElementById('feedbackFormReviewText').value.trim()
    };

    try {
        const response = await fetch(`${sbUrl}/rest/v1/Feedback`, {
            method: 'POST',
            headers: {
                'apikey': sbKey,
                'Authorization': `Bearer ${sbKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(feedbackPayloadObject)
        });

        if (!response.ok) throw new Error("Feedback submission rejected.");

        alert("✨ Review Published! Thank you for sharing your experience with Angel Jewellery.");
        closeCustomerFeedbackModal();
        await loadLiveCustomerFeedbackShowroom();

    } catch (error) {
        alert("Pipeline Sync Interrupted. Please check your connection.");
    } finally {
        submitBtn.disabled = false; submitBtn.innerText = originalText;
    }
}

// B. MODAL VISIBILITY TRIGGERS

function openCustomerFeedbackModal(event) {
    if (event) event.preventDefault();
    document.getElementById('angelStoreCustomerFeedbackForm').reset();
    setInteractiveFeedbackFormRating(5);
    document.getElementById('customerFeedbackSubmissionModal').style.display = 'flex';
}


function closeCustomerFeedbackModal() {
    document.getElementById('customerFeedbackSubmissionModal').style.display = 'none';
}

// C. STAR SELECTION ENGINE MATHS

function setInteractiveFeedbackFormRating(ratingValue) {
    currentSelectedFeedbackFormRatingValue = ratingValue;
    document.getElementById('feedbackFormRatingValue').value = ratingValue;
    
    const stars = document.querySelectorAll('.feedback-star-node');
    stars.forEach((star, idx) => {
        if (idx < ratingValue) {
            star.style.color = '#cca43b'; // Unlocked Gold Accent
        } else {
            star.style.color = '#e8e8ef'; // Muted Baseline Grey
        }
    });
}


function highlightFeedbackFormStarsPreview(previewValue) {
    const stars = document.querySelectorAll('.feedback-star-node');
    stars.forEach((star, idx) => {
        star.style.color = (idx < previewValue) ? '#ffd700' : '#e8e8ef';
    });
}


function resetFeedbackFormStarsHighlight() {
    setInteractiveFeedbackFormRating(currentSelectedFeedbackFormRatingValue);
}

// E. LINK INTO DOM CONTENT BOOT STRAPS FOR REAL-TIME LOAD INITIALIZATION

document.addEventListener("DOMContentLoaded", () => {
    loadLiveCustomerFeedbackShowroom();
});

// =========================================================================
// ANGEL JEWELLERY — STABLE STORE POLICY REGISTRY DATA OVERLAYS
// =========================================================================

const ANGEL_LEGAL_VAULT_POLICIES = {
    privacy: {
        title: "Privacy Policy",
        html: `
            <p><strong>Effective Date: June 2026</strong></p>
            <p>Welcome to Angel Jewellery. Your privacy is critical to our luxury standard. This policy clarifies how your data is treated during interactions on our platform.</p>
            <h4 style="color:#202c55; margin-top:15px; font-size:0.95rem;">1. Data Collection & Usage</h4>
            <p>We process essential customer coordinates (Full Name, verified Phone Number, Shipping Address, and Order logs) solely to arrange handoffs, custom sizing updates, and live dispatch tracking updates.</p>
            <h4 style="color:#202c55; margin-top:15px; font-size:0.95rem;">2. Vault Security Guarantee</h4>
            <p>Angel Jewellery does not cache, sell, or rent client identity profiles to advertising third parties. Your order history records sit entirely inside encrypted logistics infrastructure maps.</p>
            <h4 style="color:#202c55; margin-top:15px; font-size:0.95rem;">3. Tracker Transparency</h4>
            <p>We use temporary local cache assets strictly to manage items retained inside your shopping cart drawer and process real-time UI catalog folder states.</p>
        `
    },
    shipping: {
        title: "Shipping & Fulfillment Policy",
        html: `
            <p>Every piece curated by Angel Jewellery undergoes rigorous multi-tier verification before being sealed in our premium anti-tamper keepsake packaging.</p>
            <h4 style="color:#202c55; margin-top:15px; font-size:0.95rem;">1. Tariffs & Variable Rates</h4>
            <ul style="padding-left:20px; margin: 10px 0;">
                <li><strong>Orders over ₹1,000:</strong> 100% Free Shipping all across pan-India delivery corridors automatically.</li>
                <li><strong>Orders below ₹1,000:</strong> Calculated dynamically at checkout point based on your structural region zone profiles.</li>
            </ul>
            <h4 style="color:#202c55; margin-top:15px; font-size:0.95rem;">2. Timestamps</h4>
            <p>Orders are batched and handed to premium domestic freight networks (DTDC / Delhivery Express) within 24–48 hours. Transit speeds generally reach standard tier hubs across India in 3–5 operational business days.</p>
        `
    },
    refund: {
        title: "Refund, Return & Cancellation Matrix",
        html: `
            <p>Due to the fine handcrafted nature and luxury sanitization protocols of our artisan collections, Angel Jewellery maintains a strict structural return policy matrix.</p>
            <h4 style="color:#d9383a; margin-top:15px; font-size:0.95rem;">1. Post-Dispatch Cancellation Lock</h4>
            <p style="background:rgba(217,56,58,0.04); border-left:3px solid #d9383a; padding:8px 12px; font-weight:600;">Once your package has been fulfilled, tracking coordinates assigned, or handed to our courier partners, the order can neither be canceled, modified, nor recalled.</p>
            <h4 style="color:#202c55; margin-top:15px; font-size:0.95rem;">2. Absolute No-Exchange Rule</h4>
            <p>To preserve pristine metal health guidelines for all patrons, items delivered securely cannot be exchanged or returned due to casual change-of-mind parameters.</p>
            <h4 style="color:#202c55; margin-top:15px; font-size:0.95rem;">3. Shipping Transit Damage Exceptions</h4>
            <p>If a product arrives with a rare physical breakdown caused in transit, notify our Concierge desk via WhatsApp within 24 hours of box delivery with an unedited unboxing video to claim an identical luxury component replacement.</p>
        `
    },
    terms: {
        title: "Terms of Service",
        html: `
            <p>By entering, purchasing, or interacting with the Angel Jewellery showroom ecosystem, you agree to comply with our absolute standard operational terms:</p>
            <h4 style="color:#202c55; margin-top:15px; font-size:0.95rem;">1. Inventory Discrepancy Control</h4>
            <p>While our Supabase link engines work in real-time, order queues that happen at the exact same split-second take priority by timestamp sequence. If an item runs out of stock mid-checkout, we will issue an immediate 100% gateway refund to your payment root source.</p>
            <h4 style="color:#202c55; margin-top:15px; font-size:0.95rem;">2. Intended Use and Copyright</h4>
            <p>All catalog media assets, brand banners, and custom code modules remain the exclusive property of Angel Jewellery. Unauthorized duplication or commercial reselling is strictly prohibited.</p>
        `
    }
};


function openAngelStorePolicyModal(event, policyKey) {
    if (event) event.preventDefault();
    
    const targetDoc = ANGEL_LEGAL_VAULT_POLICIES[policyKey];
    if (!targetDoc) return;

    const titleEl = document.getElementById('angelPolicyModalHeaderTitle');
    const bodyEl = document.getElementById('angelPolicyModalScrollableBody');
    const modalView = document.getElementById('angelStorePolicyModalViewer');

    if (titleEl && bodyEl && modalView) {
        titleEl.innerText = targetDoc.title;
        bodyEl.innerHTML = targetDoc.html;
        modalView.style.display = 'flex';
    }
}


function closeAngelStorePolicyModal() {
    const modalView = document.getElementById('angelStorePolicyModalViewer');
    if (modalView) modalView.style.display = 'none';
}
// =========================================================================
// INTERACTIVE FAQ OVERLAY MODAL & ACCORDION SYSTEM UTILITIES
// =========================================================================

function openFaqSystemModalOverlay(event) {
    if (event) event.preventDefault();
    const overlay = document.getElementById('faqSystemModalOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    }
}


function closeFaqSystemModalOverlay() {
    const overlay = document.getElementById('faqSystemModalOverlay');
    if (overlay) {
        overlay.style.display = 'none';
        document.body.style.overflow = ''; // Unlock background scrolling
    }
}


function toggleFaqAccordionUnit(headerElement) {
    const contentPane = headerElement.nextElementSibling;
    const chevronIcon = headerElement.querySelector('.fa-chevron-down');
    
    // Check if item is already active
    if (contentPane.style.maxHeight && contentPane.style.maxHeight !== '0px') {
        contentPane.style.maxHeight = '0px';
        if (chevronIcon) chevronIcon.style.transform = 'rotate(0deg)';
    } else {
        // Collapse all other panels inside the overlay first for a clean view loop
        document.querySelectorAll('.faq-content-pane').forEach(pane => pane.style.maxHeight = '0px');
        document.querySelectorAll('.faq-content-pane').forEach(pane => {
            const icon = pane.previousElementSibling.querySelector('.fa-chevron-down');
            if (icon) icon.style.transform = 'rotate(0deg)';
        });

        // Expand clicked item seamlessly matching its scroll height metrics
        contentPane.style.maxHeight = contentPane.scrollHeight + "px";
        if (chevronIcon) chevronIcon.style.transform = 'rotate(180deg)';
    }
}

// =========================================================================
// ANGEL JEWELLERY — SMART RESPONSIVE FLASH VAULT MODULE
// =========================================================================

let flashVaultCurrentPage = 0;

const FLASH_VAULT_ITEMS_PER_PAGE = 6; 


function renderFlashVaultShowroom() {
    let section = document.getElementById('flashVaultSection');
    
    // 1. If it's missing or stuck inside the cart drawer layout, build it cleanly right above catalog section
    if (!section || section.parentElement.id === "cartDrawer") {
        if(section) section.remove(); // Safely remove any incorrectly placed container
        
        console.log("🏗️ Injecting Flash Vault container cleanly above the catalog grid tracker...");
        section = document.createElement('section');
        section.id = 'flashVaultSection';
        section.style.cssText = "max-width: 1200px; margin: 40px auto; padding: 40px 20px; background: #fafafa; border-radius: 8px; margin:8px 8px 8px 25px; border: 2px dashed #ff1493; font-family: 'Montserrat', sans-serif; display: block !important;";
        
        section.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e8e8ef; padding-bottom: 20px; margin-bottom: 30px; flex-wrap: wrap; gap: 15px;">
                <div style="text-align: left;">
                    <span style="font-size: 0.65rem; background: #202c55; color: #fff; padding: 4px 10px; font-weight: 700; letter-spacing: 1.5px; border-radius: 2px; text-transform: uppercase;">⚡ Limited Stock</span>
                    <h2 style="color: #202c55; font-size: 1.4rem; font-weight: 600; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 0.5px;">Pick Any Item @ ₹350</h2>
                    <p style="margin: 3px 0 0 0; font-size: 0.78rem; color: #777;">Single piece earrings & small trinkets. Once sold, it will be gone!</p>
                    <div id="flashVaultCountdownBadge" class="section-countdown-badge" style="margin-top: 10px;"></div>
                </div>
                <div style="background: #ffffff; border: 1px solid #e8e8ef; padding: 8px 16px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; color: #ff1493; letter-spacing: 0.5px;">
                    PRICE FOR ANY PIECE: <span style="font-size: 1rem; color: #202c55;">₹350</span>
                </div>
            </div>
            
            <div id="flashVaultGrid" class="responsive-flash-vault-grid"></div>
            
            <div id="flashVaultPagination" style="display: flex; justify-content: center; align-items: center; gap: 15px; margin-top: 30px;"></div>
        `;

        // Inject the CSS Media Query rules into the page head automatically if they don't exist
        if (!document.getElementById('flashVaultResponsiveStyles')) {
            const styleTag = document.createElement('style');
            styleTag.id = 'flashVaultResponsiveStyles';
            styleTag.innerHTML = `
                /* Desktop Layout: Fits as many columns as possible (min 160px per card) */
                .responsive-flash-vault-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                    gap: 15px;
                }
                
                /* Mobile Layout Check (Screens under 768px wide): FORCES EXACTLY 2 COLUMNS */
                @media (max-width: 768px) {
                    .responsive-flash-vault-grid {
                        grid-template-columns: repeat(2, 1fr) !important;
                        gap: 12px !important;
                    }
                }
            `;
            document.head.appendChild(styleTag);
        }

        const trendingTarget = document.getElementById('trendingSection');
        if (trendingTarget) {
            // ➔ THE TRENDING RELOCATION FIX: Injects the Flash Vault cleanly AFTER the trending carousel
            trendingTarget.parentNode.insertBefore(section, trendingTarget.nextSibling);
        } else {
            const catalogTarget = document.getElementById('catalog');
            if (catalogTarget) {
                catalogTarget.parentNode.insertBefore(section, catalogTarget.nextSibling);
            } else {
                document.body.appendChild(section);
            }
        }    
    }

    const grid = document.getElementById('flashVaultGrid');
    const paginationDock = document.getElementById('flashVaultPagination');
    if (!grid) return;

    // 2. Filter dataset — only real products tagged Flash / Flash Vault
    const vaultPool = productDatabase.filter(p => {
        if (!p || !p.category) return false;
        const catLower = String(p.category).trim().toLowerCase();
        return catLower === 'flash vault' || catLower === 'flash';
    });

    // No real flash items yet — hide the section entirely rather than
    // show fake placeholder data pretending to be real inventory. Tag a
    // product's category as "Flash" or "Flash Vault" in the admin panel
    // and this section reappears automatically on the next render.
    if (vaultPool.length === 0) {
        section.style.display = 'none';
        grid.innerHTML = '';
        if (paginationDock) paginationDock.innerHTML = '';
        return;
    }
    section.style.display = 'block';

    const totalPages = Math.ceil(vaultPool.length / FLASH_VAULT_ITEMS_PER_PAGE);
    const sliceStart = flashVaultCurrentPage * FLASH_VAULT_ITEMS_PER_PAGE;
    const activePageSlice = vaultPool.slice(sliceStart, sliceStart + FLASH_VAULT_ITEMS_PER_PAGE);

    // 3. Render cards dynamically
    grid.innerHTML = activePageSlice.map(item => {
        const liveInventory = MASTER_LIVE_INVENTORY_CACHE[item.id] || { stock: 1, status: 'available' };
        const isClaimed = liveInventory.stock <= 0 || liveInventory.status === 'sold';
        const safeTitle = item.title.replace(/'/g, "\\'");

        // Admin Edit Inline Controls mirrored perfectly from the primary filter catalog engine
        return `
            <div class="angel-card angel-card--flash ${isClaimed ? 'is-disabled' : ''}" onclick="openQuickViewShield(${item.id})">
                

                <div class="angel-card-media">
                    <img src="${item.image}" loading="lazy" decoding="async" alt="${item.title}">
                    ${isClaimed ? `<div class="angel-card-soldout-scrim">🔒 Sold Out</div>` : ''}
                </div>
                <div class="angel-card-body">
                    <h4 class="angel-card-title">${item.title}</h4>
                    ${isClaimed ? `
                        <button disabled class="angel-card-cta is-sold-out">Sold Out</button>
                    ` : `
                        <button class="angel-card-cta" onclick="event.stopPropagation(); addToCartEngine(${item.id}, '${safeTitle}')">
                            <i class="fas fa-shopping-bag" style="font-size: 0.62rem;"></i> Add to Bag
                        </button>
                    `}
                </div>
                <span class="angel-card-price-tag">₹350</span>
            </div>
        `;
    }).join('');

    if (totalPages <= 1) {
        paginationDock.innerHTML = "";
        return;
    }

    paginationDock.innerHTML = `
        <button ${flashVaultCurrentPage === 0 ? 'disabled' : ''} onclick="shiftFlashVaultPage(-1)" style="padding: 5px 12px; font-size: 0.7rem; font-weight: 700; border: 1px solid #e8e8ef; background: #fff; border-radius: 4px; cursor: pointer; opacity: ${flashVaultCurrentPage === 0 ? '0.4' : '1'};"><i class="fas fa-chevron-left"></i></button>
        <span style="font-size: 0.72rem; font-weight: 600; color: #555;">Page ${flashVaultCurrentPage + 1} of ${totalPages}</span>
        <button ${flashVaultCurrentPage === totalPages - 1 ? 'disabled' : ''} onclick="shiftFlashVaultPage(1)" style="padding: 5px 12px; font-size: 0.7rem; font-weight: 700; border: 1px solid #e8e8ef; background: #fff; border-radius: 4px; cursor: pointer; opacity: ${flashVaultCurrentPage === totalPages - 1 ? '0.4' : '1'};"><i class="fas fa-chevron-right"></i></button>
    `;
}

// Global modal overlay backdrop click tracking dismissals

function selectStyleClusterFilter(clusterKeyword) {
    const modal = document.getElementById('stylePortfolioModalShield');
    const grid = document.getElementById('portfolioModalProductsGrid');
    const mainTitle = document.getElementById('portfolioModalMainTitle');
    const miniTag = document.getElementById('portfolioMiniTag');
    const scrollBody = document.getElementById('portfolioModalScrollBody');

    if (!modal || !grid || !productDatabase || productDatabase.length === 0) return;

    const cleanKeyword = String(clusterKeyword).trim().toLowerCase();

    // Filters database records safely using active cluster hooks
    const matchedStylePool = productDatabase.filter(p => p && String(p.style).trim().toLowerCase() === cleanKeyword);

    // Apply custom headers dynamically
    let descriptiveTitle = `${clusterKeyword} Showcase`;
    if (cleanKeyword === 'cz') descriptiveTitle = "CZ & Silver Polish Curation";
    if (cleanKeyword === 'antique') descriptiveTitle = "Antique Temple Masterpieces";
    if (cleanKeyword === 'handcrafted') descriptiveTitle = "Heritage Devotion Editions";
    if (cleanKeyword === 'navratna') descriptiveTitle = "Navratna & Multi-Stone Strings";

    if (mainTitle) mainTitle.innerText = descriptiveTitle;
    if (miniTag) miniTag.innerText = `Angel Jewellery • ${clusterKeyword}`;

    // ➔ THE INLINE STABILIZER: Resets container layout blocks perfectly
    if (scrollBody) {
        scrollBody.style.cssText = "padding: 10px 8px; overflow-x: hidden !important; width: 100%; box-sizing: border-box; background: #ffffff; flex-grow: 1;";
    }

    // ➔ THE CRITICAL GRID UNIFIER FIX: Cleans out variable widths, forces clean uniform matrix layout proportions
    grid.style.cssText = "display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; width: 100% !important; margin: 0 !important; padding: 0 !important; box-sizing: border-box !important; flex-direction: unset !important; overflow-x: hidden !important;";

    if (matchedStylePool.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 10px; color: #777; font-weight: 500; font-family:'Montserrat';">
                <i class="fas fa-gem" style="font-size: 1.5rem; color: #e8e8ef; display: block; margin-bottom: 10px;"></i>
                No items in this style.
            </div>`;
    } else {
        grid.innerHTML = matchedStylePool.map(product => {
            const isSoldOut = product.badge && product.badge.toLowerCase() === 'sold out';
            const displayPrice = product.price > 0 ? `₹${product.price.toLocaleString('en-IN')}` : 'Price on Request';
            const safeTitleString = product.title.replace(/'/g, "\\'");

            // ➔ THE CARD LAYOUT FIX: Strict height alignments, text clamp truncation, uniform buttons
            return `
                <div class="mosaic-modal-tile" style="background: #ffffff; border: 1px solid #e8e8ef; border-radius: 6px; padding: 10px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; width: 100%; min-height: 290px; height: 100%; text-align: center; position: relative;">
                    
                    <div>
                        <!-- Uniform Aspect-Ratio Image Frame -->
                        <div onclick="closeStylePortfolioModal(); setTimeout(() => openQuickViewShield(${product.id}), 200);" 
                             style="width: 100%; aspect-ratio: 1/1; border-radius: 4px; overflow: hidden; background: #fafafa; margin-bottom: 8px; position: relative; cursor: pointer; border: 1px solid #f4f4f7; box-sizing: border-box;">
                            <img src="${product.image}" loading="lazy" decoding="async" style="width: 100%; height: 100%; object-fit: cover; display: block;">
                            ${isSoldOut ? `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(32,44,85,0.4); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.65rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">🔒 Sold Out</div>` : ''}
                        </div>

                        <!-- Truncated Uniform Title Height Structure -->
                        <h4 style="margin: 0 0 4px 0; font-size: 0.78rem; font-weight: 600; color: #111116; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 32px; font-family: 'Montserrat'; text-align: left;">
                            ${product.title}
                        </h4>
                    </div>

                    <div>
                        <p style="margin: 0 0 8px 0; font-size: 0.85rem; font-weight: 700; color: #202c55; font-family: 'Montserrat'; text-align: left;">
                            ${displayPrice}
                        </p>

                        <button class="btn-order-wa" ${isSoldOut ? 'disabled' : ''} 
                                onclick="addToCartEngine(${product.id}); triggerCartNotification('${safeTitleString}');" 
                                style="width: 100%; padding: 8px 0; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background: ${isSoldOut ? '#e1e1e6 !important' : 'var(--purple-primary, #202c55)'}; color: ${isSoldOut ? '#8e8e9f !important' : '#fff !important'}; border: none; border-radius: 4px; cursor: ${isSoldOut ? 'not-allowed' : 'pointer'}; font-family: 'Montserrat'; transition: all 0.2s;">
                            ${isSoldOut ? 'Restocking' : 'Add to Bag'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; 
    
    if (scrollBody) scrollBody.scrollTop = 0;
    angelModalPushHistory(closeStylePortfolioModal);
}


function closeStylePortfolioModal() {
    const modal = document.getElementById('stylePortfolioModalShield');
    if (modal) modal.style.display = "none";
    document.body.style.overflow = ""; 
    angelModalConsumeHistory();
}


function shiftFlashVaultPage(directionOrPage) {
    // 1. Fallback initialization for current page tracking if not declared globally
    if (typeof flashVaultCurrentPage === 'undefined') {
        window.flashVaultCurrentPage = 0;
    }
    
    // 2. Determine the target page calculation sequence
    if (directionOrPage === -1) {
        if (flashVaultCurrentPage > 0) flashVaultCurrentPage--;
    } else if (directionOrPage === 1) {
        flashVaultCurrentPage++;
    } else {
        // If a direct page index was passed (0-indexed matching your collection array)
        const pageIndex = parseInt(directionOrPage);
        if (!isNaN(pageIndex)) {
            flashVaultCurrentPage = pageIndex;
        }
    }

    // 3. ➔ THE FIX: Call your actual rendering engine function
    if (typeof renderFlashVaultShowroom === 'function') {
        renderFlashVaultShowroom();
    } else {
        console.warn("Flash Vault rendering function 'renderFlashVaultShowroom' not detected.");
    }
}

// Global modal overlay backdrop click tracking dismissals

window.addEventListener('click', (e) => {
    const overlay = document.getElementById('faqSystemModalOverlay');
    const portfolioOverlay = document.getElementById('stylePortfolioModalShield');
    if (e.target === overlay) {
        closeFaqSystemModalOverlay();
    }
    if (e.target === portfolioOverlay) {
        closeStylePortfolioModal();
    }
});

// =========================================================================
// SUPABASE API CHANNEL — SECURE ONLINE TRANSACTION CANCELLATION ENGINE
// =========================================================================

async function executeClientOrderCancellationPipeline(event, id, paymentId) {
    if (event) event.preventDefault();
    
    const userConfirmation = confirm(`⚠️ Cancel Order Confirmation:\nAre you sure you want to cancel your order #${id}?\n\nThis action will freeze shipping routing files instantly.`);
    if (!userConfirmation) return;

    const targetButton = event.currentTarget;
    const originalButtonHTML = targetButton.innerHTML;
    
    targetButton.disabled = true;
    targetButton.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Processing Cancellation...`;

    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;
    const patchTargetUrl = `${sbUrl}/rest/v1/Orders?id=eq.${id}`;

    try {
        const response = await fetch(patchTargetUrl, {
            method: 'PATCH',
            headers: {
                'apikey': sbKey,
                'Authorization': `Bearer ${sbKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                status: 'Cancelled'
            })
        });

        if (!response.ok) throw new Error(`Supabase operational rejection status: ${response.status}`);
        
        alert("✨ Your order has been successfully cancelled. Our team will reach out to handle your payment gateway reverse token updates.");
        
        // Auto-refresh tracker view context instantly to re-draw state elements
        await executeLiveOrderTrackingSearch();

    } catch (error) {
        console.error("Cancellation stream execution broken:", error);
        alert("Sync Error: Unable to modify tracking matrix at this time. Please contact support.");
        targetButton.disabled = false;
        targetButton.innerHTML = originalButtonHTML;
    }
}

// =========================================================================
// ➔ INLINE VIEW TOGGLER FOR CANCELLATION METRICS PANEL
// =========================================================================

function toggleCancellationFormView(orderId) {
    const triggerBtn = document.getElementById(`cancelTriggerBtn_${orderId}`);
    const formPanel = document.getElementById(`cancelFormBlock_${orderId}`);
    if (!triggerBtn || !formPanel) return;

    if (formPanel.style.display === "none") {
        formPanel.style.display = "block";
        triggerBtn.style.display = "none";
    } else {
        formPanel.style.display = "none";
        triggerBtn.style.display = "flex";
    }
}

// =========================================================================
// SUPABASE API CHANNEL — SUBMIT CANCEL DETAILS TO INDEPENDENT COLUMNS
// =========================================================================

async function submitClientCancellationForm(event, id, paymentId) {
    if (event) event.preventDefault();

    const reasonInput = document.getElementById(`cancelReason_${id}`).value.trim();
    const phonePeInput = document.getElementById(`cancelPhonePe_${id}`).value.trim();
    const indiaPhoneRegex = /^[6-9]\d{9}$/;

    if (!reasonInput) {
        alert("Please specify a reason for your order cancellation request.");
        document.getElementById(`cancelReason_${id}`).focus();
        return;
    }

    if (!phonePeInput || phonePeInput.length !== 10 || !indiaPhoneRegex.test(phonePeInput)) {
        alert("Please provide a valid 10-digit PhonePe number for processing your instant refund.");
        document.getElementById(`cancelPhonePe_${id}`).focus();
        return;
    }

    const finalUserVerify = confirm("Are you completely sure you want to cancel this transaction? This action is permanent.");
    if (!finalUserVerify) return;

    const confirmBtn = event.currentTarget;
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`;

    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;
    const patchTargetUrl = `${sbUrl}/rest/v1/Orders?id=eq.${id}`;

    try {
        const response = await fetch(patchTargetUrl, {
            method: 'PATCH',
            headers: {
                'apikey': sbKey,
                'Authorization': `Bearer ${sbKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                status: 'Cancelled',
                cancel_reason: reasonInput,      // Maps cleanly to your custom column
                refund_phonepe: phonePeInput     // Maps cleanly to your custom column
            })
        });

        if (!response.ok) throw new Error(`Supabase operational rejection status: ${response.status}`);
        
        alert("✨ Order Cancelled successfully! Your refund transaction note has been submitted to our accounting desk.");
        
        // Re-run search query string lookup to update interface states instantly
        await executeLiveOrderTrackingSearch();

    } catch (error) {
        console.error("Cancellation payload submission dropped:", error);
        alert("Sync Interrupted: Unable to update server files. Please try again.");
        confirmBtn.disabled = false;
        confirmBtn.innerText = "Confirm Cancel";
    }
}
// =========================================================================
// SUPABASE SECURE CHANNEL — TRANSITION CANCELLED ROW STATUS TO REFUNDED
// =========================================================================

let currentCalculatedShippingFeeValue = 0;

let userShippingZipCodeVerified = false;

// =========================================================================
// ANGEL JEWELLERY GLOBAL SHIPPING METRICS CONFIGURATION ENGINE
// =========================================================================

function evaluateShippingEligibilityState(currentCartSubtotalAmount) {
    const shippingBlock = document.getElementById('checkoutShippingCalcBlock');
    if (!shippingBlock) return;

    if (currentCartSubtotalAmount > 0 && currentCartSubtotalAmount < 1000) {
        shippingBlock.style.display = "block";
    } else {
        shippingBlock.style.display = "none";
        currentCalculatedShippingFeeValue = 0;
        userShippingZipCodeVerified = false;
        const msgNode = document.getElementById('checkoutShippingStatusMessage');
        if (msgNode) msgNode.style.display = "none";
    }
}

/**
 * Distance Calculation Engine mapping Indian Postal Codes from Hyderabad
 */

function executeCheckoutShippingCalculationPipeline() {
    const zipInput = document.getElementById('checkoutShippingZipInput').value.trim();
    const msgNode = document.getElementById('checkoutShippingStatusMessage');
    const indiaZipRegex = /^[1-9][0-9]{5}$/;

    if (!zipInput || !indiaZipRegex.test(zipInput)) {
        alert("Please enter a valid 6-digit Indian Postal PIN code.");
        document.getElementById('checkoutShippingZipInput').focus();
        return;
    }

    msgNode.style.display = "block";
    msgNode.style.color = "#202c55";
    msgNode.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Calculating distance variables...`;

    // Extract PIN prefix indicators
    const zipPrefixThree = parseInt(zipInput.substring(0, 3));
    let calculatedDistanceInKilometers = 999; 

    // DISTANCE ESTIMATION ALGORITHM MATRIX RELATIVE TO HYDERABAD MAIN HUB
    if (zipPrefixThree === 500) {
        calculatedDistanceInKilometers = 15; 
    } else if (zipPrefixThree >= 501 && zipPrefixThree <= 509) {
        calculatedDistanceInKilometers = 120;
    } else if (zipPrefixThree >= 515 && zipPrefixThree <= 535) {
        calculatedDistanceInKilometers = 380;
    } else if (zipPrefixThree >= 560 && zipPrefixThree <= 591) {
        calculatedDistanceInKilometers = 490;
    }

    // TARIFF COST EVALUATION RANGE ENGINE
    if (calculatedDistanceInKilometers <= 200) {
        currentCalculatedShippingFeeValue = 50;
        msgNode.style.color = "#2a7b6a";
        msgNode.innerHTML = `✅ Distance: ~${calculatedDistanceInKilometers} km | Shipping Fee: <strong>₹50</strong> applied.`;
        userShippingZipCodeVerified = true;
    } else if (calculatedDistanceInKilometers > 200 && calculatedDistanceInKilometers <= 500) {
        currentCalculatedShippingFeeValue = 100;
        msgNode.style.color = "#2a7b6a";
        msgNode.innerHTML = `✅ Distance: ~${calculatedDistanceInKilometers} km | Shipping Fee: <strong>₹100</strong> applied.`;
        userShippingZipCodeVerified = true;
    } else {
        currentCalculatedShippingFeeValue = 150;
        msgNode.style.color = "#202c55";
        msgNode.innerHTML = `✈️ Long Distance Delivery | Shipping Fee: <strong>₹150</strong> applied.`;
        userShippingZipCodeVerified = true;
    }

    // ➔ REFRESH CART PANEL INSTEAD OF BROKEN METHOD
    if (typeof updateCartUI === 'function') {
        updateCartUI();
    }
}

// =========================================================================
// 🔄 CLIENT-SIDE HIGH-PERFORMANCE IMAGE COMPRESSION & WEBP CONVERSION ENGINE
// =========================================================================
// =========================================================================
// 🔄 DYNAMIC HIGH-FIDELITY COMPRESSION & RETINA-READY WEBP CONVERSION ENGINE
// =========================================================================

function handleCatalogCardDotClick(event, productId, variantId, variantIdx) {
    const currentDb = (typeof productDatabase !== 'undefined') ? productDatabase : (window.productDatabase || []);
    const product = currentDb.find(p => p.id === productId);
    if (!product || !product.product_variants) return;

    const matchedVariant = product.product_variants.find(v => v.id === variantId);
    if (!matchedVariant) return;

    // 1. Update active variant tracker on card
    const cardEl = document.getElementById(`catalog-card-${productId}`);
    if (cardEl) {
        cardEl.setAttribute('data-active-variant-id', variantId);
    }

    // 2. Smoothly cross-fade image asset
    const imgEl = document.getElementById(`catalog-card-img-${productId}`);
    if (imgEl && matchedVariant.image_url && imgEl.src !== matchedVariant.image_url) {
        const newImageUrl = matchedVariant.image_url;
        imgEl.style.opacity = "0.3";

        // Preload the new image off-DOM first. Previously .src was swapped
        // on a fixed 120ms timer regardless of whether the browser had
        // actually finished fetching the new image yet — on anything but
        // an instant cache hit, that left a blank/half-loaded frame
        // visible right as opacity faded back to 1. Waiting for the
        // preloader's onload means the swap-and-reveal only happens once
        // the image is actually ready to paint.
        const preloader = new Image();
        preloader.onload = () => {
            imgEl.src = newImageUrl;
            imgEl.style.opacity = "1";
        };
        preloader.onerror = () => {
            imgEl.src = newImageUrl; // let the card's existing onerror fallback handle a bad URL
            imgEl.style.opacity = "1";
        };
        preloader.src = newImageUrl;
    }

    // 3. Swap the pricing string text
    const priceEl = document.getElementById(`catalog-card-price-${productId}`);
    if (priceEl && matchedVariant.price) {
        priceEl.innerText = formatCurrency(parseFloat(matchedVariant.price));
    }

    // ➔ THE NEW EXTENSION: Dynamically swap the heart icon fill depending on this specific color's status
    const wishlistCheckKey = `${productId}|${matchedVariant.color_name}`;
    const heartBtn = cardEl ? cardEl.querySelector('.wishlist-heart-btn') : null;
    
    if (heartBtn) {
        if (wishlistMemory.includes(wishlistCheckKey)) {
            heartBtn.innerHTML = `<i class="fas fa-heart" style="font-size: 0.85rem; color: var(--pink-accent, #ff1493); transition: color 0.2s ease;"></i>`;
            heartBtn.classList.add('active');
        } else {
            heartBtn.innerHTML = `<i class="far fa-heart" style="font-size: 0.85rem; color: #202c55; transition: color 0.2s ease;"></i>`;
            heartBtn.classList.remove('active');
        }
    }

    // 5. Highlight the active dot element
    const dots = document.querySelectorAll(`.catalog-variant-dot-${productId}`);
    dots.forEach((dot, idx) => {
        if (idx === variantIdx) {
            dot.classList.add('is-active');
        } else {
            dot.classList.remove('is-active');
        }
    });

    // 6. Update the visible color-name label — tooltips (title=) never show
    // up on touch devices at all, so this is the only way a mobile shopper
    // actually sees which color they've selected.
    const colorNameLabel = document.getElementById(`catalog-card-colorname-${productId}`);
    if (colorNameLabel) {
        colorNameLabel.textContent = matchedVariant.color_name || '';
    }

    // 7. Update the stock flag for the color actually selected. Previously
    // this never ran at all, so switching colors left the flag frozen on
    // whichever variant happened to load first. Prefer the live-synced
    // cache (kept current by synchronizeLiveStorefrontInventory) over the
    // page's initial snapshot, falling back to the snapshot only if the
    // live cache has nothing yet.
    const stockFlagEl = document.getElementById(`catalog-card-stockflag-${productId}`);
    if (stockFlagEl) {
        const liveCacheEntry = MASTER_LIVE_INVENTORY_CACHE[productId];
        const liveVariantMatch = liveCacheEntry?.variants?.find(v => v.id === variantId);
        const resolvedStock = liveVariantMatch ? parseInt(liveVariantMatch.stock) : parseInt(matchedVariant.stock);
        const stockCount = Number.isFinite(resolvedStock) ? resolvedStock : 0;

        if (stockCount > 0 && stockCount <= 2) {
            stockFlagEl.innerHTML = `<i class="fas fa-fire"></i> Only ${stockCount} left`;
            stockFlagEl.classList.remove('angel-card-stock-flag--available');
            stockFlagEl.style.display = '';
        } else if (stockCount > 2) {
            stockFlagEl.innerHTML = `<i class="fas fa-check-circle"></i> ${stockCount} in stock`;
            stockFlagEl.classList.add('angel-card-stock-flag--available');
            stockFlagEl.style.display = '';
        } else {
            stockFlagEl.style.display = 'none';
        }
    }
}

// ➔ Routes the main card "Add to Cart" button clicks through the active color state

function handleCatalogCardAddToCart(productId, safeTitle) {
    const cardEl = document.getElementById(`catalog-card-${productId}`);
    if (!cardEl) {
        addToCartEngine(productId);
        return;
    }

    const activeVariantId = cardEl.getAttribute('data-active-variant-id');
    const currentDb = (typeof productDatabase !== 'undefined') ? productDatabase : (window.productDatabase || []);
    const product = currentDb.find(p => p.id === productId);

    if (product && product.product_variants && product.product_variants.length > 0 && activeVariantId) {
        const matchedVariant = product.product_variants.find(v => v.id === parseInt(activeVariantId));
        if (matchedVariant) {
            // Locks the global checkout state to the selected main page dot color item
            window.activeVariantSelection = matchedVariant;
        }
    }
    
    // Execute global cart addition flow mechanics
    addToCartEngine(productId);
}


function changeQtyExplicit(cartLineId, delta) {
    const targetItem = shoppingCart.find(item => item.cartLineId === cartLineId);
    if (!targetItem) return;

    targetItem.quantity += delta;
    if (targetItem.quantity <= 0) {
        shoppingCart = shoppingCart.filter(item => item.cartLineId !== cartLineId);
    }
    updateCartUI();
}

// ➔ Replace your old removeFromCart(id) function with this:

function removeFromCartExplicit(cartLineId) {
    shoppingCart = shoppingCart.filter(item => item.cartLineId !== cartLineId);
    updateCartUI();
}
// ➔ FRESH, EXTRA-SAFE ROW BUILDER (Completely isolated to prevent loops)

function openWhyAngelModal(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('whyAngelTrustModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}


function closeWhyAngelModal() {
    const modal = document.getElementById('whyAngelTrustModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close the modal instantly if the user clicks anywhere outside the card frame box

window.addEventListener('click', function(e) {
    const modal = document.getElementById('whyAngelTrustModal');
    if (e.target === modal) {
        closeWhyAngelModal();
    }
});

// =========================================================================
// ANGEL JEWELLERY — CATALOG LAYOUT SWITCHER ENGINE
// =========================================================================

function switchCatalogLayout(layoutType) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    // 1. Remove any existing layout modifier classes
    grid.classList.remove('layout-list', 'layout-large', 'layout-standard');
    
    // 2. Add the newly selected layout class (unless it's 'standard', which is default)
    if (layoutType !== 'standard') {
        grid.classList.add(`layout-${layoutType}`);
    }

    // 3. Update the visual UI state of the buttons
    document.querySelectorAll('.layout-btn').forEach(btn => {
        if (btn.getAttribute('data-layout') === layoutType) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 4. Save preference silently so it persists on page refresh
    localStorage.setItem('angelJewelleryLayoutPref', layoutType);
}

// 5. Automatically apply the saved layout on page load

document.addEventListener('DOMContentLoaded', () => {
    const savedLayout = localStorage.getItem('angelJewelleryLayoutPref');
    if (savedLayout) {
        switchCatalogLayout(savedLayout);
    }
});

// =========================================================================
// ANGEL JEWELLERY — LIVE HERO CAROUSEL LOADER FOR STOREFRONT
// =========================================================================
async function loadLiveCarouselDatabaseEngine() {
    const sbUrl = ANGEL_STORE_CONFIG?.DATABASE?.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG?.DATABASE?.SUPABASE_ANON_KEY;
    if (!sbUrl || !sbKey) return;

    const targetUrl = `${sbUrl}/rest/v1/Carousel?select=*&order=display_order.asc`;
    const track = document.getElementById('carouselSliderTrack');

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: { 
                'apikey': sbKey, 
                'Authorization': `Bearer ${sbKey}`, 
                'Content-Type': 'application/json' 
            }
        });

        if (!response.ok) throw new Error(`Supabase Carousel fetch status: ${response.status}`);
        
        carouselRegistryCache = await response.json();
        if (!track) return;

        if (carouselRegistryCache.length === 0) {
            track.innerHTML = `
                <div class="carousel-slide" style="flex:0 0 100%; min-width:100%; position:relative; border-radius:8px; overflow:hidden;">
                    <img src="assets/carousel/slide-1.png" style="width:100%; height:100%; object-fit:cover; display:block;">
                </div>`;
            return;
        }

        // Render live slides dynamically into the track
        track.innerHTML = carouselRegistryCache.map(slide => `
            <div class="carousel-slide" style="flex:0 0 100%; min-width:100%; position:relative; box-sizing:border-box; border-radius:8px; overflow:hidden; width:100%;">
                <img src="${slide.image_url}" loading="lazy" decoding="async" style="width:100%; height:100%; object-fit:cover; display:block;" alt="${slide.title || 'Campaign Banner'}">
            </div>
        `).join('');

        // Re-initialize indicator dots & rotation loop after slides populate the DOM
        if (typeof initializeLuxuryBannerCarousel === 'function') {
            initializeLuxuryBannerCarousel();
        }

    } catch (err) {
        console.error("❌ Failed to load live storefront carousel banners:", err);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Fetch live carousel slides from Supabase table
    await loadLiveCarouselDatabaseEngine();

    // 2. Load catalog & coupons
    loadProductDatabaseEngine();
    loadLiveCouponDatabaseEngine();
});