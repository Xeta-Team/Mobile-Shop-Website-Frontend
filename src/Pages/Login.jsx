import { Link } from "react-router"

const Login = () => {
   
    

    
    return(<>
    <div className="w-[522px] h-[421px] my-auto mx-auto px-[47px] rounded-2xl bg-custom-gray" >
        <h1 className="font-sans text-[28px] text-center pt-[48px]">CellExpress</h1>
        <div className="my-[21px]"><h1 className="font-sans text-[22px]">Sign In</h1>
             <p className="font-sans text-[15px]">Enter your email and we'll send you a verification code</p></div>
<div class="relative z-0 w-full mb-5 group max-w-md"> 
  <input
    type="email"
    name="floating_email"
    id="floating_email"
    class="block pt-5 pb-2 px-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
    placeholder=" "
    required
  />
  <label
    for="floating_email"
    class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-5     left-4 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600 peer-focus:dark:text-blue-500"
  >
    Email address
  </label>
</div>

        <button type="button" className="hover:cursor-pointer w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Continue</button>
        <button className="mt-[21px] text-md">Privacy</button>
    </div>
    
    </>)
}

export default Login