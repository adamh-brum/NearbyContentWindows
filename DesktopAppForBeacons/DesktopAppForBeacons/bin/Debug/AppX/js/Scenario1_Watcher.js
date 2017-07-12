//// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
//// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
//// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
//// PARTICULAR PURPOSE.
////
//// Copyright (c) Microsoft Corporation. All rights reserved
//// This code is licensed under the MIT License (MIT).

(function () {
    "use strict";

    // Create and initialize a new watcher instance.
    // We will not configure the watcher at all, meaning all advertisements will be recieved (no filter).
    var watcher = new Windows.Devices.Bluetooth.Advertisement.BluetoothLEAdvertisementWatcher();

    var page = WinJS.UI.Pages.define("../Scenario1_Watcher.html", {
        ready: function (element, options) {
            document.getElementById("runButton").addEventListener("click", onRunButtonClick, false);
            document.getElementById("stopButton").addEventListener("click", onStopButtonClick, false);

            // Attach a handler to process the received advertisement. 
            // The watcher cannot be started without a Received handler attached
            watcher.addEventListener("received", onAdvertisementReceived, false);

            // Attach a handler to process watcher stopping due to various conditions,
            // such as the Bluetooth radio turning off or the Stop method was called
            watcher.addEventListener("stopped", onAdvertisementWatcherStopped, false);
        },
        unload: function (element, options) {
            // Remove local suspension handlers from the App since this page is no longer active.
            Windows.UI.WebUI.WebUIApplication.removeEventListener("suspending", onSuspending);
            Windows.UI.WebUI.WebUIApplication.removeEventListener("resuming", onResuming);

            // Make sure to stop the watcher when leaving the context. Even if the watcher is not stopped,
            // scanning will be stopped automatically if the watcher is destroyed.
            watcher.stop();

            // Always unregister the handlers to release the resources to prevent leaks.
            watcher.removeEventListener("received", onAdvertisementReceived);
            watcher.removeEventListener("stopped", onAdvertisementWatcherStopped);
        }
    });

    /// <summary>
    /// Invoked as an event handler when the Run button is pressed.
    /// </summary>
    /// <param name="args">Event data describing the conditions that led to the event.</param>
    function onRunButtonClick(args) {
        // Calling watcher start will start the scanning if not already initiated by another client.
        watcher.start();

        WinJS.log && WinJS.log("Watcher started.", "sample", "status");
    }

    /// <summary>
    /// Invoked as an event handler when the Stop button is pressed.
    /// </summary>
    /// <param name="args">Event data describing the conditions that led to the event.</param>
    function onStopButtonClick(args) {
        // Stopping the watcher will stop scanning if this is the only client requesting scan.
        watcher.stop();

        WinJS.log && WinJS.log("Watcher stopped.", "sample", "status");
    }

    /// <summary>
    /// Invoked as an event handler when an advertisement is received.
    /// </summary>
    /// <param name="eventArgs">Event data containing information about the advertisement event.</param>
    function onAdvertisementReceived(eventArgs) {
        // We can obtain various information about the advertisement we just received by accessing 
        // the properties of the EventArgs class

        // The timestamp of the event
        var timestamp = eventArgs.timestamp;

        // The type of advertisement
        var advertisementType = eventArgs.advertisementType;

        // The received signal strength indicator (RSSI)
        var rssi = eventArgs.rawSignalStrengthInDBm;

        // The local name of the advertising device contained within the payload, if any
        var localName = eventArgs.advertisement.localName;

        // Check if there are any manufacturer-specific sections.
        // If there is, print the raw data of the first manufacturer section (if there are multiple).
        var manufacturerDataString = "";
        var manufacturerSections = eventArgs.advertisement.manufacturerData;
        if (manufacturerSections.size > 0) {
            // Only print the first one of the list
            var manufacturerDataSection = manufacturerSections[0];
            var data = new Array(manufacturerDataSection.data.length);
            var reader = Windows.Storage.Streams.DataReader.fromBuffer(manufacturerDataSection.data);
            reader.readBytes(data);

            // Print the company ID + the raw data in hex format
            manufacturerDataString += "0x" + manufacturerDataSection.companyId.toString(16) + ": ";
            data.forEach(
                function buildString(value) { manufacturerDataString += value.toString(16) + " "; }
            );
        }

        // Display these information on the list
        document.getElementById("receivedAdvertisementListBox").add(new Option("[" + timestamp.getHours() + ":" + timestamp.getMinutes() +
            ":" + timestamp.getSeconds() + "]: type=" + advertisementType.toString() + ", rssi=" + rssi.toString() + ", name=" +
            localName + ", manufacturerData=[" + manufacturerDataString + "]"));
    }

    /// <summary>
    /// Invoked as an event handler when the watcher is stopped or aborted.
    /// </summary>
    /// <param name="eventArgs">Event data containing information about why the watcher stopped or aborted.</param>
    function onAdvertisementWatcherStopped(eventArgs) {
        // Notify the user that the watcher was stopped
        WinJS.log && WinJS.log("Watcher stopped or aborted: " + eventArgs.error.toString(), "sample", "status");
    }
})();