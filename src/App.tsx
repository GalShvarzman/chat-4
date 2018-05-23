import * as React from 'react';
import './App.css';

interface IAppProps {

}
interface IAppState {

}

class App extends React.Component<IAppProps, IAppState> {
    constructor(props:IAppProps){
        super(props)
    }
    public render() {
        return (
            <div className="App">
                jj
            </div>
        );
    }
}

export default App;