'use strict';
const express = require('express');                                                 // express
const multer = require('multer');                                                   // multer
const {body} = require('express-validator');                                        // express-validator
const router = express.Router();                                                    // router
const foodFactController = require('../controllers/foodFactController');            // controller

const upload = multer({ dest: './uploads/' });                               // multer

router.route('/')                                                             // route /food_fact
    .get(foodFactController.get_food_facts)
    .post(upload.single('food_fact'),
        body('name').isAlphanumeric(),
        body('type').isNumeric(),
        foodFactController.create_new_food_fact)
    .put(upload.single('food_fact'),
        body('name').isAlphanumeric(),
        body('type').isNumeric(),
        foodFactController.modify_food_fact);

router.route('/:id')                                                          // route /food_fact/:id
    .get(foodFactController.get_food_fact_by_id)
    .delete(foodFactController.delete_food_fact_by_ID);

module.exports = router;                                                            // exports

// don't understand why, but I got PUT only working with multer