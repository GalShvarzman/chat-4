import * as React from 'react';

interface IMassageListItemProps {
    massage:string
}
interface IChatMassageListItemState {

}

class MassageListItem extends React.Component<IMassageListItemProps, IChatMassageListItemState> {
    constructor(props:IMassageListItemProps){
        super(props)
    }
    public render() {
        return (
            <li>
                {this.props.massage}
            </li>
        );
    }
}

export default MassageListItem;