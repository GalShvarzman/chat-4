import * as React from 'react';

interface ISelectProps {

}

interface ISelectState {
    parent?:any;
}

class Select extends React.Component<ISelectProps, ISelectState> {
    constructor(props:ISelectProps){
        super(props);
        this.state = {
            parent: 'select'
        };
    }

    handleChange = (event:any) => {
        this.setState({
            parent: event.target.value
        })
    };

    render(){

        return (
            <select onChange={this.handleChange} value={this.state.parent}>
                <option value="select">Select group parent</option>
                <option value="Angular">Angular</option>
                <option value="Bootstrap">Bootstrap</option>
                <option value="React">React</option>
            </select>
        )
    }
}

export default Select;