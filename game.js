
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

function DrawParallaxBackground(ctx) {
    backgroundPos = cameraPosition % assets.background.width;
    ctx.drawImage(assets.background, -backgroundPos, 0);
    ctx.drawImage(assets.background, -backgroundPos + 800, 0);
}

function DrawParallaxForeground(ctx) {
    foregroundPos = cameraPosition * 2 % assets.foreground.width;
    ctx.drawImage(assets.foreground, -foregroundPos, 300);
    ctx.drawImage(assets.foreground, -foregroundPos + 400, 300);
    ctx.drawImage(assets.foreground, -foregroundPos + 800, 300);
}

function DrawPlayer(ctx) {
    context.drawImage(assets.character, 50, 420);
}

function GameLoop() {

    cameraPosition += 0.1;

    DrawParallaxBackground(context);
    DrawPlayer(context);
    DrawParallaxForeground(context);

    setInterval(GameLoop, 200);
}

$(document).ready(function() {
    var canvas = document.getElementById("canvas");  
    context = canvas.getContext("2d");  

    LoadAssets(GameLoop);
})
