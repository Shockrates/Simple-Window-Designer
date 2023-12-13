// Boolean variable to determine whether to draw a horizontal line
var  drawHorizontalLine = false;
// Boolean variable to determine whether to draw a vertical line
var  drawVerticalLine = false;
var rects = [];
var seperators = [];
var frames = [];

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
            "rectX": rectX+rectStroke,
            "rectY": rectY+rectStroke,
            "rectWidth": rectWidth-2*rectStroke,
            "rectHeight" :rectHeight-2*rectStroke

        }
    ]

    

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
    
    drawDrawFrame(rectX, rectY, rectWidth, rectHeight, rectStroke)
    //drawRectOutline(rects[0],2,'#FF0000')

    function drawDrawFrame(x0, y0, width, height, stroke){

        frames = [
            {pos:"top",vertTable:getVertices("top",x0, y0, width, height, stroke)},
            {pos:"bottom",vertTable:getVertices("bottom",x0, y0, width, height, stroke)},
            {pos:"left",vertTable:getVertices("left",x0, y0, width, height, stroke)},
            {pos:"right",vertTable:getVertices("right",x0, y0, width, height, stroke)},
        ];
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
    
        // for (const rect of rects) { 
        //     drawRectOutline(rect,2,'#FF0000')// Draw a rectangle outline
        // }

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
 
        // for (const rect of rects) {
        //     drawRectOutline(rect,2,'#FF0000')// Draw a rectangle outline
        // }
       

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


