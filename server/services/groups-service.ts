import {nTree} from "../models/tree";

class GroupsService{

    async getAllGroups():Promise<{data:any[]}>{
        return await nTree.getGroups();
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