import * as React from 'react';
import './field.css';

interface IFieldProps {
    name: string,
    type?: string,
    onChange(field:string, value:string):void,
    className?:string,
    user?:any,
    group?:any
}

const Field:React.StatelessComponent<IFieldProps> = (props) => {
    const extractValue = (event : React.ChangeEvent<HTMLInputElement>) =>{
        props.onChange(event.target.name, event.target.value);
    };

    return(
        <p className="field-wrapper">
            {props.user || props.group ? (<><label className="field-label" htmlFor={props.name}>{props.name}:</label> <input value={props.user || props.group} className="field-input" type={props.type || 'text'} name={props.name} onChange={extractValue}/></>) : (<><label className="field-label" htmlFor={props.name}>{props.name}:</label> <input className="field-input" type={props.type || 'text'} name={props.name} onChange={extractValue}/></>)}
        </p>
    )
};

export default Field;