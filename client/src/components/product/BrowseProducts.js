import React, { Component } from 'react';
import axios from 'axios';
import Spinner from '../common/Spinner';
import ProductItem from './ProductItem';

export default class BrowseProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      loading: true,
      error: '',
      search: {
        name: '',
        barcode: ''
      }
    };
  }

  componentDidMount() {
    axios
      .get('/api/product')
      .then(res => {
        this.setState({ loading: false, products: [...res.data.products] });
      })
      .catch(error => {
        console.error(error);
        this.setState({
          loading: false,
          error: 'Problem connecting to database'
        });
      });
  }

  onSearchChange = e => {
    if (e.target.validity.valid) {
      this.setState({
        search: { ...this.state.search, [e.target.name]: e.target.value }
      });
    }
  };

  onSearchKeyDown = e => {
    if (e.target.value !== '' && e.charCode === 13) {
      this.onSearch(e.target.name, e.target.value);
      e.target.value = '';
    }
  };

  onSearch = (name, value) => {
    this.setState({ loading: true });
    axios
      .get(`/api/product/${name}/${value}`)
      .then(res => {
        this.setState({
          loading: false,
          products: [...res.data.products],
          search: { ...this.state.search, [name]: '' }
        });
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  };

  render() {
    let productList;
    let tableContent = this.state.products.map(item => (
      <ProductItem
        key={item.productID}
        barcode={item.barcode}
        name={item.description}
        notes={item.notes}
        productID={item.productID}
        history={this.props.history}
      />
    ));
    if (this.state.loading) {
      productList = (
        <div className="col-md-12">
          <Spinner />
        </div>
      );
    } else {
      if (this.state.products.length > 0) {
        productList = (
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">Barcode</th>
                <th scope="col">Name</th>
                <th scope="col">Quantity</th>
              </tr>
            </thead>
            <tbody>{tableContent}</tbody>
          </table>
        );
      } else {
        productList = <p>Sorry there are no products in database</p>;
      }
    }

    return (
      <div className="container text-center text-dark">
        <h1 className="display-4">Browse products</h1>
        <div className="row mt-4">
          <div className="col-md-6 col-lg-4 offset-lg-4">
            <div className="input-group mb-3">
              <input
                value={this.state.search.barcode}
                type="text"
                className="form-control"
                placeholder="Find by barcode"
                pattern="[0-9]*"
                name="barcode"
                onChange={this.onSearchChange}
                onKeyPress={this.onSearchKeyDown}
              />
              <div className="input-group-append">
                <button
                  onClick={e => {
                    if (this.state.search.barcode !== '') {
                      this.onSearch('barcode', this.state.search.barcode);
                    }
                  }}
                  className="input-group-text"
                  id="basic-addon2"
                >
                  <i className="fas fa-search" />
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="input-group mb-3">
              <input
                type="text"
                value={this.state.search.name}
                className="form-control"
                placeholder="Find by description"
                name="name"
                onChange={this.onSearchChange}
                onKeyPress={this.onSearchKeyDown}
              />
              <div className="input-group-append">
                <button
                  onClick={e => {
                    if (this.state.name !== '') {
                      this.onSearch('name', this.state.search.name);
                    }
                  }}
                  className="input-group-text"
                  id="basic-addon2"
                >
                  <i className="fas fa-search" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="row mt-4">{productList}</div>
          </div>
        </div>
      </div>
    );
  }
}
