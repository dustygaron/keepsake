document.addEventListener('DOMContentLoaded', () => {


  document.getElementById('create-child').onsubmit = function(event){

    event.preventDefault();

    let name = document.getElementById('childName').value;
    let dob = document.getElementById('childDob').value;
    let image = document.getElementById('newChildImage').files[0];
    let creator = document.getElementById('creatorId').value;


    //console.log("THE DOB STRING IS ========= :"+dobString);

// child model:

// const childSchema = new Schema({
//   name: String,
//   dob: Date,
//   image: String,
//   creator: {type: Schema.Types.ObjectId, ref: 'User'}, 
//   postings: [{type: Schema.Types.ObjectId, ref: 'Posting'}]


const formData = new FormData();

formData.append('childName', name);
formData.append('childDob', dob);
formData.append('newChildImage', image);
formData.append('creatorId', creator);


// make axios request and send the correct stuff in req.body
     axios.post('/api/feed/new-child', formData)
     .then((result)=>{

        let childId = result.data.newChild._id
        //console.log(`The CHILD ID IS:`+result.data.newChild._id)
      
        axios.get('/api/feed/created-child/'+childId)
          .then((response)=>{
            
            console.log(response)
           // take the new updated info and put it on the page
           
           let createdChild = response.data


           let theName = createdChild.name
           let theDob = createdChild.dob
           let theImage = createdChild.image
           let theNewChildId = createdChild._id
   

          $("#child-list").prepend(`<div class="col s12 m2"><a href="/feed/${theNewChildId}">
           <div class="card">
            <div class="card-image">
              <img src="${theImage}">
              <span class="card-title">
                ${theName}
              </span>
             </div>
            </div>
           </a></div>`)

          $(".toggle-avatars").prepend(`<li>
          <a href="/feed/details/"+${theNewChildId}>
            <img class="circle avatar" src="${theImage}">
          </a>
        </li>`)
      
       })
       .catch((err)=>{
           console.log(err);
        })
      })
       .catch((err)=>{
        console.log(err);
      })

    
    
    }  // end of on-click function

  }, false);