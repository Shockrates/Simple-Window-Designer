// Boolean variable to determine whether to draw a horizontal line
var  drawHorizontalLine = false;
// Boolean variable to determine whether to draw a vertical line
var  drawVerticalLine = false;
var rects = [];
var seperators = [];
document.addEventListener("DOMContentLoaded", function() {

    // Rectangle coordinates and dimensions
    var rectX = 50;
    var rectY = 50;
    var rectWidth = 200;
    var rectHeight = 375;
    var rectStroke = 25;

    

 
    rects = [
        {
            "name": "rect_0",
            "rectX": rectX+rectStroke/2,
            "rectY": rectY+rectStroke/2,
            "rectWidth": rectWidth-rectStroke,
            "rectHeight" :rectHeight-rectStroke

        }
    ]
    console.log(rects);
    

    const canvas = document.getElementById('myCanvas');
    const width = (canvas.width = window.innerWidth/1.5);
    const height = (canvas.height = window.innerHeight/1.5);
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.lineWidth = rectStroke; // Set the line width to 5 pixels (adjust as needed)
    ctx.strokeStyle = '#7d7b79'; // Set stroke color to red (you can change it to any color)
    ctx.strokeRect(rectX, rectY, rectWidth, rectHeight); // Draw a rectangle outline 
    
    drawRectOutline(rects[0],2,'#FF0000')

    function drawRectOutline(rect, stroke, style){
        ctx.lineWidth = stroke; // Set the line width to 5 pixels (adjust as needed)
        ctx.strokeStyle = style; // Set stroke color to red (you can change it to any color)
        ctx.strokeRect(rect.rectX, rect.rectY, rect.rectWidth, rect.rectHeight); // Draw a rectangle outline 
    }

    // Event listener for mouse click
    canvas.addEventListener('click', function (e) {
        var mouseX = e.clientX - canvas.getBoundingClientRect().left;
        var mouseY = e.clientY - canvas.getBoundingClientRect().top;

        var rect =  getRectangleCName(mouseX, mouseY);
        // Check if the click is within the empty space of the rectangle
        if (

            rect &&
            drawHorizontalLine
        ) {
            // Draw a horizontal line at the height of the mouse click
            //ctx.lineWidth = rectStroke; // Set the line width to 5 pixels (adjust as needed)
            //ctx.strokeStyle = '#7d7b79'; // Set stroke color to red (you can change it to any color)
            // ctx.beginPath();
            // ctx.moveTo(rect.rect.rectX-2, mouseY);
            // ctx.lineTo(rect.rect.rectX + rect.rect.rectWidth+2, mouseY);
            // ctx.stroke();
            ctx.fillStyle = '#7d7b79';
            ctx.fillRect(rect.rect.rectX-2, mouseY-(rectStroke/2), rect.rect.rectWidth+4, rectStroke);

            seperators.push({
                "rectX":rect.rect.rectX-2, 
                "rectY":mouseY-(rectStroke/2), 
                "rectWidth":rect.rect.rectWidth+4, 
                "rectHeight":rectStroke
            })

            rectVerticalSplit(mouseX, mouseY, rect)
        } else if(
            rect &&
            drawVerticalLine
        ){
            // Draw a vertical line at the height of the mouse click
            // ctx.lineWidth = rectStroke; // Set the line width to 5 pixels (adjust as needed)
            // ctx.strokeStyle = '#7d7b79'; // Set stroke color to red (you can change it to any color)
            // ctx.beginPath();
            // ctx.moveTo(mouseX, rect.rect.rectY-2);
            // ctx.lineTo(mouseX, rect.rect.rectY + rect.rect.rectHeight+2 );
            // ctx.stroke();

            ctx.fillStyle = '#7d7b79';
            ctx.fillRect(mouseX-(rectStroke/2), rect.rect.rectY-2, rectStroke, rect.rect.rectHeight+4,);
            
            seperators.push({
                "rectX":mouseX-(rectStroke/2), 
                "rectY":rect.rect.rectY-2, 
                "rectWidth":rectStroke, 
                "rectHeight":rect.rect.rectHeight+4
            })

            rectHorizontalSplit(mouseX, mouseY, rect)
        } else if (
            !drawHorizontalLine && !drawVerticalLine
        ) {
            // Check which rectangle was clicked
            var clickedName = getRectangleCName(mouseX, mouseY);

            // Log the color of the clicked rectangle
            let message = (clickedName) ? clickedName.is+"_"+clickedName.pos : "No rectangle was clicked";
            console.log(message);
        }
    });

   

    

   // Function to get the name of the clicked rectangle
    function getRectangleCName(mouseX, mouseY) {
        for (var i = 0; i < rects.length; i++) {
            var rect = rects[i];
            if (
                mouseX >= rect.rectX &&
                mouseX <= rect.rectX + rect.rectWidth &&
                mouseY >= rect.rectY &&
                mouseY <= rect.rectY + rect.rectHeight
            ) {
                return {"pos":i, "is":"oppening" ,"rect": rect};
            }
        }
        for (var i = 0; i < seperators.length; i++) {
            var rect = seperators[i];
            if (
                mouseX >= rect.rectX &&
                mouseX <= rect.rectX + rect.rectWidth &&
                mouseY >= rect.rectY &&
                mouseY <= rect.rectY + rect.rectHeight
            ) {
                return {"pos":i, "is":"seperator", "rect": rect};
            }
        }
        return null; // Return null if no rectangle was clicked
    }

    function rectVerticalSplit(mouseX, mouseY, rectDef){
        let rect= rectDef.rect
        //console.log(rect);
        var rect1 = {
            "rectX": rect.rectX,
            "rectY": mouseY+(rectStroke/2),
            "rectWidth": rect.rectWidth,
            "rectHeight" :rect.rectY+rect.rectHeight-mouseY-rectStroke/2
        }
        var rect2 = {
            "rectX": rect.rectX,
            "rectY": rect.rectY,
            "rectWidth": rect.rectWidth,
            "rectHeight" :mouseY-rect.rectY-rectStroke/2
        }

        rects.splice( rectDef.pos, 1, rect1, rect2);
    
        for (const rect of rects) {
            //ctx.strokeRect(rect.rectX, rect.rectY, rect.rectWidth, rect.rectHeight); // Draw a rectangle outline
            drawRectOutline(rect,2,'#FF0000')
        }

    }

    function rectHorizontalSplit(mouseX, mouseY, rectDef){
        let rect= rectDef.rect
        
        var rect1 = {
            "rectX": rect.rectX,
            "rectY": rect.rectY,
            "rectWidth": mouseX-rect.rectX-rectStroke/2,
            "rectHeight": rect.rectHeight,
        }
        var rect2 = {
            "rectX": mouseX+(rectStroke/2),
            "rectY": rect.rectY,
            "rectWidth": rect.rectX + rect.rectWidth-mouseX-rectStroke/2,
            "rectHeight" :rect.rectHeight,
        }
        //console.log(mouseX, rect.rectWidth);
        rects.splice( rectDef.pos, 1, rect1, rect2);
 
        for (const rect of rects) {
            //ctx.strokeRect(rect.rectX, rect.rectY, rect.rectWidth, rect.rectHeight); // Draw a rectangle outline
            drawRectOutline(rect,2,'#FF0000')
        }
       

    }
   
})

// Function to toggle the boolean variable
function toggleHDrawing() {
    drawHorizontalLine = !drawHorizontalLine;
    drawVerticalLine = false;
} 

function toggleVDrawing() {
    drawHorizontalLine = false;
    drawVerticalLine = !drawVerticalLine;
} 

function showRectTable(){
    console.log(rects);
}


