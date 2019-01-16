import React, { Component } from 'react';
import productSchema from '../../schemas/product';
import axios from 'axios';
import InputGroup from '../common/InputGroup';
import TextAreaGroup from '../common/TextAreaGroup';
import { Link } from 'react-router-dom';

export default class EditProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      product: { ...productSchema },
      errors: {}
    };
  }

  componentDidMount = () => {
    axios
      .get(`/api/product/id/${this.props.match.params.id}`)
      .then(res => {
        this.setState({ product: res.data.product });
      })
      .catch(error => {
        console.error(error);
        this.props.history.push('/');
      });
  };

  onChange = e => {
    if (e.target.validity.valid) {
      this.setState({
        product: { ...this.state.product, [e.target.name]: e.target.value }
      });
    }
  };

  onClickSave = () => {
    axios
      .put(`/api/product/id/${this.props.match.params.id}`, this.state.product)
      .then(res => {
        this.props.history.push('/product/browse');
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    return (
      <div>
        <div className="container text-center text-dark">
          <h1 className="display-4">Browse product</h1>
          <div className="row mt-4">
            <div className="col-md-6 col-lg-6">
              <InputGroup
                value={this.state.product.barcode.toString()}
                name="barcode"
                onChange={this.onChange}
                placeholder="Barcode"
                pattern="[0-9]*"
                error={this.state.errors.barcode}
              />
            </div>
            <div className="col-md-6 col-lg-6">
              <InputGroup
                value={this.state.product.description}
                name="description"
                onChange={this.onChange}
                placeholder="Name"
                error={this.state.errors.description}
              />
            </div>
            <div className="col-md-12 mt-3">
              <TextAreaGroup
                name="notes"
                value={this.state.product.notes}
                onChange={this.onChange}
                placeholder="Additional notes"
              />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-6 col-lg-6 mt-3 ">
              <Link to="/product/browse" className="btn btn-lg btn-warning">
                Cancel
              </Link>
            </div>
            <div className="col-md-6 col-lg-6 mt-3 ">
              <button
                type="button"
                onClick={this.onClickSave}
                className="btn btn-lg btn-primary"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
