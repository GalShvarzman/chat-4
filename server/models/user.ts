import * as mongoose from 'mongoose';
import { Document, Model } from 'mongoose';

export default interface IUserDocument extends Document {
    id:string,
    name:string,
    age?:number,
    password:string
}

export interface IUser extends IUserDocument {
    // methods;
}

export interface IUserModel extends Model<IUser> {
    // statics;
}

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        index: true,
        unique: true
    },
    age:Number,
    password:String
});
//
// userSchema.statics = {
//     async getAllUsers(){
//         return await User.find({}, {password:0, __v:0});
//     }
// };

export const User:IUserModel = mongoose.model<IUser, IUserModel>('User', userSchema);