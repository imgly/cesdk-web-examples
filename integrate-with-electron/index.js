const { app, BrowserWindow, protocol } = require('electron')

// Make sure to enable access to the local file system. This is required
// in order to load PDF files and PSPDFKit dependencies from the local
// file system.
protocol.registerSchemesAsPrivileged([
	{ scheme: "file", privileges: { secure: true, standard: true } }
]);

// Keep a global reference of the window object. If you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false
		}
	})

	mainWindow.loadFile("index.html");

	// Emitted when the window is closed.
	mainWindow.on("closed", function() {
		// Dereference the window object to allow it to be garbage collected.
		mainWindow = null;
	});
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})
