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
                groupParent = 'root';
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

                groupChildren = this.arrayDiff(usersList.data, groupChildrenIds);
            }

            return ({data:[{groupParent}, {groupChildren}]});
    }


    arrayDiff(arr1, arr2) {
        const result = [];
        arr1.sort();
        arr2.sort();
        for(let i = 0; i < arr1.length; i += 1) {
            if(arr2.indexOf(arr1[i].id) > -1){
                result.push({name:arr1[i].name, age:arr1[i].age, id: arr1[i].id});
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