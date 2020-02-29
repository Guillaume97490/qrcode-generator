const router = require('express').Router();
const slugController = require('../controllers/slugController.js');

router.get('/', slugController.index);
router.post('/', slugController.save);
router.get('/item/:id', slugController.item);
router.get('/qrcode/:item', slugController.qrcode);

module.exports = router;