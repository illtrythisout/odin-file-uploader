const prisma = require('../client/prisma');
const driveFunctions = require('../utils/driveFunctions');

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

async function folderGet(req, res) {
  try {
    const folderId = Number(req.params.folderId);
    const folder = await prisma.folder.findFirst({
      where: { id: folderId },
      include: { folders: true, files: true },
    });

    const filePath = await driveFunctions.getCurrentFilePath(folder);
    console.log(filePath);
    res.render('drive', { folder: folder, filePath: filePath });
  } catch (err) {
    console.error(err);
    return next(err);
  }
}

async function createFolder(req, res) {
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

module.exports = { driveGet, folderGet, createFolder };
