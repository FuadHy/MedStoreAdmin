/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react'

// reactstrap components
import {
	Button,
	Col,
	Card,
	Input,
	Form,
	FormGroup,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Row,
	Table,
} from 'reactstrap'
import { DataGrid } from '@material-ui/data-grid'
import axiosInst from './req'
import SerializeForm from 'form-serialize'
// core components
import Header from 'components/Headers/Header.js'
import { SERVER_URL, API_URL } from '../../constants'
import { Today } from '@material-ui/icons'

class Request extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isAdd: true,
			isModalOpen: false,
			selectedRequest: null,
			requests: [],
		}
		this.toggleModal = this.toggleModal.bind(this)
	}

	async componentDidMount() {
		let requests = await axiosInst.get(`${SERVER_URL}${API_URL}/request?processed=1`)
		requests = requests.data.data
		let newRequests = []
		requests.forEach(request => {
			let obj = {
				id: request._id,
				name: request.User ? request.User.name : request.name,
				phone: request.User ? request.User.phone : request.phone,
				email: request.User ? request.User.email : request.email,
				address: request.User ? request.User.city : request.address,
				user: request.User ? request.User : null,
				product: request.Product,
				productName: request.Product.name,
				quantity: request.quantity,
				message: request.message,
				date: request.createdAt.split('T')[0],
				processed: request.processed,
			}
			newRequests.push(obj)
		})
		this.setState({
			requests: newRequests,
		})
	}

	handelDelete(e) {
		e.preventDefault()
		axiosInst.delete(`${SERVER_URL}${API_URL}/request/${this.state.selectedRequest.id}`).then(() => {
			let newRequest = this.state.requests.filter(
				request => request.id != this.state.selectedRequest.id
			)
			this.setState({
				requests: newRequest,
			})
		})
	}

	toggleModal() {
		this.setState(prevState => ({
			isModalOpen: !prevState.isModalOpen,
		}))
	}

	render() {
		const columns = [
			{ field: 'name', headerName: 'User Name', width: 200 },
			{ field: 'productName', headerName: 'Product', width: 200 },
			{ field: 'quantity', headerName: 'Quantity', width: 200 },
			{ field: 'date', headerName: 'Request date', width: 300 },
			{
				field: 'action',
				headerName: 'More',
				widht: 200,
				renderCell: params => (
					<strong>
						<Button
							variant="contained"
							color="primary"
							size="sm"
							style={{ marginLeft: 16 }}
							onClick={param => {
								this.setState({ selectedRequest: params.row })
								this.toggleModal()
							}}>
							<span className="material-icons">create</span>
						</Button>
					</strong>
				),
			},
		]

		let rows = []
		return (
			<>
				<Header />
				{/* Page content */}
				<Row className="my-1 justify-content-center">
					<Input
						placeholder="Search by Product"
						onChange={this.handelSearchChange}
						className="w-75 mr-5"></Input>
				</Row>

				<Card className="mx-4">
					<div style={{ height: '75vh' }}>
						<DataGrid
							// onRowSelected={(row) => this.handelRowClick(row)}
							rows={this.state.requests}
							// rows={rows}
							columns={columns}
							pageSize={100}
						/>
					</div>
				</Card>

				<Modal
					size="lg"
					isOpen={this.state.isModalOpen}
					toggle={this.toggleModal}
					onSubmit={e => {
						this.handelSubmit(e)
						this.toggleModal()
					}}>
					<ModalHeader toggle={this.toggleModal}>Request</ModalHeader>
					<ModalBody>
						<h2>Detail Request Information</h2>
						<h3>User Informtion</h3>
						<Table>
							<thead>
								<tr>
									<th>#</th>
									<th>Name</th>
									<th>Phone</th>
									<th>Email</th>
									<th>Company</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th scope="row">1</th>
									<td>{this.state.selectedRequest ? this.state.selectedRequest.name : ' '}</td>
									<td>{this.state.selectedRequest ? this.state.selectedRequest.phone : ' '}</td>
									<td>{this.state.selectedRequest ? this.state.selectedRequest.email : ' '}</td>
									<td>{this.state.selectedRequest ? this.state.selectedRequest.company : ' '}</td>
								</tr>
							</tbody>
						</Table>
						<hr />
						<h3>Requested Product Information</h3>
						<Table>
							<thead>
								<tr>
									<th>#</th>
									<th>Name</th>
									<th>Brand</th>
									<th>Model</th>
									<th>Quantity Available</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th scope="row">1</th>
									<td>
										{this.state.selectedRequest ? this.state.selectedRequest.product.name : ' '}
									</td>
									<td>
										{this.state.selectedRequest ? this.state.selectedRequest.product.brand : ' '}
									</td>
									<td>
										{this.state.selectedRequest ? this.state.selectedRequest.product.model : ' '}
									</td>
									<td>
										{this.state.selectedRequest ? this.state.selectedRequest.product.quantity : ' '}
									</td>
								</tr>
							</tbody>
						</Table>
						<hr />
						<h3>Additional request information</h3>
						<h4>
							Request Date:{' '}
							{this.state.selectedRequest ? this.state.selectedRequest.date : ' '}
						</h4>
						<h4>
							Requested Quantity:{' '}
							{this.state.selectedRequest ? this.state.selectedRequest.quantity : ' '}
						</h4>
						<h4>Message</h4>
						<p>{this.state.selectedRequest ? this.state.selectedRequest.message : ' '}</p>
					</ModalBody>
					<ModalFooter>
						<Button
							onClick={e => {
								this.handelDelete(e)
								this.toggleModal()
							}}
							color="warning">
							Delete
						</Button>
					</ModalFooter>
				</Modal>
			</>
		)
	}
}

export default Request
