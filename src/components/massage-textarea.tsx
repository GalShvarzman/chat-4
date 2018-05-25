import * as React from 'react';

interface IMassageTextAreaProps {

}
interface IMassageTextAreaState {

}

class MassageTextArea extends React.Component<IMassageTextAreaProps, IMassageTextAreaState> {
    constructor(props:IMassageTextAreaProps){
        super(props)
    }

    public textAreaStyle = {
        width:'100%',
        //height:'100%',
        padding:0,
        border:'none',
        bottom: 0,
        margin:'0'
    };
    public render() {
        return (
            <textarea style={this.textAreaStyle}/>
        );
    }
}

export default MassageTextArea;