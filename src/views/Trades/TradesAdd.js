import React,{ Component }from 'react'
import {Link} from 'react-router-dom';
import axios from 'axios'
import UserSelectBox from '../SelectBox/UserSelectBox/UserSelectBox'
import ProductSelectBox from '../SelectBox/ProductSelectBox/ProductSelectBox'
import {
  
  Button,
  
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Label
} from 'reactstrap';
class TradeAdd extends Component {

  constructor(props){
    super(props)
    this.sellerId = React.createRef(),
    this.receiverId = React.createRef(),
    this.sellerProductId = React.createRef(),
    this.receiverProductId = React.createRef(),
    
    this.state = {
      addTrade: {},
      users : '',
      products : '',
      validation:{
        sellerId: {
          rules: {
            notEmpty: {
              message: 'Seller name can\'t be left blank',
              valid: false

            }
          },
          valid: null,
          message: ''
        },
        receiverId:{
          rules: {
            notEmpty: {
              message: 'Reciver name can\'t be left blank',
              valid: false
            }
          },
          valid: null,
          message: ''
        },
        sellerProductId: {
            rules: {
                notEmpty: {
                    message: 'Selled product can\'t be left blank',
                    valid: false
                }
            },
            valid: null,
            message: ''
        },
        receiverProductId: {
          rules: {
              notEmpty: {
                  message: 'Received product can\'t be left blank',
                  valid: false
              }
          },
          valid: null,
          message: ''
      }
      }
    } 
  }

  handleUser = (users) => {
        this.setState({users: users});
  }
  handleProduct = (products) => {
      this.setState({products:products});
  }
    
  submitHandler(e){
    e.preventDefault()
    let formSubmitFlag = true;
    for (let field in this.state.validation) {
     // let lastValidFieldFlag = true;
      let addTrade = this.state.validation;
      addTrade[field].valid = null;
      for(let fieldCheck in this.state.validation[field].rules){
        //~ switch(fieldCheck){
          //~ case 'notEmpty':
            //~ if(lastValidFieldFlag === true && this[field].value.length === 0){
                //~ lastValidFieldFlag = false;
                //~ formSubmitFlag = false;
                //~ addTestimonial[field].valid = false;
                //~ addTestimonial[field].message = addTestimonial[field].rules[fieldCheck].message;

             //~ }
            //~ break;
          
        //~ }
      }
      this.setState({ validation: addTrade});
    }
    if(formSubmitFlag){
    console.log("USERS",this.state.users)
    console.log("PRODUCTS",this.state.products)
      let addTrade = this.state.addTrade;
      addTrade.sellerId = this.state.users;
      addTrade.sellerProductId = this.state.products;
      addTrade.receiverId = this.state.users;
      addTrade.receiverProductId = this.state.products;
      console.log("addTrade",addTrade)
      axios.post('/trade/newTrade', addTrade  ).then(result => {
        if(result.data.code == '200'){
          this.props.history.push('./Trade');
        }
      })
    }
  }


  render(){
    return (
      <div>
        <Card>
              <CardHeader>
                <strong>New Trade Form</strong>
                <Link to="/trade" className="btn btn-success btn-sm pull-right">Back</Link>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="author">Seller Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <UserSelectBox onSelectUser={this.handleUser}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="author">Selled Product Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <ProductSelectBox onSelectProduct={this.handleProduct}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="author">Reciver Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <UserSelectBox onSelectUser={this.handleUser}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="author">Received Product Name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <ProductSelectBox onSelectProduct={this.handleProduct}/>
                    </Col>
                  </FormGroup>
                  
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="Status">Status</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <select innerRef={input => (this.status = input)} id="status" className="form-control" >
					  <option value="1">Active</option>
					  <option value="0">Inactive</option>					
                  </select>
                    </Col>
                  </FormGroup>                    
                </Form>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary"  onClick={(e)=>this.submitHandler(e)}><i className="fa fa-dot-circle-o"></i> Submit</Button>
                <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
              </CardFooter>
            </Card>
        
      </div>
    )
  }

}

export default TradeAdd;
