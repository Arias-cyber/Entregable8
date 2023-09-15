const logoutButton = document.getElementById('logoutButton');

logoutButton.addEventListener('click', async () => {
  try {
    const response = await fetch('/api/sessions/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseData = await response.json();
    console.log(responseData);
    // Redirigir a la página de inicio de sesión después del logout
    window.location.replace('/login');
  } catch (error) {
    console.error('Error during logout:', error);
  }
});