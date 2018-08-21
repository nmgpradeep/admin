import React from "react";
import { FormGroup, FormFeedback, Label } from "reactstrap";
import TreeView from "react-simple-jstree";
const inputElement = props => {
  let inputElement = null;
  console.log('Props', props);
  const iterative = (newElements = [], lavel = 0) => {
    return newElements.map(newElement => {
      let baseCatClass = [];
      if (lavel === 0) {
        baseCatClass.push("base-category");
      }
      if (newElement.children && newElement.children.length) {
        let title = `${"_".repeat(lavel)} ${newElement.title}`;
        let option = (
          <option
            key={newElement._id}
            value={newElement._id}
            className={baseCatClass.join(" ")}
          >
            {title}
          </option>
        );
        lavel++;
        return option;
      }
      let title = `${"_".repeat(lavel)} ${newElement.title}`;

      let option = (
        <option
          key={newElement._id}
          value={newElement._id}
          className={baseCatClass.join(" ")}
        >
          {title}
        </option>
      );
      lavel = 0;
      return option;
    });
  };
  let inputClasses = ["form-control"];
  if (props.touched && !props.valid) {
    inputClasses.push("is-invalid");
  }
  switch (props.elementType) {
    case "input":
      inputElement = (
        <input
          {...props.elementConfig}
          onChange={props.changed}
          className={inputClasses.join(" ")}
          value={props.value}
        />
      );
      break;
    case "password":
      inputElement = (
        <input
          {...props.elementConfig}
          onChange={props.changed}
          className={inputClasses.join(" ")}
          value={props.value}
        />
      );
      break;
    case "textarea":
      inputElement = (
        <textarea
          {...props.elementConfig}
          onChange={props.changed}
          className={inputClasses.join(" ")}
          value={props.value}
        />
      );
      break;
    case "select":
      inputElement = (
        <select
          key={props.key}
          className={inputClasses.join(" ")}
          onChange={props.changed}
          value={props.value}
        >
          <option value="0" key="0">
            --Select--
          </option>
          {iterative(props.elementConfig.options, 0)}
        </select>
      );
      break;
    case "select-simple":
      inputElement = (
        <select
          key={props.key}
          className={inputClasses.join(" ")}
          onChange={props.changed}
          value={props.value}
        >
          <option value="0" key="0">
            --Select--
          </option>
          {props.elementConfig.options.map(option => {
			  return <option value={option._id} key={option._id}>
				{option[props.title]}
			  </option>
		  })}
        </select>
      );
      break;
    case "select-status":
      inputElement = (
        <select
          key={props.key}
          className={inputClasses.join(" ")}
          onChange={props.changed}
          value={props.value}
        >
         
          {props.elementConfig.options.map(option => {
			  return <option value={option._id} key={option._id}>
				{option.title}
			  </option>
		  })}
        </select>
      );
      break;
      
      
    case "tree":
      inputElement = (
        <TreeView
          treeData={{ core: { data: props.elementConfig.options } }}
          onChange={(e, data) => props.treechanged(e, data)}
        />
      );
      break;
    default:
      inputElement = (
        <input
          className={inputClasses.join(" ")}
          onChange={props.changed}
          {...props.elementConfig}
          value={props.value}
        />
      );
  }
  return (
    <FormGroup>
      <Label htmlFor={props.label}>{props.label}</Label>
      {inputElement}
      <FormFeedback className={!props.valid ? "invalid-feedback" : ""}>
        {props.message}
      </FormFeedback>
    </FormGroup>
  );
};
export default inputElement;
