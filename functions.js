

function start(){
    engineUpdate();
}

const GameStates = { // functions to run while in different game states
    "ToolMenu" : menuUpdate,
    "Main" : gameUpdate,
    "ColorChoosing" : colorChoiceUpdate,
    "DitherChoosing" : ditherChoiceUpdate,
}

let gameState = GameStates.Main;

let activeFrame = new Frame ();

function masterUpdate(){
    gameState();
}

function gameUpdate(){
    ctx.clearRect(0, 0, layerWidth, layerHeight);
    displayCtx.clearRect(0, 0, layerWidth, layerHeight);
    activeFrame = frames[currentFrame];
    
    if(key("Space") === 1){
        activeFrame.clear();
    }

    //line(120, 120, mouse.x, mouse.y, 2, activeFrame);
    if(mouse[0]){
        activeTool.use();
        //pen(Math.round(mouse.x), Math.round(mouse.y), 2, 0, activeFrame)
    }

    frames[currentFrame].draw();
    displayCtx.drawImage(images.mainMenu.img, 0, 0);
    ctx.fillText(Math.round(1000 / Time.deltaTime), 0, 32);
    displayCtx.fillText((currentFrame + 1) + " / " + frames.length, 195, 40);
}

function menuUpdate(){
    ctx.clearRect(0, 0, layerWidth, layerHeight);
    displayCtx.clearRect(0, 0, layerWidth, layerHeight);
    frames[currentFrame].draw(displayCtx);

    ctx.fillStyle = "#fff";
    ctx.fillText(`${mouse.x}, ${mouse.y}`, mouse.x, mouse.y);

    if(mouse.inAreaCheck( 19, 65, 62, 62)){ // eraser
        ctx.fillRect( 19+5, 65+5, 62-10, 62-10);
        if(mouse[0]){
            activeColor = 0;
        }
    }else{
        ctx.fillRect( 19, 65, 62, 62);
    }
    ctx.drawImage(images.eraserTool.img, 19, 65);
    
    
    if(mouse.inAreaCheck( 97, 65, 62, 62)){ // pen
        let lastColor = ctx.fillStyle;
        ctx.fillStyle = colorArray2rgb(ColorIndexs[Tools.pencil.lastNonEraserColor]);
        ctx.fillRect( 97 + 5, 65+5, 62-10, 62-10);
        ctx.fillStyle = lastColor;
        if(mouse[0]){
            activeColor = Tools.pencil.lastNonEraserColor;
        }
    }else{
        ctx.fillRect( 97, 65, 62, 62);
    }
    ctx.drawImage(images.pencilTool.img, 97, 65);

    if(mouse.inAreaCheck( 140, 100, 30, 30)){ // pen color
        let lastColor = ctx.fillStyle;
        ctx.fillStyle = colorArray2rgb(ColorIndexs[Tools.pencil.lastNonEraserColor]);
        ctx.fillRect( 140, 100, 30, 30);
        ctx.fillStyle = lastColor;
        if(mouse[0]){
            gameState = GameStates.ColorChoosing;
            return;
        }
    }else{
        ctx.fillRect( 140, 100, 30, 30);
    }

    /*if(mouse.inAreaCheck(175, 65, 62, 62)){ // dither
        ctx.fillRect(175+5, 65+5, 62 - 10, 62-10);
        if(mouse[0]){
            activeColor = 0;
        }
    }else{
        ctx.fillRect(175, 65, 62, 62);
    }*/

    let button = (x, y, w, h, onClick = () => {}, onHover = () => { ctx.fillRect( x + 5, y + 5, w-10, h-10); }, onDefault = () => { ctx.fillRect( x, y, w, h); } ) => {
        if(mouse.inAreaCheck( x, y, w, h)){
            onHover();
            if(mouse[0]){
                onClick();
            }
        }else{
            onDefault();
        }
    }

    new ButtonPanel(175, 65, 0, 2, [
        [ new Button(0, 0, 62, 15, () => { activeDither = 0 }, () => {}, (x, y, w, h) => {ctx.fillRect(x, y, w, h)}), {w : 0, h:0} ],
        [ new Button(0, 0, 30, 15, () => { activeDither = 1 }, (x, y, w, h) => {customRect( x + 2, y + 2, w - 4, h - 4, activeColor, ctx, ditherPatterns[0] )}, (x, y, w, h) => {customRect( x, y, w, h, activeColor, ctx, ditherPatterns[0] )}),       new Button(0, 0, 30, 15, () => { activeDither = 2 }, (x, y, w, h) => {customRect( x + 2, y + 2, w - 4, h - 4, activeColor, ctx, ditherPatterns[1] )}, (x, y, w, h) => {customRect( x, y, w, h, activeColor, ctx, ditherPatterns[1] )}) ],
        [ new Button(0, 0, 30, 15, () => { activeDither = 3 }, (x, y, w, h) => {customRect( x + 2, y + 2, w - 4, h - 4, activeColor, ctx, ditherPatterns[2] )}, (x, y, w, h) => {customRect( x, y, w, h, activeColor, ctx, ditherPatterns[2] )}),       new Button(0, 0, 30, 15, () => { activeDither = 4 }, (x, y, w, h) => {customRect( x + 2, y + 2, w - 4, h - 4, activeColor, ctx, ditherPatterns[3] )}, (x, y, w, h) => {customRect( x, y, w, h, activeColor, ctx, ditherPatterns[3] )}) ],
        [ new Button(0, 0, 30, 15, () => { activeDither = 5 }, (x, y, w, h) => {customRect( x + 2, y + 2, w - 4, h - 4, activeColor, ctx, ditherPatterns[4] )}, (x, y, w, h) => {customRect( x, y, w, h, activeColor, ctx, ditherPatterns[4] )}),       new Button(0, 0, 30, 15, () => { activeDither = 6 }, (x, y, w, h) => {customRect( x + 2, y + 2, w - 4, h - 4, activeColor, ctx, ditherPatterns[5] )}, (x, y, w, h) => {customRect( x, y, w, h, activeColor, ctx, ditherPatterns[5] )}) ],
    ]).tick();

    /*button( // dithers / null (removes the dither)
        175, 43, 31, 31,
        () => { activeDither = 0 },
        () => {},
        () => {}
    )
    customRect(175, 43, 31, 31, 1, ctx, null);

    button( // dithers / 1
        175, 74, 31, 31,
        () => { activeDither = 1 },
        () => {customRect(175 - 5 , 74-5, 31+10, 31+10, 1, ctx, ditherPatterns[0]);},
        () => {customRect(175 , 74, 31, 31, 1, ctx, ditherPatterns[0]);},
    )

    button( // dithers / 2
        175, 105, 31, 31,
        () => { activeDither = 2 },
        () => {customRect(175 - 5 , 105-5, 31+10, 31+10, 1, ctx, ditherPatterns[1 ]);},
        () => {customRect(175 ,     105, 31, 31, 1, ctx, ditherPatterns[1]);},
    )*/
    //customRect(175, 74, 31, 31, 1, ctx, ditherPatterns[0]);
}

