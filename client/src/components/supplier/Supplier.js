import React, { Component } from 'react';
import axios from 'axios';
import InputGroup from '../common/InputGroup';
import TextAreaGroup from '../common/TextAreaGroup';
import { Link } from 'react-router-dom';

class Supplier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supplier: {
        accountName: '',
        addressID: '',
        addressLine1: '',
        addressLine2: '',
        bankDetailsID: '',
        bankName: '',
        city: '',
        companyName: '',
        companyRegNr: '',
        country: '',
        iban: '',
        notes: '',
        phoneNumber: '',
        postCode: '',
        supplierID: '',
        swiftCode: ''
      },
      errors: {
        address: {},
        bankDetails: {},
        supplier: {}
      }
    };
  }

  componentWillMount = () => {
    let supplierID = this.props.match.params.id;
    axios
      .get(`/api/suppliers/${supplierID}`)
      .then(res => {
        Object.keys(res.data.supplier).map(key => {
          res.data.supplier[key] =
            res.data.supplier[key] === null ? '' : res.data.supplier[key];
          return [];
        });

        this.setState({ ...res.data });
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  onInputChange = e => {
    this.setState({
      supplier: { ...this.state.supplier, [e.target.name]: e.target.value }
    });
  };

  onEditClick = () => {
    const supplier = this.state.supplier;
    const supplierData = {
      companyName: supplier.companyName,
      phoneNumber: supplier.phoneNumber,
      companyRegNr: supplier.companyRegNr,
      notes: supplier.notes,
      addressID: supplier.addressID,
      bankDetailsID: supplier.bankDetailsID
    };
    const addressData = {
      addressLine1: supplier.addressLine1,
      addressLine2: supplier.addressLine2,
      city: supplier.city,
      country: supplier.country,
      postCode: supplier.postCode
    };
    const bankDetailsData = {
      bankName: supplier.bankName,
      accountName: supplier.accountName,
      iban: supplier.iban,
      swiftCode: supplier.swiftCode
    };
    axios
      .put(`/api/suppliers/${supplier.supplierID}`, supplierData)
      .then(res => {
        this.setState({ errors: { ...this.state.errors, supplier: {} } });
      })
      .catch(error => {
        this.setState({
          errors: { ...this.state.errors, supplier: error.response.data.errors }
        });
      });
    axios
      .put(`/api/addresses/${supplier.addressID}`, addressData)
      .then(res => {
        this.setState({ errors: { ...this.state.errors, address: {} } });
      })
      .catch(error => {
        this.setState({
          errors: { ...this.state.errors, address: error.response.data.errors }
        });
      });
    axios
      .put(`/api/bankdetails/${supplier.bankDetailsID}`, bankDetailsData)
      .then(res => {
        this.setState({ errors: { ...this.state.errors, bankDetails: {} } });
      })
      .catch(error => {
        this.setState({
          errors: {
            ...this.state.errors,
            bankDetails: error.response.data.errors
          }
        });
      });
  };
  onDeleteClick = () => {
    axios
      .delete(`/api/suppliers/${this.state.supplier.supplierID}`)
      .then(res => {
        this.props.history.push('/suppliers');
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const supplierError = this.state.errors.supplier;
    const addressError = this.state.errors.address;
    const bankDetailsError = this.state.errors.bankDetails;
    const supplier = this.state.supplier;
    return (
      <div className="container text-center text-dark">
        <h2>{supplier.companyName}</h2>
        <h3>Supplier details</h3>
        <div className="row">
          <div className="col-md-12 col-lg-4 mt-3">
            <InputGroup
              value={supplier.companyName}
              name="companyName"
              onChange={this.onInputChange}
              placeholder="Supplier company name *"
              error={supplierError.companyName}
            />
          </div>
          <div className="col-md-12 col-lg-4 mt-3">
            <InputGroup
              value={supplier.phoneNumber}
              name="phoneNumber"
              onChange={this.onInputChange}
              placeholder="Supplier Phone Nr"
              error={supplierError.phoneNumber}
            />
          </div>
          <div className="col-md-12 col-lg-4 mt-3">
            <InputGroup
              value={supplier.companyRegNr}
              name="companyRegNr"
              onChange={this.onInputChange}
              placeholder="Company registration Nr *"
              error={supplierError.companyRegNr}
            />
          </div>
          <div className="col-md-12 mt-3">
            <TextAreaGroup
              name="notes"
              value={supplier.notes}
              onChange={this.onInputChange}
              placeholder="Additional notes about supplier"
            />
          </div>
        </div>
        <h3>Supplier Address</h3>
        <div className="row">
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              value={supplier.addressLine1}
              name="addressLine1"
              onChange={this.onInputChange}
              placeholder="Address Line 1*"
              error={addressError.addressLine1}
            />
          </div>
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              value={supplier.addressLine2}
              name="addressLine2"
              onChange={this.onInputChange}
              placeholder="Address Line 2"
              error={addressError.addressLine2}
            />
          </div>
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              value={supplier.city}
              name="city"
              onChange={this.onInputChange}
              placeholder="City/Town*"
              error={addressError.city}
            />
          </div>
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              value={supplier.country}
              name="country"
              onChange={this.onInputChange}
              placeholder="Country*"
              error={addressError.country}
            />
          </div>
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              value={supplier.postCode}
              name="postCode"
              onChange={this.onInputChange}
              placeholder="Post Code*"
              error={addressError.postCode}
            />
          </div>
        </div>
        <h3>Supplier Bank Details</h3>
        <div className="row">
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              value={supplier.bankName}
              name="bankName"
              onChange={this.onInputChange}
              placeholder="Bank Name*"
              error={bankDetailsError.bankName}
            />
          </div>
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              value={supplier.accountName}
              name="accountName"
              onChange={this.onInputChange}
              placeholder="Bank Name*"
              error={bankDetailsError.accountName}
            />
          </div>
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              value={supplier.iban}
              name="iban"
              onChange={this.onInputChange}
              placeholder="Bank Name*"
              error={bankDetailsError.iban}
            />
          </div>
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              value={supplier.swiftCode}
              name="swiftCode"
              onChange={this.onInputChange}
              placeholder="Bank Name*"
              error={bankDetailsError.swiftCode}
            />
          </div>
        </div>
        <Link to="/suppliers" className="btn btn-lg btn-secondary mr-3">
          Back
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
          className="btn btn-lg btn-danger"
        >
          Delete
        </button>
      </div>
    );
  }
}

export default Supplier;
