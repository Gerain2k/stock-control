import React, { Component } from 'react';
import { Input, Pagination } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import isEmpty from '../../helpers/isEmpty';
import axios from 'axios';
import classnames from 'classnames';

export default class BrowseInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        dateFrom: moment()
          .subtract(2, 'weeks')
          .format('YYYY-MM-DD'),
        dateTo: moment().format('YYYY-MM-DD'),
        employee: '',
        shop: '',
        supplier: '',
        notPayed: false,
        itemsPerPage: 10,
        errors: {}
      },
      employees: [],
      shops: [],
      suppliers: [],
      invoices: [],
      activePage: 1
    };
  }

  componentDidMount = () => {
    axios
      .get('/api/employee')
      .then(res => {
        this.setState({ ...this.state, employees: res.data.employees });
      })
      .catch(error => {
        console.error(error);
      });
    axios
      .get('/api/shop')
      .then(res => {
        this.setState({ ...this.state, shops: res.data.shops });
      })
      .catch(error => {
        console.error(error);
      });
    axios
      .get('/api/suppliers')
      .then(res => {
        this.setState({ ...this.state, suppliers: res.data.suppliers });
      })
      .catch(error => {
        console.error(error);
      });
    axios
      .get('/api/invoice')
      .then(res => {
        this.setState({ ...this.state, invoices: res.data.invoices });
      })
      .catch(error => {
        console.error(error);
      });
  };

  onInputChange = e => {
    console.log(e.target.value);
    if (
      (e.target.name === 'dateFrom' || e.target.name === 'dateTo') &&
      !moment(e.target.value).isValid()
    ) {
      return;
    }
    if (e.target.name === 'notPayed') {
      this.setState({
        filters: {
          ...this.state.filters,
          notPayed: !this.state.filters.notPayed
        }
      });
      return;
    }
    this.setState({
      filters: { ...this.state.filters, [e.target.name]: e.target.value }
    });
  };

  applyFilter = () => {
    axios
      .post('/api/invoice/filter', { filters: this.state.filters })
      .then(res => {
        this.setState({
          invoices: [...res.data.invoices]
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  clearFilter = () => {
    this.setState(
      {
        filters: {
          dateFrom: moment()
            .subtract(2, 'weeks')
            .format('YYYY-MM-DD'),
          dateTo: moment().format('YYYY-MM-DD'),
          employee: '',
          shop: '',
          supplier: '',
          notPayed: false,
          itemsPerPage: 10,
          errors: {}
        }
      },
      () => this.applyFilter()
    );
  };

  onPageChange = (e, { activePage }) => {
    this.setState({ activePage });
  };

  render() {
    let invoiceListPerPage = [];
    const firstRecordOnPage =
      this.state.activePage * this.state.filters.itemsPerPage -
      this.state.filters.itemsPerPage;
    const lastRecordOnPage =
      this.state.activePage * this.state.filters.itemsPerPage - 1 >
      this.state.invoices.length - 1
        ? this.state.invoices.length - 1
        : this.state.activePage * this.state.filters.itemsPerPage - 1;

    if (firstRecordOnPage < 0) {
      invoiceListPerPage.push(<li className="list-group-item">Loading</li>);
    } else {
      for (let i = firstRecordOnPage; i < lastRecordOnPage + 1; i++) {
        invoiceListPerPage.push(
          <li
            className={classnames('list-group-item', {
              'bg-success': this.state.invoices[i].payed,
              'bg-warning':
                !this.state.invoices[i].payed &&
                moment(this.state.invoices[i].paymentDueDate).isAfter(moment()),
              'bg-danger':
                !this.state.invoices[i].payed &&
                moment(this.state.invoices[i].paymentDueDate).isSameOrBefore(
                  moment()
                )
            })}
            key={`invoiceList_${i}`}
          >
            <Link to={`/invoices/id/${this.state.invoices[i].invoiceID}`}>
              <div
                className={classnames('row', {
                  'text-dark':
                    !this.state.invoices[i].payed &&
                    moment(this.state.invoices[i].paymentDueDate).isAfter(
                      moment()
                    ),
                  'text-white':
                    (!this.state.invoices[i].payed &&
                      moment(
                        this.state.invoices[i].paymentDueDate
                      ).isSameOrBefore(moment())) ||
                    this.state.invoices[i].payed
                })}
              >
                <div className="col-sm-12">
                  <h4>
                    Invoice Number:{' '}
                    <span className="font-weight-bold">
                      {this.state.invoices[i].invoiceNumber}
                    </span>
                  </h4>
                </div>
                <div className="col-sm-6 col-md-4">
                  <span className="font-weight-light">Supplier: </span>
                  {this.state.invoices[i].companyName}
                </div>
                <div className="col-sm-6 col-md-4">
                  <span className="font-weight-light">Employee: </span>
                  {this.state.invoices[i].name} {this.state.invoices[i].surname}
                </div>
                <div className="col-sm-12 col-md-4">
                  <span className="font-weight-light">Shop: </span>
                  {this.state.invoices[i].shopName}
                </div>
                <div className="col-sm-6 col-md-6">
                  Total items:{' '}
                  <span className="font-weight-bold">
                    {this.state.invoices[i].itemTotal}
                  </span>
                </div>
                <div className="col-sm-12 col-md-6">
                  Total amount:{' '}
                  <span className="font-weight-bold">
                    {this.state.invoices[i].total}
                  </span>
                </div>
              </div>
            </Link>
          </li>
        );
      }
    }

    const employeeList = this.state.employees.map(option => {
      let name = `${option.Name} ${option.Surname}`;
      return (
        <option key={option.EmployeeID} value={option.EmployeeID}>
          {name}
        </option>
      );
    });

    const shopList = this.state.shops.map(option => {
      return (
        <option key={option.ShopID} value={option.ShopID}>
          {option.ShopName}
        </option>
      );
    });

    const supplierList = this.state.suppliers.map(option => {
      return (
        <option key={option.supplierID} value={option.supplierID}>
          {option.companyName}
        </option>
      );
    });

    return (
      <div className="container text-center">
        <h3> Invoices </h3>
        <div className="row">
          <div className="col-sm-6 col-lg-6">
            <h3>Filters:</h3>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-6">
            <Input
              label="From:"
              placeholder="date"
              type="date"
              value={this.state.filters.dateFrom}
              name="dateFrom"
              error={!isEmpty(this.state.filters.errors.dateFrom)}
              onChange={this.onInputChange}
            />
          </div>
          <div className="col-md-6">
            <Input
              label="To:"
              placeholder="date"
              type="date"
              value={this.state.filters.dateTo}
              name="dateTo"
              onChange={this.onInputChange}
            />
          </div>
          <div className="col-md-4 mt-4">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <label
                  className="input-group-text"
                  htmlFor="inputGroupSelect01"
                >
                  Employee
                </label>
              </div>
              <select
                className="custom-select"
                id="inputGroupSelect01"
                name="employee"
                onChange={this.onInputChange}
                value={this.state.filters.employee}
              >
                <option defaultValue value="">
                  Select employee
                </option>
                {employeeList}
              </select>
            </div>
          </div>
          <div className="col-md-4 mt-4">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <label
                  className="input-group-text"
                  htmlFor="inputGroupSelect02"
                >
                  Shop
                </label>
              </div>
              <select
                className="custom-select"
                id="inputGroupSelect02"
                name="shop"
                onChange={this.onInputChange}
                value={this.state.filters.shop}
              >
                <option defaultValue value="">
                  Select shop
                </option>
                {shopList}
              </select>
            </div>
          </div>
          <div className="col-md-4 mt-4">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <label
                  className="input-group-text"
                  htmlFor="inputGroupSelect03"
                >
                  Supplier
                </label>
              </div>
              <select
                className="custom-select"
                id="inputGroupSelect03"
                name="supplier"
                onChange={this.onInputChange}
                value={this.state.filters.supplier}
              >
                <option defaultValue value="">
                  Select supplier
                </option>
                {supplierList}
              </select>
            </div>
          </div>
          <div className="col-md-4 mt-4">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <label
                  className="input-group-text"
                  htmlFor="inputGroupSelect04"
                >
                  Not payed only
                </label>
              </div>
              <div className="input-group-text">
                <input
                  type="checkbox"
                  name="notPayed"
                  id="inputGroupSelect04"
                  aria-label="Checkbox for following text input"
                  onChange={this.onInputChange}
                />
              </div>
            </div>
          </div>
          <div className="col-md-4 mt-4">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <label
                  className="input-group-text"
                  htmlFor="inputGroupSelect03"
                >
                  Items per page
                </label>
              </div>
              <select
                className="custom-select"
                id="inputGroupSelect03"
                name="itemsPerPage"
                onChange={this.onInputChange}
                value={this.state.filters.itemsPerPage}
              >
                <option value="1">1</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
          <div className="col-md-4 mt-4">
            <button
              className="btn btn-md btn-primary mr-2"
              onClick={this.applyFilter}
            >
              Apply filter
            </button>
            <button
              className="btn btn-md btn-secondary"
              onClick={this.clearFilter}
            >
              Clear filter
            </button>
          </div>
        </div>
        <hr />
        <div className="row mt-4">
          <div className="col-md-12">
            {this.state.invoices.length / this.state.filters.itemsPerPage >
              1 && (
              <Pagination
                defaultActivePage={1}
                totalPages={
                  this.state.invoices.length / this.state.filters.itemsPerPage
                }
                onPageChange={this.onPageChange}
              />
            )}
            <ul className="list-group">{invoiceListPerPage}</ul>
          </div>
        </div>
      </div>
    );
  }
}
