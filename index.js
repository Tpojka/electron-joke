const ICanHazDadJoke = require('./models/ICanHazDadJoke')
const ExportFormatter = require("./utils/ExportFormatter")
const Icndb = require("./models/Icndb")
const YoMomma = require("./models/YoMomma")
const CorpBuzzWordsGen = require("./models/CorpBuzzWordsGen")
const GeekJokes = require("./models/GeekJokes")

const { app, BrowserWindow, ipcMain } = require('electron')
const fetch = require('node-fetch')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Open the DevTools.
  // win.webContents.openDevTools()

  // and load the index.html of the app.
  win.loadFile('index.html')
}

app.allowRendererProcessReuse = true

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

let setJokeFromSource = (e, source) => {

  fetch(source.url, {
    headers: {
      "Accept": "application/json"
    }
  })
    .then((res) => {
      return res.json()
    })
    .then((res) => {
      e.sender.send('joke-response', source.exportText(res), source.url)
    }, reason => {
      e.sender.send('joke-response', 'Try again...')
    })
}

ipcMain.on('joke-request', async (e) => {
  switch (Math.floor(Math.random() * 5) + 1) {
    case 1:
      await setJokeFromSource(e, new ExportFormatter(new ICanHazDadJoke))
      break
    case 2:
        await setJokeFromSource(e, new ExportFormatter(new Icndb))
      break
    case 3:
        await setJokeFromSource(e, new ExportFormatter(new YoMomma))
      break
    case 4:
        await setJokeFromSource(e, new ExportFormatter(new GeekJokes))
      break
    case 5:
        await setJokeFromSource(e, new ExportFormatter(new CorpBuzzWordsGen))
      break
  }
})

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
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
