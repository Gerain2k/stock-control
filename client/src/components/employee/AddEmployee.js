import React, { Component } from 'react';
import InputGroup from '../common/InputGroup';
import employeeSchema from '../../schemas/employee';
import addressSchema from '../../schemas/address';
import bankDetailsSchema from '../../schemas/bankdetails';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

export default class AddEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createEmployee: true,
      employee: { ...employeeSchema },
      address: { ...addressSchema },
      bankDetails: { ...bankDetailsSchema },
      errors: { employeeErrors: {}, addressErrors: {}, bankDetailsErrors: {} }
    };
  }

  componentDidMount = () => {
    if (this.props.match.params.id) {
      this.setState({ ...this.state, createEmployee: false });
      axios
        .get(`/api/employee/${this.props.match.params.id}`)
        .then(res => {
          if (!res.data.employee) {
            this.props.history.push('/misc');
            return;
          }
          let data = {
            employee: { ...employeeSchema },
            bankdetails: { ...bankDetailsSchema },
            address: { ...addressSchema }
          };
          for (let item in res.data.employee) {
            let splitKey = item.split('.');
            data[splitKey[0]][splitKey[1]] =
              res.data.employee[item] === null ? '' : res.data.employee[item];
          }
          data.employee.dateOfBirth = moment(data.employee.dateOfBirth).format(
            'YYYY-MM-DD'
          );
          this.setState({
            ...this.state,
            employee: data.employee,
            address: data.address,
            bankDetails: data.bankdetails
          });
        })
        .catch(error => {
          console.error(error);
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
  saveBankDetails = () => {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/bankdetails/', this.state.bankDetails)
        .then(res => {
          this.setState({
            ...this.state,
            bankDetails: res.data.bankDetails,
            employee: {
              ...this.state.employee,
              bankDetailsID: res.data.bankDetails.bankDetailsID
            },
            errors: { ...this.state.errors, bankDetailsErrors: {} }
          });
          resolve();
        })
        .catch(error => {
          this.setState({
            errors: {
              ...this.state.errors,
              bankDetailsErrors: error.response.data.errors
            }
          });
          reject(error.response.status);
        });
    });
  };

  updateBankDetails = () => {
    return new Promise((resolve, reject) => {
      axios
        .put(
          `/api/bankdetails/${this.state.bankDetails.bankDetailsID}`,
          this.state.bankDetails
        )
        .then(res => {
          this.setState({
            ...this.state,
            bankDetails: res.data.bankDetails,
            employee: {
              ...this.state.employee,
              bankDetailsID: res.data.bankDetails.bankDetailsID
            },
            errors: { ...this.state.errors, bankDetailsErrors: {} }
          });
          resolve();
        })
        .catch(error => {
          this.setState({
            errors: {
              ...this.state.errors,
              bankDetailsErrors: error.response.data.errors
            }
          });
          reject(error.response.status);
        });
    });
  };

  saveAddress = () => {
    return new Promise((resolve, reject) => {
      axios
        .post('/api/addresses', this.state.address)
        .then(res => {
          console.log(res.data.address);
          res.data.address.addressLine2 =
            res.data.address.addressLine2 === null
              ? ''
              : res.data.address.addressLine2;
          this.setState({
            ...this.state,
            address: res.data.address,
            employee: {
              ...this.state.employee,
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
          console.log(res.data);
          res.data.address.addressLine2 =
            res.data.address.addressLine2 === null
              ? ''
              : res.data.address.addressLine2;
          this.setState({
            ...this.state,
            address: res.data.address,
            employee: {
              ...this.state.employee,
              addressID: res.data.address.addressID
            },
            errors: { ...this.state.errors, addressErrors: {} }
          });
          resolve();
        })
        .catch(error => {
          console.error(error);
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

  saveEmployee = () => {
    const employee = this.state.employee;
    axios
      .post('/api/employee/', employee)
      .then(res => {
        this.props.history.push('/misc');
      })
      .catch(error => {
        this.setState({
          errors: {
            ...this.state.errors,
            employeeErrors: error.response.data.errors
          }
        });
      });
  };

  updateEmployee = () => {
    console.log('update employee');
    axios
      .put(
        `/api/employee/${this.state.employee.employeeID}`,
        this.state.employee
      )
      .then(res => {
        this.props.history.push('/misc');
      })
      .catch(error => {
        this.setState({
          errors: {
            ...this.state.errors,
            employeeErrors: error.response.data.errors
          }
        });
      });
  };

  onSaveClick = () => {
    Promise.all([this.saveAddress(), this.saveBankDetails()])
      .then(() => {
        this.saveEmployee();
      })
      .catch(() => {
        this.saveEmployee();
      });
  };

  onEditClick = () => {
    // TODO ADD EDIT ROUTES
    console.log('Edit record');
    if (
      this.state.employee.bankDetailsID === '' &&
      this.state.employee.addressID === ''
    ) {
      Promise.all([this.saveAddress(), this.saveBankDetails()])
        .then(() => {
          this.updateEmployee();
        })
        .catch(() => {
          this.updateEmployee();
        });
    } else if (this.state.employee.bankDetailsID === '') {
      Promise.all([this.saveBankDetails(), this.updateAddress()])
        .then(() => {
          this.updateEmployee();
        })
        .catch(() => {
          this.updateEmployee();
        });
    } else if (this.state.employee.addressID === '') {
      Promise.all([this.saveAddress(), this.updateBankDetails()])
        .then(() => {
          this.updateEmployee();
        })
        .catch(() => {
          this.updateEmployee();
        });
    } else {
      Promise.all([this.updateAddress(), this.updateBankDetails()])
        .then(() => {
          this.updateEmployee();
        })
        .catch(() => {
          this.updateEmployee();
        });
    }
  };

  onDeleteClick = () => {
    axios
      .delete(`/api/employee/${this.props.match.params.id}`)
      .then(res => {
        console.log(res);
        this.props.history.push('/misc');
      })
      .catch(error => {
        console.error(error);
      });
    console.log('Delete record');
  };

  onNewAddress = () => {
    this.setState({
      ...this.state,
      address: { ...addressSchema },
      employee: { ...this.state.employee, addressID: '' }
    });
  };

  onNewBankDetails = () => {
    this.setState({
      ...this.state,
      bankDetails: { ...bankDetailsSchema },
      employee: { ...this.state.employee, bankDetailsID: '' }
    });
  };

  render() {
    let { employee, address, bankDetails } = this.state;
    let {
      employeeErrors,
      addressErrors,
      bankDetailsErrors
    } = this.state.errors;

    let controllButtons;

    if (this.state.createEmployee) {
      controllButtons = (
        <div className="col-sm-12">
          <Link to="/misc" className="btn btn-lg btn-warning mr-3">
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
          <Link to="/employee/browse" className="btn btn-lg btn-warning mr-3">
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
    const passwordInputs = this.state.createEmployee
      ? [
          <div key="password1" className="col-md-12 col-lg-12 mt-3">
            <InputGroup
              value={employee.password}
              name="employee.password"
              onChange={this.onChange}
              type="password"
              placeholder="Employee password *"
              error={employeeErrors.password}
            />
          </div>,
          <div key="password2" className="col-md-12 col-lg-12 mt-3">
            <InputGroup
              value={employee.confirmPassword}
              name="employee.confirmPassword"
              onChange={this.onChange}
              type="password"
              placeholder="Confirm password *"
              error={employeeErrors.confirmPassword}
            />
          </div>
        ]
      : '';
    return (
      <div className="container text-center text-dark">
        <h2>
          {this.state.createEmployee ? 'Add Employee' : 'Edit employee data'}
        </h2>

        <h3>Employee details</h3>
        <div className="row">
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              value={employee.name}
              name="employee.name"
              onChange={this.onChange}
              placeholder="Employee name *"
              error={employeeErrors.name}
            />
          </div>
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              value={employee.surname}
              name="employee.surname"
              onChange={this.onChange}
              placeholder="Employee surname *"
              error={employeeErrors.surname}
            />
          </div>
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              value={employee.phoneNumber}
              name="employee.phoneNumber"
              onChange={this.onChange}
              placeholder="Employee phone number *"
              error={employeeErrors.phoneNumber}
            />
          </div>
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              value={employee.dateOfBirth}
              name="employee.dateOfBirth"
              onChange={this.onChange}
              type="date"
              placeholder="Employee DOB *"
              error={employeeErrors.dateOfBirth}
            />
          </div>
          <div className="col-md-12 col-lg-12 mt-3">
            <InputGroup
              value={employee.email}
              name="employee.email"
              onChange={this.onChange}
              type="email"
              placeholder="Employee email *"
              error={employeeErrors.email}
            />
          </div>
          {passwordInputs}
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
          {this.state.createEmployee ? (
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

        <h3>Employee bank details</h3>
        <div className="row">
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              name="bankDetails.bankName"
              value={bankDetails.bankName}
              onChange={this.onChange}
              placeholder="Bank Name *"
              error={bankDetailsErrors.bankName}
            />
          </div>
          <div className="col-md-12 col-lg-6 mt-3">
            <InputGroup
              name="bankDetails.accountName"
              value={bankDetails.accountName}
              onChange={this.onChange}
              placeholder="Account Name *"
              error={bankDetailsErrors.accountName}
            />
          </div>
          <div className="col-md-12 col-lg-12 mt-3">
            <InputGroup
              name="bankDetails.iban"
              value={bankDetails.iban}
              onChange={this.onChange}
              placeholder="Account number/IBAN *"
              error={bankDetailsErrors.iban}
            />
          </div>
          <div className="col-md-6 col-lg-6 mt-3">
            <InputGroup
              name="bankDetails.swiftCode"
              value={bankDetails.swiftCode}
              onChange={this.onChange}
              placeholder="Swift Code *"
              error={bankDetailsErrors.swiftCode}
            />
          </div>
          {this.state.createEmployee ? (
            ''
          ) : (
            <div className="col-md-6 col-lg-6 mt-3 ">
              <button
                type="button"
                onClick={this.onNewBankDetails}
                className="btn btn-lg btn-secondary float-left"
              >
                New Account
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
