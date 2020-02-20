const router = require('express').Router();
const exoController = require('../controllers/exoController.js');

router.get('/', exoController.index);
router.post('/', exoController.save);
router.get('/item/:id', exoController.item);
router.get('/qrcode/:item', exoController.qrcode);

module.exports = router;