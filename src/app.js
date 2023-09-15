import dotenv from 'dotenv';
import express, { urlencoded } from 'express';
import products from "./routes/products.router.js"
import carts from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import {Server} from "socket.io"
import { createServer } from 'http';
import ProductManager from "./dao/filesystem/manager/ProductManager.js";
import mongoose from 'mongoose'
import Message from './dao/mongo/models/message.js';
import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import MongoStore from "connect-mongo";
import session from "express-session";
import sessionsRouter from "./routes/session.router.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import isUser from './middlewares/isUser.js';
import generateProducts from './mooking.js'
//defino dotenv y las constantes del .env

dotenv.config({ path: 'src/.env' });
const mongoUrl = process.env.MONGO_URL;
const sessionSecret = process.env.SESSION_SECRET;

const hbs = handlebars.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    ifEquals: function (arg1, arg2, options) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    },
  },
});

const app = express();

const connection = await mongoose.connect(mongoUrl)
const httpServer = createServer(app);
const io = new Server(httpServer);
const productManager = new ProductManager();

app.use(
  session({
    store: new MongoStore({
      mongoUrl,
      ttl: 3600,
    }),
    secret:sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(urlencoded({ extended: true }))
app.use('/api/products',products);
app.use('/api/carts',carts);

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
//middleware de errores globales
app.use((err, req, res, next) => {
  if (err.code) {
    // Si es un error generado por el módulo errorHandler.js
    return res.status(400).json({ error: err });
  }
  // Otros errores no controlados
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});
app.use("/",viewsRouter)
app.get('/filesystem', (req, res) => {
    const products = productManager.getProducts();
    res.render('home', { products });
  });


  app.get('/chat', isUser, async (req, res) => {
    const messages = await Message.find().lean();
    res.render('chat', { messages });
  });

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  socket.on('message', async (data) => {
    const { user, message } = data;

  if (!user || user.trim() === '') {
    console.log('Error: el campo "user" es requerido');
    return;
  }

    // Guardar el mensaje en la colección "messages" en MongoDB
    const newMessage = new Message({ user, message });
    await newMessage.save();

    // Emitir el evento "messageLogs" a todos los clientes conectados
    const messages = await Message.find().lean();
    io.emit('messageLogs', messages);
  });

  });

const port = process.env.PORT || 8080;

  httpServer.listen(8080, () => {
    console.log(`Server is running on port ${port}` );
  });
  
app.use("/api/sessions", sessionsRouter);
app.use('/mockingproducts', generateProducts);

export {io};

//ENDPOINTS
//localhost:8080/mockingproducts
//localhost:8080/api/sessions/login para loguearse en postman y asi probar los permisos
/*ejemplo del body para session
{
  "email": "beltran@mail.com",
  "password": "123456"
}*/
//NOTA: tambien puede servir
// Ruta para finalizar compra localhost:8080/api/carts/64ecbfffd8ea7727c0808e18/purchase se puede cambiar el carrito, estuve probando ese del usuario beltran@mail.com
//localhost:8080/api/carts/64ecbfffd8ea7727c0808e18 ruta tipo PUT que le puede ser util para modificar directamente las cantidades
/*ejemplo del body para el PUT de arriba {
  "products": [
    {
      "product": "64af73e163e30ce7b7dc208e",
      "quantity": 100
    }
  ]
}*/
//localhost:8080/chat solo un usuario autenticado puede entrar

//RUTAS DEL SISTEMA DE LOGIN 
//localhost:8080/api/sessions/current mostrara un JSON con los datos del usuario si esta logueado, sino devolvera un not authenticated
//localhost:8080/login
//localhost:8080/register
//localhost:8080/products (solo para usuario logueado, si trata de ingresar sin loguearse lo devuelve a la pagina de logueo)
//localhost:8080/profile (solo para usuario validado, si trata de ingresar sin loguearse lo devuelve a la pagina de logueo)
//tambien si quiere ingresar a localhost:8080 lo redirige a la pagina de login 

