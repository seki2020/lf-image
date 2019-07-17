import React from "react";
import { Segment, Label, Icon } from "semantic-ui-react";
export default props => (
  <div>
    {props.category.length > 0 && (
      <Segment>
        {props.category.map((label, index) => {
          return (
            <Label as="a" key={index}>
              {label}
            </Label>
          );
        })}
        <Label as="a" onClick={props.handleFilterClear}>
          <Icon name="close" />
        </Label>
      </Segment>
    )}
  </div>
);
