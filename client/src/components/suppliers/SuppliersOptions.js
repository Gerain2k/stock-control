import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';
import IconButton from '../common/IconButton';

export default class SuppliersOptions extends Component {
  render() {
    return (
      <div className="suppliers text-center">
        <Header as="h2" className="pt-5 text-light">
          Supplier Options:
        </Header>
        <hr />
        <IconButton
          linkTo="/suppliers/find"
          iconSize="fa-2x"
          additionalClasses="mr-2"
          iconName="fas fa-search"
          buttonText="Find Supplier"
        />
        <IconButton
          linkTo="/suppliers/add"
          iconSize="fa-2x"
          additionalClasses="mr-2"
          iconName="fas fa-plus-circle"
          buttonText="Add supplier"
        />
        <IconButton
          linkTo="/suppliers/browse"
          iconSize="fa-2x"
          iconName="fas fa-address-book"
          buttonText="Browse all"
        />
      </div>
    );
  }
}
