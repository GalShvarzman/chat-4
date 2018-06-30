import * as uuidv4 from 'uuid/v4';

export default interface IUser {
    id:string,
    name:string,
    age?:number,
    password:string
}

export default class User implements IUser{
    public id:string;
    public name:string;
    public age?:number;
    public password:string;

    constructor(username:string, age:string, password){
        this.id = uuidv4();
        this.name = username;
        this.age = parseInt(age);
        this.password = password;
    }
}