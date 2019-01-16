import React from 'react';
import { Link } from 'react-router-dom';

export default function ShopItem(shop) {
  const url = `/shops/id/${shop.shop.ShopID}`;
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{shop.shop.ShopName}</h5>
          <h6 className="card-subtitle mb-2 text-muted">
            <i className="fas fa-phone" />{' '}
            {shop.shop.PhoneNumber === null
              ? 'No phone'
              : shop.shop.PhoneNumber}
          </h6>
          <Link to={url} className="card-link">
            See more >
          </Link>
        </div>
      </div>
    </div>
  );
}
