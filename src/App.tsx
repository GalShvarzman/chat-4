import * as React from 'react';
import Chat from "./components/chat";
import {Switch, Route, Link} from "react-router-dom";
import Login from "./components/login";
import './App.css';
import SignUp from "./components/sign-up";
import {appService} from "./state/state-store";
import StateStore from './state/state-store';

let state = StateStore.getInstance();

interface IAppProps {

}
interface IAppState {

}

class App extends React.Component<IAppProps, IAppState> {
    constructor(props:IAppProps) {
        super(props);

        appService.subscribe(() => {
            this.forceUpdate();
        });

        this.state = {state};
        debugger
    }

    public loginRender = (props:any)=>(<Login {...props} />);

    public render() {
        return (
            <div className="App">
                <nav>
                <div className="nav-right">
                    <Link to="/login"><button className="btn-login">login</button></Link>
                    <Link to="/sign-up"><button className="btn-sign-up">sign up</button></Link>
                </div>
            </nav>
                <div className="switch">
                    <Switch>
                        <Route path='/chat' component={Chat}/>
                        <Route path='/login' render={this.loginRender}/>
                        <Route path='/sign-up' component={SignUp}/>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default App;