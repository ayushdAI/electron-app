const { app, BrowserWindow, nativeImage, Tray, Menu, ipcMain } = require('electron')
const path = require('path')
const { memoryUsage } = require('node:process');
const si = require('systeminformation')
const osquery = require('osquery'); 

app.setLoginItemSettings({
    openAtLogin: true,
})


const createWindow = () => {
    if (!tray) {
        createTray();
    }
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: path.join(__dirname, '/node-js.png'),
        frame: true,
    });

    mainWindow.loadFile("index.html")
    // mainWindow.on('closed', () => {
    //     mainWindow = null;
    // });
    cpuUsage(mainWindow);
}

// app.on('ready', createWindow);

//If all windows are closed, don't quit the app for now
app.on('window-all-closed', () => {
    if (process.platform == 'win32' || process.platform == 'win64') {
        console.log("App quit", process.platform)
    } else {
        app.dock.hide(); //for macOS
    }
});

//This is used to relaunch the app when the dock icon is clicked
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

async function getRamUsage() {
    try {
        // for (const [key, value] of Object.entries(memoryUsage())) {
        //     return(`Memory usage by ${key}, ${value / 1000000}MB `)
        // }
        si.mem((data) => {
            console.log(data);
            return {data};
        })
    } catch (error) {
        console.log(error, "error in memory usage")
    }
}

async function getSystemInfo() {
    try {
        const data = si.system();
        // console.log(si, "si");
        return data;
    } catch (error) {
        console.log("error in si", error);
    }
}

async function cpuUsage(mainWindow) {
    setTimeout(async () => {
        try {
            const sysInfo = await si.system();
            mainWindow.webContents.send("system-info", {sysInfo})
        } catch (error) {
            console.log("error in si",error);
        }
        // try {
            //     const networkInfo = await si.networkConnections();
        //     mainWindow.webContents.send("network-info", {networkInfo})
        // } catch (error) {
            //     console.log("error in si",error);
            // }
            try {
                const usbDevicesInfo = await si.usb();
                mainWindow.webContents.send("usb-info", {usbDevicesInfo})
            } catch (error) {
                console.log("error in si",error);
            }
            try {
            const audioInfo = await si.audio();
            mainWindow.webContents.send("audio-info", {audioInfo})
        } catch (error) {
            console.log("error in si",error);
        }
    }, 2000);

    setInterval(async () => {
        
        try {
            const ramData = await si.mem();
            mainWindow.webContents.send("ram-data", {ramData})
        } catch (error) {
            console.log(error, "err");
        }
    }, 1000);


    // setInterval(async () => {
    // }, 1000);

    // setInterval(async () => {
    // }, 1000);

    // setInterval(async () => {
    // }, 1000)



    ipcMain.on('check', (event, arg) => {
        console.log("check done");
        event.sender.send('check-res', "This is resp from main-js")
    })
}

//Tray Functionality
let tray = null;
function createTray() {
    const icon = path.join(__dirname, '/node-js.png')
    const trayIcon = nativeImage.createFromPath(icon);
    tray = new Tray(trayIcon);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Open App',
            click: () => {
                if (BrowserWindow.getAllWindows().length === 0) {
                    createWindow();
                }

                console.log("App opened from tray", BrowserWindow.getAllWindows().length)
            }
        },
        {
            label: 'Quit',
            click: () => {
                app.quit();
                console.log("App quit from tray")
            }
        }
    ])

    tray.setContextMenu(contextMenu);

}

app.on('ready', () => {
    createWindow();
    cpuUsage();
})