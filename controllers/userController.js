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

async function deleteFolder(req, res) {
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
    console.error(err);
  }
}

module.exports = { driveGet, folderGet, createFolder, deleteFolder };
