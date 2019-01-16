import React, { Component } from 'react';
import Spinner from '../common/Spinner';
import { connect } from 'react-redux';
import { getAllSuppliers } from '../../actions/supplierActions';
import SupplierItem from './SupplierItem';

class BrowseSuppliers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingSuppliers: true
    };
  }
  componentDidMount = () => {
    this.props.getAllSuppliers();
    this.setState({ loadingSuppliers: false });
  };

  render() {
    let suppliersItems;
    if (this.state.loadingSuppliers) {
      suppliersItems = <Spinner />;
    } else if (this.props.suppliers.length === 0) {
      suppliersItems = (
        <p className="lead">Sorry there isn't any supplier in DB</p>
      );
    } else {
      suppliersItems = Object.keys(this.props.suppliers).map(key => {
        let supplier = this.props.suppliers[key];
        return (
          <SupplierItem
            key={supplier.supplierID}
            name={supplier.companyName}
            phone={supplier.phoneNumber}
            regNr={supplier.companyRegNr}
            id={supplier.supplierID}
          />
        );
      });
    }
    return (
      <div className="container text-center text-dark">
        <div className="row">
          <div className="col-md-12">
            <h1 className="display-4">Browse all suppliers</h1>
            <div className="row">{suppliersItems}</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  suppliers: state.suppliers
});

export default connect(
  mapStateToProps,
  { getAllSuppliers }
)(BrowseSuppliers);
