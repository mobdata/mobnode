import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { closeChangePasswordDialog } from 'components/AppDialog'
import Dialog from '@material-ui/core/Dialog'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

class ChangePasswordDialog extends Component {
    static propTypes = {
      message: PropTypes.string.isRequired,
      openPasswordChange: PropTypes.bool,
      dispatchCloseDialog: PropTypes.func.isRequired,
      onPasswordChangeSubmit: PropTypes.func,
      title: PropTypes.string,
    }

    static defaultProps = {
      title: 'MobNode Alert',
      openPasswordChange: false,
      onPasswordChangeSubmit: null,
    }

    constructor(props) {
      super(props)
      this.state = {
        showCurrentPassword: false,
        currentPassword: '',
        showNewPasswordPrimary: false,
        newPasswordPrimary: '',
        showNewPasswordConfirm: false,
        newPasswordConfirm: '',
        error: false,
        mismatch: false,
        isBlank: true,
      }
    }

    onClose() {
      this.setState(({ currentPassword: null }))
      this.setState(({ showCurrentPassword: false }))
      this.setState(({ newPasswordPrimary: null }))
      this.setState(({ showNewPasswordPrimary: false }))
      this.setState(({ newPasswordConfirm: null }))
      this.setState(({ showNewPasswordConfirm: false }))
      this.setState(({ error: false }))
      this.setState(({ mismatch: false }))
    }

    getPasswordConfirm() {
      return this.state.newPasswordConfirm
    }

    getPasswordPrimary() {
      return this.state.newPasswordPrimary
    }

    getPasswordCurrent() {
      return this.state.currentPassword
    }

    handlePassword = (e) => {
      if (e.target.id === 'currentPassword') { this.setState(({ currentPassword: e.target.value })) } else if (e.target.id === 'newPasswordPrimary') {
        this.setState(({ newPasswordPrimary: e.target.value }))
        this.setState(({ mismatch: e.target.value !== this.getPasswordConfirm() }))
        this.setState(({ isBlank: e.target.value === this.getPasswordConfirm() && e.target.value === '' }))
      } else if (e.target.id === 'newPasswordConfirm') {
        this.setState(({ newPasswordConfirm: e.target.value }))
        this.setState(({ mismatch: e.target.value !== this.getPasswordPrimary() }))
        this.setState(({ isBlank: e.target.value === this.getPasswordPrimary() && e.target.value === '' }))
      }
    }

    handleClickShowPassword = (e) => {
      if (e.target.id === 'showCurrentPasswordButton' || (e.target.id === '' && e.currentTarget.id === 'showCurrentPasswordButton')) {
        this.setState((prevState) => ({ showCurrentPassword: !prevState.showCurrentPassword }));
      } else if (e.target.id === 'showNewPasswordPrimaryButton' || (e.target.id === '' && e.currentTarget.id === 'showNewPasswordPrimaryButton')) {
        this.setState((prevState) => ({
          showNewPasswordPrimary: !prevState.showNewPasswordPrimary,
        }));
      } else if (e.target.id === 'showNewPasswordConfirmButton' || (e.target.id === '' && e.currentTarget.id === 'showNewPasswordConfirmButton')) {
        this.setState((prevState) => ({
          showNewPasswordConfirm: !prevState.showNewPasswordConfirm,
        }));
      }
    }

    handleBackdropClick = () => {
      this.setState(({ currentPassword: null }))
      this.setState(({ showCurrentPassword: false }))
      this.setState(({ newPasswordPrimary: null }))
      this.setState(({ showNewPasswordPrimary: false }))
      this.setState(({ newPasswordConfirm: null }))
      this.setState(({ showNewPasswordConfirm: false }))
      this.setState(({ error: false }))
      this.setState(({ mismatch: false }))
    }

