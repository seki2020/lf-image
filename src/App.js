import React, {Component} from 'react';
import './App.css';
import {Container, Header, Image, List} from 'semantic-ui-react'

import ImageForm from './ImageForm/ImageForm'
import ImageList from './ImageList/ImageList'

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            Images: [
                {
                    imgUrl: 'https://via.placeholder.com/150',
                    title: 'image1',
                    label1: '',
                    label2: '',
                    label3: '',
                    label4: '',
                },
                {
                    imgUrl: 'https://via.placeholder.com/150',
                    title: 'image2',
                    label1: '',
                    label2: '',
                    label3: '',
                    label4: '',
                }
            ]
        }
    }

    render() {
        return (
            <Container>

                <div className='search'>
                    <div className='search-comp'>
                        <ImageForm/>
                    </div>
                </div>
                <div className='image-list'>
                    <ImageList images={this.state.Images}/>
                </div>
                {/*<List animated verticalAlign='middle'>*/}
                {/*{*/}
                {/*this.state.Images.map((imageInfo) => {*/}
                {/*return (*/}
                {/*<ImageItem image={imageInfo}/>*/}
                {/*)*/}
                {/*})*/}
                {/*}*/}
                {/*</List>*/}
            </Container>
        )
    }

}

export default App;
