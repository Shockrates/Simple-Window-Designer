// Boolean variable to determine whether to draw a horizontal line
var  drawHorizontalLine = false;
// Boolean variable to determine whether to draw a vertical line
var  drawVerticalLine = false;
var rects = [];
var seperators = [];
var frames = [];

var productWindow = {
    rectX: 10,
    rectY: 10,
    rectWidth: 200,
    rectHeight: 375,
    rectStroke: 25,
    rects: [],
    seperators: [],
    frames: [],

}

// Rectangle coordinates and dimensions
// var rectX = 10;
// var rectY = 10;
// var rectWidth = 200;
// var rectHeight = 375;
// var rectStroke = 25;

document.addEventListener("DOMContentLoaded", function() {
    
    function getWindowWidth(){
        return productWindow.rectWidth;
    }
    function getWindowHeight(){
        return productWindow.rectHeight; 
    }

    const canvas = document.getElementById('myCanvas');
    const width = (canvas.width = window.innerWidth/1.5);
    const height = (canvas.height = window.innerHeight/1.5);
    const ctx = canvas.getContext("2d");

    
        const topCanvas = document.createElement("canvas");
        topCanvas.style.zIndex = "1"
        // set size:
        topCanvas.width = canvas.width;
        topCanvas.height = canvas.height;
        const tctx = topCanvas.getContext("2d");
        // insert into DOM on top:
        canvas.parentNode.insertBefore(topCanvas, canvas);

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    // ctx.lineWidth = rectStroke; // Set the line width to 5 pixels (adjust as needed)
    // ctx.strokeStyle = '#7d7b79'; // Set stroke color to red (you can change it to any color)
    // ctx.strokeRect(rectX, rectY, rectWidth, rectHeight); // Draw a rectangle outline 
    
    drawDrawFrame(productWindow.rectX, productWindow.rectY, productWindow.rectWidth, productWindow.rectHeight, productWindow.rectStroke)
    //drawRectOutline(rects[0],2,'#FF0000')

    function drawDrawFrame(x0, y0, width, height, stroke){

        frames = [
            {pos:"top",vertTable:getVertices("top",x0, y0, width, height, stroke)},
            {pos:"bottom",vertTable:getVertices("bottom",x0, y0, width, height, stroke)},
            {pos:"left",vertTable:getVertices("left",x0, y0, width, height, stroke)},
            {pos:"right",vertTable:getVertices("right",x0, y0, width, height, stroke)},
        ];

        if (productWindow.rects.length == 0) {
            console.log("This must be print only once");
            productWindow.rects = [
                {
                    "name": "rect_0",
                    "rectX": productWindow.rectX+productWindow.rectStroke,
                    "rectY": productWindow.rectY+productWindow.rectStroke,
                    "rectWidth": getWindowWidth()-2*productWindow.rectStroke,
                    "rectHeight" :getWindowHeight()-2*productWindow.rectStroke,
                    "top": "frame_top",
                    "bottom": "frame_bottom",
                    "left": "frame_left",
                    "right": "frame_right"
                }
            ]
        }
        
        for (const frame of frames) {
            drawShapeFromVertices(frame.vertTable);
        }
        
    }

    function drawShapeFromVertices(vertices) {
        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);

        for (var i = 1; i < vertices.length; i++) {
            ctx.lineTo(vertices[i].x, vertices[i].y);
        }

        ctx.closePath();
        ctx.fillStyle = '#7d7b79'; // Set the fill color to #7d7b79
        ctx.fill();
    }

    function getVertices(position, x0, y0, width, height, stroke){
        var vertices = []
        switch (position) {
            case "top":
                vertices=[
                    {x:x0,y:y0},
                    {x:x0+width,y:y0},
                    {x:x0+width-stroke,y:y0+stroke},
                    {x:x0+stroke,y:y0+stroke},
                ]
                break;
            case "left":
                vertices=[
                    {x:x0,y:y0},
                    {x:x0,y:y0+height},
                    {x:x0+stroke,y:y0+height-stroke},
                    {x:x0+stroke,y:y0+stroke},
                ]
                break;
            case "bottom":
                vertices=[
                    {x:x0,y:y0+height},
                    {x:x0+width,y:y0+height},
                    {x:x0+width-stroke,y:y0+height-stroke},
                    {x:x0+stroke,y:y0+height-stroke},
                ]
                break;
            case "right":
                vertices=[
                    {x:x0+width,y:y0},
                    {x:x0+width,y:y0+height},
                    {x:x0+width-stroke,y:y0+height-stroke},
                    {x:x0+width-stroke,y:y0+stroke},
                ]
                break;
            default:
                break;
        }

        return vertices;
    }

    function drawRectOutline(shape, stroke, style){
        tctx.lineWidth = stroke; // Set the line width to 5 pixels (adjust as needed)
        tctx.strokeStyle = style; // Set stroke color to red (you can change it to any color)
       
        if (typeof shape.pos === 'string') {
           
            tctx.beginPath();
            tctx.moveTo(shape.vertTable[0].x, shape.vertTable[0].y);
            for (var i = 0; i < shape.vertTable.length; i++) {
                tctx.lineTo(shape.vertTable[i].x, shape.vertTable[i].y);
                
            }
            tctx.closePath();
            tctx.stroke();
        }
        tctx.strokeRect(shape.rectX, shape.rectY, shape.rectWidth, shape.rectHeight); // Draw a rectangle outline 
    }

    // Event listener for mouse click
    topCanvas.addEventListener('click', function (e) {
        var mouseX = e.clientX - topCanvas.getBoundingClientRect().left;
        var mouseY = e.clientY - topCanvas.getBoundingClientRect().top;
        var rect =  getClickedShape(mouseX, mouseY);
        // Check if the click is within the empty space of the rectangle
        if (

            rect &&
            drawHorizontalLine
        ) {
            ctx.fillStyle = '#7d7b79';
            ctx.fillRect(rect.rect.rectX-2, mouseY-(productWindow.rectStroke/2), rect.rect.rectWidth+4, productWindow.rectStroke);

            productWindow.seperators.push({
                "rectX":rect.rect.rectX-2, 
                "rectY":mouseY-(productWindow.rectStroke/2), 
                "rectWidth":rect.rect.rectWidth+4, 
                "rectHeight":productWindow.rectStroke
            })

            rectVerticalSplit(mouseX, mouseY, rect, productWindow.seperators.length-1)
        } else if(
            rect &&
            drawVerticalLine
        ){
            ctx.fillStyle = '#7d7b79';
            ctx.fillRect(mouseX-(productWindow.rectStroke/2), rect.rect.rectY-2, productWindow.rectStroke, rect.rect.rectHeight+4,);
            
            productWindow.seperators.push({
                "rectX":mouseX-(productWindow.rectStroke/2), 
                "rectY":rect.rect.rectY-2, 
                "rectWidth":productWindow.rectStroke, 
                "rectHeight":rect.rect.rectHeight+4
            })

            rectHorizontalSplit(mouseX, mouseY, rect, productWindow.seperators.length-1)
        } else if (
            !drawHorizontalLine && !drawVerticalLine
        ) {
            // Check which rectangle was clicked
            var clickedName = getClickedShape(mouseX, mouseY);
            if (clickedName) {
                tctx.clearRect(0, 0, topCanvas.width, topCanvas.height);
                drawRectOutline(clickedName.rect,4,'#FF0000')
            }
            

            // Log the color of the clicked rectangle
            let message = (clickedName) ? clickedName.is+"_"+clickedName.pos : "No rectangle was clicked";
            console.log(message);
        }
    });


   // Function to get the name of the clicked rectangle
    function getClickedShape(mouseX, mouseY) {
        for (var i = 0; i < productWindow.rects.length; i++) {
            var rect = productWindow.rects[i];
            if (
                mouseX >= rect.rectX &&
                mouseX <= rect.rectX + rect.rectWidth &&
                mouseY >= rect.rectY &&
                mouseY <= rect.rectY + rect.rectHeight
            ) {
                return {"pos":i, "is":"oppening" ,"rect": rect};
            }
        }
        for (var i = 0; i < productWindow.seperators.length; i++) {
            var rect = productWindow.seperators[i];
            if (
                mouseX >= rect.rectX &&
                mouseX <= rect.rectX + rect.rectWidth &&
                mouseY >= rect.rectY &&
                mouseY <= rect.rectY + rect.rectHeight
            ) {
                return {"pos":i, "is":"seperator", "rect": rect};
            }
        }
        for (const frame of frames) {
            ctx.beginPath();
            ctx.moveTo(frame.vertTable[0].x, frame.vertTable[0].y);

            for (var i = 1; i < frame.vertTable.length; i++) {
                ctx.lineTo(frame.vertTable[i].x, frame.vertTable[i].y);
            }

            ctx.closePath();
            if (ctx.isPointInPath(mouseX, mouseY)) {
                return {"pos":frame.pos, "is":"frame", "rect": frame} 
            }
            
        }
        return null; // Return null if no rectangle was clicked
    }

    function rectVerticalSplit(mouseX, mouseY, rectDef, seperator){
        let rect= rectDef.rect
        //console.log(rect);
        var rect1 = {
            "rectX": rect.rectX,
            "rectY": mouseY+(productWindow.rectStroke/2),
            "rectWidth": rect.rectWidth,
            "rectHeight" :rect.rectY+rect.rectHeight-mouseY-productWindow.rectStroke/2,
            "top": seperator,
            "bottom": rect.bottom,
            "left": rect.left,
            "right": rect.right
        }
        var rect2 = {
            "rectX": rect.rectX,
            "rectY": rect.rectY,
            "rectWidth": rect.rectWidth,
            "rectHeight" :mouseY-rect.rectY-productWindow.rectStroke/2,
            "top": rect.top,
            "bottom": seperator,
            "left": rect.left,
            "right": rect.right
        }

        productWindow.rects.splice( rectDef.pos, 1, rect1, rect2);
    
        // for (const rect of rects) { 
        //     drawRectOutline(rect,2,'#FF0000')// Draw a rectangle outline
        // }

    }

    function rectHorizontalSplit(mouseX, mouseY, rectDef, seperator){
        let rect= rectDef.rect
        
        var rect1 = {
            "rectX": rect.rectX,
            "rectY": rect.rectY,
            "rectWidth": mouseX-rect.rectX-productWindow.rectStroke/2,
            "rectHeight": rect.rectHeight,
            "top": rect.top,
            "bottom": rect.bottom,
            "left": rect.left,
            "right": seperator
        }
        var rect2 = {
            "rectX": mouseX+(productWindow.rectStroke/2),
            "rectY": rect.rectY,
            "rectWidth": rect.rectX + rect.rectWidth-mouseX-productWindow.rectStroke/2,
            "rectHeight" :rect.rectHeight,
            "top": rect.top,
            "bottom": rect.bottom,
            "left": seperator,
            "right": rect.right
        }
        //console.log(mouseX, rect.rectWidth);
        productWindow.rects.splice( rectDef.pos, 1, rect1, rect2);
 
        // for (const rect of rects) {
        //     drawRectOutline(rect,2,'#FF0000')// Draw a rectangle outline
        // }
       

    }

    document.getElementById('updateBtn').addEventListener('click',function(e){
        
        // Get the input field value
        const widthValue = parseFloat(document.getElementById('width').value);
        const heightValue = parseFloat(document.getElementById('height').value);

        updateDimensions(productWindow, widthValue, heightValue);
        // Update the variables
        productWindow.rectWidth = widthValue;
        productWindow.rectHeight = heightValue;
        
        ctx.clearRect(0, 0, topCanvas.width, topCanvas.height);
        tctx.clearRect(0, 0, topCanvas.width, topCanvas.height);
        drawDrawFrame(productWindow.rectX, productWindow.rectY, getWindowWidth(), getWindowHeight(), productWindow.rectStroke);
        ctx.fillStyle = '#7d7b79';
        for (const seperator of productWindow.seperators) {
            //console.log(seperator.rectX, seperator.rectY, seperator.rectWidth, seperator.rectHeight);
            ctx.fillRect(seperator.rectX, seperator.rectY, seperator.rectWidth, seperator.rectHeight);
        }
        
       
    } );

   
})