    handleClose = async (e) => {
      /*
        Setting properties to null, otherwise they would appear the next time the dialog was opened.
        */
      let s = false
      if (e.target.id === 'SubmitButton' || (e.target.id === '' && e.currentTarget.id === 'SubmitButton')) {
        // eslint-disable-next-line max-len
        s = await this.props.onPasswordChangeSubmit(this.getPasswordCurrent(), this.getPasswordConfirm())
        if (await s) {
          this.setState(({ currentPassword: null }))
          this.setState(({ showCurrentPassword: false }))
          this.setState(({ newPasswordPrimary: null }))
          this.setState(({ showNewPasswordPrimary: false }))
          this.setState(({ newPasswordConfirm: null }))
          this.setState(({ showNewPasswordConfirm: false }))
          this.setState(({ error: false }))
          this.setState(({ mismatch: false }))
          this.props.dispatchCloseDialog()
        } else {
          this.setState({ error: true })
        }
      } else {
        this.props.dispatchCloseDialog()
      }
    }

    checkPasswordEquality() {
      return this.state.mismatch
    }

    render() {
      if (!this.props.openPasswordChange) {
        return null
      }

      const innerDialog =            (
        <DialogContent>
          <DialogContentText>{this.props.message}</DialogContentText>
          <FormControl>
            <InputLabel error={this.error} htmlFor="currentPassword">Current Password</InputLabel>
            <Input
              id="currentPassword"
              type={this.state.showCurrentPassword ? 'text' : 'password'}
              onChange={this.handlePassword}
              error={this.error}
              endAdornment={(
                <InputAdornment position="end">
                  <IconButton aria-label="Toggle password visibility" id="showCurrentPasswordButton" onClick={this.handleClickShowPassword}>
                    {this.state.showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )}
            />
            <FormHelperText htmlFor="password" error={this.state.error}>
              {this.state.error ? 'Password is incorrect' : ''}
            </FormHelperText>
          </FormControl>

          <div>
            <FormControl>
              <InputLabel htmlFor="newPasswordPrimary">New Password</InputLabel>
              <Input
                id="newPasswordPrimary"
                type={this.state.showNewPasswordPrimary ? 'text' : 'password'}
                onChange={this.handlePassword}
                endAdornment={(
                  <InputAdornment position="end">
                    <IconButton aria-label="Toggle password visibility" id="showNewPasswordPrimaryButton" onClick={this.handleClickShowPassword}>
                      {this.state.showNewPasswordPrimary ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )}
              />
            </FormControl>
            <div />
            <FormControl>
              <InputLabel htmlFor="newPasswordConfirm">Confirm Password</InputLabel>
              <Input
                id="newPasswordConfirm"
                type={this.state.showNewPasswordConfirm ? 'text' : 'password'}
                onChange={this.handlePassword}
                error={this.state.mismatch}
                endAdornment={(
                  <InputAdornment position="end">
                    <IconButton aria-label="Toggle password visibility" id="showNewPasswordConfirmButton" onClick={this.handleClickShowPassword}>
                      {this.state.showNewPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )}
              />
              <FormHelperText htmlFor="newPasswordConfirm" error={this.state.mismatch}>
                {this.state.mismatch ? 'Passwords do not match' : ''}
              </FormHelperText>
            </FormControl>
            <div />
            <FormControl>
              <FormHelperText htmlFor="newPasswordConfirm">
                {this.state.isBlank ? 'CAUTION: Blank fields will result in NO password' : ''}
              </FormHelperText>
            </FormControl>
          </div>
        </DialogContent>
      )

      return (
        <Dialog
          open={this.props.openPasswordChange}
          onBackdropClick={this.handleBackdropClick}
          onClose={this.props.dispatchCloseDialog}
        >
          <DialogTitle>{this.props.title}</DialogTitle>
          {innerDialog}
          <DialogActions>
            <Button id="CancelButton" onClick={this.handleClose}>Cancel</Button>
            <Button id="SubmitButton" disabled={this.state.mismatch} onClick={this.handleClose}>Submit</Button>
          </DialogActions>
        </Dialog>
      )
    }
}

const mapStateToProps = (state) => ({
  message: state.dialog.message,
  openPasswordChange: state.dialog.openPasswordChange,
  title: state.dialog.title,
  onPasswordChangeSubmit: state.dialog.onPasswordChangeSubmit,
})

const mapDispatchToProps = (dispatch) => ({
  dispatchCloseDialog: () => dispatch(closeChangePasswordDialog()),
})


export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordDialog)
