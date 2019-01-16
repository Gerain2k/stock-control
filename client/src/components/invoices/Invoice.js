import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import invoiceSchema from '../../schemas/invoice';
import axios from 'axios';
import Popup from 'reactjs-popup';
import SelectInputGroupe from '../common/SelectInputGroupe';
import InputGroup from '../common/InputGroup';
import TextAreaGroup from '../common/TextAreaGroup';
import InvoiceItem from './InvoiceItem';
import employeeSchema from '../../schemas/employee';
import shopSchema from '../../schemas/shop';
import supplierShema from '../../schemas/supplier';
import invoiceItemSchema from '../../schemas/invoiceItem';
import productSchema from '../../schemas/product';
import uuidv4 from 'uuid/v4';
import moment from 'moment';

let uniqueInvoiceID = uuidv4();

export default class Invoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      invoiceItems: [{ ...invoiceItemSchema, invoiceID: uniqueInvoiceID }],
      employees: [{ ...employeeSchema }],
      suppliers: [{ ...supplierShema }],
      shops: [{ ...shopSchema }],
      invoice: {
        ...invoiceSchema,
        invoiceID: uniqueInvoiceID,
        date: moment().format('YYYY-MM-DD'),
        paymentDueDate: moment()
          .add(2, 'weeks')
          .format('YYYY-MM-DD')
      },
      errors: { invoiceError: {}, productError: {}, invoiceItemsError: [] },
      openModalPopUp: false,
      showErrorPopup: false,
      newProduct: { ...productSchema }
    };
  }

  componentDidMount = () => {
    uniqueInvoiceID = uuidv4();
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
          { ...invoiceItemSchema, invoiceID: uniqueInvoiceID }
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
        invoiceID: uniqueInvoiceID
      });
      this.setState({ invoiceItems });
    }
  };

  onCancelNewProduct = () => {
    let newInvoiceItem = [...this.state.invoiceItems];
    newInvoiceItem[this.state.newProduct.groupIndex] = { ...invoiceItemSchema };
    this.setState({
      openModalPopUp: false,
      newProduct: { ...productSchema },
      invoiceItems: newInvoiceItem
    });
  };

  onNewProductSave = () => {
    axios
      .post('/api/product', this.state.newProduct)
      .then(res => {
        let products = this.state.products.concat(res.data.product);
        let invoiceItem = [...this.state.invoiceItems];
        let itemIndex = this.state.newProduct.groupIndex;
        invoiceItem[itemIndex] = { ...invoiceItemSchema };
        invoiceItem[itemIndex].invoiceID = uniqueInvoiceID;
        invoiceItem[itemIndex].barcode = res.data.product.barcode;
        invoiceItem[itemIndex].name = res.data.product.description;
        invoiceItem[itemIndex].productID = res.data.product.productID;
        this.setState({
          products,
          invoiceItems: invoiceItem,
          errors: {
            ...this.state.errors,
            productError: {}
          },
          newProduct: { ...productSchema }
        });
        this.setState({ openModalPopUp: false });
      })
      .catch(error => {
        this.setState({
          errors: {
            ...this.state.errors,
            productError: error.response.data.errors
          }
        });
      });
  };

  onSaveInvoice = () => {
    const { errors, isValid } = this.checkInvoiceItems();
    if (!isValid) {
      this.setState({
        showErrorPopup: true,
        errors: {
          ...this.state.errors,
          invoiceItemsError: [...errors]
        }
      });
    } else {
      const invoiceItemsCopy = [...this.state.invoiceItems];
      const invoiceItemData = invoiceItemsCopy.map(item => [
        this.state.invoice.invoiceID,
        item.productID,
        item.quantity,
        item.pricePerUnit
      ]);
      const stockItemData = invoiceItemsCopy.map(item => [
        this.state.invoice.shopID,
        item.productID,
        item.quantity,
        item.pricePerUnit * 1.3
      ]);

      axios
        .post('/api/invoice', this.state.invoice)
        .then(res => {
          axios
            .post('/api/invoiceitem', { invoiceItems: invoiceItemData })
            .then(res => {
              axios
                .post('/api/stock', { stockItems: stockItemData })
                .then(res => {
                  this.props.history.push('/');
                })
                .catch(error => {
                  console.error(error.response.data);
                });
            })
            .catch(error => {
              console.error(error);
            });
        })
        .catch(error => {
          this.setState({
            errors: {
              ...this.state.errors,
              invoiceError: error.response.data.errors
            }
          });
        });
    }
  };

  checkInvoiceItems = () => {
    let invoiceItemCheck = { isValid: true, errors: [] };
    let errors = this.state.invoiceItems.map((item, index) => {
      if (item.productID === '') {
        if (index === 0) {
          return `Invoice should have at least 1 item. First item missing barcode.`;
        }
        return `Item #${index} need to have barcode. Please eather add barcode or remove item`;
      } else if (item.quantity < 1) {
        return `Item #${index} quantity needs to be integer bigger then 0`;
      } else if (item.pricePerUnit === 0) {
        return `Item #${index} price can't be 0`;
      }
      return null;
    });
    errors = errors.reduce((result, item) => {
      if (item !== null) {
        result.push(item);
      }
      return result;
    }, []);

    if (errors.length > 0) {
      invoiceItemCheck.isValid = false;
      invoiceItemCheck.errors = errors;
    }
    return invoiceItemCheck;
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

    const errorListOnModal = this.state.errors.invoiceItemsError.map(
      (item, index) => (
        <li
          key={'errors_' + index}
          className="list-group-item list-group-item-warning"
        >
          {item}
        </li>
      )
    );

    return (
      <div className="container text-center text-dark">
        <Popup
          open={this.state.showErrorPopup}
          modal
          closeOnDocumentClick
          onClose={() => {
            this.setState({ showErrorPopup: false });
          }}
        >
          <div className="container">
            <div className="row">
              <div className="col-sm-12">
                <h5>
                  Can't save invoice
                  <br />
                  Please fix errors listed bellow to save invoice:
                </h5>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-sm-12">
                <ul className="list-group">{errorListOnModal}</ul>
              </div>
            </div>
          </div>
        </Popup>

        <Popup
          open={this.state.openModalPopUp}
          modal
          closeOnDocumentClick={false}
        >
          <div>
            <h5>
              {' '}
              This barcode is not in database <br /> Would you like to add it?{' '}
            </h5>
            <div className="row">
              <div className="col-md-6 col-lg-6 mt-3">
                <span>
                  Barcode* <br />
                </span>
                <InputGroup
                  value={this.state.newProduct.barcode}
                  name="newProduct.barcode"
                  onChange={this.onChange}
                  placeholder="Barcode"
                  error={this.state.errors.productError.barcode}
                />
              </div>
              <div className="col-md-6 col-lg-6 mt-3">
                <span>
                  Description/Name* <br />
                </span>
                <InputGroup
                  value={this.state.newProduct.description}
                  name="newProduct.description"
                  onChange={this.onChange}
                  placeholder="Description"
                  error={this.state.errors.productError.description}
                />
              </div>
              <div className="col-md-12 mt-3">
                <span>
                  Notes <br />
                </span>
                <TextAreaGroup
                  name="newProduct.notes"
                  value={this.state.newProduct.notes}
                  onChange={this.onChange}
                  placeholder="Additional notes about supplier"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 col-lg-6 mt-3 ">
                <button
                  type="button"
                  onClick={this.onCancelNewProduct}
                  className="btn btn-lg btn-warning"
                >
                  Cancel
                </button>
              </div>
              <div className="col-md-6 col-lg-6 mt-3 ">
                <button
                  type="button"
                  onClick={this.onNewProductSave}
                  className="btn btn-lg btn-primary"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </Popup>
        <h2>Add new Invoice</h2>
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
