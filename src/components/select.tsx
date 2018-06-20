import * as React from 'react';

interface ISelectProps {
    groups:{name:string, id:string}[],
    handleSelect(select:any):void,
    parent:string;
}

interface ISelectState {

}

class Select extends React.Component<ISelectProps, ISelectState> {
    constructor(props:ISelectProps){
        super(props);
    }

    handleChange = (event:any) => {
        this.props.handleSelect(event.target.value);
    };

    render(){
        const optionsList = this.props.groups.map((group, index)=>{
            return <option value={group.id} key={index}>{group.name} {group.id}</option>
        });
        return (
            <select onChange={this.handleChange} value={this.props.parent}>
                <option value="select">Select group parent</option>
                {optionsList}
            </select>
        )
    }
}

export default Select;