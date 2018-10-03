// ===============================================================================
// LOAD DATA
// We are linking our routes to a series of "data" sources.
// These data sources hold arrays of information on table-data, waitinglist, etc.
// ===============================================================================

// const todoItems = require('../data/itemList.js');

// Sample table is a dummy table for validation purposes
// const sampleItem = require('../data/sampleItem.json');

const dataBase = require('../models/');

const mongoose = require("mongoose");

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function(app) {

  mongoose.connect("mongodb://localhost/", { useNewUrlParser: true });

  dataBase.ItemList.create({ name: "ToDo" })
  .then(function(data) {
    // If saved successfully, print the new Library document to the console
    console.log(data);
  })
  .catch(function(err) {
    // If an error occurs, print it to the console
    console.log(err.message);
  });

  // API Requests for /api/tables
  // Below code controls what happens when a request is made to /api/tables

  // GET Request
  // Responds with all the currently reserved tables
  app.get('/api/items', function(req, res) {
    dataBase.Item.find({})
    .then(function(data) {
      // If any Books are found, send them to the client
      res.json(data);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
  });

  // POST Request
  // Adds a new table to our data collection
  // Responds with success: true or false if successful
  app.post('/api/items', function(req, res) {
    console.log("start");
    // Checks to make sure every property on the req.body is also on sampleTable
    // If it's not, returns with success: false and exits the function
    dataBase.Item.create(req.body)
    .then(function(dbItem) {
      // If a Book was created successfully, find one library (there's only one) and push the new Book's _id to the Library's `books` array
      // { new: true } tells the query that we want it to return the updated Library -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return dataBase.ItemList.findOneAndUpdate({}, { $push: { items: dbItem._id } }, { new: true });
    })
    .then(function(data) {
      // If the Library was updated successfully, send it back to the client
      res.json(data);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
  });

  // PUT Request
  // Replaces the table at the referenced index with the one provided
  // Responds with success: true or false if successful
  app.put('/api/items/:id', function(req, res) {
    // Using the same validation as our POST route to check if the included data is valid
    // Checks to make sure every property on the req.body is also on sampleTable
    // If it's not, returns with success: false and exits the function
    dataBase.ItemList.findOneAndUpdate( {_id: req.params.id}, { {}} , {new: false})
    
    for(let key in req.body) {
       if(!dataBase.schema.hasOwnProperty(key)) {
         return res.json({ success: false });
       }
     }
    
    // Checks to make sure every property on the sampleTable is also on req.body
    // If it's not, returns with success: false and exits the function
     for(let key in dataBase.schema) {
       if(!req.body.hasOwnProperty(key)) {
         return res.json({ success: false });
       }
     }

    // Replace the referenced table with the one provided in the body
    database.splice(req.params.index, 1, req.body);
    console.log(req.body);
    return res.json({ success: true });
  });

  // DELETE Request
  // Removes the table at the referenced index-
  // If there are tables on the waiting list, moves them to the reserved tables list
  // Responds with success: true or false if successful
  app.delete('/api/items/:index', function(req, res) {

    // Remove the referenced table from the tableList
    dataBase.splice(req.params.index, 1);
    
    // Respond that this operation was successfully completed
    res.json({ success: true });
  });
}
