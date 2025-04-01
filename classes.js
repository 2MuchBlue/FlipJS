class Frame {
    constructor( pixels = new ImageData(layerWidth, layerHeight).data, layer = layerName.front ){
        this.pixels = pixels;
        this.layer = layer;
    }

    draw(context = ctx){
        if(this.layer === layerName.front){
            let localData = new ImageData(push2canvas(this.pixels), layerWidth, layerHeight);
            context.putImageData(localData, 0, 0);
        }else{ // on back layer
            let localData = new ImageData(push2canvas(this.pixels, ctx.getImageData(0, 0, layerWidth, layerHeight,)), layerWidth, layerHeight);
            context.putImageData(localData, 0, 0);
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

class Button{
    constructor(x, y, w, h, onClick = () => {}, onHover = () => { ctx.fillRect( x + 5, y + 5, w-10, h-10); }, onDefault = () => { ctx.fillRect( x, y, w, h); } ){
        this.x = x;
        this.y = y;

        this.w = w;
        this.h = h;

        this.onClick = onClick;
        this.onHover = onHover;
        this.onDefault = onDefault;
    }

    tick(x = this.x, y = this.y){
        if(mouse.inAreaCheck( x, y, this.w, this.h)){
            if(mouse[0]){
                this.onClick(x, y, this.w, this.h);
            }else{
                this.onHover(x, y, this.w, this.h);
            }
        }else{
            this.onDefault(x, y, this.w, this.h);
        }
    }

    debugDraw(context = ctx){
        context.fillRect(this.x, this.y, this.w, this.h);
    }
}

class ButtonPanel {
    constructor ( x, y, padding, spacing, buttonArray /* A 2D array of buttons. first array is the Y-axis. */, w = undefined, h = undefined ){
        this.x = x;
        this.y = y;

        this.w = w;
        this.h = h;

        this.padding = padding; // the inside padding added to all the outsides of the other buttons
        this.spacing = spacing; // the space between buttons. ADDED TO OUT SIDE TOO!!!!

        this.buttonArray = buttonArray;
        /* like:
            [
                [button1, button2],
                [button3, button4],
                [button5, button6]
            ]

            results in a panel with 6 buttons, in the layout shown.
        */
    }

    tick(width = undefined){
        ctx.strokeRect(this.x, this.y, 10, 10);


        let localSpace = -1;
        if(width === undefined){
            localSpace = this.spacing;
        }else{
            localSpace = 0;
            for(let i = 0; i < this.buttonArray[0].length; i++){
                localSpace += this.buttonArray[0].w;
            }
            localSpace = (width - localSpace) / (this.buttonArray[0].length - 1);
            //localSpace = 
            //__|_|_|__
        }

        let yIndent = this.padding; // starting amount from edge
        for(let iy = 0; iy < this.buttonArray.length; iy++ ){
            let xIndent = this.padding; // starting amount from edge.
            for(let ix = 0; ix < this.buttonArray[iy].length; ix++ ){
                if(this.buttonArray[iy][ix]?.tick === undefined){ continue; }
                this.buttonArray[iy][ix]?.tick(this.x + xIndent, this.y + yIndent);
                xIndent += localSpace + this.buttonArray[iy][ix].w;
            }
            yIndent += localSpace + this.buttonArray[iy][0].h;
        }
    }

}