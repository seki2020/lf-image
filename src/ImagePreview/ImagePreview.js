import React, { Component } from "react";
import { Button, List, Image, Modal, Icon } from "semantic-ui-react";
import moment from "moment";

class ImagePreview extends Component {
  // constructor(props){
  //     super(props)
  //     // this.handleClose = this.handleClose.bind(this)
  //     // this.state={
  //     //     modalOpen:props.open
  //     // }
  // }
  // handleClose(){
  //     this.props.modelClose()
  // }
  render() {
    return (
      <Modal open={this.props.open}>
        <Modal.Header>
          {new moment(this.props.imagePreview.timestamp).format(
            "YYYY-M-D hh:mm"
          )}
        </Modal.Header>
        <Modal.Content image>
          <Image wrapped size="medium" src={this.props.imagePreview.imgUrl} />
          <Modal.Description>
            <List>
              {this.props.imagePreview.apiResult.map((doc, index) => {
                return <List.Item key={index}>{doc.description}</List.Item>;
              })}
            </List>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={this.props.deleteImage} inverted>
            <Icon name="checkmark" /> Delete
          </Button>
          <Button color="green" onClick={this.props.modelClose} inverted>
            <Icon name="checkmark" /> Close
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ImagePreview;
