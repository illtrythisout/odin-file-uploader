const { Router } = require('express');
const router = Router();

const userController = require('../controllers/userController');

router.get('/', userController.driveGet);

router.get('/:folderId', userController.folderGet);

router.post('/create-folder/:currentFolderId', userController.createFolder);

module.exports = router;
