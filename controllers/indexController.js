const bcrypt = require('bcrypt');
const prisma = require('../client/prisma');
const { use } = require('passport');

function indexGet(req, res) {
  res.render('index');
}

function signupGet(req, res) {
  res.render('signup');
}

async function signupPost(req, res) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await prisma.user.create({
      data: {
        email: req.body.email,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        folders: {
          create: {
            name: 'root',
          },
        },
      },
    });
    console.log(user);
    res.redirect('/');
  } catch (err) {
    return next(err);
  }
}

function logOutGet(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
}

module.exports = { indexGet, signupGet, signupPost, logOutGet };
