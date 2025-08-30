const prisma = require('../client/prisma');
const driveFunctions = require('../utils/driveFunctions');
const cloudinary = require('../utils/cloudinary');

async function driveGet(req, res) {
  try {
    const folder = await prisma.folder.findFirst({
      where: { userId: req.user.id, parentId: null },
      include: { folders: true, files: true },
    });

    res.render('drive', { folder, filePath: 'My Drive' });
  } catch (err) {
    return next(err);
  }
}

async function folderGet(req, res, next) {
  try {
    const folderId = Number(req.params.folderId);
    const folder = await prisma.folder.findFirst({
      where: { id: folderId },
      include: { folders: true, files: true },
    });

    const filePath = await driveFunctions.getCurrentFilePath(folder);
    res.render('drive', { folder: folder, filePath: filePath });
  } catch (err) {
    console.error(err);
    return next(err);
  }
}

async function createFolder(req, res, next) {
  try {
    const currentFolder = await prisma.folder.findUnique({
      where: { id: Number(req.params.currentFolderId) },
    });

    await prisma.folder.create({
      data: {
        name: req.body.name,
        parent: { connect: { id: currentFolder.id } },
        user: { connect: { id: req.user.id } },
      },
    });

    const redirectLink =
      currentFolder.parentId === null ? '/drive' : `/drive/${currentFolder.id}`;
    res.redirect(redirectLink);
  } catch (err) {
    return next(err);
  }
}

async function deleteFolder(req, res, next) {
  try {
    const folderId = Number(req.params.currentFolderId);
    // find folder first so we know where to redirect the user after deletion
    const currentFolder = await prisma.folder.findFirst({
      where: { id: folderId },
    });

    // safeguard: don’t allow root folder deletion
    if (currentFolder.parentId === null) {
      throw new Error('Cannot delete the root folder');
    }

    // run delete logic in a transaction so if any step fails, nothing is lost
    await prisma.$transaction(async (tx) => {
      // recursively delete all nested files and folders first
      async function deleteRecursively(id) {
        // find child folders
        const children = await tx.folder.findMany({ where: { parentId: id } });

        // recursively call for each child
        for (const child of children) {
          await deleteRecursively(child.id);
        }

        // delete contents, then delete the folder itself
        await tx.file.deleteMany({ where: { parentId: id } });
        await tx.folder.delete({ where: { id } });
      }
      await deleteRecursively(folderId);
    });

    res.redirect(`/drive/${currentFolder.parentId ?? ''}`);
  } catch (err) {
    next(err);
  }
}

async function uploadFile(req, res, next) {
  try {
    // get current folder
    const currentFolder = await prisma.folder.findUnique({
      where: { id: Number(req.params.currentFolderId) },
    });
    const redirectLink =
      currentFolder.parentId === null ? '/drive' : `/drive/${currentFolder.id}`;

    // return an error if not file found
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    // convert buffer to base64 data URI
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // attempt to upload the file
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'odin-drive', // folder to save in cloudinary's resources
      resource_type: 'auto', // auto-detects images, pdf, videos, etc.
    });

    // save file in db
    await prisma.file.create({
      data: {
        savedFilename: req.file.originalname,
        url: result.secure_url,
        size: req.file.size,
        mimetype: req.file.mimetype,
        parent: { connect: { id: currentFolder.id } },
        user: { connect: { id: req.user.id } },
      },
    });

    // redirect
    res.redirect(redirectLink);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  driveGet,
  folderGet,
  createFolder,
  deleteFolder,
  uploadFile,
};
