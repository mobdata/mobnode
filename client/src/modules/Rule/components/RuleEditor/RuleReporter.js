import React from 'react'
import PropTypes from 'prop-types'

const styles = {
  root: {
    backgroundColor: '#212121',
    margin: 0,
    fontSize: 16,
    position: 'relative',
    bottom: 50,
  },
  errorMessage: {
    color: 'red',
    margin: 70,
    padding: 25,
  },
  stdMessage: {
    color: '#29FD2F',
    margin: 70,
    padding: 25,
  },
}

const RuleReporter = (props) => (
  <div style={styles.root}>
    {props.message
      ? <p style={styles.errorMessage}>{props.message}</p>
      : <p style={styles.stdMessage}>Script parsed successfully. No syntax errors found.</p>}
  </div>
)

RuleReporter.propTypes = {
  message: PropTypes.string,
}

RuleReporter.defaultProps = {
  message: '',
}

export default RuleReporter
