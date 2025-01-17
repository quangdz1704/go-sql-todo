import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DialogModal, ErrorLabel } from '../../../common-components';
import { getStorage } from '../../../config';
import ValidationHelper from '../../../helpers/validationHelper';
import { AuthActions } from '../../../modules/auth/redux/actions';
import './header.css';
import MainHeaderMenu from './mainHeaderMenu';
import ModalChangeUserInformation from './modalChangeUserInformation';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { translate, auth } = this.props;
        const {
            oldPasswordError, newPasswordError, confirmPasswordError
        } = this.state;

        return (
            <React.Fragment>
                <header className="main-header">
                    <Link to='/' className="logo">
                        <span className="logo-mini"><img src='/logo-v1.jpg' /></span>
                        <span className="logo-lg"><b className="text-white">EMS</b></span>
                    </Link>
                    <nav className="navbar navbar-static-top">
                        <a className="sidebar-toggle" style={{ color: '#4C4C4C' }} data-toggle="push-menu" data-expand-on-hover={true} role="button">
                            <span className="sr-only">Toggle navigation</span>
                        </a>
                        <MainHeaderMenu />
                    </nav>
                </header>

                {/* Modal profile */}
                {
                    auth.user.name !== undefined &&
                    <ModalChangeUserInformation
                        userId={auth.user._id}
                        userName={auth.user.name}
                        userEmail={auth.user.email}
                    />
                }

                {/* Modal Security */}
                <DialogModal
                    modalID="modal-security"
                    formID="form-security" size="30"
                    title={translate('auth.security.title')}
                    func={this.saveNewPassword} disableSubmit={!this.isFormValidated()}
                >
                    <form id="form-security" style={{ padding: '10px 20px 10px 20px' }}>
                        <div className={`form-group ${!oldPasswordError ? "" : "has-error"}`}>
                            <label>{translate('auth.security.old_password')}<span className="text-red">*</span></label>
                            <input className="form-control" type="password" onChange={this.handleOldPassword} placeholder="Nhập mật khẩu cũ" />
                            <ErrorLabel content={oldPasswordError} />
                        </div>
                        <div className={`form-group ${!newPasswordError ? "" : "has-error"}`}>
                            <label>{translate('auth.security.new_password')}<span className="text-red">*</span></label>
                            <input className="form-control" type="password" onChange={this.handleNewPassword} placeholder="Nhập mật khẩu mới" />
                            <ErrorLabel content={newPasswordError} />
                        </div>
                        <div className={`form-group ${!confirmPasswordError ? "" : "has-error"}`}>
                            <label>{translate('auth.security.confirm_password')}<span className="text-red">*</span></label>
                            <input className="form-control" type="password" onChange={this.handleConfirmPassword} placeholder="Nhập lại mật khẩu mới" />
                            <ErrorLabel content={confirmPasswordError} />
                        </div>
                        <div className={`form-group`}>
                            <label style={{ display: 'flex', marginTop: '5px' }}>
                                <span style={{ marginRight: '10px' }}>Mật khẩu cấp 2</span>
                                <div style={{ display: 'flex' }}>
                                    <span style={{ marginRight: '5px' }}>Chưa có?</span>
                                    <span>
                                        <Link to="/answer-auth-questions" target="_blank">
                                            <p>{` Thêm ngay`}</p>
                                        </Link>
                                    </span>
                                </div>
                            </label>
                            <input className="form-control" type="password" onChange={this.handleNewPassword2} placeholder="Nhập mật khẩu cáp 2 mới" />
                        </div>
                    </form>
                </DialogModal>

            </React.Fragment>
        );
    }

    handleOldPassword = (e) => {
        let { value } = e.target;
        let { translate } = this.props;
        let { message } = ValidationHelper.validatePassword(translate, value);
        this.setState({
            oldPassword: value,
            oldPasswordError: message
        })
    }

    handleNewPassword = (e) => {
        let { value } = e.target;
        let { translate } = this.props;
        let { message } = ValidationHelper.validatePassword(translate, value);
        this.setState({
            newPassword: value,
            newPasswordError: message
        })
    }

    handleConfirmPassword = (e) => {
        let { value } = e.target;
        let { translate } = this.props;
        let { message } = ValidationHelper.validatePassword(translate, value);
        this.setState({
            confirmPassword: value,
            confirmPasswordError: message
        })
    }

    handleNewPassword2 = (e) => {
        const { value } = e.target;
        this.setState({
            password2: value,
        })
    }

    isFormValidated = () => {
        const { oldPassword, newPassword, confirmPassword } = this.state;
        let { translate } = this.props;
        if (
            !ValidationHelper.validatePassword(translate, oldPassword).status ||
            !ValidationHelper.validatePassword(translate, newPassword).status ||
            !ValidationHelper.validatePassword(translate, confirmPassword).status
        ) return false;
        return true;
    }

    saveNewPassword = () => {
        const { translate } = this.props;
        const { oldPassword, newPassword, confirmPassword, password2 } = this.state;
        if (newPassword !== confirmPassword) {
            toast.error(translate('auth.validator.confirm_password_invalid'));
        }
        if (this.isFormValidated()) {
            return this.props.changePassword({
                password: oldPassword,
                new_password: newPassword,
                password2,
            });
        }
    }

    getLinkId = (path, links) => {

        var linkId;
        for (let index = 0; index < links.length; index++) {
            const element = links[index];
            if (element.url === path) {
                linkId = element._id;
            }
        }

        return linkId;
    }

    componentDidMount() {
        this.props.refresh();

        const currentRole = getStorage("currentRole");
        // this.props.getLinksOfRole(currentRole)
        //     .then(res => {
        //         const links = res.data.content;
        //         const path = window.location.pathname;
        //         const linkId = this.getLinkId(path, links);
        //         this.props.getComponentsOfUserInLink(currentRole, linkId);
        //     })
    }
}

const mapStateToProps = state => {
    return state;
}

const mapDispatchToProps = {
    changePassword: AuthActions.changePassword,
    refresh: AuthActions.refresh,
    // getLinksOfRole: AuthActions.getLinksOfRole,
    getComponentsOfUserInLink: AuthActions.getComponentOfUserInLink
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(Header));