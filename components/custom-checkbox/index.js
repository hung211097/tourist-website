import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from 'pretty-checkbox-react'

class CustomCheckbox extends React.Component {
  displayName = 'Custom Checkbox'

  static propTypes = {
    item: PropTypes.object,
    onCheck: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      isCheck: this.props.item.isCheck
    }
  }

  handleChange(){
    const { item } = this.props
    this.setState({
      isCheck: !this.state.isCheck
    }, () => {
      this.props.onCheck && this.props.onCheck(item.value, this.state.isCheck)
    })
  }

  render() {
    return (
      <Checkbox animation="smooth" shape="curve" color="primary-o" checked={this.state.isCheck} onChange={this.handleChange.bind(this)}>
        {this.props.item.label}
      </Checkbox>
    )
  }
}

export default CustomCheckbox
