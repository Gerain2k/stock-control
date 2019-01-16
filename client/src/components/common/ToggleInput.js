import React, { Component } from 'react';

class ToggleInput extends Component {
  constructor(props) {
    super(props);
    this.state = { input: false };
  }

  render() {
    return (
      <div className="input-group mb-3">
        <label for="basic-url">Your vanity URL</label>
        <span className="form-control">Lebel:</span>
        {/* <input
          type="text"
          className="form-control"
          placeholder="Recipient's username"
          aria-label="Recipient's username"
          aria-describedby="basic-addon2"
        /> */}
        <div className="input-group-append">
          <button className="btn btn-outline-secondary" type="button">
            Button
          </button>
        </div>
      </div>
    );
  }
}

export default ToggleInput;
