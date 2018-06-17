export class ClientError extends Error{
    constructor(public status, message){
        super(message);
        this.status = status;
    }
}