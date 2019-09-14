document.addEventListener('DOMContentLoaded', () => {
  
  const formData = new FormData();

// CREATE CHILD FUNCTION ON SUBMIT OF CREATE CHILD FORM ===============================================

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


    //const formData = new FormData();

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
            
            console.log("NEW CHILD DATA:"+response)
           // take the new updated info and put it on the page
           
           let createdChild = response.data

           let theName = createdChild.name
           let theDob = createdChild.dob
           let theImage = createdChild.image
           let theNewChildId = createdChild._id
           let stringToModiyfUrl = 'w_300,h_300,c_fill,g_auto/' 

           // Function to convert date to acceptable format for form:  ==========================================
           dobYear = theDob.slice(0,4)
           dobMonth = theDob.slice(5,7)
           dobDay = theDob.slice(8,10)

           convertedDob = String(dobYear)+"-"+String(dobMonth)+"-"+String(dobDay)

        
           
           // Function to change the URL to produce the modified Url that will be the child card ================
           function changeUrl(stringA, stringB) {
             
            let pos = stringA.indexOf("upload")
            let positionForString = pos += 7
          
            let modifiedUrl = stringA.substr(0, positionForString) + stringB + stringA.substr(positionForString); 
          
            return modifiedUrl
            }

           let modifiedImageString = changeUrl(theImage, stringToModiyfUrl)

           // console.log(modifiedImageString)
   

           // Convert the date from the model into child's age through a function =======================

           function diffInYears(date2, date1) {
            var diff =(date2.getTime() - date1.getTime()) / 1000;
             diff /= (60 * 60 * 24);
            return Math.abs(Math.round(diff/365.25));
           }
          
           date2 = new Date(); // sets to today
           date1 = new Date(theDob);
           //date2 = new Date(theDob);
           console.log("CHILD AGE IS:"+diffInYears(date2,date1))
           let childAge = diffInYears(date2,date1);


           function childAgeString(age) {
             if (age <= 1) {
              age = age/12 
              return `${age}`+" months old"
             }
             else {
               return `${age}`+" years old"
             }
           }


          // HTML TO BE OUTPUT TO SCREEN TO CREATE NEW CHILD CARD  ======================================

          $("#child-list").prepend(`<div class="col s12 m3">

          <div class="card small">
            <a href="/feed/${theNewChildId}">
              <div class="card-image waves-effect waves-block waves-light">
                <img class="activator" src="${modifiedImageString}">
              </div>
            </a>
            <div class="card-content">
          <span class="card-title activator grey-text text-darken-4">${theName}<i class="material-icons right">mode_edit</i></span>
              <p>
                ${childAgeString(childAge)}</p>
            </div>
    
            <div class="card-reveal">
          <span class="card-title grey-text text-darken-4">Edit ${theName}<i class="material-icons right">close</i></span>
              <p>
                <div>
                  <form id="edit-form">
                    <input type="hidden" value="${theNewChildId}" id="hidden-id">
                    <input type="text" id="edit-name" value="${theName}" placeholder="name">
                    <input type="date" id="edit-dob" value="${convertedDob}" format="YYYY-MM-DD" placeholder="Birthday">
                    <button class="btn-save-child right">Save</button>
                  </form>
                  <form action="/feed/${theNewChildId}/remove" method="POST">
                    <button class="btn-remove-child">Remove Child</button>
                  </form>
                </div>
    
              </p>
            </div>
          </div>
        </div>`)
            
        // PRIOR PREPEND    
        //     `<div class="col s12 m2"><a href="/feed/${theNewChildId}">
        //    <div class="card">
        //     <div class="card-image">
        //       <img src="${theImage}">
        //       <span class="card-title">
        //         ${theName}
        //       </span>
        //      </div>
        //     </div>
        //    </a></div>`)

        //   $(".toggle-avatars").prepend(`<li>
        //   <a href="/feed/details/"+${theNewChildId}>
        //     <img class="circle avatar" src="${theImage}">
        //   </a>
        // </li>`) */}
      
       })
       .catch((err)=>{
           console.log(err);
        })
      })
       .catch((err)=>{
        console.log(err);
      })
    
    }  // END OF ON-CLICK FUNCTION TO CREATE CHILD




