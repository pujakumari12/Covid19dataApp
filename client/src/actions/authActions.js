import { USER_LOADING, USER_LOADED, LOGIN_SUCCESS, SIGNUP_SUCCESS, AUTH_ERROR, LOGIN_FAIL, LOGOUT_SUCCESS, SIGNUP_FAIL, GET_LOGGED_IN_USER} from '../actionTypes/actionTypes';
import store from '../store';
import {returnErrors, clearErrors} from './errorActions';
import axios from 'axios';



export const signupUser = ({name, email, password}) =>(dispatch)=>{
	const config ={
		headers:{
			'Content-type':"application/json",
			'Access-Control-Allow-Origin':true
		}
	}
	dispatch({type:USER_LOADING}); //dispatching the user loading 
	const body = JSON.stringify({name, email, password});

	axios.post('/auth/post/signup', body, config)
		.then(res =>{			
			dispatch({type:SIGNUP_SUCCESS, payload:res.data})			
			dispatch(clearErrors());		
		}).catch(err=>{
			console.log(err);
			dispatch({type:SIGNUP_FAIL});
			
		})	
} 



export const loginUser = ({email, password}) =>(dispatch)=>{
	const config ={
		headers:{
			'Content-type':"application/json",
			'Access-Control-Allow-Origin':true			
		}
	}
	
	dispatch({type:USER_LOADING}); //dispatching the user loading 

	const body = JSON.stringify({email, password});

	axios.post('/auth/post/login', body, config)
		.then(res =>{			
			dispatch({type:LOGIN_SUCCESS, payload:res.data})
			dispatch({type:GET_LOGGED_IN_USER, payload:res.data.user})
			dispatch(clearErrors());			
		}).catch(err=>{
			console.log(err);
			dispatch({type:LOGIN_FAIL});
			
		})
}

export const logoutUser = ()=>(dispatch)=>{
	dispatch({type:LOGOUT_SUCCESS})
	dispatch(clearErrors());		
} 



export const loadUser = () => (dispatch, getState)=>{  
	dispatch({type:USER_LOADING}); //dispatching the user loading 
	
	axios.get('/auth/get/currentUser', tokenConfig('config'))
		.then(async (res)=>{
			dispatch({type:USER_LOADED, payload:res.data})			
			dispatch(clearErrors());		
	}).catch(err=>{
		console.log("Fetching user error : " + err)
		//dispatch(returnErrors(err.response.data, err.response.status));
		dispatch({type:AUTH_ERROR})
	  });

}

export const tokenConfig = (getState)=>{
	//get token from the state and fetch token from local storage 
	const token = store.getState().AuthReducer.token;
	//headers
	const config = {
		headers:{
			"Content-type":"application/json",
			'Access-Control-Allow-Origin': '*'
		}
	}
	//if token, add to headers
	if(token){ config.headers['x-auth-token'] = token;}
	return config;	
}

export const userLoaded = (user) =>(dispatch)=>{
	dispatch({type:USER_LOADED, payload:user})
}