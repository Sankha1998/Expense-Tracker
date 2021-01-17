
if(localStorage.getItem('name') !== null){
    window.location.href = 'dashboard.html';
}

document.querySelector('#googlebutton').addEventListener('click',function(){

    var provider = new firebase.auth.GoogleAuthProvider();



    firebase.auth().signInWithPopup(provider).then(function(data) {

        window.localStorage.setItem("name",data.additionalUserInfo.profile.name);

        window.localStorage.setItem("profilepic",data.additionalUserInfo.profile.picture);
        window.localStorage.setItem("userid",firebase.auth().currentUser.uid);
        

        window.location.href='dashboard.html';

    }).catch(function(error) {


        console.log(error);

    
    });
  


});


  