const { Router } = require('express');
const router = Router();

const indexController = require('../controllers/indexController');
const passport = require('passport');

// drive routes
const userRouter = require('./userRouter');
router.use('/drive', userRouter);

// index routes

router.get('/', indexController.indexGet);

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/drive',
    failureRedirect: '/',
  })
);

router
  .route('/signup')
  .get(indexController.signupGet)
  .post(indexController.signupPost);

router.get('/logout', indexController.logOutGet);

module.exports = router;
