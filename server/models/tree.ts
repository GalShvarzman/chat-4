import {db} from "../lib/DB";
const groupsFile = 'groups.json';
const connectorsFile = 'connectors.json';
export class NTree{

    public async createNew(newDetails, fileName){
        return await db.createNew(newDetails, fileName);
    }

    public async addConnectors(data):Promise<void>{
        await db.createMultipleNew(data, 'connectors.json');
    }

    async removeGroup(id:string){
        return await db.deleteObj(id, groupsFile);
    }

    async removeMultipleGroups(ids:string[]){
        return await db.deleteMultipleObjById(ids, groupsFile);
    }

    async removeConnector(id:string){
        return await db.deleteObj(id, connectorsFile);
    }

    async removeMultipleConnectors(connectors:string[]){
        return await db.deleteMultipleObj(connectors, connectorsFile);
    }

    public async getGroups(){
        return await db.getFullData(groupsFile);
    }

    public async getConnectorsList():Promise<{data:any[]}>{
        return await db.getFullData(connectorsFile);
    }

    public getGroupIndexById(groups, groupId){
        return db.getObjIndexById(groups, groupId);
    }

    public async updateFile(newData, fileName){
        await db.updateFile(newData, fileName);
    }
}

export const nTree:NTree = new NTree();