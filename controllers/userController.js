const prisma = require('../client/prisma');

async function driveGet(req, res) {
  try {
    const rootFolder = await prisma.folder.findFirst({
      where: { userId: req.user.id, parentId: null },
      select: { id: true },
    });

    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id, parentId: rootFolder.id },
    });
    res.locals.folders = folders;
    res.render('drive');
  } catch (err) {}
}

async function renderFolder(req, res) {}

async function createFolder(req, res) {
  try {
    const rootFolder = await prisma.folder.findFirst({
      where: { userId: req.user.id, parentId: null },
      select: { id: true },
    });

    if (!rootFolder) {
      throw new Error('Root folder not found for user');
    }

    await prisma.folder.create({
      data: {
        name: req.body.name,
        parent: { connect: { id: rootFolder.id } },
        user: { connect: { id: req.user.id } },
      },
    });

    res.redirect(req.originalUrl);
  } catch (err) {
    return next(err);
  }
}

module.exports = { driveGet, createFolder };
