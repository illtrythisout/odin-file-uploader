const { Router } = require('express');
const router = Router();

const userController = require('../controllers/userController');

router.get('/', userController.homeGet);

router.post('/create-folder', userController.createFolder);

module.exports = router;
