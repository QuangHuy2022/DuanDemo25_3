const express = require('express');
const router = express.Router();
const {
    getAllInventories,
    getInventoryById,
    addStock,
    removeStock,
    reserveStock,
    confirmSale
} = require('../controllers/inventory.controller');

router.get('/', getAllInventories);
router.get('/:id', getInventoryById);
router.post('/add-stock', addStock);
router.post('/remove-stock', removeStock);
router.post('/reserve', reserveStock);
router.post('/sold', confirmSale);

module.exports = router;
