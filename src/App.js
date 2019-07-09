import React, { Component } from "react";
import "./App.css";
import {
  Container,
  Dimmer,
  Loader,
  Transition,
  Segment,
  Label,
  Icon
} from "semantic-ui-react";

import ImageForm from "./ImageForm/ImageForm";
import ImageList from "./ImageList/ImageList";
import ImagePreview from "./ImagePreview/ImagePreview";

import firebase from "./Config/config";
// import 'firebase/database'
import "firebase/functions";
import axios from "axios";

// const DOMAIN = "https://us-central1-logical-fabric.cloudfunctions.net/";
const DOMAIN = "http://localhost:5000/logical-fabric/us-central1";

const storageRef = firebase.storage().ref();
//firestore
// import admin from 'firebase-admin'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryString: "",
      Images: [],
      BackupImages: [],
      currentImg: { imgUrl: "", apiResult: [] },
      modal: false,
      uploadImage: {},
      loading: false,
      firstPage: true,
      labels: [],
      labelsBackup: [],
      category: []
    };
    const self = this;
    axios.get(DOMAIN + "/webApi/api/v1/images").then(res => {
      self.setState({
        BackupImages: res.data,
        Images: res.data,
        loading: false,
        labels: this.generateLabel(res.data),
        labelsBackup: this.generateLabel(res.data)
      });
    });

    setTimeout(() => {
      self.setState({ firstPage: false });
    }, 3000);

    this.handleSearch = this.handleSearch.bind(this);
    this.imagePreviewFunc = this.imagePreviewFunc.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleLabelClick = this.handleLabelClick.bind(this);
    this.handleFilterClear = this.handleFilterClear.bind(this);
    this.handleFilterRemove = this.handleFilterRemove.bind(this);
    this.handleUserSearch = this.handleUserSearch.bind(this);
  }

  generateLabel(images) {
    const labelSet = new Set();
    images.forEach(img => {
      labelSet.add(
        img.apiResult.map(res => {
          if (res.description) {
            labelSet.add(res.description);
          }
        })
      );
    });

    return Array.from(labelSet).filter(label => typeof label == "string");
  }

  handleSearch(keyword, type) {
    this.setState({ loading: true });
    if (type === "url") {
      this.callDetectLabelApi(keyword, this);
    } else if (type === "file") {
      const userRef = storageRef.child(keyword.name);
      const self = this;
      userRef.put(keyword).then(snapshot => {
        if (snapshot.state === "success") {
          snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log("File available at", downloadURL);

            self.callDetectLabelApi(downloadURL, self);
          });
        }
      });
    }
  }

  callDetectLabelApi(imgUrl, self) {
    axios
      .post(DOMAIN + "/webApi/api/v1/images", {
        imgUrl: imgUrl
      })
      .then(res => {
        if (!res.data) alert("Please input a new image url.");
        let preState = self.state.Images;
        preState.unshift(res.data);

        self.setState({ Images: preState, loading: false });
      });
  }

  imagePreviewFunc(imgObj) {
    this.setState({
      currentImg: imgObj,
      modal: true
    });
  }

  toggleModal() {
    this.setState({
      modal: false
    });
  }

  handleLabelClick(e) {
    debugger;
    const des = e.target.text;
    const { Images } = this.state;
    const filter = [...this.state.category, des];
    // const mode = filter.length>0?this.state.BackImages:this.state.Images
    this.setState({
      category: filter,
      Images: Images.filter(image => {
        return (
          image.apiResult.filter(api => {
            return api.description === des;
          }).length > 0
        );
      })
    });
  }
  handleFilterClear() {
    this.setState({ Images: this.state.BackupImages, category: [] });
  }
  handleFilterRemove(e) {
    debugger;
    this.setState({
      category: [...this.state.category].filter(
        category => category != e.target.text
      )
    });
  }
  handleUserSearch(e) {
    const searchStr = e.target.value;
    const { labels, labelsBackup } = this.state;
    if (!searchStr) {
      this.setState({ labels: [...labelsBackup] });
    }
    if (searchStr.length >= 1) {
      const resLabels = labelsBackup.filter(
        label =>
          label
            .toLowerCase()
            .trim()
            .indexOf(searchStr.toLowerCase().trim()) > -1
      );
      this.setState({ labels: resLabels });
    }
  }

  render() {
    const { firstPage, labels, BackupImages, category } = this.state;

    let closeBtn;
    if (category.length > 0) {
      closeBtn = (
        <span>
          {category.map((label, index) => {
            return (
              <Label as="a" key={index}>
                {label}
              </Label>
            );
          })}
          <Label as="a" onClick={this.handleFilterClear}>
            <Icon name="close" />
          </Label>
        </span>
      );
    }
    return (
      <Container>
        <div className={firstPage ? "title" : "title-s"}>
          {/* <div className={firstPage?'title':'title'} > */}
          <h1 className="title-h1">Label Detect</h1>
        </div>
        <Segment>
          <ImageForm onSearch={this.handleSearch} />
        </Segment>
        <Segment>
          <div className="ui icon input m-right-10">
            <input
              className="searchInput"
              placeholder="Search"
              onChange={this.handleUserSearch}
            />
          </div>
          {closeBtn}
        </Segment>
        <Label.Group color="blue">
          {labels.map((label, index) => {
            return (
              <Label as="a" key={index} onClick={this.handleLabelClick}>
                {label}
              </Label>
            );
          })}
        </Label.Group>
        <Segment>
          <ImageList
            list={this.state.Images}
            onPreview={this.imagePreviewFunc}
          />
        </Segment>

        <ImagePreview
          imagePreview={this.state.currentImg}
          open={this.state.modal}
          modelClose={this.toggleModal}
        />
        <Dimmer active={this.state.loading} inverted>
          <Loader size="large">Loading</Loader>
        </Dimmer>
      </Container>
    );
  }
}

export default App;
