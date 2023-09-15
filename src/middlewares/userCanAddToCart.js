const userCanAddToCart = (req, res, next) => {
    // Obtener el usuario autenticado de la sesión
    const user = req.session.user;
  
    // Obtener el id del usuario dueño del carrito
    const cartUserId = req.params.cid;
  
    // Verificar si el usuario es el propietario del carrito o un administrador
    if (user && (user._id.toString() === cartUserId || user.rol === "admin")) {
      // El usuario puede agregar productos al carrito
      next();
    } else {
      // El usuario no tiene permiso para agregar productos al carrito
      res.status(403).json({ status: "error", message: "No tienes permiso para realizar esta acción" });
    }
  };

export default userCanAddToCart