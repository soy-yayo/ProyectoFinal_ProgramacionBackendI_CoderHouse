import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'Productos Quaker';

const productSchema = mongoose.Schema({
  name : {type : String, required: true }, 
  price : {type : Number, required: true },
  category : {type : String, required : true}, 
  thumbnail : {type : String, required: true },
  id : {type : Number, require : true}
});

productSchema.plugin(mongoosePaginate);
export const productModel = mongoose.model(productCollection, productSchema);