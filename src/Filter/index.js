import React from "react"
import { Segment, Label, Icon } from "semantic-ui-react"
export default props => (
  <Segment>
    <div className="ui icon input m-right-10">
      <input
        className="searchInput"
        placeholder="Search"
        onChange={props.handleUserSearch}
      />
    </div>
    {props.category.length > 0 && (
      <span>
        {props.category.map((label, index) => {
          return (
            <Label as="a" key={index}>
              {label}
            </Label>
          )
        })}
        <Label as="a" onClick={props.handleFilterClear}>
          <Icon name="close" />
        </Label>
      </span>
    )}
  </Segment>
)
