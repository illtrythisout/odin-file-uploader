const prisma = require('../client/prisma');

function homeGet(req, res) {
  res.render('home');
}

module.exports = { homeGet };
