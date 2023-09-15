const form = document.getElementById('loginForm');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  const response = await fetch('/api/sessions/login', {
    method: 'POST',
    body: JSON.stringify(obj),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const responseData = await response.json();
  console.log(responseData);
    
  if (responseData.status === 'success') {
    // Redirigir al usuario a la vista de productos
    window.location.replace('/products');
  }   else {
    // Mostrar el mensaje de error
    errorMessage.style.display = 'block';
  }
});