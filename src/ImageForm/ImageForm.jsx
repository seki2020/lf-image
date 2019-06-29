import React, {Component} from 'react'
import {Input} from 'semantic-ui-react'

class ImageForm extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div class="ui fluid icon input">
                <button class="ui button">
                    <i aria-hidden="true" class="search icon"></i>
                    Search
                </button>
                <input type="text" placeholder="Search..."/>

            </div>
        )
    }
}

export default ImageForm