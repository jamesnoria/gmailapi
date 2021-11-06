const express = require('express');

const app = express();
const path = require('path');

const port = 3000;

// Config type of input-data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes:
app.use(require('./routes/index'));

// defining the public files (*html, *css)
app.use(express.static(path.join(__dirname, 'public')));

// Where is the port listening
app.listen(port, () => {
  console.log(`Hi, here i am, on port: ${port} :lol:`);
});
