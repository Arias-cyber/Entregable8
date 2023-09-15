const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.rol === "admin") {
      // Si el usuario es administrador, permite el acceso
      next();
    } else {
      // Si el usuario no es administrador, responde con un error de acceso no autorizado
      res.status(403).json({ status: "error", message: "Access forbidden" });
    }
  };
  
  export default isAdmin;