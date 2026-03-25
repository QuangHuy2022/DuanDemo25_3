const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

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
            const { Inventory } = sequelize.models;
            if (Inventory) {
                await Inventory.create({ productId: product.id });
            }
        }
    }
});

module.exports = Product;
