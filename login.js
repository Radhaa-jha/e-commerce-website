import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, child, get } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

//add your firebase config
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const inputEmail = document.getElementById('email').value.trim();
  const inputPassword = document.getElementById('password').value.trim();

  const dbRef = ref(db);
  get(child(dbRef, 'users')).then((snapshot) => {
    if (snapshot.exists()) {
      let userFound = false;

      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        if (user.email === inputEmail) {
          userFound = true;

          if (user.password === inputPassword) {
            alert("Login successful!");
            window.location.href=
            "wcloth.html";
          } else {
            alert("Incorrect password.");
          }
        }
      });

      if (!userFound) {
        alert("Email not found.");
      }
    } else {
      alert("No users found in database.");
    }
  }).catch((error) => {
    console.error("Firebase read error:", error);
    alert("Login failed. Please try again.");
  });
});