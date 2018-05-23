import * as React from 'react';

interface IChatMassagesProps {

}
interface IChatMassagesState {

}

class ChatMassages extends React.Component<IChatMassagesProps, IChatMassagesState> {
    constructor(props:IChatMassagesProps){
        super(props)
    }

    // public divStyle={
    //     height:'100%',
    //     width:'75%'
    // };
    public render() {
        return (
            <div>
                massages
            </div>
        );
    }
}

export default ChatMassages;