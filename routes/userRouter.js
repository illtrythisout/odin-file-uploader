const { Router } = require('express');
const router = Router();

const userController = require('../controllers/userController');

router.get('/', userController.driveGet);

router.post('/create-folder', userController.createFolder);

module.exports = router;
