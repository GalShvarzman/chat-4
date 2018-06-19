import {nTree} from "../models/tree";
import users from '../models/users';

class GroupsService{

    async getAllGroups():Promise<{data:any[]}>{
        return await nTree.getGroups();
    }

    async getGroupData(groupId):Promise<{data:any[]}>{
        const connectorsList = await nTree.getConnectorsList();

            const groupConnector = connectorsList.data.find((obj:{type:string, id:string, pId:string})=>{
                return obj.id === groupId;
            });

            const groups = await nTree.getGroups();

            let groupParent = groups.data.find((group)=>{
                return group.id === groupConnector.pId;
            });
            if(!groupParent){
                groupParent = {name:'No parent', id:""};
            }
            const groupChildrenConnectors = connectorsList.data.filter((obj)=>{
                return obj.pId === groupId;
            });

            const groupChildrenIds = groupChildrenConnectors.map((child)=>{
                return child.id;
            });

            let groupChildren;
            if(groupChildrenConnectors[0].type === 'user'){
                const usersList = await users.getUsersList(); // fixme האם זה בסדר לגשת מפה ליוזרים?

                groupChildren = this.findAll(usersList.data, groupChildrenIds, 'user');
            }
            else{
                groupChildren = this.findAll(groups.data, groupChildrenIds, 'group')
            }

            return ({data:[{groupParent}, {groupChildren}]});
    }


    findAll(arr1, arr2, type) {
        const result = [];
        for(let i = 0; i < arr1.length; i++){
            if(arr2.indexOf(arr1[i].id) > -1){
                result.push({name:arr1[i].name, id: arr1[i].id, type});
            }
        }
        return result;
    };
    // internalSearchAllGroups(node) {
    //     const results:any[] = [];
    //     if (node.children) {
    //         node.children.forEach((child) => {
    //             if (child.type === 'group') {
    //                 results.push(child);
    //             }
    //             if(child.children){
    //                 results.push(...this.internalSearchAllGroups(child));
    //             }
    //         });
    //     }
    //     return results;
    // }
}




const groupsService = new GroupsService();

export default groupsService;