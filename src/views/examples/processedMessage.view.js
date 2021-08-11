import React from 'react'

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
import { Today } from '@material-ui/icons'
import { API_URL, SERVER_URL } from '../../constants'

class ProcessedMessage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isModalOpen: false,
			selectedMessage: null,
			messages: [],
		}
		this.toggleModal = this.toggleModal.bind(this)
	}

	async componentDidMount() {
		let messages = await axiosInst.get(`${SERVER_URL}${API_URL}/message?processed=1`)
		messages = messages.data.data
		console.log(messages)
		let newMessages = []
		messages.forEach(message => {
			let obj = {
				id: message._id,
				name: message.name,
				message: message.message,
				date: message.createdAt.split('T')[0],
				processed: message.processed,
				email: message.email,
			}
			newMessages.push(obj)
		})
		this.setState({
			messages: newMessages,
		})
	}

	handelDelete(e) {
		e.preventDefault()
		axiosInst.delete(`${SERVER_URL}${API_URL}/message/${this.state.selectedMessage.id}`).then(() => {
			let newMessage = this.state.messages.filter(
				message => message.id != this.state.selectedMessage.id
			)
			this.setState({
				messages: newMessage,
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
			{ field: 'name', headerName: 'Name', width: 250 },
			{ field: 'email', headerName: 'Email', width: 250 },
			{ field: 'date', headerName: 'Message date', width: 300 },
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
								this.setState({ selectedMessage: params.row })
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
							rows={this.state.messages}
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
					<ModalHeader toggle={this.toggleModal}>Message</ModalHeader>
					<ModalBody>
						<h2>Detail Message Information</h2>
						<h3>User Informtion</h3>
						<Table>
							<thead>
								<tr>
									<th>#</th>
									<th>Name</th>
									<th>Email</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th scope="row">1</th>
									<td>{this.state.selectedMessage ? this.state.selectedMessage.name : ' '}</td>
									<td>{this.state.selectedMessage ? this.state.selectedMessage.email : ' '}</td>
								</tr>
							</tbody>
						</Table>
						<hr />
						<h3>Additional message information</h3>
						<h4>
							Message Date: {this.state.selectedMessage ? this.state.selectedMessage.date : ' '}
						</h4>
						<h4>Message</h4>
						<p>{this.state.selectedMessage ? this.state.selectedMessage.message : ' '}</p>
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

export default ProcessedMessage
