import React, { Component } from 'react'
import {
	Button,
	Card,
	Col,
	Form,
	FormGroup,
	Input,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Row,
	Badge,
} from 'reactstrap'
import { DataGrid } from '@material-ui/data-grid'
import axiosInst from './req'
import SerializeForm from 'form-serialize'
import { API_URL, SERVER_URL } from './../../constants'
import Header from 'components/Headers/Header.js'
import { RestaurantMenuOutlined } from '@material-ui/icons'

class Products extends Component {
	constructor(props) {
		super(props)
		this.state = {
			modal: false,
			isAdd: true,
			selectedProduct: null,
			products: [],
			categories: [],
			subCategories: [],
			searchQuery: '',
			newProductImgURL: '',
			newProductPDFURL: '',
			newProductPhotoFiles: null,
			newProductPDF: null,
			selectedCategorySubCategory: [], // used in Modal subCategory input field
			uploadingStarted: false,
			doneUploading: false,
		}
		this.handelSearchChange = this.handelSearchChange.bind(this)
		this.toggleModal = this.toggleModal.bind(this)
		this.handelPhotoAdd = this.handelPhotoAdd.bind(this)
		this.handelPhotoUpload = this.handelPhotoUpload.bind(this)
		this.handelSubmit = this.handelSubmit.bind(this)
		this.handelAddButton = this.handelAddButton.bind(this)
	}

	async componentDidMount() {
		let products = (await axiosInst.get(`${SERVER_URL}${API_URL}/product`)).data.data
		console.log(products)
		products.forEach(product => {
			product['id'] = product['_id']
			product.categoryName = product.Category ? product.Category.name : ' - '
			product.subCategoryName = product.SubCategory ? product.SubCategory.name : '  -  '
			product.year = /\d{4}/.exec(product.year)[0]
		})
		const categories = (await axiosInst.get(`${SERVER_URL}${API_URL}/category`)).data.data
		const subCategories = (await axiosInst.get(`${SERVER_URL}${API_URL}/subCategory`)).data.data
		console.log(categories)
		console.log(subCategories)
		this.setState({
			products,
			categories,
			subCategories,
		})
	}

	toggleModal() {
		this.setState(prevState => ({
			modal: !prevState.modal,
		}))
	}

	handelAddButton() {
		this.setState({
			isAdd: true,
			selectedProduct: null,
			uploadingStarted: false,
			doneUploading: false,
		})
		this.toggleModal()
	}

	handelRowClick(row) {
		this.setState({
			selectedProduct: row.data,
		})
	}

	handelDelete(e) {
		e.preventDefault()
		axiosInst.delete(`${SERVER_URL}${API_URL}/product/${this.state.selectedProduct._id}`).then(() => {
			const deletedProductId = this.state.selectedProduct._id
			let products = this.state.products
			products = products.filter(product => product.id != deletedProductId)
			this.setState({ products })
		})
	}

	handelSearchChange(e) {
		e.preventDefault()
		this.setState({
			searchQuery: e.target.value,
		})
	}

	async handelSubmit(event, eventType) {
		event.preventDefault()
		const formValues = SerializeForm(event.target, { hash: true })
		const newData = {
			name: formValues['productName'],
			category: this.state.categories.filter(
				category => category.name == formValues['productCategory']
			)[0]._id,
			subCategory: formValues['productSubCategory']
				? this.state.subCategories.filter(
						subCategory => subCategory.name == formValues['productSubCategory']
				  )[0]._id
				: null,
			tags: formValues['productTags'] ? formValues['productTags'] : '',
			condition: formValues['productCondition'],
			brand: formValues['brandName'],
			company: formValues['companyName'],
			model: formValues['brandModel'],
			country: formValues['brandCountry'],
			year: formValues['productYear'],
			description: formValues['productDescription'],
			characteristics: formValues['productCharacteristics']
				? formValues['productCharacteristics']
				: '',
			photo_urls:
				this.state.newProductImgURL.length !== 0 ? this.state.newProductImgURL : undefined,
			catalogue_url: this.state.newProductPDFURL
		}

		if (eventType === 'add') {
			console.log(newData)
			let product = (await axiosInst.post(`${SERVER_URL}${API_URL}/product`, newData)).data.data
			console.log(product)
			product['id'] = product['_id']
			product.categoryName = product.Category.name
			product.subCategoryName = product.subCategory ? product.SubCategory.name : '  -  '
			product.year = /\d{4}/.exec(product.year)[0]

			this.setState(prevState => ({
				products: prevState.products.concat([product]),
			}))
		} else {
			let product = (
				await axiosInst.patch(
					`${SERVER_URL}${API_URL}/product/${this.state.selectedProduct._id}`,
					newData
				)
			).data.data
			product['id'] = product['_id']
			product.categoryName = product.Category.name
			product.subCategoryName = product.subCategory ? product.SubCategory.name : '  -  '
			product.year = /\d{4}/.exec(product.year)[0]

			this.setState(prevState => ({
				products: prevState.products.map(p => (p.id == product.id ? product : p)),
			}))
		}
	}

