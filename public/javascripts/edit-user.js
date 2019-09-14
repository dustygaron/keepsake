document.addEventListener('DOMContentLoaded', () => {
  
  const formData = new FormData();


// EDIT USER FUNCTION ON SUBMIT OF EDIT CHILD FORM ===============================================

  document.getElementById("edit-user").onsubmit = function(event){

    console.log("FORM SUBMITTED")

    event.preventDefault();

    let name = document.getElementById('user-name').value;
    let password = document.getElementById('user-password').value;
    let email = document.getElementById('user-email').value;
    let userId = document.getElementById('hidden-user-id').value;
    

    formData.set('userName', name);
    formData.set('userPw', password);
    formData.set('userEmail', email);


  // make axios request and send the correct stuff in req.body
     axios.put('/api/feed/edit-user/'+userId, formData)
     .then((result)=>{
      
        axios.get('/api/feed/edited-user/'+userId)
          .then((response)=>{
            
            console.log(`UPDATED USER DATA : ${response.data}`)
           // take the new updated info and put it on the page
           
           let editedUser = response.data

           let theName = editedUser.username
           let thePassword = editedUser.password
           let theImage = editedUser.email


            document.getElementById('user-name').innerText = editedUser.username
            document.getElementById('user-name').placeholder= editedUser.username
            document.getElementById('user-password').placeholder="Password Updated"
            document.getElementById('user-email').innerText = editedUser.email
            document.getElementById('user-email').placeholder = editedUser.email
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