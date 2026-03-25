const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Product = require('./product.model');

const Inventory = sequelize.define('Inventory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    reserved: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    soldCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    }
}, {
    timestamps: true
});

// Define association
Product.hasOne(Inventory, { foreignKey: { name: 'productId', allowNull: false }, onDelete: 'CASCADE' });
Inventory.belongsTo(Product, { foreignKey: { name: 'productId', allowNull: false } });

module.exports = Inventory;
