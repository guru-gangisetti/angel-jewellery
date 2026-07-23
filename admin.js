// =========================================================================
// ANGEL JEWELLERY — ADMIN.JS
// Loaded exclusively by admin.html, a completely separate page from the
// customer storefront (index.html).
// =========================================================================

let adminSessionAccessToken = null;
let isAdminAuthenticated = false;

function getCurrentAdminAccessToken() {
    return adminSessionAccessToken;
}

async function attemptAdminLogin(event) {
    if (event) event.preventDefault();

    const emailInput = document.getElementById('adminLoginEmail');
    const passwordInput = document.getElementById('adminLoginPassword');
    const errorMsg = document.getElementById('adminLoginError');
    const submitBtn = document.getElementById('adminLoginSubmitBtn');

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (errorMsg) errorMsg.style.display = 'none';

    if (!email || !password) {
        if (errorMsg) { errorMsg.textContent = 'Please enter both email and password.'; errorMsg.style.display = 'block'; }
        return;
    }

    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = 'Signing in...'; }

    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;

    try {
        const response = await fetch(`${sbUrl}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: { 'apikey': sbKey, 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error_description || data.msg || 'Invalid email or password.');
        }

        adminSessionAccessToken = data.access_token;
        isAdminAuthenticated = true;

        try {
            sessionStorage.setItem('angelAdminSession', JSON.stringify({
                access_token: data.access_token,
                refresh_token: data.refresh_token,
                expires_at: Date.now() + (data.expires_in * 1000)
            }));
        } catch (storageErr) {
            console.error('Could not persist admin session — you will need to log in again after a refresh:', storageErr);
        }

        await revealAdminDashboardAfterLogin();

    } catch (err) {
        console.error('Admin login failed:', err);
        if (errorMsg) { errorMsg.textContent = err.message || 'Login failed. Please try again.'; errorMsg.style.display = 'block'; }
    } finally {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = 'Sign In'; }
    }
}

function attemptRestoreAdminSession() {
    try {
        const stored = sessionStorage.getItem('angelAdminSession');
        if (!stored) return false;
        const session = JSON.parse(stored);
        if (!session.access_token || Date.now() >= session.expires_at) {
            sessionStorage.removeItem('angelAdminSession');
            return false;
        }
        adminSessionAccessToken = session.access_token;
        isAdminAuthenticated = true;
        return true;
    } catch (err) {
        return false;
    }
}

async function revealAdminDashboardAfterLogin() {
    const loginScreen = document.getElementById('adminLoginScreen');
    const dashboardShell = document.getElementById('adminDashboardShell');
    if (loginScreen) loginScreen.style.display = 'none';
    if (dashboardShell) dashboardShell.style.display = 'block';

    await loadProductDatabaseEngine();
    await loadLiveCouponDatabaseEngine();
    await synchronizeLiveStorefrontInventory();
    if (typeof loadLiveCarouselDatabaseEngine === 'function') {
        await loadLiveCarouselDatabaseEngine();
    }

    await updateAdminDashboardKpiCards();

    if (typeof runAdminOnlyPageSetup === 'function') {
        runAdminOnlyPageSetup();
    }
}

async function updateAdminDashboardKpiCards() {
    const sbUrl = ANGEL_STORE_CONFIG?.DATABASE?.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG?.DATABASE?.SUPABASE_ANON_KEY;

    if ((!adminOrdersCache || adminOrdersCache.length === 0) && sbUrl && sbKey) {
        try {
            const res = await fetch(`${sbUrl}/rest/v1/Orders?select=*&order=created_at.desc`, {
                method: 'GET',
                headers: {
                    'apikey': sbKey,
                    'Authorization': `Bearer ${getCurrentAdminAccessToken()}`,
                    'Content-Type': 'application/json'
                }
            });
            if (res.ok) {
                const orders = await res.json();
                adminOrdersCache = orders.map(order => ({
                    id: order.id,
                    created_at: order.created_at,
                    status: order.status || 'Paid',
                    total_amount: order.total_amount
                }));
            }
        } catch (err) {
            console.error('Could not fetch orders for KPI metrics:', err);
        }
    }

    const todayStr = new Date().toDateString();
    const ordersTodayCount = (adminOrdersCache || []).filter(o => {
        return o.created_at && new Date(o.created_at).toDateString() === todayStr;
    }).length;

    const elOrdersToday = document.getElementById('dashKpiOrdersToday');
    if (elOrdersToday) elOrdersToday.innerText = ordersTodayCount;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthRevenueSum = (adminOrdersCache || []).reduce((sum, o) => {
        if (!o.created_at) return sum;
        const d = new Date(o.created_at);
        const isThisMonth = d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        const statusStr = String(o.status || '').toLowerCase();
        const isValidSale = statusStr !== 'cancelled' && statusStr !== 'refunded';

        if (isThisMonth && isValidSale) {
            const rawAmt = String(o.total_amount || '0').replace(/[^0-9.]/g, '');
            return sum + (parseFloat(rawAmt) || 0);
        }
        return sum;
    }, 0);

    const elRevenue = document.getElementById('dashKpiMonthRevenue');
    if (elRevenue) elRevenue.innerText = formatCurrency(monthRevenueSum);

    const flattenedRows = typeof getFlattenedInventoryRows === 'function' ? getFlattenedInventoryRows() : [];
    const lowOrOutStockCount = flattenedRows.filter(r => r.stock <= 2).length;

    const elTotalSkus = document.getElementById('dashKpiTotalSkus');
    const elLowStock = document.getElementById('dashKpiLowStockCount');

    if (elTotalSkus) elTotalSkus.innerText = flattenedRows.length;
    if (elLowStock) {
        if (lowOrOutStockCount > 0) {
            elLowStock.innerHTML = `<i class="fas fa-triangle-exclamation"></i> ${lowOrOutStockCount} low or out of stock`;
            elLowStock.style.color = '#d9383a';
        } else {
            elLowStock.innerHTML = `<i class="fas fa-check-circle"></i> Stock levels healthy`;
            elLowStock.style.color = '#2a7b6a';
        }
    }

    const elActivePromos = document.getElementById('dashKpiActivePromos');
    if (elActivePromos) elActivePromos.innerText = (couponRegistryCache || []).length;
}

function adminLogout() {
    adminSessionAccessToken = null;
    isAdminAuthenticated = false;
    try { sessionStorage.removeItem('angelAdminSession'); } catch (e) { /* ignore */ }
    location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    if (attemptRestoreAdminSession()) {
        revealAdminDashboardAfterLogin();
    }
});

let productDatabase = [];
let MASTER_LIVE_INVENTORY_CACHE = {};
let carouselRegistryCache = [];
let couponRegistryCache = [];

function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

async function loadProductDatabaseEngine() {
    try {
        const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
        const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;
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

        productDatabase = databasePayload.map(item => {
            const parsedUniqueId = parseInt(item.id);
            const variations = item.product_variants || [];
            const defaultVariant = variations.length > 0 ? variations[0] : null;
            
            const verifiedPrice = defaultVariant ? parseFloat(defaultVariant.price) : (parseFloat(item.price) || 0);
            const verifiedImage = defaultVariant ? (defaultVariant.image_url || defaultVariant.image) : (item.image || 'assets/placeholder.png');
            const liveStockLevel = defaultVariant ? parseInt(defaultVariant.stock) : (parseInt(item.stock) ?? 0);
            const updatedStatus = liveStockLevel <= 0 ? "sold" : String(item.status || 'available').trim().toLowerCase();

            MASTER_LIVE_INVENTORY_CACHE[parsedUniqueId] = {
                stock: liveStockLevel,
                status: updatedStatus,
                variants: variations
            };

            return {
                id: parsedUniqueId,
                title: item.title,
                price: verifiedPrice,
                category: item.category || 'Luxury Collection',
                image: verifiedImage,
                badge: updatedStatus === "sold" ? "Sold Out" : (item.badge || ''),
                description: item.description || '',
                style: item.style ? String(item.style).trim().toLowerCase() : '',
                created_at: item.created_at || null,
                product_variants: variations
            };
        });

    } catch (error) {
        console.error('Critical Supabase catalog extraction breakdown caught:', error);
    }
}

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
        console.error('Could not log stock history entry:', err);
    }
}

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
    } catch (err) {
        console.error("❌ Failed to synchronize active coupon registry layers:", err);
    }
}

async function synchronizeLiveStorefrontInventory() {
    const sbUrl = ANGEL_STORE_CONFIG?.DATABASE?.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG?.DATABASE?.SUPABASE_ANON_KEY;
    if (!sbUrl || !sbKey) return;

    try {
        const queryUrl = `${sbUrl}/rest/v1/products?select=id,status,product_variants(id,sku,color_name,color_hex,price,stock,image_url,status)`;
        const response = await fetch(queryUrl, {
            method: 'GET',
            headers: { 'apikey': sbKey, 'Authorization': `Bearer ${sbKey}`, 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error(`Supabase returned status code: ${response.status}`);
        const productsWithVariants = await response.json();
        
        productsWithVariants.forEach(product => {
            const cleanProductId = parseInt(product.id);
            if (!isNaN(cleanProductId)) {
                const variants = product.product_variants || [];
                const defaultVariant = variants.length > 0 ? variants[0] : null;
                const liveStockLevel = defaultVariant ? (parseInt(defaultVariant.stock) || 0) : 0;

                MASTER_LIVE_INVENTORY_CACHE[cleanProductId] = {
                    status: String(product.status || '').trim().toLowerCase(),
                    stock: liveStockLevel,
                    variants: variants
                };
                
                const localMatch = productDatabase.find(p => p.id === cleanProductId);
                if (localMatch) {
                    localMatch.product_variants = variants;
                }
            }
        });
        
        if (!productDatabase || productDatabase.length === 0) {
            await loadProductDatabaseEngine();
        }
    } catch (error) {
        console.error("❌ Inventory download sync failed:", error);
    }
}

let adminOrdersCache = [];       
let currentAdminActiveTab = "pending";
let adminConsoleSearchQueryString = "";

function setProductVariantMode(hasVariants) {
    const yesBtn = document.getElementById('variantModeToggleYes');
    const noBtn = document.getElementById('variantModeToggleNo');
    const variantWrapper = document.getElementById('variantSectionWrapper');
    const priceStockWrapper = document.getElementById('singleItemPriceStockWrapper');
    const imageWrapper = document.getElementById('singleItemImageWrapper');
    const variantsContainer = document.getElementById('adminFormDynamicVariantsContainer');
    const priceInput = document.getElementById('formProductPrice');
    const stockInput = document.getElementById('formProductStock');
    if (!yesBtn || !noBtn || !variantWrapper || !priceStockWrapper) return;

    if (hasVariants) {
        yesBtn.classList.add('active');
        noBtn.classList.remove('active');
        variantWrapper.style.display = 'block';
        priceStockWrapper.style.display = 'none';
        if (imageWrapper) imageWrapper.style.display = 'none';
        if (priceInput) priceInput.required = false;
        if (stockInput) stockInput.required = false;

        if (variantsContainer && variantsContainer.children.length === 0) {
            appendNewVariantRowToAdminForm();
            const firstRow = variantsContainer.children[0];
            if (firstRow) {
                const masterPrice = priceInput ? priceInput.value : '';
                const masterStock = stockInput ? stockInput.value : '';
                const masterImage = document.getElementById('formProductImage').value;
                if (masterPrice) { const f = firstRow.querySelector('.v-price'); if (f) f.value = masterPrice; }
                if (masterStock) { const f = firstRow.querySelector('.v-stock'); if (f) f.value = masterStock; }
                if (masterImage) {
                    const f = firstRow.querySelector('.v-img');
                    if (f) { f.value = masterImage; refreshVariantImagePreview(f); }
                }
            }
        }
    } else {
        noBtn.classList.add('active');
        yesBtn.classList.remove('active');
        variantWrapper.style.display = 'none';
        priceStockWrapper.style.display = 'grid';
        if (imageWrapper) imageWrapper.style.display = 'block';
        if (priceInput) priceInput.required = true;
        if (stockInput) stockInput.required = true;

        if (variantsContainer && variantsContainer.children.length > 0) {
            const firstRow = variantsContainer.children[0];
            const vPrice = firstRow.querySelector('.v-price');
            const vStock = firstRow.querySelector('.v-stock');
            const vImg = firstRow.querySelector('.v-img');
            if (vPrice && vPrice.value && priceInput) priceInput.value = vPrice.value;
            if (vStock && vStock.value && stockInput) stockInput.value = vStock.value;
            if (vImg && vImg.value) {
                document.getElementById('formProductImage').value = vImg.value;
                const previewFrame = document.getElementById('adminFormImagePreviewFrame');
                const previewVisual = document.getElementById('adminFormImagePreviewVisual');
                if (previewFrame && previewVisual) {
                    previewVisual.src = vImg.value;
                    previewFrame.style.display = 'block';
                }
            }
        }
        if (variantsContainer) variantsContainer.innerHTML = '';
    }
}

function openAdminFormModalForCreation(event) {
    if (event) event.preventDefault(); 
    
    const formNode = document.getElementById('masterJewelryAdminForm');
    if (formNode) formNode.reset();

    const actionId = document.getElementById('formActionProductId');
    if (actionId) actionId.value = "";

    const productIdInput = document.getElementById('formProductId');
    if (productIdInput) productIdInput.disabled = false;
    
    const previewFrame = document.getElementById('adminFormImagePreviewFrame');
    if (previewFrame) previewFrame.style.display = "none";
    
    const variantRowsContainer = document.getElementById('adminFormDynamicVariantsContainer');
    if (variantRowsContainer) variantRowsContainer.innerHTML = ""; 

    setProductVariantMode(false);

    const titleEl = document.getElementById('adminFormModalTitle');
    if (titleEl) titleEl.innerHTML = `<i class="fas fa-plus-circle" style="color:#ff1493;"></i> Add New Item`;

    const btnEl = document.getElementById('formSubmitActionBtn');
    if (btnEl) btnEl.innerText = "Add New Item";

    const modal = document.getElementById('adminPieceVaultModal');
    if (modal) modal.style.display = 'flex';
}

function openAdminFormModalForEditing(event, id) {
    if (event) event.stopPropagation();
    
    const product = productDatabase.find(p => p.id === parseInt(id));
    if (!product) return;

    const filePicker = document.getElementById('formProductImageFilePicker');
    if (filePicker) filePicker.value = "";

    document.getElementById('formActionProductId').value = product.id;
    document.getElementById('formProductId').value = product.id;
    document.getElementById('formProductId').disabled = true;
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

    const previewFrame = document.getElementById('adminFormImagePreviewFrame');
    const previewVisual = document.getElementById('adminFormImagePreviewVisual');
    if (previewFrame && previewVisual && product.image) {
        previewVisual.src = product.image;
        previewFrame.style.display = "block";
    }

    document.getElementById('adminFormModalTitle').innerHTML = `<i class="fas fa-edit" style="color:#ffd700;"></i> Edit Product #${product.id}`;
    document.getElementById('formSubmitActionBtn').innerText = "Update";
    document.getElementById('adminPieceVaultModal').style.display = 'flex';

    const existingVariants = product.product_variants || [];
    let hasRealVariants = false;
    if (existingVariants.length > 1) {
        hasRealVariants = true;
    } else if (existingVariants.length === 1) {
        const onlyColorName = String(existingVariants[0].color_name || '').toLowerCase().trim();
        hasRealVariants = onlyColorName !== '' && onlyColorName !== 'standard' && onlyColorName !== 'default';
    }

    const variantRowsContainer = document.getElementById('adminFormDynamicVariantsContainer');
    if (variantRowsContainer) variantRowsContainer.innerHTML = "";

    if (hasRealVariants && variantRowsContainer) {
        existingVariants.forEach(variant => {
            appendNewVariantRowToAdminForm(variant);
        });
    }

    setProductVariantMode(hasRealVariants);
}

function closeAdminFormVaultModal() {
    document.getElementById('adminPieceVaultModal').style.display = 'none';
}

let inventorySelectedVariantIds = new Set();

function openInventoryDashboard(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('inventoryDashboardModal');
    if (modal) modal.style.display = 'flex';
    populateInventoryCategoryFilterOptions();
    renderInventoryTable();
}

function closeInventoryDashboard() {
    const modal = document.getElementById('inventoryDashboardModal');
    if (modal) modal.style.display = 'none';
}

function getFlattenedInventoryRows() {
    const rows = [];
    (productDatabase || []).forEach(product => {
        const variants = product.product_variants || [];
        variants.forEach(variant => {
            const liveCacheEntry = MASTER_LIVE_INVENTORY_CACHE[product.id];
            const liveVariantMatch = liveCacheEntry?.variants?.find(v => v.id === variant.id);
            const resolvedStock = liveVariantMatch ? parseInt(liveVariantMatch.stock) : parseInt(variant.stock);
            rows.push({
                variantId: variant.id,
                productId: product.id,
                productTitle: product.title || 'Untitled',
                colorName: variant.color_name || 'Standard',
                sku: variant.sku || '',
                category: product.category || '',
                price: variant.price,
                stock: Number.isFinite(resolvedStock) ? resolvedStock : 0,
                image: variant.image_url || product.image
            });
        });
    });
    return rows;
}

function populateInventoryCategoryFilterOptions() {
    const select = document.getElementById('inventoryCategoryFilter');
    if (!select) return;
    const currentValue = select.value;
    const categories = [...new Set((productDatabase || []).map(p => p.category).filter(Boolean))].sort();
    select.innerHTML = `<option value="">All Categories</option>` + categories.map(c => `<option value="${c}">${c}</option>`).join('');
    select.value = currentValue;
}

function renderInventorySummaryCards(allRows) {
    const container = document.getElementById('inventorySummaryCards');
    if (!container) return;

    const totalSkus = allRows.length;
    const totalUnits = allRows.reduce((sum, r) => sum + r.stock, 0);
    const outOfStockCount = allRows.filter(r => r.stock <= 0).length;
    const lowStockCount = allRows.filter(r => r.stock > 0 && r.stock <= 2).length;

    container.innerHTML = `
        <div class="inventory-summary-card">
            <span class="inventory-summary-value">${totalSkus}</span>
            <span class="inventory-summary-label">Total SKUs</span>
        </div>
        <div class="inventory-summary-card">
            <span class="inventory-summary-value">${totalUnits}</span>
            <span class="inventory-summary-label">Units In Stock</span>
        </div>
        <div class="inventory-summary-card inventory-summary-card--warning">
            <span class="inventory-summary-value">${lowStockCount}</span>
            <span class="inventory-summary-label">Low Stock</span>
        </div>
        <div class="inventory-summary-card inventory-summary-card--danger">
            <span class="inventory-summary-value">${outOfStockCount}</span>
            <span class="inventory-summary-label">Out of Stock</span>
        </div>
    `;
}

function renderInventoryTable() {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;

    const allRows = getFlattenedInventoryRows();
    renderInventorySummaryCards(allRows);

    let rows = allRows;
    const searchTerm = (document.getElementById('inventorySearchInput')?.value || '').toLowerCase().trim();
    const categoryFilter = document.getElementById('inventoryCategoryFilter')?.value || '';
    const stockFilter = document.getElementById('inventoryStockFilter')?.value || '';

    if (searchTerm) {
        rows = rows.filter(r => r.productTitle.toLowerCase().includes(searchTerm) || (r.sku || '').toLowerCase().includes(searchTerm));
    }
    if (categoryFilter) rows = rows.filter(r => r.category === categoryFilter);
    if (stockFilter === 'out') rows = rows.filter(r => r.stock <= 0);
    else if (stockFilter === 'low') rows = rows.filter(r => r.stock > 0 && r.stock <= 2);
    else if (stockFilter === 'healthy') rows = rows.filter(r => r.stock > 2);

    rows = rows.slice().sort((a, b) => a.stock - b.stock);

    if (rows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px; color:#8a8da0;">No matching items.</td></tr>`;
        return;
    }

    tbody.innerHTML = rows.map(r => {
        const statusInfo = r.stock <= 0
            ? { label: 'Out of Stock', className: 'inventory-status-out' }
            : (r.stock <= 2 ? { label: 'Low Stock', className: 'inventory-status-low' } : { label: 'In Stock', className: 'inventory-status-healthy' });

        const safeLabel = `${r.productTitle} - ${r.colorName}`.replace(/'/g, "\\'");

        return `
            <tr data-variant-id="${r.variantId}">
                <td class="inventory-td-checkbox"><input type="checkbox" class="inventory-row-checkbox" value="${r.variantId}" ${inventorySelectedVariantIds.has(r.variantId) ? 'checked' : ''} onchange="toggleInventoryRowSelection(${r.variantId}, this.checked)"></td>
                <td class="inventory-td-item">
                    <img src="${r.image || 'assets/placeholder.png'}" loading="lazy" decoding="async" onerror="this.src='assets/placeholder.png'">
                    <span>${r.productTitle}</span>
                </td>
                <td data-label="Color">${r.colorName}</td>
                <td class="inventory-td-sku" data-label="SKU">${r.sku || '—'}</td>
                <td data-label="Category">${r.category || '—'}</td>
                <td data-label="Price">${formatCurrency(parseFloat(r.price) || 0)}</td>
                <td data-label="Stock"><input type="number" class="inventory-stock-input" value="${r.stock}" min="0" onchange="handleInventoryStockInlineEdit(${r.variantId}, ${r.productId}, this)"></td>
                <td data-label="Status"><span class="inventory-status-pill ${statusInfo.className}">${statusInfo.label}</span></td>
                <td data-label="History"><button type="button" class="inventory-history-btn" onclick="openStockHistoryModal(${r.variantId}, '${safeLabel}')" title="View history"><i class="fas fa-clock-rotate-left"></i></button></td>
            </tr>
        `;
    }).join('');

    updateInventoryBulkActionsBarVisibility();
}

function toggleInventoryRowSelection(variantId, isChecked) {
    if (isChecked) inventorySelectedVariantIds.add(variantId);
    else inventorySelectedVariantIds.delete(variantId);
    updateInventoryBulkActionsBarVisibility();
}

function toggleSelectAllInventoryRows(checkbox) {
    document.querySelectorAll('.inventory-row-checkbox').forEach(cb => {
        cb.checked = checkbox.checked;
        const variantId = parseInt(cb.value);
        if (checkbox.checked) inventorySelectedVariantIds.add(variantId);
        else inventorySelectedVariantIds.delete(variantId);
    });
    updateInventoryBulkActionsBarVisibility();
}

function clearInventorySelection() {
    inventorySelectedVariantIds.clear();
    renderInventoryTable();
}

function updateInventoryBulkActionsBarVisibility() {
    const bar = document.getElementById('inventoryBulkActionsBar');
    const countLabel = document.getElementById('inventoryBulkSelectedCount');
    if (!bar) return;
    if (inventorySelectedVariantIds.size > 0) {
        bar.style.display = 'flex';
        if (countLabel) countLabel.innerText = `${inventorySelectedVariantIds.size} selected`;
    } else {
        bar.style.display = 'none';
    }
}

async function handleInventoryStockInlineEdit(variantId, productId, inputEl) {
    const newStock = parseInt(inputEl.value);
    if (!Number.isFinite(newStock) || newStock < 0) {
        alert('Please enter a valid stock number.');
        return;
    }

    const rowData = getFlattenedInventoryRows().find(r => r.variantId === variantId);
    const previousStock = rowData ? rowData.stock : null;

    const sbUrl = ANGEL_STORE_CONFIG?.DATABASE?.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;

    try {
        const response = await fetch(`${sbUrl}/rest/v1/product_variants?id=eq.${variantId}`, {
            method: 'PATCH',
            headers: { 'apikey': sbKey, 'Authorization': `Bearer ${getCurrentAdminAccessToken()}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock: newStock, status: newStock <= 0 ? 'sold' : 'active' })
        });
        if (!response.ok) throw new Error(`Update failed: ${response.status}`);

        if (previousStock !== null && previousStock !== newStock && rowData) {
            await logStockHistoryEntry(variantId, productId, rowData.productTitle, rowData.colorName, 'manual_edit', previousStock, newStock);
        }

        await synchronizeLiveStorefrontInventory();
        renderInventoryTable();
    } catch (err) {
        console.error('Stock update failed:', err);
        alert('Could not update stock. Please check your connection and try again.');
    }
}

async function applyBulkRestock() {
    const valueInput = document.getElementById('inventoryBulkStockValue');
    const newStock = parseInt(valueInput?.value);
    if (!Number.isFinite(newStock) || newStock < 0) {
        alert('Enter a valid stock number to apply to the selected items.');
        return;
    }
    if (inventorySelectedVariantIds.size === 0) return;
    if (!confirm(`Set stock to ${newStock} for ${inventorySelectedVariantIds.size} selected item(s)?`)) return;

    const rows = getFlattenedInventoryRows();
    const sbUrl = ANGEL_STORE_CONFIG?.DATABASE?.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;

    for (const variantId of inventorySelectedVariantIds) {
        const rowData = rows.find(r => r.variantId === variantId);
        if (!rowData) continue;
        try {
            await fetch(`${sbUrl}/rest/v1/product_variants?id=eq.${variantId}`, {
                method: 'PATCH',
                headers: { 'apikey': sbKey, 'Authorization': `Bearer ${getCurrentAdminAccessToken()}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock: newStock, status: newStock <= 0 ? 'sold' : 'active' })
            });
            if (rowData.stock !== newStock) {
                await logStockHistoryEntry(variantId, rowData.productId, rowData.productTitle, rowData.colorName, 'bulk_update', rowData.stock, newStock);
            }
        } catch (err) {
            console.error(`Bulk restock failed for variant ${variantId}:`, err);
        }
    }

    if (valueInput) valueInput.value = '';
    inventorySelectedVariantIds.clear();
    await synchronizeLiveStorefrontInventory();
    renderInventoryTable();
}

