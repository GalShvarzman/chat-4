import {nTree} from "../models/tree";
import users from '../models/users';

class GroupsService{

    async getAllGroups():Promise<{data:{name:string, id:string}[]}>{
        return await nTree.getGroups();
    }

    async deleteGroup(groupId):Promise<void> {
        const connectorsList = await this.getConnectorsList();
        const allChildrenConnectors = this.getAllChildrenConnectors(connectorsList, groupId);
        const childrenConnectorsTypeGroup = allChildrenConnectors.filter(child => child.type === 'group');
        const childrenConnectorsTypeGroupIds = childrenConnectorsTypeGroup.map(connector => connector.id);
        await nTree.removeMultipleGroups([...childrenConnectorsTypeGroupIds, groupId]);
        // const allChildrenConnectorsIds = allChildrenConnectors.map(connector => connector.id);
        const groupConnector = this.getGroupConnector(groupId, connectorsList);
        await nTree.removeMultipleConnectors([...allChildrenConnectors, groupConnector]);
    }

    getAllChildrenConnectors(connectorsList, groupId){
        const result = [];
        const groupDirectChildrenConnectors = this.getDirectChildrenConnectors(groupId, connectorsList);
        result.push(...groupDirectChildrenConnectors);

        if(groupDirectChildrenConnectors[0].type ==='group'){
            groupDirectChildrenConnectors.forEach((child)=>{
                result.push(...this.getAllChildrenConnectors(connectorsList, child.id));
            });
        }
        return result;
    }

    async getGroupData(groupId):Promise<{data:any[]}>{
        const connectorsList = await this.getConnectorsList();
        const groupConnector = this.getGroupConnector(groupId, connectorsList);
        const groups = await this.getAllGroups();

        let groupParentDetails = groups.data.find((group)=>{
            return group.id === groupConnector.pId;
        });

        if(!groupParentDetails){
            groupParentDetails = {name:'No parent', id:""};
        }
        const groupChildrenConnectors = this.getDirectChildrenConnectors(groupId, connectorsList);

        const groupChildrenIds = groupChildrenConnectors.map((child)=>{
            return child.id;
        });

        let groupChildren;
        if(groupChildrenConnectors[0].type === 'user'){
            const usersList = await users.getUsersList();

            groupChildren = this.getChildrenData(usersList.data, groupChildrenIds, 'user');
        }
        else{
            groupChildren = this.getChildrenData(groups.data, groupChildrenIds, 'group')
        }

        return ({data:[{groupParent: groupParentDetails}, {groupChildren}]});
    }

    async getConnectorsList():Promise<{data:{type:string, id:string, pId:string}[]}>{
       return await nTree.getConnectorsList();
    }

    getGroupConnector(id, connectorsList):{type:string, id:string, pId:string}{
        return connectorsList.data.find((obj:{type:string, id:string, pId:string})=>{
            return obj.id === id;
        });
    }

    getDirectChildrenConnectors(id, connectorsList){
        return connectorsList.data.filter((obj) => {
            return obj.pId === id;
        });
    }

    getChildrenData(arr1, arr2, type) {
        const result = [];
        for(let i = 0; i < arr1.length; i++){
            if(arr2.indexOf(arr1[i].id) > -1){
                result.push({name:arr1[i].name, id: arr1[i].id, type});
            }
        }
        return result;
    }


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