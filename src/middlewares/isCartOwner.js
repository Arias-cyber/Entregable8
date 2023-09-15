import MongoCartRepository from "../repositories/mongoCartRepository.js";
const cartRepository = new MongoCartRepository();

const isCartOwner = async (req, res, next) => {
    try {
      const { cid } = req.params;
      const cart = await cartRepository.getById(cid);
      
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
       // Verificar si el usuario autenticado está definido y tiene la propiedad _id
      if (!req.session.user || !req.session.user._id) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
      }
  
      // Obtener el ID del usuario autenticado
      const authenticatedUserId = req.session.user._id;
  
      // Verificar si el usuario autenticado es el propietario del carrito
      if (cart.user.toString() !== authenticatedUserId) {
        return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
      }
  
      // Si el usuario autenticado es el propietario, permitir continuar
      next();
    } catch (error) {
      res.status(500).json({ error: 'Error al verificar la propiedad del carrito' + error });
    }
  };

export default isCartOwner