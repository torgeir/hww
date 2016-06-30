'use strict';

const electron = require('electron');
const Menu = require("menu");
const { app, BrowserWindow } = electron;

let mainWindow;
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: true
    }
  });
  if (process.env.HWW_MODE == 'dev') {
    mainWindow.loadURL('http://localhost:3001');
    mainWindow.webContents.openDevTools();
  }
  else {
    mainWindow.loadURL('http://localhost:3000');
  }
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  const template = [{
    label: "Hww",
    submenu: [
      { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
      { type: "separator" },
      { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]}, {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]}
                   ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
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

const express = require('express');
const expressSession = require('express-session');

const router = express.Router();
router.get(/\/images\/(.*)/, function (req, res) {
  const path = req.params[0];
  if (!path) {
    return res.status(500).send('no path given?');
  }

  res.sendFile(path);
});
router.get(/.*/, express.static(__dirname + "/dist"));

const web = express();
web.set('views', __dirname + "/views");
web.set('view engine', 'jade');
web.use(expressSession({ resave: false, saveUninitialized: false, secret: 'holsbjornswedding' }));
web.use('/', router);
web.listen(3000, 'localhost');
