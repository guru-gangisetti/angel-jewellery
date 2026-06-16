/* =========================================================================
   ANGEL JEWELLERY — COMPLETE MASTER RUNTIME ENGINE APPLICATIVE LOGIC
   ========================================================================= */
let productDatabase = [];
let shoppingCart = [];       
let wishlistMemory = [];     
let adminOrdersCache = [];       
let currentAdminActiveTab = "pending";
let activeDiscount = { code: "", type: "", value: 0 };
let adminConsoleSearchQueryString = "";
let currentSelectedFilterCategoryKey = "all"; 
let MASTER_LIVE_INVENTORY_CACHE = {};

const FREE_SHIPPING_THRESHOLD = 1000; 

let INTEGRATED_ADMIN_AUTH_STATE = false;

const couponRegistry = {
    "ANGEL10": { type: "percentage", value: 10 },
    "WELCOME5": { type: "percentage", value: 5 },
    "FESTIVE2000": { type: "flat", value: 2000 },
    "LAUNCH2026": { type: "percentage", value: 15 }
};

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
// ANGEL JEWELLERY — HEADLESS COMMERCE AUTOMATED DATA DATA STREAM MATRIX
// =========================================================================
async function loadProductDatabaseEngine() {
    try {
        console.log("Synchronizing live data matrix cleanly via single-source SheetDB repository...");
        
        const baseSheetDbEndpoint = ANGEL_STORE_CONFIG?.DATABASE?.SHEETDB_API_URL || "https://sheetdb.io/api/v1/0lvmtng1nhhhi";
        const cleanFetchTargetUrl = `${baseSheetDbEndpoint.replace(/\/$/, "")}?sheet=Products`;

        const databaseResponse = await fetch(cleanFetchTargetUrl);
        if (!databaseResponse.ok) throw new Error(`Spreadsheet connection dropped: ${databaseResponse.status}`);

        const databasePayload = await databaseResponse.json();

        // Remap raw spreadsheet row fields into strict clean execution numbers and variables
        productDatabase = databasePayload.map(item => {
            const parsedUniqueId = parseInt(item.id);
            const verifiedPrice = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
            const liveStockLevel = parseInt(item.stock) ?? 0;
            const updatedStatus = liveStockLevel <= 0 ? "sold" : String(item.status || 'available').trim().toLowerCase();

            // Cache stock limits inside memory lookups simultaneously
            MASTER_LIVE_INVENTORY_CACHE[parsedUniqueId] = {
                stock: liveStockLevel,
                status: updatedStatus
            };

            return {
                id: parsedUniqueId,
                title: item.title,
                price: verifiedPrice,
                category: item.category || 'Luxury Collection',
                image: item.image || 'assets/placeholder.png',
                badge: updatedStatus === "sold" ? "Sold Out" : (item.badge || ''),
                description: item.description || ''
            };
        });

        console.log(`Synchronization successful. Compiled ${productDatabase.length} masterpieces dynamically.`);

        // ➔ THE CRITICAL SEQUENCING REPAIR: Build the visual collection folder panels FIRST!
        if (typeof generateDynamicCatalogFilters === 'function') {
            generateDynamicCatalogFilters();
        }

    } catch (error) {
        console.error('Critical spreadsheet extraction breakdown caught:', error);
    }
}
// =========================================================================
// ANGEL JEWELLERY — FORTIFIED ADMINISTRATIVE CONTROL ACTIVATOR
// =========================================================================
function challengeAdminIdentityGateway() {
    const masterAdminPasskey = "ANGEL2026";
    const accessAttempt = prompt("🔒 Administrative Clearance Verification Required.\nPlease enter your Master Access Key:");
    
    if (accessAttempt === null) return;
    
    if (accessAttempt.trim() === masterAdminPasskey) {
        INTEGRATED_ADMIN_AUTH_STATE = true;
        
        // ➔ THE OVERRIDE FIX: Inject explicit layout variables directly to force visibilities
        let styleNode = document.getElementById('angelJewelryAdminUIControlsStyleTag');
        if (!styleNode) {
            styleNode = document.createElement("style");
            styleNode.id = 'angelJewelryAdminUIControlsStyleTag';
            document.head.appendChild(styleNode);
        }
        
        // Hardcodes absolute visibility rules so no other theme class can hide them
        styleNode.innerHTML = `
            .admin-action-inline-trigger { display: inline-flex !important; }
            #adminLauncherFloatingUtilityNode { background: #ff1493 !important; color: #ffffff !important; width: 44px !important; height: 44px !important; font-size: 1.1rem !important; box-shadow: 0 4px 15px rgba(255,20,147,0.4); }
        `;
        
        const topAddBtn = document.getElementById("topMenuBarAdminCreateBtn");
        if (topAddBtn) {
            topAddBtn.style.setProperty("display", "inline-flex", "important");
        }
        
        // ➔ THE REBUILD RUN: Instantly kick start a complete rendering loop sync 
        // so that edit buttons render live on your screen right away!
        if (typeof filterCatalog === "function") {
            filterCatalog(); 
        }
    } else {
        alert("❌ Identity Handshake Blocked: Invalid Passcode.");
    }
}

// =========================================================================
// ANGEL JEWELLERY — DYNAMIC INLINE CRUD WRITE OPERATIONS METHODS
// =========================================================================
function openAdminFormModalForCreation() {
    document.getElementById('masterJewelryAdminForm').reset();
    document.getElementById('formActionProductId').value = "";
    document.getElementById('formProductId').disabled = false;
    document.getElementById('adminFormModalTitle').innerHTML = `<i class="fas fa-plus-circle" style="color:#ff1493;"></i> Curate New Masterpiece`;
    document.getElementById('formSubmitActionBtn').innerText = "Commit Matrix to Live Vault";
    document.getElementById('adminPieceVaultModal').style.display = 'flex';
}

function openAdminFormModalForEditing(event, id) {
    if (event) event.stopPropagation(); // Block card QuickView trigger clicks from bubbling
    
    const product = productDatabase.find(p => p.id === id);
    if (!product) return;

    const stockInfo = MASTER_LIVE_INVENTORY_CACHE[id] || { stock: 5, status: 'available' };

    document.getElementById('formActionProductId').value = product.id;
    document.getElementById('formProductId').value = product.id;
    document.getElementById('formProductId').disabled = true; // Lock identity column fields
    document.getElementById('formProductTitle').value = product.title;
    document.getElementById('formProductCategory').value = product.category;
    document.getElementById('formProductPrice').value = product.price;
    document.getElementById('formProductStock').value = stockInfo.stock;
    document.getElementById('formProductBadge').value = product.badge === "Sold Out" ? "" : product.badge;
    document.getElementById('formProductImage').value = product.image;
    document.getElementById('formProductDesc').value = product.description;

    document.getElementById('adminFormModalTitle').innerHTML = `<i class="fas fa-edit" style="color:#ffd700;"></i> Edit Product #${product.id}`;
    document.getElementById('formSubmitActionBtn').innerText = "Update";
    document.getElementById('adminPieceVaultModal').style.display = 'flex';
}

function closeAdminFormVaultModal() {
    document.getElementById('adminPieceVaultModal').style.display = 'none';
}

