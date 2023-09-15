import { Router } from "express";
import ProductsManager from "../dao/mongo/manager/products.js";
import { io } from "../app.js";
import MongoProductRepository from "../repositories/mongoProductRepository.js";
import { createError, PRODUCT_NOT_FOUND, INSUFFICIENT_STOCK, MISSING_FIELDS } from '../errorHandler.js';

//const productsManager = new ProductsManager();
const productRepository = new MongoProductRepository();

const getProducts= async (req, res) => {
    const { limit = 10, page = 1, sort, query,available  } = req.query;

    // Construir el objeto de opciones de filtrado y ordenamiento
    const options = {};
    // Aplicar el límite de elementos
    options.limit = parseInt(limit);
  
    // Calcular el desplazamiento (skip) en función de la página solicitada
    const skip = (parseInt(page) - 1) * parseInt(limit);
    options.skip = skip;
  
    // Aplicar el ordenamiento si se proporciona el parámetro sort
    if (sort === "asc") {
      options.sort = { price: 1 };
    } else if (sort === "desc") {
      options.sort = { price: -1 };
    }
  
    // Construir el objeto de filtro en función del parámetro query
    const filter = {};

    if (query) {
      filter.category = query;
    }
    
    if (available) {
      filter.stock = { $gt: 0 };
    }

    try {
      // Realizar la consulta a la base de datos
      const products = await productRepository.getAll(filter, options);
      const totalProducts = await productRepository.getProductsCount(filter);
      const totalPages = Math.ceil(totalProducts / options.limit);
      const prevPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPages ?  parseInt(page) + 1 : null;
      const hasPrevPage = prevPage !== null;
      const hasNextPage = nextPage !== null;
      // Calcular el enlace directo a la página previa
      const prevLink = page > 1 ? `/api/products?limit=${limit}&page=${page - 1}` : null;

      // Calcular el enlace directo a la página siguiente
      const nextLink = page < totalPages ? `/api/products?limit=${limit}&page=${parseInt(page) + 1}` : null;
  
      res.json({ status: "success", payload: products, page:page,  totalPages,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,});
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error al obtener los productos" +error});
    }
  }

const addProducts=async (req,res)=>{
    const {title, description, code, price , status,stock,category,thumbnail} = req.body
    const requiredFields = ['title', 'description','code','price','status','stock','category']; // Lista de campos requeridos
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
        const errorDetails = missingFields.map((field) => ({
          field,
        }));
    
        const error = createError('MISSING_FIELDS', { details: errorDetails });
        return res.status(400).json({ status: 'error', message: 'Missing required fields', error });
      }
    try {
        const product = req.body;
        const createdProduct = await productRepository.create(product)
        res.status(201).json({status:"ok",data:createdProduct})
    } catch (error) {
        return     res.status(400).json({status:"error",message:"Cannot get products: "+ error})
    }}


const getProductsById = async (req,res)=>{
    const {id} = req.params;
    try {
        const product = await productRepository.getById(id);
        res.json({status: "ok", data:product})
    } catch (error) {
         return     res.status(400).json({status:"error",message:"Cannot get product: "+ error})

    }
}

const updateProducts = async(req,res)=>{
    const {title, description, code, price , status,stock,category,thumbnail} = req.body
    if (!title || !description || !code || !price || !status  || !category){
        return res.status(400).json({status:"error",message: "no data sent!"})
    }
    const {id} = req.params;
    const newProduct=req.body;
    try {
        await productRepository.update(id,newProduct);
        res.json({status:"ok", data:newProduct})
    } catch (error) {
        return res.status(400).json({status:"error",message:"Cannot update product: "+ error})
    }

}

const deleteProducts= async(req,res)=>{
    const {id} = req.params;
    try {
        await productRepository.delete(id);
        res.json({status:"success"});
    } catch (error) {
        return res.status(400).json({status:"error",message:"Cannot delete product: "+ error})        
    }

}
export  {
    getProducts,
    addProducts,
    getProductsById,
    updateProducts,
    deleteProducts
}