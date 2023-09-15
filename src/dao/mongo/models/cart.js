import mongoose from "mongoose"
import productModel from "./product.js";
const cartCollection = "carts"

const cartSchema= new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",  // Asegúrate de que "Users" sea el nombre correcto de tu modelo de usuario
      required: true
    },
    products: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
          },
          quantity: {
            type: Number,
            default: 1
          }
        }
      ]
    })
    cartSchema.pre("findOne",function(){
    this.populate("products.product")
})
const cartModel = mongoose.model(cartCollection,cartSchema)
export default cartModel