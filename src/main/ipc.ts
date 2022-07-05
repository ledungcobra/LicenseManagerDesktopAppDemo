import electron from 'electron';
import fs from 'fs';
import { default as getMac, default as mac } from 'getmac';
import path from 'path';
import { socketListen } from './socket';

// @ts-ignore
const userDir = (electron.app || electron.remote.app).getPath('userData');
const todoPath = path.join(userDir, 'todo.json');

let server: any = null;

export function listen(ipcMain: Electron.IpcMain, app: Electron.App) {
  ipcMain.on('save-todos', (event, todos) => {
    fs.writeFile(todoPath, todos[0], (err) => {
      if (err) {
        return event.reply('save-todos-reply', 'Save file fail ' + err.message);
      }
      event.reply('save-todos-reply', 'Save file success');
    });
  });

  ipcMain.on('load-todos', (event) => {
    fs.readFile(todoPath, (err, data) => {
      if (err) {
        return event.reply('load-todos-reply', 'Load file fail ' + err.message);
      }
      event.reply('load-todos-reply', 'Load file success', data.toString());
    });
  });

  ipcMain.on('close', () => {
    // Close app
    app.quit();
  });

  ipcMain.on('open-browser', (event, args) => {
    const serverPort = 3005;

    let [cmd, address, appAddress] = args;
    if (server) {
      server.close();
    }

    switch (cmd) {
      case 'ACTIVATE':
        electron.shell.openExternal(
          `http://localhost:3000/activate?address=${address}&socketPort=${serverPort}&macAddress=${mac()}&appAddress=${appAddress}`
        );
        server = socketListen(event);
        break;
      case 'RESTORE':
        electron.shell.openExternal(
          `http://localhost:3000/restore?address=${address}&socketPort=${serverPort}&macAddress=${mac()}&appAddress=${appAddress}`
        );
        server = socketListen(event);
        break;
    }
  });

  ipcMain.on('get-user-dir', (evt) => {
    evt.reply('get-user-dir-reply', path.join(userDir, 'license.json'));
  });

  ipcMain.on('read-file', (evt, path) => {
    fs.readFile(path, 'utf8', (err, result) => {
      evt.reply('read-file-reply', { error: err, data: result });
    });
  });

  ipcMain.on('write-file', (evt, args) => {
    const [path, data] = args;

    fs.writeFile(path, data, (err) => {
      if (err) {
        return evt.reply('write-file-reply', { error: err, data: undefined });
      }
      return evt.reply('write-file-reply', { error: undefined, data });
    });
  });

  ipcMain.on('remove-file', (evt, filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        evt.reply('remove-file-reply', { error: err, data: undefined });
      } else {
        evt.reply('remove-file-reply', { error: undefined, data: filePath });
      }
    });
  });

  ipcMain.on('get-mac', (evt) => {
    try {
      evt.reply('get-mac-reply', { data: getMac(), error: undefined });
    } catch (e) {
      evt.reply('get-mac-reply', { data: undefined, error: e });
    }
  });

  ipcMain.on('remove-file', (evt, filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        evt.reply('remove-file-reply', { error: err, data: undefined });
      } else {
        evt.reply('remove-file-reply', { error: undefined, data: filePath });
      }
    });
  });
}
