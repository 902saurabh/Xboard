const { app, BrowserWindow, clipboard, ipcMain } = require('electron');
const path = require('node:path');
const Datastore = require('nedb');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Create a NeDB database instance
const db = new Datastore({ filename: 'data.db', autoload: true });


const createWindow = () => {
  // Create the browser window.
  // Create and configure the lowdb instance
  
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  setInterval(async ()=> {
    let copied_data = clipboard.readText();
    
    if (copied_data) {
      const lastRecord = await findDocument({ 
          query: {}, 
          sort: { date: -1 }, // 1 is asc and -1 is desc
          limit: 1
        });
      // console.log('Last Record', copied_data, lastRecord);
      if (!lastRecord || lastRecord[0].content !== copied_data) {
        db.insert({ 'date': new Date().getTime(), 'content': copied_data }, function (err, newDoc) {
          if (err) console.log(err);
          console.log('Inserted new document:', newDoc);
        });
      }
    }
  }, 2000);

  ipcMain.handle('find-documents', async (event, { query, sort, limit, offset }) => {
    return new Promise((resolve, reject) => {
      let cursor = db.find(query);
  
      if (sort) {
        cursor = cursor.sort(sort);
      }
  
      if (offset !== undefined) {
        cursor = cursor.skip(offset);
      }
  
      if (limit !== undefined) {
        cursor = cursor.limit(limit);
      }
  
      cursor.exec((err, docs) => {
        if (err) reject(err);
        else resolve(docs);
      });
    });
  });
  // findDocument({ 
  //   query: {}, 
  //   sort: { date: -1 }, // 1 is asc and -1 is desc
  //   limit: 1, 
  //   offset: 1 
  // }).then((data) => {
  //   console.log(data)
  // })
};

 const findDocument = ({ query, sort, limit, offset }) => {
  return new Promise((resolve, reject) => {
    let cursor = db.find(query);

    if (sort) {
      cursor = cursor.sort(sort);
    }

    if (offset !== undefined) {
      cursor = cursor.skip(offset);
    }

    if (limit !== undefined) {
      cursor = cursor.limit(limit);
    }

    cursor.exec((err, docs) => {
      if (err) reject(err);
      else resolve(docs);
    });
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
