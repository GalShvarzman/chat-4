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

    public loginRender = (props:any)=>(this.state.redirect ? <Redirect to={{ pathname: '/chat/'+this.state.loggedInUser}} /> : <Login {...props} data={this.state} loginStatus={this.state.errorMsg} onSubmit={this.onLoginSubmitHandler}/>);

    public chatRender = (props:any) => (<Chat {...props} data={this.state}/>);

    public logOut = () => {
        this.setState({loggedInUser:null, redirect:false});
    };

    // public componentDidMount (){debugger
    //
    // }

    public render() {
        // const users = stateStoreService.get('users').map((user,idx)=>{
        //     return <li key={idx}>{user.name}</li>
        // });

        return (
            <div className="App">
                <nav>
                    <div className="nav-left">
                        <Link to="/login"><button className="btn-login">login</button></Link>
                        <Link to="/sign-up"><button className="btn-sign-up">sign up</button></Link>
                        <Link to="/"><button onClick={this.logOut}>Log out</button></Link>
                    </div>
                    <div className='nav-right'>
                        <div hidden={!this.state.loggedInUser} className="app-logged-in">You are logged in as {this.state.loggedInUser}</div>
                    </div>
                </nav>
                <div className="switch">
                    <Switch>
                        <Route exact={true} name='chat' path='/chat' render={this.chatRender}/>
                        <Route exact={true} path='/chat/:name' render={this.chatRender}/>
                        <Route path='/sign-up' component={SignUp}/>
                        <Route path='/login' render={this.loginRender}/>
                        <Redirect to='/chat' />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default App;