import React, { Component } from "react"
import { Table, Image, List } from "semantic-ui-react"
import moment from "moment"
import "./ImageItem.css"

class ImageItem extends Component {
  constructor(props) {
    super(props)
    this.clickImage = this.clickImage.bind(this)
  }

  clickImage() {
    this.props.onPreview(this.props.image)
  }
  render() {
    const apiResult = this.props.image.apiResult
    return (
      <Table.Row>
        <Table.Cell>
          <Image
            src={this.props.image.imgUrl}
            className="responsive-image"
            onClick={this.clickImage}
            verticalAlign="middle"
          />
        </Table.Cell>
        {apiResult.map((item, index) => {
          if (index < 5) {
            return (
              <Table.Cell key={index}>
                <p className="description">{item.description}</p>
                <p>{Math.round(item.score * 10000) / 100 + "%"}</p>
              </Table.Cell>
            )
          }
        })}
        <Table.Cell>
          <p>
            {new moment(this.props.image.timestamp).format("YYYY-M-D hh:mm")}
          </p>
        </Table.Cell>
      </Table.Row>
    )
  }
}

export default ImageItem
