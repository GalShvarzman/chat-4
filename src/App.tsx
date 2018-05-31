import * as React from 'react';
import {Switch, Route, Link, Redirect} from "react-router-dom";
import Login from "./components/login";
import './App.css';
import SignUp from "./components/sign-up";
import {stateStoreService} from "./state/state-store";
import Chat from "./components/chat";

export enum ERROR_MSG{
    none,
    allGood,
    credentials,
    locked
}

interface IAppState {
    loggedInUser: string | null,
    errorMsg: ERROR_MSG,
    counter: number,
    redirect:boolean
}

class App extends React.Component<{}, IAppState> {

    constructor(props:{}) {
        super(props);

        this.state = {
            loggedInUser: null,
            errorMsg: ERROR_MSG.none,
            counter: 0,
            redirect:false,
        };



        stateStoreService.subscribe(() => {
            this.forceUpdate();
        });
    }

    public auth = (user: {name:string, password:string}): boolean => {
        return stateStoreService.auth(user);
    };

    public onLoginSubmitHandler =(user:{name:string, password:string})=>{
        if(this.auth(user)){
            this.setState({
                loggedInUser: user.name,
                errorMsg: ERROR_MSG.allGood,
                redirect: true
            })

        }
        else{
            if(this.state.counter===2){
                this.setState({
                    loggedInUser: null,
                    errorMsg: ERROR_MSG.locked
                });
            }
            else {
                this.setState((prev) => ({
                    loggedInUser: null,
                    errorMsg: ERROR_MSG.credentials,
                    counter: this.state.counter + 1
                }));
            }
        }
    };

    public loginRender = (props:any)=>(this.state.redirect ? <Redirect to={{ pathname: '/chat'}} /> : <Login {...props} data={this.state} loginStatus={this.state.errorMsg} onSubmit={this.onLoginSubmitHandler}/>);

    public chatRender = (props:any) => (<Chat {...props} data={this.state}/>);

    public logOut = () => {
        this.setState({loggedInUser:null, redirect:false, errorMsg: ERROR_MSG.none});
    };

    public render() {
        return (
            <div className="App">
                <Route path='/login' render={this.loginRender}/>
                <nav>
                    <div className="nav-left">
                        <Link to="/login"><button className="btn-login">login</button></Link>
                        <Link to="/sign-up"><button className="btn-sign-up">sign up</button></Link>
                    </div>
                    <div className="nav-right">
                        <Link to="/chat"><button className="btn-log-out" onClick={this.logOut}>Log out</button></Link>
                    </div>
                    <div className='nav-right'>
                        <div hidden={!this.state.loggedInUser} className="app-logged-in">You are logged in as: <span className='logged-in-name'>{this.state.loggedInUser}</span></div>
                    </div>
                </nav>
                <div className="switch">
                    <Switch>
                        <Route exact={true} path='/chat' render={this.chatRender}/>
                        <Route path='/sign-up' component={SignUp}/>
                        <Route path='/' render={this.chatRender}/>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default App;