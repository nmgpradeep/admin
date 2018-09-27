import React, { Component } from 'react';
import { Alert, Form, Button, Card, CardBody, CardGroup, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import axios from 'axios';
import Select from 'react-styled-select'
import DropdownTreeSelect from 'react-dropdown-tree-select'
//import 'react-dropdown-tree-select/dist/styles.css'
import 'antd/dist/antd.css';

import { TreeSelect } from 'antd';
const TreeNode = TreeSelect.TreeNode;

class CategorySelectBox extends Component {
  constructor(props) {
    super(props);
    console.log("valuevaluevalue",this.props)  
    this.state = { value: 'Select Category', category : '',	data:[]};
    // this.onChange = this.onChange.bind(this)
   //  this.onDefaultValues(this.props.value)

  }

  //~ onChange(currentNode, selectedNodes) {
		//~ selectedNodes = currentNode;
		//~ console.log('State Properties', this.state,this.props);
		//~ console.log('currentNode', currentNode);
		//~ console.log('selectedNodes',selectedNodes);
  //~ }

  onChange = (value) => {
    //console.log(value);
    this.setState({value});
    this.props.onSelectCategory(value);
    this.setState({category:value});
  }

  onDefaultValues = (value) => {
    //this.setState({category:value});
    console.log('defaultvalue',value);
    this.props.onDefaultValuesSet(value);
  }

componetWillMount(){
	console.log("componetWillMount called")
}

  componentDidMount(){
    axios.get('/category/allCategories').then(result => {
      if(result.data.code === 200){
		  console.log("allCategories",result.data.result)
        this.setState({
          data: result.data.result,
        });
      }
    })
   .catch((error) => {
    console.log('error', error)
      if(error.code === 401) {
        this.props.history.push("/login");
      }
    });
  }

  render() {

    return (
      <TreeSelect
        style={{ width: 300 }}
        value={this.props.value}
        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
        treeData={this.state.data}
        placeholder="Please select"
        treeDefaultExpandAll
        onChange={this.onChange}
      />
    );

  }
}
export default CategorySelectBox;
