
// =========================================================================
// 💎 ANGEL JEWELLERY — GLOBAL MULTI-GRID METADATA DECK LAYOUT OVERRIDES
// =========================================================================
if (typeof document !== 'undefined' && !document.getElementById('angelJewelryGlobalMobileCardOverrides')) {
    const mobileOverridesStyleNode = document.createElement("style");
    mobileOverridesStyleNode.id = "angelJewelryGlobalMobileCardOverrides";
    mobileOverridesStyleNode.innerHTML = `
        /* Main structural setups for card spacing */
        .product-card {
            position: relative !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            height: 100% !important;
        }

        /* Lock the image boxes below the top header deck with 100% clarity */
        .product-image-container, 
        .product-img-wrapper {
            position: relative !important;
            width: 100% !important;
            aspect-ratio: 1 / 1 !important;
            overflow: hidden !important;
            border-radius: 6px !important;
            margin-bottom: 12px !important;
            z-index: 1 !important;
        }

        .product-image-container img, 
        .product-img-wrapper img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
            display: block !important;
        }

        /* ➔ TARGET RESPONSIVE PATTERN: FIXES SQUEEZED GRIDS REVEALED IN image_dd0ac4.png */
        @media (max-width: 768px) {
            /* Force the main catalog grid to split into 2 even columns instead of shrinking */
            #productGrid {
                display: grid !important;
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 12px !important;
                width: 100% !important;
                padding: 0 4px !important;
                box-sizing: border-box !important;
            }

            .product-card {
                padding: 10px !important;
            }

            /* Prevent long titles from breaking card symmetry on small screens */
            .product-card h3 {
                font-size: 0.8rem !important;
                min-height: 32px !important;
                margin: 4px 0 !important;
            }

            .product-card p {
                font-size: 0.85rem !important;
                margin-bottom: 8px !important;
            }

            /* Adjust mobile button sizing to fit the 2-column layout */
            .product-card .btn-order-wa {
                padding: 8px 0 !important;
                font-size: 0.65rem !important;
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
let adminOrdersCache = [];       
let currentAdminActiveTab = "pending";
let activeDiscount = { code: "", type: "", value: 0 };
let adminConsoleSearchQueryString = "";
let currentSelectedFilterCategoryKey = "all"; 
let MASTER_LIVE_INVENTORY_CACHE = {};

const FREE_SHIPPING_THRESHOLD = 1000; 

let INTEGRATED_ADMIN_AUTH_STATE = false;

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
        
        // Query ordered by ID so your collection stays neatly sequenced
        const cleanFetchTargetUrl = `${sbUrl}/rest/v1/Products?select=*&order=id.asc`;

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

        // Map fields explicitly from your database columns
        productDatabase = databasePayload.map(item => {
            const parsedUniqueId = parseInt(item.id);
            const verifiedPrice = parseFloat(item.price) || 0;
            const liveStockLevel = parseInt(item.stock) ?? 0;
            const updatedStatus = liveStockLevel <= 0 ? "sold" : String(item.status || 'available').trim().toLowerCase();

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
                description: item.description || '',
                style: item.style ? String(item.style).trim().toLowerCase() : ''
            };
        });

        console.log(`✨ Success! Loaded ${productDatabase.length} items from Supabase.`);

        if (typeof generateDynamicCatalogFilters === 'function') {
            generateDynamicCatalogFilters();
        }

    } catch (error) {
        console.error('Critical Supabase catalog extraction breakdown caught:', error);
    }
}

// =========================================================================
// ANGEL JEWELLERY — UNIFIED ADMISTRATIVE CLEARANCE ENGINE (LOCK AUTO-HIDE)
// =========================================================================
function challengeAdminIdentityGateway(event) {
    if (event) event.preventDefault();
    
    const masterAdminPasskey = ANGEL_STORE_CONFIG.SECURITY.MASTER_ADMIN_PASSKEY;
    const accessAttempt = prompt("🔒 Administrative Clearance Verification Required.\nPlease enter your Master Access Key:");
    
    if (accessAttempt === null) return;
    
    if (accessAttempt.trim() === masterAdminPasskey) {
        INTEGRATED_ADMIN_AUTH_STATE = true;
        
        // Inject inline styles to reveal the hidden inline card edit badges
        let styleNode = document.getElementById('angelJewelryAdminUIControlsStyleTag');
        if (!styleNode) {
            styleNode = document.createElement("style");
            styleNode.id = 'angelJewelryAdminUIControlsStyleTag';
            document.head.appendChild(styleNode);
        }
        styleNode.innerHTML = `
            .admin-action-inline-trigger { display: inline-flex !important; }
        `;
        
        // Grab the elements from your footer cluster group
        const lockBtnAnchor = event.currentTarget || document.querySelector('[aria-label="Authenticate Master Identity Link"]');
        const wrenchBtn = document.getElementById("footerAdminWrenchDeskBtn");
        const addNewBtn = document.getElementById("footerAdminAddNewPieceFormBtn");
        
        // ➔ THE TRANSITION FIX: Hide the lock icon entirely and fade the master tools into view!
        if (lockBtnAnchor) lockBtnAnchor.style.setProperty("display", "none", "important");
        if (wrenchBtn) wrenchBtn.style.setProperty("display", "flex", "important");
        if (addNewBtn) addNewBtn.style.setProperty("display", "flex", "important");

        // Inside your master passcode validation function, right where authentication succeeds:
        INTEGRATED_ADMIN_AUTH_STATE = true;

        // ➔ THE LOCK SYSTEM REVEAL SECURITY TRIGGER:
        const promoLinkNode = document.getElementById('adminPromoMasterFooterLink');
        if (promoLinkNode) {
            promoLinkNode.style.display = 'flex'; // Reveals link perfectly next to your unlock buttons
        }
        
        // Refresh catalog view grids to render "Edit" inline buttons on product cards
       if (typeof filterCatalog === "function") {
            filterCatalog(); 
        }
        if (typeof renderFlashVaultShowroom === "function") {
            renderFlashVaultShowroom();
        }
        if (typeof renderVaultSaleSection === "function") {
            renderVaultSaleSection();
        }
        if (typeof renderTrendingSection === "function") {
            renderTrendingSection();
        }
    } else {
        alert("❌ Identity Handshake Blocked: Invalid Passcode.");
    }
}

// =========================================================================
// ANGEL JEWELLERY — DYNAMIC INLINE CRUD WRITE OPERATIONS METHODS
// =========================================================================
function openAdminFormModalForCreation(event) {
    if (event) event.preventDefault(); // Blocks link hashes from jumping page levels
    document.getElementById('masterJewelryAdminForm').reset();
    document.getElementById('formActionProductId').value = "";
    document.getElementById('formProductId').disabled = false;
    document.getElementById('adminFormModalTitle').innerHTML = `<i class="fas fa-plus-circle" style="color:#ff1493;"></i> Add New Item`;
    document.getElementById('formSubmitActionBtn').innerText = "Add New Item";
    document.getElementById('adminPieceVaultModal').style.display = 'flex';
}

function openAdminFormModalForEditing(event, id) {
    if (event) event.stopPropagation(); // Block card QuickView trigger clicks from bubbling
    
    const product = productDatabase.find(p => p.id === parseInt(id));
    if (!product) return;

    const stockInfo = MASTER_LIVE_INVENTORY_CACHE[id] || { stock: 5, status: 'available' };

    document.getElementById('formActionProductId').value = product.id;
    document.getElementById('formProductId').value = product.id;
    document.getElementById('formProductId').disabled = true; // Lock identity column fields
    document.getElementById('formProductTitle').value = product.title;
    document.getElementById('formProductCategory').value = product.category;
    document.getElementById('formProductPrice').value = product.price;
    const liveCacheData = MASTER_LIVE_INVENTORY_CACHE[product.id];
    const trueCurrentStock = liveCacheData ? liveCacheData.stock : product.stock;
    document.getElementById('formProductStock').value = trueCurrentStock;
    document.getElementById('formProductBadge').value = product.badge === "Sold Out" ? "" : product.badge;
    document.getElementById('formProductStyle').value = product.style ? String(product.style).trim().toLowerCase() : "";
    document.getElementById('formProductImage').value = product.image;
    document.getElementById('formProductDesc').value = product.description;

    document.getElementById('adminFormModalTitle').innerHTML = `<i class="fas fa-edit" style="color:#ffd700;"></i> Edit Product #${product.id}`;
    document.getElementById('formSubmitActionBtn').innerText = "Update";
    document.getElementById('adminPieceVaultModal').style.display = 'flex';
}

function closeAdminFormVaultModal() {
    document.getElementById('adminPieceVaultModal').style.display = 'none';
}

