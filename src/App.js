import React, { Component } from "react";
import { connect } from "react-redux";
import "./App.css";
import { Container, Dimmer, Loader, Label } from "semantic-ui-react";

import _ from "lodash";

import ImageForm from "./components/ImageForm/ImageForm";
import ImageList from "./components/ImageList/ImageList";
import ImagePreview from "./components/ImagePreview/ImagePreview";
import UserForm from "./components/UserForm/UserForm";
import Filter from "./components/Filter";

import firebase from "./Config/config";
// import 'firebase/database'
import axios from "axios";
import ImageFormConst from "./components/Constant/ImageFormConst.js";
import { loginSync } from "./redux/actions";

const storageRef = firebase.storage().ref();
//firestore

const AppTitle = props => (
  <div className={props.firstPage ? "title" : "title-s"}>
    <h1 className="title-h1">{props.title}</h1>
  </div>
);

const LabelsComp = props => (
  <Label.Group color="blue">
    {props.labels.map((label, index) => {
      return (
        <Label as="a" key={index} onClick={props.handleLabelClick}>
          {label}
        </Label>
      );
    })}
  </Label.Group>
);

class App extends Component {
  constructor(props) {
    super(props);

    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        console.log("User sign in");
        this.props.loginSync(user);
        this.setState({ loading: true });

        const TOKEN = await firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true);

        const res = await axios.get(
          process.env.REACT_APP_DOMAIN +
            "/webApi/api/v1/images?idToken=" +
            TOKEN
        );

        if (res.status === 200) {
          const labelValue = this.generateLabel(res.data);
          this.BACKUP.Images = res.data;
          this.BACKUP.Labels = labelValue;
          this.setState({
            Images: res.data,
            labels: labelValue
          });
        } else {
          console.log("get images error");
        }
        this.setState({ loading: false });
      } else {
        console.log("User sign out");
        this.BACKUP = {};
        this.setState({
          userInfo: {},
          isLogin: false,
          Images: [],
          category: [],
          labels: []
        });
      }
    });

    this.state = {
      Images: [],
      currentImg: { imgUrl: "", apiResult: [] },
      modal: false,
      loading: false,
      firstPage: false,
      labels: [],
      category: [],
      userInfo: {}
    };

    this.handleSearch = this.handleSearch.bind(this);
    this.imagePreviewFunc = this.imagePreviewFunc.bind(this);
    this.handleLabelClick = this.handleLabelClick.bind(this);
    this.handleFilterClear = this.handleFilterClear.bind(this);
    this.handleFilterRemove = this.handleFilterRemove.bind(this);
    this.handleUserSearch = this.handleUserSearch.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
  }

  BACKUP = {
    Images: [],
    Labels: []
  };

  generateLabel = images => {
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

    return Array.from(labelSet).filter(label => typeof label === "string");
  };

  handleSearch = async (keyword, type) => {
    if (!firebase.auth().currentUser) {
      alert("Please Login and try again.");
      return;
    }
    if (!keyword) {
      this.setState({
        loading: false,
        Images: this.BACKUP.Images,
        Labels: this.BACKUP.Labels
      });
    }

    this.setState({ loading: true });
    const TOKEN = await firebase
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true);

    //Upload image file from local
    if (type === ImageFormConst[0]) {
      this.callDetectLabelApi(keyword, this, TOKEN);
    }

    //Upload image url
    if (type === ImageFormConst[1]) {
      const userRef = storageRef.child(keyword.name);
      const snapshot = await userRef.put(keyword);

      if (snapshot.state === "success") {
        try {
          const downloadURL = await snapshot.ref.getDownloadURL();

          this.callDetectLabelApi(downloadURL, this, TOKEN);
        } catch (err) {
          console.log(err);
        }
      }
    }

    //Search image by label name
    if (type === ImageFormConst[2]) {
      const res = await axios.get(
        process.env.REACT_APP_DOMAIN +
          "/webApi/api/v1/images?idToken=" +
          TOKEN +
          "&kw=" +
          keyword
      );
      if (_.isEmpty(res.data)) {
        this.setState({ Images: [], labels: [], loading: false });
        return;
      }
      const labelsList = this.generateLabel(res.data);
      this.setState({ Images: res.data, labels: labelsList, loading: false });
      this.labelsBackup = labelsList;
    }
  };
  callDetectLabelApi = async (imgUrl, self, idToken) => {
    this.setState({ loading: true });
    const res = await axios.post(
      process.env.REACT_APP_DOMAIN + "/webApi/api/v1/images",
      {
        imgUrl: imgUrl,
        idToken: idToken
      }
    );
    if (res.data.code === "ENOENT") {
      this.setState({ Images: [], labels: [], loading: false });
      return;
    }
    if (res.status === 200) {
      let preState = self.state.Images;
      preState.unshift(res.data);

      self.setState({ Images: preState, loading: false });
    } else {
      alert("Please input a new image url.");
    }
    self.setState({ loading: false });
  };

  imagePreviewFunc = imgObj => {
    this.setState({
      currentImg: imgObj,
      modal: true
    });
  };

  handleLabelClick = e => {
    const des = e.target.text;
    const { Images } = this.state;
    const filter = [...this.state.category, des];
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
  };

  handleFilterClear = () => {
    this.setState({ Images: this.BACKUP.Images, category: [] });
  };

  handleFilterRemove = e => {
    this.setState({
      category: [...this.state.category].filter(
        category => category !== e.target.text
      )
    });
  };

  handleUserSearch = e => {
    const searchStr = e;
    const labelsBackup = this.BACKUP.Labels;
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
  };

  deleteImage = async imageId => {
    const id = this.state.currentImg.Id;
    if (!firebase.auth().currentUser) {
      alert("Please Login and try again.");
      return;
    }

    this.setState({ loading: true });
    const TOKEN = await firebase
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true);

    const { data } = await axios.delete(
      process.env.REACT_APP_DOMAIN +
        "/webApi/api/v1/image?idToken=" +
        TOKEN +
        "&imageId=" +
        id
    );

    this.setState({ loading: false });
    alert(data.message);
    if (data.status) {
      window.location.reload();
    }
  };

  render() {
    const { firstPage, labels, category } = this.state;

    return (
      <Container>
        <AppTitle title={process.env.REACT_APP_TITLE} firstPage={firstPage} />
        <UserForm />
        {this.props.isLogin && (
          <div>
            <ImageForm onSearch={this.handleSearch} />
            <Filter
              category={category}
              handleUserSearch={this.handleUserSearch}
              handleFilterClear={this.handleFilterClear}
            />
            <LabelsComp
              labels={labels}
              handleLabelClick={this.handleLabelClick}
            />
            <ImageList
              list={this.state.Images}
              onPreview={this.imagePreviewFunc}
            />
            <ImagePreview
              imagePreview={this.state.currentImg}
              open={this.state.modal}
              modelClose={() => this.setState({ modal: false })}
              deleteImage={this.deleteImage}
            />
          </div>
        )}

        <Dimmer active={this.state.loading} inverted>
          <Loader size="large">Loading</Loader>
        </Dimmer>
      </Container>
    );
  }
}

const mapStateToProps = state => state;

export default connect(
  mapStateToProps,
  { loginSync }
)(App);
