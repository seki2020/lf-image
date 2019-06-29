import React, {Component} from 'react'
import {Header, Image, Table} from 'semantic-ui-react'
import ImageItem from "../ImageItem/ImageItem";


export default class ImageList extends Component {
    constructor(props) {
        super(props)
        this.images = props.images
    }


    render() {
        return (
            <Table basic='very' celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Employee</Table.HeaderCell>
                        <Table.HeaderCell>Correct Guesses</Table.HeaderCell>
                        <Table.HeaderCell>Correct Guesses</Table.HeaderCell>
                        <Table.HeaderCell>Correct Guesses</Table.HeaderCell>
                        <Table.HeaderCell>Correct Guesses</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        this.images.map((img) => {
                            return (
                                <ImageItem image={img}/>
                            )
                        })
                    }

                </Table.Body>
            </Table>
        )
    }
}