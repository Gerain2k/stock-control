import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SelectInputGroupe from '../common/SelectInputGroupe';
import InputGroup from '../common/InputGroup';
import moment from 'moment';
import invoiceSchema from '../../schemas/invoice';
import invoiceItemSchema from '../../schemas/invoiceItem';
import InvoiceItem from './InvoiceItem';

export default class EditInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invoice: { ...invoiceSchema },
      invoiceItems: [],
      products: [],
      shops: [],
      suppliers: [],
      employees: [],
      errors: {
        invoiceError: {}
      }
    };
  }

  componentDidMount = () => {
    axios
      .get(`/api/invoice/id/${this.props.match.params.id}`)
      .then(res => {
        this.setState({
          invoice: {
            ...res.data.invoice,
            date: moment(res.data.invoice.date).format('YYYY-MM-DD'),
            paymentDueDate: moment(res.data.invoice.paymentDueDate).format(
              'YYYY-MM-DD'
            )
          }
        });
      })
      .catch(error => {
        console.error(error);
        this.history.push('/');
      });
    axios
      .get(`/api/invoiceitem/invoice/id/${this.props.match.params.id}`)
      .then(res => {
        this.setState({ invoiceItems: res.data.invoiceItems });
      })
      .catch(error => {
        console.error(error);
      });

    axios
      .get('/api/product')
      .then(res => {
        this.setState({ ...this.state, products: res.data.products });
      })
      .catch(error => {
        console.error(error);
      });
    axios
      .get('/api/employee')
      .then(res => {
        this.setState({ ...this.state, employees: res.data.employees });
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
      .get('/api/shop')
      .then(res => {
        this.setState({ ...this.state, shops: res.data.shops });
      })
      .catch(error => {
        console.error(error);
      });
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

  onAddNewItem = () => {
    let itemArrayLength = this.state.invoiceItems.length - 1;
    if (this.state.invoiceItems[itemArrayLength].productID !== '') {
      this.setState({
        ...this.state,
        invoiceItems: [
          ...this.state.invoiceItems,
          { ...invoiceItemSchema, invoiceID: this.state.invoice.invoiceID }
        ]
      });
    }
  };

  onBarcodeInput = e => {
    if (e.target.validity.valid) {
      let itemIdex = e.target.dataset.index;
      let newInvoiceItems = [...this.state.invoiceItems];
      newInvoiceItems[itemIdex].barcode = e.target.value;
      this.setState({
        ...this.state,
        invoiceItems: newInvoiceItems
      });
    }
  };

  onAutocompleteSelect = (val, item) => {
    let newInvoiceItems = [...this.state.invoiceItems];
    newInvoiceItems[item.index].barcode = item.barcode;
    newInvoiceItems[item.index].productID = item.productID;
    newInvoiceItems[item.index].name = item.description;
    this.setState({
      ...this.state,
      invoiceItems: [...newInvoiceItems]
    });
  };

  onRemoveItem = e => {
    const itemIndex = e.target.closest('button').dataset.index;
    let newInvoiceItems = [...this.state.invoiceItems];
    newInvoiceItems.splice(itemIndex, 1);
    this.setState({ invoiceItems: newInvoiceItems });
  };

  onInvoiceItemChange = e => {
    if (e.target.validity.valid) {
      const propName = e.target.name.split('.');
      let invoiceItem = [...this.state.invoiceItems];
      invoiceItem[propName[1]][propName[0]] = e.target.value;
      this.setState({ ...this.state, invoiceItems: [...invoiceItem] });
    }
  };

  onBarcodeBlur = e => {
    if (
      e.target.value !== '' &&
      this.state.products.findIndex(
        i => i.barcode.toString() === e.target.value
      ) < 0
    ) {
      this.setState({
        openModalPopUp: true,
        newProduct: {
          ...this.state.newProduct,
          barcode: e.target.value,
          groupIndex: e.target.dataset.index
        }
      });
    } else if (e.target.value === '') {
      let invoiceItems = [...this.state.invoiceItems];
      let index = e.target.dataset.index;
      invoiceItems.splice(index, 1, {
        ...invoiceItemSchema,
        invoiceID: this.state.invoice.invoiceID
      });
      this.setState({ invoiceItems });
    }
  };

  render() {
    let employeeList = [];
    let supplierList = [];
    let shopList = [];
    for (let item in this.state.employees) {
      employeeList[item] = {
        name:
          this.state.employees[item].Name +
          ' ' +
          this.state.employees[item].Surname,
        value: this.state.employees[item].EmployeeID
      };
    }
    for (let item in this.state.suppliers) {
      supplierList[item] = {
        name: this.state.suppliers[item].companyName,
        value: this.state.suppliers[item].supplierID
      };
    }
    for (let item in this.state.shops) {
      shopList[item] = {
        name: this.state.shops[item].ShopName,
        value: this.state.shops[item].ShopID
      };
    }

    let tableContent = this.state.invoiceItems.map((item, index) => (
      <InvoiceItem
        key={'invoiceItem_' + index}
        invoiceItem={item}
        index={index}
        onAddNewItem={this.onAddNewItem}
        lastItem={index === this.state.invoiceItems.length - 1}
        products={this.state.products}
        onBarcodeInput={this.onBarcodeInput}
        onAutocompleteSelect={this.onAutocompleteSelect}
        onInvoiceItemChange={this.onInvoiceItemChange}
        onRemoveItem={this.onRemoveItem}
        onBarcodeBlur={this.onBarcodeBlur}
      />
    ));

    return (
      <div className="container text-center">
        <div className="row">
          <div className="col-md-6 col-lg-4 mt-3">
            <SelectInputGroupe
              label="Employee:"
              options={employeeList}
              name="invoice.employeeID"
              value={this.state.invoice.employeeID}
              onChange={this.onChange}
              error={this.state.errors.invoiceError.employeeID}
              createNewLink="/employee/add"
            />
          </div>
          <div className="col-md-6 col-lg-4 mt-3">
            <SelectInputGroupe
              label="Supplier"
              options={supplierList}
              name="invoice.supplierID"
              value={this.state.invoice.supplierID}
              onChange={this.onChange}
              error={this.state.errors.invoiceError.supplierID}
              createNewLink="/suppliers/add"
            />
          </div>
          <div className="col-md-6 col-lg-4 mt-3">
            <SelectInputGroupe
              label="Shop"
              options={shopList}
              name="invoice.shopID"
              value={this.state.invoice.shopID}
              onChange={this.onChange}
              error={this.state.errors.invoiceError.shopID}
              createNewLink="/shops/add"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-lg-4 mt-4">
            <InputGroup
              value={this.state.invoice.invoiceNumber}
              name="invoice.invoiceNumber"
              onChange={this.onChange}
              placeholder="Invoice Number"
              error={this.state.errors.invoiceError.invoiceNumber}
            />
          </div>
          <div className="col-md-6 col-lg-4 offset-lg-4 mt-2">
            <span>Date</span>
            <InputGroup
              value={this.state.invoice.date}
              name="invoice.date"
              onChange={this.onChange}
              type="date"
              placeholder="Date"
              error={this.state.errors.invoiceError.date}
            />
          </div>
          <div className="col-md-6 col-lg-4 offset-md-6 offset-lg-8 mt-3">
            <span>Pay By Date</span>
            <InputGroup
              value={this.state.invoice.paymentDueDate}
              name="invoice.paymentDueDate"
              onChange={this.onChange}
              type="date"
              placeholder="Date"
              error={this.state.errors.invoiceError.paymentDueDate}
            />
          </div>
        </div>

        <div className="row">
          <h3>Invoice Items</h3>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Barcode</th>
                <th scope="col">Name</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price Per Unit</th>
              </tr>
            </thead>
            <tbody>{tableContent}</tbody>
          </table>
        </div>
        <div className="row">
          <div className="col-md-6 col-lg-6 mt-3 ">
            <Link to="/" className="btn btn-lg btn-warning">
              Cancel
            </Link>
          </div>
          <div className="col-md-6 col-lg-6 mt-3 ">
            <button
              type="button"
              onClick={this.onSaveInvoice}
              className="btn btn-lg btn-primary"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}
