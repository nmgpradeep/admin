import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Badge} from 'reactstrap';
import Moment from 'moment';
import { If, Then, ElseIf, Else } from 'react-if-elseif-else-render';


// import PropTypes from 'prop-types';
class Trade extends Component {
	
  render() {
    return (
   
      <tr key={this.props.trade._id}>
        <td>{this.props.sequenceNo + 1} </td>
        <td>{(this.props.trade.sellerId)?this.props.trade.sellerId.firstName:''}</td>
        <td>{(this.props.trade.sellerProductId)?this.props.trade.sellerProductId.productName:''}</td>
        <td>{(this.props.trade.receiverId)?this.props.trade.receiverId.firstName:''}</td>
        <td>{(this.props.trade.receiverProductId)?this.props.trade.receiverProductId.productName:''}</td>
        <td>{ Moment(this.props.trade.createdAt).format('d MMM YYYY')} </td>
        <td>
          <Badge color={(this.props.trade.Status == '1')?'success':'danger'}>
              <If condition={this.props.trade.Status == '0'}>
				<Then>Switch
				</Then>
				<ElseIf condition={this.props.trade.Status === '1'}>
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
             
           </Badge>
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
