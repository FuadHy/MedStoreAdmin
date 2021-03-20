import axios from 'axios'

const axiosInst = axios.create()

axiosInst.interceptors.request.use(function(config) {
	let token = sessionStorage.getItem('admin_token')
	if(!token){
		window.location.pathname = '/login'
		return
	}
	config.headers['Authorization'] = `Bearer ${token}`
	return config
}, function(err){
	return Promise.reject(err)
})

axiosInst.interceptors.response.use(function(resp) {
	console.log(resp)
	return resp
}, function(err){
	sessionStorage.removeItem('admin_token')
	window.location.pathname = '/login'
	return Promise.reject(err)
})

export default axiosInst;