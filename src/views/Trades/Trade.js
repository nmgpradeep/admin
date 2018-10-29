import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
import axios from 'axios';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';
var FD = require('form-data');
var fs = require('fs');

// import PropTypes from 'prop-types';
class Trade extends Component {
	constructor(props){
		super(props)
			this.state = {
				tradeStatus :[],
				conditionsShippingStatus :[]			
			};
	}

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

	componentWillMount(){
		axios.get('/trade/tradeStatus').then(result => {
           this.setState({tradeStatus: result.data.result});
       });
	   axios.get('/donation/getdonationshippingStatus').then(result => {
           this.setState({conditionshippingStatus: result.data.result});
       });
	}

  render() {
	   let tradeStatusOption;
	    if(this.state.tradeStatus){
			let statusOption = this.state.tradeStatus;
		    tradeStatusOption = statusOption.map(v => (<option value={v.id}>{v.name}</option>));
        }
      
	  let optionShippings;
	      if(this.state.conditionshippingStatus){
			let conditionsShippings = this.state.conditionshippingStatus;
		    optionShippings = conditionsShippings.map(v => (<option value={v.id}>{v.name}</option>));

        }
        
    return (
      <tr key={this.props.trade._id}>
        <td>{this.props.sequenceNo + 1} </td>
        <td>{(this.props.trade.offerTradeId && this.props.trade.offerTradeId.pitchUserId)?this.props.trade.offerTradeId.pitchUserId.firstName:''}</td>
        <td>{(this.props.trade.offerTradeId && this.props.trade.tradePitchProductId)?this.props.trade.tradePitchProductId.productName:''}</td>
        <td>{(this.props.trade.offerTradeId && this.props.trade.offerTradeId.SwitchUserId)?this.props.trade.offerTradeId.SwitchUserId.firstName:''}</td>
        <td>{(this.props.trade.offerTradeId && this.props.trade.tradeSwitchProductId)?this.props.trade.tradeSwitchProductId.productName:''}</td>
        <td>{ Moment(this.props.trade.createdAt).format('d MMM YYYY')} </td>
        <td>
         {/* <Badge color={(this.props.trade.status == '1')?'success':'danger'}>
              <If condition={this.props.trade.status == '1'}>
				<Then>Switch
				</Then>
				<ElseIf condition={this.props.trade.status === '2'}>
				  Completed
				  </ElseIf>
				<Else>
				  Rejected
				</Else>
			  </If>        
           </Badge> 
           {'  '}
           <Badge onClick={this.props.returnRaised.bind(this, this.props.trade)} color={(this.props.trade.Status == '1')?'success':'danger'}>           
               <If condition={this.props.trade.Status === '0'}>
                  <Then>{' '}</Then>				
			   <ElseIf condition={this.props.trade.Status === '1'}>
				    <If condition={this.props.trade.sendReturnStatus ==='1'}>
				      <Then> 
							Returned
				      </Then>
				       <Else> 
							Return				
				       </Else>
				     </If>
				  </ElseIf>
				<Else>
				  Rejected
				</Else>
			  </If>             
             
           </Badge> */}
                   
            <select id="select"
              innerRef={input => (this.shippingStatus = input)}
              className="dropdown-toggle btn btn-info"
              onChange={(e) => this.props.changeShippingStatus(e, this.props.trade._id)}
              value={this.props.trade.shippingStatus}>
			    {optionShippings}
		     </select>
      
        </td>
        <td>
             <select id="select"
              innerRef={input => (this.tradeStatus = input)}
              className="dropdown-toggle btn btn-info"
              onChange={(e) => this.props.returnRaised(e, this.props.trade._id)}
              value={this.props.trade.status}
              disabled={this.props.trade.shippingStatus !== "4"}>             
			    {tradeStatusOption}
		     </select>
        </td>
        <td>
          <Link to={'/trades/view/' + this.props.trade._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link>
        </td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default Trade;
