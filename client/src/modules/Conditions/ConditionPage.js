/* eslint-disable max-len */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

import Table from 'components/Table'
import withConditions from 'modules/Conditions/components/ConditionTable'

import {
  getConditions, updateConditions,
} from 'modules/Conditions'

import { openDialog, closeDialog } from 'components/AppDialog'
import { triggerRulesPush } from 'modules/Rule'
import { reloadConditions, toggleNodes } from './condition.actions'
import AppDialog from '../../components/AppDialog'
import AttributeList from '../Attributes/AttributeList'

const ConditionTable = withConditions(Table)

const styles = () => ({
  root: {
    margin: '0em',
  },
  button: {
    padding: '8px',
    margin: '1px',
  },
})

class ConditionPage extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    conditions: PropTypes.arrayOf(
      PropTypes.shape({}),
    ).isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string,
      button: PropTypes.string,
    }),
    unchanged: PropTypes.bool,
    viewnodes: PropTypes.bool,
  }

  static defaultProps = {
    classes: {
      root: '',
      button: '',
    },
    unchanged: true,
    viewnodes: false,
  }

  confirmPushChanges = () => {
    const { dispatch } = this.props
    this.props.dispatch(openDialog(
      'Update Conditions',
      'Are you sure you want to finalize your changes?',
      [{ label: 'Yes, push changes', action: this.pushChanges, focused: true },
        { label: 'Close', action: () => dispatch(closeDialog()) },
        { label: 'Close and discard', action: this.discardChanges }],
      [],
    ))
  }

  pushChanges = () => {
    const { dispatch, conditions } = this.props
    dispatch(updateConditions(conditions))
    triggerRulesPush(dispatch, undefined, undefined, undefined, conditions)
    dispatch(closeDialog())
  }

  confirmDiscardChanges = () => {
    const { dispatch } = this.props
    dispatch(openDialog(
      'Discard Changes',
      'Are you sure you want to discard your changes?',
      [{ label: 'Yes, discard', action: this.discardChanges, focused: true },
        { label: 'Close', action: () => dispatch(closeDialog()) }],
      [],
    ))
  }

  discardChanges = () => {
    const { dispatch } = this.props
    dispatch(reloadConditions())
    dispatch(closeDialog())
  }

  viewNodes = () => {
    const { dispatch, viewnodes } = this.props
    dispatch(toggleNodes(viewnodes))
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <div
          className={classes.root}
          style={
            {
              float: 'left',
              width: '80%',
            }
          }
        >
          <Paper>
            <ConditionTable />
            <AppDialog />
          </Paper>
          <div
            style={{
              padding: '1px',
              borderTop: '5px solid black',
            }}
          >
            <Button variant="contained" color="primary" onClick={this.confirmPushChanges} disabled={this.props.unchanged} className={classes.button}>
              Push Changes
            </Button>
            <Button variant="contained" color="secondary" onClick={this.confirmDiscardChanges} disabled={this.props.unchanged} className={classes.button}>
              Cancel Changes
            </Button>
          </div>
        </div>
        <div
          style={{
            float: 'left',
            width: '18%',
            padding: '1px',
            borderLeft: '5px solid black',
            height: '900px',
          }}
        >
          <AttributeList />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  conditions: getConditions(state),
  unchanged: state.conditions.unchanged,
})

export default withStyles(styles)(connect(mapStateToProps)(ConditionPage))
