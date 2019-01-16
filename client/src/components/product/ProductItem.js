import React, { Component } from 'react';

export default class ProductItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hightlight: false
    };
  }
  render() {
    return (
      <tr
        onClick={e =>
          this.props.history.push(`/product/id/${this.props.productID}`)
        }
        onMouseOver={() => {}}
      >
        <td>{this.props.barcode}</td>
        <td>{this.props.name}</td>
        <td>{this.props.notes}</td>
      </tr>
    );
  }
}
