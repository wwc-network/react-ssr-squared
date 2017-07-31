import React from 'react';

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeMenu: this.props.activeMenu || ''
        };

        this.onShowMenu = this.onShowMenu.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.activeMenu !== this.state.activeMenu) {
            this.setState({
                activeMenu: nextProps.activeMenu
            });
        }
    }

    onShowMenu(menuName) {
        menuName = (menuName !== this.state.activeMenu) ? menuName : '';

        this.setState({
            activeMenu: menuName
        });
    }
    
    render() {
        return (
            <header>
                Header
            </header>
        );
    }
}

export default Header; 