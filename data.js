
const layerWidth = 256; // 320
const layerHeight = 192; // 240

const layerName = {
    front : "front",
    back : "back"
}

const images = {
    "mainMenu" : {
        "path" : "Images/UpperDisplay-01.png",
        "w" : 256, "h" : 192, "x" : 0, "y" : 0,
        "img" : new Image()
    },

    "pencilTool" : {
        "path" : "Images/Pencil.png",
        "w" : 62, "h" : 62, "x" : 0, "y" : 0,
        "img" : new Image()
    },

    "eraserTool" : {
        "path" : "Images/Eraser.png",
        "w" : 62, "h" : 62, "x" : 0, "y" : 0,
        "img" : new Image()
    }
}

let currentFrame = 0;
let frames = [
    new Frame()
];

let pastLayers = [ // acts as a history for undoing

]

let activeColor = 3;
let activeDither = 0;

const Tools = {
    pencil : {
        lastNonEraserColor : activeColor,
        use(){
            if(activeColor !== 0){ this.lastNonEraserColor = activeColor; }
            ditherPat = (activeDither > 0 ? ditherPatterns[activeDither - 1] : null);
            line(mouse.lastMouse.x, mouse.lastMouse.y, mouse.x, mouse.y, activeColor, sizeSlider.value, activeFrame, ditherPat);
        }
    }
}
let activeTool = Tools.pencil;

const ColorIndexs = {
    0 : [0, 0, 0, 0], // clear/transparent
    1 : [0, 0, 0, 255], // black
    2 : [ 234, 55, 41, 255 ], // red
    3 : [ 18, 52, 183, 255 ], // blue
    4 : [ 57, 130, 59, 255 ], // green
    5 : [ 251, 232, 78, 255 ], // yellow
    6 : [ 255, 255, 255, 255] // white
}

const penSizeMat = [
    [7,6,6,5,5,5,5,5,6,6,7],
    [6,6,5,4,4,4,4,4,5,6,6],
    [6,5,4,4,3,3,3,4,4,5,6],
    [5,4,4,3,2,2,2,3,4,4,5],
    [5,4,3,2,1,1,1,2,3,4,5],
    [5,4,3,2,1,0,1,2,3,4,5],
    [5,4,3,2,1,1,1,2,3,4,5],
    [5,4,4,3,2,2,2,3,4,4,5],
    [6,5,4,4,3,3,3,4,4,5,6],
    [6,6,5,4,4,4,4,4,5,6,6],
    [7,6,6,5,5,5,5,5,6,6,7]
]

const ditherPatterns = [
    {
        matrix : [
            [255, 0, 0],
            [  0, 0, 0],
            [  0, 0, 0]
        ],
        n : 3,
        nSquared : 9
    },
    {
        matrix : [
            [255, 0],
            [  0, 0]
        ],
        n : 2,
        nSquared : 4
    },
    {
        matrix : [
            [255, 0],
            [255, 0],
        ],
        n : 2,
        nSquared : 4
    },
    {
        matrix : [
            [255, 255],
            [  0,   0],
        ],
        n : 2,
        nSquared : 4
    },
    {
        matrix : [
            [255,   0],
            [  0, 255],
        ],
        n : 2,
        nSquared : 4
    },
    {
        matrix : [
            [255, 255],
            [255,   0],
        ],
        n : 2,
        nSquared : 4
    },
    {
        matrix : [
            [255, 255, 255],
            [255, 255, 255],
            [255, 255,   0]
        ],
        n : 3,
        nSquared : 9
    }
]