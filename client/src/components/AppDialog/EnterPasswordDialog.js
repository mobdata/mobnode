import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import { closeEnterPasswordDialog } from 'components/AppDialog'
import Dialog from '@material-ui/core/Dialog'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

class EnterPasswordDialog extends Component {
    static propTypes = {
      message: PropTypes.string.isRequired,
      dispatchCloseDialog: PropTypes.func.isRequired,
      openPasswordEnter: PropTypes.bool,
      onPasswordEnterSubmit: PropTypes.func,
      title: PropTypes.string,
    }

    static defaultProps = {
      title: 'MobNode Alert',
      openPasswordEnter: false,
      onPasswordEnterSubmit: null,
    }

    constructor(props) {
      super(props)
      this.state = {
        showPassword: false,
        password: '',
        error: false,
      }
    }


    handlePassword = (e) => {
      this.setState(({ password: e.target.value }))
    }

    handleClickShowPassword = () => {
      this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
    }


    handleClose = () => {
      /*
        Setting properties to null, otherwise they would appear the next time the dialog was opened.
        */
      let success = false
      success = this.props.onPasswordEnterSubmit(this.state.password)
      if (success) {
        this.setState(({ password: null }))
        this.setState(({ showPassword: false }))
        this.setState(({ error: false }))
        this.props.dispatchCloseDialog()
      } else {
        this.setState({ error: true })
      }
    }

    render() {
      if (!this.props.openPasswordEnter) {
        return null
      }

      const innerDialog =            (
        <DialogContent>
          <DialogContentText>{this.props.message}</DialogContentText>
          <FormControl>
            <Input
              id="password"
              type={this.state.showPassword ? 'text' : 'password'}
              onChange={this.handlePassword}
              endAdornment={(
                <InputAdornment position="end">
                  <IconButton aria-label="Toggle password visibility" onClick={this.handleClickShowPassword}>
                    {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )}
            />
            <FormHelperText htmlFor="password" error={this.state.error}>
              {this.state.error ? 'Password is incorrect' : ''}
            </FormHelperText>
          </FormControl>
        </DialogContent>
      )

      return (
        <Dialog open={this.props.openPasswordEnter} onClose={this.props.dispatchCloseDialog}>
          <DialogTitle>{this.props.title}</DialogTitle>
          {innerDialog}
          <DialogActions>
            <Button id="CancelButton" onClick={this.handleClose}>Cancel</Button>
            <Button id="SubmitButton" onClick={this.handleClose}>Submit</Button>
          </DialogActions>
        </Dialog>
      )
    }
}

const mapStateToProps = (state) => ({
  message: state.dialog.message,
  openPasswordEnter: state.dialog.openPasswordEnter,
  title: state.dialog.title,
  onDialogClose: closeEnterPasswordDialog,
  onPasswordEnterSubmit: state.dialog.onPasswordEnterSubmit,
})

const mapDispatchToProps = (dispatch) => ({
  dispatchCloseDialog: () => dispatch(closeEnterPasswordDialog()),
})


export default connect(mapStateToProps, mapDispatchToProps)(EnterPasswordDialog)
