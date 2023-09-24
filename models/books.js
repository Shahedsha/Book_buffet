const mongoose=require("mongoose");    

const bookSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    bookurl:{
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    year: {
      type: Number,
      required: true,
    },
    cert: {
      type: String,
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    type1: {
      type: String,
      required: true,
    },
    type2: {
      type: String,
      required: true,
    },
    special: {
      type: String,
    },
  },
  { timestamps: true }
);


const BooksModel=mongoose.model("Books", bookSchema)

module.exports=BooksModel

