import React from 'react';
import { Link } from 'react-router-dom';

export default function EmployeeCard({ name, surname, phone, email, id }) {
  const url = `/employee/id/${id}`;
  let initials = (name[0] + surname[0]).toUpperCase();
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card">
        <div className="card-body">
          <h5
            className="card-title bg-secondary text-light rounded-circle"
            style={styles.cicrleInitials}
          >
            {initials}
          </h5>
          <p className="card-text" style={styles.marginTop}>
            {name} {surname}
          </p>
          <h6 className="card-subtitle mb-2 text-muted">
            <i className="fas fa-phone" />{' '}
            {/* {this.props.phone === null ? 'No phone' : this.props.phone} */}
            {phone}
          </h6>
          <p className="card-text">
            <i className="fas fa-at" /> {email}
          </p>
          <Link to={url} className="card-link">
            See more >
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  cicrleInitials: {
    width: '50px',
    height: '50px',
    paddingTop: '15px',
    margin: 'auto'
  },
  marginTop: {
    marginTop: '10px'
  }
};
