if(localStorage.getItem('name')=== null){
    window.location.href = 'index.html';
}

let userid = localStorage.getItem('userid');
//code to display the expenses

firebase.database().ref('users/'+ userid).once('value').then(function(snapshot){
    let data = snapshot.val()
    let counter = 1
    for(let id in data){

        document.querySelector('#datatable').innerHTML += `<tr>
        <th scope="row">${counter}</th>
        <td scope="row">${data[id].name}</td>
        <td scope="row">${data[id].type}</td>
        <td scope="row">${data[id].amount}</td>
        <td scope="row">${data[id].category}</td>
        <td scope="row">${data[id].date}</td>
        <td scope="row">${data[id].time}</td>
        </tr>`;

        counter++;
    }
});



document.querySelector('#user_img').setAttribute('src',localStorage.getItem('profilepic'));

document.querySelector('#user_name').textContent = localStorage.getItem('name');



document.querySelector('#logout').addEventListener('click',function(){
   
        firebase.auth().signOut().then(function() {

            localStorage.removeItem('name');
            localStorage.removeItem('profilepic');
            localStorage.removeItem('userid');
            window.location.href='index.html';


        }).catch(function(error) {

            alert("error occured");

        });


});

document.querySelector('#add-expense').addEventListener('click',function(){

    let expenseName = document.querySelector('#expense-name').value;
    let expenseType = document.querySelector('#expense-type').value;
    let expenseAmount = document.querySelector('#expense-amount').value;
    let expenseDate = document.querySelector('#expense-date').value;
    let expenseTime = document.querySelector('#expense-time').value;
    let expenseCategory = document.querySelector('#expense-category').value;

    let responsevalidation = validationData(expenseName,expenseType,expenseAmount,expenseDate,expenseTime,expenseCategory);

    if(responsevalidation){

        let response = insertDate(expenseName,expenseType,expenseAmount,expenseDate,expenseTime,expenseCategory);
    
        if(response){
        
            var myModal = document.getElementById('expenseModel')
            var modal = bootstrap.Modal.getInstance(myModal) 

            let message = document.querySelector('#message')
            message.innerHTML=`<p style="padding:20px; background-color:green;">Expense Added Successfully</p>`
            function showmessage(){
           
                modal.hide();
                window.location.href = 'dashboard.html';
            }
            let messagedisplay = setTimeout(showmessage, 2000)

            
   
        }else{

            let message = document.querySelector('#message')
         
            message.innerHTML=`<p style="padding:20px; background-color:red;">Expense Not Added</p>`
            function showmessage(){
           
                message.innerHTML=''
            }
            let messagedisplay = setTimeout(showmessage, 3000)

         

        }
 
   
    }else{

        let message = document.querySelector('#message')
        message.innerHTML=`<p style="padding:20px; background-color:red;">Expense Not Added</p>`
        function showmessage(){
           
            message.innerHTML=''
        }
        let messagedisplay = setTimeout(showmessage, 3000)
       
        
    }


})



function validationData(name,type,amount,date,time,category){

if(name !== null & type!==null & amount!==null& date !== null & time !== null & category!==null){
    return 1;

}else{
    return 0;

}




}

function insertDate(name,type,amount,date,time,category){

    

    firebase.database().ref('users/' + userid).push({

        name:name,
        type:type,
        amount:amount,
        date:date,
        time:time,
        category:category,


    }, function(error){
        
        return 0;
    });

    return 1;
}

let categories = ['bills','grocery'];
let expenseCategory=[];

firebase.database().ref('users/'+ userid).once('value').then(function(snapshot){
    let data = snapshot.val();

    categories.forEach(function(value){
        let amount = 0;
        
        for(let id in data){
            if(data[id].category === value){
                amount = amount+Number(data[id].amount); 
                
            }
        }
        expenseCategory.push(amount);
    })


    let mychart = document.querySelector('#bar-graph').getContext('2d');

    let expenseChart = new Chart(mychart,{
        type:'bar',
        data:{
            labels:categories,
            datasets:[{
                label:'Category Wise Expense',
                data:expenseCategory,
                backgroundColor:['#00a65a','#1418cb']

            }]
        }
    })
});



