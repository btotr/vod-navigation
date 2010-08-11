var self = null;

function Trailers() {
    this.baseUrl = "http://www.apple.com/trailers/";
    this.request = 0;
    this.name = "apple";
    this.callback = null;
    self = this;
}

Trailers.prototype.currentTrailers;
Trailers.prototype.currentTrailer;
Trailers.prototype.allTrailers;
Trailers.prototype.genres = [];
Trailers.prototype.description;

function searchCallback(result) {
    return result.results
}

Trailers.prototype.getAllTrailers = function(callback) {
    if (localStorage.trailers == null){
        var client = new XMLHttpRequest();
        client.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200) {
                localStorage.trailers = this.responseText
                        
                self.allTrailers = eval(this.responseText);
                self.currentTrailers = self.allTrailers;
                self.getGenres()
                callback.call(this);
            }
        };
        client.open("GET", this.baseUrl+"home/feeds/genres.json");
        client.send();
    }  else {
        self.allTrailers = eval(localStorage.trailers);
        self.currentTrailers = self.allTrailers;
        self.getGenres()
        callback.call(this);
    }    
};

Trailers.prototype.getGenres = function() {
        for (var i in self.allTrailers) {
            var trailer = self.allTrailers[i];
            if (self.genres.indexOf(trailer.genre[0]) == -1) self.genres.push(trailer.genre[0])
        }
    return self.genres
}

Trailers.prototype.getTrailersByKeyword = function(query, callback) {
    if (query == "") return
    this.getTrailers("home/scripts/quickfind.php?callback=searchCallback&q=" + query, callback);
};

Trailers.prototype.getLastAddedTrailers = function(callback) {
    this.getTrailers("home/feeds/just_added.json", callback);   
};

var mrequest = 0
Trailers.prototype.getTrailers = function(url, callback) {
    var client = new XMLHttpRequest();
    var request = ++mrequest;
    
    client.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
            if (request == mrequest) {
                self.currentTrailers = eval(this.responseText);
                callback.call();
            }
            
        }
    };
    client.open("GET", this.baseUrl+url);
    client.send();
};

Trailers.prototype.getTrailerSrc = function(location, callback) {
    var url = "http://www.apple.com/moviesxml/s/"+location.replace("/trailers/", "")+"index.xml"
    var client = new XMLHttpRequest();
    var request = ++mrequest;

    client.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
            if (request == mrequest) {
                var itms = this.responseXML;
        
                var trailer = "";
                var items = itms.getElementsByTagNameNS("http://www.apple.com/itms/","string");
                for (var i in items) {
                    try {
                        var quality = items[i].textContent.substr(-8, 8)
                    } catch(e){}
                    if (quality == "480p.mov" ||  quality == "640w.mov") {
                        trailer = items[i]; 
                        //break;
                    }

                    //TODO switch HD
                    /*if (quality == "080p.mov" && app.resolution == "HD") {
                        trailer =  items[i];
                        break;
                    }*/

                }
                // Get the description from itms aswell
                self.description = itms.getElementsByTagNameNS("http://www.apple.com/itms/","TextView")[2].getElementsByTagNameNS("http://www.apple.com/itms/","SetFontStyle")[0].textContent;
                self.currentTrailer = trailer.textContent;
                callback.call();    
            }        
        }
    };
    client.open("GET", url);
    client.send();
};


Trailers.prototype.getTrailersByGenre = function(genre, callback){
    self.currentTrailers = []; 
    for (var i in self.allTrailers) {
        var trailer = self.allTrailers[i]
        for (var t in trailer.genre) {
            var genreItem = trailer.genre[t];
            if (genreItem == genre) self.currentTrailers.push(trailer); 
        }
    }
    callback.call();
}

Trailers.prototype.getTrailersByActor = function(actor, callback){
    self.currentTrailers = []; 
    for (var i in self.allTrailers) {
        var trailer = self.allTrailers[i]
        for (var t in trailer.actors){
            var actorItem = trailer.actors[t]
            if (actorItem == actor) self.currentTrailers.push(trailer);
        }  
    }
    callback.call();
}

Trailers.prototype.getTrailersByTitle = function(callback){
    self.currentTrailers = []; 
    for (var i in self.allTrailers) {
        var trailer = self.allTrailers[i];
        // TODO local store
        /*for each (var titleItem in store.get("bookmarks")){
            if (titleItem == trailer.title) self.currentTrailers.push(trailer);  
        }*/
    }
    callback.call();
}

Trailers.prototype.getCurrentTrailer = function() {
    return self.currentTrailer;
};

Trailers.prototype.getCurrentTrailers = function() {
    return self.currentTrailers;
};

Trailers.prototype.getDescription = function() {
    return self.description;
};
