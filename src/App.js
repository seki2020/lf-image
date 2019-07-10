import React, { Component } from "react"
import "./App.css"
import { Container, Dimmer, Loader, Segment, Label } from "semantic-ui-react"

import ImageForm from "./ImageForm/ImageForm"
import ImageList from "./ImageList/ImageList"
import ImagePreview from "./ImagePreview/ImagePreview"
import UserForm from "./UserForm/UserForm"
import Filter from "./Filter"

import firebase from "./Config/config"
// import 'firebase/database'
import "firebase/functions"
import axios from "axios"

const DOMAIN = "https://us-central1-logical-fabric.cloudfunctions.net/"
// const DOMAIN = "http://localhost:5000/logical-fabric/us-central1";

const storageRef = firebase.storage().ref()
//firestore
// import admin from 'firebase-admin'

const AppTitle = props => (
  <div className={props.firstPage ? "title" : "title-s"}>
    <h1 className="title-h1">{props.title}</h1>
  </div>
)

const LabelsComp = props => (
  <Label.Group color="blue">
    {props.labels.map((label, index) => {
      return (
        <Label as="a" key={index} onClick={props.handleLabelClick}>
          {label}
        </Label>
      )
    })}
  </Label.Group>
)

class App extends Component {
  constructor(props) {
    super(props)
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
    }
    const self = this

    setTimeout(() => {
      self.setState({ firstPage: false })
    }, 3000)

    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        // User is signed in.
        console.log("User sign in")
        self.setState({ userInfo: user })

        const TOKEN = await firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)

        const res = await axios.get(
          DOMAIN + "/webApi/api/v1/images?idToken=" + TOKEN
        )

        if (res.status == 200) {
          self.setState({
            BackupImages: res.data,
            Images: res.data,
            loading: false,
            labels: self.generateLabel(res.data),
            labelsBackup: self.generateLabel(res.data)
          })
        } else {
          console.log("get images error")
        }
      } else {
        console.log("User sign out")
        self.setState({
          userInfo: {},
          Images: [],
          BackupImages: [],
          category: [],
          labels: [],
          labelsBackup: []
        })
      }
    })

    this.handleSearch = this.handleSearch.bind(this)
    this.imagePreviewFunc = this.imagePreviewFunc.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.handleLabelClick = this.handleLabelClick.bind(this)
    this.handleFilterClear = this.handleFilterClear.bind(this)
    this.handleFilterRemove = this.handleFilterRemove.bind(this)
    this.handleUserSearch = this.handleUserSearch.bind(this)
    this.onSignUpSubmit = this.onSignUpSubmit.bind(this)
  }

  generateLabel = images => {
    const labelSet = new Set()
    images.forEach(img => {
      labelSet.add(
        img.apiResult.map(res => {
          if (res.description) {
            labelSet.add(res.description)
          }
        })
      )
    })

    return Array.from(labelSet).filter(label => typeof label == "string")
  }

  handleSearch = async (keyword, type) => {
    if (!firebase.auth().currentUser) {
      alert("Please Login and try again.")
      return
    }

    const TOKEN = await firebase
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true)

    this.setState({ loading: true })

    if (type === "url") {
      this.callDetectLabelApi(keyword, this, TOKEN)
    }
    if (type === "file") {
      const userRef = storageRef.child(keyword.name)
      const self = this
      const snapshot = await userRef.put(keyword)

      if (snapshot.state === "success") {
        try {
          const downloadURL = await snapshot.ref.getDownloadURL()

          self.callDetectLabelApi(downloadURL, self, TOKEN)
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
  callDetectLabelApi = async (imgUrl, self, idToken) => {
    const res = axios.post(DOMAIN + "/webApi/api/v1/images", {
      imgUrl: imgUrl,
      idToken: idToken
    })
    if (res.status == 200) {
      let preState = self.state.Images
      preState.unshift(res.data)

      self.setState({ Images: preState, loading: false })
    } else {
      alert("Please input a new image url.")
    }
  }

  imagePreviewFunc = imgObj => {
    this.setState({
      currentImg: imgObj,
      modal: true
    })
  }

  toggleModal = () => {
    this.setState({
      modal: false
    })
  }

  handleLabelClick = e => {
    const des = e.target.text
    const { Images } = this.state
    const filter = [...this.state.category, des]
    this.setState({
      category: filter,
      Images: Images.filter(image => {
        return (
          image.apiResult.filter(api => {
            return api.description === des
          }).length > 0
        )
      })
    })
  }
  handleFilterClear = () => {
    this.setState({ Images: this.state.BackupImages, category: [] })
  }
  handleFilterRemove = e => {
    this.setState({
      category: [...this.state.category].filter(
        category => category != e.target.text
      )
    })
  }
  handleUserSearch = e => {
    const searchStr = e.target.value
    const { labelsBackup } = this.state
    if (!searchStr) {
      this.setState({ labels: [...labelsBackup] })
    }
    if (searchStr.length >= 1) {
      const resLabels = labelsBackup.filter(
        label =>
          label
            .toLowerCase()
            .trim()
            .indexOf(searchStr.toLowerCase().trim()) > -1
      )
      this.setState({ labels: resLabels })
    }
  }

  onSignUpSubmit = e => {
    e.preventDefault()
    const username = document.querySelector("#signup-username").value
    const psd = document.querySelector("#signup-password").value

    firebase
      .auth()
      .createUserWithEmailAndPassword(username, psd)
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        // ...
      })
  }
  toggleSignIn = () => {
    if (firebase.auth().currentUser) {
      // [START signout]
      firebase.auth().signOut()
      // [END signout]
    } else {
      const username = document.querySelector("#login-username").value
      const psd = document.querySelector("#login-password").value
      firebase
        .auth()
        .signInWithEmailAndPassword(username, psd)
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code
          var errorMessage = error.message
          // [START_EXCLUDE]
          if (errorCode === "auth/wrong-password") {
            alert("Wrong password.")
          } else {
            alert(errorMessage)
          }
          console.log(error)
          // document.getElementById('quickstart-sign-in').disabled = false;
          // [END_EXCLUDE]
        })
    }
  }

  render() {
    const { firstPage, labels, userInfo, category } = this.state

    return (
      <Container>
        <AppTitle title="Detect Image Label" firstPage={firstPage} />
        <UserForm
          userInfo={userInfo}
          onSignUpSubmit={this.onSignUpSubmit}
          toggleSignIn={this.toggleSignIn}
        />
        <ImageForm onSearch={this.handleSearch} />
        r
        <Filter
          category={category}
          handleUserSearch={this.handleUserSearch}
          handleFilterClear={this.handleFilterClear}
        />
        <LabelsComp labels={labels} handleLabelClick={this.handleLabelClick} />
        <ImageList list={this.state.Images} onPreview={this.imagePreviewFunc} />
        <ImagePreview
          imagePreview={this.state.currentImg}
          open={this.state.modal}
          modelClose={this.toggleModal}
        />
        <Dimmer active={this.state.loading} inverted>
          <Loader size="large">Loading</Loader>
        </Dimmer>
      </Container>
    )
  }
}

export default App
