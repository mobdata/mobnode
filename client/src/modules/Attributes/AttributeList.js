import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  List, ListItemText, Collapse, Hidden,
} from '@material-ui/core'
import ListItem from '@material-ui/core/ListItem'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { getAttributes, toggleAttributeOpen } from 'modules/Attributes'

class AttributeList extends Component {
  static propTypes = {
    attributes: PropTypes.arrayOf(
      PropTypes.shape({
        attribute: PropTypes.string.isRequired,
        open: PropTypes.bool,
        node_values: PropTypes.arrayOf(PropTypes.shape({
          node_name: PropTypes.string,
          value: PropTypes.string,
        })),
      }),
    ),
    dispatch: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      innerList: PropTypes.shape({}),
    }),
  }

  static defaultProps = {
    attributes: [{
      attribute: 'No attributes found',
      open: false,
      node_values: [
        { node_name: '' },
        { value: '' },
      ],
    }],
    classes: {
      innerList: {
        color: '#FFFEFF',
      },
    },
  }

  listAttribute = (attribute) => (
    <List key={attribute.attribute}>
      <ListItem button divider onClick={() => this.openAttribute(attribute.attribute)}>
        <ListItemText primary={attribute.attribute} />
        <Hidden smDown>
          {attribute.open ? <ExpandLess /> : <ExpandMore />}
        </Hidden>
      </ListItem>
      <Collapse in={attribute.open} timeout="auto" unmountOnExit>
        <List dense>
          {attribute.node_values.map((val) => (
            <ListItem key={val.value}>
              <ListItemText primary={`${val.value}: ${val.nodelist}`} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </List>
  )

  openAttribute(attribute) {
    const { dispatch } = this.props
    dispatch(toggleAttributeOpen(attribute))
  }

  render() {
    return (
      <List
        dense
        subheader="Available Attributes"
        style={{
          padding: '10px',
          height: '100%',
        }}
      >
        {this.props.attributes.map((att) => (
          this.listAttribute(att)
        ))}
      </List>
    )
  }
}

const mapStateToProps = (state) => ({
  attributes: getAttributes(state),
})

export default connect(mapStateToProps)(AttributeList)
