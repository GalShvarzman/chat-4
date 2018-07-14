import {createSelector} from "reselect";
import {IClientUser} from "../interfaces";

export const getUsers = (state:any) => state.users;
export const getGroups = (state:any) => state.groups;
export const getGroupsWithGroupChildren = (state:any) => state.groupsWithGroupsChildren;
const getUser = (usersObj:any, userId:any) => usersObj[userId];
const getGroup = (groupsObj:any, groupId:any) => groupsObj[groupId];

export const treeSelectors = createSelector(
    [getUsers, getGroups],
    (users, groups) => {
        if (users.length && groups.length) {
            return createTree(groups, users)
        }
        else{
            return [];
        }
    }
);

function createTree(groups:any, users:any){
    const usersObj = {};
    const groupsObj = {};

    for(let i = 0; i< groups.length; i++){
        groupsObj[groups[i]["_id"]] = groups[i];
    }

    for(let i = 0; i< users.length; i++){
        usersObj[users[i]["_id"]] = users[i];
    }

    const rootGroup = groups.find((group:any)=>{
        return group.name === "root"
    });

    if(rootGroup && rootGroup.children.length){
        return walkGroups(rootGroup, groupsObj, usersObj);
    }
}

function walkGroups(group:any, groupsObj:{}, usersObj:{}) {
    if (group.children.length) {
        return group.children.map((child: any) => {
            let childData;
            if (group.children[0].kind === "Group") {
                childData = getGroup(groupsObj, child["childId"] || child["_id"]);
                if(childData.children.length){
                    childData.children = walkGroups(childData, groupsObj, usersObj);
                }
            }
            else{
                childData = getUser(usersObj, child["childId"] || child["_id"]);
            }
            return childData;
        });
    }
}

