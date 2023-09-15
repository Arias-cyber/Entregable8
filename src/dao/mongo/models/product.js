import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2';


const productCollection = "products"
//title, description, code, price, status = true, stock, category, thumbnail
const productSchema= new mongoose.Schema({
    title: String,
    description: String,
    code: {
        type:String,
        unique:true,
    },
    price: Number,
    status:Boolean,
    stock:Number,
    category:String,
    thumbnail:String,

})
productSchema.plugin(mongoosePaginate);

const productModel= mongoose.model(productCollection,productSchema)
export default productModel