import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import axios from 'axios';

// import PropTypes from 'prop-types';
class DonationView extends Component {
  constructor(props){
    super(props);
    this.condition = React.createRef();
    this.state = {
      viewDonation: [],
      condition :[],
      donationId: this.props.match.params.id
    };
  }
   cancelHandler(){
     this.props.history.push("/donations");
   }
   
  componentDidMount() {
       axios.get('/donation/getConstant').then(result => {
           this.setState({conditions: result.data.result});            
       });
      axios.get('/donation/viewDonation/' + this.state.donationId).then(result => {
        if(result.data.code === 200){
          this.setState({ viewDonation: result.data.result});
          this.productName.value = result.data.result.productName;
          this.description.value = result.data.result.description;
          this.productCategory.value = result.data.result.productCategory.title;
          this.color.value = result.data.result.color;
          this.userId.value = result.data.result.userId.firstName;           
          this.condition.value = result.data.result.condition;    
          this.productAge.value = result.data.result.productAge; 
          this.productImage.value = result.data.result.productImage;
        }
      })
      .catch((error) => {
        if(error.status === 401) {
          this.props.history.push("/login");
        }
      });
  }
  render() {
	  let optionTemplate;
	    if(this.state.conditions){
			let conditionsList = this.state.conditions;
		    optionTemplate = conditionsList.map(v => (<option value={v.id}>{v.name}</option>));
       }
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Card>
              <CardHeader>
                <strong>Donation</strong>
                <small> View</small>
                 <Link to={'/donations/edit/' + this.state.viewDonation._id} className="btn btn-success btn-sm pull-right">Edit Product</Link>
              </CardHeader>
              <CardBody>
                <FormGroup>
                  <Label htmlFor="id">ID</Label>
                  <Input type="text" value={this.state.viewDonation._id} />
                </FormGroup>
                <Row>
                  <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="company">Product name</Label>
                      <Input type="text" innerRef={input => (this.productName= input)} />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="description">Description</Label>
                      <Input type="text" innerRef={input => (this.description= input)} />
                    </FormGroup>
                    </Col>
                    <Col xs="4" sm="12">
                    <FormGroup>
                      <Label htmlFor="Product Category">Product Category</Label>
                      <Input type="text" value={this.state.viewDonation.size?this.state.viewDonation.size.size:""} />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label htmlFor="UserId">User Id</Label>
                  <Input type="text" value={this.state.viewDonation.userId?this.state.viewDonation.userId.firstName:""} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="size">Size</Label>
                   <Input type="text" value={this.state.viewDonation.size?this.state.viewDonation.size.size:""} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="color">Color</Label>
                  <Input type="text" value={this.state.viewDonation.color} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="brand">Brand</Label>
                  <Input type="text" value={this.state.viewDonation.brand?this.state.viewDonation.brand.brandName:""} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="productAge">Age Of Item</Label>
                  <Input type="text" innerRef={input => (this.productAge = input)} value={this.state.viewDonation.productAge}  required/>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="productAge">Condition</Label>
                   <select id="select"  value={this.state.viewDonation.condition} className="form-control" disabled>
					  {optionTemplate}
				   </select> 	
                </FormGroup>
                <FormGroup>
                <Col xs="12" className="text-left">
                  <Label htmlFor="status">Image</Label>
                   </Col>
                  <Col xs="12" sm="12">
                  <img className="linkedin" src={'assets/uploads/donationImage/'+this.state.viewDonation.productImage} width="60" alt="Donation Image"/>
                  </Col>                  
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="status">Status</Label>
                  <Input type="text" value={(this.state.viewDonation.productStatus === '1')?'Active':'Inactive'} />
                </FormGroup>
                <Row>
                  <Col xs="6" className="text-right">
                    <Button onClick={()=>this.cancelHandler()} color="primary" className="px-4">Cancel</Button>
                  </Col>
                  <Col xs="6">
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        </div>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
//};
export default DonationView;
