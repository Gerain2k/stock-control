import React, { Component } from 'react';
import SelectInputGroupe from '../common/SelectInputGroupe';
import { apiGetRequest } from '../../helpers/api';
import shopSchema from '../../schemas/shop';
import InputGroup from '../common/InputGroup';

export default class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shops: [],
      stock: [],
      selectedShop: { ...shopSchema },
      errors: {}
    };
  }

  componentDidMount = async () => {
    let result = {};
    try {
      result.data = await apiGetRequest('/api/shop');
    } catch (e) {
      result.error = e;
    }
    if (result.data) {
      this.setState({ shops: result.data.shops });
    }
  };

  onChange = async e => {
    const targetNames = e.target.name.split('.');
    const value = e.target.value;
    if (targetNames[2]) {
      this.setState(state => {
        let array = state[targetNames[0]];
        array[targetNames[2]][targetNames[1]] = Number(value);
        return {
          ...state,
          [targetNames[0]]: array
        };
      });
    } else {
      await this.setState({
        [targetNames[0]]: {
          ...this.state[targetNames[0]],
          [targetNames[1]]: e.target.value
        }
      });
    }

    if (targetNames[0] === 'selectedShop') {
      apiGetRequest(`/api/stock/shop/${this.state.selectedShop.shopID}`)
        .then(res => {
          const stock = res.stock;
          this.setState({ stock: stock });
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  render() {
    let shopList = [];

    for (let item in this.state.shops) {
      shopList[item] = {
        name: this.state.shops[item].ShopName,
        value: this.state.shops[item].ShopID
      };
    }
    const tableContent = this.state.stock.map((item, index) => {
      const quantity = `stock.Quantity.${index}`;
      const price = `stock.PricePerUnit.${index}`;
      return (
        <tr key={`tablerow_${index}`}>
          <th scope="row">{index + 1}</th>
          <td>{item.Barcode}</td>
          <td>{item.Description}</td>
          <td>
            <InputGroup
              value={this.state.stock[index].Quantity.toString()}
              name={quantity}
              onChange={this.onChange}
              placeholder="Quantity"
              error={''}
            />
          </td>
          <td>
            <InputGroup
              value={this.state.stock[index].PricePerUnit.toString()}
              name={price}
              onChange={this.onChange}
              placeholder="Price"
              error={''}
            />
          </td>
        </tr>
      );
    });

    return (
      <div className="container text-center">
        <h1>Stock</h1>
        <div className="row">
          <div className="col-md-12 col-lg-12 mt-3">
            <SelectInputGroupe
              label="SELECT SHOP:"
              options={shopList}
              name="selectedShop.shopID"
              value={this.state.selectedShop.shopID}
              onChange={this.onChange}
              error={''}
            />
          </div>
          <div className="col-md-12">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Barcode</th>
                  <th scope="col">Description</th>
                  <th scope="col" style={{ width: '20%' }}>
                    Quantity
                  </th>
                  <th scope="col" style={{ width: '20%' }}>
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>{tableContent}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
