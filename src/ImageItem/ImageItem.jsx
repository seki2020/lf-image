import React, {Component} from 'react'
import {Table, Image, List} from 'semantic-ui-react'
import moment from 'moment'

class ImageItem extends Component {
    constructor(props) {
        super(props)
        this.clickImage = this.clickImage.bind(this)

    }

    clickImage() {

        this.props.onPreview(this.props.image);
    }
    render() {
        return (
            <Table.Row>
                <Table.Cell>
                    <Image src={this.props.image.imgUrl}
                           size='tiny'
                           onClick={this.clickImage}
                           verticalAlign='middle'/>
                </Table.Cell>
                {
                    (this.props.image.apiResult).map((item, index) => {
                        if (index < 5) {
                            return (

                                <Table.Cell key={index}>{item.description}
                                    <p>{(Math.round(item.score * 10000) / 100) + '%'}</p>
                                </Table.Cell>
                            )
                        }

                    })
                }
                <Table.Cell>
                    <p>{new moment(this.props.timestamp).format('YYYY-M-D')}</p>
                </Table.Cell>
            </Table.Row>
        )
    }
}

export default ImageItem