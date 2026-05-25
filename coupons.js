// --- THE AUTHORIZED COUPON REGISTRY ---
// You can effortlessly add, edit, or remove codes from this list.
// "type" can be "percentage" (e.g., 10% off) or "flat" (e.g., flat ₹2,000 off)

const couponRegistry = {
    "ANGEL10": { 
        type: "percentage", 
        value: 10, 
        description: "10% off on your luxury order" 
    },
    "WELCOME5": { 
        type: "percentage", 
        value: 5, 
        description: "5% off for new users" 
    },
    "FESTIVE2000": { 
        type: "flat", 
        value: 2000, 
        description: "Flat ₹2,000 off on premium collection" 
    },
    "LAUNCH2026": {
        type: "percentage",
        value: 15,
        description: "Special 15% launch celebration discount"
    }
};