// ===== Canvas Constants =====
const canvasElement = document.getElementById('mainCanvas');
const ctx = canvasElement.getContext('2d');
const canvasHalfWidth = canvasElement.width * 0.5;
const canvasHalfHeight = canvasElement.height * 0.5;

const displayCanvasElement = document.getElementById('displayCanvas');
const displayCtx = displayCanvasElement.getContext('2d');

const ditherSlider = document.getElementById("ditherSlider");
const sizeSlider = document.getElementById("sizeSlider");

const deg2rad = Math.PI / 180;
const rad2deg = 180 / Math.PI;

// ===== Input =====
    let Gamepads = [];

    canvasElement.addEventListener('mousemove', function(e){
        mouse.lastMouse.x = Math.round(mouse.real.x);
        mouse.lastMouse.y = Math.round(mouse.real.y);

        mouse.real.x = (e.offsetX / canvasElement.clientWidth) * canvasElement.width;
        mouse.real.y = (e.offsetY / canvasElement.clientHeight) * canvasElement.height;

        mouse.movementX = e.movementX;
        mouse.movementY = e.movementY;
    });

    canvasElement.addEventListener('mousedown', function(e){

        pastLayers.push(frames[currentFrame]);
        mouse[e.button] = true;
    });
    
    document.addEventListener('mouseup', function(e){
        mouse[e.button] = false;
    });

    let keys = {};
    let keysPressTime = {};
    let keysReleaseTime = {};

    let mouse = {
        0: false,
        1: false,
        2: false,

        real : {
          x: 0,
          y: 0,
        },

        get x() {
          return Math.floor(mouse.real.x);
        },

        get y() {
          return Math.floor(mouse.real.y);
        },

        movementX : 0,
        movementY : 0,

        inAreaCheck(x, y, w, h){
            return (mouse.x >= x && mouse.x <= x + w && mouse.y >= y && mouse.y <= y + h);
        },

        lastMouse : {
            x : 0,
            y : 0,
        }
    };

    let Time = {
        deltaTime : 0,
        now : 0,
        launchTime : new Date().getTime(),
        startGameTime: 0,
        frameCount : 0,
        engineCount : 0,
        worldTicks : 0
    };    


    document.addEventListener('keydown', function(e){
        keys[e.code] = true;
        keysPressTime[e.code] = Time.now;

        console.log("key pressed")

        if(e.code === "KeyZ"){
            //console.log("trying to undo");
            //push2canvas(pastLayers.shift().pixels);
            /*let replacementPixelArray = pastLayers.shift().pixels;
            for ( let i = 0; i < replacementPixelArray.length; i++ ){
                activeFrame.pixels[i] = replacementPixelArray[i];
            }*/

            let localLastLayerPixels = pastLayers.pop().pixels;
            if(localLastLayerPixels !== null){
                frames[currentFrame].pixels = localLastLayerPixels;
            }
        }

        if(e.code === "ArrowLeft"){
            //console.log("trying last frame");
            pastLayers = []; // clears history
            currentFrame -= 1;
            currentFrame = ExtraMath.clamp(currentFrame, 0, frames.length - 1);
        }
        if(e.code === "ArrowRight"){
            //console.log("trying next frame");
            pastLayers = []; // clears history
            currentFrame += 1;
            if(key("KeyB") === 1){
                frames.splice(currentFrame, 0, new Frame());
            }
            currentFrame = ExtraMath.clamp(currentFrame, 0, frames.length - 1);
        }
        if(e.code === "ArrowUp"){
            if(gameState === GameStates.Main){
                gameState = GameStates.ToolMenu;
            }
        }
        if(e.code === "ArrowDown"){
            if(gameState === GameStates.ToolMenu || gameState === GameStates.ColorChoosing || gameState === GameStates.DitherChoosing){
                gameState = GameStates.Main;
            }
        }
    });

    document.addEventListener('keyup', function(e){
        keys[e.code] = false;
        keysReleaseTime[e.code] = Time.now;
    });

    function key(keyCode){
        return (keys[keyCode] === true ? 1 : 0);
    }

    function btn(scheme, button){
        return (keys[scheme[button]] === true ? 1 : 0);
    }


    function keyPressedWithin(keyCode, millisecs){
        if(keysPressTime[keyCode] + millisecs > Time.now){
            return 1;
        }else {
            return 0;
        }
    }

    function keyReleasedWithin(keyCode, millisecs){
        if(keysReleaseTime[keyCode] + millisecs > Time.now){
            return 1;
        }else {
            return 0;
        }
    }

    function btnPressedWithin(scheme, button, millisecs){
        if(keysPressTime[scheme[button]] + millisecs > Time.now){
            return 1;
        }else {
            return 0;
        }
    }

    function btnReleasedWithin(scheme, button, millisecs){
        if(keysReleaseTime[scheme[button]] + millisecs > Time.now){
            return 1;
        }else {
            return 0;
        }
    }

    let now = new Date();
    now = now.getTime();
    let lastTime = now;

    function engineUpdate(){
        let now = new Date();
        now = now.getTime();
        Time.now = now;

        Time.deltaTime = now - lastTime;
        lastTime = now;

        if(Time.deltaTime < 100){
            masterUpdate();
            Time.frameCount++;
        }else{
            console.log("You've Left!");
        }

        Time.engineCount++;
        requestAnimationFrame(engineUpdate);
    }

//

let Sheet = new Image();
Sheet.src = "Sheet.png";

document.addEventListener("click", clickToStartTrigger);

function clickToStartTrigger(){
	document.removeEventListener("click", clickToStartTrigger);
	start();
}

// called after everything is loaded, but before first click...
function init(){
    let ingKeys = Object.keys(images);
    for(let i = 0; i < ingKeys.length; i++ ){
        images[ingKeys[i]].img.src = images[ingKeys[i]].path;
    }
}

init();