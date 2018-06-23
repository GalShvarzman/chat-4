import * as React from 'react';

interface ICheckboxProps {
    label:string,
    handleCheckboxChange(label:string):void
}

interface ICheckboxState {
    isChecked:boolean
}

class Checkbox extends React.Component<ICheckboxProps, ICheckboxState> {
    constructor(props:ICheckboxProps){
        super(props);
        this.state = {
            isChecked: false
        }
    }

    toggleCheckboxChange = () => {
        const { handleCheckboxChange, label } = this.props;

        this.setState(({ isChecked }) => (
            {
                isChecked: !isChecked,
            }
        ));

        handleCheckboxChange(label);
    };

    render() {
        const { label } = this.props;
        const { isChecked } = this.state;

        return (
            <div className="checkbox">
                <label>
                    <input
                        type="checkbox"
                        value={label}
                        checked={isChecked}
                        onChange={this.toggleCheckboxChange}
                    />

                    {label}
                </label>
            </div>
        );
    }
}

export default Checkbox;