
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
//add your firebase config

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);

// Handle form submit
document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const fullName = document.getElementById('fullname').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // Save extra data to Realtime Database
      set(ref(db, 'users/' + user.uid), {
        fullName: fullName,
        email: email,
        password:password
      }).then(() => {
        alert("Registration Successful!");
        document.getElementById('registerForm').reset();
        // Optionally close modal or switch to login
      }).catch((error) => {
        console.error("Database Error: ", error);
      });
    })
    .catch((error) => {
      console.error("Auth Error: ", error.code, error.message);
      alert(error.message);
    });
});
