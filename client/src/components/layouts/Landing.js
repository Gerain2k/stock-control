import React, { Component } from 'react';
import IconButton from '../common/IconButton';

export default class Landing extends Component {
  render() {
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">Stock Control System</h1>
                <p className="lead">Select what you want to do.</p>
                <IconButton
                  linkTo="/cash-register"
                  iconSize="fa-3x"
                  iconName="fas fa-hand-holding-usd"
                  buttonText="Cash Register"
                />
                <hr />
                <IconButton
                  linkTo="/invoices"
                  additionalClasses="mr-2"
                  iconSize="fa-2x"
                  iconName="fas fa-file-invoice-dollar"
                  buttonText="Invoices"
                />
                <IconButton
                  linkTo="/suppliers"
                  iconSize="fa-2x"
                  iconName="fas fa-truck"
                  buttonText="Suppliers"
                />
                <hr />
                <IconButton
                  linkTo="/shops"
                  additionalClasses="mr-2"
                  iconSize="fa-2x"
                  iconName="fas fa-warehouse"
                  buttonText="Shops"
                />
                <IconButton
                  linkTo="/misc"
                  iconSize="fa-2x"
                  iconName="fab fa-stack-overflow"
                  buttonText="Misc"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
