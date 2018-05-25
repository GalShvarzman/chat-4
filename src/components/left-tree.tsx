import * as React from 'react';
import './left-tree.css'
let idx = 0;
const items = [
        {
            "type": "group",
            "name": "Friends",
            "items": [
                {
                    "type": "group",
                    "name": "Best Friends",
                    "items": [
                        {
                            "type": "user",
                            "name": "Tommy"
                        }
                    ]
                },
                {
                    "type": "user",
                    "name": "Udi"
                }
            ]
        },
            {
                "type": "user",
                "name": "Ori"
            },
            {
                "type": "user",
                "name": "Roni"
            }
        ];
interface listItem{
    items: object[],
    name:string,
    type:string
}
interface ILeftTreeProps {

}

interface ILeftTreeState {

}

class LeftTree extends React.Component<ILeftTreeProps, ILeftTreeState> {
    constructor(props:ILeftTreeProps){
        super(props)
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
    };

    public padding=(number:number)=>{
        let start = "";
        let space = "\u00a0\u00a0";
        for(let i = 0; i < number; i++){
            start+=space;
        }
        return start;
    };

    public groupStyle = {
        cursor:"pointer",
        color : "#113f6b"
    };

    public userStyle = {
        color: "#006cbe"
    };

    public createLiWithChildren=(item:listItem, step:number)=>{
        const space:string = this.padding(step);
        const ul = React.createElement("ul", {style:this.ulStyle},
            this.walkTree(item.items, step+1).map((childItem)=>{
                return childItem
            })
        );
        const a = React.createElement("a", {tabIndex:1, style:this.groupStyle}, space+"☺"+item.name);
        return React.createElement("li", {key:idx++}, a, ul);
    };

    public createLi=(item:any, step:number)=>{
        const space:string = this.padding(step);
        const a = React.createElement("a", {tabIndex:1, style:this.userStyle}, space+item.name);
        return React.createElement("li", {key:idx++}, a);
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