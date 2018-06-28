import * as uuidv4 from 'uuid/v4';

export default interface IUser {
    id:string,
    name:string,
    age?:number,
    password:string
}

export default class User implements IUser{
    public name:string;
    public age?:number;
    public password:string;
    public id:string;

    constructor(username:string, age:string){
        this.name = username;
        this.age = parseInt(age);
        this.id = uuidv4();
    }
}