async function applyBulkSoldOut() {
    if (inventorySelectedVariantIds.size === 0) return;
    if (!confirm(`Mark ${inventorySelectedVariantIds.size} selected item(s) as sold out (stock set to 0)?`)) return;

    const rows = getFlattenedInventoryRows();
    const sbUrl = ANGEL_STORE_CONFIG?.DATABASE?.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;

    for (const variantId of inventorySelectedVariantIds) {
        const rowData = rows.find(r => r.variantId === variantId);
        if (!rowData) continue;
        try {
            await fetch(`${sbUrl}/rest/v1/product_variants?id=eq.${variantId}`, {
                method: 'PATCH',
                headers: { 'apikey': sbKey, 'Authorization': `Bearer ${getCurrentAdminAccessToken()}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock: 0, status: 'sold' })
            });
            if (rowData.stock !== 0) {
                await logStockHistoryEntry(variantId, rowData.productId, rowData.productTitle, rowData.colorName, 'bulk_update', rowData.stock, 0);
            }
        } catch (err) {
            console.error(`Bulk sold-out failed for variant ${variantId}:`, err);
        }
    }

    inventorySelectedVariantIds.clear();
    await synchronizeLiveStorefrontInventory();
    renderInventoryTable();
}

function exportInventoryToCsv() {
    const rows = getFlattenedInventoryRows();
    const header = ['Product', 'Color', 'SKU', 'Category', 'Price', 'Stock', 'Status'];
    const csvLines = [header.join(',')];

    rows.forEach(r => {
        const status = r.stock <= 0 ? 'Out of Stock' : (r.stock <= 2 ? 'Low Stock' : 'In Stock');
        const escapedTitle = `"${(r.productTitle || '').replace(/"/g, '""')}"`;
        csvLines.push([escapedTitle, r.colorName, r.sku, r.category, r.price || 0, r.stock, status].join(','));
    });

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `angel-jewellery-inventory-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

async function openStockHistoryModal(variantId, labelText) {
    const modal = document.getElementById('stockHistoryModal');
    const titleEl = document.getElementById('stockHistoryModalTitle');
    const listEl = document.getElementById('stockHistoryList');
    if (!modal || !listEl) return;

    if (titleEl) titleEl.innerText = `Stock History — ${labelText}`;
    listEl.innerHTML = `<p style="text-align:center; padding:20px; color:#8a8da0;">Loading...</p>`;
    modal.style.display = 'flex';

    const sbUrl = ANGEL_STORE_CONFIG?.DATABASE?.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;

    try {
        const url = `${sbUrl}/rest/v1/stock_history?variant_id=eq.${variantId}&select=*&order=created_at.desc&limit=50`;
        const response = await fetch(url, {
            headers: { 'apikey': sbKey, 'Authorization': `Bearer ${getCurrentAdminAccessToken()}` }
        });
        if (!response.ok) throw new Error(`History fetch failed: ${response.status}`);

        const historyRows = await response.json();
        if (!historyRows || historyRows.length === 0) {
            listEl.innerHTML = `<p style="text-align:center; padding:20px; color:#8a8da0;">No history recorded yet for this item.</p>`;
            return;
        }

        const typeLabels = {
            sale: { label: 'Sale', icon: 'fa-cart-shopping', color: '#04693a' },
            manual_edit: { label: 'Manual Edit', icon: 'fa-pen', color: '#202c55' },
            bulk_update: { label: 'Bulk Update', icon: 'fa-layer-group', color: '#cca43b' },
            restock: { label: 'Restock', icon: 'fa-box', color: '#04693a' }
        };

        listEl.innerHTML = historyRows.map(entry => {
            const typeInfo = typeLabels[entry.change_type] || { label: entry.change_type, icon: 'fa-circle', color: '#8a8da0' };
            const changeSign = entry.change_amount > 0 ? '+' : '';
            const dateStr = new Date(entry.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            return `
                <div class="stock-history-entry">
                    <div class="stock-history-entry-icon" style="color:${typeInfo.color};"><i class="fas ${typeInfo.icon}"></i></div>
                    <div class="stock-history-entry-body">
                        <span class="stock-history-entry-type">${typeInfo.label}</span>
                        <span class="stock-history-entry-change">${entry.previous_stock} → ${entry.new_stock} (${changeSign}${entry.change_amount})</span>
                        <span class="stock-history-entry-date">${dateStr}</span>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('Could not load stock history:', err);
        listEl.innerHTML = `<p style="text-align:center; padding:20px; color:#d9383a;">Could not load history — make sure the stock_history table has been created in Supabase.</p>`;
    }
}

