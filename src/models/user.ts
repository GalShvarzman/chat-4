import IGroup from './group';

export default interface IUser {
    name:string,
    age?:number,
    password:string,
    parents : IGroup[],
    massages : {},
    removeParent(parentNode:IGroup):boolean,
    auth(enteredPassword:string):boolean,
    addMassage(massage:string, chatWith:IUser|undefined):void,
    getMassages(loggedInUserName:string|undefined):string[]
}

export default class User implements IUser{
    public name:string;
    public age?:number;
    public password:string;
    public parents:IGroup[];
    public massages:{};
    constructor(username:string, age:number, password:string){
        this.name = username;
        this.age = age;
        this.password = password;
        this.parents = [];
        this.massages = {};
    }

    public addMassage(massage:string, chatWith:IUser){
        const chatWithName = chatWith.name;
        if(this.massages[chatWithName]){
            this.massages[chatWithName].push(massage);
        }
        else{
            this.massages[chatWithName] = [massage]
        }
    }

    public removeParent(parentNode:IGroup){
        if(this.parents.length){
            const i = this.parents.findIndex((parent)=>{
                return parent  === parentNode
            });
            if(i !== -1){
                this.parents.splice(i, 1);
                return true
            }
            else{
                return false;
            }
        }
        return false;
    }

    public updateAge(newAge:number){
        this.age = newAge;
        return true;
    }
    public updatePassword(newPassword:any){
        this.password = newPassword;
        return true;
    }

    public getParentsToPrint(){
        if(this.parents.length){
            return this.parents.map((parent)=>{
                return parent.name;
            })
        }
        return false;
    }

    public auth(enteredPassword:string){
        return enteredPassword === this.password
    }

    public getMassages(loggedInUserName:string){
        return this.massages[loggedInUserName];
    }
}

