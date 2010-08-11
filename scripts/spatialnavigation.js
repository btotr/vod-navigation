var directions = {    
    38 : "top", 
    39 : "right", 
    40 : "bottom", 
    37 : "left"  
}

function getNearestElement(target, direction){

    function getEuclideanDistance(point1, point2){
        return parseInt(Math.sqrt(Math.pow(Math.abs(point1[0] - point2[0]),2) + Math.pow(Math.abs(point1[1] - point2[1]),2)))
    }
    
    var focusableElements = document.getElementsByTagName("button");
    var nearestElement = null;
    var nearestPosition = 999;  
    var difference = 999;
   
   // window.console.log(target.firstChild.nextSibling);
   
    var width = target.offsetWidth;
    var height = target.offsetHeight;
    
    var x = target.getBoundingClientRect()["left"] + (width/2);
    var y = target.getBoundingClientRect()[directions[direction]];
    var opposite = directions[parseInt((direction+1)%4+37)];

    if (direction == 37 || direction == 39) {
        x = target.getBoundingClientRect()[directions[direction]]
        y = target.getBoundingClientRect()["top"] + (height/2)
    }
    
    var targetPoint = [x, y];

    for (var i=0,l=focusableElements.length, x, y;i<l;i++) {
        var element = focusableElements[i];
        if (target == element || parseInt(element.getAttribute("tabindex")) == -1) continue

        x = element.getBoundingClientRect()["left"];
        if (Math.abs(x-targetPoint[0]) > Math.abs(element.getBoundingClientRect()["right"]-targetPoint[0]))
            x = element.getBoundingClientRect()["right"];
        
        y = element.getBoundingClientRect()[opposite];

        if (direction == 37 || direction == 39) {
            x = element.getBoundingClientRect()[opposite]
            y = element.getBoundingClientRect()["top"];
            if (Math.abs(y-targetPoint[1]) > Math.abs(element.getBoundingClientRect()["bottom"]-targetPoint[1]))
                y = element.getBoundingClientRect()["bottom"];
        }
        
        ///window.console.log(element.id, targetPoint[1]-height , y);
        
        if (targetPoint[1] + height/2 < y && (direction == 38)) continue // top
        if (targetPoint[1] - height/2 > y && (direction == 40)) continue // down
        if (targetPoint[0] - width/2  > x && (direction == 39)) continue // right
        if (targetPoint[0] + width/2 < x && (direction == 37)) continue // left

        var difference = getEuclideanDistance(targetPoint, [x,y]);

        // window.console.log(element.id, difference, nearestPosition);

        if (difference <= nearestPosition) {
            nearestPosition = difference;
            nearestElement = element;
        }

    }
    if (!nearestElement) nearestElement = target
    return nearestElement
    
}


function setSpatialNavigation() {
    document.documentElement.addEventListener("keyup", function(e) {
        // window.console.log(e.target)
         if (e.which in directions) {       
              getNearestElement(e.target, e.which).focus();
         }
     }, false);
   
}

window.addEventListener("load", setSpatialNavigation, false)

/* 
    The getBoundingClientRect methods provide information about the position of 
    the border box edges of an element relative to the viewport.
*/

Element.prototype.getBoundingClientRect = function(){

    if (!this.textRectangle) {
            this.textRectangle = {};
            this.textRectangle.top = this.offsetTop;
            this.textRectangle.right = (this.offsetLeft + this.offsetWidth);
            this.textRectangle.bottom = (this.offsetTop + this.offsetHeight);
            this.textRectangle.left = this.offsetLeft;
    }
    
    // 
    return this.textRectangle;
}