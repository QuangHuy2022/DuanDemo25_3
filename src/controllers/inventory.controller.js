const Inventory = require('../models/inventory.model');
const Product = require('../models/product.model');

// Get all inventories with joined product
const getAllInventories = async (req, res, next) => {
    try {
        const inventories = await Inventory.find().populate('product');
        res.status(200).json(inventories);
    } catch (error) {
        next(error);
    }
};

// Get inventory by ID with joined product
const getInventoryById = async (req, res, next) => {
    try {
        const inventory = await Inventory.findById(req.params.id).populate('product');
        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }
        res.status(200).json(inventory);
    } catch (error) {
        next(error);
    }
};

// Add stock
const addStock = async (req, res, next) => {
    try {
        const { product, quantity } = req.body;
        if (!product || quantity <= 0) {
            return res.status(400).json({ message: 'Product ID and valid quantity required' });
        }

        const inventory = await Inventory.findOneAndUpdate(
            { product: product },
            { $inc: { stock: quantity } },
            { new: true, upsert: true }
        ).populate('product');

        res.status(200).json(inventory);
    } catch (error) {
        next(error);
    }
};

// Remove stock
const removeStock = async (req, res, next) => {
    try {
        const { product, quantity } = req.body;
        if (!product || quantity <= 0) {
            return res.status(400).json({ message: 'Product ID and valid quantity required' });
        }

        // We check if stock is enough before removing
        const inventory = await Inventory.findOne({ product: product });
        if (!inventory || inventory.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        const updatedInventory = await Inventory.findOneAndUpdate(
            { product: product, stock: { $gte: quantity } },
            { $inc: { stock: -quantity } },
            { new: true }
        ).populate('product');

        if (!updatedInventory) {
            return res.status(400).json({ message: 'Insufficient stock or inventory not found' });
        }

        res.status(200).json(updatedInventory);
    } catch (error) {
        next(error);
    }
};

// Reserve stock
const reserveStock = async (req, res, next) => {
    try {
        const { product, quantity } = req.body;
        if (!product || quantity <= 0) {
            return res.status(400).json({ message: 'Product ID and valid quantity required' });
        }

        const updatedInventory = await Inventory.findOneAndUpdate(
            { product: product, stock: { $gte: quantity } },
            { 
                $inc: { 
                    stock: -quantity,
                    reserved: quantity
                } 
            },
            { new: true }
        ).populate('product');

        if (!updatedInventory) {
            return res.status(400).json({ message: 'Insufficient stock or inventory not found' });
        }

        res.status(200).json(updatedInventory);
    } catch (error) {
        next(error);
    }
};

// Confirm sale (Sold)
const confirmSale = async (req, res, next) => {
    try {
        const { product, quantity } = req.body;
        if (!product || quantity <= 0) {
            return res.status(400).json({ message: 'Product ID and valid quantity required' });
        }

        const updatedInventory = await Inventory.findOneAndUpdate(
            { product: product, reserved: { $gte: quantity } },
            { 
                $inc: { 
                    reserved: -quantity,
                    soldCount: quantity
                } 
            },
            { new: true }
        ).populate('product');

        if (!updatedInventory) {
            return res.status(400).json({ message: 'Insufficient reserved quantity or inventory not found' });
        }

        res.status(200).json(updatedInventory);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllInventories,
    getInventoryById,
    addStock,
    removeStock,
    reserveStock,
    confirmSale
};
