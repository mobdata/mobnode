import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  Button, FormControl, FormHelperText, Input, InputLabel,
} from '@material-ui/core'

const styles = () => ({
  flex: {
    flex: 1,
  },
  field: {
    marginBottom: '2em',
  },
})

class AddColumnForm extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      flex: PropTypes.string,
      field: PropTypes.string,
    }),
    className: PropTypes.string,
  }

  static defaultProps = {
    classes: {
      flex: '',
      field: '',
    },
    className: '',
  }

  constructor(props) {
    super(props)
    this.state = {
      columnName: '',
      error: false,
      justCreated: false,
    }
  }

  onChange = (event) => {
    const { name, value } = event.target
    this.setState({ [name]: value, error: false, justCreated: false })
  }

  onSubmit = () => {
    const { error }  = this.state

    if (!error) {
      const { columnName } = this.state

      if (!columnName) {
        this.setState({ error: true })
      } else {
        const created = this.props.onSubmit(columnName)
        this.setState({ columnName: '', justCreated: created })
      }
    }
  }

  render() {
    const { classes } = this.props
    const { error, columnName, justCreated } = this.state

    return (
      <div className={this.props.className}>
        <FormControl required className={classes.field} error={error}>
          <InputLabel
            htmlFor="columnName"
            className={classes.flex}
          >
            Column Name
          </InputLabel>
          <Input
            name="columnName"
            value={columnName}
            onChange={this.onChange}
            className={classes.flex}
          />
          {error && <FormHelperText>This field is required</FormHelperText>}
        </FormControl>
        <Button raised="true" color="primary" autoFocus onClick={this.onSubmit}>
          Create Column
        </Button>
        { justCreated && (<span>Column created successfully!</span>)}
      </div>
    )
  }
}

export default withStyles(styles)(AddColumnForm)
