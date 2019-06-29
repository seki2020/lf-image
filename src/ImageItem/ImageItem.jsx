import React, {Component} from 'react'
import {Table, Image, List} from 'semantic-ui-react'

class ImageItem extends Component {
    constructor(props) {
        super(props)

        this.image = props.image;
    }

    render() {
        return (
            <Table.Row>
                <Table.Cell>
                    <Image src={this.image.imgUrl}
                           size='tiny'
                           verticalAlign='middle'/>
                </Table.Cell>
                <Table.Cell>title</Table.Cell>
                <Table.Cell>title</Table.Cell>
                <Table.Cell>title</Table.Cell>
                <Table.Cell>title</Table.Cell>
            </Table.Row>
        )
    }
}

export default ImageItem