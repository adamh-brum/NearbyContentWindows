// Set the default app size
// Must be min 500 x 500
var appHeight = 750;
var appWidth = 500;
var view = Windows.UI.ViewManagement.ApplicationView.getForCurrentView();
view.tryResizeView({ height: appHeight, width: appWidth });
Windows.UI.ViewManagement.ApplicationView.preferredLaunchWindowingMode = Windows.UI.ViewManagement.ApplicationViewWindowingMode.preferredLaunchViewSize;
Windows.UI.ViewManagement.ApplicationView.preferredLaunchViewSize.height = appHeight;
Windows.UI.ViewManagement.ApplicationView.preferredLaunchViewSize.width = appWidth;

var contentAdded = [];
var tagTemplate = "<div class='tag'>[TAG]</div>"
var messageTemplate = "<div class='message'><div class='tags-container'>[TAGS]</div><div class='message-intro'><h2>[TITLE]</h2><h3>Beacon:[BEACON]</h3></div><div class='message-content'><p>[CONTENT]</p></div><div class='ratings-container'><a id='[CONTENTID]-up' class='ratings-link'><i class='fa fa-2x fa-thumbs-o-up' aria-hidden='true'></i></a><a id='[CONTENTID]-down' class='ratings-link'><i class='fa fa-2x fa-thumbs-o-down' aria-hidden='true'></i></a></div></div>";

function refresh() {
    var refreshButton = document.getElementById("refresh");
    refreshButton.childNodes[0].className = "fa fa-2x fa-spin fa-refresh";

    axios.get("http://nearbycontentapi.azurewebsites.net/api/Schedule/ByLocation?locationId=2d568358-66fb-11e7-907b-a6006ad3dba0").then(res => {
        var messagesContainerElement = document.getElementById('messagesContainer');
        res.data.forEach(function (element) {
            var contentAlreadyAdded = false;

            contentAdded.forEach(function (contentId) {
                if (element.id === contentId) {
                    contentAlreadyAdded = true;
                }
            }, this);

            if (!contentAlreadyAdded) {
                // Add
                var tags = "";
                if (element.tags) {
                    element.tags.forEach(function (tag) {
                        tags = tags + tagTemplate.replace("[TAG]", tag);
                    });
                }

                var message = messageTemplate.replace("[TAGS]", tags);
                message = message.replace("[TITLE]", element.contentShortDescription);
                message = message.replace("[BEACON]", element.locationName);
                message = message.replace("[CONTENT]", element.content);
                message = message.replace("[CONTENTID]", element.id);
                message = message.replace("[CONTENTID]", element.id);

                // Add the new message to the DOM
                messagesContainerElement.innerHTML = message + messagesContainerElement.innerHTML;

                // Now bind on click events for ratings
                var upRateHyperlink = document.getElementById(element.id + '-up');
                upRateHyperlink.onclick = function (event) {
                    var downRate = document.getElementById(element.id + '-down');
                    var upRate = document.getElementById(element.id + '-up');

                    if (upRate.className === "fa fa-2x fa-thumbs-up") {
                        // downrate this class
                        upRate.childNodes[0].className = "fa fa-2x fa-thumbs-o-up";
                    }
                    else {
                        // make sure message is now downrated
                        downRate.childNodes[0].className = "fa fa-2x fa-thumbs-o-down";

                        // uprate this class
                        upRate.childNodes[0].className = "fa fa-2x fa-thumbs-up";
                    }
                }

                var downRateHyperlink = document.getElementById(element.id + '-down');
                downRateHyperlink.onclick = function (event) {
                    var downRate = document.getElementById(element.id + '-down');
                    var upRate = document.getElementById(element.id + '-up');

                    if (downRate.className === "fa fa-2x fa-thumbs-down") {
                        // downrate this class
                        downRate.childNodes[0].className = "fa fa-2x fa-thumbs-o-down";
                    }
                    else {
                        // make sure message is now downrated
                        upRate.childNodes[0].className = "fa fa-2x fa-thumbs-o-up";

                        // uprate this class
                        downRate.childNodes[0].className = "fa fa-2x fa-thumbs-down";
                    }
                }

                contentAdded.push(element.id);
            }
        }, this);
    });

    refreshButton.childNodes[0].className = "fa fa-2x fa-refresh";
}

window.onload = function (event) {
    var refreshButton = document.getElementById("refresh");
    refreshButton.onclick = function (event) {
        refresh();
    }
}

refresh();