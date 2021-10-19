import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
//import { getStorage } from '../../../config';
import { Link } from 'react-router-dom';
import '../css/mainHeaderMenu.css';
import Language from './language';
import Notifications from './notification';
import Profile from './profile';

class MainHeaderMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    checkURL = (urlName, linkArr) => {
        var result = false;
        if (linkArr !== undefined) {
            linkArr.forEach(link => {
                if (link.url === urlName) {
                    result = true;
                }
            });
        }

        return result;
    }

    render() {
        const { auth } = this.props;
        return (
            <React.Fragment>
                <div className="navbar-custom-menu">
                    <ul className="nav navbar-nav">
                        {/* <Roles /> */}
                        <li>
                            <Link to="/user-guide">
                                <i style={{ fontSize: '22px', color: 'rgb(76, 76, 76)' }} className="material-icons" >
                                    help_outline
                                </i>
                            </Link>
                        </li>
                        {
                            this.checkURL('/notifications', auth.links) &&
                            <Notifications />
                        }
                        <Language />
                        <Profile />
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}
const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(MainHeaderMenu));
