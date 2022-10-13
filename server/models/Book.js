const { Schema, model } = require("mongoose");

const BookSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    author: {
        type: String,
        required: true
      },
    createdBy: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = model("books", BookSchema);
