const Product = require('../models/product.model');

const createProduct = async (req, res, next) => {
    try {
        const { name, price, description } = req.body;
        if (!name || price === undefined) {
            return res.status(400).json({ message: 'Name and price are required' });
        }
        const product = await Product.create({ name, price, description });
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProduct,
    getAllProducts
};
