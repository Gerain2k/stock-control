import React, { Component } from 'react';
import IconButton from '../common/IconButton';

export default class ShopsOptions extends Component {
  render() {
    return (
      <div className="shop-options text-center">
        <h2 as="h2" className="pt-5 text-light">
          Shops Options:
        </h2>
        <hr />
        <IconButton
          linkTo="/shops/add"
          iconSize="fa-2x"
          additionalClasses="mr-2"
          iconName="fas fa-cart-plus"
          buttonText="Add shop"
        />
        <IconButton
          linkTo="/shops/browse"
          iconSize="fa-2x"
          additionalClasses="mr-2"
          iconName="fas fa-shopping-cart"
          buttonText="Brows all shops"
        />
        <hr />
        <IconButton
          linkTo="/stock/browse"
          iconSize="fa-2x"
          additionalClasses="mr-2"
          iconName="fas fa-shopping-cart"
          buttonText="Brows stock"
        />
      </div>
    );
  }
}
