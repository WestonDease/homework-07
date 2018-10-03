
// jQuery handler that runs the encapsulated code when the page is ready.
$(function() {
    // In this code, jQuery is used to 'download' the data from our server
    // We then dynamically display this content in our table. This is very similar to the group projects you just completed.
  
    const render = function () {
  
      // Empty our output divs
      $('#itemList').empty();
      
      // Run Queries!
      // ==========================================
      runItemQuery();
    }
  
    const renderListItems = function (outputElement, dataList) {
      // Loop through and display each of the customers
      for (let i = 0; i < dataList.length; i++) {
          // Get a reference to the tableList element and populate it with tables
          const output = $(outputElement);
  
          // Removes the leading '#' from the outputElement
          const outputType = outputElement.slice(1);
  
          // Then display the input feild (list item) in the HTML
          // Adds an id for editing and deleting
          const listItem = 
            $('<p>')
              .attr('class', `${outputType}-${i}`);
  
          listItem.append(
            $('<p>').text(dataList[i].item)
          );
 

          listItem.append(
            $(`<button>`).on('click', function() {
                 sendItemUpdates( dataList[i].item , 'items');
            })
           );

           listItem.append(
            $(`<button>`).on('click', function() {
                deleteSelected( dataList[i].item , 'items');
            })
           );
          
          output.append(listItem);
        }
    }
  
    function sendItemUpdates(entry, route) {
      console.log('udating', entry);
      console.log(entry + " " + route);
      // Here we grab the form elements
      var flipCheck;
      console.log(entry.checked);
      if (entry.checked === 'true'){
        flipCheck = 'false';
      } else {
        flipCheck = 'true';
      }
      console.log(entry);
      alert("now");
      const itemShift = {
        item: entry,
        checked: flipCheck
      };

    for (let i; i < 0; i++){
      console.log(dataList[i]);
    }
      
      
      // Grab the index from the end of the entry
      const index = entry.split('-')[1];
      console.log(index);
      // Make the PUT request
      $.ajax(
        {
          url: `/api/${route}/${index}`,
          method: 'PUT' ,
          data: itemShift 
        })
        .then(function(data) {
          
          // If our PUT request was successfully processed, proceed on
          if (data.success) {
            render();
          } else {
  
            alert('There was a problem with your submission. Please check your entry and try again.');
          }
          
          console.log("test");
        });
        
    }
  
    const deleteSelected = function ( entry , route ) {
  
      // Grab the index from the end of the entry
      const index = entry.split('-')[1];
      // Make the PUT request
      $.ajax({url: `/api/${route}/${index}`, method: 'DELETE'})
        .then(function(data) {
  
          // If our DELETE request was successfully processed, proceed on
          if (data.success) {
            render();
          } else {
  
            alert('There was a problem with your submission. Please check your entry and try again.');
          }
          
  
        });
    }
  
    const runItemQuery = function () {
  
      // The AJAX function uses the URL of our API to GET the data associated with it (initially set to localhost)
      $.ajax({ url: '/api/items', method: 'GET' })
        .then(function(todoItems) {
          renderListItems('#itemList', todoItems);
        });
    }
  
    // This function resets all of the data in our tables. This is intended to let you restart a demo.
    const clearItems = function () {
      alert('Clearing...');
  
      // Clear the tables on the server and then empty the elements on the client
      $.ajax({ url: '/api/clear', method: 'POST' }).then(function() {
        $('#itemList').empty();
      });
    }
  
    $('#clear').on('click', clearItems);

    $('.submit').on('click', render);

    $(".itemCheckedButton").on('click', sendItemUpdates);
  
    $(document).on('click', '.delete', deleteSelected);
  
    // Render our data to the page
    render();
  });
  