window.onload = init; 

function init() {
    if (localStorage.getItem("token")) {
        window.location.href = "pokedex.html";
    } else {
        document.querySelector('.btn-secondary').addEventListener('click', function() {
            window.location.href = "login.html";
        }); 

        document.querySelector('.btn-primary').addEventListener('click', signin); 
    }
}

function signin () {
    var name = document.getElementById('input-name').value; 
    var mail = document.getElementById('input-mail').value;
    var pass = document.getElementById('input-password').value; 
    console.log(mail, pass); 
    axios({
        method: 'post',
        url: 'http://localhost:3000/user/signin',
        data: {
            user_name: name, 
            user_mail: mail, 
            user_password: pass
        }
    }).then(function(res) {
        console.log(res);
        alert("Registro exitoso"); 
        window.location.href = "login.html"; 
    }).catch(function(err) {
        console.log(err);
    })
}