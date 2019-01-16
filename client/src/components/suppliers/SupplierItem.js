import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class SupplierItem extends Component {
  render() {
    let url = `/supplier/${this.props.id}`;
    return (
      <div className="col-md-6 col-lg-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{this.props.name}</h5>
            <h6 className="card-subtitle mb-2 text-muted">
              <i className="fas fa-phone" />{' '}
              {this.props.phone === null ? 'No phone' : this.props.phone}
            </h6>
            <p className="card-text">Reg Number: {this.props.regNr}</p>
            <Link to={url} className="card-link">
              See more >
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
