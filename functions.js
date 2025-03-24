


function start(){
    engineUpdate();
}

let activeLayers = {
    "front" : new Layer(new ImageData(layerWidth, layerHeight).data),
    "back" : new Layer(new ImageData(layerWidth, layerHeight).data, layerName.back),
}

function gameUpdate(){
    ctx.clearRect(0, 0, layerWidth, layerHeight);
    
    if(key("Space") === 1){
        activeLayers.front.clear();
    }

    //line(120, 120, mouse.x, mouse.y, 2, activeLayers.front);
    if(mouse[0]){
        activeTool.use();
        
        //pen(Math.round(mouse.x), Math.round(mouse.y), 2, 0, activeLayers.front)
    }

    activeLayers.front.draw();
    ctx.fillText(Math.round(1000 / Time.deltaTime), 0, 32);
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

const ExtraMath = {
    wrap(val, min, max){
        return (val - min) - (Math.floor( (val - min) / max )) * max;
    }
}

function pen(xP, yP, color, w, layerObject, ditherMat = null){
    for(let x = 0; x < penSizeMat[0].length; x++){
        for(let y = 0; y < penSizeMat.length; y++){
            if(penSizeMat[y][x] <= w){
                if(ditherMat !== null){
                    let cursor = { x : Math.round(xP - (x - penSizeMat.length * 0.5)), y : Math.round(yP - (y - penSizeMat[0].length * 0.5))}
                    
                    let ditherVal = ditherMat.matrix[
                        ExtraMath.wrap(cursor.y, 0, ditherMat.n)
                    ][
                        ExtraMath.wrap(cursor.x, 0, ditherMat.n)
                    ]

                    if(ditherVal > 0){
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
        }
        if( x > -y) {
            bOctantSwap(x2, y2, x1, y1, color, w, layer, ditherMat);
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