import React, { Component } from 'react';
import { Link } from "react-router-dom";
import ReactExport from "react-data-export";
import { Badge} from 'reactstrap';
import Moment from 'moment';

// import PropTypes from 'prop-types';
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

class Transaction extends Component {
  constructor(props){
       super(props);
  }
  render() {
	   const dataSet1 = [
		{
			name: "Johson",
			amount: 30000,
			sex: 'M',
			is_married: true
		},
		{
			name: "Monika",
			amount: 355000,
			sex: 'F',
			is_married: false
		},
		{
			name: "John",
			amount: 250000,
			sex: 'M',
			is_married: false
		},
		{
			name: "Josef",
			amount: 450500,
			sex: 'M',
			is_married: true
		}
	  ];
	  
    return (
      <tr key={this.props.transaction._id}>
      <td>{this.props.sequenceNo+1}</td>
        <td>{this.props.transaction.transactionType}</td>
        <td>{this.props.transaction.userId}</td>
        <td>{this.props.transaction.paymentId}</td>
        <td>{this.props.transaction.transactionDate}</td>
        <td>{this.props.transaction.transactionAmount}</td>
        <td>
           <Badge onClick={this.props.changeStatus.bind(this, this.props.transaction)} color= {(this.props.transaction.status === '1')?'success':'danger'}>
            {(this.props.transaction.status === '1')?'Active':'Inctive'}
          </Badge>
        </td>
        <td>
          <Link to={'/transactions/view/' + this.props.transaction._id}><i className="fa fa-eye fa-md"></i>&nbsp;</Link>
           <ExcelFile element={<button class="fa fa-download" aria-hidden="true"></button>}>
                <ExcelSheet data={dataSet1} name="Employees">
                    <ExcelColumn label="Name" value="name"/>
                    <ExcelColumn label="Wallet Money" value="amount"/>
                    <ExcelColumn label="Gender" value="sex"/>
                    <ExcelColumn label="Marital Status"
                     value={(col) => col.is_married ? "Married" : "Single"}/>
                </ExcelSheet>
           </ExcelFile>
        </td>
      </tr>
    );
  }
}
// ProjectItem.propTypes = {
//   project: PropTypes.object
// };
export default Transaction;
