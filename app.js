const express = require('express');
const path = require('node:path');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
require('./auth/passportConfig');
require('dotenv').config();

const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require('./client/prisma');

const app = express(); // initialize express in app

// Set up EJS as the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Correctly parse the incoming request’s body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Allow the use of static assets from public folder
const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));

// Set up session
app.use(
  session({
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day in ms
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // 2 mins in ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

// adds user to res.locals to be used in ejs
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Use index router
const indexRouter = require('./routes/indexRouter');
app.use('/', indexRouter);

// To handle errors
// Every thrown error in the application or the previous middleware function calling `next` with an error as an argument will eventually go to this middleware function
app.use((err, req, res, next) => {
  console.error(err);
  // We specify the `err.statusCode` that exists in our custom error class and if it does not exist it's probably an internal server error
  res.status(err.statusCode || 500).send(err.message);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express app - listening on port ${PORT}`);
});

// Disconnect PrismaORM on server shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit();
});
