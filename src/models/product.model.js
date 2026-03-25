const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Inventory = require('./inventory.model');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true,
    hooks: {
        afterCreate: async (product, options) => {
            await Inventory.create({ productId: product.id });
        }
    }
});

module.exports = Product;
