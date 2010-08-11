loadDataprovider("apple-trailers.js")   

function loadDataprovider(file){
    var head = document.getElementsByTagName('head').item(0)
    var scriptTag = document.getElementById('dataprovider');
    if(scriptTag) head.removeChild(scriptTag);
    script = document.createElement('script');
    script.type = 'application/ecmascript';
    script.src = "scripts/dataproviders/"+file;
    script.id = 'dataprovider';
    head.appendChild(script);
}