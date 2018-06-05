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
    loggedInUser: {name:string, id:string} | null,
    errorMsg: ERROR_MSG,
    counter: number,
    redirectToChat:boolean
}

class App extends React.Component<{}, IAppState> {
    public chatMessagesChild:any;

    constructor(props:{}) {
        super(props);

        this.state = {
            loggedInUser: null,
            errorMsg: ERROR_MSG.none,
            counter: 0,
            redirectToChat:false,
        };

        stateStoreService.subscribe(() => {
            this.forceUpdate();
        });
    }

    public onLoginSubmitHandler =(user:{name:string, password:string})=>{
        try{
            const userId = stateStoreService.auth(user);
            this.setState({
                loggedInUser: {name: user.name, id:userId},
                errorMsg: ERROR_MSG.allGood,
                redirectToChat: true
            })

        }
        catch(error){
            if(this.state.counter === 2){
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

    public onSignUpSubmitHandler = (user:{name:string, age?:number, password:string}) => {
        if(!stateStoreService.addNewUser(user)){
            this.setState({errorMsg: ERROR_MSG.credentials})
        }
        else{
            const userId = stateStoreService.getUserId(user.name);
            this.setState({loggedInUser:{name:user.name, id:userId},redirectToChat:true});
        }
    };

    public loginRender = (props:any)=>(this.state.redirectToChat ? <Redirect to={{ pathname : '/chat'}} /> : <Login {...props} data={this.state} loginStatus={this.state.errorMsg} onSubmit={this.onLoginSubmitHandler}/>);

    public signUpRender = (props:any)=>(this.state.redirectToChat ? <Redirect to={{ pathname : '/chat'}}/> : <SignUp {...props} signUpStatus={this.state.errorMsg} onSubmit={this.onSignUpSubmitHandler}/>);

    public chatRender = (props:any) => (<Chat ref={instance => {this.chatMessagesChild = instance}} {...props} data={this.state}/>);

    public logOut = () => {
        this.setState({loggedInUser:null, redirectToChat:false, errorMsg: ERROR_MSG.none});
        this.chatMessagesChild.logOut();
    };

    public render() {
        return (
            <div className="App">
                <Route path='/login' render={this.loginRender}/>
                <Route path='/sign-up' render={this.signUpRender}/>
                <nav>
                    <div className="nav-left">
                        <Link to="/login"><button className="btn-login">login</button></Link>
                        <Link to="/sign-up"><button className="btn-sign-up">sign up</button></Link>
                    </div>
                    <div className="nav-right">
                        <Link to="/chat"><button className="btn-log-out" onClick={this.logOut}>Log out</button></Link>
                    </div>
                    <div hidden={!this.state.loggedInUser} className='nav-right'>
                        <div className="app-logged-in">You are logged in as: <span className='logged-in-name'>{this.state.loggedInUser ? this.state.loggedInUser.name : ""}</span></div>
                    </div>
                </nav>
                <div className="switch">
                    <Switch>
                        <Route exact={true} path='/chat' render={this.chatRender}/>
                        <Route path='/' render={this.chatRender}/>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default App;