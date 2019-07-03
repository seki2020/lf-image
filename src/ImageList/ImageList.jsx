import React, {Component} from 'react'
import {Header, Image, Table} from 'semantic-ui-react'
import ImageItem from "../ImageItem/ImageItem";


export default class ImageList extends Component {
    render() {
        return (
            <Table basic='very' celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Image</Table.HeaderCell>
                        <Table.HeaderCell>Label 1</Table.HeaderCell>
                        <Table.HeaderCell>Label 2</Table.HeaderCell>
                        <Table.HeaderCell>Label 3</Table.HeaderCell>
                        <Table.HeaderCell>Label 4</Table.HeaderCell>
                        <Table.HeaderCell>Label 5</Table.HeaderCell>
                        <Table.HeaderCell>Upload Date</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        this.props.list.map((img, index) => {
                            return (
                                <ImageItem image={img} key={index} onPreview={this.props.onPreview}/>
                            )
                        })
                    }

                </Table.Body>
            </Table>
        )
    }
}