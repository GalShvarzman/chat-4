import * as React from 'react';
import Chat from "./components/chat";
import {Switch, Route, Link} from "react-router-dom";
import Login from "./components/login";
import './App.css';
import SignUp from "./components/sign-up";
import {stateStoreService} from "./state/state-store";
import StateStore from './state/state-store';


interface IAppState {
    users: any[]
}

class App extends React.Component<{}, IAppState> {
    constructor(props:{}) {
        super(props);

        stateStoreService.subscribe(() => {
            this.forceUpdate();
        });
    }

    public loginRender = (props:any)=>(<Login {...props} />);

    public set = () => {
        stateStoreService.set('users', []);
    };

    public render() {

        const users = StateStore.getInstance().users.map((user,idx)=>{
            return <li key={idx}>{user.name}</li>
        });

        return (
            <div className="App">
                <nav>
                    <button onClick={this.set}>f</button>
                <div className="nav-right">
                    <Link to="/login"><button className="btn-login">login</button></Link>
                    <Link to="/sign-up"><button className="btn-sign-up">sign up</button></Link>
                </div>
            </nav>
                <div>
                    <ul>{users}</ul>
                </div>
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