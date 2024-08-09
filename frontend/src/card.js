import React from 'react';

// the Card component allows all of the other components to reference this component and pass features that are relevant to the component
function Card(props) {
    function classes() {
      // use background color that was set if there is one; otherwise, use the default
      const bg = props.bgcolor ? "bg-" + props.bgcolor : "";
      // use text color that was set if there is one; otherwise, use white text
      const text = props.txtcolor ? "text-" + props.txtcolor : "text-white";
      return "card mb-3" + " " + bg + " " + text + " " + "d-inline-flex p-2";
    }
  
    return (
      <div className={classes()} style={{ width: "inherit" }}>
        <div className="card-header"> {props.header} </div>
        <div className="card-body">
          {props.title && <h5 className="card-title"> {props.title} </h5>}
          {props.text && <p className="card-text"> {props.text} </p>}
          {props.body}
          {props.status && <div id="createStatus"> {props.status} </div>}
        </div>
      </div>
    );
  }
  
  export default Card;