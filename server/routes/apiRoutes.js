const express = require("express");
const { userRegister, userLogin, userAuth, profile } = require("../utils/Auth");
const { createABook, getAllBooks, deleteBooks, editBook } = require("../utils/books");
const router = express.Router();

router.post("/books",userAuth,createABook);
router.get("/books",userAuth,getAllBooks);
router.post("/register",userRegister);
router.post("/login",userLogin);
router.get("/profile", userAuth,profile);
router.post("/delete-books",userAuth,deleteBooks);
router.post("/edit-book",userAuth,editBook);

module.exports = router;

