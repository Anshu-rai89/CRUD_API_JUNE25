const _ = require('lodash');
const User = require('../Modal/User');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');
require('dotenv').config();

/**
 * Registers a new user.
 *
 * @typedef RegisterUserRequestBody
 * @property {string} name - The user's name.
 * @property {string} email - The user's email address.
 * @property {string} password - The user's password.
 *
 * @returns {Promise<void>}
 *
 * @throws {400} - If validation errors occur or a user with the provided email already exists.
 * @throws {500} - If an internal server error occurs during registration.
 */
module.exports.registerUser = async (req, res) => {
    try{
        const {name, email, password} = req.body;

      const errors = validationResult(req);

      if(!errors.isEmpty()) {
        return res.status(400).json({
          msg:"Bad request",
          data: errors
        })
      }
      
        // you can check if a user with given email id exist in our system
        const exisitngUser = await User.findOne({email})

        if(exisitngUser) {
            return res.status(400).json({
            msg: "User already registered.Please login to continue.",
            data: [],
            });
        }


        const user = await User.create({name, email, password});
        return res.status(201).json({
            msg:"User register successfully.",
            data: user.id
        })

    }catch(error) {
        return res.status(500).json({
            msg:"Internal server error",
            data: []
        })
    }
}


 module.exports.loginUser = async (req, res) => {
   try {
     const { email, password } = req.body;

     // you can check if a user with given email id exist in our system
     const exisitngUser = await User.findOne({ email });

     if (_.isEmpty(exisitngUser)) {
       return res.status(400).json({
         msg: "User is not present. Please register and try again.",
         data: [],
       });
     }

     if (exisitngUser.password !== password) {
       return res.status(400).json({
         msg: "Password or email is incorrect.",
         data: [],
       });
     }

     // create a token and send it in response

     const token = jwt.sign(
       { name: exisitngUser.name, email: exisitngUser.email },
       process.env.JWT_SECRET
     );

     return res.status(200).json({
       msg: "User login successfully.",
       data: { token },
     });
   } catch (error) {
     return res.status(500).json({
       msg: "Internal server error",
       data: [],
     });
   }
 };