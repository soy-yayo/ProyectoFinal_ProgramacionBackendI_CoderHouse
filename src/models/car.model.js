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
        quantity : {type : Number, default : 1}
    }
    ],
    default : []
  }
});

  carSchema.pre("find", function () {
  this.populate("products.product");
 });
 
carSchema.plugin(mongoosePaginate);
export const cartModel = mongoose.model(cartCollection, carSchema);