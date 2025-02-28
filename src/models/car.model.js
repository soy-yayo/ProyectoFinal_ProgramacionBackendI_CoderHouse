import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const cartCollection = 'carrito Quaker';

const carSchema = mongoose.Schema({
  products : {
    type :[
      {
        product : {
          type : mongoose.Schema.Types.ObjectId,
          ref : "product.model",
          quantity : Number
        }
      }
    ],
    default : []
  }
});

carSchema.plugin(mongoosePaginate);
export const carModel = mongoose.model(cartCollection, carSchema);