import * as React from 'react';
import './left-tree.css'
import {stateStoreService} from "../state/state-store";

const items = JSON.parse(stateStoreService.walkTree());

interface listItem{
    items: object[],
    name:string,
    type:string,
    id:string
}

interface ILeftTreeProps {
    getSelected(event:any):void
}

interface ILeftTreeState {
    selectedName : {}
}

class LeftTree extends React.Component<ILeftTreeProps, ILeftTreeState> {
    constructor(props:ILeftTreeProps){
        super(props);
        this.state = {
            selectedName : {}
        }
    }

    // public load = () => {
        // this.ul.remove();
        // if(this.ul.children.length){
        //     this.removeChildren(this.ul);
        // }
         //const tree:any[] = this.walkTree(items, 0);
         //this.ul = this.getList(tree);
        // for(let item of this.tree){
        //     this.ul.appendChild(item);
        // }

        // document.body.insertBefore(this.ul,document.body.firstChild);
    // };

    public load =  ()=>{
        return this.walkTree(items, 0);
    };

    public onKeyUp = (e:React.KeyboardEvent<HTMLElement>)=>{
        const keyName = e.key;
        if(e.target){
            // this.props.getSelected(e);
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
                this.getAllLi((e.target as HTMLElement), keyName);
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

    public getAllLi = (element:HTMLElement, keyName:string)=>{
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
        if(index !== undefined && index !== -1){
            if(keyName === "ArrowDown"){
                const nextLi=index+1;
                if(nextLi < displayedLi.length){
                    (displayedLi[nextLi].querySelector(":scope>a") as HTMLElement).focus();
                }
            }
            else if(keyName === "ArrowUp"){
                const nextLi=index-1;
                if(nextLi >= 0){
                    (displayedLi[nextLi].querySelector(":scope>a") as HTMLElement).focus();
                }
            }
        }
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

    public walkTree = (items:object[], step:number)=>{
        const result:any[] = [];
        items.forEach((item:listItem)=>{
            if(item.items){
                const li = this.createLiWithChildren(item, step);
                result.push(li);
            }
            else{
                const li = this.createLi(item, step);
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

    public clickListener=(e:React.MouseEvent<HTMLElement>)=>{
        (e.target as HTMLElement).focus();
        e.stopPropagation();
        this.props.getSelected(e);
    };

    public shouldComponentUpdate(nextProps:any, nextState:any) {
        return false
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
            this.walkTree(item.items, step+1).map((childItem) => {
                return childItem
            })
        );
        const a = React.createElement("a", {tabIndex:1, style:this.groupStyle(step), className:"item-name", id:item.id, type:item.type}, "☻"+item.name);
        return React.createElement("li", {key:item.id}, a, ul);
    };

    public createLi = (item:any, step:number) => {
        const a = React.createElement("a", {tabIndex:1, style:this.userStyle(step), className:"item-name", id:item.id, type:item.type}, "☺"+item.name);
        return React.createElement("li", {key:item.id}, a);
    };


    // public removeChildren=(element:HTMLElement)=>{
    //     let length = element.children.length;
    //     while(length > 0){
    //         element.children[--length].remove();
    //     }
    // };

    // public clear = () =>{
    //     if(this.ul.children.length){
    //         this.ul.remove();
    //         this.removeChildren(this.ul);
    //         document.body.insertBefore(this.ul,document.body.firstChild);
    //     }
    // };

    public render() {
        const list = this.load();
        return (
            <div>
                <ul onClick={this.clickListener} onDoubleClick={this.dblClickListener} onKeyUp={this.onKeyUp} className="left tree">{list}</ul>
            </div>
        );
    }
}

export default LeftTree;