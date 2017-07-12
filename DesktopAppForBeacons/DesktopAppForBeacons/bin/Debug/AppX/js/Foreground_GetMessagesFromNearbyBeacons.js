var watcher = new Windows.Devices.Bluetooth.Advertisement.BluetoothLEAdvertisementWatcher();
watcher.scanningMode = Windows.Devices.Bluetooth.Advertisement.BluetoothLEScanningMode.active;
watcher.addEventListener("received", getMessagesForBeacon);
watcher.start();

function getMessagesForBeacon(args) {
    console.log(JSON.stringify(args));
}
