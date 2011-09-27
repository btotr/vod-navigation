function Dataprovider(callback) {
    var dataprovider = this;
    var database;
    try { // http://www.w3.org/TR/webdatabase/ no longer supported
        database = window.openDatabase("vodnavigation", "0.2", "vodnavigation", 1048576);    
    } catch (ignore){}
       
    var trailers;


    dataprovider.channels  = {
        current : "Apple trailers",
        setChannel : function(current){
            dataprovider.channels.current = current;
        },
        getItem : function(index) { 
             if(index !== false) return ["Apple trailers","Favourites", "Current"][index];
             else return ""
        }, 
        getLength : function() {
            return 2;
        }
    }

    dataprovider.genres  = {
        current : "All",
        genres : [],
        setGenres : function(callback){
            dataprovider.genres.current = "All";
            switch(dataprovider.channels.current){
                case "Apple trailers":
                    dataprovider.genres.genres = [];
                    for (var i=0,l=trailers.genres.length;i<l;i++){
                         dataprovider.genres.genres.push([trailers.genres[i]])
                    }
                    dataprovider.genres.genres.sort()
                    dataprovider.genres.genres.unshift(["All"]);
                     
                    if(callback)
                    callback.call()
                break;
                case "Favourites":
                    dataprovider.genres.genres = [["All"]];
                    if(callback)
                    callback.call()
                break;
            }
        },
        setGenre : function(genre) {
            dataprovider.genres.current = genre;
        },
        getItem : function(index) { 
            if(index !== false) return dataprovider.genres.genres[index][0]
            else return ""
        }, 
        getLength : function() {
            var length = 0;
              switch(dataprovider.channels.current){
                  case "Apple trailers":
                    length = trailers.genres.length;
                  break;
              }
            return length;
        }
    }
    
    dataprovider.titles  = {
        current : "",
        titles : [],
        setTitles : function(callback){
            dataprovider.titles.current = "All";
            switch(dataprovider.channels.current){
                case "Apple trailers":
                    dataprovider.titles.titles = [];
                    for (var i=0,l=trailers.currentTrailers.length;i<l;i++){
                         dataprovider.titles.titles.push([trailers.currentTrailers[i].title])
                    }
                    dataprovider.titles.titles.sort()
                    dataprovider.titles.current = dataprovider.titles.titles[0]
                    callback.call()
                break;
                case "Favourites":
                    callback.call()
                break;
            }
        },
        setTitle : function(title) {
            dataprovider.titles.current = title;
        },
        getItem : function(index) { 
            if(index !== false) return dataprovider.titles.titles[index][0]
            else return ""
        }, 
        getLength : function() {
              var length = 0;
              switch(dataprovider.channels.current){
                  case "Apple trailers":
                    length = trailers.currentTrailers.length;
                  break;
              }
            return length;
        }
    }
    
    dataprovider.getItem = function(title, item){
        for (var i=0,l=trailers.currentTrailers.length;i<l;i++){
             if (trailers.currentTrailers[i].title == title)
                return trailers.currentTrailers[i][item];
        }
    }
    
    dataprovider.videoSrc = "";
    dataprovider.description = "";
  
    dataprovider.getDetails = function(callback, title) {
        var title = title;
        database.transaction(function(tx) {
            tx.executeSql("SELECT videoSrc, description FROM details WHERE title = ?", [title || dataprovider.titles.current], function(tx, result) {
                if (!result.rows.length) {
                    trailers.getTrailerSrc(dataprovider.getItem(title || dataprovider.titles.current, "location"), function(){
                        dataprovider.videoSrc = trailers.currentTrailer;
                        dataprovider.description = trailers.description;
                        database.transaction(function (tx) {
                            tx.executeSql("INSERT INTO details (title, videoSrc, description) VALUES (?, ?, ?)", [dataprovider.titles.current, trailers.currentTrailer, trailers.description]);
                        });            
                        callback.call();
                    });
                } else {
                    dataprovider.videoSrc = result.rows.item(0).videoSrc;
                    dataprovider.description = result.rows.item(0).description;
                     callback.call();
                }
            });
        }, function(tx) {
            database.transaction(function(tx) {
                tx.executeSql('CREATE TABLE details ("title","videoSrc","description")', [], function(result) { 
                    dataprovider.getDetails();
                });
            });      
        });        
    }
    
    dataprovider.getVideoSrc = function(callback){
        dataprovider.getDetails(callback);
    } 
    
    dataprovider.getDescription  = function(callback){
        dataprovider.getDetails(callback);
    }
    
     if (dataprovider.channels.current == "Apple trailers") {
            trailers = new Trailers();                
              trailers.getAllTrailers(function() {
                dataprovider.titles.setTitles(function(){
                    dataprovider.genres.setGenres(function(){
                        //callback.call();
                    });
                });
            });   
        } 
}


    


