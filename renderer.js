const { ipcRenderer } = require('electron')

ipcRenderer.on("ram-data", (e, data) => {
    console.log(data, "data");
    document.getElementById("total").innerText = "Total: "+data.ramData.total/1000000+'MB'
    document.getElementById("free").textContent = "Free: " + data.ramData.free/1000000+'MB'
    document.getElementById("used").textContent = "Used: "+data.ramData.used/1000000+'MB'
    document.getElementById("act").textContent = "Active: " + data.ramData.active/1000000+'MB'
    document.getElementById("avb").textContent = "Available: "+data.ramData.available/1000000+'MB'
    document.getElementById("buffers").textContent = "Buffers: "+data.ramData.buffers/1000000+'MB'
    document.getElementById("cached").textContent = "Cached: "+data.ramData.cached/1000000+'MB'
    document.getElementById("slab").textContent = "Slab: "+data.ramData.slab
    document.getElementById("sTotal").textContent = "Swap Total: "+data.ramData.swaptotal/1000000+'MB'
    document.getElementById("sUsed").textContent = "Swap Used: "+data.ramData.swapused/1000000+'MB'
    document.getElementById("sFree").textContent = "Swap Free: "+data.ramData.swapfree/1000000+'MB'
})

ipcRenderer.on('check-res', (event, arg) =>{
    console.log(arg, "arg");
    document.getElementById("check-p").textContent = arg
})

ipcRenderer.on("system-info", (e, data) => {
    console.log(data, "data");
    document.getElementById('endpoint-security').textContent = data;
})

// ipcRenderer.on("network-info", (e, data) => {
//     console.log(data, "data");
//     document.getElementById('network-info').textContent = data;
// })

ipcRenderer.on("usb-info", (e, data) => {
    console.log(data.usbDevicesInfo.length, "data");
    document.getElementById('usb-info').textContent = data;
    
    function UsbData() {
        for (let index = 0; index < data.usbDevicesInfo.length; index++) {
            var element = document.createElement('LI');
            // element.type = "div";
            element.innerText = data?.usbDevicesInfo[index].name;
            document.getElementById('usb-info').appendChild(element);
            console.log(document.getElementById('usb-info'), "element");
        }
    }
    UsbData();
})

ipcRenderer.on("audio-info", (e, data) => {
    console.log(data, "data");
    document.getElementById('audio-info').textContent = data;
})