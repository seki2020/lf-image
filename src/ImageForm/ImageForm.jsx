import React, { Component } from "react";
import { Dropdown, Icon, Grid } from "semantic-ui-react";
import _ from "lodash";
import "./ImageForm.css";

const methodOptions = [
  {
    key: "Url",
    text: "Url",
    value: "Url"
  },
  {
    key: "File",
    text: "File",
    value: "File"
  }
];

const MODE = {
  input: "Input",
  search: "File"
};
const INPUTTYPE = {
  File: "file",
  Input: "text"
};

class ImageForm extends Component {
  constructor(props) {
    super(props);
    this.onSearch = props.onSearch.bind(this);
    this.pressSearch = this.pressSearch.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);

    this.state = {
      modeVal: MODE.search
    };
  }

  handleUserInput(e) {
    debugger;
    if (e.target.type === "text") {
      this.setState({
        queryUrl: e.target.value
      });
    }
    if (e.target.type === "file") {
      this.setState({
        queryUrl: e.target.files[0]
      });
    }
  }

  pressSearch() {
    if (this.state.modeVal === MODE.input) {
      this.props.onSearch(this.state.queryUrl, "url");
    } else {
      this.props.onSearch(this.state.queryUrl, "file");
    }
  }
  handleModeChange(e, option) {
    this.setState({
      modeVal: option.value
    });
  }

  render() {
    return (
      <Grid textAlign="center" divided stackable columns={3}>
        <Grid.Column stretched mobile="3">
          <Dropdown
            placeholder="Select Friend"
            selection
            fluid
            value={this.state.modeVal}
            onChange={this.handleModeChange}
            options={methodOptions}
          />
        </Grid.Column>
        <Grid.Column stretched="true" mobile="10">
          <div className="ui fluid icon input">
            <input
              type={INPUTTYPE[this.state.modeVal]}
              className="searchInput"
              placeholder=""
              onChange={this.handleUserInput}
            />
          </div>
        </Grid.Column>
        <Grid.Column stretched="true" mobile="3">
          <button
            className="ui button"
            onClick={_.throttle(this.pressSearch, 2000, { trailing: false })}
          >
            <i aria-hidden="true" className="search icon"></i>
            {this.state.modeVal}
          </button>
        </Grid.Column>
      </Grid>
      // <div className="ui fluid icon input">
      //     <Dropdown
      //         placeholder='Select Friend'
      //         selection
      //         fluid
      //         value={this.state.modeVal}
      //         onChange={this.handleModeChange}
      //         options={methodOptions}
      //     />

      //     <input type={INPUTTYPE[this.state.modeVal]}
      //            className='searchInput'
      //            placeholder='...'
      //            onChange={this.handleUserInput}/>
      //     <button className="ui button" onClick={_.throttle(this.pressSearch, 2000, { 'trailing': false })}>
      //         <i aria-hidden="true" className="search icon"></i>
      //         {this.state.modeVal}
      //     </button>
      // </div>
    );
  }
}

export default ImageForm;
