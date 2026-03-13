// SIGNUP

const signupForm = document.getElementById("signupForm");

if(signupForm){

signupForm.addEventListener("submit",function(e){

e.preventDefault();

const name=document.getElementById("name").value;
const lastname=document.getElementById("lastname").value;
const email=document.getElementById("email").value;
const dob=document.getElementById("dob").value;
const phone=document.getElementById("phone").value;
const password=document.getElementById("password").value;
const confirmPassword=document.getElementById("confirmPassword").value;

if(password !== confirmPassword){
  alert("Passwords do not match");
  return;
}

let users=JSON.parse(localStorage.getItem("users"))||[];

users.push({name, lastname, email, dob, phone, password});

localStorage.setItem("users",JSON.stringify(users));

alert("Signup successful");

window.location="index.html";

});

}


// LOGIN

const loginForm=document.getElementById("loginForm");

if(loginForm){

loginForm.addEventListener("submit",function(e){

e.preventDefault();

const email=document.getElementById("loginEmail").value;
const password=document.getElementById("loginPassword").value;

if(email==="admin@gmail.com" && password==="admin123"){

localStorage.setItem("role","admin");

window.location="admin.html";

return;

}

let users=JSON.parse(localStorage.getItem("users"))||[];

const user=users.find(u=>u.email===email && u.password===password);

if(user){

localStorage.setItem("currentUser",JSON.stringify(user));

window.location="dashboard.html";

}else{

alert("Invalid Login");

}

});

}