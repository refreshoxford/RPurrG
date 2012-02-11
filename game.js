
var context = null;
var cameraPosition = 0.0;

var assets = {
    character: "images/character.png",
    background: "images/background.png",
    foreground: "images/foreground.png",
};

function LoadAssets(fn) {

    var numLoaded = 0;
    var numToLoad = 0;

    $.each(assets, function(e, i) {
        numToLoad += 1;
        var img = new Image();
        img.src = assets[e]
        img.assetName = e
        img.addEventListener("load", function() {
            assets[this.assetName] = this;
            numLoaded += 1;
            if(numLoaded == numToLoad) {
                fn();
            }
        }, false);
    });
}

function DrawParallax() {
    backgroundPos = cameraPosition % assets.background.width;
    foregroundPos = cameraPosition * 2 % assets.foreground.width;
    context.drawImage(assets.background, -backgroundPos, 0);
    context.drawImage(assets.background, -backgroundPos + 800, 0);
    context.drawImage(assets.foreground, -foregroundPos, 300);
    context.drawImage(assets.foreground, -foregroundPos + 400, 300);
    context.drawImage(assets.foreground, -foregroundPos + 800, 300);
}

function GameLoop() {

    cameraPosition += 0.1;

    DrawParallax(context);

    setInterval(GameLoop, 200);
}

$(document).ready(function() {
    var canvas = document.getElementById("canvas");  
    context = canvas.getContext("2d");  

    LoadAssets(GameLoop);

    /*
    LoadAssets(function() {
        context.drawImage(assets.background, 0, 0);
        context.drawImage(assets.foreground, 0, 300);
        context.drawImage(assets.foreground, 400, 300);
        context.drawImage(assets.character, 10, 10);
    });
    */
})
