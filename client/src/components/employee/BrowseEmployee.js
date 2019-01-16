import React, { Component } from 'react';
import EmployeeCard from './EmployeeCard';
import Spinner from '../common/Spinner';
import axios from 'axios';

export default class BrowseEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingEmployees: true,
      employees: []
    };
  }

  componentDidMount = () => {
    axios
      .get('/api/employee/')
      .then(res => {
        this.setState({
          loadingEmployees: false,
          employees: res.data.employees
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    let employeeList;
    if (this.state.loadingEmployees) {
      employeeList = (
        <div className="col-md-12">
          <Spinner />
        </div>
      );
    } else if (this.state.employees.length === 0) {
      employeeList = <h3> Sorry there are no employees in data base</h3>;
    } else {
      employeeList = this.state.employees.map(employee => {
        return (
          <EmployeeCard
            key={employee.EmployeeID}
            name={employee.Name}
            surname={employee.Surname}
            phone={employee.PhoneNumber}
            email={employee.Email}
            id={employee.EmployeeID}
          />
        );
      });
    }
    return (
      <div className="container text-center text-dark">
        <div className="row">
          <div className="col-md-12">
            <h1 className="display-4">Browse all employee</h1>
            <div className="row mt-4">{employeeList}</div>
          </div>
        </div>
      </div>
    );
  }
}
