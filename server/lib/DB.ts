import * as fs from 'fs';
import * as path from 'path';

class DB{
    data:any;
    constructor (path){
        this.readFile(path).then((data)=>{
            this.data = data;
        })
    }

    readFile(path){
        return new Promise((resolve, reject)=>{
            fs.readFile(path, (err, data) => {
                if (err) reject (err);
                resolve(JSON.parse(data.toString()));
            });
        })
    }

    writeFile(data, fileName){
        return new Promise((resolve, reject)=>{
            fs.writeFile(path.join(__dirname, fileName), data, (err) => {
                if (err) reject (err);
                console.log('The file has been saved!');
                resolve();
            });
        });
    }

    getData(){
        return this.data;
    }

}

export const usersDb = new DB(path.join(__dirname, 'users.json'));
export const groupsDb = new DB(path.join(__dirname, 'groups.json'));
export const messagesDb = new DB(path.join(__dirname, 'messages.json'));