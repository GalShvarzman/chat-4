import * as React from 'react';
import './left-tree.css'
import {setErrorMsg} from "../state/actions";
import {store} from "../state/store";
import {IClientUser} from "../interfaces";

export interface listItem{
    children?: object[],
    name:string,
    kind:string,
    _id:string
}

interface ILeftTreeProps {
    getSelected(eventTarget:any):void,
    tree:listItem[],
    errorMsg:string|null,
    loggedInUser:IClientUser|null
}

interface ILeftTreeState {
    selectedName : {}
}

class LeftTree extends React.PureComponent<ILeftTreeProps, ILeftTreeState> {
    constructor(props:ILeftTreeProps){
        super(props);

        this.state = {
            selectedName : {}
        }
    }

    public load = ()=>{
        return this.walkTree(this.props.tree, 0);
    };

    public onKeyUp = (e:React.KeyboardEvent<HTMLElement>)=>{
        const keyName = e.key;
        if(e.target){
            if((e.target as HTMLElement).className === "left tree"){
                ((e.target as HTMLElement).children[0].querySelector(":scope > a") as HTMLElement).focus();
            }
            else if(keyName === "ArrowRight"){
                this.openChildren((e.target as HTMLElement));
            }
            else if((keyName === "ArrowLeft")){
                this.closeChildren((e.target as HTMLElement));
            }
            else if(keyName === "ArrowDown" || keyName === "ArrowUp"){
                this.getAllLi((e.target as HTMLElement), keyName, e);
            }
            else if(keyName === "Enter"){
                this.toggleExpandOrCollapse((e.target as HTMLElement))
            }
        }
    };

    public toggleExpandOrCollapse = (element:HTMLElement) => {
        if(element.nextElementSibling){
            this.toggleDisplay((element.nextElementSibling as HTMLElement));
        }
    };

    public getAllLi = (element:HTMLElement, keyName:string, e:any)=>{
        const selectedLi = element.parentElement;
        const allLi = document.querySelectorAll("li");

        function getDisplayedLi(){
            const result:HTMLLIElement[] = [];
            for(let i = 0; i < allLi.length; i++){
                if(allLi[i].offsetParent){
                    result.push(allLi[i]);
                }
            }
            return result;
        }
        const displayedLi = getDisplayedLi();
        function findIndex (){
            let result;
            for(let i = 0; i < displayedLi.length; i++){
                if(displayedLi[i] === selectedLi){
                    result = i;
                }
            }
            return result;
        }
        const index = findIndex();
        if(index !== undefined && index !== -1) {
            let next: HTMLElement;
            if (keyName === "ArrowDown") {
                const nextLi = index + 1;
                if (nextLi < displayedLi.length) {
                    next = (displayedLi[nextLi].querySelector(":scope>a") as HTMLElement);
                    this.goToNext(next);
                }
            }
            else if (keyName === "ArrowUp") {
                const nextLi = index - 1;
                if (nextLi >= 0) {
                    next = (displayedLi[nextLi].querySelector(":scope>a") as HTMLElement);
                    this.goToNext(next);
                }
            }
        }
    };

    public goToNext = (next:HTMLElement)=>{
        next.focus();
        this.props.getSelected(next);
    };

    public openChildren = (element:HTMLElement)=>{
        if(element.nextElementSibling){
            (element.nextElementSibling as HTMLElement).style.display = "block";
            (element.nextElementSibling as HTMLElement).focus();
        }
    };

    public closeChildren = (element:HTMLElement)=>{
        if(element.parentElement && element.parentElement.parentElement && element.parentElement.parentElement.parentElement){
            if(element.nextElementSibling){
                if((element.nextElementSibling as HTMLElement).style.display === "block"){
                    (element.nextElementSibling as HTMLElement).style.display = "none";
                }
                else{
                    (element.parentElement.parentElement.parentElement.querySelector(":scope a") as HTMLElement).focus();
                }
            }
        }
    };

    public ulStyle = {
      display : "none"
    };

    public walkTree = (items:object[], step:number) => {
        const result:any[] = [];
        items.forEach((item:listItem) => {
            if(item.kind === 'Group'){
                if(item.children){
                    const li = this.createLiWithChildren(item, step);
                    result.push(li);
                }
                else{
                    const li = this.createGroupLi(item, step);
                    result.push(li);
                }
            }
            else{
                const li = this.createUserLi(item, step);
                result.push(li);
            }
        });
        return result;
    };

    public toggleDisplay= (element:HTMLElement)=>{
        if(element){
            if (element.style.display !== "none") {
                element.style.display = "none";
            }
            else {
                element.style.display = "block";
            }
        }
    };

    public dblClickListener= (e:React.MouseEvent<HTMLElement>)=>{
        if(e.target){
            this.toggleDisplay(((e.target as HTMLElement).nextElementSibling as HTMLElement));
            e.stopPropagation();
        }
    };

    public clickListener = (e:React.MouseEvent<HTMLElement>) => {
        (e.target as HTMLElement).focus();
        e.stopPropagation();
        this.props.getSelected(e.target);
    };

    public padding=(number:number)=>{
        let start = 0;
        let space = 20;
        for(let i = 0; i < number; i++){
            start+=space;
        }
        return start;
    };

    public groupStyle = (step:number) => {
        const space:number = this.padding(step);
        return{
            cursor:"pointer",
            color : "#113f6b",
            paddingLeft:space+'px'
        }
    };

    public userStyle = (step:number) => {
        const space:number = this.padding(step);
        return{
            color: "#006cbe",
            paddingLeft:space+'px'
        }
    };

    public createLiWithChildren = (item:listItem, step:number) => {
        const ul = React.createElement("ul", {style:this.ulStyle},
            this.walkTree(item.children, step+1).map((childItem) => {
                return childItem
            })
        );
        const a = React.createElement("a", {tabIndex:1, style:this.groupStyle(step), className:"item-name", id:item._id, type:item.kind}, "☻"+item.name);
        return React.createElement("li", {key:item._id}, a, ul);
    };

    public createGroupLi = (item:any, step:number) => {
        const a = React.createElement("a", {tabIndex:1, style:this.groupStyle(step), className:"item-name", id:item._id, type:item.kind}, "☻"+item.name);
        return React.createElement("li", {key:item._id}, a);
    };

    public createUserLi = (item:any, step:number) => {
        const a = React.createElement("a", {tabIndex:1, style:this.userStyle(step), className:"item-name", id:item._id, type:item.kind}, "☺"+item.name);
        return React.createElement("li", {key:item._id}, a);
    };

    componentWillUnmount(){
        store.dispatch(setErrorMsg(null));
    }

    public render() {
        const list = this.props.tree.length ? this.load() : [];
        return (<>
                <p hidden={!this.props.errorMsg || !this.props.loggedInUser}>{this.props.errorMsg}</p>
                <ul onClick={this.clickListener} onDoubleClick={this.dblClickListener} onKeyUp={this.onKeyUp}
                    className="left tree">{list}</ul>
            </>

        );
    }
}

export default LeftTree;