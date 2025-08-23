const { Router } = require('express');
const router = Router();

const userController = require('../controllers/userController');

router.route('/').get(userController.homeGet);

module.exports = router;
