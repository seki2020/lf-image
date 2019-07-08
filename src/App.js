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
      currentImg: { imgUrl: "", apiResult: [] },
      modal: false,
      uploadImage: {},
      loading: false,
      firstPage: true
    };

    // const query = firebase.functions().httpsCallable("getAllRecord", {});
    // const self = this;
    // query().then(res => {
    //     self.setState({ Images: res.data, loading: false });
    // });
    const self = this;
    axios.get(DOMAIN + "/webApi/api/v1/images").then(res => {
      self.setState({ Images: res.data, loading: false });
    });

    setTimeout(() => {
      self.setState({ firstPage: false });
    }, 3000);

    this.handleSearch = this.handleSearch.bind(this);
    this.imagePreviewFunc = this.imagePreviewFunc.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
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
        debugger;
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

  render() {
    const { firstPage } = this.state;
    return (
      <Container>
        <div className={firstPage ? "title" : "title-s"}>
          {/* <div className={firstPage?'title':'title'} > */}
          <h1 className="title-h1">Label Detect</h1>
        </div>
        <Segment>
          <ImageForm onSearch={this.handleSearch} />
        </Segment>

        <Label.Group color="blue">
          <Label as="a">
            Happy
            <Label.Detail>22</Label.Detail>
          </Label>
          <Label as="a">Smart</Label>
          <Label as="a">Insane</Label>
          <Label as="a">Exciting</Label>
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
