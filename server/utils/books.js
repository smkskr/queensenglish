const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Book = require("../models/Book");
const { SECRET } = require("../config");

/**
 * @DESC To create a new entry of a book
 */
const createABook = async (req,res) => {
  try {
    
    // create a new book
     let bookDets = req.body;
      const newBook = new Book({
        ...bookDets
      });
      Book.create(newBook,function(err, newBook){
          if(err){
              console.log(err);
              return res.status(500).json({
                  message: "Unable to save book",
                  success: false
                });
          }
          return res.status(201).json({
              message: "Book has been saved successfully",
              success: true
            });
  
      })
  // }
    
    
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: "Unable to save book",
      success: false
    });
  }
};


const getAllBooks = async(req,res) => {
  
    var minutesToSubtract=10;
    var filteredDate;
    var filter={};
    let roles = req.headers.role.split(",");
    const role = roles.filter(role => role === 'VIEWER').length === 1 ? true : false;
    if(req.query.old == 1){
      var currentDate = new Date();
      filteredDate = new Date(currentDate.getTime() - minutesToSubtract*60000);
      filter['createdAt'] = {'$lte': filteredDate};
    }else if(req.query.new == 1){
      var currentDate = new Date();
      filteredDate = new Date(currentDate.getTime() - minutesToSubtract*60000);
      filter['createdAt']  = {'$gte': filteredDate};
    }
    if(role){
      let username = req.headers.username;
      filter['createdBy'] = username;
    }
    try{
        let data;
        data = await Book.find(filter).exec();
        if(data.length == 0){
            return res.status(200).send({
                results:data,
                message: "No data found",
                success: true
              });
        }
        return res.status(200).send({
            results: data,
            message: "Data Size : " + data.length,
            success: true
          });
     
    }catch (err) {
        return res.status(500).send({
            message: err.message,
            success: false
          });
    }
}

const deleteBooks = async(req, res) => {

  Book.deleteOne({ _id: req.body['_id']}).then(function(){
    return res.status(200).send({
      message: "Book deleted",
      success: true
    });
  }).catch(function(error){
    return res.status(500).send({
      message: error.message,
      success: true
    });
  });
}

const editBook = async(req, res) => {
  const filterId = req.body._id;
  delete req.body._id;
  await Book.findOneAndUpdate({_id:filterId},req.body).orFail(function(error){
    console.log(error);
    return res.status(500).send({
      message: "Book not found",
      success: true
    });
  });
  return res.status(200).send({
    message: "Book updated",
    success: true
  })
}

module.exports = {
    createABook,
    getAllBooks,
    deleteBooks,
    editBook
};
