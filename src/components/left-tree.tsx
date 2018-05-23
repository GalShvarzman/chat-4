import * as React from 'react';

interface ILeftTreeProps {

}
interface ILeftTreeState {

}

class LeftTree extends React.Component<ILeftTreeProps, ILeftTreeState> {
    constructor(props:ILeftTreeProps){
        super(props)
    }
    public render() {
        return (
            <div >
                left tree
            </div>
        );
    }
}

export default LeftTree;