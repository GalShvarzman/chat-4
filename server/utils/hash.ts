import * as bcrypt from 'bcrypt';
import {ClientError} from "./client-error";
const saltRounds = 10;

export function createHash(usersPlaintextPassword):Promise<string>{
    return new Promise((resolve, reject)=>{
        bcrypt.hash(usersPlaintextPassword, saltRounds, function(err, hash) {
            if(err) reject(err);
            resolve(hash);
        });
    })
}

export function compareHash(usersPlaintextPassword, hash):Promise<boolean>{
    return new Promise((resolve, reject)=>{
        bcrypt.compare(usersPlaintextPassword, hash, function(err, res) {
            if(err) reject (err);
            if(res === true){
                resolve(res);
            }
            else{
                reject(err);
            }
        });
    })
}