import * as mongoose from 'mongoose';
import { Document, Model } from 'mongoose';

export default interface IUserDocument extends Document {
    name:string,
    age?:number,
    password:string
}

export interface IUserModel extends Model<IUserDocument> {
    getAllUsers():IUserDocument[]
}

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        index: true,
        unique: true
    },
    age:Number,
    password:String,
    kind:String
});

userSchema.statics = {
    async getAllUsers(){
        return await User.find({}, {password:0, __v:0});
    }
};

export const User:IUserModel = mongoose.model<IUserDocument, IUserModel>('User', userSchema);