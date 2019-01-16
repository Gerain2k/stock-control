import React, { Component } from 'react';
import Spinner from '../common/Spinner';
import axios from 'axios';
import ShopItem from './ShopItem';

export default class BrowseShops extends Component {
  constructor(props) {
    super(props);
    this.state = { loadingShops: true, shops: [] };
  }

  componentDidMount = () => {
    axios
      .get('/api/shop')
      .then(res => {
        this.setState({ loadingShops: false, shops: res.data.shops });
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    let shopItems;
    if (this.state.loadingShops) {
      shopItems = (
        <div className="col-md-12">
          <Spinner />
        </div>
      );
    } else if (this.state.shops.length === 0) {
      shopItems = <h4>Sorry there are no shops in database</h4>;
    } else {
      shopItems = this.state.shops.map(item => {
        return <ShopItem key={item.ShopID} shop={item} />;
      });
    }
    return (
      <div className="container text-center text-dark">
        <div className="row">
          <div className="col-md-12">
            <h1 className="display-4">Browse all shops</h1>
            <div className="row">{shopItems}</div>
          </div>
        </div>
      </div>
    );
  }
}
