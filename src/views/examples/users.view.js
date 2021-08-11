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
	Card,
	Col,
	Form,
	FormGroup,
	Input,
	Modal,
	ModalBody,
	ModalHeader,
	ModalFooter,
	Row,
} from 'reactstrap'
import { DataGrid } from '@material-ui/data-grid'
import SerializeForm from 'form-serialize'
import axiosInst from './req'
// core components
import Header from 'components/Headers/Header.js'
import { API_URL, SERVER_URL } from '../../constants'

class User extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isAdd: true,
			isModalOpen: false,
			users: [],
			selectedUser: null,
			newUserImgURL: null,
		}
		this.toggleModal = this.toggleModal.bind(this)
		this.handelAddButton = this.handelAddButton.bind(this)
		this.handelSubmit = this.handelSubmit.bind(this)
	}

	async componentDidMount() {
		let users = (await axiosInst.get(`${SERVER_URL}${API_URL}/user`)).data.data
		console.log(users)
		users.forEach(user => {
			user.id = user._id
			delete user._id
		})
		this.setState({
			users,
		})
	}

	handelDelete(e) {
		e.preventDefault()
		axiosInst.delete(`${SERVER_URL}${API_URL}/user/${this.state.selectedUser.id}`).then(res => {
			res.data.data['id'] = res.data.data['_id']
			let users = this.state.users
			users.splice(users.indexOf(users.find(users => users.id === res.data.data['id'])), 1)
			this.setState({ users })
		})
	}

	handelSubmit(e, eventType) {
		e.preventDefault()
		const formValues = SerializeForm(e.target, { hash: true })
		const newData = {
			name: formValues['userName'],
			email: formValues['userEmail'],
			password: formValues['userPass'],
			passwordConfirm: formValues['userPass'],
			phone: formValues['userPhone'],
			city: formValues['userAddressCity'],
			region: formValues['userAddressRegion'],
			country: formValues['userAddressCountry'],
			subscription: formValues['userSubscription'],
			role: formValues['userRole'],
			avatar_url: this.state.newUserImgURL ? this.state.newUserImgURL : '',
		}
		console.log(newData)
		if (eventType === 'add') {
			axiosInst.post(`${SERVER_URL}${API_URL}/user/signup`, newData).then(res => {
				console.log(res)
				res.data.data.user['id'] = res.data.data.user['_id']
				this.setState(prevState => ({
					users: prevState.users.concat([res.data.data.user]),
				}))
			})
		} else {
			axiosInst
				.patch(`${SERVER_URL}${API_URL}/user/${this.state.selectedUser.id}`, newData)
				.then(res => {
					res.data.data['id'] = res.data.data['_id']
					this.setState(prevState => ({
						users: prevState.users.map(user =>
							user.id === res.data.data.id ? res.data.data : user
						),
					}))
				})
		}
	}

	toggleModal() {
		this.setState(prevState => ({
			isModalOpen: !prevState.isModalOpen,
		}))
	}

	handelAddButton() {
		this.setState({
			isAdd: true,
			selectedUser: null,
		})
		this.toggleModal()
	}

	render() {
		const columns = [
			{ field: 'name', headerName: 'User Name', width: 300 },
			{ field: 'email', headerName: 'E-mail', width: 150 },
			{ field: 'phone', headerName: 'Phone Number', width: 150, type: Number },
			{ field: 'city', headerName: 'City', width: 130 },
			{ field: 'region', headerName: 'Region', width: 130 },
			{ field: 'country', headerName: 'Country', width: 130 },
			{
				field: 'subscription',
				headerName: 'Subscription Type',
				valueFormatter: ({ value }) => {
					return value === 'basic' ? 'Basic' : 'Premium'
				},
				width: 200,
			},
			{
				field: 'action',
				headerName: 'action',
				widht: 300,
				renderCell: params => (
					<strong>
						<Button
							variant="contained"
							color="primary"
							size="sm"
							style={{ marginLeft: 16 }}
							onClick={param => {
								this.setState({ isAdd: false, selectedUser: params.row })
								this.toggleModal()
							}}>
							<span className="material-icons">create</span>
						</Button>
					</strong>
				),
			},
		]

		const rows = [
			{
				id: '123123',
				name: 'Cherinet Mekuanint',
				email: 'cherenet@medstore.et',
				phone: '09123123123',
				city: 'Addis Ababa',
				region: 'Addis Ababa',
				country: 'Ethiopia',
				subscription: 'premium',
				action: 'edit',
			},
			{
				id: '11223123',
				name: 'Dinaol Feye',
				email: 'dina@medstore.et',
				phone: '09123123123',
				city: 'Addis Ababa',
				region: 'Addis Ababa',
				country: 'Ethiopia',
				subscription: 'premium',
				action: 'edit',
			},
		]

		return (
			<>
				<Header />
				<Row className="my-1 justify-content-end">
					<Input
						placeholder="Search for user"
						onChange={this.handelSearchChange}
						className="w-75 mr-5"></Input>
					<Button onClick={this.handelAddButton} className="btn-success mr-4">
						Add
					</Button>
				</Row>

				<Card className="mx-4">
					<div style={{ height: '75vh' }}>
						<DataGrid
							// onRowSelected={(row) => this.handelRowClick(row)}
							rows={this.state.users}
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
						this.state.isAdd ? this.handelSubmit(e, 'add') : this.handelSubmit(e, 'edit')
						this.toggleModal()
					}}>
					<Form>
						<ModalHeader>
							{this.state.selectedUser ? this.state.selectedUser.name : 'User'} Information
						</ModalHeader>
						<ModalBody>
							<h2>Personal Information</h2>
							<Row className="pl-4">
								<Col lg="6">
									<FormGroup>
										<label className="form-control-label" htmlFor="userName">
											Name
										</label>
										<Input
											className="form-control-alternative"
											name="userName"
											defaultValue={this.state.selectedUser ? this.state.selectedUser.name : ''}
											placeholder="Jon Doe"
											type="text"
										/>
									</FormGroup>
								</Col>
								<Col lg="6">
									<FormGroup>
										<label className="form-control-label" htmlFor="userEmail">
											Email
										</label>
										<Input
											className="form-control-alternative"
											name="userEmail"
											defaultValue={this.state.selectedUser ? this.state.selectedUser.email : ''}
											placeholder="jon@medstore.et"
											type="email"
										/>
									</FormGroup>
								</Col>
								<Col lg="6">
									<FormGroup>
										<label className="form-control-label" htmlFor="userPhone">
											Phone
										</label>
										<Input
											className="form-control-alternative"
											name="userPhone"
											defaultValue={this.state.selectedUser ? this.state.selectedUser.phone : ''}
											placeholder="09123213123"
											type="number"
										/>
									</FormGroup>
								</Col>
								<Col lg="6">
									<FormGroup>
										<label className="form-control-label" htmlFor="userEmail">
											Password
										</label>
										<Input
											className="form-control-alternative"
											name="userPass"
											
											placeholder="********"
											type="password"
										/>
									</FormGroup>
								</Col>
								<Col lg="3">
									<FormGroup>
										<label className="form-control-label" htmlFor="userSubscription">
											Subscription
										</label>
										<Input
											// className="form-control-range"
											size="lg"
											name="userSubscription"
											defaultValue={
												this.state.selectedUser ? this.state.selectedUser.subscription : ''
											}
											type="select">
											<option value="basic">Basic</option>
											<option value="premium">Premium</option>
										</Input>
									</FormGroup>
								</Col>
								<Col lg="3">
									<FormGroup>
										<label className="form-control-label" htmlFor="userRole">
											Role
										</label>
										<Input
											// className="form-control-range"
											size="lg"
											name="userRole"
											defaultValue={this.state.selectedUser ? this.state.selectedUser.role : ''}
											type="select">
											<option value="admin">Admin</option>
											<option value="normal_user">Normal User</option>
										</Input>
									</FormGroup>
								</Col>
							</Row>
							<hr className="my-3" />

							<h2>Address</h2>
							<Row className="pl-4">
								<Col lg="4">
									<FormGroup>
										<label className="form-control-label" htmlFor="userAddressCity">
											City
										</label>
										<Input
											className="form-control-alternative"
											name="userAddressCity"
											defaultValue={this.state.selectedUser ? this.state.selectedUser.city : ''}
											placeholder="Addis Ababa"
											type="text"
										/>
									</FormGroup>
								</Col>
								<Col lg="4">
									<FormGroup>
										<label className="form-control-label" htmlFor="userAddressRegion">
											Region
										</label>
										<Input
											className="form-control-alternative"
											name="userAddressRegion"
											defaultValue={this.state.selectedUser ? this.state.selectedUser.region : ''}
											placeholder="Addis Ababa"
											type="text"
										/>
									</FormGroup>
								</Col>
								<Col lg="4">
									<FormGroup>
										<label className="form-control-label" htmlFor="userAddressCountry">
											Country
										</label>
										<Input
											className="form-control-alternative"
											name="userAddressCountry"
											defaultValue={this.state.selectedUser ? this.state.selectedUser.country : ''}
											placeholder="Ethiopia"
											type="text"
										/>
									</FormGroup>
								</Col>
							</Row>
						</ModalBody>
						<ModalFooter>
							<Button color="success" type="submit">
								{this.state.isAdd ? 'Add User' : 'Save'}
							</Button>
							{this.state.isAdd ? (
								''
							) : (
								<Button
									onClick={e => {
										this.handelDelete(e)
										this.toggleModal()
									}}
									color="warning">
									Delete
								</Button>
							)}
							<Button color="secondary" onClick={this.toggleModal}>
								Cancel
							</Button>
						</ModalFooter>
					</Form>
				</Modal>
			</>
		)
	}
}

export default User
