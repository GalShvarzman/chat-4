import * as React from 'react';
import MassageListItem from "./massage-list-item";

interface IChatMassagesProps {
    massages:string[] | undefined
}
interface IChatMassagesState {

}

class ChatMassages extends React.Component<IChatMassagesProps, IChatMassagesState> {
    constructor(props:IChatMassagesProps){
        super(props)
    }

    public render() {
        let massagesHistory;
        if(this.props.massages){
             massagesHistory = this.props.massages.map((massage, idx)=>{
                return <MassageListItem key={idx} massage={massage}/>
            })
        }
        return (
            <div>
                <ul>{massagesHistory}</ul>
            </div>
        );
    }
}

export default ChatMassages;