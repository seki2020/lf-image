import React, {Component} from 'react'
import {Input} from 'semantic-ui-react'

class ImageForm extends Component {
    constructor(props) {
        super(props)
        this.onSearch = props.onSearch.bind(this)
        this.pressSearch = this.pressSearch.bind(this)
        this.handleUserInput = this.handleUserInput.bind(this)

    }

    handleUserInput(e) {
        debugger
        this.setState({
            queryUrl: e.target.value
        })
    }

    pressSearch() {
        this.props.onSearch(this.state.queryUrl)

    }

    render() {
        return (
            <div className="ui fluid icon input">
                <button className="ui button" onClick={this.pressSearch}>
                    <i aria-hidden="true" className="search icon"></i>
                    Search
                </button>
                <input type="text" placeholder="Search..." onChange={this.handleUserInput}/>

            </div>
        )
    }
}

export default ImageForm