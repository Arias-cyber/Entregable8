import express from "express";
import mongoosePaginate from 'mongoose-paginate-v2';
import ProductsManager from "../dao/mongo/manager/products.js";
import CartsManager from "../dao/mongo/manager/carts.js";
import { renderProductsPage, renderCartPage, renderProfilePage } from "../controllers/viewsControllers.js";
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';

const router = express.Router();

const productsManager = new ProductsManager();
const cartManager = new CartsManager();

function requireLogin(req, res, next) {
  if (req.session.user) {
    // Si el usuario está logueado, continuamos con la siguiente función o ruta
    next();
  } else {
    // Si el usuario no está logueado, redirigimos a la página de login
    res.redirect('/login');
  }
}

router.get("/products",requireLogin,renderProductsPage );

router.get('/carts/:cid',renderCartPage)

router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get('/register',(req,res)=>{
  res.render('register');
})

router.get('/login',(req,res)=>{
  res.render('login')
})

router.get('/profile',renderProfilePage);

export default router;