function closeStockHistoryModal() {
    const modal = document.getElementById('stockHistoryModal');
    if (modal) modal.style.display = 'none';
}

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
                        <td style="padding:10px; font-weight:700; color:var(--purple-primary); font-family:monospace;">${promo.code}</td>
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
                'apikey': sbKey, 'Authorization': `Bearer ${getCurrentAdminAccessToken()}`,
                'Content-Type': 'application/json', 'Prefer': 'return=minimal'
            },
            body: JSON.stringify(newPromoPayload)
        });

        if (!response.ok) throw new Error("Supabase duplicate entry or structure mismatch constraint broken.");

        alert(`✨ Successfully Generated Coupon Code: ${newPromoPayload.code}`);
        document.getElementById('adminPromoCreatorForm').reset();
        
        await loadLiveCouponDatabaseEngine(); 
        renderAdminPromoConsoleGrid();        
        
    } catch (err) {
        console.error(err);
        alert("Pipeline Sync Interrupted: Verify code name uniqueness or structural field formats.");
    } finally {
        submitBtn.disabled = false; submitBtn.innerText = originalText;
    }
}

async function executeAdminCouponPurgePipeline(event, couponId, couponCode) {
    if (event) event.stopPropagation();
    const verify = confirm(`Are you completely sure you want to permanently delete promotional key "${couponCode}"?`);
    if (!verify) return;

    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;

    try {
        const response = await fetch(`${sbUrl}/rest/v1/Coupons?id=eq.${couponId}`, {
            method: 'DELETE',
            headers: { 'apikey': sbKey, 'Authorization': `Bearer ${getCurrentAdminAccessToken()}`, 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error("Deletion execution tracking drop.");

        await loadLiveCouponDatabaseEngine();
        renderAdminPromoConsoleGrid();
        
    } catch (err) {
        console.error(err);
        alert("Unable to delete entry row from cloud workspace layer.");
    }
}

function openAdminPromoConsoleOverlay(event) {
    if (event) event.preventDefault();
    if (!isAdminAuthenticated) {
        alert("🔒 Access Denied. Please unlock the master system using the Lock icon first.");
        return;
    }
    const overlay = document.getElementById('adminPromoConsoleOverlay');
    if (overlay) {
        overlay.style.setProperty('display', 'flex', 'important');
        renderAdminPromoConsoleGrid();
    }
}

function closeAdminPromoConsoleOverlay() {
    const overlay = document.getElementById('adminPromoConsoleOverlay');
    if (overlay) overlay.style.setProperty('display', 'none', 'important');
}

function openAdminMasterConsole(event) {
    if (event) event.preventDefault();

    const adminOverlay = document.getElementById('adminMasterConsoleOverlay');
    const statusMsg = document.getElementById('adminConsoleStatus');
    const ordersContainer = document.getElementById('adminMasterOrdersContainer');
    
    if (!adminOverlay || !statusMsg || !ordersContainer) {
        console.error("Master Order Desk overlay elements missing in DOM.");
        return;
    }
    
    ordersContainer.innerHTML = ""; 
    
    // Safely reveal overlay without wiping out background/z-index rules
    adminOverlay.style.setProperty('display', 'flex', 'important');
    document.body.style.overflow = 'hidden'; // Prevents dashboard from scrolling behind modal
    
    statusMsg.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: left; padding: 10px 0; gap: 10px;">
            <i class="fas fa-spinner fa-spin" style="font-size: 1.2rem; color: var(--pink-accent);"></i>
            <span style="font-size: 0.85rem; font-weight: 600; letter-spacing: 0.5px; color: var(--purple-primary);">
                Synchronizing Live Supabase Order Matrix...
            </span>
        </div>
    `;

    const sbUrl = ANGEL_STORE_CONFIG?.DATABASE?.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG?.DATABASE?.SUPABASE_ANON_KEY;
    const token = getCurrentAdminAccessToken() || sbKey;
    const targetFetchUrl = `${sbUrl}/rest/v1/Orders?select=*&order=created_at.desc`;

    fetch(targetFetchUrl, {
        method: "GET",
        headers: {
            "apikey": sbKey,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) throw new Error(`Supabase returned connection status code: ${response.status}`);
        return response.json();
    })
    .then(supabaseOrdersArray => {
        adminOrdersCache = (supabaseOrdersArray || []).map(order => ({
            "id": order.id,
            "payment_id": order.payment_id,
            "Payment ID": order.payment_id,
            "Date": order.created_at ? new Date(order.created_at).toLocaleString('en-IN') : 'N/A',
            "created_at": order.created_at,
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
        renderSegregatedAdminOrders();
    })
    .catch(err => {
        console.error("Admin dashboard runtime drop:", err);
        statusMsg.innerText = "Unable to load orders from Supabase. Check console logs for details.";
    });
}

function closeAdminMasterConsole() {
    const adminOverlay = document.getElementById('adminMasterConsoleOverlay');
    if (adminOverlay) {
        adminOverlay.style.setProperty('display', 'none', 'important');
    }
    document.body.style.overflow = ''; // Restore page scrolling
}

let currentAdminLayoutViewMode = "cards"; 

function toggleAdminConsoleLayoutMode(targetViewMode) {
    if (currentAdminLayoutViewMode === targetViewMode) return;
    currentAdminLayoutViewMode = targetViewMode;

    const cardsBtn = document.getElementById('adminViewModeCardsBtn');
    const tableBtn = document.getElementById('adminViewModeTableBtn');

    if (!cardsBtn || !tableBtn) return;

    if (targetViewMode === 'cards') {
        cardsBtn.style.cssText = "background: var(--purple-primary, #202c55); color: #ffffff; border: none; padding: 6px 14px; font-size: 0.72rem; font-weight: 700; font-family: 'Montserrat'; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; outline: none;";
        tableBtn.style.cssText = "background: transparent; color: #8a8da0; border: none; padding: 6px 14px; font-size: 0.72rem; font-weight: 700; font-family: 'Montserrat'; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; outline: none;";
    } else {
        tableBtn.style.cssText = "background: var(--purple-primary, #202c55); color: #ffffff; border: none; padding: 6px 14px; font-size: 0.72rem; font-weight: 700; font-family: 'Montserrat'; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; outline: none;";
        cardsBtn.style.cssText = "background: transparent; color: #8a8da0; border: none; padding: 6px 14px; font-size: 0.72rem; font-weight: 700; font-family: 'Montserrat'; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; outline: none;";
    }

    renderSegregatedAdminOrders();
}

function renderTabularSpreadsheetAdminOrders(datasetArray) {
    const ordersContainer = document.getElementById('adminMasterOrdersContainer');
    if (!ordersContainer) return;

    ordersContainer.innerHTML = `
        <div class="order-table-scroller">
            <table class="order-desk-table">
                <thead>
                    <tr>
                        <th class="col-ref">Reference ID</th>
                        <th>Client Details</th>
                        <th>Items</th>
                        <th class="col-amount">Total</th>
                        <th class="col-status">Status</th>
                        <th class="col-tracking">Tracking</th>
                        <th class="col-actions">Actions</th>
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
                        const statusPillClass = isShipped ? 'order-status-pill--shipped' : 'order-status-pill--placed';

                        const itemsSummary = (order.order_items || '').split(',').map(i => i.trim()).join(' | ');

                        const clientMessage = `Hello ${ordClientName},\n\nYour Angel Jewellery order (Ref: ${ordPaymentId}) status update! ✨`;
                        const whatsappUpdateLink = `https://wa.me/${ordPhone}?text=${encodeURIComponent(clientMessage)}`;

                        const inlineShipActionHTML = !isShipped 
                            ? `<button class="table-action-mini-pill table-action-mini-pill--primary" onclick="revealCourierAllocationPanel('${ordPaymentId}')"><i class="fas fa-shipping-fast"></i> Ship</button>`
                            : `<span class="order-handed-off-label"><i class="fas fa-check-circle"></i> Handed Off</span>`;

                        const partnerCompany = order.Courier || order.courier || 'Standard Logistics';
                        const trackingWaybillNo = order['Tracking Number'] || order.tracking_number || 'N/A';
                        const tableTrackingCellHTML = isShipped 
                            ? `<div class="order-tracking-courier">${partnerCompany}</div>
                               <div class="order-tracking-waybill">${trackingWaybillNo}</div>`
                            : `<span class="order-tracking-empty">Not Shipped Yet</span>`;

                        const safeName = ordClientName.replace(/'/g, "\\'");
                        const safePhone = String(order.phone).replace(/'/g, "\\'");
                        const safeAddress = String(order.address).replace(/'/g, "\\'").replace(/\n/g, " ");

                        return `
                            <tr id="order-row-${ordPaymentId}">
                                <td class="order-td-ref">
                                    #${ordPaymentId.slice(0, 12)}...
                                    <span class="order-td-ref-date">${ordDate}</span>
                                </td>
                                <td class="order-td-client">
                                    <div class="order-td-client-name">${ordClientName}</div>
                                    <div class="order-td-client-address" title="${order.address}">${order.address}</div>
                                </td>
                                <td class="order-td-items" title="${itemsSummary}">${itemsSummary}</td>
                                <td class="order-td-amount">${ordTotalAmount}</td>
                                <td><span class="order-status-pill ${statusPillClass}">${isShipped ? 'Shipped' : 'Placed'}</span></td>
                                <td>${tableTrackingCellHTML}</td>
                                <td class="order-td-actions">
                                    <div class="order-td-actions-row">
                                        <button class="table-action-mini-pill" onclick="copyShippingLabelToClipboard('${safeName}', '${safePhone}', '${safeAddress}', this)" title="Copy Tag"><i class="far fa-copy"></i></button>
                                        <a href="${whatsappUpdateLink}" target="_blank" class="table-action-mini-pill table-action-mini-pill--chat"><i class="fab fa-whatsapp"></i> Ping</a>
                                        <div id="shipped-action-slot-${ordPaymentId}" style="display:contents;">${inlineShipActionHTML}</div>
                                    </div>

                                    <div id="courier-panel-${ordPaymentId}" class="courier-allocation-panel order-table-courier-panel">
                                        <p>Logistics Partner</p>
                                        <div class="order-table-courier-options">
                                            <label><input type="radio" name="table-courier-${ordPaymentId}" value="DTDC" checked> DTDC</label>
                                            <label><input type="radio" name="table-courier-${ordPaymentId}" value="Delhivery"> Delhivery</label>
                                            <label><input type="radio" name="table-courier-${ordPaymentId}" value="Blue Dart"> Blue Dart</label>
                                        </div>
                                        <div class="order-table-courier-input-row">
                                            <input type="text" id="tracking-input-${ordPaymentId}" placeholder="Waybill No">
                                            <button onclick="updateShippingStatus('${ordPaymentId}', this)">OK</button>
                                            <button onclick="hideCourierAllocationPanel('${ordPaymentId}')">✕</button>
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
    const cancelledBtn = document.getElementById('adminTabCancelledBtn');
    
    if (pendingBtn) pendingBtn.style.cssText = "background: #f9f9fb; color: var(--text-muted); border: 1px solid #e8e8ef; padding: 10px 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; border-radius: 4px; cursor: pointer;";
    if (shippedBtn) shippedBtn.style.cssText = "background: #f9f9fb; color: var(--text-muted); border: 1px solid #e8e8ef; padding: 10px 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; border-radius: 4px; cursor: pointer;";
    if (cancelledBtn) cancelledBtn.style.cssText = "background: #f9f9fb; color: var(--text-muted); border: 1px solid #e8e8ef; padding: 10px 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; border-radius: 4px; cursor: pointer;";
    
    if (targetTabKey === 'pending' && pendingBtn) pendingBtn.style.setProperty("background", "var(--purple-primary)", "important"), pendingBtn.style.setProperty("color", "#fff", "important");
    if (targetTabKey === 'shipped' && shippedBtn) shippedBtn.style.setProperty("background", "var(--purple-primary)", "important"), shippedBtn.style.setProperty("color", "#fff", "important");
    if (targetTabKey === 'cancelled' && cancelledBtn) cancelledBtn.style.setProperty("background", "var(--purple-primary)", "important"), cancelledBtn.style.setProperty("color", "#fff", "important");
    
    renderSegregatedAdminOrders();
}

function handleAdminConsoleSearch(queryValue) {
    adminConsoleSearchQueryString = queryValue.trim().toLowerCase();
    renderSegregatedAdminOrders();
}

function closeAdminMasterConsole() {
    const adminOverlay = document.getElementById('adminMasterConsoleOverlay');
    if (adminOverlay) {
        adminOverlay.style.cssText = "display: none !important;";
    }
}

function renderSegregatedAdminOrders() {
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

    const ordersTodayHeading = document.getElementById('analyticsOrdersToday');
    const ordersThisWeekHeading = document.getElementById('analyticsOrdersThisWeek');
    const ordersThisMonthHeading = document.getElementById('analyticsOrdersThisMonth');

    if (ordersTodayHeading || ordersThisWeekHeading || ordersThisMonthHeading) {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const dayOfWeek = now.getDay();
        const daysSinceMonday = (dayOfWeek === 0) ? 6 : dayOfWeek - 1;
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfWeek.getDate() - daysSinceMonday);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let ordersToday = 0, ordersThisWeek = 0, ordersThisMonth = 0;
        adminOrdersCache.forEach(order => {
            if (!order.created_at) return;
            const orderDate = new Date(order.created_at);
            if (isNaN(orderDate.getTime())) return;
            if (orderDate >= startOfToday) ordersToday++;
            if (orderDate >= startOfWeek) ordersThisWeek++;
            if (orderDate >= startOfMonth) ordersThisMonth++;
        });

        if (ordersTodayHeading) ordersTodayHeading.innerText = ordersToday;
        if (ordersThisWeekHeading) ordersThisWeekHeading.innerText = ordersThisWeek;
        if (ordersThisMonthHeading) ordersThisMonthHeading.innerText = ordersThisMonth;
    }

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

            const safeName = ordClientName.replace(/'/g, "\\'");
            const safePhone = ordPhone.trim();
            const safeAddress = ordAddress.replace(/'/g, "\\'").replace(/\n/g, " ");

            let badgeStyle = "background: rgba(32, 44, 85, 0.08); color: var(--purple-primary);";
            let cardAccentClass = "order-card--pending";
            if (isShipped) { badgeStyle = "background: rgba(255, 20, 147, 0.1); color: var(--pink-accent);"; cardAccentClass = "order-card--shipped"; }
            if (isCancelled) { badgeStyle = "background: rgba(217, 56, 58, 0.1); color: #d9383a;"; cardAccentClass = "order-card--cancelled"; }
            if (isRefunded) { badgeStyle = "background: rgba(42, 123, 106, 0.1); color: #2a7b6a;"; cardAccentClass = "order-card--refunded"; }

            const clientMessage = `Hello ${ordClientName},\n\nRegarding your Angel Jewellery order portfolio update...`;
            const whatsappUpdateLink = `https://wa.me/${ordPhone}?text=${encodeURIComponent(clientMessage)}`;

            const chatButtonHTML = `
                <a href="${whatsappUpdateLink}" target="_blank" class="order-action-btn order-action-btn--chat" title="WhatsApp Client">
                    <i class="fab fa-whatsapp"></i> Chat
                </a>
            `;

            let contextButtonsHTML = chatButtonHTML;

            if (!isShipped && !isCancelled && !isRefunded) {
                contextButtonsHTML = `
                    <button onclick="revealCourierAllocationPanel('${ordPaymentId}')" class="order-action-btn order-action-btn--primary">
                        <i class="fas fa-shipping-fast"></i> Ship
                    </button>
                    ${chatButtonHTML}
                `;
            } else if (isCancelled) {
                contextButtonsHTML = `
                    <button onclick="executeAdminOrderRefundPipeline(event, ${order.id})" class="order-action-btn order-action-btn--refund">
                        <i class="fas fa-hand-holding-usd"></i> Processed Refund
                    </button>
                    <button onclick="executeAdminReverseCancellationPipeline(event, ${order.id})" class="order-action-btn order-action-btn--outline">
                        <i class="fas fa-undo-alt"></i> Move Back
                    </button>
                    ${chatButtonHTML}
                `;
            } else if (isRefunded) {
                contextButtonsHTML = `
                    <button onclick="executeAdminReverseCancellationPipeline(event, ${order.id})" class="order-action-btn order-action-btn--outline">
                        <i class="fas fa-undo-alt"></i> Move Back
                    </button>
                    ${chatButtonHTML}
                `;
            }

            let cancelDetailsBlockHTML = "";
            if (isCancelled || isRefunded) {
                cancelDetailsBlockHTML = `
                    <div class="order-card-cancel-details">
                        <div><strong class="order-cancel-label">Cancellation Reason:</strong> ${order.cancel_reason || 'Not Specified'}</div>
                        <div><strong class="order-refund-label">PhonePe Refund Number:</strong> <span>+91 ${order.refund_phonepe || 'N/A'}</span></div>
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
                        <span class="order-card-txn-id">Txn ID: <strong>${ordPaymentId}</strong></span>
                        <h4>${ordClientName}</h4>
                    </div>
                    <div class="order-card-header-right">
                        <div class="order-card-date-amount">
                            <span class="order-card-date">${ordDate}</span>
                            <span class="order-card-amount">${ordTotalAmount}</span>
                        </div>
                        <span id="badge-status-${ordPaymentId}" class="order-card-status-badge" style="${badgeStyle}">
                            ${order.status || 'Paid'}
                        </span>
                    </div>
                </div>

                <div class="order-card-items">
                    <table>
                        <tbody>
                            ${inventoryRowsHTML}
                        </tbody>
                    </table>
                </div>

                <div class="order-card-footer">
                    <div class="order-card-footer-top">
                        <div class="order-card-address">
                            <i class="fas fa-map-marker-alt"></i>
                            <span><strong>Ship To:</strong> ${ordAddress}</span>
                        </div>
                        
                        <div class="order-card-actions">
                            <button onclick="copyShippingLabelToClipboard('${safeName}', '${safePhone}', '${safeAddress}', this)" class="order-action-btn order-action-btn--ghost" title="Copy Address Tag">
                                <i class="far fa-copy"></i> Label
                            </button>
                            
                            <a href="tel:${ordPhone}" class="order-action-btn order-action-btn--outline" title="Call Client">
                                <i class="fas fa-phone-alt"></i> Call
                            </a>
                            
                            ${contextButtonsHTML}
                        </div>
                    </div>

                    ${cancelDetailsBlockHTML}

                    <div id="courier-panel-${ordPaymentId}" class="courier-allocation-panel order-card-courier-panel">
                        <p>Assign Logistics Partner &amp; Waybill</p>
                        <div class="order-card-courier-options">
                            <label><input type="radio" name="courier-${ordPaymentId}" value="DTDC" checked> DTDC</label>
                            <label><input type="radio" name="courier-${ordPaymentId}" value="Delhivery"> Delhivery</label>
                            <label><input type="radio" name="courier-${ordPaymentId}" value="Blue Dart"> Blue Dart</label>
                        </div>
                        <div class="order-card-courier-input-row">
                            <input type="text" id="tracking-input-${ordPaymentId}" placeholder="Tracking Number">
                            <button onclick="updateShippingStatus('${ordPaymentId}', this)" class="order-courier-confirm-btn">Confirm</button>
                            <button onclick="hideCourierAllocationPanel('${ordPaymentId}')" class="order-courier-cancel-btn">Cancel</button>
                        </div>
                    </div>

                </div>

            </div>
            `;
        }).join('');
    }
}

function revealCourierAllocationPanel(paymentId) {
    document.querySelectorAll('.courier-allocation-panel').forEach(pane => pane.style.display = 'none');
    document.querySelectorAll('.admin-master-data-table tr').forEach(row => row.classList.remove('active-shipping-row'));

    const panel = document.getElementById(`courier-panel-${paymentId}`);
    if (panel) panel.style.display = 'block';

    const activeRow = document.getElementById(`order-row-${paymentId}`);
    if (activeRow) activeRow.classList.add('active-shipping-row');
}

function hideCourierAllocationPanel(paymentId) {
    const panel = document.getElementById(`courier-panel-${paymentId}`);
    if (panel) panel.style.display = 'none';

    const activeRow = document.getElementById(`order-row-${paymentId}`);
    if (activeRow) activeRow.classList.remove('active-shipping-row');
}

async function updateShippingStatus(paymentId, btn) {
    const panel = document.getElementById(`courier-panel-${paymentId}`);
    const trackingInput = document.getElementById(`tracking-input-${paymentId}`);
    
    const courierRadio = document.querySelector(`input[name="table-courier-${paymentId}"]:checked`);
    
    if (!trackingInput || !trackingInput.value.trim()) {
        alert("Please enter a valid Waybill / Tracking Number.");
        return;
    }
    
    const selectedCourier = courierRadio ? courierRadio.value : "Standard Logistics";
    const trackingNumber = trackingInput.value.trim();
    
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
                'Authorization': `Bearer ${getCurrentAdminAccessToken()}`,
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

async function executeAdminItemDeletionPipeline(event, productId, productTitle) {
    if (event) event.stopPropagation();
    
    const userFinalConfirmation = confirm(`⚠️ DANGER ZONE: Are you entirely sure you want to permanently delete "${productTitle}" (ID: #${productId}) from Supabase?\n\nThis action cannot be undone.`);
    if (!userFinalConfirmation) return;

    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;
    const cleanPurgeTargetUrl = `${sbUrl}/rest/v1/products?id=eq.${productId}`;

    try {
        const networkResponse = await fetch(cleanPurgeTargetUrl, {
            method: 'DELETE',
            headers: {
                'apikey': sbKey,
                'Authorization': `Bearer ${getCurrentAdminAccessToken()}`,
                'Content-Type': 'application/json'
            }
        });

        if (!networkResponse.ok) throw new Error(`Supabase returned status code: ${networkResponse.status}`);
        
        alert(`✨ Successfully Deleted! "${productTitle}" has been cleanly scrubbed from your database rows.`);
        if (MASTER_LIVE_INVENTORY_CACHE[productId]) delete MASTER_LIVE_INVENTORY_CACHE[productId];
        await loadProductDatabaseEngine();

    } catch (error) {
        console.error("Critical Supabase row write/purge communication error caught:", error);
        alert("Pipeline Synchronization Interrupted: Could not wipe item from Supabase database layout.");
    }
}

function exportCurrentAdminOrdersToCSV() {
    if (!adminOrdersCache || adminOrdersCache.length === 0) {
        alert("No transaction rows available to export.");
        return;
    }
    
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
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", `Angel_Jewellery_Orders_Ledger_${new Date().toLocaleDateString('en-IN')}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
}

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
                'Authorization': `Bearer ${getCurrentAdminAccessToken()}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                status: 'Refunded'
            })
        });

        if (!response.ok) throw new Error(`Database rejected status transition code: ${response.status}`);
        
        alert("✨ Status set successfully! Transaction row marked as Refunded.");
        
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
                'Authorization': `Bearer ${getCurrentAdminAccessToken()}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                status: 'Paid',
                cancel_reason: null,
                refund_phonepe: null
            })
        });

        if (!response.ok) throw new Error(`Database rejected operation update: ${response.status}`);
        
        alert("✨ Order restored successfully! Row shifted back to active Pending fulfillment queue.");
        
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

function convertImageFileToWebP(fileObject) {
    return new Promise((resolve, reject) => {
        if (fileObject.type === 'image/webp') {
            return resolve(fileObject);
        }

        const imageFileReader = new FileReader();
        imageFileReader.readAsDataURL(fileObject);
        
        imageFileReader.onload = (event) => {
            const tempImgNode = new Image();
            tempImgNode.src = event.target.result;
            
            tempImgNode.onload = () => {
                const offScreenCanvas = document.createElement('canvas');
                const canvasContext = offScreenCanvas.getContext('2d');
                
                const MAX_IMAGE_DIMENSION_LIMIT = 1920; 
                let targetWidth = tempImgNode.width;
                let targetHeight = tempImgNode.height;

                if (targetWidth > MAX_IMAGE_DIMENSION_LIMIT || targetHeight > MAX_IMAGE_DIMENSION_LIMIT) {
                    if (targetWidth > targetHeight) {
                        targetHeight = Math.round((targetHeight * MAX_IMAGE_DIMENSION_LIMIT) / targetWidth);
                        targetWidth = MAX_IMAGE_DIMENSION_LIMIT;
                    } else {
                        targetWidth = Math.round((targetWidth * MAX_IMAGE_DIMENSION_LIMIT) / targetHeight);
                        targetHeight = MAX_IMAGE_DIMENSION_LIMIT;
                    }
                }
                
                offScreenCanvas.width = targetWidth;
                offScreenCanvas.height = targetHeight;
                
                canvasContext.imageSmoothingEnabled = true;
                canvasContext.imageSmoothingQuality = 'high';
                
                canvasContext.drawImage(tempImgNode, 0, 0, targetWidth, targetHeight);
                
                offScreenCanvas.toBlob((webpBlobBinary) => {
                    if (!webpBlobBinary) {
                        return reject(new Error("Image graphic compression pipeline failed."));
                    }
                    
                    const cleanFileName = fileObject.name.substring(0, fileObject.name.lastIndexOf('.')) || 'product_asset';
                    const compressedWebPFile = new File([webpBlobBinary], `${cleanFileName}.webp`, {
                        type: 'image/webp',
                        lastModified: Date.now()
                    });
                    
                    resolve(compressedWebPFile);
                }, 'image/webp', 0.90); 
            };
            
            tempImgNode.onerror = (err) => reject(err);
        };
        imageFileReader.onerror = (err) => reject(err);
    });
}

async function uploadProductImageToSupabaseStorage(fileObject) {
    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;
    
    let processedFileAsset = fileObject;
    try {
        processedFileAsset = await convertImageFileToWebP(fileObject);
    } catch (compressionError) {
        console.warn("⚠️ Canvas compression failed, falling back to original source asset format:", compressionError);
    }

    const safeBaseName = processedFileAsset.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const uniqueFileSignature = `${Date.now()}_${safeBaseName}`;
    const encodedSignature = encodeURIComponent(uniqueFileSignature);
    const storageTargetBucketUrl = `${sbUrl}/storage/v1/object/product-images/${encodedSignature}`;

    const uploadResponse = await fetch(storageTargetBucketUrl, {
        method: 'POST',
        headers: {
            'apikey': sbKey,
            'Authorization': `Bearer ${getCurrentAdminAccessToken()}`,
            'Content-Type': processedFileAsset.type,
            'x-upsert': 'true'
        },
        body: processedFileAsset
    });

    if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Storage upload rejected: ${uploadResponse.status} - ${errorText}`);
    }

    return `${sbUrl}/storage/v1/object/public/product-images/${encodedSignature}`;
}

async function loadLiveCarouselDatabaseEngine() {
    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;
    const targetUrl = `${sbUrl}/rest/v1/Carousel?select=*&order=display_order.asc`;
    const track = document.getElementById('carouselSliderTrack');

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: { 'apikey': sbKey, 'Authorization': `Bearer ${getCurrentAdminAccessToken()}`, 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Supabase returned code: ${response.status}`);
        
        carouselRegistryCache = await response.json();
        
        if (!track) return;
        
        if (carouselRegistryCache.length === 0) {
            track.innerHTML = `
                <div class="carousel-slide" style="flex:0 0 100%; min-width:100%; position:relative; border-radius:8px; overflow:hidden;">
                    <img src="assets/carousel/slide-1.png" style="width:100%; height:100%; object-fit:cover; display:block;">
                </div>`;
            return;
        }

        track.innerHTML = carouselRegistryCache.map(slide => `
            <div class="carousel-slide" style="flex:0 0 100%; min-width:100%; position:relative; box-sizing:border-box; border-radius:8px; overflow:hidden; width:100%;">
                <img src="${slide.image_url}" loading="lazy" decoding="async" style="width:100%; height:100%; object-fit:cover; display:block;" alt="${slide.title}">
            </div>
        `).join('');

    } catch (err) {
        console.error("❌ Failed to synchronize active carousel registry layers:", err);
    }
}

