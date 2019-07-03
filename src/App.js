import React, {Component} from 'react';
import './App.css';
import {Container, Header, Image, List} from 'semantic-ui-react'

import ImageForm from './ImageForm/ImageForm'
import ImageList from './ImageList/ImageList'
import ImagePreview from './ImagePreview/ImagePreview'

import firebase from './Config/config'
// import 'firebase/database'
import "firebase/functions"
import axios from 'axios'

const storageRef = firebase.storage().ref();
//firestore
// import admin from 'firebase-admin'

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            queryString: '',
            Images: [],
            currentImg: {imgUrl: '', apiResult: []},
            modal: false,
            uploadImage:{}
        }

        const query = firebase.functions().httpsCallable('getAllRecord', {});
        const self = this;
        query().then((res) => {
            self.setState({"Images": res.data})
        })

        this.handleSearch = this.handleSearch.bind(this)
        this.imagePreviewFunc = this.imagePreviewFunc.bind(this)
        this.toggleModal = this.toggleModal.bind(this)

    }

    handleSearch(keyword, type) {
        if (type === 'url') {
            const self = this
            const queryLabel = firebase.functions().httpsCallable('detectLabel?imgUrl=' + keyword, {});
            queryLabel().then(function (res) {
                    if (!res) alert('Please input a new image url.')
                    const previousImages = self.state.Images
                    previousImages.unshift(res.data)

                    self.setState({"Images": previousImages})
                })
        } else if (type === 'file') {
            //todo...
            const userRef = storageRef.child(keyword.name);
            const self = this
            userRef.put(keyword).then((snapshot)=>{
                debugger
                if(snapshot.state === 'success'){
                    snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        console.log('File available at', downloadURL);
                        const queryLabel = firebase.functions().httpsCallable('detectLabel?imgUrl=' + downloadURL, {});
                        queryLabel().then(function (res) {
                            const previousImages = self.state.Images
                            previousImages.unshift(res.data)

                            self.setState({"Images": previousImages})
                        })

                    });
                }
            })

        }

    }

    imagePreviewFunc(imgObj) {
        this.setState({
            'currentImg': imgObj,
            modal: true
        })
    }

    toggleModal() {
        this.setState({
            modal: false
        })
    }

    render() {
        return (
            <Container>
                <div className='search'>
                    <div className='search-comp'>
                        <ImageForm onSearch={this.handleSearch}/>
                    </div>
                </div>
                <div className='image-list'>
                    <ImageList list={this.state.Images} onPreview={this.imagePreviewFunc}/>
                </div>
                <ImagePreview imagePreview={this.state.currentImg}
                              open={this.state.modal}
                              modelClose={this.toggleModal}/>
            </Container>
        )
    }

}

export default App;
