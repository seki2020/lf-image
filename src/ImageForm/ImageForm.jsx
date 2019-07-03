import React, {Component} from 'react'
import {Dropdown,Icon} from 'semantic-ui-react'
import _ from 'lodash'
import './ImageForm.css'

const methodOptions = [
    {
        key: 'File',
        text: 'File',
        value: 'File',
    },
    {
        key: 'Input',
        text: 'Input',
        value: 'Input',
    }];

const MODE = {
    search:'File',
    input:'Input'
}
const INPUTTYPE={
    'File':'file',
    'Input':'text'
}

class ImageForm extends Component {
    constructor(props) {
        super(props)
        this.onSearch = props.onSearch.bind(this)
        this.pressSearch = this.pressSearch.bind(this)
        this.handleUserInput = this.handleUserInput.bind(this)
        this.handleModeChange = this.handleModeChange.bind(this)



        this.state = {
            modeVal:MODE.search,
        }
    }

    handleUserInput(e) {
        debugger
        if(e.target.type === 'text'){
            this.setState({
                queryUrl: e.target.value
            })
        }
        if(e.target.type==='file'){
            this.setState({
                queryUrl: e.target.files[0]
            })
        }

    }

    pressSearch() {
        if(this.state.modeVal === MODE.input){
            this.props.onSearch(this.state.queryUrl,'url')
        }else{
            this.props.onSearch(this.state.queryUrl,'file')
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

                    <input type={INPUTTYPE[this.state.modeVal]}
                           className='searchInput'
                           placeholder='...'
                           onChange={this.handleUserInput}/>
                    <button className="ui button" onClick={_.throttle(this.pressSearch, 2000, { 'trailing': false })}>
                        <i aria-hidden="true" className="search icon"></i>
                        {this.state.modeVal}
                    </button>
                </div>

        )
    }
}

export default ImageForm