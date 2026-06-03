// =========================================================================
// ANGEL JEWELLERY — ECOSYSTEM CORE ENVIRONMENT CONFIGURATION VAULT
// =========================================================================
const ANGEL_STORE_CONFIG = {
    // 1. Database Operations Pipelines (Google Sheets Integrations)
    DATABASE: {
        SHEETDB_API_URL: "https://sheetdb.io/api/v1/0lvmtng1nhhhi",
        ORDERS_LOG_SHEET_NAME: "Angel-records"
    },

    // 2. Secured Transaction Merchant Gateways
    PAYMENT_GATEWAY: {
        RAZORPAY_KEY_ID: "rzp_test_StZ7M1D8qRHUIN", // Swap to rzp_test_ for sandbox trials
        CURRENCY_CODE: "INR",
        MERCHANT_NAME: "Angel Jewellery",
        THEME_HEX_COLOR: "#202c55" // Signature Brand Luxury Navy
    },

    // 3. Direct Support Core Routing Hotlines
    CONCIERGE_CHANNELS: {
        WHATSAPP_PHONE_RAW: "919160133199",
        WHATSAPP_LINK_URI: "https://wa.me/919160133199"
    }
};

// Freeze the object structure to ensure runtime components don't accidentally mutate parameters
Object.freeze(ANGEL_STORE_CONFIG);