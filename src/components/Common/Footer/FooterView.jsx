// import React, { useState } from "react";
import styles from "../../../styles/Home.module.css";
import logo from '../../../../public/images/logo.png'
import phone from '../../../../public/images/phone.png'
import email from '../../../../public/images/email.png'
import fb from '../../../../public/images/facebook.png'
import twitter from '../../../../public/images/twitter.png'
import p from '../../../../public/images/p.png'
import appstore from '../../../../public/images/app-store.png'
import googleplay from '../../../../public/images/google-play.png'
import Image from "next/image";


const FooterView = () => {
 
  // const [toggle, setToggle] = useState(false);



  return (
    <>

    <div
  className="bg-[#1A3578] text-center  lg:text-left text-white flex flex-col items-center ">
  <div className={`container py-12 px-[30px] md:px-[70px] mx-auto max-w-[1440px]`}>
  {/* ${styles.footerContainer} */}
    <div className="grid md:grid-cols-2 lg:grid-cols-4">
  
      <div className="mb-6 lg:w-[70%] ">
        <h5
          className="mb-4 font-medium  text-base md:text-xl text-[#CDF27E]">
          About Us
        </h5>

        <ul className="mb-0 list-none text-sm font-normal">
          <li>
            <a href="#!" className=""
              >Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet, consectetur..</a
            >
          </li>
          
        </ul>
      </div>

    
      <div className="mb-6 lg:w-[70%] ">
        <h5
          className="mb-4 font-medium  text-base md:text-xl text-[#CDF27E]">
          Contact Us
        </h5>

        <ul className="mb-0 list-none text-sm font-normal gap-y-2">
          <li>
            <a href="#!" className=""
              >+9134 4555 5</a
            >
          </li>
          <li>
            <a href="#!" className=""
              ><div className='py-2'>
              Company@email.com
              </div></a
            >
          </li>
          <li>
            <a href="#!" className=""
              >2048 Francis CA 1234, MineSacramento,</a
            >
          </li>
         
        </ul>
      </div>

 
      <div class="mb-6">
        <h5
          class="mb-4 font-medium  text-base md:text-xl text-[#CDF27E] ">
          Follow us
        </h5>

        <ul class="mb-0 list-none text-sm font-normal">
          <li>
            <a href="#!" className=""
              >
              <div className="flex justify-center md:justify-start mr-4 sm:mr-[10%] gap-x-1 sm:gap-x-2">
      <div className=" bg-gray-500 h-5 w-5 md:h-7 md:w-7 flex justify-center items-center rounded-full">
          <Image src={fb} alt='phone' />    
      </div>
      <div className=" bg-gray-500 h-5 w-5 md:h-7 md:w-7 flex justify-center items-center rounded-full">
          <Image src={twitter} alt='phone' />    
      </div>
      <div className=" bg-gray-500 h-5 w-5 md:h-7 md:w-7 flex justify-center items-center rounded-full">
          <Image src={p} alt='phone' />    
      </div>
      <div className=" bg-gray-500 h-5 w-5 md:h-7 md:w-7 flex justify-center items-center rounded-full">
          <Image className=" rounded-xl" src={fb} alt='phone' />    
      </div>
     
      </div></a
            >
          </li>
        
        </ul>
      </div>

    
      <div className="md:mb-6">
        <h5
          className="mb-4 font-medium  text-base md:text-xl text-[#CDF27E]">
          Download the Medemma App
        </h5>

        <ul className="mb-0 list-none text-sm font-normal">
          <li>
            <a href="#!" className=""
              >Your home for health is one top away</a
            >
          </li>
          <li>
            <a href="#!" className=""
              > <div className='flex justify-center mt-8'>
                    <div className="  flex justify-center items-center rounded-full">
                        <Image src={googleplay} alt='phone' />    
                    </div>
                    <div className="  flex justify-center items-center rounded-full">
                        <Image src={appstore} alt='phone' />    
                    </div>
                </div>
            </a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>


  <div
    class="bg-[#1A3578] p-4 text-center text-gray-400  w-full">
    Design and Developed by<span className="text-[#CDF27E]"> Khan Studio</span> 
    </div>
   </div>
    </>
  )
}

export default FooterView;