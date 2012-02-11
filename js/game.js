
var context = null;
var cameraPosition = 0.0;

var playerX = 300;
var playerY = 420;

var playerSpeed = 5.0;

var FPS = 50;

var assets = {
    character:  "img/character.png",
    backgroundFar: "img/background.png",
    backgroundMid: "img/middle.png",
    foreground: "img/foreground.png",
    enemy1:     "img/enemy1.png",
    enemy2:     "img/enemy2.png",
    enemy3:     "img/enemy3.png",
};

var enemies = [];
var nextEnemyId = 0;

function Enemy(type, posX, posY, hit) {
    this.id = nextEnemyId;
    nextEnemyId++; 
    this.type = type
    this.posX = posX;
    this.posY = posY;
    this.hit = hit;
    var draw = function(ctx) {
        ctx.drawImage(type, this.posX, this.posY);
    };
    var update = function(movX, movY, dmg) {
        this.posX += movX;
        this.posY += movY;
        this.hit -= dmg;
    };
}

function spawnEnemy(type, posX, posY, hit) {
    var enemy = new Enemy(type, posX, posY, hit);
    enemies[enemies.length] = enemy;
}

function removeEnemy(id) {
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].id === id) {
            enemies.splice(i,1);
            return true;
        }
    }
    return false;
}

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
    backgroundPos = cameraPosition % assets.backgroundFar.width;
    ctx.drawImage(assets.backgroundFar, -backgroundPos, 0);
    ctx.drawImage(assets.backgroundFar, -backgroundPos + assets.backgroundFar.width, 0);

    middlePos = cameraPosition % assets.backgroundMid.width;
    ctx.drawImage(assets.backgroundMid, -middlePos, 408);
    ctx.drawImage(assets.backgroundMid, -middlePos + assets.backgroundMid.width, 408);
}

function DrawParallaxForeground(ctx) {
    foregroundPos = cameraPosition * 2 % assets.foreground.width;
    ctx.drawImage(assets.foreground, -foregroundPos, 475);
    ctx.drawImage(assets.foreground, -foregroundPos + 400, 475);
    ctx.drawImage(assets.foreground, -foregroundPos + 800, 475);
}

function DrawPlayer(ctx) {
    ctx.drawImage(assets.character, 50, 420);
}

function DrawEnemies(ctx) {
    $.each(enemies, function(idx, elt) {
        enemies[idx].draw(ctx); 
    }, false);
}

function GameLoop() {

    DrawParallaxBackground(context);
    DrawPlayer(context);
    DrawParallaxForeground(context);

    setTimeout(GameLoop, 1000/FPS);
}

