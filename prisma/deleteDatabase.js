// Run using `node prisma/deleteDatabase.js`
const prisma = require('../client/prisma');

async function deleteAll() {
  await prisma.folder.deleteMany();
  await prisma.file.deleteMany();
  await prisma.user.deleteMany();
}
deleteAll();