function colorChoiceUpdate(){
    menuUpdate();
    if(!mouse.inAreaCheck(90, 50, 80, 130 )){
        gameState = GameStates.ToolMenu;
        return;
    }


    let button = (x, y, w, h, onClick = () => {}, onHover = () => { ctx.fillRect( x + 5, y + 5, w-10, h-10); }) => {
        if(mouse.inAreaCheck( x, y, w, h)){
            onHover();
            if(mouse[0]){
                onClick();
            }
        }else{
            ctx.fillRect( x, y, w, h);
        }
    }
//97, 65, 62, 62
    let lastColor = ctx.fillStyle;
    ctx.fillStyle = colorArray2rgb(ColorIndexs[1]);
    button( 97, 127, 15, 15, () => {
        activeColor = 1;
        Tools.pencil.lastNonEraserColor = 1;
    });

    ctx.fillStyle = colorArray2rgb(ColorIndexs[2]);
    button( 97 + 15, 127, 15, 15, () => {
        activeColor = 2;
        Tools.pencil.lastNonEraserColor = 2;
    });

    ctx.fillStyle = colorArray2rgb(ColorIndexs[3]);
    button( 97 + 30, 127, 15, 15, () => {
        activeColor = 3;
        Tools.pencil.lastNonEraserColor = 3;
    });

    ctx.fillStyle = colorArray2rgb(ColorIndexs[4]);
    button( 97 + 45, 127, 15, 15, () => {
        activeColor = 4;
        Tools.pencil.lastNonEraserColor = 4;
    });

    // ==============

    ctx.fillStyle = colorArray2rgb(ColorIndexs[5]);
    button( 97, 127 + 15, 15, 15, () => {
        activeColor = 5;
        Tools.pencil.lastNonEraserColor = 5;
    });

    ctx.fillStyle = colorArray2rgb(ColorIndexs[6]);
    button( 97 + 15, 127 + 15, 15, 15, () => {
        activeColor = 6;
        Tools.pencil.lastNonEraserColor = 6;
    });
    ctx.fillStyle = lastColor;
}

