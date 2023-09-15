const isUser = (req, res, next) => {
    if (req.session.user && req.session.user.rol === 'user') {
      next(); // Usuario autenticado con rol "user", pasa al siguiente middleware
    } else {
      res.status(403).json({ status: 'error', message: 'Access forbidden' });
    }
  };

  export default isUser