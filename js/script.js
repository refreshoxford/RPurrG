$(function() {

  var messages = $('#messages');
 
  $('#cat-selection .cat').on('click', function() {
  
    //Set the selected cat variable
    selectedCat = $(this).attr('id');

    //Check for a username
    if($('#player-name').val() != ''){
      $('#start-game').addClass('active');
    } 

    messages.html('You have selected ' + selectedCat);

  });

  $('#start-game').on('click', function(e) {

    e.preventDefault();

    if($(this).hasClass('active')) {

      var playerName = $('#player-name').val();
      if(selectedCat && playerName) {
        console.log(selectedCat)

        //Initialise the game
        initialise(selectedCat, playerName)

      } else {
        console.log('You havent selected a cat');

      }

    }

  });

  function initialise(selectedCat, playerName) {
    messages.html(playerName +', you have selected '+ selectedCat); 
  
  }

});
