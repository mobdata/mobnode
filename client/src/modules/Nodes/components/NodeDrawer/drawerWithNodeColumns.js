import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Toolbar from '@material-ui/core/Toolbar'
import Divider from '@material-ui/core/Divider'
import slugify from 'slugify'

import {
  openDialog, closeDialog,
} from 'components/AppDialog'
import AddColumnForm from 'modules/Nodes/components/AddColumnForm'
import { closeDrawer } from 'components/AppDrawer'
import {
  changeColumns,
  changeColumnOrder,
  changeColumnWidths,
} from 'components/Table'

const styles = () => ({
  chevronIcon: {
    marginLeft: -18,
  },
  addColumnForm: {
    margin: '0em 2em 2em 2em',
    display: 'flex',
    flexDirection: 'column',
  },
})

const drawerWithNodeColumns = (WrappedComponent) => {
  class NodeDrawer extends Component {
    static propTypes = {
      dispatch: PropTypes.func.isRequired,
      anchor: PropTypes.string,
      open: PropTypes.bool.isRequired,
      columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      columnOrder: PropTypes.arrayOf(PropTypes.string).isRequired,
      columnWidths: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      classes: PropTypes.shape({
        chevronIcon: PropTypes.string,
        addColumnForm: PropTypes.string,
      }),
    }

    static defaultProps = {
      anchor: 'left',
      classes: {
        chevronIcon: '',
        addColumnForm: '',
      },
    }

    onCloseDrawer = () => this.props.dispatch(closeDrawer('NodeDrawer'))

    // returns a boolean value for the form to check whether creation was successful
    addColumn = (columnName) => {
      const { dispatch } = this.props
      const formattedName = slugify(columnName, {
        replacement: '_',
        lower: true,
      })
      const oldColumnNames = this.props.columns.map((col) => col.name)
      if (oldColumnNames.includes(formattedName)) {
        dispatch(openDialog(
          'Error Updating Columns:',
          'That column already exists.',
          [{ label: 'Close', action: () => dispatch(closeDialog()), focused: true }],
          [`"${formattedName}" / "${columnName}"`],
        ))
        return false
      }

      const newColumnOrder = [
        ...this.props.columnOrder
          .filter((name) => name !== 'created_on' && name !== 'updated_on'),
        formattedName,
        'created_on',
        'updated_on',
      ]
      const columns = [
        ...this.props.columns,
        { name: formattedName, title: columnName, editable: true },
      ]
      dispatch(changeColumnWidths('NodeTable', this.props.columnWidths
        .concat([{ columnName: formattedName, width: 180 }])))
      dispatch(changeColumnOrder('NodeTable', newColumnOrder))
      dispatch(changeColumns('NodeTable', columns))
      // dispatch(closeDrawer('NodeDrawer'))
      return true
    }

    render() {
      const { classes } = this.props

      return (
        <WrappedComponent
          anchor={this.props.anchor}
          open={this.props.open}
          onBackdropClick={this.onCloseDrawer}
          onEscapeKeyDown={this.onCloseDrawer}
        >
          <Toolbar>
            <IconButton
              onClick={this.onCloseDrawer}
              className={classes.chevronIcon}
            >
              <ChevronRightIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <Toolbar>
            <Typography type="headline">
              Add Column
            </Typography>
          </Toolbar>
          <div>
            <AddColumnForm
              className={classes.addColumnForm}
              onSubmit={this.addColumn}
              columns={this.props.columns.map((column) => column.name)}
            />
          </div>
        </WrappedComponent>
      )
    }
  }

  const mapStateToProps = (state) => ({
    columns: state.nodeTable.columns,
    columnOrder: state.nodeTable.columnOrder,
    columnWidths: state.nodeTable.columnWidths,
    hiddenColumns: state.nodeTable.hiddenColumns,
    open: state.nodeDrawer.open,
  })

  return withStyles(styles)(connect(mapStateToProps)(NodeDrawer))
}

export default drawerWithNodeColumns
