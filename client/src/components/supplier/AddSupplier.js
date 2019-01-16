import React, { Component } from 'react';
import TextAreaGroup from '../common/TextAreaGroup';
import InputGroup from '../common/InputGroup';
import {
  createNewAddress,
  createNewBankDetails
} from '../../actions/auxActions';
import { createSupplier } from '../../actions/supplierActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class AddSupplier extends Component {
  constructor() {
    super();
    this.state = {
      companyName: '',
      phoneNumber: '',
      companyRegNr: '',
      notes: '',
      bankDetailsID: '',
      bankName: '',
      accountName: '',
      iban: '',
      swiftCode: '',
      addressID: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      country: '',
      postCode: '',
      errors: {}
    };
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.address.addressID) {
      this.setState({ addressID: nextProps.address.addressID });
    }
    if (nextProps.bankDetails.bankDetailsID) {
      this.setState({ bankDetailsID: nextProps.bankDetails.bankDetailsID });
    }
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    let address = {
      addressLine1: this.state.addressLine1,
      addressLine2: this.state.addressLine2,
      city: this.state.city,
      country: this.state.country,
      postCode: this.state.postCode
    };
    let bankDetails = {
      bankName: this.state.bankName,
      accountName: this.state.accountName,
      iban: this.state.iban,
      swiftCode: this.state.swiftCode
    };
    let supplier = {
      companyName: this.state.companyName,
      companyRegNr: this.state.companyRegNr,
      phoneNumber: this.state.phoneNumber,
      notes: this.state.notes
    };

    Promise.all([
      this.props.createNewAddress(address),
      this.props.createNewBankDetails(bankDetails)
    ])
      .then(() => {
        if (
          this.props.bankDetails.bankDetailsID &&
          this.props.address.addressID
        ) {
          supplier = {
            ...supplier,
            bankDetailsID: this.state.bankDetailsID,
            addressID: this.state.addressID
          };
          this.props.createSupplier(supplier, this.props.history);
        }
      })
      .catch(() => {
        this.props.createSupplier(supplier, null);
      });
  };

  render() {
    const address = this.state.errors.address ? this.state.errors.address : {};
    const bankDetails = this.state.errors.bankDetails
      ? this.state.errors.bankDetails
      : {};
    const supplier = this.state.errors.supplier
      ? this.state.errors.supplier
      : {};

    return (
      <div className="container text-center text-dark">
        <h2>Add Supplier</h2>
        <form onSubmit={this.onSubmit}>
          <h4>Supplier details</h4>
          <div className="row">
            <div className="col-md-12 col-lg-4 mt-3">
              <InputGroup
                value={this.state.companyName}
                name="companyName"
                onChange={this.onChange}
                placeholder="Supplier company name *"
                error={supplier.companyName}
              />
            </div>
            <div className="col-md-12 col-lg-4 mt-3">
              <InputGroup
                name="phoneNumber"
                value={this.state.phoneNumber}
                onChange={this.onChange}
                placeholder="Contact phone number"
              />
            </div>
            <div className="col-md-12 col-lg-4 mt-3">
              <InputGroup
                name="companyRegNr"
                value={this.state.companyRegNr}
                onChange={this.onChange}
                placeholder="Company registration Nr *"
                error={supplier.companyRegNr}
              />
            </div>
            <div className="col-md-12 mt-3">
              <TextAreaGroup
                name="notes"
                value={this.state.notes}
                onChange={this.onChange}
                placeholder="Additional notes about supplier"
              />
            </div>
          </div>
          <h4>Supplier address</h4>
          <div className="row">
            <div className="col-md-12 col-lg-6 mt-3">
              <InputGroup
                name="addressLine1"
                value={this.state.addressLine1}
                onChange={this.onChange}
                placeholder="Address Line 1*"
                error={address.addressLine1}
              />
            </div>
            <div className="col-md-12 col-lg-6 mt-3">
              <InputGroup
                name="addressLine2"
                value={this.state.addressLine2}
                onChange={this.onChange}
                placeholder="Address Line 2"
                error={address.addressLine2}
              />
            </div>
            <div className="col-md-12 col-lg-6 mt-3">
              <InputGroup
                name="city"
                value={this.state.city}
                onChange={this.onChange}
                placeholder="City/Town *"
                error={address.city}
              />
            </div>
            <div className="col-md-12 col-lg-6 mt-3">
              <InputGroup
                name="country"
                value={this.state.country}
                onChange={this.onChange}
                placeholder="Country *"
                error={address.country}
              />
            </div>
            <div className="col-md-12 col-lg-6 mt-3">
              <InputGroup
                name="postCode"
                value={this.state.postCode}
                onChange={this.onChange}
                placeholder="Post Code *"
                error={address.postCode}
              />
            </div>
          </div>
          <h4>Supplier bank details</h4>
          <div className="row">
            <div className="col-md-12 col-lg-6 mt-3">
              <InputGroup
                name="bankName"
                value={this.state.bankName}
                onChange={this.onChange}
                placeholder="Bank Name *"
                error={bankDetails.bankName}
              />
            </div>
            <div className="col-md-12 col-lg-6 mt-3">
              <InputGroup
                name="accountName"
                value={this.state.accountName}
                onChange={this.onChange}
                placeholder="Account Name *"
                error={bankDetails.accountName}
              />
            </div>
            <div className="col-md-12 col-lg-6 mt-3">
              <InputGroup
                name="iban"
                value={this.state.iban}
                onChange={this.onChange}
                placeholder="Account number/IBAN *"
                error={bankDetails.iban}
              />
            </div>
            <div className="col-md-12 col-lg-6 mt-3">
              <InputGroup
                name="swiftCode"
                value={this.state.swiftCode}
                onChange={this.onChange}
                placeholder="Swift Code *"
                error={bankDetails.swiftCode}
              />
            </div>
          </div>
          <small> Fields marked with * are required</small>
          <input type="submit" className="btn btn-info btn-block mt-4" />
        </form>
      </div>
    );
  }
}

AddSupplier.propTypes = {
  errors: PropTypes.object.isRequired,
  address: PropTypes.object.isRequired,
  bankDetails: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  address: state.address,
  bankDetails: state.bankDetails
});

export default connect(
  mapStateToProps,
  { createNewAddress, createNewBankDetails, createSupplier }
)(AddSupplier);
