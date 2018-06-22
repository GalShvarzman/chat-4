import * as React from 'react';
import './select.css';
interface ISelectProps {
    groups:{name:string, id:string}[],
    handleSelect(select:any):void,
    parent:string;
}

class Select extends React.Component<ISelectProps, {}> {
    constructor(props:ISelectProps){
        super(props);
    }

    handleChange = (event:any) => {
        this.props.handleSelect(event.target.value);
    };

    render(){
        const optionsList = this.props.groups.map((group, index)=>{
            debugger;
            return <option value={group.id} key={index}>{group.name} {group.id}</option>
        });
        return (
            <select className="select" onChange={this.handleChange} value={this.props.parent}>
                <option value="select">Select group parent</option>
                {optionsList}
            </select>
        )
    }
}

export default Select;