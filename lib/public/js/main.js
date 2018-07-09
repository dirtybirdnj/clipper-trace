'use strict'

console.log('dont let your dreams be dreams!')

//Take in input values, make a trace
//Paint the trace to the workspace canvas
function newTrace(){

    //1. Read input values
    //2. Make ajax request ot backend
    //3. Update workspace based on output

    //JIMP Manipulations

    let brightness = document.getElementById('brightness').value()
    let contrast = document.getElementById('brightness').value()

    //Potrace Settings
    
    let turdsize = document.getElementById('turdsize').value()
    let contrast = document.getElementById('alphamax').value()

    //Make request to backend with settings
    //On response, add paths to display 


}

//For Filepicker updates

$(document).on('change', '.btn-file :file', function() {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
  });
  
  $(document).ready( function() {
      $('.btn-file :file').on('fileselect', function(event, numFiles, label) {
          
          var input = $(this).parents('.input-group').find(':text'),
              log = numFiles > 1 ? numFiles + ' files selected' : label;
          
          if( input.length ) {
              input.val(log);
          } else {
              if( log ) alert(log);
          }
          
      });
  });