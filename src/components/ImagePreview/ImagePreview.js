import React, { Component } from "react";
import { Button, List, Image, Modal, Icon } from "semantic-ui-react";
import moment from "moment";

class ImagePreview extends Component {
  render() {
    const api = this.props.imagePreview.apiResult;
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
              {api &&
                api.map((doc, index) => {
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
