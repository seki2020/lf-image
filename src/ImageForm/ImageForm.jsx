import React, { Component } from "react";
import { Dropdown, Segment, Grid } from "semantic-ui-react";
import _ from "lodash";
import "./ImageForm.css";
import methodOptions from "../Constant/ImageFormConst";

class ImageForm extends Component {
  constructor(props) {
    super(props);
    this.onSearch = props.onSearch.bind(this);
    this.pressSearch = this.pressSearch.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
    this.onEnterPress = this.onEnterPress.bind(this);
  }

  state = {
    modeVal: methodOptions[0]
  };

  handleUserInput(e) {
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
    this.props.onSearch(this.state.queryUrl, this.state.modeVal);
  }
  handleModeChange(e, option) {
    debugger;
    this.setState({
      modeVal: option.options.filter(doc => doc.key === option.value)[0]
    });
  }
  onEnterPress(e) {
    if (e.key === "Enter") {
      this.pressSearch();
    }
  }

  render() {
    const onSubmit = _.throttle(this.pressSearch, 2000, { trailing: false });
    return (
      <Segment>
        <Grid textAlign="center" divided stackable columns={3}>
          <Grid.Column stretched mobile="3">
            <Dropdown
              placeholder="Select Friend"
              selection
              fluid
              value={this.state.modeVal.value}
              onChange={this.handleModeChange}
              options={methodOptions}
            />
            {/* onChange={(e,option)=>{this.setState({modeVal: option});console.log(option)}} */}
          </Grid.Column>
          <Grid.Column stretched mobile="10">
            <div className="ui fluid icon input">
              <input
                id="searchInput"
                className="searchInput"
                type={this.state.modeVal.input}
                placeholder=""
                onKeyPress={this.onEnterPress}
                onChange={this.handleUserInput}
              />
            </div>
          </Grid.Column>
          <Grid.Column stretched mobile="3">
            <button
              className="ui button"
              id="searchInputSubmit"
              onClick={onSubmit}
            >
              <i aria-hidden="true" className="search icon"></i>
              {this.state.modeVal.text}
            </button>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default ImageForm;