// EDIT CHILD FUNCTION ON SUBMIT OF EDIT CHILD FORM ==================================================================

  document.getElementById("edit-form").onsubmit = function(event){

    console.log("FORM SUBMITTED")

    event.preventDefault();

    let name = document.getElementById('edit-name').value;
    let dob = document.getElementById('edit-dob').value;
    let childId = document.getElementById('hidden-id').value;



    formData.set('childName', name);
    formData.set('childDob', dob);


  // make axios request and send the correct stuff in req.body
     axios.put('/api/feed/edit-child/'+childId, formData)
     .then((result)=>{

        //let childId = result.data.newChild._id
        console.log(`The CHILD ID IS:`+result.data)
      
        axios.get('/api/feed/edited-child/'+childId)
          .then((response)=>{
            
            console.log("UPDATED CHILD DATA:"+response)
           // take the new updated info and put it on the page
           
           let editedChild = response.data

           let theName = editedChild.name
           let theDob = editedChild.dob
           let theImage = editedChild.image
           let theNewChildId = editedChild._id
           let stringToModiyfUrl = 'w_300,h_300,c_fill,g_auto/' 


            document.getElementById('edit-name').innerText = editedChild.name
            document.getElementById('edit-name-span').innerText = "Edit "+editedChild.name
            document.getElementById('actual-child-name').innerText = editedChild.name
            document.getElementById('edit-dob').innerText = editedChild.dob
            //document.getElementById('age-string').innerHTML = ;

           // Function to convert date to acceptable format for form:  ==========================================
           dobYear = theDob.slice(0,4)
           dobMonth = theDob.slice(5,7)
           dobDay = theDob.slice(8,10)

           convertedDob = String(dobYear)+"-"+String(dobMonth)+"-"+String(dobDay)

        
           
           // Function to change the URL to produce the modified Url that will be the child card ================
           function changeUrl(stringA, stringB) {
             
            let pos = stringA.indexOf("upload")
            let positionForString = pos += 7
          
            let modifiedUrl = stringA.substr(0, positionForString) + stringB + stringA.substr(positionForString); 
          
            return modifiedUrl
            }

           let modifiedImageString = changeUrl(theImage, stringToModiyfUrl)

           // console.log(modifiedImageString)
   

           // Convert the date from the model into child's age through a function =======================

           function diffInYears(date2, date1) {
            var diff =(date2.getTime() - date1.getTime()) / 1000;
             diff /= (60 * 60 * 24);
            return Math.abs(Math.round(diff/365.25));
           }
          
           date2 = new Date(); // sets to today
           date1 = new Date(theDob);
           //date2 = new Date(theDob);
           console.log("CHILD AGE IS:"+theDob)
           console.log(diffInYears(date2,date1));


        // HTML TO BE OUTPUT TO SCREEN TO CREATE NEW CHILD CARD  ======================================

        //   $("#child-list").prepend(`<div class="col s12 m3">

        //   <div class="card small">
        //     <a href="/feed/${theNewChildId}">
        //       <div class="card-image waves-effect waves-block waves-light">
        //         <img class="activator" src="${modifiedImageString}">
        //       </div>
        //     </a>
        //     <div class="card-content">
        //   <span class="card-title activator grey-text text-darken-4">${theName}<i class="material-icons right">mode_edit</i></span>
        //       <p>
        //         FIX THIS!!!! # Years Old</p>
        //     </div>
    
        //     <div class="card-reveal">
        //   <span class="card-title grey-text text-darken-4">Edit ${theName}<i class="material-icons right">close</i></span>
        //       <p>
        //         <div>
        //           <form id="edit-form">
        //             <input type="hidden" value="${theNewChildId}" id="hidden-id">
        //             <input type="text" id="edit-name" value="${theName}" placeholder="name">
        //             <input type="date" id="edit-dob" value="${convertedDob}" format="YYYY-MM-DD" placeholder="Birthday">
        //             <button class="btn-save-child right">Save</button>
        //           </form>
        //           <form action="/feed/${theNewChildId}/remove" method="POST">
        //             <button class="btn-remove-child">Remove Child</button>
        //           </form>
        //         </div>
    
        //       </p>
        //     </div>
        //   </div>
        // </div>`)
      
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