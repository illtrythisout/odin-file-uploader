const prisma = require('../client/prisma');

function homeGet(req, res) {
  res.render('home');
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

module.exports = { homeGet, createFolder };
