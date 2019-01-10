'use strict';
import * as fs from 'fs';
import { app, protocol, BrowserWindow, ipcMain as ipc, dialog } from 'electron';
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib';
import got from 'got';
const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow;

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true });
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600, autoHideMenuBar: true });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) {
      mainWindow.webContents.openDevTools();
    }
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    mainWindow.loadURL('app://./index.html');
    // mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    (mainWindow as any) = null;
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools();
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

ipc.on('request', (event: any, url: string) => {
  got(url, {
    headers: {
      // tslint:disable max-line-length
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'Host': 'www.youdao.com',
      'Referer': 'http://www.youdao.com/',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Mobile Safari/537.36'
    }
  }).then(res => {
    event.sender.send(`request-result-${url}`, res);
  });
});

ipc.on('open-file-dialog', (event: any) => {
  dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory'],
  }, (files) => {
    if (files) {
      event.sender.send('selected-directory', files);
    }
  });
});

ipc.on('save-dialog-txt', (event: any, data: string) => {
  const options = {
    title: '导出为文本文档',
    filters: [
      { name: '文本文档', extensions: ['txt'] },
    ],
  };
  dialog.showSaveDialog(options, (filename) => {
    if (filename) {
      fs.writeFile(filename, data, (err) => {
        event.sender.send('saved-file-txt', {
          error: err,
          path: filename,
        });
      });
    }
  });
});
