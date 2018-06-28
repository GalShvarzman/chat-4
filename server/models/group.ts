import * as uuidv4 from 'uuid/v4';

export default interface IGroup{
    name : string,
    id:string;
}

export default class Group implements IGroup{
    public id:string;
    public name: string;

    constructor(name:string) {
        this.name = name;
        this.id = uuidv4();
    }
}