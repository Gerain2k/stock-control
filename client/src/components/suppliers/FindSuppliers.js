import React, { Component } from 'react';
import axios from 'axios';
import SupplierItem from './SupplierItem';

export default class FindSuppliers extends Component {
  constructor(props) {
    super(props);
    this.state = { suppliers: [], query: '' };
  }
  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onFindClick = () => {
    if (this.state.query.length > 0) {
      axios
        .get(`/api/suppliers/name/${this.state.query}`)
        .then(res => {
          // console.log(res.data.suppliers);
          this.setState({ suppliers: res.data.suppliers });
        })
        .catch(error => {
          console.log(error.response);
        });
      this.setState({ query: '' });
    }
  };

  inputKeyDown = e => {
    if (e.keyCode === 13) this.onFindClick();
  };
  render() {
    let supplierItems;

    if (this.state.suppliers.length < 1) {
      supplierItems = (
        <div className="col-md-12">
          <h4>No results</h4>
        </div>
      );
    } else {
      supplierItems = this.state.suppliers.map(item => (
        <SupplierItem
          key={item.supplierID}
          name={item.companyName}
          phone={item.phoneNumber}
          regNr={item.companyRegNr}
          id={item.supplierID}
        />
      ));
    }

    return (
      <div className="container text-center text-dark">
        <div className="row">
          <div className="col-md-12">
            <h1 className="display-4">Browse suppliers</h1>
            <div className="input-group mb-3">
              <input
                type="text"
                name="query"
                className="form-control"
                placeholder="Enter supplier/s name/s"
                aria-label="Recipient's username"
                value={this.state.query}
                onChange={this.onInputChange}
                aria-describedby="basic-addon2"
                onKeyDown={this.inputKeyDown}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-primary"
                  onClick={this.onFindClick}
                  type="button"
                >
                  Find
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row text-center">{supplierItems}</div>
      </div>
    );
  }
}
