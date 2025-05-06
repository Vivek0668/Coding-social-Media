const express = require('express');
const cors = require('cors');
const upload = require('express-fileupload');
require("dotenv").config();
const { connect } = require("mongoose");
const routes = require("./routes/routes");
const { notFound, errorHandler } = require('./middlewares/errormiddleware');

const app = express();

app.use(express.json({ extended: true }));
app.use(cors({ credentials: true, origin: ["http://localhost:5173"] }));
app.use(express.urlencoded({ extended: true }));
app.use(upload());

app.use('/api', routes);
app.use(notFound);       // 404 middleware
app.use(errorHandler);   // Error-handling middleware

connect(process.env.MONGO_URL)
  .then(() => app.listen(process.env.PORT || 8080, () => {
    console.log(`Server running on port ${process.env.PORT || 8080}`);
  }))
  .catch(err => console.error(err));
