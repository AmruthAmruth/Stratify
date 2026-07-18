import { store } from "@/store";
import { clearCredentials, setCredentials } from "@/store/slices/authSlice";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";


// Automatically switch API URL
const apiBaseURL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_LOCAL_API
    : import.meta.env.VITE_PROD_API;


console.log(
  "Current API:",
  apiBaseURL
);


const api = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


// Token refresh management
let isRefreshing = false;

let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];


const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {

  failedQueue.forEach(({resolve,reject}) => {

    if(error){
      reject(error);
    }
    else{
      resolve(token);
    }

  });


  failedQueue=[];
};



const isTokenExpiringSoon = (
  token:string,
  bufferSeconds=60
)=>{

  try{

    const decoded =
      jwtDecode<{exp:number}>(token);


    return decoded.exp <
      Date.now()/1000 + bufferSeconds;

  }
  catch{

    return true;

  }

};



// Attach access token
api.interceptors.request.use(
(config)=>{

  const token =
    store.getState().auth.accessToken;


  if(token){

    if(isTokenExpiringSoon(token)){
      console.log("Token expiring soon");
    }


    config.headers.Authorization =
      `Bearer ${token}`;

  }


  return config;

});



// Refresh token handler
api.interceptors.response.use(
(response)=>response,


async(error:AxiosError)=>{


const originalRequest =
error.config as InternalAxiosRequestConfig & {
  _retry?:boolean
};



if(
 error.response?.status===401 &&
 originalRequest &&
 !originalRequest._retry
){


 if(
 originalRequest.url?.includes(
 "/refresh-token"
 )
 ){
   return Promise.reject(error);
 }



 if(isRefreshing){

   return new Promise((resolve,reject)=>{

     failedQueue.push({
       resolve,
       reject
     });

   })
   .then(()=>{

     const token =
     store.getState().auth.accessToken;


     if(token && originalRequest.headers){

       originalRequest.headers.Authorization =
       `Bearer ${token}`;

     }


     return api.request(originalRequest);

   });

 }



 originalRequest._retry=true;
 isRefreshing=true;



 try{


 const response =
 await api.post("/auth/refresh-token");


 const newToken =
 response.data.accessToken;



 const decoded =
 jwtDecode<{
 id:string;
 role:string;
 name?:string;
 exp:number;
 }>(newToken);



 store.dispatch(
 setCredentials({
   accessToken:newToken,
   userId:decoded.id,
   role:decoded.role,
   name:decoded.name ?? null
 })
 );



 processQueue(
 null,
 newToken
 );



 originalRequest.headers.Authorization =
 `Bearer ${newToken}`;


 return api.request(originalRequest);



 }
 catch(refreshError){


 processQueue(
 refreshError as AxiosError,
 null
 );


 store.dispatch(
 clearCredentials()
 );


 window.location.href="/login";


 return Promise.reject(refreshError);


 }
 finally{

 isRefreshing=false;

 }


}



return Promise.reject(error);


});


export default api;