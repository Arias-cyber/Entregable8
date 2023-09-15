import express from "express";
import mongoosePaginate from 'mongoose-paginate-v2';
import ProductsManager from "../dao/mongo/manager/products.js";
import CartsManager from "../dao/mongo/manager/carts.js";
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';


const router = express.Router();

const productsManager = new ProductsManager();
const cartManager = new CartsManager();

const renderProductsPage = async (req, res) => {
    const { limit = 10, page = 1 } = req.query;
  
    // Obtener la lista de productos paginados desde el gestor de productos
    const { products, totalPages, currentPage, totalProducts } = await productsManager.getProductsPaginated(limit, page);
    
    // Obtener los datos del usuario si existe una sesión activa
    const user = req.session.user;
  
    // Calcular los enlaces de paginación
    const prevLink = currentPage > 1 ? `/products?limit=${limit}&page=${parseInt(page) - 1}` : null;
    const nextLink = currentPage < totalPages ? `/products?limit=${limit}&page=${parseInt(page) + 1}` : null;
    
    // Renderizar la vista products.handlebars con los datos de los productos y la paginación
    res.render("products", { products, totalPages, currentPage, totalProducts, prevLink, nextLink,user });
  }

const renderCartPage = async(req,res)=>{
    const cartId = req.params.cid;
  
    // Obtener el carrito específico utilizando el gestor de carritos
    const cart = await cartManager.getCart(cartId);
  
    // Verificar si el carrito existe
    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }
  
    // Obtener los productos asociados al carrito
    const products = await cartManager.getCartProducts(cartId);
    // Renderizar la vista cart.handlebars con los datos del carrito y los productos
    res.render("cart", { cart, products });
  }

const renderProfilePage =  (req, res) => {
    // Verificar si el usuario está autenticado (si existe req.session.user)
    if (req.session.user) {
      // Si está autenticado, renderizar la vista profile.handlebars con los datos del usuario
      res.render('profile', {
        user: req.session.user
      });
    } else {
      // Si no está autenticado, redirigirlo a la página de inicio de sesión (login)
      res.redirect('/login');
    }
  }

export {
    renderProductsPage,
    renderCartPage,
    renderProfilePage
}