import * as React from 'react';
import './field.css';

interface IFieldProps {
    name: string,
    type?: string,
    onChange(field:string, value:string):void
}

const Field:React.StatelessComponent<IFieldProps> = (props) => {
    const extractValue = (event : React.ChangeEvent<HTMLInputElement>) =>{
        props.onChange(event.target.name, event.target.value);
    };

    return(
        <p>
            <label className="field-label" htmlFor={props.name}>{props.name}:</label>
            <input className="field-input" type={props.type || 'text'} name={props.name} onChange={extractValue}/>
        </p>
    )
};

export default Field;