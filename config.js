// =========================================================================
// ANGEL JEWELLERY — ECOSYSTEM CORE ENVIRONMENT CONFIGURATION VAULT
// =========================================================================
const ANGEL_STORE_CONFIG = {
    // 1. Database Operations Pipelines (Google Sheets Integrations)
    DATABASE: {
        SUPABASE_URL: "https://ixktbnnkjmeyqflxjgeb.supabase.co", 
        SUPABASE_ANON_KEY: "sb_publishable_7ZS8IYQ2gbijrvt8KYPhxQ_iI1OfLVi"
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
    },
    LOGISTICS: {
        FREE_SHIPPING_THRESHOLD: 1000, // Free shipping eligibility limit milestone
        FLAT_SHIPPING_FEE: 50          // Flat rate delivery fee below threshold
    },
    SECURITY: {
        MASTER_ADMIN_PASSKEY: "angelswathi" // Replace with your actual password string
    },
    // 5. Angel's Picks — Dynamic Trending Showcase Curation
    TRENDING_COLLECTION: [
        {
            id: "angels_pick_empress",
            title: "The Empress Choker",
            basePrice: "₹18,500",
            description: "Artisan sculpted kundan work with custom stone options.",
            variants: [
            { colorName: "Emerald Green", hexColor: "#097969", imageFile: "data/variants/mini-haram-10.jpeg" },
            { colorName: "Ruby Red", hexColor: "#900C3F", imageFile: "data/variants/mini-haram-11.jpeg" },
            { colorName: "Sapphire Blue", hexColor: "#0F52BA", imageFile: "data/variants/mini-haram-12.jpeg" }
            ]
        },
        {
            id: "angels_pick_royal_jhumka",
            title: "Royal Heritage Jhumkas",
            basePrice: "₹8,200",
            description: "Classic fine filigree detailing wrapped in royal hues.",
            variants: [
                { colorName: "Ruby Red", hexColor: "#900C3F", imageFile: "data/variants/mini-haram-2.jpeg" },
                { colorName: "Emerald Green", hexColor: "#097969", imageFile: "data/variants/mini-haram-3.jpeg" },
                { colorName: "Deep Pearl White", hexColor: "#FDFD96", imageFile: "data/variants/mini-haram-4.jpeg" }
            ]
        },
        {
            id: "angels_pick_rani_haar",
            title: "The Nizam Rani Haar",
            basePrice: "₹32,000",
            description: "A monumental heritage multi-layer statement masterpiece.",
            variants: [
                { colorName: "Ocean Sapphire", hexColor: "#0F52BA", imageFile: "data/variants/mini-haram-6.jpeg" },
                { colorName: "Emerald Green", hexColor: "#097969", imageFile: "data/variants/mini-haram-7.jpeg" },
                { colorName: "Emerald Green", hexColor: "red", imageFile: "data/variants/mini-haram-8.jpeg" },
                { colorName: "Emerald Green", hexColor: "green", imageFile: "data/variants/mini-haram-9.jpeg" }
            ]
        }
    ]
};

// Freeze the object structure to ensure runtime components don't accidentally mutate parameters
Object.freeze(ANGEL_STORE_CONFIG);