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
} from 'reactstrap'
import { DataGrid } from '@material-ui/data-grid'
import axiosInst from './req'
import SerializeForm from 'form-serialize'
// core components
import Header from 'components/Headers/Header.js'
import { API_URL, SERVER_URL } from '../../constants'

class Category extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isAdd: true,
			isModalOpen: false,
			categories: [],
			selectedCategory: null,
		}
		this.toggleModal = this.toggleModal.bind(this)
		this.handelAddButton = this.handelAddButton.bind(this)
		this.handelSubmit = this.handelSubmit.bind(this)
	}

	componentDidMount() {
		axiosInst.get(`${SERVER_URL}${API_URL}/category`).then(res => {
			res.data.data.map(category => (category['id'] = category['_id']))
			this.setState({
				categories: res.data.data,
			})
		})
	}

	handelDelete(e) {
		e.preventDefault()
		console.log(this.selectedCategory)
		axiosInst.delete(`${SERVER_URL}${API_URL}/category/${this.state.selectedCategory._id}`).then(() => {
			let newCategories = this.state.categories.filter(
				category => category.id != this.state.selectedCategory._id
			)
			this.setState({
				categories: newCategories,
			})
		})
	}

	handelSubmit(e, eventType) {
		e.preventDefault()
		const formValues = SerializeForm(e.target, { hash: true })
		const newData = {
			name: formValues['categoryName'],
			description: formValues['categoryDescription'],
			// type: formValues['categoryType'],
			// subCategories: formValues['categorySubCategories'] ? formValues['categorySubCategories'].map(categoryName => this.state.categories.find(category => category.name === categoryName)) : []
		}
		if (eventType === 'add') {
			axiosInst.post(`${SERVER_URL}${API_URL}/category`, newData).then(res => {
				res.data.data['id'] = res.data.data['_id']
				this.setState(prevState => ({
					categories: prevState.categories.concat([res.data.data]),
				}))
			})
		} else {
			axiosInst
				.patch(`${SERVER_URL}${API_URL}/category/${this.state.selectedCategory._id}`, newData)
				.then(res => {
					res.data.data['id'] = res.data.data['_id']
					this.setState(prevState => ({
						categories: prevState.categories.map(category =>
							category.id === res.data.data.id ? res.data.data : category
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
			selectedCategory: null,
		})
		this.toggleModal()
	}

	render() {
		const columns = [
			{ field: 'name', headerName: 'Category Name', width: 400 },
			// { field: 'type', headerName: 'Category Type', width: 200, valueFormatter: ({ value }) => { return value === "main category" ? "Main Category" : "Sub Category"; } },
			{ field: 'description', headerName: 'Description', width: 450 },
			{
				field: 'action',
				headerName: 'Action',
				widht: 300,
				renderCell: params => (
					<strong>
						<Button
							variant="contained"
							color="primary"
							size="sm"
							style={{ marginLeft: 16 }}
							onClick={param => {
								this.setState({ isAdd: false, selectedCategory: params.row })
								this.toggleModal()
							}}>
							<span className="material-icons">create</span>
						</Button>
					</strong>
				),
			},
		]
		return (
			<>
				<Header />
				{/* Page content */}
				<Row className="my-1 justify-content-end">
					<Input
						placeholder="Search for Category"
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
							rows={this.state.categories}
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
							{this.state.selectedCategory ? this.state.selectedCategory.name : 'Category'}{' '}
							Information
						</ModalHeader>
						<ModalBody>
							<h2>Detail Category Information</h2>
							<Row className="pl-4">
								<Col lg="6">
									<FormGroup>
										<label className="form-control-label" htmlFor="categoryName">
											Name
										</label>
										<Input
											required
											className="form-control-alternative"
											name="categoryName"
											defaultValue={
												this.state.selectedCategory ? this.state.selectedCategory.name : ''
											}
											placeholder="PRIMARY CARE"
											type="text"
										/>
									</FormGroup>
								</Col>
								<Col lg="6"></Col>
								<Col lg="12">
									<FormGroup>
										<label className="form-control-label" htmlFor="categoryDescription">
											Description
										</label>
										<Input
											className="form-control-alternative"
											name="categoryDescription"
											defaultValue={
												this.state.selectedCategory ? this.state.selectedCategory.description : ''
											}
											placeholder="Lorem Epsum"
											type="textarea"
										/>
									</FormGroup>
								</Col>
							</Row>
							<Row className="pl-4">
								<Col lg="12"></Col>
							</Row>
						</ModalBody>
						<ModalFooter>
							<Button color="success" type="submit">
								{this.state.isAdd ? 'Add Category' : 'Save'}
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

export default Category
