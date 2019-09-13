const express = require('express');
const router = express.Router();
const Posting = require('../models/Posting');
const Child = require('../models/Child');
const User = require('../models/User');

const fileUploadMiddleWare = require('../config/cloudinary-file');


// // CREATE POST ====================================================

// router.post('/:childId/new-post', fileUploadMiddleWare.single('artImage'), (req, res, next)=>{
  
//     const childId = req.params.childId 
//     let artTitle = req.body.artTitle;
//     let dateCreated = req.body.dateCreated;
//     let description = req.body.description
//     let image = '/images/no-avatar.jpg';

//     // // posting model: 
//     // title: String,
//     // creation: Date,
//     // description: String,
//     // image: String,
//     // child: [{type: Schema.Types.ObjectId, ref: 'Child'}],
//     // creator: {type: Schema.Types.ObjectId, ref: 'User'}
  
//     if (req.file) {
//       image = req.file.url;
//     }
  
//     Posting.create({
//       title: artTitle,
//       creation: dateCreated,
//       description: description,
//       image: image,
//       child: childId
//     })
//       .then((post) => {
  
//         req.flash('success', 'New art successfully added')
  
//         res.render('/feed/:childId', {childPosts: post})
        
//       })
//       .catch((err) => {
//         next(err)
//       })
//   })






















module.exports = router;