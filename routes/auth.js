const User = require("../models/user");
const express = require("express");
const authController = require("../controllers/auth.js");

const router = express.Router();

const {body} = require("express-validator");

router.put("/signup",[
    body("email")
    .isEmail()
    .withMessage("Please enter the email in currrect format.")
    .custom((value,{req}) => {
        return User.findOne({email:value}).then(user => {
            if(user){
                return Promise.reject("This user already exists");
            }
        })
    })
    .normalizeEmail(),
    body("name").trim().isLength({min:5}).not().isEmpty(),
    body("password").trim().isAlphanumeric().isLength({min:5})
],authController.putSignup);

router.post("/login",authController.postLogin)

module.exports = router;