// Bind intercept routing configurations straight inside form submission sequences
document.addEventListener("DOMContentLoaded", () => {
    const adminFormNode = document.getElementById('masterJewelryAdminForm');
    if (adminFormNode) {
        adminFormNode.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('formSubmitActionBtn');
            const originalButtonText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Processing Stream Sync...`;

            const editingTargetRowId = document.getElementById('formActionProductId').value;
            const isEditOperationMode = editingTargetRowId !== "";

            const baseSheetDbEndpoint = ANGEL_STORE_CONFIG?.DATABASE?.SHEETDB_API_URL || "https://sheetdb.io/api/v1/0lvmtng1nhhhi";
            const cleanBaseUrl = baseSheetDbEndpoint.replace(/\/$/, "");

            const formStockVal = parseInt(document.getElementById('formProductStock').value) || 0;
            const computedStatusFlag = formStockVal <= 0 ? "sold" : "available";

            const itemFormDataObject = {
                id: document.getElementById('formProductId').value,
                title: document.getElementById('formProductTitle').value.trim(),
                category: document.getElementById('formProductCategory').value,
                price: document.getElementById('formProductPrice').value,
                stock: formStockVal,
                badge: formStockVal <= 0 ? "Sold Out" : document.getElementById('formProductBadge').value.trim(),
                status: computedStatusFlag,
                image: document.getElementById('formProductImage').value.trim(),
                description: document.getElementById('formProductDesc').value.trim()
            };

            try {
                let requestUrl = "";
                let fetchOptions = {};

                if (isEditOperationMode) {
                    // Mode A: Perform an edit operational PATCH request
                    requestUrl = `${cleanBaseUrl}/id/${editingTargetRowId}?sheet=Products`;
                    fetchOptions = {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ data: itemFormDataObject })
                    };
                } else {
                    // Mode B: Perform a creation POST row insertion request
                    requestUrl = `${cleanBaseUrl}?sheet=Products`;
                    fetchOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ data: [itemFormDataObject] })
                    };
                }

                const response = await fetch(requestUrl, fetchOptions);
                if (!response.ok) throw new Error("Cloud stream communication rejected parameters.");
                
                alert(`Update Success!`);
                closeAdminFormVaultModal();
                
                // Force hot-reloading data matrix streams instantly without crashing tabs
                await loadProductDatabaseEngine();

            } catch (error) {
                console.error("Administrative execution pipeline crash:", error);
                alert("Pipeline Sync Interrupted: Verify data formatting thresholds and API quotas.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalButtonText;
            }
        });
    }
});




function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

// =========================================================================
// ANGEL JEWELLERY — HARMONIZED INDESTRUCTIBLE SEARCH & FILTER ENGINE
// =========================================================================
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
            productGrid.innerHTML = filteredResults.map(product => {
                const isSoldOut = product.badge && product.badge.toLowerCase() === 'sold out';
                const isFavorited = (typeof wishlistMemory !== 'undefined') ? wishlistMemory.includes(product.id) : false;
                
                const badgeHTML = product.badge 
                    ? `<span class="product-badge" style="position: absolute; top: 15px; left: 15px; font-size: 0.65rem; padding: 4px 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 2px; z-index: 2; ${getBadgeCustomStyles(product.badge)}">${product.badge}</span>`
                    : '';
                    
                const rawPriceValue = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
                const displayPrice = rawPriceValue > 0 ? `₹${rawPriceValue.toLocaleString('en-IN')}` : 'Price on Request';
                const safeTitleString = (product.title || '').replace(/'/g, "\\'");
                const displayCategory = product.category || product.type || 'Luxury Collection';

                // ➔ HARDENED EMBEDDED ENGINE CONTROL LINK MARKUP (FORCED HIGHER Z-INDEX LAYER)
                const adminEditInlineControlMarkup = INTEGRATED_ADMIN_AUTH_STATE ? `
                    <button type="button" class="admin-action-inline-trigger" 
                            onclick="openAdminFormModalForEditing(event, ${product.id})" 
                            style="position: absolute; top: 0px; left: 0px; z-index: 9999; display: inline-flex !important; align-items: center; justify-content: center; gap: 4px; padding: 6px 14px; background: #ffffff; color: #202c55; border: 2px solid #202c55; border-radius: 50px; font-size: 0.68rem; font-weight: 700; font-family: 'Montserrat'; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 6px 20px rgba(0,0,0,0.15); cursor: pointer; transition: all 0.2s; outline:none;">
                        <i class="fas fa-edit" style="font-size:0.65rem; color:#cca43b;"></i> Edit #${product.id}
                    </button>
                ` : '';

                return `
                    <div class="product-card" 
                         onclick="openQuickViewShield(${product.id})" 
                         style="background: #ffffff; border: 1px solid var(--purple-primary, #e8e8ef); border-radius: 8px; padding: 16px; position: relative; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.02); cursor: pointer;">
                        
                        ${adminEditInlineControlMarkup}

                        <div class="product-image-container" style="position: relative; width: 100%; aspect-ratio: 1/1; overflow: hidden; background: #fafafa; border-radius: 2px; margin-bottom: 14px; z-index:1;">
                            ${badgeHTML}
                            
                            <button class="wishlist-heart-btn ${isFavorited ? 'active' : ''}" 
                                    onclick="event.stopPropagation(); toggleWishlistEngine(event, ${product.id}, this)" 
                                    aria-label="Add to wishlist"
                                    style="position: absolute; top: 15px; right: 15px; z-index: 3; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; background: #ffffff; border: none; border-radius: 50%; box-shadow: 0 3px 10px rgba(0,0,0,0.08); cursor: pointer; outline: none;">
                                <i class="${isFavorited ? 'fas' : 'far'} fa-heart" style="font-size: 1rem; color: ${isFavorited ? 'var(--pink-accent, #ff1493)' : '#777'}; transition: color 0.2s ease;"></i>
                            </button>

                            <img src="${product.image || 'assets/placeholder.png'}" style="width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 8px" onerror="this.src='assets/placeholder.png'">
                        </div>
                        
                        <div style="text-align: left; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
                            <div>
                                <p class="product-category" style="color: var(--pink-accent, #ff1493); font-weight: 600; margin: 0 0 4px 0; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Montserrat', sans-serif; text-align: center;">
                                    ${displayCategory}
                                </p>
                                <h3 style="font-size: 0.88rem; font-weight: 600; margin: 8px 0 6px 0; color: var(--text-dark-primary); line-height: 1.4; min-height: 38px; font-family: 'Montserrat', sans-serif; text-align: center;">${product.title}</h3>
                                <p style="font-size: 0.98rem; font-weight: 700; color: var(--purple-primary, #202c55); margin: 0 0 14px 0; text-align: center;">${displayPrice}</p>
                            </div>
                            
                            <button class="btn-order-wa ${isSoldOut ? 'btn-grid-sold-out' : ''}" 
                                    onclick="event.stopPropagation(); ${isSoldOut ? '' : `addToCartEngine(${product.id}); triggerCartNotification('${safeTitleString}');`}"
                                    ${isSoldOut ? 'disabled' : ''} 
                                    style="width: 100%; 
                                            padding: 11px 0; 
                                            font-size: 0.72rem; 
                                            font-weight: 700; 
                                            text-transform: uppercase; 
                                            letter-spacing: 1.5px; 
                                            cursor: ${isSoldOut ? 'not-allowed' : 'pointer'}; 
                                            border-radius: 4px; 
                                            display: inline-flex; 
                                            align-items: center; 
                                            justify-content: center; 
                                            gap: 6px; 
                                            margin-top: 5px;
                                            font-family: 'Montserrat', sans-serif;
                                            transition: all 0.3s ease;
                                            background: ${isSoldOut ? '#f4f4f7 !important' : 'var(--purple-primary, #202c55)'}; 
                                            color: ${isSoldOut ? '#8a8da0 !important' : '#ffffff !important'}; 
                                            border: ${isSoldOut ? '1px solid #e2e4ed !important' : 'none !important'};
                                            box-shadow: ${isSoldOut ? 'none !important' : ''};">
                                <i class="${isSoldOut ? 'fas fa-hourglass-start' : 'fas fa-shopping-cart'}" style="font-size: 0.7rem;"></i> 
                                ${isSoldOut ? 'Restocking Soon!' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // D. HOMEPAGE SHOWCASE ROUTERS — Fired independently with zero rendering block conflicts
    if (productDatabase && productDatabase.length > 0) {
        if (typeof renderVaultSaleSection === 'function') renderVaultSaleSection();
        if (typeof renderTrendingSection === 'function') renderTrendingSection();
    }
    // document.getElementById('collection-main-title').scrollIntoView({
    //                     behavior: "smooth",
    //                     block: "start"
    //                 });
}

// =========================================================================
// 2. VAULT SALE SECTION RENDERER
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
        saleSection.style.display = 'none';
        return;
    }

    saleSection.style.display = 'block';
    saleGrid.innerHTML = "";

    saleItems.forEach(product => {
        const isSoldOut = product.badge && product.badge.toLowerCase() === 'sold out';
        const isFavorited = (typeof wishlistMemory !== 'undefined') ? wishlistMemory.includes(product.id) : false;
        
        const saleCard = document.createElement('div');
        saleCard.className = `product-card ${isSoldOut ? 'disabled-card' : ''}`;
        
        saleCard.style.cursor = 'pointer';
        saleCard.setAttribute('onclick', `openQuickViewShield(${product.id})`);
        
        const badgeHTML = product.badge ? `<span class="product-badge" style="position: absolute; top: 15px; left: 15px; font-size: 0.65rem; padding: 4px 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 2px; z-index: 2; ${getBadgeCustomStyles(product.badge)}">${product.badge}</span>` : '';

        const currentPriceValue = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
        const fallbackOldPrice = product.originalPrice || product.original_price || product.oldPrice;
        
        const originalPriceValue = fallbackOldPrice 
            ? (typeof fallbackOldPrice === 'number' ? fallbackOldPrice : parseFloat(fallbackOldPrice) || currentPriceValue)
            : Math.ceil(currentPriceValue * 1.25);

        const pricingLayoutHTML = `
            <p class="product-price" style="display: flex; align-items: center; gap: 10px; margin: 0; justify-content:center;">
                <span style="color: var(--purple-primary); font-weight: 700;">${formatCurrency(currentPriceValue)}</span>
                <span style="color: var(--text-muted); font-size: 0.85rem; text-decoration: line-through; font-weight: 500;">${formatCurrency(originalPriceValue)}</span>
            </p>
        `;

        const safeTitleString = (product.title || '').replace(/'/g, "\\'");

        saleCard.innerHTML = `
            <div class="product-img-wrapper" style="background: #ffffff; position: relative;">
                ${badgeHTML}
                <button class="wishlist-heart-btn ${isFavorited ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleWishlistEngine(event, ${product.id}, this)" 
                        aria-label="Add to wishlist" 
                        style="position: absolute; top: 15px; right: 15px; z-index: 3; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; background: #ffffff; border: none; border-radius: 50%; box-shadow: 0 3px 10px rgba(0,0,0,0.08); cursor: pointer; outline: none;">
                    <i class="${isFavorited ? 'fas' : 'far'} fa-heart" style="font-size: 1rem; color: ${isFavorited ? 'var(--pink-accent, #ff1493)' : '#777'};"></i>
                </button>
                <img src="${product.image}" loading="lazy" alt="${product.title}" onload="this.classList.add('loaded')">
            </div>
            <div class="product-info" style="background: #ffffff; text-align: left; padding: 12px 0 0 0;">
                <p class="product-category" style="color: var(--pink-accent); font-weight:600; margin-bottom: 4px; font-size: 0.78rem;">${product.category || 'Jewellery'} • Special Offer</p>
                <h3 class="product-title" style="font-size: 0.88rem; font-weight: 600; margin: 0 0 6px 0; color: var(--text-dark-primary); line-height: 1.4; min-height: 38px; font-family: 'Montserrat', sans-serif;">${product.title}</h3>
                <div style="text-align: center; margin-bottom: 14px;">${pricingLayoutHTML}</div>
                <button class="btn-order-wa" 
                        onclick="event.stopPropagation(); ${isSoldOut ? '' : `addToCartEngine(${product.id}); triggerCartNotification('${safeTitleString}');`}"
                        ${isSoldOut ? 'disabled' : ''} 
                        style="width: 100%; background: var(--purple-primary, #202c55); color: #ffffff; border: none; padding: 11px 0; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; margin-top: 5px;">
                    <i class="${isSoldOut ? 'fas fa-hourglass-start' : 'fas fa-shopping-cart'}" style="font-size: 0.7rem;"></i> 
                    ${isSoldOut ? 'Restocking Soon' : 'Add to Cart'}
                </button>
            </div>
        `;
        saleGrid.appendChild(saleCard);
    });
}

// =========================================================================
// 3. TRENDING SECTION RENDERER
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
        
        trendingCard.style.cursor = 'pointer';
        trendingCard.setAttribute('onclick', `openQuickViewShield(${product.id})`);
        
        let badgeHTML = product.badge ? `<span class="product-badge" style="position: absolute; top: 15px; left: 15px; font-size: 0.65rem; padding: 4px 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 2px; z-index: 2; ${getBadgeCustomStyles(product.badge)}">${product.badge}</span>` : '';
        
        let pricingLayoutHTML = "";
        const currentPriceValue = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;

        if (product.originalPrice && product.originalPrice > product.price) {
            pricingLayoutHTML = `
                <p class="product-price" style="display: flex; align-items: center; gap: 10px; margin: 0; justify-content:center;">
                    <span style="color: var(--purple-primary); font-weight: 700;">${formatCurrency(currentPriceValue)}</span>
                    <span style="color: var(--text-muted); font-size: 0.85rem; text-decoration: line-through; font-weight: 500;">${formatCurrency(product.originalPrice)}</span>
                </p>
            `;
        } else {
            pricingLayoutHTML = `<p class="product-price" style="margin: 0; text-align: center; font-weight: 700; color: var(--purple-primary);">${formatCurrency(currentPriceValue)}</p>`;
        }

        const safeTitleString = (product.title || '').replace(/'/g, "\\'");

        trendingCard.innerHTML = `
            <div class="product-img-wrapper" style="background: #ffffff; position: relative;">
                ${badgeHTML}
                <button class="wishlist-heart-btn ${isFavorited ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleWishlistEngine(event, ${product.id}, this)" 
                        aria-label="Add to wishlist" 
                        style="position: absolute; top: 15px; right: 15px; z-index: 3; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; background: #ffffff; border: none; border-radius: 50%; box-shadow: 0 3px 10px rgba(0,0,0,0.08); cursor: pointer; outline: none;">
                    <i class="${isFavorited ? 'fas' : 'far'} fa-heart" style="font-size: 1rem; color: ${isFavorited ? 'var(--pink-accent, #ff1493)' : '#777'};"></i>
                </button>
                <img src="${product.image}" loading="lazy" alt="${product.title}" onload="this.classList.add('loaded')">
            </div>
            <div class="product-info" style="background: #ffffff; text-align: left; padding: 12px 0 0 0;">
                <p class="product-category" style="color: var(--pink-accent); font-weight:600; margin-bottom: 4px; font-size: 0.78rem;">${product.category || 'Luxury Masterpiece'}</p>
                <h3 class="product-title" style="font-size: 0.88rem; font-weight: 600; margin: 0 0 6px 0; color: var(--text-dark-primary); line-height: 1.4; min-height: 38px; font-family: 'Montserrat', sans-serif;">${product.title}</h3>
                ${pricingLayoutHTML}
                <button class="btn-order-wa" 
                        onclick="event.stopPropagation(); ${isSoldOut ? '' : `addToCartEngine(${product.id}); triggerCartNotification('${safeTitleString}');`}"
                        ${isSoldOut ? 'disabled' : ''} 
                        style="width: 100%; background: var(--purple-primary, #202c55); color: #ffffff; border: none; padding: 11px 0; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; margin-top: 5px;">
                    <i class="${isSoldOut ? 'fas fa-hourglass-start' : 'fas fa-shopping-cart'}" style="font-size: 0.7rem;"></i> 
                    ${isSoldOut ? 'Restocking Soon' : 'Add to Cart'}
                </button>
            </div>
        `;
        trendingGrid.appendChild(trendingCard);
    });
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
        const currentItemIdKey = parseInt(product.id);
        const cachedStockInfo = MASTER_LIVE_INVENTORY_CACHE[currentItemIdKey] || { stock: 5, status: 'available' };
        let checkoutButtonMarkup = "";
        
       // Check if the item is entirely sold out
        if (cachedStockInfo.stock <= 0 || cachedStockInfo.status === "sold") {
            checkoutButtonMarkup = `
                <button type="button" disabled class="btn btn-sold-out" style="background: #e1e1e6 !important; color: #8e8e9f !important; border: 1px solid #dcdce0 !important; cursor: not-allowed; width: 100%; height: 44px; font-weight: 600; font-family: 'Montserrat'; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px;">
                    <i class="fas fa-lock" style="font-size:0.75rem; margin-right:6px;"></i> Recrafting in Vault
                </button>
            `;
        } else {
            // Your existing functional buy button markup:
            checkoutButtonMarkup = `
                <button type="button" class="btn btn-primary" onclick="addToCartEngine(${product.id})" style="background: #202c55; color: #ffffff; width: 100%; height: 44px; border: none; border-radius: 4px; font-weight: 700; text-transform: uppercase; cursor: pointer;">
                    ADD TO CART
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

// =========================================================================
// ANGEL JEWELLERY — STABLE QUICK VIEW ENGINE WITH VAULT SCARCITY MANAGER
// =========================================================================
function openQuickViewShield(id) {
    const product = productDatabase.find(p => p.id === id);
    if (!product) return;

    const modalShield = document.getElementById('quickviewModalShield');
    if (!modalShield) return;

    // 1. Populate Primary Meta Elements
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

    // =========================================================================
    // ➔ NEW LOGIC: VAULT SCARCITY REAL-TIME EVALUATOR
    // =========================================================================
    const scarcityIndicator = document.getElementById('qvVaultScarcityIndicator');
    if (scarcityIndicator) {
        const itemBadgeLower = String(product.badge || '').trim().toLowerCase();
        
        // 1. Determine stock level gracefully (checks properties, drops back to helper configurations)
        let simulatedStock = typeof product.stock === 'number' ? product.stock : 12;
        if (itemBadgeLower === 'sold out') simulatedStock = 0;
        else if (itemBadgeLower === 'limited' || itemBadgeLower.includes('exclusive')) simulatedStock = 2;
        else if (itemBadgeLower === 'hot' || itemBadgeLower === 'trending') simulatedStock = 4;

        // 2. Render targeted premium copy based on current allocation thresholds
        if (simulatedStock === 0) {
            scarcityIndicator.style.display = "inline-block";
            scarcityIndicator.style.background = "rgba(108, 117, 125, 0.1)";
            scarcityIndicator.style.color = "#6c757d";
            scarcityIndicator.innerHTML = `<i class="fas fa-lock"></i> Stock Closed`;
        } 
        else if (simulatedStock <= 2) {
            scarcityIndicator.style.display = "inline-block";
            scarcityIndicator.style.background = "rgba(217, 56, 58, 0.1)";
            scarcityIndicator.style.color = "#d9383a";
            scarcityIndicator.innerHTML = `<i class="fas fa-hourglass-half fa-spin-slow" style="margin-right: 4px;"></i> Only few Left In Stock`;
        } 
        else if (simulatedStock <= 5) {
            scarcityIndicator.style.display = "inline-block";
            scarcityIndicator.style.background = "rgba(204, 164, 59, 0.1)";
            scarcityIndicator.style.color = "#cca43b";
            scarcityIndicator.innerHTML = `<i class="fas fa-fire" style="margin-right: 4px;"></i> High Demand Item`;
        } 
        else {
            // Reassuring luxury message for stable pieces
            scarcityIndicator.style.display = "inline-block";
            scarcityIndicator.style.background = "rgba(42, 123, 106, 0.1)";
            scarcityIndicator.style.color = "#2a7b6a";
            scarcityIndicator.innerHTML = `<i class="fas fa-shield-alt" style="margin-right: 4px;"></i> Stock Guaranteed`;
        }
    }
    
    // =========================================================================
    // ANGEL JEWELLERY — LUXURY ACTION BUTTON STATE MANAGER
    // =========================================================================
const isSoldOut = product.badge && product.badge.toLowerCase() === 'sold out';
const qvBtn = document.getElementById('qvAddToCartBtn');

if (qvBtn) {
    if (isSoldOut) {
        qvBtn.innerHTML = `<i class="fas fa-lock" style="font-size: 0.65rem; padding-left: 5px; margin-right: 6px; opacity: 0.8;"></i> Restocking soon!`;
        qvBtn.disabled = true;
        qvBtn.onclick = null;

        qvBtn.style.cssText = `
            width: 100%; 
            padding: 14px 0; 
            font-size: 0.72rem; 
            font-weight: 700; 
            letter-spacing: 1.5px; 
            text-transform: uppercase; 
            display: inline-flex; 
            align-items: center; 
            justify-content: center; 
            background: #f4f4f7 !important; 
            color: #8a8da0 !important; 
            border: 1px solid #e2e4ed !important; 
            border-radius: 4px; 
            cursor: not-allowed; 
            font-family: 'Montserrat', sans-serif;
            box-shadow: none !important;
            transition: all 0.3s ease;
        `;
    } else {
        qvBtn.innerHTML = `Add To Cart`;
        qvBtn.disabled = false;
        qvBtn.onclick = () => {
            addToCartEngine(product.id);
            closeQuickViewShield();
            triggerCartNotification(product.title);
        };
        qvBtn.style.cssText = `
            width: 100%; 
            padding: 14px 0; 
            font-size: 0.75rem; 
            font-weight: 700; 
            letter-spacing: 1.5px; 
            text-transform: uppercase; 
            display: inline-flex; 
            align-items: center; 
            justify-content: center; 
            gap: 10px; 
            background: var(--purple-primary, #202c55); 
            color: #ffffff !important; 
            border: none !important; 
            border-radius: 4px; 
            cursor: pointer; 
            font-family: 'Montserrat', sans-serif;
            transition: all 0.3s ease;
        `;
    }
}

    // 2. GENERATE THE COMPLEMENTARY LOOK RECOMMENDATIONS
    const recommendationSection = document.getElementById('qvPairingRecommendationSection');
    const carouselTrack = document.getElementById('qvPairingCarouselTrack');

    if (carouselTrack && productDatabase && productDatabase.length > 0) {
        carouselTrack.innerHTML = ""; 

        const currentCategory = String(product.category || '').trim().toLowerCase();
        const structuralPairingMatches = productDatabase.filter(item => {
            return item && item.id !== product.id && String(item.category || '').trim().toLowerCase() === currentCategory;
        });

        if (structuralPairingMatches.length === 0) {
            if (recommendationSection) recommendationSection.style.display = "none";
        } else {
            if (recommendationSection) recommendationSection.style.display = "block";

            const displayLimitStack = structuralPairingMatches.slice(0, 4);

            carouselTrack.innerHTML = displayLimitStack.map(pairingItem => {
                const itemPriceRaw = typeof pairingItem.price === 'number' ? pairingItem.price : parseFloat(pairingItem.price) || 0;
                
                return `
                    <div class="pairing-carousel-card" 
                         onclick="openQuickViewShield(${pairingItem.id})"
                         style="flex: 0 0 calc(50% - 7px); min-width: 140px; background: #ffffff; border: 1px solid #e8e8ef; border-radius: 4px; padding: 10px; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 6px rgba(0,0,0,0.01); box-sizing: border-box;">
                        
                        <div style="width: 48px; height: 48px; min-width: 48px; aspect-ratio: 1/1; overflow: hidden; border-radius: 2px; background: #fafafa;">
                            <img src="${pairingItem.image || 'assets/placeholder.png'}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.src='assets/placeholder.png'">
                        </div>
                        
                        <div style="overflow: hidden; flex-grow: 1; text-align: left;">
                            <h5 style="margin: 0 0 3px 0; font-size: 0.72rem; font-weight: 600; color: var(--text-dark-primary, #111116); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'Montserrat', sans-serif;">${pairingItem.title}</h5>
                            <p style="margin: 0; font-size: 0.75rem; font-weight: 700; color: var(--purple-primary, #202c55); font-family: 'Montserrat', sans-serif;">₹${itemPriceRaw.toLocaleString('en-IN')}</p>
                        </div>
                        
                        <i class="fas fa-chevron-right" style="font-size: 0.65rem; color: #ccc; margin-left: auto; padding-right: 2px;"></i>
                    </div>
                `;
            }).join('');
        }
    }

    modalShield.style.display = "flex";

    try {
        modalShield.scrollTo({ top: 0, behavior: 'smooth' });
        const internalCardElement = modalShield.querySelector('.qv-modal-card');
        if (internalCardElement && typeof internalCardElement.scrollTo === 'function') {
            internalCardElement.scrollTo({ top: 0 });
        }
    } catch (scrollError) {
        modalShield.scrollTop = 0;
    }
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
    // ➔ THE CRITICAL FIX: Trigger product sheet load engine immediately on app startup!
    loadProductDatabaseEngine();
    
    initializeLuxuryBannerCarousel();
    mountCouponHelperBadges();
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
        "image": "angel-logo.png", 
        "handler": function (transactionResponse) {
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
    
    const dbPayload = {
        data: [
            {
                "Payment ID": paymentId,
                "Date": new Date().toLocaleString('en-IN'),
                "Client Name": name,
                "Phone": phone,
                "Address": address,
                "Order Items": shoppingCart.map(i => `${i.title} (x${i.quantity})`).join(", "),
                "Order Images": orderImageUrlsString,
                "Total Paid": formatCurrency(finalTotalCost),
                "Status": "Paid"
            }
        ]
    };

    // Post data to master SheetDB database
    fetch(ANGEL_STORE_CONFIG.DATABASE.SHEETDB_API_URL, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dbPayload)
    })
    .then(response => response.json())
    .then(data => {
        console.log("SheetDB logging successful:", data);
        
        // Trigger background inventory deduction safely before resetting cart memory
        if (typeof executeSheetDbInventoryDeduction === "function") {
            executeSheetDbInventoryDeduction(shoppingCart);
        }
        
        // Wipe local runtime cart states and update checkout interface view frameworks
        shoppingCart = [];
        activeDiscount = { code: "", type: "", value: 0 };
        if (localStorage.getItem('shoppingCart')) localStorage.removeItem('shoppingCart');
        
        if (document.getElementById('couponInput')) document.getElementById('couponInput').value = "";
        if (document.getElementById('customerAddress')) document.getElementById('customerAddress').value = "";
        
        updateCartUI();
        closeInvoiceScreen(); 
        confirmationScreen.style.display = 'flex';
    })
    .catch(err => {
        console.error("SheetDB network stream drop:", err);
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
        statusMsg.innerText = "Please provide a valid contact number.";
        return;
    }
    
    statusMsg.style.display = "block";
    statusMsg.style.color = "var(--purple-primary)";
    statusMsg.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px 0; gap: 12px;">
            <i class="fas fa-circle-notch fa-spin" style="font-size: 2rem; color: var(--purple-primary);"></i>
            <span style="font-size: 0.85rem; font-weight: 600; letter-spacing: 0.5px; color: var(--text-muted, #777); text-transform: uppercase;">
                Loading...
            </span>
        </div>
    `;

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
            statusMsg.innerText = `Discovered ${matchingOrdersArray.length} authenticated reservation order file(s):`;

            resultsContainer.innerHTML = matchingOrdersArray.map(order => {
                const rawSheetStatus = (order['Status'] || '').trim().toLowerCase();
                
                let displayStatusText = "Order Placed";
                let badgeBgColor = "rgba(32, 44, 85, 0.08)"; 
                let badgeTextColor = "var(--purple-primary)";
                let trackingBlockHTML = ""; // Empty string container wrapper if pending placement

                if (rawSheetStatus === 'shipped') {
                    displayStatusText = "Shipped";
                    badgeBgColor = "rgba(255, 20, 147, 0.1)"; 
                    badgeTextColor = "var(--pink-accent)";
                    
                    const courierPartner = order['Courier'] || 'Logistics Fleet';
                    const waybillReference = order['Tracking Number'] || 'Awaiting Allocation';
                    
                    trackingBlockHTML = `
                        <div style="background: #fff0f6; border: 1px solid #ffa3d1; border-radius: 4px; padding: 12px 16px; margin-bottom: 5px; display: flex; flex-direction: column; gap: 4px; text-align: left;">
                            <span style="font-size: 0.68rem; text-transform: uppercase; color: var(--pink-accent); font-weight: 700; letter-spacing: 0.5px;">
                                <i class="fas fa-truck-moving" style="margin-right: 4px;"></i> Live Consignment Logistics Waybill
                            </span>
                            <p style="margin: 0; font-size: 0.85rem; font-weight: 600; color: #111116;">
                                Carrier Agent: <strong style="color: var(--purple-primary); font-weight: 700;">${courierPartner}</strong>
                            </p>
                            <p style="margin: 0; font-size: 0.85rem; font-weight: 600; color: #111116;">
                                Tracking ID: <strong style="font-family: monospace; color: var(--purple-primary); letter-spacing: 0.5px;">${waybillReference}</strong>
                            </p>
                        </div>
                    `;
                }

                const itemNamesArray = (order['Order Items'] || '').split(',').map(str => str.trim());
                const itemImagesArray = (order['Order Images'] || '').split(',').map(str => str.trim());

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
                        <tr style="border-bottom: 1px solid #f1f1f5;">
                            <td style="padding: 10px 12px; width: 60px; text-align: center; vertical-align: middle;">
                                <div style="width: 44px; height: 44px; border-radius: 4px; border: 1px solid #e8e8ef; overflow: hidden; background: #ffffff; display: block; margin: 0 auto;">
                                    <img src="${matchedImgUrl}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/placeholder.png'">
                                </div>
                            </td>
                            <td style="padding: 10px 12px; font-size: 0.88rem; font-weight: 600; color: #111116; text-align: left; vertical-align: middle;">
                                ${parsedTitle}
                            </td>
                            <td style="padding: 10px 12px; font-size: 0.85rem; font-weight: 700; color: var(--purple-primary); text-align: center; vertical-align: middle;">
                                ${parsedQuantity}
                            </td>
                        </tr>
                    `;
                }).join('');

                return `
                <div style="background: var(--bg-surface); border: 1px solid var(--purple-primary); border-radius: 6px; padding: 25px; box-sizing: border-box; width: 100%; position: relative; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 4px 15px rgba(32, 44, 85, 0.02); text-align: left;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px; font-size: 0.8rem; color: var(--text-muted); font-weight:600; gap: 10px; flex-wrap: wrap;">
                        <span>Ref ID: <strong style="color: var(--purple-primary); font-family: monospace;">${order['Payment ID']}</strong></span>
                        <span>${order['Date']}</span>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; background: #ffffff; padding: 12px 16px; border: 1px solid var(--border-subtle); border-radius: 4px;">
                        <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 0.5px;">
                            <i class="fas fa-box-open" style="margin-right: 6px; color: var(--purple-primary);"></i> Order Status
                        </span>
                        <span style="background: ${badgeBgColor}; color: ${badgeTextColor}; font-size: 0.7rem; padding: 6px 14px; border-radius: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; transition: all 0.3s ease;">
                            ${displayStatusText}
                        </span>
                    </div>

                    <!-- LOGISTICS PARTNER INJECTION IN THE TRACKING PORTAL CONTAINER -->
                    ${trackingBlockHTML}

                    <div style="width: 100%; overflow-x: auto; background: #fdfdfd; border: 1px solid #e8e8ef; border-radius: 6px;">
                        <table style="width: 100%; border-collapse: collapse; margin: 0; padding: 0;">
                            <thead>
                                <tr style="background: #f4f4f7; border-bottom: 1px solid #e8e8ef; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-muted); font-weight: 700;">
                                    <th style="padding: 10px 12px; width: 60px; text-align: center; font-weight: 700;">Preview</th>
                                    <th style="padding: 10px 12px; text-align: left; font-weight: 700;">Item Masterpiece Title</th>
                                    <th style="padding: 10px 12px; width: 80px; text-align: center; font-weight: 700;">Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${inventoryRowsHTML}
                            </tbody>
                        </table>
                    </div>

                    <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px; font-size: 0.85rem; color: var(--text-dark-primary); font-weight:500; display: flex; flex-direction: column; gap: 4px;">
                        <p style="margin: 0;"><span style="color: var(--text-muted); font-weight:600;">Consignee:</span> ${order['Client Name']}</p>
                        <p style="margin: 0;"><span style="color: var(--text-muted); font-weight:600;">Destination:</span> ${order['Address']}</p>
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 12px; font-size: 1.1rem; font-weight: 700; color: var(--purple-primary);">
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

function openAdminMasterConsole(event) {
    if (event) event.preventDefault();
    const MASTER_ADMIN_SECRET_KEY = "1234"; 

    const inputtedPasskeyAttempt = prompt("🔒 Access Restricted: Enter Administrative Passcode:");
    if (inputtedPasskeyAttempt === null) return;

    if (inputtedPasskeyAttempt.trim() !== MASTER_ADMIN_SECRET_KEY) {
        alert("❌ Security Alert: Invalid administrative credentials provided.");
        return; 
    }

    const adminOverlay = document.getElementById('adminMasterConsoleOverlay');
    const statusMsg = document.getElementById('adminConsoleStatus');
    const ordersContainer = document.getElementById('adminMasterOrdersContainer');
    
    if (!adminOverlay || !statusMsg || !ordersContainer) return;
    
    ordersContainer.innerHTML = ""; 
    adminOverlay.style.display = 'flex';
    statusMsg.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: left; padding: 10px 0; gap: 10px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 1.2rem; color: var(--pink-accent);"></i>
            <span style="font-size: 0.85rem; font-weight: 600; letter-spacing: 0.5px; color: var(--purple-primary);">
                Loading...
            </span>
        </div>
    `;

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

function handleAdminConsoleSearch(queryValue) {
    adminConsoleSearchQueryString = queryValue.trim().toLowerCase();
    renderSegregatedAdminOrders();
}

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



function closeAdminMasterConsole() {
    document.getElementById('adminMasterConsoleOverlay').style.display = 'none';
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
// ANGEL JEWELLERY — RESPONSIVE ADMINISTRATIVE CONSOLE LAYOUT (UPDATED)
// =========================================================================
function renderSegregatedAdminOrders() {
    const statusMsg = document.getElementById('adminConsoleStatus');
    const ordersContainer = document.getElementById('adminMasterOrdersContainer');
    const pendingCountSpan = document.getElementById('adminPendingCount');
    const shippedCountSpan = document.getElementById('adminShippedCount');
    
    const pendingValueHeading = document.getElementById('analyticsPendingValue');
    const shippedValueHeading = document.getElementById('analyticsShippedValue');

    if (!ordersContainer || !adminOrdersCache) return;

    ordersContainer.innerHTML = "";

    let accumulatedPendingSum = 0;
    let accumulatedShippedSum = 0;

    adminOrdersCache.forEach(order => {
        const numericValue = parseFloat((order['Total Paid'] || '').replace(/[^0-9.]/g, '')) || 0;
        const statusStr = (order['Status'] || '').trim().toLowerCase();
        
        if (statusStr === 'shipped') {
            accumulatedShippedSum += numericValue;
        } else {
            accumulatedPendingSum += numericValue;
        }
    });

    if (pendingValueHeading) pendingValueHeading.innerText = formatCurrency(accumulatedPendingSum);
    if (shippedValueHeading) shippedValueHeading.innerText = formatCurrency(accumulatedShippedSum);

    const pendingOrdersList = adminOrdersCache.filter(order => (order['Status'] || '').trim().toLowerCase() !== 'shipped');
    const shippedOrdersList = adminOrdersCache.filter(order => (order['Status'] || '').trim().toLowerCase() === 'shipped');

    if (pendingCountSpan) pendingCountSpan.innerText = pendingOrdersList.length;
    if (shippedCountSpan) shippedCountSpan.innerText = shippedOrdersList.length;

    let targetDisplayDataset = (currentAdminActiveTab === 'pending') ? pendingOrdersList : shippedOrdersList;

    if (adminConsoleSearchQueryString) {
        targetDisplayDataset = targetDisplayDataset.filter(order => {
            const clientName = (order['Client Name'] || '').toLowerCase();
            const phoneNum = (order['Phone'] || '').toLowerCase();
            const paymentId = (order['Payment ID'] || '').toLowerCase();
            const destination = (order['Address'] || '').toLowerCase();
            
            return clientName.includes(adminConsoleSearchQueryString) || 
                   phoneNum.includes(adminConsoleSearchQueryString) || 
                   paymentId.includes(adminConsoleSearchQueryString) ||
                   destination.includes(adminConsoleSearchQueryString);
        });
    }

    if (statusMsg) {
        statusMsg.innerHTML = `Viewing <span style="color:var(--pink-accent); font-weight:700; text-transform:uppercase;">${currentAdminActiveTab}</span> matrix. Total rows matched: <strong>${targetDisplayDataset.length}</strong>`;
    }

    if (targetDisplayDataset.length === 0) {
        ordersContainer.innerHTML = `
            <div style="text-align:center; padding:40px; color:var(--text-muted); font-size:0.9rem; background:#f9f9fb; border-radius:6px; border:1px dashed var(--border-subtle)">
                No orders match your active filter settings.
            </div>`;
        return;
    }

    if (!document.getElementById('adminResponsiveStylesTag')) {
        const styleSheetNode = document.createElement("style");
        styleSheetNode.id = "adminResponsiveStylesTag";
        styleSheetNode.innerHTML = `
            .admin-card-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #f1f1f5; padding-bottom: 14px; gap: 15px; }
            .admin-header-left { flex: 1; text-align: left; }
            .admin-header-right { text-align: right; display: flex; gap: 12px; align-items: center; }
            .admin-shipping-bar { display: flex; flex-direction: column; background: #fafafa; padding: 16px; border-radius: 6px; border: 1px solid #e8e8ef; gap: 15px; }
            .admin-shipping-info-row { display: flex; justify-content: space-between; align-items: center; gap: 15px; width: 100%; }
            .admin-actions-flex-wrapper { display: flex; gap: 8px; align-items: center; flex-wrap: nowrap; }
            .admin-actions-flex-wrapper .btn-admin-action-unit { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 14px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 4px; transition: all 0.2s; white-space: nowrap; font-family: 'Montserrat', sans-serif; cursor: pointer; text-decoration: none; height: 35px; box-sizing: border-box; flex: 1; }
            
            .courier-allocation-panel { background: #ffffff; border: 1px solid #e8e8ef; border-radius: 6px; padding: 16px; display: none; width: 100%; box-sizing: border-box; animation: fadeInForm 0.3s ease; }
            @keyframes fadeInForm { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
            
            @media (max-width: 768px) {
                .admin-card-header { flex-direction: column; gap: 12px; align-items: stretch; }
                .admin-header-right { text-align: left; justify-content: space-between; border-top: 1px solid #f1f1f5; padding-top: 10px; width: 100%; }
                .admin-shipping-info-row { flex-direction: column; align-items: stretch; gap: 12px; }
                .admin-actions-flex-wrapper { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; width: 100%; }
                .admin-actions-flex-wrapper .btn-admin-action-unit { width: 100%; display: flex; justify-content: center; font-size: 0.68rem; padding: 8px 6px; }
            }
        `;
        document.head.appendChild(styleSheetNode);
    }

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
        let logisticsMetadataHTML = ""; // To store tracking tags for shipped items
        
        if (!isShipped) {
            shippedActionButtonHTML = `
                <button class="btn-admin-action-unit" onclick="revealCourierAllocationPanel('${order['Payment ID']}')" style="background: var(--purple-primary); color: #ffffff; border: 1px solid var(--purple-primary);">
                    <i class="fas fa-shipping-fast"></i> Ship
                </button>
            `;
        } else {
            // Render explicit shipping metrics if the item is already archived as Shipped
            const partner = order['Courier'] || 'Standard Logistics';
            const trackingNum = order['Tracking Number'] || 'N/A';
            logisticsMetadataHTML = `
                <div style="margin-top: 5px; font-size: 0.75rem; color: var(--purple-primary); font-weight: 600; background: #f4f4f7; padding: 6px 12px; border-radius: 4px; display: inline-flex; align-items: center; gap: 6px; text-align: center">
                    <i class="fas fa-truck"></i> <span>${partner}: <strong>${trackingNum}</strong></span>
                </div>
            `;
        }
        const itemNamesArray = (order['Order Items'] || '').split(',').map(str => str.trim());
        const itemImagesArray = (order['Order Images'] || '').split(',').map(str => str.trim());

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
                <tr style="border-bottom: 1px solid #f1f1f5;">
                    <td style="padding: 10px 12px; width: 60px; text-align: center; vertical-align: middle;">
                        <div style="width: 44px; height: 44px; border-radius: 4px; border: 1px solid #e8e8ef; overflow: hidden; background: #ffffff; display: block; margin: 0 auto;">
                            <img src="${matchedImgUrl}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/placeholder.png'">
                        </div>
                    </td>
                    <td style="padding: 10px 12px; font-size: 0.88rem; font-weight: 600; color: #111116; text-align: left; vertical-align: middle;">
                        ${parsedTitle}
                    </td>
                    <td style="padding: 10px 12px; font-size: 0.85rem; font-weight: 700; color: var(--purple-primary); text-align: center; vertical-align: middle;">
                        ${parsedQuantity}
                    </td>
                </tr>
            `;
        }).join('');

        const safeName = (order['Client Name'] || '').replace(/'/g, "\\'");
        const safePhone = (order['Phone'] || '').replace(/'/g, "\\'");
        const safeAddress = (order['Address'] || '').replace(/'/g, "\\'").replace(/\n/g, " ");

        return `
        <div style="background: #ffffff; border: 1px solid var(--purple-primary); border-radius: 8px; padding: 16px; box-sizing: border-box; width: 100%; display: flex; flex-direction: column; gap: 15px; box-shadow: 0 4px 15px rgba(32, 44, 85, 0.02); text-align: left;">
            
            <div class="admin-card-header">
                <div class="admin-header-left">
                    <span style="font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 2px; font-family: monospace; font-weight: 600; letter-spacing: 0.5px;">
                        Transaction ID: <strong style="color: var(--purple-primary);">${order['Payment ID']}</strong>
                    </span>
                    <h4 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: var(--purple-primary); font-family: 'Montserrat', sans-serif;">
                        ${order['Client Name']}
                    </h4>
                </div>
                <div class="admin-header-right">
                    <div style="line-height: 1.3;">
                        <span style="font-size: 0.75rem; color: var(--text-muted); display: block; font-weight: 600;">${order['Date']}</span>
                        <span style="font-size: 1.1rem; font-weight: 700; color: var(--purple-primary); display: block;">${order['Total Paid']}</span>
                    </div>
                    <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                        <span id="badge-status-${order['Payment ID']}" style="${badgeStyle} font-size: 0.65rem; padding: 5px 12px; border-radius: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; text-align: center">
                            ${displayStatus}
                        </span>
                        ${logisticsMetadataHTML}
                    </div>
                </div>
            </div>

            <div style="width: 100%; overflow-x: auto; background: #fdfdfd; border: 1px solid #e8e8ef; border-radius: 6px;">
                <table style="width: 100%; border-collapse: collapse; margin: 0; padding: 0;">
                    <thead>
                        <tr style="background: #f4f4f7; border-bottom: 1px solid #e8e8ef; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-muted); font-weight: 700;">
                            <th style="padding: 10px 12px; width: 60px; text-align: center; font-weight: 700;">Preview</th>
                            <th style="padding: 10px 12px; text-align: left; font-weight: 700;">Item Masterpiece</th>
                            <th style="padding: 10px 12px; width: 80px; text-align: center; font-weight: 700;">Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${inventoryRowsHTML}
                    </tbody>
                </table>
            </div>

            <div class="admin-shipping-bar">
                <div class="admin-shipping-info-row">
                    <div style="font-size: 0.8rem; color: #111116; font-weight: 500; line-height: 1.4;">
                        <i class="fas fa-map-marker-alt" style="color: var(--pink-accent, #ff1493); margin-right: 4px;"></i>
                        <span style="color: var(--text-muted); font-weight: 600;">Ship To:</span> ${order['Address']}
                    </div>
                    
                    <div class="admin-actions-flex-wrapper">
                        <button class="btn-admin-action-unit" onclick="copyShippingLabelToClipboard('${safeName}', '${safePhone}', '${safeAddress}', this)" style="background: transparent; color: var(--text-dark-primary); border: 1px solid var(--border-subtle, #e8e8ef);" title="Copy Address Tag">
                            <i class="far fa-copy"></i> Label
                    </button>
                        <a href="tel:${cleanPhone}" class="btn-admin-action-unit" style="background: #ffffff; color: var(--purple-primary); border: 1px solid var(--purple-primary);" title="Call Client">
                            <i class="fas fa-phone-alt"></i> ${cleanPhone}
                        </a>
                        <div id="shipped-action-slot-${order['Payment ID']}" style="display: contents;">${shippedActionButtonHTML}</div>
                        <a href="${whatsappUpdateLink}" target="_blank" class="btn-admin-action-unit" style="background: #ffffff; color: #25d366; border: 1px solid #25d366;" title="WhatsApp Alert">
                            <i class="fab fa-whatsapp"></i> Chat
                        </a>
                    </div>
                </div>

                <div id="courier-panel-${order['Payment ID']}" class="courier-allocation-panel">
                    <p style="margin: 0 0 10px 0; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--purple-primary); letter-spacing: 0.5px;">Assign Logistics Partner & Waybill</p>
                    <div style="display: flex; gap: 15px; margin-bottom: 12px; flex-wrap: wrap; font-size: 0.8rem; font-weight: 600;">
                        <label style="display: inline-flex; align-items: center; gap: 6px; cursor: pointer;">
                            <input type="radio" name="courier-${order['Payment ID']}" value="DTDC" checked style="accent-color: var(--purple-primary);"> DTDC
                        </label>
                        <label style="display: inline-flex; align-items: center; gap: 6px; cursor: pointer;">
                            <input type="radio" name="courier-${order['Payment ID']}" value="Delhivery" style="accent-color: var(--purple-primary);"> Delhivery
                        </label>
                        <label style="display: inline-flex; align-items: center; gap: 6px; cursor: pointer;">
                            <input type="radio" name="courier-${order['Payment ID']}" value="Blue Dart" style="accent-color: var(--purple-primary);"> Blue Dart
                        </label>
                    </div>
                    <div class="tracking-form" style="display: flex; gap: 8px;">
                        <input type="text" id="tracking-input-${order['Payment ID']}" placeholder="Tracking Number" style="flex: 1; padding: 8px 12px; border: 1px solid #e8e8ef; border-radius: 4px; font-size: 0.8rem; font-family: 'Montserrat', sans-serif; outline: none; box-sizing: border-box;">
                        <button onclick="updateGoogleSheetRowStatus('${order['Payment ID']}', this)" style="background: #25d366; color: #ffffff; border: none; padding: 0 16px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 4px; cursor: pointer; height: 34px;">Confirm</button>
                        <button onclick="hideCourierAllocationPanel('${order['Payment ID']}')" style="background: transparent; color: var(--text-muted); border: 1px solid #e8e8ef; padding: 0 12px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; border-radius: 4px; cursor: pointer; height: 34px;">Cancel</button>
                    </div>
                </div>

            </div>

        </div>
        `;
    }).join('');
}

function revealCourierAllocationPanel(paymentId) {
    const panel = document.getElementById(`courier-panel-${paymentId}`);
    if (panel) panel.style.display = 'block';
}

function hideCourierAllocationPanel(paymentId) {
    const panel = document.getElementById(`courier-panel-${paymentId}`);
    if (panel) panel.style.display = 'none';
}

function updateGoogleSheetRowStatus(paymentId, buttonElement) {
    if (!paymentId || !buttonElement) return;

    const trackingInput = document.getElementById(`tracking-input-${paymentId}`);
    const trackingNumber = trackingInput ? trackingInput.value.trim() : "";
    
    if (!trackingNumber) {
        alert("Please provide a valid tracking reference number before generating the dispatch record.");
        if (trackingInput) trackingInput.focus();
        return;
    }

    const assignedCourierOptions = document.getElementsByName(`courier-${paymentId}`);
    let selectedCourierValue = "DTDC";
    for (let i = 0; i < assignedCourierOptions.length; i++) {
        if (assignedCourierOptions[i].checked) {
            selectedCourierValue = assignedCourierOptions[i].value;
            break;
        }
    }

    buttonElement.disabled = true;
    const originalButtonText = buttonElement.innerText;
    buttonElement.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Syncing...`;

    const sheetDbUpdateEndpoint = `https://sheetdb.io/api/v1/0lvmtng1nhhhi/Payment%20ID/${encodeURIComponent(paymentId)}`;

    fetch(sheetDbUpdateEndpoint, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: {
                "Status": "Shipped",
                "Courier": selectedCourierValue,
                "Tracking Number": trackingNumber
            }
        })
    })
    .then(response => response.json())
    .then(payloadResult => {
        if (payloadResult && payloadResult.updated >= 1) {
            console.log(`Sheet ledger successfully synchronized for ID: ${paymentId}`);

            const cachedOrderObjectIndex = adminOrdersCache.findIndex(o => o['Payment ID'] === paymentId);
            if (cachedOrderObjectIndex > -1) {
                adminOrdersCache[cachedOrderObjectIndex]['Status'] = 'Shipped';
                adminOrdersCache[cachedOrderObjectIndex]['Courier'] = selectedCourierValue;
                adminOrdersCache[cachedOrderObjectIndex]['Tracking Number'] = trackingNumber;
            }
            
            setTimeout(renderSegregatedAdminOrders, 400);

            const dynamicToast = document.createElement('div');
            dynamicToast.className = "copied-toast";
            dynamicToast.innerHTML = `<i class="fas fa-check-circle"></i> Ledger & Waybill Synced!`;
            document.body.appendChild(dynamicToast);
            setTimeout(() => { dynamicToast.remove(); }, 2400);

        } else {
            throw new Error("Spreadsheet validation key row mapping verification reject error.");
        }
    })
    .catch(err => {
        console.error("Critical spreadsheet record edit synchronization error dropped:", err);
        buttonElement.disabled = false;
        buttonElement.innerText = originalButtonText;
        alert("Failed to update status on server cloud. Verify network and try again.");
    });
}

// =========================================================================
// ANGEL JEWELLERY — DYNAMIC COMPACT SHOWROOM ROUNDED CIRCLE ACCENTS
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
        
        // Use flex layout here so miniature elements sit beautifully side-by-side
        foldersGrid.style.setProperty("display", "flex", "important");
        foldersGrid.style.setProperty("flex-wrap", "wrap", "important");
        foldersGrid.style.setProperty("justify-content", "center", "important");
        foldersGrid.style.setProperty("gap", "25px", "important");
    }

    const categoryMap = {};
    productDatabase.forEach(product => {
        if (product.category) {
            const cleanKey = product.category.trim();
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

    // ➔ THE 100PX RESHAPE: Re-maps categories into ultra-premium minimalist circle nodes
    foldersGrid.innerHTML = Object.values(categoryMap).map(folder => {
        return `
            <div class="category-compact-node-card" 
                 onclick="selectShowroomCategoryFolder('${folder.name}')"
                 style="display: flex; flex-direction: column; align-items: center; width: 110px; cursor: pointer; transition: transform 0.25s ease; box-sizing: border-box;"
                 onmouseover="this.style.transform='translateY(-3px)'"
                 onmouseout="this.style.transform='translateY(0)'">
                
                <!-- 100px by 100px Premium Circular Frame Asset Overlay -->
                <div style="width: 100px; height: 100px; min-width: 100px; min-height: 100px; border-radius: 50%; overflow: hidden; background: #fafafa; border: 1px solid #e8e8ef; position: relative; box-shadow: 0 4px 12px rgba(32,44,85,0.04);">
                    <img src="${folder.thumbnail}" alt="${folder.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/placeholder.png'">
                    
                    <!-- Subtle Floating Numeric Count Notification Accent -->
                    <div style="position: absolute; bottom: 4px; right: 4px; background: #202c55; color: #ffffff; font-size: 0.58rem; padding: 2px 6px; font-weight: 700; border-radius: 10px; font-family: 'Montserrat';">
                        ${folder.itemCount}
                    </div>
                </div>

                <!-- Text Identifier Node Block -->
                <div style="margin-top: 10px; text-align: center; width: 100%;">
                    <h3 style="margin: 0; font-family: 'Montserrat', sans-serif; font-size: 0.72rem; font-weight: 700; color: #202c55; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${folder.name}
                    </h3>
                </div>

            </div>
        `;
    }).join('');
}

function selectShowroomCategoryFolder(targetCategoryName) {
    currentSelectedFilterCategoryKey = targetCategoryName;

    const foldersGrid = document.getElementById('jewelryCategoryFoldersGrid');
    const productGridCanvas = document.getElementById('productGrid');
    const navHeader = document.getElementById('showroomNavigationHeader');
    const navTitle = document.getElementById('activeShowroomCategoryTitle');
    const mainSectionTitle = document.getElementById('collection-main-title');

    if (foldersGrid) foldersGrid.style.display = "none";
    if (mainSectionTitle) mainSectionTitle.style.display = "none";
    
    if (productGridCanvas) productGridCanvas.style.setProperty("display", "grid", "important");
    if (navHeader) navHeader.style.setProperty("display", "flex", "important");
    
    // ➔ THE FIX: Find the empty parent section block wrapper and force it to display elegantly
    const parentSectionWrapper = productGridCanvas.closest('.products-section');
    if (parentSectionWrapper) parentSectionWrapper.style.setProperty("display", "block", "important");
    
    if (navTitle) {
        navTitle.innerText = `${targetCategoryName} Collection`;
        navTitle.style.setProperty("display", "block", "important");
        navTitle.style.setProperty("text-align", "center", "important");
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
    const navTitle = document.getElementById('activeShowroomCategoryTitle');
    const mainSectionTitle = document.getElementById('collection-main-title');

    if (productGridCanvas) productGridCanvas.style.display = "none";
    if (navHeader) navHeader.style.display = "none";
    if (navTitle) navTitle.style.display = "none";
    
    // ➔ THE FIX: Hide the empty parent section block completely when returning to folder view
    const parentSectionWrapper = productGridCanvas?.closest('.products-section');
    if (parentSectionWrapper) parentSectionWrapper.style.setProperty("display", "none", "important");
    
    if (foldersGrid) foldersGrid.style.setProperty("display", "grid", "important");
    if (mainSectionTitle) mainSectionTitle.style.setProperty("display", "block", "important");

    if (typeof generateDynamicCatalogFilters === "function") {
        generateDynamicCatalogFilters();
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

async function synchronizeLiveStorefrontInventory() {
    const baseSheetDbEndpoint = ANGEL_STORE_CONFIG?.DATABASE?.SHEETDB_API_URL || "https://sheetdb.io/api/v1/0lvmtng1nhhhi";
    
    try {
        const response = await fetch(`${baseSheetDbEndpoint.replace(/\/$/, "")}?sheet=Products`);
        if (!response.ok) throw new Error("Inventory endpoint unreachable");
        
        const inventoryRows = await response.json();
        
        inventoryRows.forEach(row => {
            const cleanId = parseInt(row.id);
            if (!isNaN(cleanId)) {
                MASTER_LIVE_INVENTORY_CACHE[cleanId] = {
                    stock: parseInt(row.stock) || 0,
                    status: String(row.status || '').trim().toLowerCase()
                };
            }
        });
        
        console.log("💎 Live Inventory Vault Synchronized successfully:", MASTER_LIVE_INVENTORY_CACHE);
        
        if (!productDatabase || productDatabase.length === 0) {
            await loadProductDatabaseEngine();
        } else {
            generateDynamicCatalogFilters();
            filterCatalog();
        }
        
        renderTrendingSection();
        renderVaultSaleSection();
        
    } catch (error) {
        console.error("❌ Inventory download sync failed. Store falling back to default availability states:", error);
    }
}

async function executeSheetDbInventoryDeduction(completedOrderItemsArray) {
    let baseSheetDbEndpoint = ANGEL_STORE_CONFIG?.DATABASE?.SHEETDB_API_URL || "https://sheetdb.io/api/v1/0lvmtng1nhhhi";
    baseSheetDbEndpoint = baseSheetDbEndpoint.replace(/\/$/, "");
    if (!completedOrderItemsArray || !completedOrderItemsArray.length) return;
    
    console.log("⚡ Starting background stock deduction sequence for order items...");

    for (const item of completedOrderItemsArray) {
        const itemTargetId = parseInt(item.id);
        if (isNaN(itemTargetId)) continue;
        
        const currentCachedStock = MASTER_LIVE_INVENTORY_CACHE[itemTargetId]?.stock ?? 5;
        const freshCalculatedStockValue = Math.max(0, currentCachedStock - (item.quantity || 1));
        const updatedStatusFlag = freshCalculatedStockValue <= 0 ? "sold" : "available";
        
        try {
            const targetUrl = `${baseSheetDbEndpoint}/id/${itemTargetId}?sheet=Products`;
            await fetch(targetUrl, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: { stock: freshCalculatedStockValue, status: updatedStatusFlag }
                })
            });
            
            if (MASTER_LIVE_INVENTORY_CACHE[itemTargetId]) {
                MASTER_LIVE_INVENTORY_CACHE[itemTargetId].stock = freshCalculatedStockValue;
                MASTER_LIVE_INVENTORY_CACHE[itemTargetId].status = updatedStatusFlag;
            }
            
        } catch (err) {
            console.error(`⚠️ Could not process automated inventory reduction for Item ID: ${itemTargetId}`, err);
        }
    }

    generateDynamicCatalogFilters();
    filterCatalog();
}
document.addEventListener("DOMContentLoaded", () => {
    synchronizeLiveStorefrontInventory();
});