function ditherChoiceUpdate(){
    let button = (x, y, w, h, onClick = () => {}, onHover = () => { ctx.fillRect( x + 5, y + 5, w-10, h-10); }) => {
        if(mouse.inAreaCheck( x, y, w, h)){
            onHover();
            if(mouse[0]){
                onClick();
            }
        }else{
            ctx.fillRect( x, y, w, h);
        }
    }
    menuUpdate();

    //button()
}

function push2canvas(pixlels, otherData = null){ // renders front to back!!!
    let newCanvasData = [];
   //console.log(pixlels);
    if(otherData === null){ // if there is no previous data, just write to it.
        newCanvasData = pixlels;
        /*for(let i = 0; i < layerWidth * layerHeight * 4; i++ ){
            newCanvasData[i] = pixlels[i];
        }*/
    }else{ // if there is prior data, overwrite if the alpha is 0 (no color there)
        for(let i = 0; i < layerWidth * layerHeight; i += 4 ){
            if(otherData[i + 3] === 0){ // checking alpha, if there is any color, leave it.
                newCanvasData[i] = pixlels[i]; // red
                newCanvasData[i + 1] = pixlels[i + 1]; // green
                newCanvasData[i + 2] = pixlels[i + 2]; // blue
                newCanvasData[i + 3] = pixlels[i + 3]; // alpha
            }
        }
    }
    //console.log(newCanvasData);
    return new Uint8ClampedArray(newCanvasData);
}

function colorArray2rgb(array){
    return `rgb( ${array[0]}, ${array[1]}, ${array[2]}, ${array[3] / 255} )`;
}

const ExtraMath = {
    wrap(val, min, max){
        return (val - min) - (Math.floor( (val - min) / max )) * max;
    },

    clamp(val, min, max){
        if(val < min){
            return min;
        }else if(val > max){
            return max;
        }
        return val;
    }
}

function customRect(x, y, w, h, color, frameObj, ditherMat = null){ // if frameObj is a context, it will just draw on that.
    for(let iy = 0; iy < h; iy++){
        for(let ix = 0; ix < w; ix++){
            if(ditherMat !== null){
                if(inDither(x + ix, y + iy, ditherMat)){
                    if(frameObj.pixlels === undefined){
                        frameObj.fillStyle = colorArray2rgb(ColorIndexs[color]);
                        frameObj.fillRect(x + ix, y + iy, 1, 1);
                    }
                    else{
                        frameObj.putPixel(x + ix, y + iy, color);
                    }
                }
            }else{
                if(frameObj.pixlels === undefined){
                    frameObj.fillStyle = colorArray2rgb(ColorIndexs[color]);
                    frameObj.fillRect(x + ix, y + iy, 1, 1);
                }
                else{
                    frameObj.putPixel(x + ix, y + iy, color);
                }
            }
        }
    }
}

function inDither(x, y, ditherMat){ // checks if a position is on the dither. If it is not, it returns false.
    
    //let cursor = { x : Math.round(xP - (x - penSizeMat.length * 0.5)), y : Math.round(yP - (y - penSizeMat[0].length * 0.5))}
    
    let ditherVal = ditherMat.matrix[
        ExtraMath.wrap(x, 0, ditherMat.n)
    ][
        ExtraMath.wrap(y, 0, ditherMat.n)
    ]

    if(ditherVal > 0){
        return true;
    }
    return false;
}

