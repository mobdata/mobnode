import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { closeCreatePasswordDialog } from 'components/AppDialog'
import Dialog from '@material-ui/core/Dialog'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

class CreatePasswordDialog extends Component {
    static propTypes = {
      message: PropTypes.string.isRequired,
      dispatchCloseDialog: PropTypes.func.isRequired,
      openPasswordCreate: PropTypes.bool,
      onPasswordCreateSubmit: PropTypes.func,
      title: PropTypes.string,
    }

    static defaultProps = {
      title: 'MobNode Alert',
      onPasswordCreateSubmit: null,
      openPasswordCreate: false,
    }

    constructor(props) {
      super(props)
      this.state = {
        showPassword: false,
        showPasswordConfirm: false,
        passwordPrimary: '',
        passwordConfirm: '',
        mismatch: false,
      }
    }

    getPasswordConfirm() {
      return this.state.passwordConfirm
    }

    getPasswordPrimary() {
      return this.state.passwordPrimary
    }

    handlePassword = (e) => {
      if (e.target.id === 'passwordPrimary') {
        this.setState(({ passwordPrimary: e.target.value }))
        this.setState(({ mismatch: e.target.value !== this.getPasswordConfirm() }))
      } else if (e.target.id === 'passwordConfirm') {
        this.setState(({ passwordConfirm: e.target.value }))
        this.setState(({ mismatch: e.target.value !== this.getPasswordPrimary() }))
      }
    }

    handleClickShowPassword = (e) => {
      if (e.target.id === 'showPasswordPrimaryButton' || (e.target.id === '' && e.currentTarget.id === 'showPasswordPrimaryButton')) {
        this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
      } else if (e.target.id === 'showPasswordConfirmButton' || (e.target.id === '' && e.currentTarget.id === 'showPasswordConfirmButton')) {
        this.setState((prevState) => ({ showPasswordConfirm: !prevState.showPasswordConfirm }));
      }
    }

    handleClose = (e) => {
      /*
        Setting properties to null, otherwise they would appear the next time the dialog was opened.
        */


      if (e.target.id === 'submitButton' || (e.target.id === '' && e.currentTarget.id === 'submitButton')) {
        this.props.onPasswordCreateSubmit(this.state.passwordConfirm)
      }

      this.setState(({ passwordConfirm: null }))
      this.setState(({ passwordPrimary: null }))
      this.setState(({ showPassword: false }))
      this.setState(({ showPasswordConfirm: false }))
      this.setState(({ mismatch: false }))
      this.props.dispatchCloseDialog()
    }

    render() {
      if (!this.props.openPasswordCreate) {
        return null
      }

      const innerDialog = (
        <DialogContent>
          <DialogContentText>{this.props.message}</DialogContentText>
          <FormControl>
            <InputLabel htmlFor="passwordPrimary">Password</InputLabel>
            <Input
              id="passwordPrimary"
              type={this.state.showPassword ? 'text' : 'password'}
              onChange={this.handlePassword}
              endAdornment={(
                <InputAdornment position="end">
                  <IconButton aria-label="Toggle password visibility" id="showPasswordPrimaryButton" onClick={this.handleClickShowPassword}>
                    {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )}
            />
          </FormControl>
          <div>
            <FormControl>
              <InputLabel htmlFor="passwordConfirm">Confirm Password</InputLabel>
              <Input
                id="passwordConfirm"
                type={this.state.showPasswordConfirm ? 'text' : 'password'}
                onChange={this.handlePassword}
                error={this.state.mismatch}
                endAdornment={(
                  <InputAdornment position="end">
                    <IconButton aria-label="Toggle password visibility" id="showPasswordConfirmButton" onClick={this.handleClickShowPassword}>
                      {this.state.showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )}
              />
              <FormHelperText htmlFor="passwordConfirm" error={this.state.mismatch}>
                {this.state.mismatch ? 'Passwords do not match' : ''}
              </FormHelperText>
            </FormControl>
          </div>
        </DialogContent>
      )

      return (
        <Dialog open={this.props.openPasswordCreate} onClose={this.props.dispatchCloseDialog}>
          <DialogTitle>{this.props.title}</DialogTitle>
          {innerDialog}
          <DialogActions>
            <Button id="cancelButton" onClick={this.handleClose}>Cancel</Button>
            <Button id="submitButton" onClick={this.handleClose} disabled={this.state.mismatch}>Submit</Button>
          </DialogActions>
        </Dialog>
      )
    }
}

const mapStateToProps = (state) => ({
  message: state.dialog.message,
  openPasswordCreate: state.dialog.openPasswordCreate,
  title: state.dialog.title,
  onDialogClose: closeCreatePasswordDialog,
  onPasswordCreateSubmit: state.dialog.onPasswordCreateSubmit,
})

const mapDispatchToProps = (dispatch) => ({
  dispatchCloseDialog: () => dispatch(closeCreatePasswordDialog()),
})


export default connect(mapStateToProps, mapDispatchToProps)(CreatePasswordDialog)
