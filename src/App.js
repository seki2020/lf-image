import React, { Component } from "react";
import "./App.css";
import {
  Container,
  Dimmer,
  Loader,
  Modal,
  Button,
  Segment,
  Label,
  Image,
  Form,
  Input,
  Menu,
  Divider,
  Header,
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
      category: [],
      userInfo: {}
    };
    const self = this;

    setTimeout(() => {
      self.setState({ firstPage: false });
    }, 3000);

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        console.log("User sign in");
        self.setState({ userInfo: user });

        firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then(TOKEN => {
            axios
              .get(DOMAIN + "/webApi/api/v1/images?idToken=" + TOKEN)
              .then(res => {
                self.setState({
                  BackupImages: res.data,
                  Images: res.data,
                  loading: false,
                  labels: self.generateLabel(res.data),
                  labelsBackup: self.generateLabel(res.data)
                });
              });
          });
      } else {
        console.log("User sign out");
        self.setState({ userInfo: {} });
      }
    });

    this.handleSearch = this.handleSearch.bind(this);
    this.imagePreviewFunc = this.imagePreviewFunc.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.handleLabelClick = this.handleLabelClick.bind(this);
    this.handleFilterClear = this.handleFilterClear.bind(this);
    this.handleFilterRemove = this.handleFilterRemove.bind(this);
    this.handleUserSearch = this.handleUserSearch.bind(this);
    this.onSignUpSubmit = this.onSignUpSubmit.bind(this);
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
    if (!firebase.auth().currentUser) {
      alert("Please Login and try again.");
      return;
    }

    firebase
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true)
      .then(
        TOKEN => {
          this.setState({ loading: true });
          if (type === "url") {
            this.callDetectLabelApi(keyword, this, TOKEN);
          } else if (type === "file") {
            const userRef = storageRef.child(keyword.name);
            const self = this;
            userRef.put(keyword).then(snapshot => {
              if (snapshot.state === "success") {
                snapshot.ref.getDownloadURL().then(function(downloadURL) {
                  console.log("File available at", downloadURL);

                  self.callDetectLabelApi(downloadURL, self, TOKEN);
                });
              }
            });
          }
        },
        error => alert(error)
      );
  }

  callDetectLabelApi(imgUrl, self, idToken) {
    axios
      .post(DOMAIN + "/webApi/api/v1/images", {
        imgUrl: imgUrl,
        idToken: idToken
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

  onSignUpSubmit(e) {
    e.preventDefault();
    debugger;
    const username = document.querySelector("#signup-username").value;
    const psd = document.querySelector("#signup-password").value;

    firebase
      .auth()
      .createUserWithEmailAndPassword(username, psd)
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
  }
  toggleSignIn() {
    if (firebase.auth().currentUser) {
      // [START signout]
      firebase.auth().signOut();
      // [END signout]
    } else {
      const username = document.querySelector("#login-username").value;
      const psd = document.querySelector("#login-password").value;
      firebase
        .auth()
        .signInWithEmailAndPassword(username, psd)
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode === "auth/wrong-password") {
            alert("Wrong password.");
          } else {
            alert(errorMessage);
          }
          console.log(error);
          // document.getElementById('quickstart-sign-in').disabled = false;
          // [END_EXCLUDE]
        });
    }
  }

  render() {
    const { firstPage, labels, BackupImages, category } = this.state;

    const SignUpModal = () => (
      <Modal trigger={<Button>Sign Up</Button>}>
        <Modal.Header>Sign Up</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths="equal">
              <Form.Field
                label="Username"
                id="signup-username"
                control="input"
                placeholder=""
              />
              <Form.Field
                label="Password"
                id="signup-password"
                control="input"
                placeholder=""
              />
            </Form.Group>
            <Button type="submit" onClick={this.onSignUpSubmit}>
              Submit
            </Button>
            <Button type="reset">Cancel</Button>
            <Divider hidden />
          </Form>
        </Modal.Content>
      </Modal>
    );
    const LoginModal = () => (
      <Modal trigger={<Button>Login</Button>}>
        <Modal.Header>Login</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Group widths="equal">
              <Form.Field
                label="Username"
                id="login-username"
                control="input"
                placeholder=""
              />
              <Form.Field
                label="Password"
                id="login-password"
                control="input"
                placeholder=""
              />
            </Form.Group>
            <Button type="submit" onClick={this.toggleSignIn}>
              Submit
            </Button>
            <Button type="reset">Cancel</Button>
            <Divider hidden />
          </Form>
        </Modal.Content>
      </Modal>
    );

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

    // const userHeader = () => (
    //   <Header as='h2'>
    //     <Image circular src='https://firebasestorage.googleapis.com/v0/b/logical-fabric.appspot.com/o/usermanage%2Fpatrick.png?alt=media&token=df041a6b-8856-4d41-a5c0-8bc4d9583c8c' />
    //     {this.state.user.email}
    //   </Header>
    // )
    let UserInfo;
    if (this.state.userInfo.email) {
      UserInfo = (
        <Header>
          <Image
            className="m-right-10"
            circular
            src="https://firebasestorage.googleapis.com/v0/b/logical-fabric.appspot.com/o/usermanage%2Fpatrick.png?alt=media&token=df041a6b-8856-4d41-a5c0-8bc4d9583c8c"
          />
          <span className="m-right-10">{this.state.userInfo.email}</span>

          <Button onClick={this.toggleSignIn}>Sign Out</Button>
          <SignUpModal />
        </Header>
      );
    } else {
      UserInfo = (
        <Header>
          {this.state.userInfo.email}
          <LoginModal />
          <SignUpModal />
        </Header>
      );
    }

    return (
      <Container>
        <div className={firstPage ? "title" : "title-s"}>
          <h1 className="title-h1">Label Detect</h1>
        </div>
        <div className="user-form">{UserInfo}</div>
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
