document.addEventListener('DOMContentLoaded', () => {

  const formData = new FormData();
  
  // Initialize collapsible items from Materialize CSS
  // var elems = document.querySelectorAll('.collapsible');
  // var instances = M.Collapsible.init(elems, options);
  // var instance = M.Collapsible.getInstance(elem)

 // CREATE NEW POST ============================================================================================

  document.getElementById('create-post').onsubmit = function (event) {

    event.preventDefault();

    //instance.close(0);

    let title = document.getElementById('postTitle').value;
    let date = document.getElementById('postDate').value;
    let description = document.getElementById('postDescription').value;
    let childId = document.getElementById('childId').value;
    let childDateOfBirth = document.getElementById('childBirthdate').value;

    let image = document.getElementById('upload-file').files[0];


    formData.append('postTitle', title);
    formData.append('postDate', date);
    formData.append('postDescription', description);
    formData.append('postChildId', childId);
    formData.append('postImage', image);


    // make axios request and send the correct stuff in req.body
    axios.post('/api/feed/new-post', formData)
      .then((result) => {

        console.log(result.data.newPost._id)


        axios.get('/api/feed/created-post/' + result.data.newPost._id)
          .then((response) => {
            // take the new updated info and put it on the page

            let createdPost = response.data

            let theTitle = createdPost.title
            let theDate = createdPost.creation
            let theDescription = createdPost.description
            let theImage = createdPost.image

            console.log(theTitle, theDate, theDescription, theImage)


            // GET CHILD'S AGE AT CREATION OF ART ITEM : ===========================
                    
           function diffInYears(date2, date1) {
            var diff =(date2.getTime() - date1.getTime()) / 1000;
             diff /= (60 * 60 * 24);
            return Math.abs(Math.round(diff/365.25));
           }
          
           date2 = new Date(theDate); // Grab date of creation of art item
           date1 = new Date(childDateOfBirth); // Birthday of child
           //date2 = new Date(theDob);
           console.log("CHILD AGE AT CREATION IS:"+diffInYears(date2,date1))
           console.log(diffInYears(date2,date1));
           
           
          // Function to convert date to acceptable format for form:  ==========================================
          dateYear = theDate.slice(0,4)
          dateMonth = theDate.slice(5,7)
          dateDay = theDate.slice(8,10)

          convertedDate = String(dateYear)+"-"+String(dateMonth)+"-"+String(dateDay)

           // CREATE HTML TO APPEND ==================================================


            $("#child-feed-gallery").append(`<div class="col l4 m6 s12 gallery-item gallery-expand gallery-filter polygon">
            <div class="gallery-curve-wrapper">
    
              <div class="hoverable">
                <a class="gallery-cover gray">
                  <img class="responsive-img art-img" src="${theImage}" alt="picture">
                </a>
                <div class="gallery-header">
                  <span>${theTitle}</span>
                </div>
                <div class="gallery-body">
                  <div class="title-wrapper">
                    <h3>${theTitle}</h3>
                    <span class="price">Age at creation: ${convertedDate} years old</span>
                  </div>
                  <div>
                    <p class="description">
                      ${theDescription}
                    </p>
                    <img class="responsive-img" src="${theImage}" alt="${theTitle}" style="width:100%;">
                    <a href="#">Edit this Piece</a>
                  </div>
    
                </div>
    
                <div class="gallery-action">
                  <a href="#" class="btn-floating btn-large waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="Send to Grandma"><i class="material-icons">email</i></a>
                  <a href="#" class="btn-floating btn-large waves-effect waves-light tooltipped" data-position="bottom" data-tooltip="Order Prints"><i class="material-icons">wallpaper</i></a>
                </div>
              </div> 
            </div>
          </div>`)


          document.getElementById('postTitle').value = ""
          document.getElementById('postDate').value = ""
          document.getElementById('postDescription').value = ""
          document.getElementById('childId').value = ""
          document.getElementById('childBirthdate').value = ""

          document.getElementById('upload-file').files[0]=""

          })
          .catch((err) => {
            console.log(err);
          })
      })
      .catch((err) => {
        console.log(err);
      })



  }  // end of On-submit new post function




 // EDIT POST ======================================================================================================


 document.getElementById('edit-form').onsubmit = function (event) {

  console.log("FORM SUBMITTED")

  event.preventDefault();

  let title = document.getElementById('edit-title').value;
  let date = document.getElementById('edit-date').value;
  let description = document.getElementById('edit-description').value;
  let image = document.getElementById('edit-image').files[0];
  // let childDateOfBirth = document.getElementById('postChildBirthdate').value;
  let postId = document.getElementById('hidden-post-id').value;

  // Function to convert date to acceptable format for form:  ==========================================
  dobYear = date.slice(0,4)
  dobMonth = date.slice(5,7)
  dobDay = date.slice(8,10)

  let convertedDate = String(dobYear)+"-"+String(dobMonth)+"-"+String(dobDay)

  console.log(convertedDate)


  formData.set('postTitle', title);
  formData.set('postDate', date);
  formData.set('postDescription', description);
  // formData.set('postChildId', childId);
  formData.set('postImage', image);

  // make axios request and send the correct stuff in req.body
  axios.put('/api/feed/edit-post/'+postId, formData)
    .then((result) => {


      console.log("PUT WORKED")
      console.log('result.data IS:'+result.data)

      axios.get('/api/feed/edited-post/'+result.data.newPost._id)
        .then((response) => {
          // take the new updated info and put it on the page

          let editedPost = response.data

          let theTitle = editedPost.title
          let theDate = editedPost.creation
          let theDescription = editedPost.description
          let theImage = editedPost.image

          console.log(theTitle, theDate, theDescription, theImage)


          // GET CHILD'S AGE AT CREATION OF ART ITEM : ===========================
                  
         function diffInYears(date2, date1) {
          var diff =(date2.getTime() - date1.getTime()) / 1000;
           diff /= (60 * 60 * 24);
          return Math.abs(Math.round(diff/365.25));
         }
        
         date2 = new Date(theDate); // Grab date of creation of art item
         date1 = new Date(childDateOfBirth); // Birthday of child
         //date2 = new Date(theDob);
         console.log("CHILD AGE AT CREATION IS:"+diffInYears(date2,date1))
         console.log(diffInYears(date2,date1));
         

         // Function to convert date to acceptable format for form:  ==========================================
         dateYear = theDate.slice(0,4)
         dateMonth = theDate.slice(5,7)
         dateDay = theDate.slice(8,10)

         convertedDate = String(dobYear)+"-"+String(dobMonth)+"-"+String(dobDay)

         
         // EDIT HTML ==================================================

         document.getElementById('post-title').innerText = editedPost.title
         document.getElementById('').innerText = editedPost.creation
         document.getElementById('post-description').innerText = editedPost.description
         document.getElementById('post-image').innerText = editedPost.image



        document.getElementById('postTitle').value = ""
        document.getElementById('postDate').value = ""
        document.getElementById('postDescription').value = ""
        document.getElementById('childId').value = ""
        document.getElementById('childBirthdate').value = ""

        document.getElementById('upload-file').files[0]=""

        })
        .catch((err) => {
          console.log(err);
        })
    })
    .catch((err) => {
      console.log(err);
    })



}  // end of On-submit EDIT post function




















}, false); // end of document event listener