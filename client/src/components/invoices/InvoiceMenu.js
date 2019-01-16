import React, { Component } from 'react';
import IconButton from '../common/IconButton';

export default class InvoiceMenu extends Component {
  render() {
    return (
      <div className="text-center">
        <h2 as="h2" className="pt-5 text-dark">
          Invoice Options:
        </h2>
        <hr />
        <IconButton
          linkTo="/invoices/add"
          iconSize="fa-2x"
          additionalClasses="mr-2"
          iconName="fas fa-folder-plus"
          buttonText="Add invoice"
        />
        <IconButton
          linkTo="/invoices/browse"
          iconSize="fa-2x"
          additionalClasses="mr-2"
          iconName="fas fa-folder-open"
          buttonText="Browse invoices"
        />
      </div>
    );
  }
}
