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

const DOMAIN = "https://us-central1-logical-fabric.cloudfunctions.net/";

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
      category: []
    };
    const self = this;
    axios.get(DOMAIN + "/webApi/api/v1/images").then(res => {
      self.setState({
        BackupImages: res.data,
        Images: res.data,
        loading: false,
        labels: this.generateLabel(res.data)
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
    // this.handleFilterRemove = this.handleFilterRemove.bind(this);
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
      const self = this;

      axios
        .post(DOMAIN + "/webApi/api/v1/images", {
          imgUrl: keyword
        })
        .then(res => {
          if (!res.data) alert("Please input a new image url.");
          let preState = self.state.Images;
          preState.unshift(res.data);

          self.setState({ Images: preState, loading: false });
        });
    } else if (type === "file") {
      //todo...
      const userRef = storageRef.child(keyword.name);
      const self = this;
      userRef.put(keyword).then(snapshot => {
        if (snapshot.state === "success") {
          snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log("File available at", downloadURL);
            const queryLabel = firebase
              .functions()
              .httpsCallable("detectLabel?imgUrl=" + downloadURL, {});
            queryLabel().then(function(res) {
              const previousImages = self.state.Images;
              previousImages.unshift(res.data);

              self.setState({ Images: previousImages, loading: false });
            });
          });
        }
      });
    }
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
    const filter = [...this.state.category, des];
    // const mode = filter.length>0?this.state.BackImages:this.state.Images
    this.setState({
      category: [des],
      Images: this.state.BackupImages.filter(image => {
        return (
          image.apiResult.filter(api => {
            // return filter.filter(f => {
            //   return api.description === f
            // }).length > 0
            return api.description === des;
          }).length > 0
        );
      })
    });
  }
  handleFilterClear() {
    this.setState({ Images: this.state.BackupImages, category: [] });
  }
  // handleFilterRemove(e) {
  //   debugger
  //   this.setState({ category: [...this.state.category].filter(category => category != e.target.text) })
  // }

  render() {
    const { firstPage, labels, BackupImages, category } = this.state;
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
          {/* <Label as="a" color="red" onClick={this.handleFilterClear}>CLEAR FILTER</Label> */}
          {category.map((label, index) => {
            return (
              <Label as="a" key={index} onClick={this.handleFilterClear}>
                {label}
                <Icon name="close" />
              </Label>
            );
          })}
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
