class Layer {
    constructor( pixels, layer = layerName.front ){
        this.pixels = pixels;
        this.layer = layer;
    }

    draw(){
        if(this.layer === layerName.front){
            let localData = new ImageData(push2canvas(this.pixels), layerWidth, layerHeight);
            ctx.putImageData(localData, 0, 0);
        }else{ // on back layer
            let localData = new ImageData(push2canvas(this.pixels, ctx.getImageData(0, 0, layerWidth, layerHeight,)), layerWidth, layerHeight);
            ctx.putImageData(localData, 0, 0);
        }
    }

    clear(){
        for(let i = 0; i < layerWidth * layerHeight * 4; i++){
            this.pixels[ i + 0 ] = 0; // red channel
            this.pixels[ i + 1 ] = 0; // blue channel
            this.pixels[ i + 2 ] = 0; // green channel
            this.pixels[ i + 3 ] = 0; // alpha channel
        }
    }

    putPixel(x, y, colorIndex){
        let redIndex = (y * layerWidth * 4) + x * 4;
        this.pixels[ redIndex ] = ColorIndexs[colorIndex][0]; // red channel
        this.pixels[ redIndex + 1 ] = ColorIndexs[colorIndex][ 0 + 1 ]; // blue channel
        this.pixels[ redIndex + 2 ] = ColorIndexs[colorIndex][ 0 + 2 ]; // green channel
        this.pixels[ redIndex + 3 ] = ColorIndexs[colorIndex][ 0 + 3 ]; // alpha channel
    }

    getPixel(x, y){
        return this.pixels[(y * layerWidth * 4) + x * 4];
    }
}