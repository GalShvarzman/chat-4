import * as React from 'react';
import {withRouter, RouteComponentProps, Redirect} from 'react-router';
import {Switch, Route, Link} from "react-router-dom";
import Login from "./components/login";
import './App.css';
import SignUp from "./components/sign-up";
import {stateStoreService} from "./state/store";
import Chat from "./components/chat";
import Menu from "./components/menu";
import UserAdmin from "./components/user-admin";
import UserEdit from "./components/user-edit";
import NewUser from "./components/new-user";
import GroupAdmin from "./components/group-admin";
import GroupEdit from "./components/group-edit";
import NewGroup from "./components/new-group";
import SelectUsers from "./components/select-users";
import * as io from 'socket.io-client';
import {IClientGroup, IClientUser} from "./interfaces";
import {connect} from 'react-redux';
import {authUser, onCreateNewGroup, getGroupOptionalParents, logOut, saveGroupNewName, saveUserNewDetails,
    onDeleteUser, onDeleteGroup} from "./state/actions";
import {getGroups, getGroupsWithGroupChildren, getUsers} from "./selectors/selectors";
import {RefObject} from "react";

export const socket = io('http://localhost:4000',{
    transports: ['websocket']
});

interface IAppProps {
    users: IClientUser[],
    groups: IClientGroup[],
    loggedInUser:IClientUser,
    loginErrorMsg:string | null,
    errorMsg: string | null,
    groupsWithGroupsChildren:IClientGroup[],
    createNewErrorMsg:string|null,
    onLogOut():void,
    onEditUserDetails(user: IClientUser): void,
    onEditGroupName(group:IClientGroup):void,
    onAuthUser(user:{name:string,password:string}):IClientUser,
    onGetGroupOptionalParents():void,
    onCreateNewGroup(group:{name:string, parentId:string}):void,
    onDeleteUser(user:{name: string, age: number, _id: string}):void,
    onDeleteGroup(group:IClientGroup):void
}

type AppProps = RouteComponentProps<{}> & IAppProps;

class App extends React.PureComponent<AppProps , {}> {
    public chat:RefObject<any>;
    public menu:any;

    constructor(props: AppProps) {
        super(props);
        this.chat = React.createRef();
    }

    // componentWillMount(){
    //     stateStoreService.subscribe(this.onSubscribe);
    // }
    //
    // componentWillUnmount(){
    //     stateStoreService.unsubscribe(this.onSubscribe);
    // };
    //
    // componentDidMount(){
    //     this.setState({tree:stateStoreService.get('tree'), users: stateStoreService.get('users'), groups: stateStoreService.get('groups')})
    // }
    //
    // private onSubscribe = async (event:{changed:string[]}) => {
    //     if(event.changed){
    //         event.changed.forEach((change)=>{
    //             const result  = changeOptions[change]();
    //             this.setState({[change]:result});
    //         })
    //     }
    // };

    public onEditUserDetails = (user:IClientUser) => {
        this.props.onEditUserDetails(user);
    };

    public onEditGroupName = async (group:IClientGroup) => {
        this.props.onEditGroupName(group);
    };

    public onLoginSubmitHandler = async (user:{name:string, password:string})=> {
        this.props.onAuthUser(user);
    };

    public onSignUpSubmitHandler = async (user:IClientUser):Promise<void> => {
        // try{
        //     const result = await stateStoreService.createNewUser(user);
        //     this.setState({loggedInUser:{name:result.user.name, id:result.user._id}}, ()=>{
        //         socket.emit('login', result.user.name);
        //         this.setState({errorMsg: ERROR_MSG.none});
        //         this.props.history.push('/chat');
        //     });
        // }
        // catch(e){
        //     this.setState({errorMsg: ERROR_MSG.credentials})
        // }
    };

    public loginRender = (props:any) => this.props.loggedInUser ? (<Redirect to={'/chat'}/>) :
        (<Login {...props} onSubmit={this.onLoginSubmitHandler} loginErrorMsg={this.props.loginErrorMsg}/>);

    public signUpRender = (props:any)=>(<SignUp {...props} onSubmit={this.onSignUpSubmitHandler}/>);

    public chatRender = (props:any) => (<Chat ref={this.chat} {...props}/>);

    public logOut = () => {
        this.props.onLogOut();
        this.chat.current.getWrappedInstance().onUserLogOut();
    };

    public usersRender = () => (<UserAdmin errorMsg={this.props.errorMsg} deleteUser={this.deleteUser} refMenu={this.menu} users={this.props.users}/>);

    public groupsRender = () => (<GroupAdmin errorMsg={this.props.errorMsg} deleteGroup={this.deleteGroup} groups={this.props.groups}/>);

    public userEditRender = (props:any) => (<UserEdit updateErrorMsg={this.props.errorMsg} onEditUserDetails={this.onEditUserDetails} {...props}/>);

