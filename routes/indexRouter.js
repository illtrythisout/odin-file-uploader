const { Router } = require('express');
const router = Router();

const indexController = require('../controllers/indexController');
const passport = require('passport');

router.get('/', indexController.indexGet);

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/',
  })
);

router
  .route('/signup')
  .get(indexController.signupGet)
  .post(indexController.signupPost);

router.get('/logout', indexController.logOutGet);

module.exports = router;
