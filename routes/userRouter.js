const { Router } = require('express');
const router = Router();
const multerUpload = require('../middleware/multer');

const userController = require('../controllers/userController');

router.get('/', userController.driveGet);

router.get('/:folderId', userController.folderGet);

router.post('/create-folder/:currentFolderId', userController.createFolder);

router.post('/delete-folder/:currentFolderId', userController.deleteFolder);

router.post(
  '/create-file/:currentFolderId',
  multerUpload.single('file'),
  userController.uploadFile
);

module.exports = router;
