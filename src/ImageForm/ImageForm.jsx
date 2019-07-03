import React, {Component} from 'react'
import {Dropdown,Icon} from 'semantic-ui-react'

import './ImageForm.css'

const methodOptions = [
    {
        key: 'Search',
        text: 'Search',
        value: 'Search',
    },
    {
        key: 'Input',
        text: 'Input',
        value: 'Input',
    }];

const MODE = {
    search:'Search',
    input:'Input'
}

class ImageForm extends Component {
    constructor(props) {
        super(props)
        this.onSearch = props.onSearch.bind(this)
        this.pressSearch = this.pressSearch.bind(this)
        this.handleUserInput = this.handleUserInput.bind(this)
        this.handleModeChange = this.handleModeChange.bind(this)



        this.state = {
            modeVal:MODE.search
        }
    }

    handleUserInput(e) {
        this.setState({
            queryUrl: e.target.value
        })
    }

    pressSearch() {
        if(this.state.modeVal === MODE.input){
            this.props.onSearch(this.state.queryUrl)
        }else{
            alert('Search Mode WIP...')
        }

    }
    handleModeChange(e,option){
        this.setState({
            modeVal:option.value
        })
    }


    render() {
        return (

                <div className="ui fluid icon input">
                    <Dropdown
                        placeholder='Select Friend'
                        selection
                        value={this.state.modeVal}
                        onChange={this.handleModeChange}
                        options={methodOptions}
                    />

                    <input type="text"
                           className='searchInput'
                           placeholder='...'
                           onChange={this.handleUserInput}/>
                    <button className="ui button" onClick={this.pressSearch}>
                        <i aria-hidden="true" className="search icon"></i>
                        {this.state.modeVal}
                    </button>
                </div>

        )
    }
}

export default ImageForm