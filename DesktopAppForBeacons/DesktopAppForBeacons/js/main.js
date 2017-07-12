window.onload = function () {
    axios.get("http://nearbycontentapi.azurewebsites.net/api/Content/All").then(res => {
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

        var element = document.getElementById('stuff');
        element.innerText = JSON.stringify(data);
    });
}