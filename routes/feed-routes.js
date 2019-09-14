const express = require('express');
const router = express.Router();
const Posting = require('../models/Posting');
const Child = require('../models/Child');
const User = require('../models/User');

const fileUploadMiddleWare = require('../config/cloudinary-file');


// LOAD HOME FEED =================================

router.get('/', (req, res, next) => {
  if (!req.user) {
    req.flash('Error', 'Please login to view.')
    //res.redirect('/')
  }
  console.log('SESSION------------------------')
  console.log(req.user)
  console.log('-------------------------------')

  Child.find()
    .then((children) => {

      Posting.find()
        .then((posts) => {

          let childList = children.map((eachChild) => {
            if (eachChild.creator.equals(req.user._id)) {
              eachChild.owned = true;
              return eachChild
            } else {
              console.log("No children found for this user.")
            }
          })

          let postList = posts.map((eachPost) => {
            if (eachPost.creator.equals(req.user._id)) {
            children.map((eachChild) => {
              if (eachChild.id == eachPost.child) {
                eachPost.child = eachChild;
              } else {
                console.log("No children found for this user.")
              }
            })
            eachPost.owned = true;
            return eachPost
            } else {
            console.log("No postings found for this user.")
            }
            })
          
          let chronologicalPosts = postList.reverse()
          let chronologicalChildList = childList.reverse()

          res.render('home-feed', { listOfChildren: childList,listOfPosts: postList });
          //console.log("POSTS BY ORDER:"+chronologicalPosts)
        })
        .catch((err) => {
          next(err)
        })
    }) // end of Child find .then
    .catch((err) => {
      next(err)
    })

}) // end of get request for home feed.


// GET CHILD DETAILS =================================

router.get('/details/:idVariable', (req, res, next) => {
  const theID = req.params.idVariable;

  Child.findById(theID)
    .then((result) => {
      res.render('child-details', { theSingleChild: result })
    })
    .catch((err) => {
      next(err)
    })
})


// REMOVE CHILD AND POSTINGS =================================

router.post('/:id/remove', (req, res, next) => {
  const id = req.params.id;

  
    Child.findByIdAndRemove(id)
    .then((childRemoved) => {

      Posting.deleteMany({child:id})
      .then((postRemoved) => {

        
        req.flash('success', 'Child and postings removed')
  
        res.redirect('/feed')
        //res redirect take a url as the argument    
      })
      .catch((err) => {
        next(err);
      })
    })
    .catch((err) => {
      next(err);
    })

}) // end of router.post



// REMOVE POSTING FROM HOME PAGE =================================

router.post('/remove-post/:id', (req, res, next) => {
  const id = req.params.id;

    Posting.findByIdAndRemove(id)
    .then((postRemoved) => {

      req.flash('success', 'Posting removed')

      res.redirect('/feed')
      //res redirect take a url as the argument    
    })
    .catch((err) => {
      next(err);
    })

}) // end of router.post


// LOAD CHILD FEED =================================

router.get('/:childId', (req, res, next) => {

  const childId = req.params.childId
  //console.log(`USER ID: ${req.user._id} ================`)
  //console.log(`CHILD ID: ${req.params.childId} ================`)

Child.find()
.then((children) => {

  Child.findById(childId)
    .then((child) => {

      Posting.find({creator: req.user._id})
        .then((posts) => {

          let postList = posts.map((eachPost) => {
            if (eachPost.creator.equals(req.user._id)) {
            children.map((eachChild) => {
              if (eachChild.id == eachPost.child) {
                eachPost.child = eachChild;
              } else {
                console.log("No children found for this user.")
              }
            })
            eachPost.owned = true;
            return eachPost
            } else {
            console.log("No postings found for this user.")
            }
          })

          let childList = children.map((eachChild) => {
            if (eachChild.creator.equals(req.user._id)) {
              eachChild.owned = true;
              return eachChild
            } else {
              console.log("No children found for this user.")
            }
          })

          let chronologicalPosts = postList.reverse()
          let chronologicalChildList = childList.reverse()
          //console.log(postList)
          res.render('child-feed', { listOfChildren: childList, theChild: child, listOfPosts: postList});
        })
        .catch((err) => {
          next(err)
        })
    })
    .catch((err) => {
      next(err)
    })
  .catch((err) => {
    next(err)
  })
}) // end of find all children

}) //end of router.get



// CREATE POST ====================================================

router.post('/:childId/new-post', fileUploadMiddleWare.single('artImage'), (req, res, next) => {

  const childId = req.params.childId
  let artTitle = req.body.artTitle;
  let dateCreated = req.body.dateCreated;
  let description = req.body.description
  let image = '/images/no-art.jpg';

  // posting model: 
  // title: String,
  // creation: Date,
  // description: String,
  // image: String,
  // child: [{type: Schema.Types.ObjectId, ref: 'Child'}],
  // creator: {type: Schema.Types.ObjectId, ref: 'User'}

  if (req.file) {
    image = req.file.url;
  }

  Child.findById(childId)
    .then((child) => {

      Posting.create({
        title: artTitle,
        creation: dateCreated,
        description: description,
        image: image,
        child: childId,
        creator: req.user._id
      })
        .then((post) => {

          req.flash('success', 'New art successfully added')

          res.render('child-feed', { childPosts: post, theChild: child })

        })
        .catch((err) => {
          next(err)
        })

    })
    .catch((err) => {
      next(err)
    }) // end of .catch for childfindbyid

}) // end of router.post

 

// PREVIOUS METHOD TO CREATE CHILD (WITHOUT AXIOS):

// router.post('/create-child', fileUploadMiddleWare.single('childImage'), (req, res, next) => {
//   let newName = req.body.theName;
//   let newDOB = req.body.theDateOfBirth;
//   let image = '/images/no-avatar.jpg';

//   if (req.file) {
//     image = req.file.url;
//   }

//   console.log(image)
  
//   Child.create({
//     name: newName,
//     dob: newDOB,
//     image: image,
//     creator: req.user._id
//   })
//     .then(() => {

//       req.flash('success', 'New Child successfully added')

//       res.redirect('/feed')
//       //res redirect take a url as the argument
//     })
//     .catch((err) => {
//       next(err)
//     })
// })


















module.exports = router;