const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

// Auto create inventory after product is created
productSchema.post('save', async function(doc, next) {
    try {
        const Inventory = mongoose.model('Inventory');
        const inventoryExists = await Inventory.findOne({ product: doc._id });
        if (!inventoryExists) {
            await Inventory.create({
                product: doc._id,
                stock: 0,
                reserved: 0,
                soldCount: 0
            });
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Product', productSchema);
