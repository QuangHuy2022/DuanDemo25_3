const Inventory = require('../models/inventory.model');
const Product = require('../models/product.model');
const { sequelize } = require('../db');

// Get all inventories with joined product
const getAllInventories = async (req, res, next) => {
    try {
        const inventories = await Inventory.findAll({
            include: [{ model: Product }]
        });
        res.status(200).json(inventories);
    } catch (error) {
        next(error);
    }
};

// Get inventory by ID with joined product
const getInventoryById = async (req, res, next) => {
    try {
        const inventory = await Inventory.findByPk(req.params.id, {
            include: [{ model: Product }]
        });
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

        const [inventory, created] = await Inventory.findOrCreate({
            where: { productId: product },
            defaults: { stock: quantity }
        });

        if (!created) {
            await inventory.increment('stock', { by: quantity });
            await inventory.reload();
        }

        const updatedInventory = await Inventory.findByPk(inventory.id, { include: [{ model: Product }] });
        res.status(200).json(updatedInventory);
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

        const inventory = await Inventory.findOne({ where: { productId: product } });
        if (!inventory || inventory.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        await inventory.decrement('stock', { by: quantity });
        await inventory.reload();

        const updatedInventory = await Inventory.findByPk(inventory.id, { include: [{ model: Product }] });
        res.status(200).json(updatedInventory);
    } catch (error) {
        next(error);
    }
};

// Reserve stock
const reserveStock = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { product, quantity } = req.body;
        if (!product || quantity <= 0) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Product ID and valid quantity required' });
        }

        const inventory = await Inventory.findOne({ where: { productId: product }, transaction });
        if (!inventory || inventory.stock < quantity) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        await inventory.decrement('stock', { by: quantity, transaction });
        await inventory.increment('reserved', { by: quantity, transaction });
        
        await transaction.commit();
        await inventory.reload();

        const updatedInventory = await Inventory.findByPk(inventory.id, { include: [{ model: Product }] });
        res.status(200).json(updatedInventory);
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

// Confirm sale (Sold)
const confirmSale = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const { product, quantity } = req.body;
        if (!product || quantity <= 0) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Product ID and valid quantity required' });
        }

        const inventory = await Inventory.findOne({ where: { productId: product }, transaction });
        if (!inventory || inventory.reserved < quantity) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Insufficient reserved quantity' });
        }

        await inventory.decrement('reserved', { by: quantity, transaction });
        await inventory.increment('soldCount', { by: quantity, transaction });
        
        await transaction.commit();
        await inventory.reload();

        const updatedInventory = await Inventory.findByPk(inventory.id, { include: [{ model: Product }] });
        res.status(200).json(updatedInventory);
    } catch (error) {
        await transaction.rollback();
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
