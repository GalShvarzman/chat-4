import * as React from 'react';
import './menu.css';
import {Link} from "react-router-dom";
interface IMenuState {
    showMenu:boolean
}

class Menu extends React.Component<{}, IMenuState> {
    public dropDownMenu:any;

    constructor(props:{}) {
        super(props);

        this.state = {
            showMenu: false,
        };
    }

    showMenu = (event:React.MouseEvent<HTMLElement>) => {
        event.preventDefault();

        this.setState({ showMenu: true }, () => {
            document.addEventListener('click', this.closeMenu);
        });
    };

    closeMenu = (event:any) => {
        // if (!this.dropDownMenu.contains(event.target)) {
            this.setState({ showMenu: false }, () => {
                document.removeEventListener('click', this.closeMenu);
            });
        // }
    };

    render() {
        return (
            <>
                <button className="admin" onClick={this.showMenu}>Admin</button>
                {this.state.showMenu ?
                    (<ul className="menu" ref={(element) => {this.dropDownMenu = element;}}>
                        <li><Link to='/users'><button>Users</button></Link></li>
                        <li><Link to='/groups'><button>Groups</button></Link></li>
                    </ul>)
                 :
                    (null)
                }
            </>
        );
    }
}

export default Menu;