'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
function createWindow () {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  mainWindow.loadURL('http://localhost:3000');
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}
app.on('ready', createWindow);
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', function () {
  if (!mainWindow) {
    createWindow();
  }
});


const passport = require('passport');
const InstagramStrategy = require('passport-instagram');
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
passport.use(new InstagramStrategy({
    clientID: "",
    clientSecret: "",
    callbackURL: "http://localhost:3000/auth/instagram/callback",
    scope: 'public_content'
  },
  function(accessToken, refreshToken, profile, done) {
    done(null, {
      accessToken: accessToken,
      username: profile.username
    });
  }
));

const express = require('express');
const expressSession = require('express-session');

const router = express.Router();
router.get('/', function (req, res) {
  res.render("index");
});
router.get('/install', function (req, res) {
  if (req.user) {
    return res.render("install", {
      user: req.user
    });
  }
  res.redirect("/");
})
router.get('/app', function (req, res) {
  return res.render("app");
});

const instaAuth = passport.authenticate('instagram', { failureRedirect: '/' });
router.get('/auth/instagram', passport.authenticate('instagram'));
router.get('/auth/instagram/callback', instaAuth, function (req, res) {
  res.redirect('/install');
});

const web = express();
web.set('views', __dirname + "/views");
web.set('view engine', 'jade');
web.use(expressSession({ resave: false, saveUninitialized: false, secret: 'holsbjornswedding' }));
web.use(passport.initialize());
web.use(passport.session());
web.use('/', router);
web.listen(3000);