async function handleAdminCarouselFormSubmit(event) {
    event.preventDefault();
    const submitBtn = document.getElementById('carouselFormSubmitBtn');
    if (!submitBtn) return;

    const originalText = submitBtn.innerText;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Processing...`;

    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;

    try {
        const filePicker = document.getElementById('newCarouselFilePicker');
        if (!filePicker || filePicker.files.length === 0) {
            alert("Please select a campaign banner photo file asset.");
            submitBtn.disabled = false; 
            submitBtn.innerText = originalText;
            return;
        }

        submitBtn.innerHTML = `<i class="fas fa-cloud-upload-alt fa-spin"></i> Processing & Compressing...`;
        const chosenFile = filePicker.files[0];
        const finalWebpUrl = await uploadProductImageToSupabaseStorage(chosenFile);

        const newSlidePayload = {
            title: document.getElementById('newCarouselTitleInput').value.trim(),
            display_order: parseInt(document.getElementById('newCarouselOrderInput').value) || 1,
            image_url: finalWebpUrl
        };

        submitBtn.innerHTML = `<i class="fas fa-database fa-spin"></i> Saving Slide...`;
        const response = await fetch(`${sbUrl}/rest/v1/Carousel`, {
            method: 'POST',
            headers: { 
                'apikey': sbKey, 
                'Authorization': `Bearer ${getCurrentAdminAccessToken()}`, 
                'Content-Type': 'application/json', 
                'Prefer': 'return=minimal' 
            },
            body: JSON.stringify(newSlidePayload)
        });

        if (!response.ok) throw new Error("Supabase rejected payload object.");

        alert(`✨ Campaign slide successfully posted as WebP: ${newSlidePayload.title}`);
        document.getElementById('adminCarouselCreatorForm').reset();
        
        await loadLiveCarouselDatabaseEngine(); 
        renderAdminCarouselConsoleGrid();       
        
    } catch (err) {
        console.error(err);
        alert("Pipeline Sync Interrupted: Verify your data transmission links.");
    } finally {
        submitBtn.disabled = false; 
        submitBtn.innerText = originalText;
    }
}

function renderAdminCarouselConsoleGrid() {
    const container = document.getElementById('adminCarouselListTableContainer');
    if (!container) return;

    if (carouselRegistryCache.length === 0) {
        container.innerHTML = `<p style="text-align:center; font-size:0.8rem; color:#aaa; margin:20px 0;">No carousel slide tracks minted yet.</p>`;
        return;
    }

    container.innerHTML = `
        <table style="width:100%; border-collapse:collapse; font-size:0.82rem; text-align:left;">
            <thead>
                <tr style="background:#f4f4f7; color:#777; font-weight:700; border-bottom:1px solid #e8e8ef;">
                    <th style="padding:10px; width:60px;">Preview</th>
                    <th style="padding:10px;">Campaign Title</th>
                    <th style="padding:10px; width:60px; text-align:center;">Seq</th>
                    <th style="padding:10px; text-align:center; width:60px;">Action</th>
                </tr>
            </thead>
            <tbody>
                ${carouselRegistryCache.map(slide => `
                    <tr style="border-bottom:1px solid #f1f1f5;">
                        <td style="padding:10px; text-align:center; vertical-align:middle;">
                            <img src="${slide.image_url}" style="width:40px; height:25px; object-fit:cover; border-radius:2px; border:1px solid #e8e8ef;">
                        </td>
                        <td style="padding:10px; font-weight:600; color:#202c55; max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${slide.title}</td>
                        <td style="padding:10px; text-align:center; font-weight:700; color:#ff1493;">${slide.display_order}</td>
                        <td style="padding:10px; text-align:center; vertical-align:middle;">
                            <button onclick="executeAdminCarouselPurgePipeline(event, ${slide.id}, '${slide.title}')" style="background:transparent; border:none; color:#ff4444; cursor:pointer; font-size:0.9rem; padding:4px;" title="Delete Campaign Slide">
                                <i class="far fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

async function executeAdminCarouselPurgePipeline(event, slideId, slideTitle) {
    if (event) event.stopPropagation();
    const verify = confirm(`Are you absolutely sure you want to permanently delete campaign banner: "${slideTitle}"?`);
    if (!verify) return;

    const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
    const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;

    try {
        const response = await fetch(`${sbUrl}/rest/v1/Carousel?id=eq.${slideId}`, {
            method: 'DELETE',
            headers: { 'apikey': sbKey, 'Authorization': `Bearer ${getCurrentAdminAccessToken()}`, 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error("Deletion execution tracking drop.");

        await loadLiveCarouselDatabaseEngine();
        renderAdminCarouselConsoleGrid();
        
    } catch (err) {
        console.error(err);
        alert("Unable to delete slide element entry row.");
    }
}

function openAdminCarouselConsoleOverlay(event) {
    if (event) event.preventDefault();
    const overlay = document.getElementById('adminCarouselConsoleOverlay');
    if (overlay) {
        overlay.style.setProperty('display', 'flex', 'important');
        renderAdminCarouselConsoleGrid();
    }
}

function closeAdminCarouselConsoleOverlay() {
    const overlay = document.getElementById('adminCarouselConsoleOverlay');
    if (overlay) overlay.style.setProperty('display', 'none', 'important');
}

function appendNewVariantRowToAdminForm(existingData = null) {
    const container = document.getElementById('adminFormDynamicVariantsContainer');
    if (!container) return;

    const uniqueRowId = 'var-row-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const rowDiv = document.createElement('div');
    rowDiv.id = uniqueRowId;
    rowDiv.className = "admin-variant-input-row admin-variant-card";

    const NEW_VARIANT_DEFAULT_COLOR_PALETTE = ['#D4AF37', '#B76E79', '#C0C0C0', '#8C7853', '#9B111E', '#0F52BA', '#046307', '#F0EAD6'];
    const existingRowCount = container.children.length;

    const colorName = existingData ? (existingData.color_name || '') : '';
    const colorHex = existingData 
        ? (existingData.color_hex || '#202c55') 
        : NEW_VARIANT_DEFAULT_COLOR_PALETTE[existingRowCount % NEW_VARIANT_DEFAULT_COLOR_PALETTE.length];
    const sku = existingData ? (existingData.sku || '') : '';
    const price = existingData ? (existingData.price || '') : '';
    const stock = existingData ? (existingData.stock || '0') : '0';
    const imgUrl = existingData ? (existingData.image_url || existingData.image || '') : '';
    const variantDatabaseId = existingData ? (existingData.id || '') : ''; 

    rowDiv.innerHTML = `
        <input type="hidden" class="v-db-id" value="${variantDatabaseId}">
        <div class="admin-variant-card-header">
            <input type="color" class="v-hex admin-variant-swatch-input" value="${colorHex}" title="Pick the swatch color shown as the storefront color dot">
            <span class="admin-variant-card-label">Color Variant <span class="variant-field-hint">(tap the circle to set its swatch)</span></span>
            <button type="button" class="admin-variant-remove-btn" onclick="document.getElementById('${uniqueRowId}').remove()" title="Remove this variant option">
                <i class="fas fa-trash-alt"></i> Remove
            </button>
        </div>
        <div class="admin-variant-fields-grid">
            <div class="variant-field">
                <label>Color Name</label>
                <input type="text" class="v-name" value="${colorName}" placeholder="e.g. Ruby Red" required>
            </div>
            <div class="variant-field">
                <label>SKU</label>
                <input type="text" class="v-sku" value="${sku}" placeholder="SKU-001" required>
            </div>
            <div class="variant-field">
                <label>Price (₹)</label>
                <input type="number" class="v-price" value="${price}" placeholder="4500" required>
            </div>
            <div class="variant-field">
                <label>Stock Qty</label>
                <input type="number" class="v-stock" value="${stock}" placeholder="5" required>
            </div>
            <div class="variant-field variant-field-wide">
                <label>Product Image <span class="variant-field-hint">(upload a photo, or paste a URL)</span></label>
                <div class="variant-image-upload-row">
                    <div class="variant-image-preview">
                        ${imgUrl ? `<img src="${imgUrl}" alt="Variant preview">` : `<i class="fas fa-image"></i>`}
                    </div>
                    <div class="variant-image-upload-inputs">
                        <input type="text" class="v-img" value="${imgUrl}" placeholder="Paste a URL, or upload a photo" oninput="refreshVariantImagePreview(this)">
                        <button type="button" class="variant-image-upload-btn" onclick="document.getElementById('${uniqueRowId}-file').click()">
                            <i class="fas fa-cloud-upload-alt"></i> <span class="variant-image-upload-label">Upload Photo</span>
                        </button>
                        <input type="file" accept="image/*" id="${uniqueRowId}-file" class="variant-image-file-input" onchange="handleVariantImageFileSelected(event, '${uniqueRowId}')">
                    </div>
                </div>
            </div>
        </div>
    `;

    container.appendChild(rowDiv);
}

function refreshVariantImagePreview(inputEl) {
    const card = inputEl.closest('.admin-variant-card');
    if (!card) return;
    const preview = card.querySelector('.variant-image-preview');
    if (!preview) return;

    const url = inputEl.value.trim();
    if (!url) {
        preview.innerHTML = `<i class="fas fa-image"></i>`;
        return;
    }
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Variant preview';
    img.onerror = () => { preview.innerHTML = `<i class="fas fa-image"></i>`; };
    preview.innerHTML = '';
    preview.appendChild(img);
}

async function handleVariantImageFileSelected(event, rowId) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        event.target.value = '';
        return;
    }

    const row = document.getElementById(rowId);
    if (!row) return;
    const urlInput = row.querySelector('.v-img');
    const uploadBtn = row.querySelector('.variant-image-upload-btn');
    const uploadLabel = row.querySelector('.variant-image-upload-label');
    const originalLabelText = uploadLabel ? uploadLabel.textContent : 'Upload Photo';

    if (uploadBtn) uploadBtn.disabled = true;

    try {
        if (uploadLabel) uploadLabel.textContent = 'Uploading...';
        const publicUrl = await uploadProductImageToSupabaseStorage(file);

        if (urlInput) {
            urlInput.value = publicUrl;
            refreshVariantImagePreview(urlInput);
        }
    } catch (err) {
        console.error('Variant image upload failed:', err);
        alert(`Image upload failed: ${err.message}\n\nYou can paste an image URL manually instead.`);
    } finally {
        if (uploadBtn) uploadBtn.disabled = false;
        if (uploadLabel) uploadLabel.textContent = originalLabelText;
        event.target.value = '';
    }
}

function runAdminOnlyPageSetup() {
    const adminFormNode = document.getElementById('masterJewelryAdminForm');
    if (adminFormNode) {
        adminFormNode.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('formSubmitActionBtn');
            const originalButtonText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Processing Assets...`;

            const sbUrl = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_URL;
            const sbKey = ANGEL_STORE_CONFIG.DATABASE.SUPABASE_ANON_KEY;
            const customHeaders = {
                'apikey': sbKey,
                'Authorization': `Bearer ${getCurrentAdminAccessToken()}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            };

            try {
                const editingTargetRowId = document.getElementById('formActionProductId').value;
                const isEditOperationMode = editingTargetRowId !== "";
                const assignedProductId = isEditOperationMode ? parseInt(editingTargetRowId) : parseInt(document.getElementById('formProductId').value);

                const filePicker = document.getElementById('formProductImageFilePicker');
                let finalCalculatedImageUrl = document.getElementById('formProductImage').value;

                if (filePicker && filePicker.files.length > 0) {
                    submitBtn.innerHTML = `<i class="fas fa-cloud-upload-alt fa-spin"></i> Uploading Image Asset...`;
                    const uploadedFile = filePicker.files[0];
                    finalCalculatedImageUrl = await uploadProductImageToSupabaseStorage(uploadedFile);
                    document.getElementById('formProductImage').value = finalCalculatedImageUrl;
                }

                if (!finalCalculatedImageUrl) {
                    finalCalculatedImageUrl = 'assets/placeholder.png';
                }

                const variantRows = document.querySelectorAll('.admin-variant-input-row');
                let baseCatalogPrice = parseFloat(document.getElementById('formProductPrice').value) || 0;
                let baseCatalogStock = parseInt(document.getElementById('formProductStock').value) || 0;

                if (variantRows.length > 0) {
                    baseCatalogPrice = parseFloat(variantRows[0].querySelector('.v-price').value) || baseCatalogPrice;
                    baseCatalogStock = parseInt(variantRows[0].querySelector('.v-stock').value) || baseCatalogStock;
                    finalCalculatedImageUrl = variantRows[0].querySelector('.v-img').value.trim() || finalCalculatedImageUrl;
                }

                const computedStatusFlag = baseCatalogStock <= 0 ? "sold" : "available";

                const parentProductPayload = {
                    id: assignedProductId,
                    title: document.getElementById('formProductTitle').value.trim(),
                    category: document.getElementById('formProductCategory').value,
                    badge: baseCatalogStock <= 0 ? "Sold Out" : document.getElementById('formProductBadge').value.trim(),
                    status: computedStatusFlag,
                    description: document.getElementById('formProductDesc').value.trim(),
                    style: document.getElementById('formProductStyle').value
                };

                let parentRequestUrl = `${sbUrl}/rest/v1/products`;
                let parentMethod = 'POST';

                if (isEditOperationMode) {
                    parentRequestUrl += `?id=eq.${editingTargetRowId}`;
                    parentMethod = 'PATCH';
                }

                const parentResponse = await fetch(parentRequestUrl, {
                    method: parentMethod,
                    headers: customHeaders,
                    body: JSON.stringify(parentProductPayload)
                });

                if (!parentResponse.ok) throw new Error("Supabase master product row registration rejected.");
                
                const preEditVariantsSnapshot = {};
                if (isEditOperationMode) {
                    const existingProductRecord = productDatabase.find(p => p.id === assignedProductId);
                    (existingProductRecord?.product_variants || []).forEach(v => {
                        preEditVariantsSnapshot[v.color_name || 'Standard'] = parseInt(v.stock) || 0;
                    });
                }

                if (isEditOperationMode) {
                    await fetch(`${sbUrl}/rest/v1/product_variants?product_id=eq.${assignedProductId}`, {
                        method: 'DELETE',
                        headers: { 'apikey': sbKey, 'Authorization': `Bearer ${getCurrentAdminAccessToken()}` }
                    });
                }

                submitBtn.innerHTML = `<i class="fas fa-layer-group fa-spin"></i> Committing Variant Matrix...`;
                const variationsBatchPayloadArray = [];

                if (variantRows.length > 0) {
                    variantRows.forEach(row => {
                        variationsBatchPayloadArray.push({
                            product_id: assignedProductId,
                            color_name: row.querySelector('.v-name').value.trim(),
                            color_hex: row.querySelector('.v-hex').value,
                            sku: row.querySelector('.v-sku').value.trim().toUpperCase(),
                            price: parseFloat(row.querySelector('.v-price').value) || 0,
                            stock: parseInt(row.querySelector('.v-stock').value) || 0,
                            image_url: row.querySelector('.v-img').value.trim() || finalCalculatedImageUrl,
                            status: parseInt(row.querySelector('.v-stock').value) <= 0 ? 'sold' : 'active'
                        });
                    });
                } else {
                    variationsBatchPayloadArray.push({
                        product_id: assignedProductId,
                        color_name: 'Standard',
                        color_hex: '#202c55',
                        sku: `SKU-${assignedProductId}-STD`,
                        price: baseCatalogPrice,
                        stock: baseCatalogStock,
                        image_url: finalCalculatedImageUrl,
                        status: baseCatalogStock <= 0 ? 'sold' : 'active'
                    });
                }

                const variantResponse = await fetch(`${sbUrl}/rest/v1/product_variants`, {
                    method: 'POST',
                    headers: {
                        'apikey': sbKey,
                        'Authorization': `Bearer ${getCurrentAdminAccessToken()}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(variationsBatchPayloadArray)
                });

                if (!variantResponse.ok) throw new Error("Variant rows population execution failed.");

                if (isEditOperationMode && typeof logStockHistoryEntry === 'function') {
                    try {
                        const freshVariantsResponse = await fetch(`${sbUrl}/rest/v1/product_variants?product_id=eq.${assignedProductId}&select=*`, {
                            headers: { 'apikey': sbKey, 'Authorization': `Bearer ${getCurrentAdminAccessToken()}` }
                        });
                        if (freshVariantsResponse.ok) {
                            const freshVariants = await freshVariantsResponse.json();
                            const productTitleForLog = document.getElementById('formProductTitle').value.trim();
                            for (const fv of freshVariants) {
                                const colorKey = fv.color_name || 'Standard';
                                const newStockValue = parseInt(fv.stock) || 0;
                                const previousStockValue = Object.prototype.hasOwnProperty.call(preEditVariantsSnapshot, colorKey)
                                    ? preEditVariantsSnapshot[colorKey]
                                    : 0;
                                if (previousStockValue !== newStockValue) {
                                    await logStockHistoryEntry(fv.id, assignedProductId, productTitleForLog, colorKey, 'manual_edit', previousStockValue, newStockValue);
                                }
                            }
                        }
                    } catch (historyErr) {
                        console.error('Could not log stock history:', historyErr);
                    }
                }

                alert(`✨ Success! Database sync complete for item reference #${assignedProductId}`);
                closeAdminFormVaultModal();
                
                await loadProductDatabaseEngine();

            } catch (error) {
                console.error("Administrative multi-tier write pipeline failure:", error);
                alert("Database write transaction was interrupted.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalButtonText;
            }
        });
    }

    loadLiveCarouselDatabaseEngine();
}