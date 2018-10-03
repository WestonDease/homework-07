// jQuery handler that runs the encapsulated code when the page is ready.
$( function(){
    // Click listener for the submit button
    $('.submit').on('click', function(event) {
      event.preventDefault();
      // Here we grab the form elements
      const newTodo = {
        item: $('#newTodo').val(),
        checked: false
      }
      
      if(newTodo.item === ''){
        alert('Please fill out all fields');
      }
      
  
      console.log(newTodo);
  
      // This line is the magic. It's very similar to the standard ajax function we used.
      // Essentially we give it a URL, we give it the object we want to send, then we have a 'callback'.
      // The callback is the response of the server. In our case, we set up code in api-routes that 'returns' true or false
      // depending on if a tables is available or not.
  
      $.ajax({ url: '/api/items', method: 'POST', data: newTodo }).then(
        function(data) {
  
          // If our POST request was successfully processed, proceed on
          if (data.success) {
  
            console.log('data', data)
            // If a table is available... tell user they are booked.
            if (!data.items) {
              alert('Yay! You are officially booked!');
            }

            // Clear the form when submitting
            $('#newTodo').val('');
            
            $('#newTodo').focus();
          } else {
  
            alert('There was a problem with your submission. Please check your entry and try again.');
          }
          
  
        });
    });
  });
  