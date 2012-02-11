
var context = null;
var cameraPosition = 0.0;

var playerX = 300;
var playerY = 420;

var playerSpeed = 5.0;

var FPS = 50;

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
    context.drawImage(assets.character, playerX - cameraPosition, playerY);
}

function GameLoop() {

    DrawParallaxBackground(context);
    DrawPlayer(context);
    DrawParallaxForeground(context);

    setTimeout(GameLoop, 1000/FPS);
}

$(document).ready(function() {
    var canvas = document.getElementById("canvas");  
    context = canvas.getContext("2d");  

    $(window).keydown(function(evt) {
        switch (evt.keyCode) {
            case 38:  /* Up arrow was pressed */
                playerY -= playerSpeed;
                if(playerY < 300) playerY = 300;
                break;
            case 40:  /* Down arrow was pressed */
                playerY += playerSpeed;
                if(playerY > 450) playerY = 450;
                break;
            break;
            case 37:  /* Left arrow was pressed */
                playerX -= playerSpeed;
                if(playerX - cameraPosition < 200) {
                    cameraPosition -= playerSpeed
                    if(cameraPosition < 0) cameraPosition = 0;
                }
                break;
            break;
            case 39:  /* Right arrow was pressed */
                playerX += playerSpeed;
                if(playerX - cameraPosition > 500) {
                    cameraPosition += playerSpeed
                }
            break;
        }
    });

    LoadAssets(GameLoop);
})
