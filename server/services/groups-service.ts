import {nTree} from "../models/tree";
import users from '../models/users';
import Group from "../models/group";
import IGroup from "../models/group";
import {messagesDb} from "../models/messages";

interface ITreeGroupObj {
    id?:string,
    name?:string,
    type?:string,
    items?:any[]
}

export interface IConnector {
    id:string,
    pId:string,
    type:string
}

class GroupsService{

    async getAllGroups():Promise<{data:IGroup[]}>{
        return await nTree.getGroups();
    }

    async getGroupsWithGroupsChildren():Promise<{data:IGroup[]}>{
        const allGroups = await this.getAllGroups();
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
           if(connectorChildren.length == 0){
               groupsWithGroupsChildrenIds.push(groupConnector.id);
           }
        });

        return {
            data: this.getObjData<{name:string, id:string}>(allGroups.data, groupsWithGroupsChildrenIds, ['name', 'id'])
        }
    }

    async saveGroupDetails(groupNewDetails){
        const groups = await this.getAllGroups();
        const groupIndex = await nTree.getGroupIndexById(groups, groupNewDetails.id);
        groups.data[groupIndex].name = groupNewDetails.name;
        await nTree.updateFile(groups, 'groups.json');
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
        const usersList = await users.getUsersFullData();
        return this.getObjData<{name:string, id:string, age:string, type:string}>(usersList.data, data.usersIds, ['name', 'id', 'age'],'user');
    }

    async createNewGroup(newGroupDetails):Promise<{name:string, id:string}>{
        const groupParentId = newGroupDetails.parent;
        const newGroup = new Group(newGroupDetails.name);
        return Promise.all([nTree.createNew({type:'group', id:newGroup.id, pId:groupParentId}, 'connectors.json'),
                           nTree.createNew(newGroup, 'groups.json')])
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
        const allMessages = await messagesDb.getAllMessages();
        delete allMessages.data[groupId];
        await messagesDb.updateMessagesFile(allMessages);
    }

    getAllChildrenConnectors(connectorsList, groupId){
        const result = [];
        const groupDirectChildrenConnectors = this.getDirectChildrenConnectors(groupId, connectorsList);
        if(groupDirectChildrenConnectors.length){
            result.push(...groupDirectChildrenConnectors);

            if(groupDirectChildrenConnectors[0].type ==='group'){
                groupDirectChildrenConnectors.forEach((child)=>{
                    result.push(...this.getAllChildrenConnectors(connectorsList, child.id));
                });
            }
        }
        return result;
    }

    async getGroupData(groupId):Promise<{data:any[]}> {
        const connectorsList = await this.getConnectorsList();
        const groupConnector = this.getGroupConnector(groupId, connectorsList);
        const groups = await this.getAllGroups();
        let groupParentDetails;
        if(groupConnector){
            groupParentDetails = groups.data.find((group) => {
                return group.id === groupConnector.pId;
            });
        }
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
                const usersList = await users.getUsersFullData();

                groupChildren = this.getObjData<{name:string, id:string, age:string, type:string}>(usersList.data, groupChildrenIds, ['name', 'id', 'age'],'user');
            }
            else {
                groupChildren = this.getObjData<{name:string, id:string, type:string}>(groups.data, groupChildrenIds,['name', 'id'], 'group')
            }
            return ({data: [{groupParent: groupParentDetails}, {groupChildren}]});
        }
        return ({data: [{groupParent: groupParentDetails}, {groupChildren:[]}]});
    }


    async getConnectorsList():Promise<{data:IConnector[]}>{
       return await nTree.getConnectorsList();
    }

    getGroupConnector(id, connectorsList):IConnector{
        return connectorsList.data.find((connector:IConnector)=>{
            return connector.id === id;
        });
    }

    getDirectChildrenConnectors(id, connectorsList){
        return connectorsList.data.filter((connector) => {
            return connector.pId === id;
        });
    }

    async deleteUserFromGroup(groupId, userId){
        const connectorsList = await this.getConnectorsList();
        const connectorToDeleteIndex = connectorsList.data.findIndex((connector)=>{
            return connector.id === userId && connector.pId === groupId;
        });
        connectorsList.data.splice(connectorToDeleteIndex, 1);
        nTree.updateFile(connectorsList, 'connectors.json');
    }

    async getGroupOptionalChildren(groupId){
        const connectorsList = await this.getConnectorsList();
        const groupChildrenConnectors = this.getDirectChildrenConnectors(groupId, connectorsList);
        let usersListFullData = await users.getUsersFullData();
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

    async getTree(){
        const connectorsList = await this.getConnectorsList();
        const groupsList = await this.getAllGroups();
        const usersList = await users.getUsersFullData();
        const rootConnector = connectorsList.data.find((connector)=>{
            return connector.pId === "";
        });
        const groupDetails = groupsList.data.find(group=>group.id === rootConnector.id);
        const obj:ITreeGroupObj = {id:rootConnector.id, name:groupDetails.name, type:rootConnector.type, items:[]};

        const groupChildrenConnectors = this.getDirectChildrenConnectors(rootConnector.id, connectorsList);
        groupChildrenConnectors.forEach((connector)=>{
             obj.items.push(...this.walkTree(connector, connectorsList, usersList, groupsList));
        });

        return obj;
    }

    walkTree(connector, connectorsList, usersList, groupsList){
        const result = [];
        const groupDetails = groupsList.data.find(group=>group.id === connector.id);
        const obj:ITreeGroupObj = {id:connector.id, name:groupDetails.name, type:connector.type, items:[]};

        const groupChildrenConnectors = this.getDirectChildrenConnectors(connector.id, connectorsList);
        if(groupChildrenConnectors.length){
            const groupChildrenConnectorsIds = groupChildrenConnectors.map(connector=>connector.id);
            let childrenData;
            if(groupChildrenConnectors[0].type === 'user'){
                childrenData = this.getObjData(usersList.data, groupChildrenConnectorsIds, ['id','name','age'], 'user');
                obj.items = childrenData;
            }
            else{
                groupChildrenConnectors.forEach((groupConnector)=>{
                    obj.items.push(...this.walkTree(groupConnector, connectorsList, usersList, groupsList));
                });
            }
        }
        result.push(obj);
        return result;
    }
}

const groupsService = new GroupsService();

export default groupsService;