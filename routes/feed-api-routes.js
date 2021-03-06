const express = require('express');
const router  = express.Router();
const bcrypt = require('bcryptjs');
const Posting = require('../models/Posting');
const Child   = require('../models/Child');
const User    = require('../models/User');
var moment    = require('moment');

const fileUploader = require('../config/cloudinary-file');

 
// CREATE NEW POST WITH AXIOS =========================================================

router.post('/api/feed/new-post', fileUploader.single('postImage'), (req, res, next)=>{
    
    
    Posting.create({ 
        title: req.body.postTitle,
        creation: req.body.postDate,
        description: req.body.postDescription,
        image: req.file.url,
        child: req.body.postChildId,
        creator: req.user._id,
    })
    .then((newPost)=>{
        
        res.json({msg: 'json-ified!', newPost});
    })  
    .catch((err)=>{
        console.log(err)
    })
    
})

// GET CREATED POST =========================================================

router.get('/api/feed/created-post/:id', (req, res, next)=>{

    let id = req.params.id

    console.log(id)

    Posting.findById(id)
    .then((theNewPosting)=>{
    
        res.json(theNewPosting)
    })
    .catch((err)=>{
        next(err);
    })
})

// CREATE NEW CHILD =========================================================

router.post('/api/feed/new-child', fileUploader.single('newChildImage'), (req, res, next)=>{

    Child.create({ 
        name: req.body.childName,
        dob: req.body.childDob,
        image: req.file.url,
        creator: req.user._id
    })
    .then((newChild)=>{
  
        res.json({msg: 'Data has been converted into JSON', newChild});
        console.log(newChild.data)
    })  
    .catch((err)=>{
        console.log(err)
    })
  
  })
  


// GET CREATED CHILD  =========================================================

router.get('/api/feed/created-child/:id', (req, res, next) => {
    
    let id = req.params.id

    Child.findById(id)
    .then((theNewChild)=>{

        res.json(theNewChild)
    })
    .catch((err)=>{
        next(err);
    })
  })
  
  
// EDIT CHILD  =========================================================

router.put('/api/feed/edit-child/:id', fileUploader.single('newChildImage'), (req, res, next)=>{

    let id = req.params.id;

    Child.findByIdAndUpdate(id, {$set: {name: req.body.childName, dob: req.body.childDob}})
    .then((theUpdatedChild)=>{
  
        res.json({msg: 'Data has been converted into JSON', theUpdatedChild});
        console.log(theUpdatedChild.data)
    })  
    .catch((err)=>{
        console.log(err)
    })
  }

  )

// GET EDITED CHILD =======================================================

router.get('/api/feed/edited-child/:id', (req, res, next) => {
    
    let id = req.params.id

    Child.findById(id)
    .then((theNewChild)=>{

        res.json(theNewChild)
    })
    .catch((err)=>{
        next(err);
    })
  })


// EDIT USER  =======================================================


router.put('/api/feed/edit-user/:id', fileUploader.single('newUserImage'), (req, res, next)=>{

    let id = req.user._id;
    let pword = req.body.userPw

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(pword, salt);

    User.findByIdAndUpdate(id, {$set: {username: req.body.userName, password: hashedPassword, email: req.body.userEmail}})
    .then((theUpdatedUser)=>{
        req.flash('Success', 'Your account has been updated.')
        res.json({msg: 'Data has been converted into JSON', theUpdatedUser});
        console.log(theUpdatedUser.data)
    })  
    .catch((err)=>{
        console.log(err)
    })
  }

  )


  // GET EDITED USER  =======================================================

  router.get('/api/feed/edited-user/:id', (req, res, next) => {
    
    let id = req.user._id

    User.findById(id)
    .then((theUpdatedUser)=>{

        res.json(theUpdatedUser)
    })
    .catch((err)=>{
        next(err);
    })
  })


// EDIT POST  =========================================================

router.put('/api/feed/edit-post/:id', fileUploader.single('newChildImage'), (req, res, next)=>{

    let id = req.params.id;

    Child.findByIdAndUpdate(id, {$set: {name: req.body.childName, dob: req.body.childDob}})
    .then((theUpdatedChild)=>{
  
        res.json({msg: 'Data has been converted into JSON', theUpdatedChild});
        console.log(theUpdatedChild.data)
    })  
    .catch((err)=>{
        console.log(err)
    })
  }

  )

// GET EDITED POST =======================================================

router.get('/api/feed/edited-post/:id', (req, res, next) => {
    
    let id = req.params.id

    Child.findById(id)
    .then((theNewChild)=>{

        res.json(theNewChild)
    })
    .catch((err)=>{
        next(err);
    })
  })









module.exports = router;