
var context = null;
var cameraPosition = 0.0;

// Class to handle all of the data relating to the player character.
function Player() {
    this.X = 50;
    this.Y = 348;
    this.FacingBackwards = false;
    this._jumpCounter = -1;
    this._jumpHeight = 0;
    this._animationState = 0;

    this.Draw = function(ctx) {
        var sprite = this._animationState === 0 ? assets.character : assets.character_walk;
        w = assets.character.width;
        h = assets.character.height;
        if(this.FacingBackwards) {
            ctx.save()
            ctx.scale(-1, 1);
            ctx.drawImage(sprite, -this.X + cameraPosition - assets.character.width, this.Y - this._jumpHeight);
            ctx.restore()
        } else {
            ctx.drawImage(sprite, this.X - cameraPosition, this.Y - this._jumpHeight);
        }
    };

    this.Update = function() {

        var JUMP_FRAMES = 30;
        var JUMP_FACTOR = 4;

        if(this._jumpCounter > -1){
            this._jumpCounter++;
        }

        if(this._jumpCounter < JUMP_FRAMES / 2) {
            this._jumpHeight = JUMP_FACTOR * this._jumpCounter
        } else if (this._jumpCounter < JUMP_FRAMES) {
            this._jumpHeight = JUMP_FACTOR * (JUMP_FRAMES - this._jumpCounter);
        } else {
            this._jumpHeight = 0;
            this._jumpCounter = -1;
        }
    };

    this.Walk = function() {
        if (this._animationState === 0) {
            this._animationState = 1;
        } else {
            this._animationState = 0;
        }
    };

    this.Jump = function() {
        if(this._jumpCounter < 0) {
            this._jumpCounter = 0
        }
    }
}

var player = new Player();

var playerSpeed = 7.0;

var FPS = 50;

var assets = {
    character:  "img/character.png",
    character_walk: "img/character-b.png",
    backgroundFar: "img/background.png",
    backgroundMid: "img/middle.png",
    foreground: "img/foreground.png",
    enemy1:     "img/enemy1.png",
    enemy2:     "img/enemy2.png",
    enemy3:     "img/enemy3.png",
};

function characterWalk() {
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

function DrawEnemies(ctx) {
    $.each(enemies, function(idx, elt) {
        enemies[idx].draw(ctx); 
    }, false);
}

function GameLoop() {

    player.Update();

    DrawParallaxBackground(context);
    player.Draw(context);
    DrawParallaxForeground(context);

    setTimeout(GameLoop, 1000/FPS);
}

function InitKeyboardHandler() {

    $(window).keydown(function(evt) {
          switch (evt.keyCode) {
              case 38:  /* Up arrow was pressed */
                  player.Y -= playerSpeed;
                  if(player.Y < 300) player.Y = 300;
                  break;
              case 40:  /* Down arrow was pressed */
                  player.Y += playerSpeed;
                  if(player.Y > 450) player.Y = 450;
                  break;
              case 37:  /* Left arrow was pressed */
                  player.X -= playerSpeed;
                  player.FacingBackwards = true;
                  if(player.X - cameraPosition < 200) {
                      cameraPosition -= playerSpeed
                      if(cameraPosition < 0) cameraPosition = 0;
                  }
                  player.Walk();
                  break;
              case 39:  /* Right arrow was pressed */
                  player.X += playerSpeed;
                  player.FacingBackwards = false;
                  if(player.X - cameraPosition > 500) {
                      cameraPosition += playerSpeed
                  }
                  player.Walk();
                  break;

              case 32: // Spaaaaaace
                player.Jump();
                break;
          }
      });
}
