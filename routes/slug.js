const router = require('express').Router();
const slugController = require('../controllers/slugController.js');

router.get('/', slugController.index);
router.post('/', slugController.save);
router.get('/url/:id', slugController.redirect);
router.get('/qrcode/:item', slugController.qrcode);

module.exports = router;