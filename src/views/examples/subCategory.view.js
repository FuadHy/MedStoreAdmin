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
import { API_URL, SERVER_URL } from './../../constants'

class SubCategory extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			isAdd: true,
			isModalOpen: false,
			selectedSubCategory: null,
			subCategories: [],
			categories: [],
		}
		this.toggleModal = this.toggleModal.bind(this)
		this.handelAddButton = this.handelAddButton.bind(this)
		this.handelSubmit = this.handelSubmit.bind(this)
	}

	async componentDidMount() {
		let subCategories = (await axiosInst.get(`${SERVER_URL}${API_URL}/subCategory`)).data.data
		console.log(subCategories)
		subCategories.forEach(subCategory => {
			subCategory['id'] = subCategory['_id']
			delete subCategory['_id']
		})

		let categoryPromises = subCategories.map(subCategory => {
			return axiosInst.get(`${SERVER_URL}${API_URL}/category/${subCategory.category}`)
		})

		let category = await Promise.all(categoryPromises)
		category = category.map(c => c.data.data.name)
		let count = 0
		subCategories.forEach(subCategory => {
			subCategory.category = category[count]
			count++
		})

		this.setState({
			subCategories,
		})
		let categories = (await axiosInst.get(`${SERVER_URL}${API_URL}/category`)).data.data
		this.setState({
			categories,
		})
	}

	handelDelete(e) {
		e.preventDefault()
		axiosInst
			.delete(`${SERVER_URL}${API_URL}/subCategory/${this.state.selectedSubCategory.id}`)
			.then(() => {
				let newSubCategories = this.state.subCategories.filter(
					subCategory => subCategory.id != this.state.selectedSubCategory.id
				)
				this.setState({
					subCategories: newSubCategories,
				})
			})
	}

	handelSubmit(e, eventType) {
		e.preventDefault()
		const formValues = SerializeForm(e.target, { hash: true })
		let category = this.state.categories.filter(
			category => category.name == formValues['CategoryOfSubCategory']
		)[0]
		let categoryID = category._id
		const newData = {
			name: formValues['subCategoryName'],
			category: categoryID,
			description: formValues['subCategoryDescription'],
		}
		if (eventType === 'add') {
			axiosInst.post(`${SERVER_URL}${API_URL}/subCategory`, newData).then(res => {
				res.data.data['id'] = res.data.data['_id']
				res.data.data.category = category.name
				this.setState(prevState => ({
					subCategories: prevState.subCategories.concat([res.data.data]),
				}))
			})
		} else {
			axiosInst
				.patch(`${SERVER_URL}${API_URL}/subCategory/${this.state.selectedSubCategory.id}`, newData)
				.then(res => {
					res.data.data['id'] = res.data.data['_id']
					res.data.data.category = category.name
					this.setState(prevState => ({
						subCategories: prevState.subCategories.map(subCategory =>
							subCategory.id === res.data.data.id ? res.data.data : subCategory
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
			selectedSubCategory: null,
		})
		this.toggleModal()
	}

	render() {
		const columns = [
			{ field: 'name', headerName: 'SubCategory Name', width: 300 },
			{ field: 'category', headerName: 'Category', width: 200 },
			{ field: 'description', headerName: 'Description', width: 400 },
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
								this.setState({ isAdd: false, selectedSubCategory: params.row })
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
						placeholder="Search for SubCategory"
						onChange={this.handelSearchChange}
						className="w-75 mr-5"></Input>
					<Button onClick={this.handelAddButton} className="btn-success mr-4">
						Add
					</Button>
				</Row>

				<Card className="mx-4">
					<div style={{ height: '75vh', paddingBottom: '40px' }}>
						<DataGrid
							// onRowSelected={(row) => this.handelRowClick(row)}
							rows={this.state.subCategories}
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
							{this.state.selectedSubCategory ? this.state.selectedSubCategory.name : 'Category'}{' '}
							Information
						</ModalHeader>
						<ModalBody>
							<h2>Detail SubCategory Information</h2>
							<Row className="pl-4">
								<Col lg="6">
									<FormGroup>
										<label className="form-control-label" htmlFor="subCategoryName">
											Name
										</label>
										<Input
											className="form-control-alternative"
											name="subCategoryName"
											defaultValue={
												this.state.selectedSubCategory ? this.state.selectedSubCategory.name : ''
											}
											placeholder="PRIMARY CARE"
											type="text"
										/>
									</FormGroup>
									{/* <FormGroup>
                    <label
                      className="form-control-label"
                      htmlFor="subCategoryType">
                      Type
                    </label>
                    <Input
                      className="form-control-alternative"
                      name="subCategoryType"
                      defaultValue={this.state.selectedSubCategory ? this.state.selectedSubCategory.type : ""}
                      placeholder="PRIMARY CARE"
                      type="select"
                    >
                      <option value="main subCategory">Main Category</option>
                      <option value="sub subCategory">Sub Category</option>
                    </Input>
                  </FormGroup> */}
								</Col>
								<Col lg="6">
									<FormGroup>
										<label className="form-control-label" htmlFor="CategoryOfSubCategory">
											Categories
										</label>
										<Input
											className="form-control-alternative"
											name="CategoryOfSubCategory"
											defaultValue={
												this.state.selectedSubCategory
													? this.state.selectedSubCategory.category.name
													: ''
											}
											type="select">
											{this.state.categories.length !== 0
												? this.state.categories.map(category => <option>{category.name}</option>)
												: ''}
										</Input>
									</FormGroup>
								</Col>
								<Col lg="12">
									<FormGroup>
										<label className="form-control-label" htmlFor="subCategoryDescription">
											Description
										</label>
										<Input
											className="form-control-alternative"
											name="subCategoryDescription"
											defaultValue={
												this.state.selectedSubCategory
													? this.state.selectedSubCategory.description
													: ''
											}
											type="textarea"
										/>
									</FormGroup>
								</Col>
							</Row>
						</ModalBody>
						<ModalFooter>
							<Button color="success" type="submit">
								{this.state.isAdd ? 'Add SubCategory' : 'Save'}
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

export default SubCategory
