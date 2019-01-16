import React, { Component } from 'react';
import IconButton from '../common/IconButton';

export default class MiscOptions extends Component {
  render() {
    return (
      <div className="misc-options text-center">
        <h2 as="h2" className="pt-5 text-dark">
          Additional Options:
        </h2>
        <hr />
        <IconButton
          linkTo="/employee/add"
          iconSize="fa-2x"
          additionalClasses="mr-2"
          iconName="fas fa-address-card"
          buttonText="Add employee"
        />
        <IconButton
          linkTo="/employee/browse"
          iconSize="fa-2x"
          additionalClasses="mr-2"
          iconName="fas fa-user-circle"
          buttonText="Browse employees"
        />
        <IconButton
          linkTo="/product/browse"
          iconSize="fa-2x"
          additionalClasses="mr-2"
          iconName="fas fa-boxes"
          buttonText="Browse products"
        />
      </div>
    );
  }
}
