const express = require('express');
const router = express.Router();
const {signUp,signIn, getUserInfo, logout} = require('../controllers/authController.js');
const jwtAuth = require('../middleware/jwtAuth.js');

//router for signUp or create an account 
router.post('/signup',signUp);
//router for signin
router.post('/signin',signIn);
//router for getUserInfo
router.get('/user',jwtAuth,getUserInfo);
//router for logout
router.get('/logout',jwtAuth,logout);

module.exports = router;