    public deleteUser = (user:{name: string, age: number, _id: string}) => {
        this.props.onDeleteUser(user);
    };

    public deleteGroup = (group:IClientGroup) => {
         this.props.onDeleteGroup(group);
    };

    public newUserRender = (props:any) => (<NewUser {...props} onCreateNewUser={this.onCreateNewUser}/>);

    public newGroupRender = (props:any) => (<NewGroup createNewErrorMsg={this.props.createNewErrorMsg} groupsWithGroupsChildren={this.props.groupsWithGroupsChildren}
                                                      {...props} onGetGroupOptionalParents={this.onGetGroupOptionalParents}
                                                      onCreateNewGroup={this.onCreateNewGroup}/>);

    public onGetGroupOptionalParents = () => {
        this.props.onGetGroupOptionalParents();
    };

    public groupEditRender = (props:any) => (<GroupEdit deleteGroup={this.deleteGroup} updateErrorMsg={this.props.errorMsg}
                                                        saveGroupNewName={this.onEditGroupName} {...props}/>);

    public selectUsersRender = (props:any) => (<SelectUsers {...props} handelAddUsersToGroup={this.handelAddUsersToGroup}/>);

    public onCreateNewUser = async (user:{name:string, age:number, password:string}) => {
        return await stateStoreService.createNewUser(user);
    };

    public onCreateNewGroup = (group:{name:string, parentId:string}) => {
        return this.props.onCreateNewGroup(group);
    };

    public handelAddUsersToGroup = async(data:{usersIds:string[], groupId:string}) => {
        return await stateStoreService.addUsersToGroup(data);
        // fixme
    };

    public render() {
        return (
            <div className="App">
                <Route path='/login' render={this.loginRender}/>
                <Route path='/sign-up' render={this.signUpRender}/>
                <nav>
                    <div className="nav-left">
                        <Link to="/"><button className="btn-home">Home</button></Link>
                        <Link to="/login"><button className="btn-login">login</button></Link>
                        <Link to="/sign-up"><button className="btn-sign-up">sign up</button></Link>
                        <Menu ref={instance => {this.menu = instance}}/>
                    </div>
                    <div className="nav-right">
                        <Link to="/chat"><button className="btn-log-out" onClick={this.logOut}>Log out</button></Link>
                    </div>
                    <div hidden={!this.props.loggedInUser} className='nav-right'>
                        <div className="app-logged-in">You are logged in as:
                            <span className='logged-in-name'>
                                {this.props.loggedInUser ? this.props.loggedInUser.name : ""}
                            </span>
                        </div>
                    </div>
                </nav>
                <div className="switch">
                    <Switch>
                        <Route exact={true} path='/users' render={this.usersRender}/>
                        <Route exact={true} path='/groups' render={this.groupsRender}/>
                        <Route exact={true} path='/groups/new' render={this.newGroupRender}/>
                        <Route exact={true} path='/groups/:id' render={this.newGroupRender}/>
                        <Route exact={true} path='/groups/:id/add-users' render={this.selectUsersRender}/>
                        <Route exact={true} path='/groups/:id/edit' render={this.groupEditRender}/>
                        <Route exact={true} path='/users/new' render={this.newUserRender}/>
                        <Route exact={true} path='/users/:id' render={this.newUserRender}/>
                        <Route exact={true} path='/users/:id/edit' render={this.userEditRender}/>
                        <Route path='/chat' render={this.chatRender}/>
                        <Route path='/' render={this.chatRender}/>
                    </Switch>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state:any, ownProps:any) => {
    return {
        users:getUsers(state),
        groups:getGroups(state),
        loggedInUser:state.loggedInUser,
        loginErrorMsg:state.loginErrorMsg,
        errorMsg: state.errorMsg,
        groupsWithGroupsChildren:getGroupsWithGroupChildren(state),
        createNewErrorMsg:state.createNewErrorMsg
    }
};

const mapDispatchToProps = (dispatch:any, ownProps:any) => {
    return {
        onEditUserDetails: (user:IClientUser) => {
            dispatch(saveUserNewDetails(user))
        },
        onEditGroupName: (group:IClientGroup) => {
            dispatch(saveGroupNewName(group))
        },
        onAuthUser: (user:{name:string, password:string}) => {
            dispatch(authUser(user))
        },
        onLogOut: () => {
            dispatch(logOut(null, null));
        },
        onGetGroupOptionalParents: () => {
            dispatch(getGroupOptionalParents())
        },
        onCreateNewGroup: (group:{name:string, parentId:string}) => {
            dispatch(onCreateNewGroup(group))
        },
        onDeleteUser: (user:{name: string, age: number, _id: string}) => {
            dispatch(onDeleteUser(user));
        },
        onDeleteGroup:(group:IClientGroup) => {
            dispatch(onDeleteGroup(group));
        }
    }
};

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(App));