window.addEventListener("load", function(){
    
    var dataprovider = new Dataprovider();
    var showDescription; // timer
    var detail = 0;

    var search = document.getElementById("search");
    var covers = document.getElementById("covers");
    var details = document.getElementById("details");
    var titles = document.getElementById("titles");
        
    titles.addEventListener("keydown",function(event){
        if (event.keyIdentifier == "Right") {
            search.addClassName("unfocused");
        }
    }, false);
    
    titles.addEventListener("DOMFocusIn",function(e){
         search.removeClassName("unfocused");
    }, true);
    
    titles.addEventListener("DOMActivate",function(event){
        playTrailer(event.target.textContent);
    }, false);
    
    titles.addEventListener("change", function(event){
        if (!(event.currentTarget.getCurrentItemIndex()%7))        
        covers.getElementsByTagName("ul")[0].setOffset(event.currentTarget.getCurrentItemIndex()-1);
    }, false);
    
    // keypress is not supported in xbl
    titles.addEventListener("keypress",function(event){
         window.console.log(this.lastKey, event.keyCode )
	    if (event.keyCode in this.keys) {
             if (this.lastKey == event.keyCode) this.counter++;
             else {
                 this.lastKey = event.keyCode;
                 this.counter = 0;
             }
             var key = this.keys[event.keyCode][this.counter%this.keys[this.lastKey].length]
             for (var i=0,l=this.getTotalItems();i<l;i++) {
                 if (key == this.model.getItem(i)[0].toLowerCase()){
                     list.setOffset(i+1);   
                     covers.getElementsByTagName("ul")[0].setOffset(event.currentTarget.getCurrentItemIndex()-1);              
                     break;
                 }
             }
         }   
    }, false);

    covers.addEventListener("exit",function(e){
        titles.children[0].firstChild.focus() ;
    }, false);

    covers.addEventListener("keypress",function(event){
      if (event.keyCode == 49) dataprovider.getVideoSrc(showDetails)
    }, false);

    covers.addEventListener("DOMFocusIn",function(event){
        document.getElementById("description").children[0].textContent = "";
        var currentDetail = ++detail;
        dataprovider.getDetails(function(){
            if (detail == currentDetail)
            showDescription = setTimeout(function(){
                document.getElementById("description").children[0].textContent = dataprovider.description;
                document.getElementById("description").removeClassName("hidden");
            },2000)
        }, event.target.firstChild.getAttribute("alt"));
     }, false);
    
    covers.addEventListener("DOMFocusOut",function(event){
        clearTimeout(showDescription);
        document.getElementById("description").addClassName("hidden");
    }, false);

    covers.addEventListener("DOMActivate",function(event){
        var title = event.target.firstChild.getAttribute("alt");
        if(dataprovider.titles.current == title) {
            dataprovider.getVideoSrc(showDetails);            
        } else {
            playTrailer(title); 
        }
    }, false);

    covers.addEventListener("change", function(event){
        titles.setOffset(event.target.getCurrentItemIndex()-1);
    }, false);
    

    details.getElementsByTagName("ul")[0].addEventListener("DOMActivate", function(event){
        var children = event.currentTarget.children    
        switch(event.target){
            case children[0].firstChild:
                hideDetails();
            break;
            case children[1].firstChild:
                var video = document.getElementsByTagName("video")[0];
                window.console.log(video.getAttribute("class"));
                if (video.getAttribute("class").replace(/ /g,"") == "fullscreen") {
                    video.removeClassName(" fullscreen");
                    video.addClassName("reflect"); 
                } else {
                    video.removeClassName("reflect");
                    video.addClassName("fullscreen");                    
                }
            break;
            case children[2].firstChild:
                window.console.log("add to fovourite");
            break;
        }
    }, false); 
    
    search.addEventListener("exit",function(e){
        covers.firstChild.nextSibling.children[0].firstChild.focus()
    }, false);
    
    search.getElementsByTagName("a")[0].addEventListener("keydown",function(e){
         this.removeClassName("attention");
         document.getElementById("arrow-help").style.display = "none";
    }, false);
    
    function showDetails(){
        document.getElementById("overlay").addClassName("hidden"); 
        document.getElementById("navigation").addClassName("unfocused"); 
        document.getElementsByTagName("video")[0].addClassName("reflect");
        document.getElementById("description").addClassName("hidden");
        details.removeClassName("hidden"); 
       details.getElementsByTagName("button")[0].focus();
    }

    function hideDetails(){
        document.getElementById("overlay").removeClassName("hidden"); 
        document.getElementById("navigation").removeClassName("unfocused"); 
        document.getElementsByTagName("video")[0].removeClassName("reflect");
        document.getElementById("details").addClassName("hidden"); 
        var coverList = document.getElementById("covers").getElementsByTagName("ul")[0];
        coverList.children[coverList.currentFocusedItem].firstChild.focus();
    }

    function playTrailer(title){
        dataprovider.titles.current = title
        document.getElementById("overlay").getElementsByTagName("h1")[0].textContent = title;
        var definitionDescriptions = document.getElementById("overlay").getElementsByTagName("dd");
        definitionDescriptions[1].firstChild.setAttribute("src", dataprovider.getItem(title, "poster"))
        definitionDescriptions[2].textContent = dataprovider.getItem(title, "actors")[0]
        definitionDescriptions[3].textContent = dataprovider.getItem(title, "genre")[0]
        
        
        dataprovider.getVideoSrc(function(){
            console.log("playing:" + dataprovider.videoSrc)
            document.getElementById("details").children[1].textContent = dataprovider.description;
            var video = document.getElementsByTagName("video")[0]
            video.setAttribute("src", dataprovider.videoSrc);
            video.autobuffer = true
            //video.currentTime = 150
            video.load();
        })
    }
    
    // bind the list elements with the dataprovider
    var lists = search.getElementsByTagName("ul");
    for (var i=0, l=lists.length;i<l;i++) {
        var list = lists[i];
        list.bind = function (child, content) {
               child.firstChild.textContent = content;
               child.firstChild.setAttribute("href","#"+content.replace(/ /g, "_"));
               
        };
        list.setModel(dataprovider[list.getAttribute("id")])
    }

    // bind the cover element with the dataprovider
    cover = covers.getElementsByTagName("ul")[0];
    cover.bind = function (child, content) {
           child.getElementsByTagName("img")[0].setAttribute("src", dataprovider.getItem(content, "poster"));
           child.getElementsByTagName("img")[0].setAttribute("alt", content);
           if (child.children[0].hasAttribute("href")) {
               var title = content.replace(/ /g, "_");
               child.children[0].setAttribute("href", "#"+title);
               //child.children[0].setAttribute("name", title);
           }
    };
    cover.setModel(dataprovider.titles)        

    // Start the focus on the first list item 
    search.getElementsByTagName("a")[0].focus()

    // play the first trailer
    playTrailer(dataprovider.titles.current);
 
    window.resizeTo(window.innerWidth, window.innerWidth*0.5625);
    
}, false);

window.addEventListener("resize", function(){
    window.resizeTo(window.innerWidth, window.innerWidth*0.5625);
}, false);


// helper functions

Element.prototype.addClassName = function(className){
    if(!this.getAttribute("class")) this.setAttribute("class", "");
    var classNames = this.getAttribute("class").split(" ");
    if (classNames.indexOf(className) == -1) classNames.push(className)
    this.setAttribute("class", classNames.join(" "));
}

Element.prototype.removeClassName = function(className){
    this.setAttribute("class", this.getAttribute("class").replace(className, ""));
}