function updateDimensions(win, newWidth, newHeight){
    const modifiedSeperrators = new Set();
    //if (win.rectWidth != newWidth) {
         
        for (const oppening of win.rects) {
            if (win.rectWidth != newWidth && oppening.right === "frame_right") {

                oppening.rectWidth = oppening.rectWidth+newWidth-win.rectWidth
               
                if(win.seperators[oppening.top] && !modifiedSeperrators.has(win.seperators[oppening.top])){
                    win.seperators[oppening.top].rectWidth+=newWidth-win.rectWidth
                    //console.log(win.seperators[oppening.top].rectWidth," ", win.seperators[oppening.top].rectWidth+=newWidth-win.rectWidth);
                    modifiedSeperrators.add(win.seperators[oppening.top]) 
                }
                if(win.seperators[oppening.bottom] && !modifiedSeperrators.has(win.seperators[oppening.bottom])){
                    win.seperators[oppening.bottom].rectWidth+=newWidth-win.rectWidth
                    //console.log(win.seperators[oppening.bottom].rectWidth," ", win.seperators[oppening.bottom].rectWidth+=newWidth-win.rectWidth);
                    modifiedSeperrators.add(win.seperators[oppening.bottom]) 
                }
            }

            if (win.rectHeight != newHeight && oppening.bottom === "frame_bottom") {
             
                console.log(oppening.rectHeight,"+",newHeight,"-",win.rectHeight);
                oppening.rectHeight = oppening.rectHeight+newHeight-win.rectHeight
                //console.log(win.rects[0].rectHeight,"  ",oppening.rectHeight);
                console.log(win.rects[0]);
               
                if(win.seperators[oppening.right] && !modifiedSeperrators.has(win.seperators[oppening.right])){
                    win.seperators[oppening.right].rectHeight+=newHeight-win.rectHeight
                    //console.log(win.seperators[oppening.right].rectHeight," ", win.seperators[oppening.right].rectHeight+=newHeight-win.rectHeight);
                    modifiedSeperrators.add(win.seperators[oppening.right]) 
                }
                if(win.seperators[oppening.left] && !modifiedSeperrators.has(win.seperators[oppening.left])){
                    win.seperators[oppening.left].rectHeight+=newHeight-win.rectHeight
                    //console.log(win.seperators[oppening.left].rectWidth," ", win.seperators[oppening.left].rectWidth+=newWidth-win.rectWidth);
                    modifiedSeperrators.add(win.seperators[oppening.left]) 
                }
            }
        }
        
    //}

    
}


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
    console.log(productWindow.rects);
}




