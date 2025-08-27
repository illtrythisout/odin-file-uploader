const prisma = require('../client/prisma');

async function getCurrentFilePath(folder) {
  try {
    let filePath = folder.name;

    // loop through all parents until reaching the root folder, creating the filepath
    let currentFolder = folder;
    while (currentFolder.parentId !== null) {
      const parentFolder = await prisma.folder.findFirst({
        where: { id: currentFolder.parentId },
      });

      filePath = `${
        parentFolder.parentId === null ? 'My Drive' : parentFolder.name
      } > ${filePath}`;

      currentFolder = parentFolder;
    }

    return filePath;
  } catch (err) {
    console.error(err);
  }
}

module.exports = { getCurrentFilePath };
