import {nTree} from "../models/tree";
import users from '../models/users';
import * as uuidv4 from 'uuid/v4';

class GroupsService{

    async getAllGroups():Promise<{data:{name:string, id:string}[]}>{
        return await nTree.getGroups();
    }

    async getGroupsWithGroupsChildren():Promise<{data:{name:string, id:string}[]}>{
        const allGroups = await nTree.getGroups();
        const connectorsList = await this.getConnectorsList();
        const groupsConnectors = connectorsList.data.filter((connector)=>{
            return connector.type === 'group';
        });
        const groupsWithGroupsChildrenIds = [];
        groupsConnectors.forEach((groupConnector)=>{
           const connectorChildren = this.getDirectChildrenConnectors(groupConnector.id, connectorsList) ;
           if(connectorChildren[0].type === 'group'){
               groupsWithGroupsChildrenIds.push(groupConnector.id);
           }
        });

        return {
            data: this.getObjData(allGroups.data, groupsWithGroupsChildrenIds)
        }
    }




    async createNewGroup(newGroupDetails):Promise<{name:string, id:string}>{
        const groupParent = newGroupDetails.parent;
        // לבדוק מי הילדים של אותה הקבוצה.... אם הם יוזרים להעביר אותם
        // לייצר רשומה בקונקטורס
        return await nTree.createNew({name:newGroupDetails.name, id:uuidv4()}, 'groups.json');
    }

    async deleteGroup(groupId):Promise<void> {
        const connectorsList = await this.getConnectorsList();
        const allChildrenConnectors = this.getAllChildrenConnectors(connectorsList, groupId);
        const childrenConnectorsTypeGroup = allChildrenConnectors.filter(child => child.type === 'group');
        const childrenConnectorsTypeGroupIds = childrenConnectorsTypeGroup.map(connector => connector.id);
        await nTree.removeMultipleGroups([...childrenConnectorsTypeGroupIds, groupId]);
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

            groupChildren = this.getObjData(usersList.data, groupChildrenIds, 'user');
        }
        else{
            groupChildren = this.getObjData(groups.data, groupChildrenIds, 'group')
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

    getObjData(arr1, arr2, type?):{name:string, id:string, type?}[]{
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