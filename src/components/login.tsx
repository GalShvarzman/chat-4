import * as React from 'react';
import {Link} from 'react-router-dom';
interface ILoginProps {
    users:any[]
}
interface ILoginState {

}

class Login extends React.Component<ILoginProps, ILoginState> {
    constructor(props:ILoginProps){
        super(props);
        debugger
    }
    public render() {
        return (
            <div>
                <input type="text" placeholder="name"/>
                <input type="password" placeholder="password"/>
                <Link to='/chat'><input type="button" value="Submit"/></Link>
            </div>
        );
    }
}

export default Login;