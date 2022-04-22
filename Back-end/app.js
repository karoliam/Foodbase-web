'use strict';
const express = require('express');                     // express
const cors = require('cors');                           // cors
const userRoute = require('./routes/userRoute');        // route user
const postRoute = require('./routes/postRoute');        // route post
const foodFactRoute = require('./routes/foodFactRoute');// route food_fact
const app = express();                                  // express
const port = 3000;                                      // port

app.use(cors());                                        // cors
app.use(express.json());                                // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/user', userRoute);                            // route for user
app.use('/post', postRoute);                            // route for post
app.use('/food_fact', foodFactRoute);                   // route for food_fact

app.listen(port, () =>
    console.log(`app listening on port ${port}!`));

// TODO database is still missing a link between posts & food_facts
// TODO database is still missing a link between posts & users

// TODO my idea is to make a table that takes in foreach as input from tickboxes in frontend

// "cors": "^2.8.5",
// npm install cors

// "dotenv": "^16.0.0",
// npm install dotenv --save

// "express": "^4.17.3",
// npm install express

// "multer": "^1.4.4",
// npm install --save multer

// "mysql2": "^2.3.3",
// npm install --save mysql2

// "node": "^17.7.2",
// npm install node

// "nodemon": "^2.0.15",
// npm install nodemon

// "express-validator": "^6.14.0",
// npm install --save express-validator
