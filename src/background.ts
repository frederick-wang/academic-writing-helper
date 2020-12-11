'use strict'
import * as fs from 'fs'
import { app, protocol, BrowserWindow, ipcMain as ipc, dialog } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import got from 'got'
const isDevelopment = process.env.NODE_ENV !== 'production'
import puppeteer from 'puppeteer'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow

// Standard scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true
    }
  }
])
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) {
      mainWindow.webContents.openDevTools()
    }
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    mainWindow.loadURL('app://./index.html')
    // mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    ;(mainWindow as any) = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools()
  }
  createWindow()

  const browser = await puppeteer.launch({
    executablePath:
      './node_modules/puppeteer/.local-chromium/win64-818858/chrome-win/chrome.exe',
    headless: false
  })
  const page = await browser.newPage()
  await page.goto('https://global.chinadaily.com.cn/')
  const result = await page.evaluate(async () => {
    return await Promise.all(
      Array.from(
        (window as any).$(
          '.content-left .tw3_01_2',
          await fetch(
            document.querySelector('.tit-tou a')!.getAttribute('href') || ''
          ).then((v) => v.text())
        )
      )
        .map((v) => ({
          href: (window as any)
            .$(v)
            .find('.tw3_01_2_t a')
            .attr('href')
            .replace('//www', '//global'),
          title: (window as any).$(v).find('.tw3_01_2_t a').text(),
          time: (window as any).$(v).find('.tw3_01_2_t b').text(),
          imgSrc: (window as any).$(v).find('img').attr('src')
        }))
        .map(async (v) => ({
          ...v,
          content: (window as any)
            .$('#Content', await fetch(v.href).then((w) => w.text()))
            .text()
            .trim()
        }))
    )
  })
  fs.writeFileSync('test.json', JSON.stringify(result))
  // await browser.close()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipc.on('request', (event: any, url: string) => {
  got(url, {
    headers: {
      // tslint:disable max-line-length
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      Host: 'www.youdao.com',
      Referer: 'http://www.youdao.com/',
      'User-Agent':
        'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Mobile Safari/537.36'
    }
  }).then((res) => {
    event.sender.send(`request-result-${url}`, res)
  })
})

ipc.on('open-file-dialog', async (event: any) => {
  const files = await dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory']
  })
  if (files) {
    event.sender.send('selected-directory', files)
  }
})

ipc.on('save-dialog-txt', async (event: any, data: string) => {
  const options = {
    title: '导出为文本文档',
    filters: [{ name: '文本文档', extensions: ['txt'] }]
  }
  const { filePath } = await dialog.showSaveDialog(options)
  if (filePath) {
    fs.writeFile(filePath, data, (err) => {
      event.sender.send('saved-file-txt', {
        error: err,
        path: filePath
      })
    })
  }
})
