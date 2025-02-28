import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const cartCollection = 'carritoQuaker';

const carSchema = mongoose.Schema({
  products : {
    type : [{
        product : {
          type : mongoose.Schema.Types.ObjectId,
          ref : "productosQuaker"
        },
        quantity : Number
    }
    ],
    default : []
  }
});

carSchema.plugin(mongoosePaginate);
export const cartModel = mongoose.model(cartCollection, carSchema);