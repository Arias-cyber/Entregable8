import productModel from "../models/product.js"
import mongoosePaginate from "mongoose-paginate-v2";

export default class ProductsManager{
    getProducts=(filter, options) =>{
      const { stock, ...otherFilters } = filter;
      const stockFilter = stock ? { stock: { $gt: 0 } } : {};
    
      return productModel
        .find({ ...otherFilters, ...stockFilter })
        .sort(options.sort)
        .skip(options.skip)
        .limit(options.limit)
        .lean();
     }
    getProductsCount = (filter) => {
        return productModel.countDocuments(filter).lean();
      }
    getProduct=(id)=>{
        return productModel.findById(id);
    }

    createProduct = (product) => {
        return productModel.create(product)
    }

    updateProduct= (id,product)=>{
        return productModel.findByIdAndUpdate(id,product)
    }

    deleteProduct= (id) =>{
        return productModel.findByIdAndDelete(id)
    }
    getProductsPaginated = async (limit, page) => {
        const options = {
          page: page,
          limit: limit,
        };
    
        const { docs: products, totalDocs: totalProducts } = await productModel.paginate({},{page,limit,lean:true});
        
        return {
          products,
          totalPages: Math.ceil(totalProducts / limit),
          currentPage: page,
          totalProducts,
        };
      };
    
}    