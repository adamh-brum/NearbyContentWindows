window.onload = function () {
    axios.get("http://nearbycontentapi.azurewebsites.net/api/Schedule/ByLocation?locationId=2d568358-66fb-11e7-907b-a6006ad3dba0").then(res => {
        console.log('content recieved');
        var data = [];
        res.data.forEach(function (element) {
            data.push({
                id: element.id,
                content: element.content,
                title: element.title,
                tags: element.tags ? element.tags : []
            })
        }, this);
    });
}