function pen(xP, yP, color, w, layerObject, ditherMat = null){
    for(let x = 0; x < penSizeMat[0].length; x++){
        for(let y = 0; y < penSizeMat.length; y++){
            if(penSizeMat[y][x] <= w){
                if(ditherMat !== null){
                    let cursor = { x : Math.round(xP - (x - penSizeMat.length * 0.5)), y : Math.round(yP - (y - penSizeMat[0].length * 0.5))}
                    
                    if(inDither(cursor.x, cursor.y, ditherMat)){
                        layerObject.putPixel(cursor.x, cursor.y, color);
                    }

                }else{
                    layerObject.putPixel(Math.round(xP - (x - penSizeMat.length * 0.5)), Math.round(yP - (y - penSizeMat[0].length * 0.5)), color);
                }
            }
        }
    }
}

function __tempGenorateDistanceMatrix(size, vertSlice = 0){
    let matrix = [];
    let dist = (p1X, p1Y, p2X, p2Y) => {
        let p1 = p1X - p2X;
        let p2 = p1Y - p2Y;
    
        return Math.sqrt((p1 * p1) + (p2 * p2));
    }

    for(let x = 0; x < size; x++){
        matrix[x] = Math.round(dist(x, vertSlice, size * 0.5, size * 0.5 ));
    }
    
    navigator.clipboard.writeText(matrix.toString());
    console.log(matrix);
    return matrix;
}

function bOctant(x1, y1, x2, y2, color, w, layer, ditherMat = null){
    let slope = (y1 - y2) / (x1 - x2);
    for( let i = 0; i < Math.abs(x1 - x2); i++ ){
        pen( x1 + i, y1 + Math.round(i * slope), color, w, layer, ditherMat);
    }
}

function bOctantSwap(x1, y1, x2, y2, color, w, layer, ditherMat = null){
    let slope = (x1 - x2) / (y1 - y2);
    for( let i = 0; i < Math.abs(y1 - y2); i++ ){
        pen( x1 + Math.round(i * -slope), y1 - i, color, w, layer, ditherMat);
    }
}

function line(x1, y1, x2, y2, color, w, layer, ditherMat){
    let x = x2 - x1;
    let y = y2 - y1;

    pen(x1, y1, color, w, layer, ditherMat);
    pen(x2, y2, color, w, layer, ditherMat);

    if(x >= 0){
        if( -x < y && x > y ){
            bOctant(x1, y1, x2, y2, color, w, layer, ditherMat);
            return;
        }
        if( x > y) {
            bOctantSwap(x1, y1, x2, y2, color, w, layer, ditherMat);
            return;
        }
        if( x > -y) {
            bOctantSwap(x2, y2, x1, y1, color, w, layer, ditherMat);
            return;
        }
    }else{
        if( -x > y && x < y ){
            bOctant(x2, y2, x1, y1, color, w, layer, ditherMat);
            return;
        }
        if( -x > y) {
            bOctantSwap(x1, y1, x2, y2, color, w, layer, ditherMat);
            return;
        }
        if( -x > -y) {
            bOctantSwap(x2, y2, x1, y1, color, w, layer, ditherMat);
            return;
        }
    }

    /*
    if( x > y && x > 0 ){
        bOctant(x1, y1, x2, y2, color, layer, ditherMat);
        return;
    }
    if( x < y && x > 0 ){
        bOctantSwap(x1, y1, x2, y2, color, layer, ditherMat);
        return;
    }



    /*if(x1 <= x2){
        
        if(x < y){ // in the upper octant...
            bOctantSwap( x1, y1, x2, y2, color, layer, ditherMat );
        }else{
            bOctant( x1, y1, x2, y2, color, layer, ditherMat );
        }
    }
    if(x1 > x2){
        if(x < y){ // in the upper octant...
            bOctantSwap( x1, y1, x2, y2, color, layer, ditherMat );
        }else{
            bOctant( x2, y2, x1, y1, color, layer, ditherMat );
        }
        
    }*/
}

function closeDetail(id){
    document.getElementById(id).removeAttribute("open");
}