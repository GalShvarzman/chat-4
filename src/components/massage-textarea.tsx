import * as React from 'react';

interface IMassageTextAreaProps {

}
interface IMassageTextAreaState {

}

class MassageTextArea extends React.Component<IMassageTextAreaProps, IMassageTextAreaState> {
    constructor(props:IMassageTextAreaProps){
        super(props)
    }
    public render() {
        return (
            <div>
                <textarea/>
            </div>
        );
    }
}

export default MassageTextArea;