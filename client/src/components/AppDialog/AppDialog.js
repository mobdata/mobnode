import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'


const AppDialog = (props) => {
  const actions = [
    ...props.actions,
  ]
  // check to see if the dialog has basic close option, supply that as onBackgroundClick
  const simpleClose = actions.find((action) => action.label === 'Close')
  const backClick = (typeof simpleClose !== 'undefined') ? simpleClose.action : null
  const { list } = props

  // generate the message and any listed content, using the unicode bullet in front of list items
  const innerDialog = list.length > 0
    ? (
      <DialogContent>
        <DialogContentText>{props.message}</DialogContentText>
        <List>
          {props.list.map((item) => (
            <ListItem key={item}>
              {'\u2022 '}
              {item}
            </ListItem>
          ))}
        </List>
      </DialogContent>
    ) : (
      <DialogContent>
        <DialogContentText>{props.message}</DialogContentText>
      </DialogContent>
    )

  return (
    <Dialog open={props.open} onBackdropClick={backClick} onEscapeKeyDown={backClick}>
      <DialogTitle>{props.title}</DialogTitle>
      {innerDialog}
      <DialogActions>
        {actions.map(({ action, label, focused }) => (
          <Button onClick={action} key={label} autoFocus={focused} focusRipple variant={focused ? 'outlined' : 'text'}>{label}</Button>
        ))}
      </DialogActions>
    </Dialog>
  )
}

AppDialog.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      action: PropTypes.func,
      label: PropTypes.string,
    }),
  ),
  message: PropTypes.string.isRequired,
  open: PropTypes.bool,
  title: PropTypes.string,
  list: PropTypes.arrayOf(PropTypes.string),
}

AppDialog.defaultProps = {
  actions: [],
  title: 'MobNode Alert',
  list: [],
  open: false,
}

const mapStateToProps = (state) => ({
  actions: state.dialog.actions,
  message: state.dialog.message,
  open: state.dialog.open,
  title: state.dialog.title,
  list: state.dialog.list,
})

export default connect(mapStateToProps)(AppDialog)
