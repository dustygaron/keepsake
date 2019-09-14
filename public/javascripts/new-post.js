document.addEventListener('DOMContentLoaded', () => {


  document.getElementById('create-post').onsubmit = function (event) {

    event.preventDefault();

    let title = document.getElementById('postTitle').value;
    let date = document.getElementById('postDate').value;
    let description = document.getElementById('postDescription').value;
    let childId = document.getElementById('childId').value;
    let childDateOfBirth = document.getElementById('childBirthdate').value;

    let image = document.getElementById('upload-file').files[0];


    const formData = new FormData();

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


            // GET CHILD'S AGE AT CREATION OF ART ITEM : ==========================================
                    
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
           // ==================================================

            $("#child-feed-gallery").prepend(`<div class="col l4 m6 s12 gallery-item gallery-expand gallery-filter polygon">
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
                    <span class="price">Age at creation: ${theDate} years old</span>
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


          })
          .catch((err) => {
            console.log(err);
          })
      })
      .catch((err) => {
        console.log(err);
      })



  }  // end of on-click function

}, false); // end of document event listener