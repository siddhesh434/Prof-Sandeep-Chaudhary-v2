// insert-books.js - Script to insert book data into MongoDB

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bookSchema = new mongoose.Schema({
  author: String,
  title: String,
  year: Number,
  isbn: String,
  photo: String,
});

const Book = mongoose.model("Book", bookSchema);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Book data from your input
const bookData = [
  {
    author: "Chaudhary, S., Patel, K. A.",
    title: "Testing & Evaluation of Civil Engineering Materials",
    year: 2023,
    isbn: "9780128189610",
    photo: "/images/books/book1.jpg"
  },
  {
    author: "Hau, K. K., Gupta, A. K., Chaudhary, S., Gupta, T. (Editors)",
    title: "Recent Advances in Structural Engineering and Construction Management - Select Proceedings of ICSMC 2021",
    year: 2022,
    isbn: "9789811940392",
    photo: "/images/books/book2.jpg"
  },
  {
    author: "Samui, P., Kim, D., Iyer, N., and Chaudhary, S. (Editors)",
    title: "New Materials in Civil Engineering",
    year: 2020,
    isbn: "9780128189610",
    photo: "/images/books/book3.jpg"
  },
  {
    author: "Pancharathi, R.K., Sangoju, B., and Chaudhary, S. (Editors)",
    title: "Lecture Notes in Civil Engineering: Advances in Sustainable Construction Materials - Select Proceedings of ASCM 2019",
    year: 2020,
    isbn: "9789811533631",
    photo: "/images/books/book4.jpg"
  },
  {
    author: "Chaudhary, S., and Tripathi, B. (Editors)",
    title: "Current Challenges in Structural Engineering",
    year: 2013,
    isbn: "97898382880738",
    photo: "/images/books/book5.jpg"
  },
  {
    author: "Misra, A., and Chaudhary, S. (Editors)",
    title: "Sustainable Concrete Infrastructure Development",
    year: 2009,
    isbn: "9788190872317",
    photo: "/images/books/book6.jpg"
  },
  {
    author: "Chaudhary, S., Tiwari, S. K., and Chaudhary, M. (Editors)",
    title: "Recent trends in Geotechnical and Structural Engineering",
    year: 2007,
    isbn: "",
    photo: "/images/books/book7.jpg"
  }
];

// Insert data function
const insertBooks = async () => {
  try {
    // Delete existing data (optional)
    await Book.deleteMany({});
    console.log("Deleted existing books");

    // Insert new data
    const result = await Book.insertMany(bookData);
    console.log(`${result.length} books inserted successfully`);

    // Close connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting books:", error);
  }
};

// Run the function
insertBooks();
