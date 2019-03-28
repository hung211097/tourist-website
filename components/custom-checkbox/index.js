import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox } from 'pretty-checkbox-react'

class CustomCheckbox extends React.Component {
  displayName = 'Custom Checkbox'

  static propTypes = {
    item: PropTypes.object,
    onCheck: PropTypes.func,
    isNormal: PropTypes.bool,
    isCheck: PropTypes.bool,
    content: PropTypes.string
  }

  static defaultProps = {
    item: null,
    isNormal: true,
    content: ''
  }

  constructor(props) {
    super(props)
    this.state = {
      isCheck: this.props.isCheck ? this.props.isCheck : this.props.item ? this.props.item.isCheck : false
    }
  }

  handleChange(){
    this.setState({
      isCheck: !this.state.isCheck
    }, () => {
      if(this.props.isNormal){
        this.props.onCheck && this.props.onCheck(this.state.isCheck)
      }
      else{
        const { item } = this.props
        this.props.onCheck && this.props.onCheck(item.value, this.state.isCheck)
      }
    })
  }

  render() {
    return (
      <Checkbox animation="smooth" shape="curve" color="primary-o" checked={this.state.isCheck} onChange={this.handleChange.bind(this)}>
        <span>
          {this.props.item ? this.props.item.label : this.props.content}
        </span>
      </Checkbox>
    )
  }
}

export default CustomCheckbox
