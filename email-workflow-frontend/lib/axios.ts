import axios from "axios";


// creating axios instance for backend calls
const api = axios.create({

    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {

        "Content-Type": "application/json",

    },

});




// request interceptor
api.interceptors.request.use(

    (config) => {
        return config;
    },

    (error) => {

        return Promise.reject(error);

    }

);




// response interceptor
api.interceptors.response.use(

    (response) => {

        return response.data;

    },

    (error) => {

        console.error("api error", error?.response?.data || error.message);

        return Promise.reject(

            error?.response?.data || error.message

        );

    }

);



export default api;