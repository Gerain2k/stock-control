import React, { Component } from 'react';
import addressSchema from '../../schemas/address';
import shopSchema from '../../schemas/shop';
import InputGroup from '../common/InputGroup';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TextAreaGroup from '../common/TextAreaGroup';

export default class AddShop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createShop: true,
      shop: { ...shopSchema },
      address: { ...addressSchema },
      errors: { shopErrors: {}, addressErrors: {} }
    };
  }

  componentDidMount = () => {
    if (this.props.match.params.id) {
      this.setState({ ...this.state, createShop: false });
      axios
        .get(`/api/shop/id/${this.props.match.params.id}`)
        .then(res => {
          let shopData = {
            shop: { ...shopSchema },
            address: { ...addressSchema }
          };
          for (let item in res.data.shop) {
            let splitKey = item.split('.');
            shopData[splitKey[0]][splitKey[1]] =
              res.data.shop[item] === null ? '' : res.data.shop[item];
          }
          this.setState({
            ...this.state,
            shop: { ...shopData.shop },
            address: { ...shopData.address }
          });
        })
        .catch(error => {
          console.error(error.response);
        });
    }
  };

  onChange = e => {
    const targetNames = e.target.name.split('.');
    this.setState({
      [targetNames[0]]: {
        ...this.state[targetNames[0]],
        [targetNames[1]]: e.target.value
      }
    });
  };

  saveAddress = () => {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/addresses', this.state.address)
        .then(res => {
          // console.log(res.data.address);
          res.data.address.addressLine2 =
            res.data.address.addressLine2 === null
              ? ''
              : res.data.address.addressLine2;
          this.setState({
            ...this.state,
            address: res.data.address,
            shop: {
              ...this.state.shop,
              addressID: res.data.address.addressID
            },
            errors: { ...this.state.errors, addressErrors: {} }
          });
          resolve();
        })
        .catch(error => {
          console.log(error);
          this.setState({
            errors: {
              ...this.state.errors,
              addressErrors: error.response.data.errors
            }
          });

          reject(error.response.status);
        });
    });
  };

  updateAddress = () => {
    return new Promise((resolve, reject) => {
      axios
        .put(
          `/api/addresses/${this.state.address.addressID}`,
          this.state.address
        )
        .then(res => {
          // console.log(res.data);
          res.data.address.addressLine2 =
            res.data.address.addressLine2 === null
              ? ''
              : res.data.address.addressLine2;
          this.setState({
            ...this.state,
            address: res.data.address,
            shop: {
              ...this.state.shop,
              addressID: res.data.address.addressID
            },
            errors: { ...this.state.errors, addressErrors: {} }
          });
          resolve();
        })
        .catch(error => {
          console.log(error);
          this.setState({
            errors: {
              ...this.state.errors,
              addressErrors: error.response.data.errors
            }
          });

          reject(error.response.status);
        });
    });
  };

  saveShop = () => {
    axios
      .post('/api/shop', this.state.shop)
      .then(res => {
        this.props.history.push('/shops');
      })
      .catch(error => {
        console.error(error);
        this.setState({
          errors: {
            ...this.state.errors,
            shopErrors: error.response.data.errors
          }
        });
      });
  };
  updateShop = () => {
    axios
      .put(`/api/shop/id/${this.props.match.params.id}`, this.state.shop)
      .then(res => {
        this.props.history.push('/shops');
      })
      .catch(error => {
        console.error(error);
      });
  };

  onSaveClick = () => {
    this.saveAddress()
      .then(() => {
        this.saveShop();
      })
      .catch(error => {
        this.saveShop();
      });
  };

  onEditClick = () => {
    if (this.state.shop.addressID === '') {
      this.saveAddress()
        .then(() => {
          this.updateShop();
        })
        .catch(() => {
          this.updateShop();
        });
    } else {
      this.updateAddress()
        .then(() => {
          this.updateShop();
        })
        .catch(() => {
          this.updateShop();
        });
    }
  };

  onDeleteClick = () => {
    axios
      .delete(`/api/shop/${this.props.match.params.id}`)
      .then(() => {
        this.props.history.push('/shops');
      })
      .catch(error => {
        console.log(error);
      });
  };

  onNewAddress = () => {
    this.setState({
      ...this.state,
      shop: { ...this.state.shop, addressID: '' },
      address: { ...addressSchema }
    });
  };

  render() {
    const { shop, address } = this.state;
    const { shopErrors, addressErrors } = this.state.errors;
    let controllButtons;
    if (this.state.createShop) {
      controllButtons = (
        <div className="col-sm-12">
          <Link to="/shops" className="btn btn-lg btn-warning mr-3">
            Cancel
          </Link>
          <button
            type="button"
            onClick={this.onSaveClick}
            className="btn btn-lg btn-primary mr-3"
          >
            Save
          </button>
        </div>
      );
    } else {
      controllButtons = (
        <div className="col-sm-12">
          <Link to="/shops" className="btn btn-lg btn-warning mr-3">
            Cancel
          </Link>
          <button
            type="button"
            onClick={this.onEditClick}
            className="btn btn-lg btn-primary mr-3"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={this.onDeleteClick}
            className="btn btn-lg btn-danger mr-3"
          >
            Delete
          </button>
        </div>
      );
    }

    return (
      <div className="container text-center text-dark">
        <h2>{this.state.createShop ? 'Add Shop' : 'Edit shop data'}</h2>

        <h3>Shop details</h3>
        <div className="row">
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              value={shop.shopName}
              name="shop.shopName"
              onChange={this.onChange}
              placeholder="Shop name *"
              error={shopErrors.shopName}
            />
          </div>
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              value={shop.phoneNumber}
              name="shop.phoneNumber"
              onChange={this.onChange}
              placeholder="Shop phone number *"
              error={shopErrors.phoneNumber}
            />
          </div>
          <div className="col-md-12 mt-3">
            <TextAreaGroup
              name="shop.notes"
              value={shop.notes}
              onChange={this.onChange}
              placeholder="Additional notes"
            />
          </div>
        </div>
        <h3>Employee address</h3>
        <div className="row">
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              name="address.addressLine1"
              value={address.addressLine1}
              onChange={this.onChange}
              placeholder="Address Line 1*"
              error={addressErrors.addressLine1}
            />
          </div>
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              name="address.addressLine2"
              value={address.addressLine2}
              onChange={this.onChange}
              placeholder="Address Line 2"
              error={addressErrors.addressLine2}
            />
          </div>
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              name="address.city"
              value={address.city}
              onChange={this.onChange}
              placeholder="City/Town *"
              error={addressErrors.city}
            />
          </div>
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              name="address.country"
              value={address.country}
              onChange={this.onChange}
              placeholder="Country *"
              error={addressErrors.country}
            />
          </div>
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              name="address.postCode"
              value={address.postCode}
              onChange={this.onChange}
              placeholder="Post Code *"
              error={addressErrors.postCode}
            />
          </div>
          {this.state.createShop ? (
            ''
          ) : (
            <div className="col-md-12 col-lg-6 mt-3 ">
              <button
                type="button"
                onClick={this.onNewAddress}
                className="btn btn-lg btn-secondary float-left"
              >
                New Address
              </button>
            </div>
          )}
        </div>
        <small> Fields marked with * are required</small>
        <div className="row mt-3">{controllButtons}</div>
      </div>
    );
  }
}
