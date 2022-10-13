const cors = require("cors");
const exp = require("express");
const bp = require("body-parser");
const passport = require("passport");
const { connect } = require("mongoose");
const { success, error } = require("consola");
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection');
// Bring in the app constants
const { DB, PORT } = require("./config");
const router = require("./routes/apiRoutes");

// Initialize the application
const app = exp();

// Middlewares
app.use(cors());
app.use(bp.json());
app.use(passport.initialize());

require("./middlewares/passport")(passport);

// User Router Middleware
app.use("/api/", router);
//app.use("/api/books", require("./routes/books"))
connectDB(mongoose);

//once my db connection is made then only i will start my server
mongoose.connection.once('open',()=>{
  console.log('Connected to DB');
  app.listen(PORT,()=>{
      console.log(`Listening to port: ${PORT}`);
  })
})
