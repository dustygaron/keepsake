const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const Child = require('../models/Child');
const bcrypt = require('bcryptjs');
const passport = require("passport");


// INDEX PAGE - FOR LOGIN AND SIGNUP ===============================

router.get('/', (req, res, next)=>{
  res.render('index')
})


// SIGNUP =========================================================
// post request to the homepage. The form is on the homepage view. 

router.post('/signup', (req, res, next)=>{

    let username = req.body.theUsername;
    let pword = req.body.thePassword;
    let email = req.body.theEmail;

  if(!username || !pword){
    req.flash('Error', 'Please provide both username and password.')
    //res.redirect('/')
  }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(pword, salt);

    User.create({username: username, password: hashedPassword, email: email})
    .then(()=>{
      req.flash('Success', 'Your account has been created.')
        res.redirect('/')
        console.log("user created")
    })
    .catch((err)=>{
        next(err)
        console.log("no user created")
    })
})


// LOGIN  =========================================================
// form will be a post request on the index - homepage 

router.post('/login', passport.authenticate("local", {
  successRedirect: "/feed",
  failureRedirect: "/",
  failureFlash: true,
  passReqToCallback: true
}));


  // old version without passport
  //   const uName = req.body.theUsername;
  //   const pword = req.body.thePassword;

  // User.findOne({ "username": uName })
  // .then(user => {
  //     if (!user) {
  //       res.redirect('/')
  //     }
  //     if (bcrypt.compareSync(pword, user.password)) {
  //       // Save the login in the session!
  //       req.session.currentlyLoggedIn = user;
  //       res.redirect("/celebrities");
  //     } else {
  //       res.render("auth/login", {
  //         errorMessage: "Incorrect password"
  //       });
  //     }
  // })
  // .catch(error => {
  //   next(error);
  // })
  // begin new version with passport
// })



// LOGOUT =============================================

router.get('/feed/logout', (req, res, next)=>{
  req.logout();
  res.redirect('/')
})


// USER DETAILS PAGE =================================
// Link is on the home feed page.

router.get('/feed/user-details', (req, res, next)=>{
  const userId = req.user._id;
  console.log("User ID is:"+userId)
  
  User.findById(userId)
  .then((userInfo)=>{
    
    console.log(userInfo)
    let userArr = userInfo.data
    console.log(userArr);
    
    Child.find()
    .then((children) => {
      
      let childList = children.map((eachChild) => {
        if (eachChild.creator.equals(req.user._id)) {
          eachChild.owned = true;
          return eachChild
        } else {
          console.log("No children found for this user.")
        }
      })
  
      let chronologicalChildList = childList.reverse()

      res.render('user-details', {theUser: userInfo, listOfChildren: childList})
    
      })
      .catch((err) => {
        next(err)
      })
    }) // end of User find .then
    .catch((err)=>{
    next(err)
  })
}) // end of router.get



// DELETE USER =====================================

router.post('/feed/user-details/:id/remove', (req, res, next)=>{
  const userId=req.user._id;

  User.findByIdAndRemove(userId)
  .then(()=>{
   
    req.flash('success','The user account has been deleted.')

    res.redirect('/')
    //res redirect take a url as the argument
  })
  .catch((err)=>{
    next(err);
  })
})


module.exports = router;