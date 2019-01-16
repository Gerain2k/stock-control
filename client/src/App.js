import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Landing from './components/layouts/Landing';
import InvoiceMenu from './components/invoices/InvoiceMenu';
import SuppliersOptions from './components/suppliers/SuppliersOptions';
import AddSupplier from './components/supplier/AddSupplier';
import BrowseSuppliers from './components/suppliers/BrowseSuppliers';
import Supplier from './components/supplier/Supplier';
import FindSuppliers from './components/suppliers/FindSuppliers';
import MiscOptions from './components/misc/MiscOptions';
import AddEmployee from './components/employee/AddEmployee';
import BrowseEmployee from './components/employee/BrowseEmployee';
import ShopsOptions from './components/shop/ShopsOptions';
import AddShop from './components/shop/AddShop';
import BrowseShops from './components/shop/BrowseShops';
import Invoice from './components/invoices/Invoice';
import BrowseInvoice from './components/invoices/BrowseInvoice';
import EditInvoice from './components/invoices/EditInvoice';
import BrowseProducts from './components/product/BrowseProducts';
import EditProduct from './components/product/EditProduct';
import Stock from './components/stock/Stock';

import './App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="contaioner" style={{ minHeight: '79vh' }}>
              {/* Supplier */}
              <Route exact path="/suppliers" component={SuppliersOptions} />
              <Route exact path="/suppliers/add" component={AddSupplier} />
              <Route exact path="/supplier/:id" component={Supplier} />
              <Route
                exact
                path="/suppliers/browse"
                component={BrowseSuppliers}
              />
              <Route exact path="/suppliers/find" component={FindSuppliers} />
              <Route exact path="/misc" component={MiscOptions} />
              {/* Employee routes */}
              <Route exact path="/employee/add" component={AddEmployee} />
              <Route exact path="/employee/browse" component={BrowseEmployee} />
              <Route exact path="/employee/id/:id" component={AddEmployee} />
              {/* Shop routes */}
              <Route exact path="/shops" component={ShopsOptions} />
              <Route exact path="/shops/add" component={AddShop} />
              <Route exact path="/shops/browse" component={BrowseShops} />
              <Route exact path="/shops/id/:id" component={AddShop} />
              {/* Invoice routes */}
              <Route exact path="/invoices" component={InvoiceMenu} />
              <Route exact path="/invoices/add" component={Invoice} />
              <Route exact path="/invoices/browse" component={BrowseInvoice} />
              <Route exact path="/invoices/id/:id" component={EditInvoice} />
              {/* Product routes */}
              <Route exact path="/product/browse" component={BrowseProducts} />
              <Route exact path="/product/id/:id" component={EditProduct} />
              {/* Stock */}
              <Route exact path="/stock/browse" component={Stock} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