// 2. WRITE & UPDATE CHANNEL: Save or Edit inline catalog rows seamlessly
document.addEventListener("DOMContentLoaded", () => {
    const adminFormNode = document.getElementById('masterJewelryAdminForm');
    if (adminFormNode) {
        adminFormNode.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('formSubmitActionBtn');
            const originalButtonText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Adding to Database...`;

            const editingTargetRowId = document.getElementById('formActionProductId').value;
            const isEditOperationMode = editingTargetRowId !== "";
            
            const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
            const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;

            const formStockVal = parseInt(document.getElementById('formProductStock').value) || 0;
            const computedStatusFlag = formStockVal <= 0 ? "sold" : "available";

            // Structured object mapping to match your Supabase columns exactly
            const itemPayloadObject = {
                id: parseInt(document.getElementById('formProductId').value),
                title: document.getElementById('formProductTitle').value.trim(),
                category: document.getElementById('formProductCategory').value,
                price: parseFloat(document.getElementById('formProductPrice').value) || 0,
                stock: formStockVal,
                badge: formStockVal <= 0 ? "Sold Out" : document.getElementById('formProductBadge').value.trim(),
                status: computedStatusFlag,
                image: document.getElementById('formProductImage').value.trim(),
                description: document.getElementById('formProductDesc').value.trim(),
                style: document.getElementById('formProductStyle').value
            };

            try {
                let requestUrl = `${sbUrl}/rest/v1/Products`;
                let customHeaders = {
                    'apikey': sbKey,
                    'Authorization': `Bearer ${sbKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                };

                let fetchOptions = {};

                if (isEditOperationMode) {
                    // Update exact record by filtering for the row ID
                    requestUrl += `?id=eq.${editingTargetRowId}`;
                    fetchOptions = {
                        method: 'PATCH',
                        headers: customHeaders,
                        body: JSON.stringify(itemPayloadObject)
                    };
                } else {
                    // Insert brand new product row
                    fetchOptions = {
                        method: 'POST',
                        headers: customHeaders,
                        body: JSON.stringify(itemPayloadObject)
                    };
                }

                const response = await fetch(requestUrl, fetchOptions);
                if (!response.ok) throw new Error("Supabase cloud workspace rejected writing parameters.");
                closeAdminFormVaultModal();
                await loadProductDatabaseEngine();
                if (typeof filterCatalog === "function") filterCatalog(); 
                if (typeof renderFlashVaultShowroom === "function") renderFlashVaultShowroom();
                if (typeof renderVaultSaleSection === "function") renderVaultSaleSection();
                if (typeof renderTrendingSection === "function") renderTrendingSection();

            } catch (error) {
                console.error("Supabase write pipeline execution breakdown caught:", error);
                alert("Database Update Interrupted: Double-check your column naming configurations or column data types.");
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
            // A. Safely resolve your active category folder tracking key name
            const activeTabTracker = (typeof currentActiveTab !== 'undefined') 
                ? currentActiveTab 
                : (typeof currentSelectedFilterCategoryKey !== 'undefined' ? currentSelectedFilterCategoryKey : 'all');

            // B. Compile all individual product card layouts cleanly
            const compiledProductCardsHTML = filteredResults.map(product => {
                const isSoldOut = product.badge && product.badge.toLowerCase() === 'sold out';
                const isFavorited = (typeof wishlistMemory !== 'undefined') ? wishlistMemory.includes(product.id) : false;
                
                const badgeHTML = product.badge 
                    ? `<span class="product-badge" style="position: absolute; top: 15px; left: 15px; font-size: 0.65rem; padding: 4px 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 2px; z-index: 2; ${getBadgeCustomStyles(product.badge)}">${product.badge}</span>`
                    : '';
                    
                const rawPriceValue = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
                const displayPrice = rawPriceValue > 0 ? `₹${rawPriceValue.toLocaleString('en-IN')}` : 'Price on Request';
                const safeTitleString = (product.title || '').replace(/'/g, "\\'");
                const displayCategory = product.category || product.type || 'Luxury Collection';

                const adminEditInlineControlMarkup = INTEGRATED_ADMIN_AUTH_STATE ? `
                    <button type="button" class="admin-action-inline-trigger" 
                            onclick="openAdminFormModalForEditing(event, ${product.id})" 
                            style="position: absolute; top: 0px; left: 0px; z-index: 10 !important; display: inline-flex !important; align-items: center; justify-content: center; gap: 4px; padding: 6px 14px; background: #ffffff; color: #202c55; border: 2px solid #202c55; border-radius: 6px; font-size: 0.68rem; font-weight: 700; font-family: 'Montserrat'; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 6px 20px rgba(0,0,0,0.15); cursor: pointer; transition: all 0.2s; outline:none;">
                        <i class="fas fa-edit" style="font-size:0.65rem; color:#cca43b;"></i> #${product.id}
                    </button>
                    <button type="button" class="admin-action-inline-trigger" 
                        onclick="executeAdminItemDeletionPipeline(event, ${product.id}, '${safeTitleString}')" 
                        style="position: absolute; top: 0px; right: 0px; z-index: 10 !important; display: inline-flex !important; align-items: center; justify-content: center; width: 32px; height: 32px;  padding: 6px 14px; background: #ffffff; color: #d9383a; border: 2px solid #d9383a; border-radius: 6px; font-size: 0.75rem; box-shadow: 0 4px 12px rgba(217,56,58,0.15); cursor: pointer; transition: all 0.2s; outline:none;"
                        onmouseover="this.style.background='#d9383a'; this.style.color='#ffffff';"
                        onmouseout="this.style.background='#ffffff'; this.style.color='#d9383a';">
                    <i class="fas fa-trash-alt"></i>
                </button>
                ` : '';

                return `
                    <div class="product-card" 
                         onclick="openQuickViewShield(${product.id})" 
                         style="background: #ffffff; border: 1px solid var(--purple-primary, #e8e8ef); border-radius: 8px; padding: 16px; position: relative; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.02); cursor: pointer;">
                        
                        ${adminEditInlineControlMarkup}

                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; width: 100%; min-height: 32px; box-sizing: border-box;">
                            <div style="flex-grow: 1; text-align: left;">
                                ${product.badge ? `<span class="product-badge" style="font-size: 0.62rem; padding: 4px 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 3px; display: inline-block; ${getBadgeCustomStyles(product.badge)}">${product.badge}</span>` : ''}
                            </div>
                            <button class="wishlist-heart-btn ${isFavorited ? 'active' : ''}" 
                                    onclick="event.stopPropagation(); toggleWishlistEngine(event, ${product.id}, this)" 
                                    aria-label="Add to wishlist"
                                    style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: #fafafa; border: 1px solid #e8e8ef; border-radius: 50%; box-shadow: 0 2px 6px rgba(32,44,85,0.03); cursor: pointer; outline: none; margin: 0; padding: 0;">
                                <i class="${isFavorited ? 'fas' : 'far'} fa-heart" style="font-size: 0.85rem; color: ${isFavorited ? 'var(--pink-accent, #ff1493)' : '#202c55'}; transition: color 0.2s ease;"></i>
                            </button>
                        </div>

                        <div class="product-image-container" style="position: relative; width: 100%; aspect-ratio: 1/1; overflow: hidden; background: #fafafa; border-radius: 6px; margin-bottom: 14px; z-index:1;">
                            <img src="${product.image || 'assets/placeholder.png'}" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.src='assets/placeholder.png'">
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
                                    style="width: 100%; padding: 11px 0; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; cursor: ${isSoldOut ? 'not-allowed' : 'pointer'}; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; gap: 6px; margin-top: 5px; font-family: 'Montserrat', sans-serif; transition: all 0.3s ease; background: ${isSoldOut ? '#f4f4f7 !important' : 'var(--purple-primary, #202c55)'}; color: ${isSoldOut ? '#8a8da0 !important' : '#ffffff !important'}; border: ${isSoldOut ? '1px solid #e2e4ed !important' : 'none !important'}; box-shadow: ${isSoldOut ? 'none !important' : ''};">
                                <i class="${isSoldOut ? 'fas fa-hourglass-start' : 'fas fa-shopping-cart'}" style="font-size: 0.7rem;"></i> 
                                ${isSoldOut ? 'Restocking Soon!' : 'Add to Cart'}
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            
            // C. ➔ THE IN-BOX TITLE CONDITION SEQUENCE (FIXED FOR GRID ALIGNMENT)
            if (activeTabTracker !== 'all' && activeTabTracker !== '') {
                productGrid.classList.add('filtered-collection-frame');
                productGrid.innerHTML = `
                    <!-- THE FIX: grid-column: 1 / -1 ensures the title spans the whole top row smoothly -->
                    <div class="in-box-collection-header" style="grid-column: 1 / -1; text-align: left; padding: 10px 15px; border-bottom: 1px solid #cca43b; margin-bottom: 15px; width: 100%; box-sizing: border-box;">
                        <span style="color: #cca43b; font-size: 0.62rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; display: block; margin-bottom: 4px;">Now Presenting</span>
                        <h2 style="color: #202c55; font-size: 1.35rem; font-weight: 600; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Montserrat';">${activeTabTracker}</h2>
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
        saleCard.className = `product-card ${isSoldOut ? 'disabled-card' : ''}`;
        saleCard.style.cssText = "cursor: pointer; position: relative;";
        saleCard.setAttribute('onclick', `openQuickViewShield(${product.id})`);
        
        // Admin controls markup safely generated matching your authentication state variables
        const adminEditInlineControlMarkup = INTEGRATED_ADMIN_AUTH_STATE ? `
            <button type="button" onclick="openAdminFormModalForEditing(event, ${product.id})" style="position: absolute; top: 0px; left: 0px; z-index: 10 !important; display: inline-flex !important; align-items: center; justify-content: center; gap: 4px; padding: 6px 14px; background: #ffffff; color: #202c55; border: 2px solid #202c55; border-radius: 6px; font-size: 0.68rem; font-weight: 700; font-family: 'Montserrat'; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 6px 20px rgba(0,0,0,0.15); cursor: pointer; transition: all 0.2s; outline:none;">
                <i class="fas fa-edit" style="font-size:0.65rem; color:#cca43b;"></i> #${product.id}
            </button>
            <button type="button" onclick="executeAdminItemDeletionPipeline(event, ${product.id}, '${product.title.replace(/'/g, "\\'")}')" style="position: absolute; top: 0px; right: 0px; z-index: 10 !important; display: inline-flex !important; align-items: center; justify-content: center; width: 32px; height: 32px; padding: 6px 14px; background: #ffffff; color: #d9383a; border: 2px solid #d9383a; border-radius: 6px; font-size: 0.75rem; box-shadow: 0 4px 12px rgba(217,56,58,0.15); cursor: pointer; transition: all 0.2s; outline:none;" onmouseover="this.style.background='#d9383a'; this.style.color='#ffffff';" onmouseout="this.style.background='#ffffff'; this.style.color='#d9383a';">
                <i class="fas fa-trash-alt"></i>
            </button>
        ` : '';

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
            ${adminEditInlineControlMarkup}
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; width: 100%; min-height: 32px; box-sizing: border-box; padding: 0 2px;">
                <div style="flex-grow: 1; text-align: left;">
                    ${product.badge ? `<span class="product-badge" style="font-size: 0.62rem; padding: 4px 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 3px; display: inline-block; ${getBadgeCustomStyles(product.badge)}">${product.badge}</span>` : ''}
                </div>
                <button class="wishlist-heart-btn ${isFavorited ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleWishlistEngine(event, ${product.id}, this)" 
                        aria-label="Add to wishlist" 
                        style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: #fafafa; border: 1px solid #e8e8ef; border-radius: 50%; box-shadow: 0 2px 6px rgba(32,44,85,0.03); cursor: pointer; outline: none; margin: 0; padding: 0;">
                    <i class="${isFavorited ? 'fas' : 'far'} fa-heart" style="font-size: 0.85rem; color: ${isFavorited ? 'var(--pink-accent, #ff1493)' : '#202c55'};"></i>
                </button>
            </div>

            <div class="product-img-wrapper" style="background: #ffffff; position: relative; width: 100%; aspect-ratio: 1/1; overflow: hidden; border-radius: 6px;">
                <img src="${product.image}" loading="lazy" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;" onload="this.classList.add('loaded')">
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
        trendingCard.className = `product-card ${isSoldOut ? 'disabled-card' : ''}`;
        trendingCard.style.cssText = "cursor: pointer; position: relative;";
        trendingCard.setAttribute('onclick', `openQuickViewShield(${product.id})`);
        
        // Admin controls markup safely generated matching your authentication state variables
        const adminEditInlineControlMarkup = INTEGRATED_ADMIN_AUTH_STATE ? `
            <button type="button" onclick="openAdminFormModalForEditing(event, ${product.id})" style="position: absolute; top: 0px; left: 0px; z-index: 10 !important; display: inline-flex !important; align-items: center; justify-content: center; gap: 4px; padding: 6px 14px; background: #ffffff; color: #202c55; border: 2px solid #202c55; border-radius: 6px; font-size: 0.68rem; font-weight: 700; font-family: 'Montserrat'; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 6px 20px rgba(0,0,0,0.15); cursor: pointer; transition: all 0.2s; outline:none;">
                <i class="fas fa-edit" style="font-size:0.65rem; color:#cca43b;"></i> #${product.id}
            </button>
            <button type="button" onclick="executeAdminItemDeletionPipeline(event, ${product.id}, '${product.title.replace(/'/g, "\\'")}')" style="position: absolute; top: 0px; right: 0px; z-index: 10 !important; display: inline-flex !important; align-items: center; justify-content: center; width: 32px; height: 32px; padding: 6px 14px; background: #ffffff; color: #d9383a; border: 2px solid #d9383a; border-radius: 6px; font-size: 0.75rem; box-shadow: 0 4px 12px rgba(217,56,58,0.15); cursor: pointer; transition: all 0.2s; outline:none;" onmouseover="this.style.background='#d9383a'; this.style.color='#ffffff';" onmouseout="this.style.background='#ffffff'; this.style.color='#d9383a';">
                <i class="fas fa-trash-alt"></i>
            </button>
        ` : '';

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
            ${adminEditInlineControlMarkup}

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; width: 100%; min-height: 32px; box-sizing: border-box; padding: 0 2px;">
                <div style="flex-grow: 1; text-align: left;">
                    ${product.badge ? `<span class="product-badge" style="font-size: 0.62rem; padding: 4px 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 3px; display: inline-block; ${getBadgeCustomStyles(product.badge)}">${product.badge}</span>` : ''}
                </div>
                <button class="wishlist-heart-btn ${isFavorited ? 'active' : ''}" 
                        onclick="event.stopPropagation(); toggleWishlistEngine(event, ${product.id}, this)" 
                        aria-label="Add to wishlist" 
                        style="display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; background: #fafafa; border: 1px solid #e8e8ef; border-radius: 50%; box-shadow: 0 2px 6px rgba(32,44,85,0.03); cursor: pointer; outline: none; margin: 0; padding: 0;">
                    <i class="${isFavorited ? 'fas' : 'far'} fa-heart" style="font-size: 0.85rem; color: ${isFavorited ? 'var(--pink-accent, #ff1493)' : '#202c55'};"></i>
                </button>
            </div>

            <div class="product-img-wrapper" style="background: #ffffff; position: relative; width: 100%; aspect-ratio: 1/1; overflow: hidden; border-radius: 6px;">
                <img src="${product.image}" loading="lazy" alt="${product.title}" style="width: 100%; height: 100%; object-fit: cover;" onload="this.classList.add('loaded')">
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

// =========================================================================
// ANGEL JEWELLERY — SHOPPING BAG ENGINE WITH VISUAL INLINE HIGHLIGHTS
// =========================================================================
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

        // Cross-reference live database limits
        const liveCache = MASTER_LIVE_INVENTORY_CACHE[item.id];
        let trueAvailableStock = liveCache ? (parseInt(liveCache.stock) || 0) : 5;
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
            <img src="${item.image}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; border: 1px solid #e8e8ef;">
            <div style="flex-grow:1; text-align: left;">
                <h4 class="cart-item-title" style="margin: 0; font-size: 0.85rem; font-weight: 600; color: #111116; font-family: 'Montserrat';">${item.title}</h4>
                <p class="cart-item-meta" style="margin: 2px 0; font-size: 0.72rem; color: #777; font-family: 'Montserrat';">${item.category}</p>
                <p class="cart-item-price" style="margin: 2px 0 6px 0; font-size: 0.85rem; font-weight: 700; color: #202c55; font-family: 'Montserrat';">${formatCurrency(item.price)}</p>
                <div class="cart-item-controls" style="display: flex; align-items: center; gap: 12px; margin-top: 5px;">
                    <i class="fas fa-minus" onclick="changeQty(${item.id}, -1)" style="cursor: pointer; font-size: 0.75rem; color: #777; padding: 4px;"></i>
                    <span style="font-size: 0.85rem; font-weight: 700; min-width: 15px; text-align: center; font-family: 'Montserrat'; color: ${isThisItemOversold ? '#d9383a' : '#111116'}">${item.quantity}</span>
                    <i class="fas fa-plus" onclick="changeQty(${item.id}, 1)" style="cursor: pointer; font-size: 0.75rem; color: #777; padding: 4px;"></i>
                </div>
                ${stockWarningLayout}
            </div>
            <i class="fas fa-trash" onclick="removeFromCart(${item.id})" style="cursor: pointer; color: #aaa; font-size: 0.9rem; padding: 5px; transition: color 0.2s;" onmouseover="this.style.color='#d9383a'" onmouseout="this.style.color='#aaa'"></i>
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

    wishlistMemory.forEach(id => {
        const item = productDatabase.find(p => p.id === id);
        if (!item) return;

        const isSoldOut = item.badge && item.badge.toLowerCase() === 'sold out';

        // Cross-reference live inventory limits using the corrected item key parameter
        const liveCache = MASTER_LIVE_INVENTORY_CACHE[item.id] || { stock: 5, status: 'available' };
        let checkoutButtonMarkup = "";
        
        if (liveCache.stock <= 0 || liveCache.status === "sold") {
            checkoutButtonMarkup = `
                <button type="button" disabled style="background: #e1e1e6 !important; color: #8e8e9f !important; border: 1px solid #dcdce0 !important; cursor: not-allowed; width: 100%; height: 38px; font-size: 0.7rem; font-weight: 600; font-family: 'Montserrat'; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 4px;">
                    <i class="fas fa-lock" style="font-size:0.65rem; margin-right:4px;"></i> Vault Restocking
                </button>
            `;
        } else {
            checkoutButtonMarkup = `
                <button type="button" onclick="addToCartEngine(${item.id})" style="background: #202c55; color: #ffffff; border: none; border-radius: 4px; width: 100%; height: 38px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; cursor: pointer; font-family: 'Montserrat'; transition: background 0.2s;">
                    ADD TO CART
                </button>
            `;
        }

        const row = document.createElement('div');
        row.className = "cart-item-row";
        row.style.cssText = "display: flex; gap: 15px; padding: 15px; border-bottom: 1px solid #e8e8ef; position: relative; box-sizing: border-box; align-items: center;";
        row.innerHTML = `
            <img src="${item.image}" alt="${item.title}" style="width: 55px; height: 55px; object-fit: cover; border-radius: 4px; border: 1px solid #e8e8ef; opacity: ${isSoldOut ? '0.5' : '1'};">
            <div style="flex-grow:1; text-align: left; padding-right: 25px; box-sizing: border-box;">
                <h4 class="cart-item-title" style="margin: 0; font-size: 0.82rem; font-weight: 600; color: #111116; font-family: 'Montserrat';">${item.title}</h4>
                <p class="cart-item-price" style="margin: 2px 0 8px 0; font-size: 0.82rem; font-weight: 700; color: #202c55; font-family: 'Montserrat';">${formatCurrency(item.price)}</p>
                <div style="width: 100%; max-width: 140px;">
                    ${checkoutButtonMarkup}
                </div>
            </div>
            <i class="fas fa-trash" onclick="toggleWishlistEngine(null, ${item.id}, null)" style="cursor:pointer; color:#aaa; font-size:0.9rem; position:absolute; right:15px; top:50%; transform:translateY(-50%); transition: color 0.2s;" onmouseover="this.style.color='#d9383a'" onmouseout="this.style.color='#aaa'"></i>
        `;
        wishlistItemsList.appendChild(row);
    });
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
function renderAdminPromoConsoleGrid() {
    const container = document.getElementById('adminPromoCodeTableContainer');
    if (!container) return;

    if (couponRegistryCache.length === 0) {
        container.innerHTML = `<p style="text-align:center; font-size:0.8rem; color:#aaa; margin:20px 0;">No coupon parameters minted yet.</p>`;
        return;
    }

    container.innerHTML = `
        <table style="width:100%; border-collapse:collapse; font-size:0.82rem; text-align:left;">
            <thead>
                <tr style="background:#f4f4f7; color:var(--text-muted); font-weight:700; border-bottom:1px solid #e8e8ef;">
                    <th style="padding:10px;">Code</th>
                    <th style="padding:10px;">Type</th>
                    <th style="padding:10px;">Discount Value</th>
                    <th style="padding:10px; text-align:center;">Action</th>
                </tr>
            </thead>
            <tbody>
                ${couponRegistryCache.map(promo => `
                    <tr style="border-bottom:1px solid #f1f1f5;">
                        <td style="padding:10px; font-weight:700; color:var(--purple-primary); monospace;">${promo.code}</td>
                        <td style="padding:10px; text-transform:uppercase; font-size:0.75rem;">${promo.type}</td>
                        <td style="padding:10px; font-weight:600;">${promo.type === 'percentage' ? `${promo.value}%` : `₹${promo.value}`}</td>
                        <td style="padding:10px; text-align:center;">
                            <button onclick="executeAdminCouponPurgePipeline(event, ${promo.id}, '${promo.code}')" style="background:transparent; border:none; color:#ff4444; cursor:pointer; font-size:0.9rem;" title="Delete Coupon">
                                <i class="far fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// 4. WRITE CHANNEL: Add brand new promo codes to Supabase
async function handleAdminPromoFormSubmit(event) {
    event.preventDefault();
    const submitBtn = document.getElementById('promoFormSubmitBtn');
    if (!submitBtn) return;

    const originalText = submitBtn.innerText;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Minting...`;

    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;

    const newPromoPayload = {
        code: document.getElementById('newPromoCodeInput').value.toUpperCase().trim(),
        type: document.getElementById('newPromoTypeSelect').value,
        value: parseFloat(document.getElementById('newPromoValueInput').value) || 0
    };

    if (!newPromoPayload.code || newPromoPayload.value <= 0) {
        alert("Please provide valid properties before executing synchronization.");
        submitBtn.disabled = false; submitBtn.innerText = originalText;
        return;
    }

    try {
        const response = await fetch(`${sbUrl}/rest/v1/Coupons`, {
            method: 'POST',
            headers: {
                'apikey': sbKey, 'Authorization': `Bearer ${sbKey}`,
                'Content-Type': 'application/json', 'Prefer': 'return=minimal'
            },
            body: JSON.stringify(newPromoPayload)
        });

        if (!response.ok) throw new Error("Supabase duplicate entry or structure mismatch constraint broken.");

        alert(`✨ Successfully Generated Coupon Code: ${newPromoPayload.code}`);
        document.getElementById('adminPromoCreatorForm').reset();
        
        await loadLiveCouponDatabaseEngine(); // Re-fetch from DB
        renderAdminPromoConsoleGrid();        // Re-draw panel grid UI
        
    } catch (err) {
        console.error(err);
        alert("Pipeline Sync Interrupted: Verify code name uniqueness or structural field formats.");
    } finally {
        submitBtn.disabled = false; submitBtn.innerText = originalText;
    }
}

// 5. DELETE CHANNEL: Wiping codes instantly via trash icons
async function executeAdminCouponPurgePipeline(event, couponId, couponCode) {
    if (event) event.stopPropagation();
    const verify = confirm(`Are you completely sure you want to permanently delete promotional key "${couponCode}"?`);
    if (!verify) return;

    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;

    try {
        const response = await fetch(`${sbUrl}/rest/v1/Coupons?id=eq.${couponId}`, {
            method: 'DELETE',
            headers: { 'apikey': sbKey, 'Authorization': `Bearer ${sbKey}`, 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error("Deletion execution tracking drop.");

        await loadLiveCouponDatabaseEngine();
        renderAdminPromoConsoleGrid();
        
    } catch (err) {
        console.error(err);
        alert("Unable to delete entry row from cloud workspace layer.");
    }
}

// 6. UI INTERACTION ROUTINES
function openAdminPromoConsoleOverlay(event) {
    if (event) event.preventDefault();
    if (!INTEGRATED_ADMIN_AUTH_STATE) {
        alert("🔒 Access Denied. Please unlock the master system using the Lock icon first.");
        return;
    }
    const overlay = document.getElementById('adminPromoConsoleOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        renderAdminPromoConsoleGrid();
    }
}

function closeAdminPromoConsoleOverlay() {
    const overlay = document.getElementById('adminPromoConsoleOverlay');
    if (overlay) overlay.style.display = 'none';
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
        <div style="display: flex; align-items: center; justify-content: center; padding: 15px 0; gap: 10px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 1.2rem; color: var(--pink-accent);"></i>
            <span style="font-size: 0.88rem; font-weight: 600; color: var(--purple-primary);">
                Retrieving your order portfolio from secure nodes...
            </span>
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
            statusMsg.innerHTML = `
                <div style="text-align:center; padding:20px; color:var(--text-muted); font-size:0.9rem;">
                    ⚠️ No verified records discovered matching that phone number index.
                </div>`;
            return;
        }

        statusMsg.innerHTML = `
            <div style="font-family: 'Montserrat', sans-serif; text-align: left;">
                <p style="margin: 0 0 6px 0; font-size: 0.9rem; color: var(--text-dark-primary); font-weight: 600;">Found <strong>${customerOrders.length}</strong> Orders:</p>
                <div style="font-size: 0.75rem; color: #77778b; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; background: #fafafa; border: 1px solid #e8e8ef; padding: 6px 12px; border-radius: 4px; width: 100%; box-sizing: border-box; margin-bottom: 15px;">
                    <i class="far fa-clock" style="font-size: 0.85rem; color: var(--purple-primary);"></i> 
                    <span>Cancellation Policy Note: Orders can be cancelled within 24 hours of placement.</span>
                </div>
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
            if (isShipped) badgeStyle = "background: rgba(255, 20, 147, 0.1); color: var(--pink-accent);";
            if (isCancelled) badgeStyle = "background: rgba(217, 56, 58, 0.1); color: #d9383a;";

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
                    <div style="margin-top: 5px; width: 100%;">
                        <button onclick="toggleCancellationFormView('${order.id}')" id="cancelTriggerBtn_${order.id}" style="background: #ffffff; color: #d9383a; border: 1px solid #d9383a; padding: 8px 14px; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; border-radius: 4px; cursor: pointer; font-family: 'Montserrat'; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s;" onmouseover="this.style.background='#d9383a'; this.style.color='#ffffff';" onmouseout="this.style.background='#ffffff'; this.style.color='#d9383a';">
                            <i class="fas fa-times-circle"></i> Cancel Order
                        </button>

                        <div id="cancelFormBlock_${order.id}" style="display: none; margin-top: 12px; background: #fff5f5; border: 1px solid #d9383a; border-radius: 6px; padding: 15px; box-sizing: border-box;">
                            <h5 style="margin: 0 0 10px 0; font-size: 0.72rem; font-weight: 700; color: #d9383a; text-transform: uppercase; letter-spacing: 0.5px;">Cancellation Specifications</h5>
                            
                            <div style="margin-bottom: 10px;">
                                <label style="display:block; font-size: 0.65rem; font-weight: 700; color: #202c55; text-transform: uppercase; margin-bottom: 4px;">Reason for Cancellation:</label>
                                <textarea id="cancelReason_${order.id}" placeholder="Please let us know your reason..." style="width: 100%; height: 50px; padding: 8px; font-size: 0.78rem; border: 1px solid #e2e4ed; border-radius: 4px; outline: none; font-family: 'Montserrat'; resize: none; box-sizing: border-box;"></textarea>
                            </div>

                            <div style="margin-bottom: 12px;">
                                <label style="display:block; font-size: 0.65rem; font-weight: 700; color: #202c55; text-transform: uppercase; margin-bottom: 4px;">PhonePe Number for Refund:</label>
                                <input type="text" id="cancelPhonePe_${order.id}" maxlength="10" placeholder="e.g. 9876543210" style="width: 100%; padding: 8px; font-size: 0.78rem; border: 1px solid #e2e4ed; border-radius: 4px; outline: none; font-family: 'Montserrat'; box-sizing: border-box;">
                            </div>

                            <div style="display: flex; gap: 8px;">
                                <button onclick="submitClientCancellationForm(event, ${order.id}, '${ordPaymentId}')" style="flex: 1; background: #d9383a; color: #fff; border: none; padding: 8px; font-size: 0.7rem; font-weight: 700; border-radius: 4px; cursor: pointer; font-family: 'Montserrat'; text-transform: uppercase; letter-spacing: 0.5px;">Confirm Cancel</button>
                                <button onclick="toggleCancellationFormView('${order.id}')" style="background: #ffffff; color: #777; border: 1px solid #e2e4ed; padding: 8px 12px; font-size: 0.7rem; font-weight: 700; border-radius: 4px; cursor: pointer; font-family: 'Montserrat'; text-transform: uppercase;">Keep Order</button>
                            </div>
                        </div>
                    </div>
                `;
            }

            let logisticsMetadataHTML = ""; 
            if (isShipped) {
                const partner = order.courier || 'Standard Logistics';
                const trackingNum = order.tracking_number || 'N/A';
                logisticsMetadataHTML = `
                    <div style="margin-top: 5px; font-size: 0.75rem; color: var(--purple-primary); font-weight: 600; background: #f4f4f7; padding: 6px 12px; border-radius: 4px; display: inline-flex; align-items: center; gap: 6px;">
                        <i class="fas fa-truck"></i> <span>Waybill (${partner}): <strong>${trackingNum}</strong></span>
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
            <div style="background: #ffffff; border: 1px solid #e8e8ef; border-radius: 8px; padding: 16px; box-sizing: border-box; width: 100%; display: flex; flex-direction: column; gap: 15px; box-shadow: 0 4px 15px rgba(32, 44, 85, 0.02); text-align: left; margin-bottom: 15px;">
                
                <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #f1f1f5; padding-bottom: 14px; gap: 15px;">
                    <div style="text-align: left; flex: 1;">
                        <span style="font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 2px; font-family: monospace; font-weight: 600; letter-spacing: 0.5px;">
                            Reference ID: <strong style="color: var(--purple-primary);">#${ordPaymentId}</strong>
                        </span>
                        <h4 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: var(--purple-primary); font-family: 'Montserrat', sans-serif;">
                            ${order.customer_name}
                        </h4>
                    </div>
                    <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
                        <div style="line-height: 1.3; margin-bottom: 2px;">
                            <span style="font-size: 0.75rem; color: var(--text-muted); display: block; font-weight: 600; text-align: right;">Ordered: ${ordDate}</span>
                            <span style="font-size: 1.1rem; font-weight: 700; color: var(--purple-primary); display: block; text-align: right;">${ordTotalAmount}</span>
                        </div>
                        <span style="${badgeStyle} font-size: 0.65rem; padding: 5px 12px; border-radius: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; text-align: center">
                            ${displayStatus}
                        </span>
                        ${logisticsMetadataHTML}
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

                <div style="background: #fafafa; padding: 12px 16px; border-radius: 6px; border: 1px solid #e8e8ef; font-size: 0.8rem; color: #111116; font-weight: 500; line-height: 1.4;">
                    <i class="fas fa-map-marker-alt" style="color: var(--pink-accent, #ff1493); margin-right: 4px;"></i>
                    <span style="color: var(--text-muted); font-weight: 600;">Shipping Destination:</span> ${order.address}
                </div>

                ${cancellationControlMarkup}

            </div>
            `;
        }).join('');

    } catch (error) {
        console.error("Tracking rendering breakdown caught:", error);
        statusMsg.innerHTML = `<span style="color:red; font-size:0.85rem;">Tracking server cluster timed out. Please try again shortly.</span>`;
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
function openAdminMasterConsole(event) {
    if (event) event.preventDefault();

    if (!INTEGRATED_ADMIN_AUTH_STATE) {
        alert("🔒 Access Denied. Please unlock the master system using the Lock icon first.");
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
                Synchronizing Live Supabase Order Matrix...
            </span>
        </div>
    `;

    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;
    
    const targetFetchUrl = `${sbUrl}/rest/v1/Orders?select=*&order=created_at.desc`;

    fetch(targetFetchUrl, {
        method: "GET",
        headers: {
            "apikey": sbKey,
            "Authorization": `Bearer ${sbKey}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) throw new Error(`Supabase returned connection status code: ${response.status}`);
        return response.json();
    })
    .then(supabaseOrdersArray => {
        // ➔ THE CRITICAL ALIGNMENT: Map the true 'total_amount' column safely into your cache variables
        adminOrdersCache = (supabaseOrdersArray || []).map(order => ({
            "id": order.id,
            "payment_id": order.payment_id,
            "Payment ID": order.payment_id,
            "Date": order.created_at ? new Date(order.created_at).toLocaleString('en-IN') : 'N/A',
            "customer_name": order.customer_name,
            "Client Name": order.customer_name,
            "phone": order.phone,
            "Phone": order.phone,
            "address": order.address,
            "Address": order.address,
            "order_items": order.order_items,
            "Order Items": order.order_items,
            "order_images": order.order_images,
            "Order Images": order.order_images,
            "status": order.status || 'Paid',
            "Status": order.status || 'Paid',
            "total_amount": order.total_amount,
            "Total Amount": order.total_amount,
            "Total Paid": order.total_amount,
            "Courier": order.courier || 'Standard Logistics',
            "courier": order.courier || 'Standard Logistics',
            "Tracking Number": order.tracking_number || 'N/A',
            "tracking_number": order.tracking_number || 'N/A',
            "cancel_reason": order.cancel_reason || '',
            "refund_phonepe": order.refund_phonepe || ''
        }));
        
        statusMsg.innerHTML = "";
        // Fire your calculation and card layout loops
        renderSegregatedAdminOrders();
    })
    .catch(err => {
        console.error("Admin dashboard runtime drop:", err);
        statusMsg.innerText = "Critical security handshake breakdown. Unable to authenticate Supabase tables.";
    });
}

// =========================================================================
// ANGEL JEWELLERY — DUAL DISPLAY ADMINISTRATIVE TRACKING MATRIX STATE CONTROL
// =========================================================================
let currentAdminLayoutViewMode = "cards"; // Active display state tracker cache: 'cards' or 'table'

function toggleAdminConsoleLayoutMode(targetViewMode) {
    if (currentAdminLayoutViewMode === targetViewMode) return;
    currentAdminLayoutViewMode = targetViewMode;

    const cardsBtn = document.getElementById('adminViewModeCardsBtn');
    const tableBtn = document.getElementById('adminViewModeTableBtn');

    if (!cardsBtn || !tableBtn) return;

    // Apply high-contrast interactive toggle coloring styles cleanly
    if (targetViewMode === 'cards') {
        cardsBtn.style.cssText = "background: var(--purple-primary, #202c55); color: #ffffff; border: none; padding: 6px 14px; font-size: 0.72rem; font-weight: 700; font-family: 'Montserrat'; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; outline: none;";
        tableBtn.style.cssText = "background: transparent; color: #8a8da0; border: none; padding: 6px 14px; font-size: 0.72rem; font-weight: 700; font-family: 'Montserrat'; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; outline: none;";
    } else {
        tableBtn.style.cssText = "background: var(--purple-primary, #202c55); color: #ffffff; border: none; padding: 6px 14px; font-size: 0.72rem; font-weight: 700; font-family: 'Montserrat'; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; outline: none;";
        cardsBtn.style.cssText = "background: transparent; color: #8a8da0; border: none; padding: 6px 14px; font-size: 0.72rem; font-weight: 700; font-family: 'Montserrat'; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; outline: none;";
    }

    // Trigger full ledger redraw
    renderSegregatedAdminOrders();
}

// =========================================================================
// 1. UPDATED TABULAR RENDERER (ADDED ROW ID AND TIGHT COURIER PANEL)
// =========================================================================
function renderTabularSpreadsheetAdminOrders(datasetArray) {
    const ordersContainer = document.getElementById('adminMasterOrdersContainer');
    if (!ordersContainer) return;

    if (!document.getElementById('adminTableResponsiveStylesTag')) {
        const styleSheetNode = document.createElement("style");
        styleSheetNode.id = "adminTableResponsiveStylesTag";
        styleSheetNode.innerHTML = `
            .admin-compact-table-scroller { width: 100%; overflow-x: auto; background: #ffffff; border: 1px solid #e8e8ef; border-radius: 8px; box-shadow: 0 4px 15px rgba(32,44,85,0.01); box-sizing: border-box; }
            .admin-master-data-table { width: 100%; border-collapse: collapse; margin: 0; font-size: 0.82rem; font-family: 'Montserrat', sans-serif; }
            .admin-master-data-table th { background: #f4f4f7; color: var(--text-muted, #777); font-weight: 700; padding: 12px 16px; border-bottom: 2px solid #e8e8ef; text-transform: uppercase; font-size: 0.68rem; letter-spacing: 0.8px; text-align: left; }
            .admin-master-data-table td { padding: 14px 16px; border-bottom: 1px solid #f1f1f5; color: #111116; font-weight: 500; vertical-align: middle; transition: background-color 0.2s ease; }
            .admin-master-data-table tr:hover td { background: #fafafa; }
            /* Highlight class for active shipping action */
            .admin-master-data-table tr.active-shipping-row td { background: #fff9e6 !important; border-top: 1px solid #cca43b; border-bottom: 1px solid #cca43b; }
            .table-action-mini-pill { display: inline-flex; align-items: center; justify-content: center; gap: 4px; padding: 5px 10px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 4px; text-decoration: none; cursor: pointer; transition: all 0.2s; white-space: nowrap; height: 26px; box-sizing: border-box; }
        `;
        document.head.appendChild(styleSheetNode);
    }
ordersContainer.innerHTML = `
        <div class="admin-compact-table-scroller">
            <table class="admin-master-data-table">
                <thead>
                    <tr>
                        <th style="width: 130px;">Reference ID</th>
                        <th>Client details</th>
                        <th>Purchased masterpieces</th>
                        <th style="width: 110px;">Total Bill</th>
                        <th style="width: 100px;">Status</th>
                        <!-- ➔ NEW HEADER COLUMN ADDED -->
                        <th style="width: 140px;">Tracking Waybill</th>
                        <th style="text-align: center; width: 180px;">Quick Actions Hub</th>
                    </tr>
                </thead>
                <tbody>
                    ${datasetArray.map(order => {
                        const ordPaymentId = order.payment_id || 'N/A';
                        const ordClientName = order.customer_name || 'Anonymous';
                        const ordPhone = String(order.phone || '').replace(/[^0-9]/g, '');
                        const ordTotalAmount = order.total_amount ? (typeof order.total_amount === 'number' ? formatCurrency(order.total_amount) : order.total_amount) : '₹0';
                        const ordDate = order['Date'] || order.Date || 'N/A';
                        
                        const isShipped = String(order.status).toLowerCase() === 'shipped';
                        const badgeStyle = isShipped 
                            ? "background: rgba(255, 20, 147, 0.08); color: var(--pink-accent, #ff1493); font-weight:700;" 
                            : "background: rgba(32, 44, 85, 0.06); color: var(--purple-primary, #202c55); font-weight:700;";

                        const itemsSummary = (order.order_items || '').split(',').map(i => i.trim()).join(' | ');

                        const clientMessage = `Hello ${ordClientName},\n\nYour Angel Jewellery order (Ref: ${ordPaymentId}) status update! ✨`;
                        const whatsappUpdateLink = `https://wa.me/${ordPhone}?text=${encodeURIComponent(clientMessage)}`;

                        const inlineShipActionHTML = !isShipped 
                            ? `<button class="table-action-mini-pill" onclick="revealCourierAllocationPanel('${ordPaymentId}')" style="background: var(--purple-primary, #202c55); color:#fff; border:none;"><i class="fas fa-shipping-fast"></i> Ship</button>`
                            : `<span style="font-size:0.7rem; color:#8a8da0; font-weight:600;"><i class="fas fa-check-circle"></i> Handed Off</span>`;

                        // ➔ MAP DYNAMIC WAYBILL MARKUP METRICS
                        const partnerCompany = order.Courier || order.courier || 'Standard Logistics';
                        const trackingWaybillNo = order['Tracking Number'] || order.tracking_number || 'N/A';
                        const tableTrackingCellHTML = isShipped 
                            ? `<div style="font-weight:700; color:#202c55; font-size:0.75rem;">${partnerCompany}</div>
                               <div style="font-family:monospace; font-size:0.72rem; color:#777; margin-top:2px;">${trackingWaybillNo}</div>`
                            : `<span style="color:#aaa; font-style:italic; font-size:0.75rem;">Not Shipped Yet</span>`;

                        const safeName = ordClientName.replace(/'/g, "\\'");
                        const safePhone = String(order.phone).replace(/'/g, "\\'");
                        const safeAddress = String(order.address).replace(/'/g, "\\'").replace(/\n/g, " ");

                        return `
                            <tr id="order-row-${ordPaymentId}">
                                <td style="font-family: monospace; font-weight: 700; color: var(--purple-primary, #202c55);">
                                    #${ordPaymentId.slice(0, 12)}...
                                    <span style="display:block; font-size:0.65rem; color:#aaa; font-weight:500; font-family:'Montserrat'; margin-top:2px;">${ordDate}</span>
                                </td>
                                <td>
                                    <div style="font-weight:700; color:#111116;">${ordClientName}</div>
                                    <div style="font-size:0.72rem; color:#777; margin-top:2px; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${order.address}">${order.address}</div>
                                </td>
                                <td style="font-size: 0.78rem; color:#4a4a5a; max-width: 250px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${itemsSummary}">
                                    ${itemsSummary}
                                </td>
                                <td style="font-weight:700; color: var(--purple-primary, #202c55);">${ordTotalAmount}</td>
                                <td>
                                    <span style="${badgeStyle} font-size:0.6rem; padding:4px 8px; border-radius:12px; text-transform:uppercase; letter-spacing:0.5px; display:inline-block; text-align:center;">
                                        ${isShipped ? 'Shipped' : 'Placed'}
                                    </span>
                                </td>
                                
                                <!-- ➔ NEW DATA CELL INJECTED INTO ROW -->
                                <td>${tableTrackingCellHTML}</td>
                                
                                <td style="text-align: center; position: relative;">
                                    <div style="display:flex; gap:6px; justify-content:center; align-items:center;">
                                        <button class="table-action-mini-pill" onclick="copyShippingLabelToClipboard('${safeName}', '${safePhone}', '${safeAddress}', this)" style="background:transparent; border:1px solid #e8e8ef; color:#111116;" title="Copy Tag"><i class="far fa-copy"></i></button>
                                        <a href="${whatsappUpdateLink}" target="_blank" class="table-action-mini-pill" style="background:transparent; border:1px solid #25d366; color:#25d366;"><i class="fab fa-whatsapp"></i> Ping</a>
                                        <div id="shipped-action-slot-${ordPaymentId}" style="display:contents;">${inlineShipActionHTML}</div>
                                    </div>

                                    <div id="courier-panel-${ordPaymentId}" class="courier-allocation-panel" style="position: absolute; display: none; background: #ffffff; border: 1px solid #202c55; box-shadow: 0 10px 30px rgba(0,0,0,0.15); border-radius: 6px; margin-top: 8px; right: 0; z-index: 100; padding: 12px; width: 240px; box-sizing: border-box; text-align: left;">
                                        <p style="margin: 0 0 8px 0; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: #202c55; letter-spacing: 0.5px;">Logistics Partner</p>
                                        <div style="display: flex; gap: 8px; margin-bottom: 8px; font-size: 0.72rem; font-weight: 700;">
                                            <label style="display: inline-flex; align-items: center; gap: 3px; cursor:pointer;"><input type="radio" name="table-courier-${ordPaymentId}" value="DTDC" checked style="accent-color:#202c55;"> DTDC</label>
                                            <label style="display: inline-flex; align-items: center; gap: 3px; cursor:pointer;"><input type="radio" name="table-courier-${ordPaymentId}" value="Delhivery" style="accent-color:#202c55;"> Delhivery</label>
                                            <label style="display: inline-flex; align-items: center; gap: 3px; cursor:pointer;"><input type="radio" name="table-courier-${ordPaymentId}" value="Blue Dart" style="accent-color:#202c55;"> Blue Dart</label>
                                        </div>
                                        <div style="display: flex; gap: 6px; width: 100%;">
                                            <input type="text" id="tracking-input-${ordPaymentId}" placeholder="Waybill No" style="padding: 6px 8px; font-size: 0.75rem; border: 1px solid #e8e8ef; border-radius: 4px; flex-grow: 1; min-width: 0; outline: none; font-family:'Montserrat';">
                                            <button onclick="updateShippingStatus('${ordPaymentId}', this)" style="background: #25d366; color: #fff; border: none; padding: 0 10px; font-size: 0.65rem; font-weight: 700; border-radius: 4px; cursor: pointer; height: 28px;">OK</button>
                                            <button onclick="hideCourierAllocationPanel('${ordPaymentId}')" style="background: transparent; border: 1px solid #e8e8ef; padding: 0 8px; font-size: 0.65rem; border-radius: 4px; color: #777; cursor: pointer; height: 28px;">✕</button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}
    

function switchAdminConsoleTab(targetTabKey) {
    currentAdminActiveTab = targetTabKey;
    
    const pendingBtn = document.getElementById('adminTabPendingBtn');
    const shippedBtn = document.getElementById('adminTabShippedBtn');
    const cancelledBtn = document.getElementById('adminTabCancelledBtn'); // Targeted matching button ID
    
    // Reset background maps
    if (pendingBtn) pendingBtn.style.cssText = "background: #f9f9fb; color: var(--text-muted); border: 1px solid #e8e8ef; padding: 10px 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; border-radius: 4px; cursor: pointer;";
    if (shippedBtn) shippedBtn.style.cssText = "background: #f9f9fb; color: var(--text-muted); border: 1px solid #e8e8ef; padding: 10px 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; border-radius: 4px; cursor: pointer;";
    if (cancelledBtn) cancelledBtn.style.cssText = "background: #f9f9fb; color: var(--text-muted); border: 1px solid #e8e8ef; padding: 10px 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; border-radius: 4px; cursor: pointer;";
    
    // Highlight selected node context rules
    if (targetTabKey === 'pending' && pendingBtn) pendingBtn.style.setProperty("background", "var(--purple-primary)", "important"), pendingBtn.style.setProperty("color", "#fff", "important");
    if (targetTabKey === 'shipped' && shippedBtn) shippedBtn.style.setProperty("background", "var(--purple-primary)", "important"), shippedBtn.style.setProperty("color", "#fff", "important");
    if (targetTabKey === 'cancelled' && cancelledBtn) cancelledBtn.style.setProperty("background", "var(--purple-primary)", "important"), cancelledBtn.style.setProperty("color", "#fff", "important");
    
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
// ANGEL JEWELLERY — THREE-TAB RESPONSIVE ADMINISTRATIVE CONSOLE LAYOUT
// =========================================================================
function renderSegregatedAdminOrders() {
if (!document.getElementById('adminMasterConsoleMobileOverrides')) {
        const mobileOverrideNode = document.createElement("style");
        mobileOverrideNode.id = "adminMasterConsoleMobileOverrides";
        mobileOverrideNode.innerHTML = `
            #adminConsoleTabsWrapper, 
            .analytics-cards-row-wrapper-selector { 
                display: flex !important; 
                gap: 10px !important; 
                flex-wrap: wrap !important; 
            }
            
            #adminConsoleTabsWrapper > button,
            [id^="analytics"] {
                flex: 1 1 calc(33.33% - 10px) !important;
                min-width: 120px !important;
            }

            @media (max-width: 768px) {
                .admin-card-header {
                    flex-direction: column !important;
                    align-items: flex-start !important;
                    gap: 10px !important;
                }
                .admin-header-right {
                    text-align: left !important;
                    width: 100% !important;
                    justify-content: space-between !important;
                    flex-direction: row-reverse !important;
                    border-top: 1px dashed #e8e8ef !important;
                    padding-top: 10px !important;
                }
                
                /* ➔ FIX FOR THE LEFT-SIDE OFFSET OVERFLOW SHOWN IN image_7d8643.png */
                .admin-action-row-container {
                    flex-direction: column !important;
                    align-items: stretch !important;
                    gap: 15px !important;
                }
                
                /* Switch out grid layout patterns for an automated 50-50 percentage split row wrap system */
                .admin-card-actions-group {
                    display: flex !important;
                    flex-wrap: wrap !important;
                    gap: 8px !important;
                    width: 100% !important;
                    margin-left: 0 !important;
                    justify-content: flex-start !important;
                }
                
                /* Target every child direct element including nested structural wrapper slots */
                .admin-card-actions-group > button,
                .admin-card-actions-group > a,
                .admin-card-actions-group > div {
                    flex: 1 1 calc(50% - 6px) !important;
                    width: calc(50% - 6px) !important;
                    max-width: 100% !important;
                    box-sizing: border-box !important;
                }

                /* Flatten nested child selectors inside dynamic slot blocks so they keep proportional size mapping */
                .admin-card-actions-group > div {
                    display: flex !important;
                    gap: 8px !important;
                }
                .admin-card-actions-group > div > * {
                    flex: 1 1 100% !important;
                    width: 100% !important;
                    box-sizing: border-box !important;
                }
            }
        `;
        document.head.appendChild(mobileOverrideNode);
    }

    const statusMsg = document.getElementById('adminConsoleStatus');
    const ordersContainer = document.getElementById('adminMasterOrdersContainer');
    const pendingCountSpan = document.getElementById('adminPendingCount');
    const shippedCountSpan = document.getElementById('adminShippedCount');
    const cancelledCountSpan = document.getElementById('adminCancelledCount');
    
    const pendingValueHeading = document.getElementById('analyticsPendingValue');
    const shippedValueHeading = document.getElementById('analyticsShippedValue');
    const combinedValueHeading = document.getElementById('analyticsCombinedValue');

    if (!ordersContainer || !adminOrdersCache) return;

    ordersContainer.innerHTML = "";

    let accumulatedPendingSum = 0;
    let accumulatedShippedSum = 0;

    adminOrdersCache.forEach(order => {
        const rawTotalPaidString = String(order.total_amount || '0');
        const numericValue = parseFloat(rawTotalPaidString.replace(/[^0-9.]/g, '')) || 0;
        const statusStr = String(order.status || '').trim().toLowerCase();
        
        if (statusStr === 'shipped') {
            accumulatedShippedSum += numericValue;
        } else if (statusStr !== 'cancelled' && statusStr !== 'refunded') {
            accumulatedPendingSum += numericValue;
        }
    });

    const combinedTotalSum = accumulatedPendingSum + accumulatedShippedSum;

    if (pendingValueHeading) pendingValueHeading.innerText = formatCurrency(accumulatedPendingSum);
    if (shippedValueHeading) shippedValueHeading.innerText = formatCurrency(accumulatedShippedSum);
    if (combinedValueHeading) combinedValueHeading.innerText = formatCurrency(combinedTotalSum);

    // Segregate cache matrices into 3 distinct operational groups
    const pendingOrdersList = adminOrdersCache.filter(order => {
        const s = String(order.status || '').trim().toLowerCase();
        return s !== 'shipped' && s !== 'cancelled' && s !== 'refunded';
    });
    const shippedOrdersList = adminOrdersCache.filter(order => String(order.status || '').trim().toLowerCase() === 'shipped');
    const cancelledOrdersList = adminOrdersCache.filter(order => {
        const s = String(order.status || '').trim().toLowerCase();
        return s === 'cancelled' || s === 'refunded';
    });

    if (pendingCountSpan) pendingCountSpan.innerText = pendingOrdersList.length;
    if (shippedCountSpan) shippedCountSpan.innerText = shippedOrdersList.length;
    if (cancelledCountSpan) cancelledCountSpan.innerText = cancelledOrdersList.length;

    let targetDisplayDataset = pendingOrdersList;
    if (currentAdminActiveTab === 'shipped') targetDisplayDataset = shippedOrdersList;
    if (currentAdminActiveTab === 'cancelled') targetDisplayDataset = cancelledOrdersList;

    if (adminConsoleSearchQueryString) {
        targetDisplayDataset = targetDisplayDataset.filter(order => {
            const clientName = String(order.customer_name || '').toLowerCase();
            const phoneNum = String(order.phone || '').toLowerCase();
            const paymentId = String(order.payment_id || '').toLowerCase();
            return clientName.includes(adminConsoleSearchQueryString) || phoneNum.includes(adminConsoleSearchQueryString) || paymentId.includes(adminConsoleSearchQueryString);
        });
    }

    if (statusMsg) {
        statusMsg.innerHTML = `Viewing <span style="color:var(--pink-accent); font-weight:700; text-transform:uppercase;">${currentAdminActiveTab}</span> matrix. Total rows matched: <strong>${targetDisplayDataset.length}</strong>`;
    }

    if (targetDisplayDataset.length === 0) {
        ordersContainer.innerHTML = `
            <div style="text-align:center; padding:40px; color:var(--text-muted); font-size:0.9rem; background:#f9f9fb; border-radius:6px; border:1px dashed var(--border-subtle, #e8e8ef)">
                No orders match your active filter settings.
            </div>`;
        return;
    }

    const chronologicallyReversedStack = [...targetDisplayDataset].reverse();

    if (currentAdminLayoutViewMode === "table" && typeof renderTabularSpreadsheetAdminOrders === 'function') {
        renderTabularSpreadsheetAdminOrders(chronologicallyReversedStack);
    } else {
        // Initialize dynamic custom chat hover style tag context rule globally once
        if (!document.getElementById('angelAdminChatHoverStyles')) {
            const hoverStyleNode = document.createElement("style");
            hoverStyleNode.id = "angelAdminChatHoverStyles";
            hoverStyleNode.innerHTML = `
                .admin-chat-action-btn { background: #ffffff !important; color: #25d366 !important; border: 1px solid #25d366 !important; }
                .admin-chat-action-btn:hover { background: #25d366 !important; color: #ffffff !important; }
            `;
            document.head.appendChild(hoverStyleNode);
        }

        ordersContainer.innerHTML = chronologicallyReversedStack.map(order => {
            const ordStatus = String(order.status || 'Paid').trim();
            const ordPaymentId = order.payment_id || 'N/A';
            const ordClientName = order.customer_name || 'Anonymous';
            const ordPhone = String(order.phone || '').replace(/[^0-9]/g, '');
            const ordAddress = order.address || '';
            const ordDate = order.Date || 'N/A';
            const ordTotalAmount = typeof order.total_amount === 'number' ? formatCurrency(order.total_amount) : order.total_amount;

            const isShipped = ordStatus.toLowerCase() === 'shipped';
            const isCancelled = ordStatus.toLowerCase() === 'cancelled';
            const isRefunded = ordStatus.toLowerCase() === 'refunded';

            // Escape strings for clipboard methods safely
            const safeName = ordClientName.replace(/'/g, "\\'");
            const safePhone = ordPhone.trim();
            const safeAddress = ordAddress.replace(/'/g, "\\'").replace(/\n/g, " ");

            let badgeStyle = "background: rgba(32, 44, 85, 0.08); color: var(--purple-primary);";
            if (isShipped) badgeStyle = "background: rgba(255, 20, 147, 0.1); color: var(--pink-accent);";
            if (isCancelled) badgeStyle = "background: rgba(217, 56, 58, 0.1); color: #d9383a;";
            if (isRefunded) badgeStyle = "background: rgba(42, 123, 106, 0.1); color: #2a7b6a;";

            const clientMessage = `Hello ${ordClientName},\n\nRegarding your Angel Jewellery order portfolio update...`;
            const whatsappUpdateLink = `https://wa.me/${ordPhone}?text=${encodeURIComponent(clientMessage)}`;

            const sharedActionStyle = "display: inline-flex !important; align-items: center !important; justify-content: center !important; gap: 6px !important; height: 36px !important; padding: 0 14px !important; font-size: 0.72rem !important; font-weight: 700 !important; text-transform: uppercase !important; font-family: 'Montserrat', sans-serif !important; letter-spacing: 0.5px !important; border-radius: 4px !important; cursor: pointer !important; text-decoration: none !important; box-sizing: border-box !important; transition: all 0.2s ease !important; white-space: nowrap !important; margin: 0 !important; line-height: 1 !important;";

            const chatButtonHTML = `
                <a href="${whatsappUpdateLink}" target="_blank" class="admin-chat-action-btn" style="${sharedActionStyle}" title="WhatsApp Client">
                    <i class="fab fa-whatsapp" style="font-size: 0.9rem;"></i> Chat
                </a>
            `;

            let contextButtonsHTML = chatButtonHTML;

            if (!isShipped && !isCancelled && !isRefunded) {
                // Pending Tab: Ship + Chat
                contextButtonsHTML = `
                    <button onclick="revealCourierAllocationPanel('${ordPaymentId}')" style="${sharedActionStyle} background: var(--purple-primary, #202c55) !important; color: #ffffff !important; border: none !important;">
                        <i class="fas fa-shipping-fast"></i> Ship
                    </button>
                    ${chatButtonHTML}
                `;
            } else if (isCancelled) {
                // Cancelled Tab: Processed Refund + Chat
                contextButtonsHTML = `
                    <button onclick="executeAdminOrderRefundPipeline(event, ${order.id})" style="${sharedActionStyle} background: #2a7b6a !important; color: #ffffff !important; border: none !important;">
                        <i class="fas fa-hand-holding-usd"></i> Processed Refund
                    </button>
                    <button onclick="executeAdminReverseCancellationPipeline(event, ${order.id})" style="${sharedActionStyle} background: #ffffff !important; color: var(--purple-primary, #202c55) !important; border: 1px solid var(--purple-primary, #202c55) !important;">
                        <i class="fas fa-undo-alt"></i> Move Back to Ordered
                    </button>
                    ${chatButtonHTML}
                `;
            }else if (isRefunded) {
                // Refunded Tab: Just allow moving back to Ordered + Chat if adjustment is needed
                contextButtonsHTML = `
                    <button onclick="executeAdminReverseCancellationPipeline(event, ${order.id})" style="${sharedActionStyle} background: #ffffff !important; color: var(--purple-primary, #202c55) !important; border: 1px solid var(--purple-primary, #202c55) !important;">
                        <i class="fas fa-undo-alt"></i> Move Back to Ordered
                    </button>
                    ${chatButtonHTML}
                `;
            }

            let cancelDetailsBlockHTML = "";
            if (isCancelled || isRefunded) {
                cancelDetailsBlockHTML = `
                    <div style="background: #fffdfd; border: 1px solid #e8e8ef; border-radius: 6px; padding: 12px; margin-top: 10px; font-size: 0.8rem; font-family:'Montserrat'; text-align: left; width: 100%; box-sizing: border-box;">
                        <div style="margin-bottom: 6px;"><strong style="color:#d9383a;">Cancellation Reason:</strong> ${order.cancel_reason || 'Not Specified'}</div>
                        <div><strong style="color:var(--purple-primary, #202c55);">PhonePe Refund Number:</strong> <span style="font-weight:700;">+91 ${order.refund_phonepe || 'N/A'}</span></div>
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
                    <tr style="border-bottom: 1px solid #f1f1f5;">
                        <td style="padding: 10px 12px; width: 60px; text-align: center; vertical-align: middle;">
                            <div style="width: 44px; height: 44px; border-radius: 4px; border: 1px solid #e8e8ef; overflow: hidden; background: #ffffff;">
                                <img src="${matchedImgUrl}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/placeholder.png'">
                            </div>
                        </td>
                        <td style="padding: 10px 12px; font-size: 0.88rem; font-weight: 600; color: #111116;">${parsedTitle}</td>
                        <td style="padding: 10px 12px; font-size: 0.85rem; font-weight: 700; color: var(--purple-primary); text-align: center;">${parsedQuantity}</td>
                    </tr>
                `;
            }).join('');

            return `
            <div style="background: #ffffff; border: 1px solid var(--purple-primary, #202c55); border-radius: 8px; padding: 16px; box-sizing: border-box; width: 100%; display: flex; flex-direction: column; gap: 15px; margin-bottom: 15px; box-shadow: 0 4px 15px rgba(32, 44, 85, 0.02); font-family: 'Montserrat', sans-serif;">
                
                <!-- Card Header -->
                <div class="admin-card-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #f1f1f5; padding-bottom: 14px; gap: 15px;">
                    <div class="admin-header-left" style="text-align: left; flex: 1;">
                        <span style="font-size: 0.68rem; color: var(--text-muted, #777); text-transform: uppercase; display: block; margin-bottom: 2px; font-family: monospace; font-weight: 600; letter-spacing: 0.5px;">
                            Transaction ID: <strong style="color: var(--purple-primary, #202c55);">${ordPaymentId}</strong>
                        </span>
                        <h4 style="margin: 0; font-size: 1.15rem; font-weight: 700; color: var(--purple-primary, #202c55); font-family: 'Montserrat', sans-serif;">
                            ${ordClientName}
                        </h4>
                    </div>
                    <div class="admin-header-right" style="text-align: right; display: flex; gap: 12px; align-items: center;">
                        <div style="line-height: 1.3;">
                            <span style="font-size: 0.75rem; color: var(--text-muted, #777); display: block; font-weight: 600;">${ordDate}</span>
                            <span style="font-size: 1.1rem; font-weight: 700; color: var(--purple-primary, #202c55); display: block;">${ordTotalAmount}</span>
                        </div>
                        <span id="badge-status-${ordPaymentId}" style="${badgeStyle} font-size: 0.65rem; padding: 5px 12px; border-radius: 20px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; text-align: center">
                            ${order.status || 'Paid'}
                        </span>
                    </div>
                </div>

                <!-- Items Table Row -->
                <div style="width: 100%; overflow-x: auto; background: #fdfdfd; border: 1px solid #e8e8ef; border-radius: 6px;">
                    <table style="width: 100%; border-collapse: collapse; margin: 0; padding: 0;">
                        <tbody>
                            ${inventoryRowsHTML}
                        </tbody>
                    </table>
                </div>

                <!-- Shipping & Control Row Panel -->
                <div style="display: flex; background: #fafafa; padding: 16px; border-radius: 6px; border: 1px solid #e8e8ef; flex-direction: column; gap: 15px; width: 100%; box-sizing: border-box;">
                    
                    <!-- Added 'admin-action-row-container' class here -->
                    <div class="admin-action-row-container" style="display: flex; justify-content: space-between; align-items: center; gap: 15px; flex-wrap: wrap; width: 100%;">
                        
                        <!-- Destination address frame -->
                        <div style="font-size: 0.8rem; color: #111116; font-weight: 500; line-height: 1.4; text-align: left; flex: 1; min-width: 200px;">
                            <i class="fas fa-map-marker-alt" style="color: var(--pink-accent, #ff1493); margin-right: 4px;"></i>
                            <span style="color: var(--text-muted, #777); font-weight: 600;">Ship To:</span> ${ordAddress}
                        </div>
                        
                        <!-- ➔ Added 'admin-card-actions-group' class name hook here to fix horizontal clipping -->
                        <div class="admin-card-actions-group" style="display: flex; gap: 8px; align-items: center; justify-content: flex-end;">
                            <button onclick="copyShippingLabelToClipboard('${safeName}', '${safePhone}', '${safeAddress}', this)" style="${sharedActionStyle} background: transparent !important; color: var(--text-dark-primary, #111116) !important; border: 1px solid #e8e8ef !important;" title="Copy Address Tag">
                                <i class="far fa-copy"></i> Label
                            </button>
                            
                            <a href="tel:${ordPhone}" style="${sharedActionStyle} background: #ffffff !important; color: var(--purple-primary, #202c55) !important; border: 1px solid var(--purple-primary, #202c55) !important;" title="Call Client">
                                <i class="fas fa-phone-alt"></i> Call
                            </a>
                            
                            <div style="display: flex; gap: 8px; align-items: center;">
                                ${contextButtonsHTML}
                            </div>
                        </div>
                    </div>

                    ${cancelDetailsBlockHTML}

                    <!-- Courier Slider Form Panel -->
                    <div id="courier-panel-${ordPaymentId}" class="courier-allocation-panel" style="display: none; background: #ffffff; border: 1px solid #e8e8ef; border-radius: 6px; padding: 16px; width: 100%; box-sizing: border-box; margin-top: 5px;">
                        <p style="margin: 0 0 10px 0; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--purple-primary, #202c55); letter-spacing: 0.5px;">Assign Logistics Partner & Waybill</p>
                        <div style="display: flex; gap: 15px; margin-bottom: 12px; flex-wrap: wrap; font-size: 0.8rem; font-weight: 600;">
                            <label style="display: inline-flex; align-items: center; gap: 6px; cursor: pointer;"><input type="radio" name="courier-${ordPaymentId}" value="DTDC" checked style="accent-color: var(--purple-primary, #202c55);"> DTDC</label>
                            <label style="display: inline-flex; align-items: center; gap: 6px; cursor: pointer;"><input type="radio" name="courier-${ordPaymentId}" value="Delhivery" style="accent-color: var(--purple-primary, #202c55);"> Delhivery</label>
                            <label style="display: inline-flex; align-items: center; gap: 6px; cursor: pointer;"><input type="radio" name="courier-${ordPaymentId}" value="Blue Dart" style="accent-color: var(--purple-primary, #202c55);"> Blue Dart</label>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="tracking-input-${ordPaymentId}" placeholder="Tracking Number" style="flex: 1; padding: 8px 12px; border: 1px solid #e8e8ef; border-radius: 4px; font-size: 0.8rem; font-family: 'Montserrat', sans-serif; outline: none; box-sizing: border-box;">
                            <button onclick="updateShippingStatus('${ordPaymentId}', this)" style="background: #25d366; color: #ffffff; border: none; padding: 0 16px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 4px; cursor: pointer; height: 34px;">Confirm</button>
                            <button onclick="hideCourierAllocationPanel('${ordPaymentId}')" style="background: transparent; color: var(--text-muted, #777); border: 1px solid #e8e8ef; padding: 0 12px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; border-radius: 4px; cursor: pointer; height: 34px;">Cancel</button>
                        </div>
                    </div>

                </div>

            </div>
            `;
        }).join('');
    }
}

// =========================================================================
// 2. REFRACTORED ACTION SHOW/HIDE PANEL HANDLERS (WITH ROW INTERACTION HIGHLIGHTS)
// =========================================================================
function revealCourierAllocationPanel(paymentId) {
    // A. Close all other open panels first and reset prior highlights
    document.querySelectorAll('.courier-allocation-panel').forEach(pane => pane.style.display = 'none');
    document.querySelectorAll('.admin-master-data-table tr').forEach(row => row.classList.remove('active-shipping-row'));

    // B. Open targeted panel
    const panel = document.getElementById(`courier-panel-${paymentId}`);
    if (panel) panel.style.display = 'block';

    // C. Add luxury highlight styling to matching table container row element
    const activeRow = document.getElementById(`order-row-${paymentId}`);
    if (activeRow) activeRow.classList.add('active-shipping-row');
}

function hideCourierAllocationPanel(paymentId) {
    const panel = document.getElementById(`courier-panel-${paymentId}`);
    if (panel) panel.style.display = 'none';

    // Remove row interaction highlights smoothly
    const activeRow = document.getElementById(`order-row-${paymentId}`);
    if (activeRow) activeRow.classList.remove('active-shipping-row');
}

async function updateShippingStatus(paymentId, btn) {
    const panel = document.getElementById(`courier-panel-${paymentId}`);
    const trackingInput = document.getElementById(`tracking-input-${paymentId}`);
    
    // Find which courier radio option was selected in the table row context
    const courierRadio = document.querySelector(`input[name="table-courier-${paymentId}"]:checked`);
    
    if (!trackingInput || !trackingInput.value.trim()) {
        alert("Please enter a valid Waybill / Tracking Number.");
        return;
    }
    
    const selectedCourier = courierRadio ? courierRadio.value : "Standard Logistics";
    const trackingNumber = trackingInput.value.trim();
    
    // Change button state to show progress
    const originalBtnText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i>`;
    
    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;
    const updateUrl = `${sbUrl}/rest/v1/Orders?payment_id=eq.${paymentId}`;
    
    try {
        const response = await fetch(updateUrl, {
            method: 'PATCH',
            headers: {
                'apikey': sbKey,
                'Authorization': `Bearer ${sbKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                status: 'shipped',
                courier: selectedCourier,
                tracking_number: trackingNumber
            })
        });
        
        if (!response.ok) throw new Error("Database failed to update shipment routing records.");
        
        // Remove tracking panel display & strip out active row highlights safely
        if (panel) panel.style.display = 'none';
        const activeRow = document.getElementById(`order-row-${paymentId}`);
        if (activeRow) activeRow.classList.remove('active-shipping-row');
        
        if (typeof openAdminMasterConsole === 'function') {
            await openAdminMasterConsole(); 
        }
        
    } catch (err) {
        console.error("Fulfillment sync error:", err);
        alert("Failed to sync shipment updates to the database. Check console details.");
        btn.disabled = false;
        btn.innerHTML = originalBtnText;
    }
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
        
        foldersGrid.style.setProperty("display", "flex", "important");
        foldersGrid.style.setProperty("flex-wrap", "wrap", "important");
        foldersGrid.style.setProperty("justify-content", "center", "important");
        foldersGrid.style.setProperty("gap", "60px", "important");
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
    foldersGrid.innerHTML = Object.values(categoryMap).map(folder => {
        return `
            <div class="category-compact-node-card" 
                 onclick="selectShowroomCategoryFolder('${folder.name}')"
                 style="display: flex; flex-direction: column; align-items: center; width: 110px; cursor: pointer; transition: transform 0.25s ease; box-sizing: border-box;"
                 onmouseover="this.style.transform='translateY(-3px)'"
                 onmouseout="this.style.transform='translateY(0)'">
                
                <div style="width: 150px; height: 150px; min-width: 100px; min-height: 100px; border-radius: 20px; overflow: hidden; background: #fafafa; border: 1px solid #e8e8ef; position: relative; box-shadow: 0 4px 12px rgba(32,44,85,0.04);">
                    <img src="${folder.thumbnail}" alt="${folder.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='assets/placeholder.png'">
                    
                    <div style="position: absolute; bottom: 4px; right: 4px; background: #202c55; color: #ffffff; font-size: 0.58rem; padding: 2px 6px; font-weight: 700; border-radius: 10px; font-family: 'Montserrat';">
                        ${folder.itemCount}
                    </div>
                </div>

                <div style="margin-top: 10px; text-align: center; width: 100%;">
                    <h3 style="margin: 0; font-family: 'Montserrat', sans-serif; font-size: 0.72rem; font-weight: 700; color: #202c55; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${folder.name}
                    </h3>
                </div>

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
        // Query the Products table explicitly using your authorized project headers
        const response = await fetch(`${sbUrl}/rest/v1/Products?select=id,stock,status`, {
            method: 'GET',
            headers: {
                'apikey': sbKey,
                'Authorization': `Bearer ${sbKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`Supabase returned status code: ${response.status}`);
        
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
        
        console.log("💎 Live Inventory Vault Synchronized successfully from Supabase:", MASTER_LIVE_INVENTORY_CACHE);
        
        if (!productDatabase || productDatabase.length === 0) {
            await loadProductDatabaseEngine();
        } else {
            generateDynamicCatalogFilters();
            filterCatalog();
        }
        renderFlashVaultShowroom();
        renderTrendingSection();
        renderVaultSaleSection();
        
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

    console.log("Processing precise inventory levels synchronization down to Supabase nodes...");

    for (const item of cartItemsArray) {
        try {
            const currentProductId = parseInt(item.id);
            const purchasedQuantity = parseInt(item.quantity) || 1; 

            const currentCachedData = MASTER_LIVE_INVENTORY_CACHE[currentProductId];
            if (!currentCachedData) continue;

            const currentStockLevel = parseInt(currentCachedData.stock) || 0;
            const absoluteNewStockLevel = Math.max(0, currentStockLevel - purchasedQuantity);
            const computedStatusFlag = absoluteNewStockLevel <= 0 ? "sold" : "available";

            const itemPatchUrl = `${sbUrl}/rest/v1/Products?id=eq.${currentProductId}`;
            
            const stockPayload = {
                "stock": absoluteNewStockLevel,
                "status": computedStatusFlag,
                "badge": absoluteNewStockLevel <= 0 ? "Sold Out" : ""
            };

            // Post write update cleanly to your table row index
            await fetch(itemPatchUrl, {
                method: 'PATCH',
                headers: {
                    'apikey': sbKey,
                    'Authorization': `Bearer ${sbKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(stockPayload)
            });

            console.log(`✨ Product ID #${currentProductId}: Successfully deducted ${purchasedQuantity} piece(s). Balance left: ${absoluteNewStockLevel}`);

        } catch (err) {
            console.error(`Inventory modification trace failed for item identification index:`, err);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    synchronizeLiveStorefrontInventory();
});

// 3. DELETE CHANNEL: Instant Row Purging via the Trash can icon
async function executeAdminItemDeletionPipeline(event, productId, productTitle) {
    if (event) event.stopPropagation();
    
    const userFinalConfirmation = confirm(`⚠️ DANGER ZONE: Are you entirely sure you want to permanently delete "${productTitle}" (ID: #${productId}) from Supabase?\n\nThis action cannot be undone.`);
    if (!userFinalConfirmation) return;

    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;
    const cleanPurgeTargetUrl = `${sbUrl}/rest/v1/Products?id=eq.${productId}`;

    try {
        const networkResponse = await fetch(cleanPurgeTargetUrl, {
            method: 'DELETE',
            headers: {
                'apikey': sbKey,
                'Authorization': `Bearer ${sbKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!networkResponse.ok) throw new Error(`Supabase returned status code: ${networkResponse.status}`);
        
        alert(`✨ Successfully Deleted! "${productTitle}" has been cleanly scrubbed from your database rows.`);
        if (MASTER_LIVE_INVENTORY_CACHE[productId]) delete MASTER_LIVE_INVENTORY_CACHE[productId];
        await loadProductDatabaseEngine();
        if (typeof renderFlashVaultShowroom === "function") renderFlashVaultShowroom();
        if (typeof filterCatalog === "function") filterCatalog();

    } catch (error) {
        console.error("Critical Supabase row write/purge communication error caught:", error);
        alert("Pipeline Synchronization Interrupted: Could not wipe item from Supabase database layout.");
    }
}

// =========================================================================
// ANGEL JEWELLERY — AUTOMATED CUSTOMER FEEDBACK & REVIEWS LOGIC
// =========================================================================
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

    // 2. Filter dataset
    const vaultPool = productDatabase.filter(p => {
        if (!p || !p.category) return false;
        const catLower = String(p.category).trim().toLowerCase();
        return catLower === 'flash vault' || catLower === 'flash';
    });

    // Mock testing placeholder array
    if (vaultPool.length === 0) {
        vaultPool.push({
            id: 9991,
            title: "Premium Stone Drop Earrings",
            price: 350,
            image: "images/mini-haram-14.jpeg",
            category: "Flash"
        }, {
            id: 9992,
            title: "Handcrafted Heritage Trinket",
            price: 350,
            image: "images/pendent-chains-4.jpeg",
            category: "Flash"
        });
    }

    const totalPages = Math.ceil(vaultPool.length / FLASH_VAULT_ITEMS_PER_PAGE);
    const sliceStart = flashVaultCurrentPage * FLASH_VAULT_ITEMS_PER_PAGE;
    const activePageSlice = vaultPool.slice(sliceStart, sliceStart + FLASH_VAULT_ITEMS_PER_PAGE);

    // 3. Render cards dynamically
    grid.innerHTML = activePageSlice.map(item => {
        const liveInventory = MASTER_LIVE_INVENTORY_CACHE[item.id] || { stock: 1, status: 'available' };
        const isClaimed = liveInventory.stock <= 0 || liveInventory.status === 'sold';
        const safeTitle = item.title.replace(/'/g, "\\'");

        // Admin Edit Inline Controls mirrored perfectly from the primary filter catalog engine
        const adminEditInlineControlMarkup = INTEGRATED_ADMIN_AUTH_STATE ? `
            <button type="button" 
                    onclick="openAdminFormModalForEditing(event, ${item.id})" 
                    style="position: absolute; top: 0px; left: 0px; z-index: 10 !important; display: inline-flex !important; align-items: center; justify-content: center; gap: 4px; padding: 6px 14px; background: #ffffff; color: #202c55; border: 2px solid #202c55; border-radius: 6px; font-size: 0.68rem; font-weight: 700; font-family: 'Montserrat'; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 6px 20px rgba(0,0,0,0.15); cursor: pointer; transition: all 0.2s; outline:none;">
                <i class="fas fa-edit" style="font-size:0.65rem; color:#cca43b;"></i> #${item.id}
            </button>
            <button type="button" 
                    onclick="executeAdminItemDeletionPipeline(event, ${item.id}, '${safeTitle}')" 
                    style="position: absolute; top: 0px; right: 0px; z-index: 10 !important; display: inline-flex !important; align-items: center; justify-content: center; width: 32px; height: 32px; padding: 6px 14px; background: #ffffff; color: #d9383a; border: 2px solid #d9383a; border-radius: 6px; font-size: 0.75rem; box-shadow: 0 4px 12px rgba(217,56,58,0.15); cursor: pointer; transition: all 0.2s; outline:none;"
                    onmouseover="this.style.background='#d9383a'; this.style.color='#ffffff';"
                    onmouseout="this.style.background='#ffffff'; this.style.color='#d9383a';">
                <i class="fas fa-trash-alt"></i>
            </button>
        ` : '';
        return `
            <div style="background: #ffffff; border: 1px solid #e8e8ef; border-radius: 6px; padding: 12px; position: relative; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s ease; box-shadow: 0 2px 6px rgba(0,0,0,0.01); opacity: ${isClaimed ? '0.65' : '1'};">
                
                ${adminEditInlineControlMarkup}

                <div style="width: 100%; aspect-ratio: 1/1; border-radius: 4px; overflow: hidden; background: #fafafa; margin-bottom: 10px; position: relative;">
                    <img src="${item.image}" style="width: 100%; height: 100%; object-fit: cover;">
                    ${isClaimed ? `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(32,44,85,0.4); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.65rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">🔒 Sold Out</div>` : ''}
                </div>
                <div style="text-align: left; margin-bottom: 8px;">
                    <h4 style="margin: 0; font-size: 0.78rem; font-weight: 600; color: #111116; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</h4>
                    <p style="margin: 2px 0 0 0; font-size: 0.85rem; font-weight: 700; color: #202c55;">₹350</p>
                </div>
                ${isClaimed ? `
                    <button disabled style="width: 100%; padding: 6px 0; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; background: #e1e1e6; color: #8e8e9f; border: none; border-radius: 3px; cursor: not-allowed;">Sold Out</button>
                ` : `
                    <button onclick="addToCartEngine(${item.id}, '${safeTitle}')" style="width: 100%; padding: 6px 0; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background: #202c55; color: #fff; border: none; border-radius: 3px; cursor: pointer; transition: all 0.2s;">Add to Bag</button>
                `}
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
window.addEventListener('click', (e) => {
    const overlay = document.getElementById('faqSystemModalOverlay');
    if (e.target === overlay) {
        closeFaqSystemModalOverlay();
    }
});

// =========================================================================
// ANGEL JEWELLERY — STYLE CLUSTER MODAL HUB (DYNAMIC VAULT SELECTION)
// =========================================================================
function selectStyleClusterFilter(clusterKeyword) {
    const modal = document.getElementById('stylePortfolioModalShield');
    const grid = document.getElementById('portfolioModalProductsGrid');
    const mainTitle = document.getElementById('portfolioModalMainTitle');
    const miniTag = document.getElementById('portfolioMiniTag');

    if (!modal || !grid || !productDatabase || productDatabase.length === 0) return;

    const cleanKeyword = String(clusterKeyword).trim().toLowerCase();

    // ➔ THE CRITICAL FIX: Filters your true database using your brand new 'style' field values
    const matchedStylePool = productDatabase.filter(p => p && String(p.style).trim().toLowerCase() === cleanKeyword);

    // Dynamic Title Header layouts matching your keyword hooks
    let descriptiveTitle = `${clusterKeyword} Showcase`;
    if (cleanKeyword === 'cz') descriptiveTitle = "CZ & Silver Polish Curation";
    if (cleanKeyword === 'antique') descriptiveTitle = "Antique Temple Masterpieces";
    if (cleanKeyword === 'handcrafted') descriptiveTitle = "Heritage Devotion Editions";
    if (cleanKeyword === 'navratna') descriptiveTitle = "Navratna & Multi-Stone Strings";

    if (mainTitle) mainTitle.innerText = descriptiveTitle;
    if (miniTag) miniTag.innerText = `Angel Jewellery • ${clusterKeyword}`;

    if (matchedStylePool.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 10px; color: #777; font-weight: 500;">
                <i class="fas fa-gem" style="font-size: 1.5rem; color: #e8e8ef; display: block; margin-bottom: 10px;"></i>
                New masterpieces are currently being curated for this style segment.
            </div>`;
    } else {
        grid.innerHTML = matchedStylePool.map(product => {
            const isSoldOut = product.badge && product.badge.toLowerCase() === 'sold out';
            const displayPrice = product.price > 0 ? `₹${product.price.toLocaleString('en-IN')}` : 'Price on Request';
            const safeTitleString = product.title.replace(/'/g, "\\'");

            return `
                <div style="background: #ffffff; border: 1px solid #e8e8ef; border-radius: 6px; padding: 12px; position: relative; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(0,0,0,0.01); text-align: center; box-sizing: border-box;">
                    <div onclick="closeStylePortfolioModal(); setTimeout(() => openQuickViewShield(${product.id}), 200);" style="width: 100%; aspect-ratio: 1/1; border-radius: 4px; overflow: hidden; background: #fafafa; margin-bottom: 10px; position: relative; cursor: pointer;">
                        <img src="${product.image}" style="width: 100%; height: 100%; object-fit: cover;">
                        ${isSoldOut ? `<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(32,44,85,0.4); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 0.65rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">🔒 Sold Out</div>` : ''}
                    </div>
                    <div style="margin-bottom: 8px;">
                        <h4 style="margin: 0; font-size: 0.78rem; font-weight: 600; color: #111116; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: 'Montserrat';">${product.title}</h4>
                        <p style="margin: 2px 0 0 0; font-size: 0.85rem; font-weight: 700; color: #202c55; font-family: 'Montserrat';">${displayPrice}</p>
                    </div>
                    <button class="btn-order-wa" ${isSoldOut ? 'disabled' : ''} onclick="addToCartEngine(${product.id}); triggerCartNotification('${safeTitleString}');" style="width: 100%; padding: 8px 0; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background: #202c55; color: #fff; border: none; border-radius: 4px; cursor: ${isSoldOut ? 'not-allowed' : 'pointer'}; font-family: 'Montserrat'; transition: all 0.2s;">
                        ${isSoldOut ? 'Restocking' : 'Add to Bag'}
                    </button>
                </div>
            `;
        }).join('');
    }

    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; 
    
    const bodyScrollTrack = document.getElementById('portfolioModalScrollBody');
    if (bodyScrollTrack) bodyScrollTrack.scrollTop = 0;
}

function closeStylePortfolioModal() {
    const modal = document.getElementById('stylePortfolioModalShield');
    if (modal) modal.style.display = "none";
    document.body.style.overflow = ""; 
}

function exportCurrentAdminOrdersToCSV() {
    // Target the same filtered data array currently being displayed
    if (!adminOrdersCache || adminOrdersCache.length === 0) {
        alert("No transaction rows available to export.");
        return;
    }
    
    // Create the spreadsheet header structure
    const csvHeaders = ["Payment Reference ID", "Client Name", "Phone No", "Delivery Address", "Items Purchased", "Total Bill Amt", "Status", "Date Matrix"];
    
    const csvRows = [csvHeaders.join(",")];
    
    adminOrdersCache.forEach(order => {
        const itemsCleaned = `"${(order.order_items || '').replace(/"/g, '""')}"`;
        const addressCleaned = `"${(order.address || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
        
        const rowData = [
            order.payment_id || 'N/A',
            `"${(order.customer_name || 'Anonymous').replace(/"/g, '""')}"`,
            order.phone || 'N/A',
            addressCleaned,
            itemsCleaned,
            order.total_amount || 0,
            order.status || 'Paid',
            `"${order.Date || 'N/A'}"`
        ];
        csvRows.push(rowData.join(","));
    });
    
    // Trigger download sequence seamlessly via standard Blob architecture
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", `Angel_Jewellery_Orders_Ledger_${new Date().toLocaleDateString('en-IN')}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
}

// =========================================================================
// 💎 ANGEL JEWELLERY — FLASH VAULT PAGINATION NAVIGATION CORE ENGINE (FIXED)
// =========================================================================
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
async function executeAdminOrderRefundPipeline(event, databaseRowId) {
    if (event) event.preventDefault();

    const doubleCheck = confirm("Mark Refund Completed?\nThis updates status metrics into your final tracking profiles.");
    if (!doubleCheck) return;

    const actionBtn = event.currentTarget;
    actionBtn.disabled = true;
    actionBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`;

    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;
    const patchTargetUrl = `${sbUrl}/rest/v1/Orders?id=eq.${databaseRowId}`;

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
                status: 'Refunded' // Updates the transaction value to your clean completion state
            })
        });

        if (!response.ok) throw new Error(`Database rejected status transition code: ${response.status}`);
        
        alert("✨ Status set successfully! Transaction row marked as Refunded.");
        
        // Refresh local cache matrices and redraw panel cards view row grids instantly
        if (typeof openAdminMasterConsole === 'function') {
            await openAdminMasterConsole();
        }

    } catch (err) {
        console.error("Fulfillment adjustment trace error:", err);
        alert("Sync interrupted: Unable to modify server rows.");
        actionBtn.disabled = false;
        actionBtn.innerHTML = `<i class="fas fa-hand-holding-usd"></i> Processed Refund`;
    }
}
// =========================================================================
// SUPABASE SECURE CHANNEL — REVERSE CANCELLATION & FLIP STATUS BACK TO ORDERED
// =========================================================================
async function executeAdminReverseCancellationPipeline(event, databaseRowId) {
    if (event) event.preventDefault();

    const doubleCheck = confirm("⚠️ Reverse Cancellation Confirmation:\nAre you sure you want to move this order back to active status?\n\nThis will wipe out stored cancel reasons and PhonePe details.");
    if (!doubleCheck) return;

    const reverseBtn = event.currentTarget;
    reverseBtn.disabled = true;
    reverseBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Reversing...`;

    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;
    const patchTargetUrl = `${sbUrl}/rest/v1/Orders?id=eq.${databaseRowId}`;

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
                status: 'Paid',          // Returns status cleanly back to the active order pool
                cancel_reason: null,     // Wipes cancel reason column clear
                refund_phonepe: null     // Wipes phonepe entry column clear
            })
        });

        if (!response.ok) throw new Error(`Database rejected operation update: ${response.status}`);
        
        alert("✨ Order restored successfully! Row shifted back to active Pending fulfillment queue.");
        
        // Refresh local master dashboard arrays and redraw layouts instantly
        if (typeof openAdminMasterConsole === 'function') {
            await openAdminMasterConsole();
        }

    } catch (err) {
        console.error("Reversal database adjustment execution failure caught:", err);
        alert("Sync Error: Unable to re-route tracking metrics. Check your network link.");
        reverseBtn.disabled = false;
        reverseBtn.innerHTML = `<i class="fas fa-undo-alt"></i> Move Back to Ordered`;
    }
}

// =========================================================================
// ANGEL JEWELLERY GLOBAL SHIPPING METRICS CONFIGURATION ENGINE
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