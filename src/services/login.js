import axios from 'axios'
const baseUrl = '/api/login'

const login = async (credentials) => {
    console.log("To login: ", credentials)
    const response = await axios.post(baseUrl, credentials)
    console.log("ResponseData: ", response.data)
    return response.data
}

const loginService = {
    login: login
}

export default loginService