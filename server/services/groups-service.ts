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
           if(connectorChildren.length && connectorChildren[0].type === 'group' || connectorChildren.length == 0){
               groupsWithGroupsChildrenIds.push(groupConnector.id);
           }
        });

        return {
            data: this.getObjData<{name:string, id:string}>(allGroups.data, groupsWithGroupsChildrenIds, ['name', 'id'])
        }
    }

    async saveGroupDetails(groupNewDetails){
        const groups = await nTree.getGroups();
        const groupIndex = await nTree.getGroupIndexById(groups, groupNewDetails.id);
        groups.data[groupIndex].name = groupNewDetails.name;
        await nTree.updateGroupsFile(groups);
        return({group:{name:groups.data[groupIndex].name, id:groups.data[groupIndex].id}});
    }

    async addUsersToGroup(data:{groupId:string, usersIds:string[]}){
        const newConnectors = data.usersIds.map((id)=>{
            return {
                type:'user',
                id,
                pId:data.groupId
            }
        });
        await nTree.addConnectors(newConnectors);
        const usersList = await users.getUsersList();
        return this.getObjData<{name:string, id:string, age:string, type:string}>(usersList.data, data.usersIds, ['name', 'id', 'age'],'user');
    }

    async createNewGroup(newGroupDetails):Promise<{name:string, id:string}>{
        const groupParentId = newGroupDetails.parent;
        const newId = uuidv4();
        return Promise.all([nTree.createNew({type:'group', id:newId, pId:groupParentId}, 'connectors.json'),
                           nTree.createNew({name:newGroupDetails.name, id:newId}, 'groups.json')])
            .then((results)=>{
                return results[1];
            });
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

    async getGroupData(groupId):Promise<{data:any[]}> {
        const connectorsList = await this.getConnectorsList();
        const groupConnector = this.getGroupConnector(groupId, connectorsList);
        const groups = await this.getAllGroups();

        let groupParentDetails = groups.data.find((group) => {
            return group.id === groupConnector.pId;
        });

        if (!groupParentDetails) {
            groupParentDetails = {name: 'No parent', id: ""};
        }
        const groupChildrenConnectors = this.getDirectChildrenConnectors(groupId, connectorsList);

        const groupChildrenIds = groupChildrenConnectors.map((child) => {
            return child.id;
        });

        if (groupChildrenConnectors.length) {
            let groupChildren;
            if (groupChildrenConnectors[0].type === 'user') {
                const usersList = await users.getUsersList();

                groupChildren = this.getObjData<{name:string, id:string, age:string, type:string}>(usersList.data, groupChildrenIds, ['name', 'id', 'age'],'user');
            }
            else {
                groupChildren = this.getObjData<{name:string, id:string, type:string}>(groups.data, groupChildrenIds,['name', 'id'], 'group')
            }
            return ({data: [{groupParent: groupParentDetails}, {groupChildren}]});
        }
        return ({data: [{groupParent: groupParentDetails}, {groupChildren:[]}]});
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
        return connectorsList.data.filter((el) => {
            return el.pId === id;
        });
    }

    async getGroupOptionalChildren(groupId){
        const connectorsList = await this.getConnectorsList();
        const groupChildrenConnectors = this.getDirectChildrenConnectors(groupId, connectorsList);
        let usersListFullData = await users.getUsersList();
        const usersList = usersListFullData.data.map((user)=>{
            return {"name":user.name, "age":user.age, "id":user.id}
        });
        if(groupChildrenConnectors.length) {
            const groupChildrenIds = groupChildrenConnectors.map((child) => {
                return child.id
            });
            return usersList.filter((user)=>{
                return groupChildrenIds.indexOf(user.id) == -1;
            })
        }
        else{
            return usersList;
        }
    }

    getObjData<T>(arr:any[], idsArr:string[], keysToExtract:string[], type?:string):T[]{
        const result = [];
        for(let i = 0; i < arr.length; i++){
            const el = arr[i];
            if(idsArr.indexOf(el.id) > -1){
                const obj = {type};
                keysToExtract.forEach((key)=>{
                    obj[key] = el[key];
                });
                result.push(obj);
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