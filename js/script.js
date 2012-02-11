$(function() {

  var messages = $('#messages');
 
  $('#cat-selection .cat').on('click', function() {
  
    //Set the selected cat variable
    selectedCat = $(this).attr('id');

    //Remove other active class from other cats
    $('#cat-selection .cat.selected').removeClass('selected');

    $(this).addClass('selected');

    //Check for a username
    if($('#player-name').val() != ''){
      $('#start-game').addClass('active');
    } 

  });

  $('#player-name').on('blur', function() {
    if(selectedCat) {
      $('#start-game').addClass('active');
    }
  });

  $('#start-game').on('click', function(e) {

    e.preventDefault();

    if($(this).hasClass('active')) {

      var playerName = $('#player-name').val();
      if(selectedCat && playerName) {
        
        //Initialise the game
        initialise(selectedCat, playerName)

      } else {

        console.log('You havent selected a cat');

      }

    }

  });

  function initialise(selectedCat, playerName) {

    $('#cat-selection').fadeOut(function() {
      $('#canvas').fadeIn();
    });

    
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
  
  }

});
