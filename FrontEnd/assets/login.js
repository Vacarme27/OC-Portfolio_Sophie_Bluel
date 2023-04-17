const form = document.querySelector('#form');

const error = document.querySelector('#error-message');

form.addEventListener('submit', function(event) {

// Empêche de recharger la page
  event.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: email,
        password: password
    })
  })
  .then(function(reponse) {
    return reponse.json();
  })
  .then(function(user) {
    if (user.token) {
      localStorage.setItem('token', user.token);
      window.location.href = "index.html";
    } else {
      error.textContent = 'Nom d\'utilisateur ou mot de passe incorrect.';
    }
    console.log(user);
  });
});