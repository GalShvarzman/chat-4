import * as mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId;
import { Document, Model } from 'mongoose';
import {IUser, IUserModel} from "./user";

export default interface IGroupDocument extends Document {
    id:string,
    name:string,
    parentId:string,
    children:any[]
}

export interface IGroup extends IGroupDocument {
    checkForGroupChildren():boolean,
    checkForOptionalGroupParents():boolean
}

export interface IGroupModel extends Model<IGroup> {
    getAllGroups():IGroup[],
    getRootGroup():IGroup,
    walkGroups(selectedGroup, checkFunc):IGroup[]
}

const groupSchema = new mongoose.Schema({
    name : String,
    parentId : {
        type : ObjectId,
        ref : 'Group'
    },
    children : [{
        _id:false,
        kind : String,
        childId : {
            type : ObjectId,
            refPath : 'children.kind'
        }
    }]
});

groupSchema.methods = {
    checkForGroupChildren(){
        return (this.children.length > 0 && this.children[0].kind === "Group");
    },
    checkForOptionalGroupParents(){
        return (this.children.length == 0 || this.children[0].kind === "Group");
    }
};

groupSchema.statics = {
    async getAllGroups() {
        return await Group.find({}, {__v: 0, parentId: 0});
    },

    async getRootGroup() {
        return await Group.findOne({name: "root"}, {__v:0, parentId:0});
    },

    async walkGroups(selectedGroup, checkFunc) {
        const groups = [selectedGroup];
        if (selectedGroup[checkFunc]()) {
            const groupFullData = await selectedGroup.populate('children.childId');
            const promises = groupFullData.children.map(async (groupChild) => {
                const group = await Group.findOne({_id : groupChild.childId._id}, {__v:0, parentId:0});
                groups.push(...await this.walkGroups(group, checkFunc));
            });
            await Promise.all(promises);
        }
        return groups;
    }
};

export const Group:IGroupModel = mongoose.model<IGroup, IGroupModel>('Group', groupSchema);