	handelPhotoAdd(e) {
		console.log('handelPhotoAdd')
		let photos = e.target.files
		this.setState({
			// isAdd: true,
			newProductPhotoFiles: photos,
		})
	}

	handelPDFAdd(e) {
		let PDF = e.target.files[0]
		this.setState({
			// isAdd: true,
			newProductPDF: PDF,
		})
	}

	handelPhotoUpload(e) {
		e.preventDefault()
		this.setState({
			uploadingStarted: true,
			doneUploading: false,
		})
		let formData = new FormData()
		for (const key of Object.keys(this.state.newProductPhotoFiles)) {
			formData.append('products', this.state.newProductPhotoFiles[key])
		}
		// formData.append("type", "productPhoto");
		axiosInst
			.post(`${SERVER_URL}${API_URL}/uploads`, formData)
			.then(res => {
				// change the array to ; separated string
				let newProductImgURL = res.data.data.join(';')
				this.setState({
					newProductImgURL,
					uploadingStarted: false,
					doneUploading: true,
				})
			})
			.catch(() => {
				this.setState({
					uploadingStarted: true,
					doneUploading: true,
				})
			})
	}

	handelPDFUpload(e) {
		e.preventDefault()
		this.setState({
			uploadingStarted: true,
			doneUploading: false,
		})
		let formData = new FormData()
		formData.append('pdf', this.state.newProductPDF)
		// formData.append("type", "productPhoto");
		axiosInst
			.post(`${SERVER_URL}${API_URL}/uploads/pdf`, formData)
			.then(res => {
				console.log(res.data)
				// change the array to ; separated string
				let newProductPDFURL = res.data.data[0]
				console.log(newProductPDFURL)
				this.setState({
					newProductPDFURL,
					uploadingStarted: false,
					doneUploading: true,
				})
			})
			.catch(() => {
				this.setState({
					uploadingStarted: true,
					doneUploading: true,
				})
			})
	}

	modifySelectedCategorySubCategory = e => {
		e.preventDefault()
		const selectedCategoryName = e.target.value
		// find the id of the category selected
		const categoryId = this.state.categories.filter(
			category => category.name == selectedCategoryName
		)[0]._id

		// get all subCategories with a category property of categoryId
		let requeiredSubCategory = this.state.subCategories.filter(
			subCategory => subCategory.category == categoryId
		)
		// getting only the names
		requeiredSubCategory = requeiredSubCategory.map(el => el.name)
		this.setState({ selectedCategorySubCategory: requeiredSubCategory })
	}

