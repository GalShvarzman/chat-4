import * as React from 'react';
import {Link} from 'react-router-dom';

interface ISignUpProps {

}
interface ISignUpState {

}

class SignUp extends React.Component<ISignUpProps, ISignUpState> {
    constructor(props:ISignUpProps){
        super(props)
    }
    public render() {
        return (
            <div>
                <input type="text" placeholder="name"/>
                <input type="number" placeholder="age"/>
                <input type="password" placeholder="password"/>
                <Link to='/login'><input type="button" value="Submit"/></Link>
            </div>
        );
    }
}

export default SignUp;