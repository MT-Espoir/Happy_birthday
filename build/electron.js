const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
// Thay thế dòng này:
// const isDev = require('electron-is-dev');
// Bằng cách kiểm tra trực tiếp:
const isDev = !app.isPackaged;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'favicon.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  mainWindow.setFullScreen(true);

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, 'index.html')}`
  );

  // Tắt menu trong production
  if (!isDev) {
    mainWindow.setMenu(null);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();
  
  // Đăng ký phím tắt ESC để thoát ứng dụng
  globalShortcut.register('Escape', () => {
    app.quit();
  });
});

app.on('will-quit', () => {
  // Hủy đăng ký tất cả các phím tắt khi ứng dụng sắp đóng
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});