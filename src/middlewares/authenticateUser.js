const authenticateUser = (req, res, next) => {
    if (req.session.user) {
      // Si el usuario está autenticado, pasa al siguiente middleware
      next();
    } else {
      // Si el usuario no está autenticado, devuelve un error de no autorizado
      res.status(401).json({ error: 'No autorizado' });
    }
  };
  
  export default authenticateUser;