	render() {
		const columns = [
			{ field: 'name', headerName: 'Product Name', width: 200 },
			{ field: 'categoryName', headerName: 'Category', width: 200 },
			{ field: 'subCategoryName', headerName: 'SubCategory', width: 200 },
			{ field: 'brand', headerName: 'Brand', width: 100 },
			{ field: 'company', headerName: 'Company', width: 100 },
			{ field: 'model', headerName: 'Model', width: 80 },
			{ field: 'year', headerName: 'Year', type: 'date', width: 100 },
			{
				field: 'condition',
				headerName: 'Condition',
				valueFormatter: ({ value }) => {
					return value === 'brand_new' ? 'New' : 'Used'
				},
			},
			{ field: 'rating', headerName: 'Rating' },
			{ field: 'tags', headerName: 'Tags', width: 200 },
			{
				field: 'action',
				headerName: 'Action',
				renderCell: params => (
					<strong>
						<Button
							variant="contained"
							color="info"
							size="sm"
							style={{ marginLeft: 16 }}
							onClick={param => {
								let subs = this.state.subCategories.filter(
									sub => sub.category == params.row.category
								)
								subs = subs.map(sub => sub.name)
								this.setState({
									isAdd: false,
									selectedProduct: params.row,
									selectedCategorySubCategory: subs,
									uploadingStarted: false,
									doneUploading: false,
								})
								this.toggleModal()
							}}>
							<span className="material-icons">create</span>
						</Button>
					</strong>
				),
			},
		]

		const { products, searchQuery } = this.state

		const showingRows =
			searchQuery === ''
				? products
				: products.filter(
						product =>
							product.name.toLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
							product.brand.toLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
							// product.category.toLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
							product.model.toLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
							product.condition.toLowerCase().includes(searchQuery.toLocaleLowerCase())
				  )

		return (
			<>
				<Header />

				<Row className="my-1 justify-content-end">
					<Input
						placeholder="Search for proudct with name, brand, category, model, condition"
						onChange={this.handelSearchChange}
						className="w-75 mr-5"></Input>
					<Button onClick={this.handelAddButton} className="btn-success mr-4">
						Add
					</Button>
					{/* <Button onClick={() => { this.toggleModal("edit"); }} className="btn-info mr-4">Edit</Button> */}
				</Row>
				<Card className="mx-2">
					<div style={{ height: '75vh', width: '100%' }}>
						<DataGrid
							// onRowSelected={(row) => this.handelRowClick(row)}
							rows={showingRows}
							columns={columns}
							pageSize={100}
						/>
					</div>
				</Card>

				<Modal size="lg" isOpen={this.state.modal} toggle={this.toggleModal}>
					<Form
						onSubmit={e => {
							this.state.isAdd ? this.handelSubmit(e, 'add') : this.handelSubmit(e, 'edit')
							this.toggleModal()
						}}
						encType="multipart/form-data">
						<ModalHeader toggle={this.toggleModal}>
							{this.state.isAdd ? 'Add ' : 'Edit '} Product
						</ModalHeader>
						<ModalBody>
							<Row>
								<Col className="order-xl-1" xl="">
									<h6 className="heading-small text-muted mb-4">Product information</h6>
									<div className="pl-lg-4">
										<Row>
											<Col lg="6">
												<FormGroup>
													<label className="form-control-label" htmlFor="productName">
														Name
													</label>
													<Input
														required
														className="form-control-alternative"
														defaultValue={
															this.state.selectedProduct ? this.state.selectedProduct.name : ''
														}
														name="productName"
														placeholder="MRI Scanner"
														type="text"
													/>
												</FormGroup>
												<Row>
													<Col lg="6">
														<FormGroup>
															<label className="form-control-label" htmlFor="productQunatity">
																Quantity
															</label>
															<Input
																required
																className="form-control-alternative"
																defaultValue={
																	this.state.selectedProduct
																		? this.state.selectedProduct.quantity
																		: 1
																}
																name="productQunatity"
																placeholder="1"
																type="Number"
															/>
														</FormGroup>
													</Col>
													<Col lg="6">
														<FormGroup>
															<label className="form-control-label" htmlFor="productCondition">
																Condition
															</label>
															<Input
																className="form-control-alternative"
																defaultValue={
																	this.state.selectedProduct
																		? this.state.selectedProduct.condition
																		: ''
																}
																name="productCondition"
																placeholder="New"
																type="select">
																<option value="brand_new">New</option>
																<option value="used">Used</option>
															</Input>
														</FormGroup>
													</Col>
												</Row>
											</Col>
											<Col lg="6">
												<FormGroup height="100">
													<label className="form-control-label" htmlFor="productCategory">
														Category
													</label>
													<Input
														required
														className="form-control-alternative"
														name="productCategory"
														defaultValue={
															this.state.selectedProduct
																? this.state.selectedProduct.categoryName
																: ''
														}
														placeholder="MRI"
														type="select"
														onChange={this.modifySelectedCategorySubCategory}>
														{this.state.categories.length !== 0
															? this.state.categories.map(category => (
																	<option>{category.name}</option>
															  ))
															: ''}
													</Input>
												</FormGroup>
												<FormGroup height="100">
													<label className="form-control-label" htmlFor="productSubCategory">
														SubCategory
													</label>
													<Input
														className="form-control-alternative"
														name="productSubCategory"
														defaultValue={
															this.state.selectedProduct
																? this.state.selectedProduct.subCategoryName
																: ''
														}
														placeholder="MRI"
														type="select">
														{this.state.selectedCategorySubCategory.map(el => (
															<option>{el}</option>
														))}
													</Input>
												</FormGroup>
											</Col>
										</Row>
										<Row>
											<Col lg="6">
												<FormGroup>
													<label className="form-control-label" htmlFor="productTags">
														Tags
													</label>
													<Input
														className="form-control-alternative"
														defaultValue={
															this.state.selectedProduct ? this.state.selectedProduct.tags : ''
														}
														name="productTags"
														placeholder="eye,heart,... "
														type="text"
													/>
												</FormGroup>
											</Col>
											<Col lg="6">
												<FormGroup>
													<label className="form-control-label" htmlFor="companyName">
														Company
													</label>
													<Input
														className="form-control-alternative"
														defaultValue={
															this.state.selectedProduct ? this.state.selectedProduct.company : ''
														}
														name="companyName"
														placeholder=""
														type="text"
													/>
												</FormGroup>
											</Col>
										</Row>
									</div>
									<hr className="my-3" />
									{/* Address */}
									<h6 className="heading-small text-muted mb-4">Brand</h6>
									<div className="pl-lg-4">
										<Row>
											<Col lg="6">
												<FormGroup>
													<label className="form-control-label" htmlFor="brandName">
														Name
													</label>
													<Input
														className="form-control-alternative"
														defaultValue={
															this.state.selectedProduct ? this.state.selectedProduct.brand : ''
														}
														name="brandName"
														placeholder="Canon"
														type="text"
													/>
												</FormGroup>
											</Col>
											<Col lg="6">
												<FormGroup>
													<label className="form-control-label" htmlFor="brandModel">
														Model
													</label>
													<Input
														className="form-control-alternative"
														defaultValue={
															this.state.selectedProduct ? this.state.selectedProduct.model : ''
														}
														name="brandModel"
														placeholder="BJSKS123"
														type="text"
													/>
												</FormGroup>
											</Col>
											<Col lg="6">
												<FormGroup>
													<label className="form-control-label" htmlFor="brandCountry">
														Country
													</label>
													<Input
														className="form-control-alternative"
														defaultValue={
															this.state.selectedProduct ? this.state.selectedProduct.country : ''
														}
														name="brandCountry"
														placeholder="Country"
														type="text"
													/>
												</FormGroup>
											</Col>
											<Col lg="6">
												<FormGroup>
													<label className="form-control-label" htmlFor="brandModelYear">
														Year
													</label>
													<Input
														className="form-control-alternative"
														name="productYear"
														placeholder="2020"
														defaultValue={
															this.state.selectedProduct ? this.state.selectedProduct.year : '2020'
														}
														type="number"
													/>
												</FormGroup>
											</Col>
										</Row>
									</div>
									<hr className="my-3" />
									{/* Description */}
									<h6 className="heading-small text-muted mb-4">Product Specification</h6>
									<div className="pl-lg-4">
										<FormGroup>
											<label className="form-control-label" htmlFor="productDescription">
												Description
											</label>
											<Input
												className="form-control-alternative"
												placeholder="A few words about the product ..."
												rows="3"
												name="productDescription"
												defaultValue={
													this.state.selectedProduct ? this.state.selectedProduct.description : ''
												}
												type="textarea"
											/>
										</FormGroup>
									</div>
									<div className="pl-lg-4">
										<FormGroup>
											<label className="form-control-label" htmlFor="productCharacteristics">
												Characteristics
											</label>
											<Input
												className="form-control-alternative"
												placeholder="Battery Life: 5hrs; Battery Capacity: 2300mAh"
												rows="3"
												name="productCharacteristics"
												type="textarea"
												defaultValue={
													this.state.selectedProduct
														? this.state.selectedProduct.characteristics
														: ''
												}
											/>
										</FormGroup>
									</div>
									<div className="pl-lg-4">
									<FormGroup>
											<label className="form-control-label" htmlFor="productPhotos">
												Catalogue (PDF file)
											</label>
											<Input
												onChange={e => this.handelPDFAdd(e)}
												className="form-control-alternative"
												name="productPDF"
												type="file"
												formEncType="multipart/form-data"></Input>
											<Button
												size="md"
												className="mt-2"
												color="info"
												onClick={e => this.handelPDFUpload(e)}>
												Upload
											</Button>
											
										</FormGroup>
										<FormGroup>
											<label className="form-control-label" htmlFor="productPhotos">
												Photos
											</label>
											<Input
												onChange={e => this.handelPhotoAdd(e)}
												className="form-control-alternative"
												name="productPhotos"
												type="file"
												accept="image/x-png,image/gif,image/jpeg"
												multiple
												formEncType="multipart/form-data"></Input>
											<Button
												size="md"
												className="mt-2"
												color="info"
												onClick={e => this.handelPhotoUpload(e)}>
												Upload
											</Button>
											{this.state.uploadingStarted && !this.state.doneUploading && (
												<Badge color="danger">Uploading ... Please wait</Badge>
											)}
											{!this.state.uploadingStarted && this.state.doneUploading && (
												<Badge color="primary">Done Uploading</Badge>
											)}
											{this.state.uploadingStarted && this.state.doneUploading && (
												<Badge color="primary">Uploading failed try again</Badge>
											)}
										</FormGroup>
									</div>
									{/* </CardBody>
                </Card> */}
								</Col>
							</Row>
						</ModalBody>
						<ModalFooter>
							<Button color="success" type="submit">
								{this.state.isAdd ? 'Add Product' : 'Save'}
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

export default Products
