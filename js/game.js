
var context = null;
var cameraPosition = 0.0;

var playerX = 50;
var plyAnimationState = 0;
var playerY = 348;
var playerFacingBackwards = false;

var playerSpeed = 7.0;

var FPS = 50;

var assets = {
    character:  "img/character.png",
    character-walk: "img/character-b.png",
    backgroundFar: "img/background.png",
    backgroundMid: "img/middle.png",
    foreground: "img/foreground.png",
    enemy1:     "img/enemy1.png",
    enemy2:     "img/enemy2.png",
    enemy3:     "img/enemy3.png",
};

function characterWalk() {
    if (plyAnimationState === 0) {
        plyAnimationState = 1;
    } else {
        plyAnimationState = 0;
    }
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

    middlePos = cameraPosition * 1.3 % assets.backgroundMid.width;
    ctx.drawImage(assets.backgroundMid, -middlePos, 412);
    ctx.drawImage(assets.backgroundMid, -middlePos + assets.backgroundMid.width, 412);
    ctx.drawImage(assets.backgroundMid, -middlePos + (assets.backgroundMid.width * 2), 412);
}

function DrawParallaxForeground(ctx) {
    foregroundPos = cameraPosition * 2 % assets.foreground.width;
    ctx.drawImage(assets.foreground, -foregroundPos, 475);
    ctx.drawImage(assets.foreground, -foregroundPos + assets.foreground.width, 475);
    ctx.drawImage(assets.foreground, -foregroundPos + (assets.foreground.width * 2), 475);
}

function DrawPlayer(ctx) {
    var sprite = plyAnimationState === 0 ? assets.character : assets.character-walk;
    ctx.drawImage(sprite, playerX - cameraPosition, playerY);
    w = assets.character.width;
    h = assets.character.height;
    if(playerFacingBackwards) {
        ctx.save()
        ctx.scale(-1, 1);
        ctx.drawImage(sprite, -playerX - cameraPosition - assets.character.width, playerY);
        ctx.restore()
    } else {
        ctx.drawImage(sprite, playerX - cameraPosition, playerY);
    }
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

function InitKeyboardHandler() {

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
              case 37:  /* Left arrow was pressed */
                  playerX -= playerSpeed;
                  playerFacingBackwards = true;
                  if(playerX - cameraPosition < 200) {
                      cameraPosition -= playerSpeed
                      if(cameraPosition < 0) cameraPosition = 0;
                  }
                  characterWalk();
                  break;
              case 39:  /* Right arrow was pressed */
                  playerX += playerSpeed;
                  playerFacingBackwards = false;
                  if(playerX - cameraPosition > 500) {
                      cameraPosition += playerSpeed
                  }
                  characterWalk();
              break;
          }
      });
}
