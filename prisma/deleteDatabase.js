// Run using `node prisma/deleteDatabase.js`
const prisma = require('../client/prisma');

// async function deleteAll() {
//   await prisma.folder.deleteMany();
//   await prisma.file.deleteMany();
//   await prisma.user.deleteMany();
// }
// deleteAll();

// async function getUser() {
//   const user = await prisma.user.findFirst({
//     where: { email: 'theo.sommer@hotmail.com' },
//     include: { folders: true },
//   });
//   console.dir(user);
// }
// getUser();

// async function deleteFolder() {
//   await prisma.folder.delete({ where: { id: 11 } });
// }
// deleteFolder();
