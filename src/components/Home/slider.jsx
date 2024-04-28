import React from "react";
import Image from "next/image";
import doctor from "../../../public/images/home-slide.png";
import slidebg from "../../../public/images/bg-slide.png";
import { RevealWrapper } from "next-reveal";
const HomeSlider = () => {
  return (
    <div>
      <div
        id="controls-carousel"
        className="relative w-full  lg:h-[600px] bg-black"
        data-carousel="static"
      >
        <div className="relative h-[240px]  lg:h-[600px] overflow-hidden   ">
          <div className="flex justify-center text-center " data-carousel-item>
            <Image
              className="h-[240px] lg:h-[600px] w-full"
              src={slidebg}
              alt=""
            />
            <div className="absolute  flex justify-center items-center bottom-0 ">
              <RevealWrapper
                rotate={{ x: 0, y: 0, z: 0 }}
                origin="left"
                delay={200}
                duration={1000}
                distance="200px"
                reset={true}
                viewOffset={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                <div className="text-white grid    md:w-[528px]  ml-3 lg:mr-10 mb-4 lg:mb-20">
                  <div className="md:text-[70px] text-lg font-[700]  text-left ">
                    <h1 className="leading-[40px] md:leading-[70px]">
                      We Give S<span className="text-[#CDF27E]">olution </span>
                      <p>to Your Pain</p>
                    </h1>
                  </div>
                  <span className="mt-1 md:mt-4 text-left font-light text-xs md:text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,{" "}
                    <span className="hidden lg:flex">
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </span>
                  </span>
                  <button className="mt-6 lg:mt-12 whitespace-nowrap text-sm md:text-base font-semibold  bg-[#CDF27E]  text-black py-1 md:py-2 px-3 rounded-sm sm:px-6 h-[35px] md:h-[50px] w-[100px] md:w-[150px]">
                    Book Now
                  </button>
                </div>
              </RevealWrapper>
              <RevealWrapper
                rotate={{ x: 0, y: 0, z: 0 }}
                origin="right"
                delay={200}
                duration={1000}
                distance="200px"
                reset={true}
                viewOffset={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                <Image
                  className="h-[200px] w-[200px]  md:mb-0 lg:h-[500px] lg:w-[500px] mr-12 md:mr-3"
                  src={doctor}
                  alt="..."
                />
              </RevealWrapper>
            </div>
          </div>

          <div
            className="hidden duration-700 ease-in-out "
            data-carousel-item="active"
          >
            <Image
              src=""
              className="absolute block w-full  -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              alt="..."
            />
          </div>
        </div>

        <button
          type="button"
          className="absolute top-0 left-0 z-30 hidden md:flex items-center justify-center h-full  cursor-pointer group focus:outline-none"
          data-carousel-prev
        >
          <span className="inline-flex items-center justify-center md:w-8 h-12 md:h-20  bg-[#CDF27E] dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
              aria-hidden="true"
              className="w-4 h-4 md:w-6 md:h-6 text-black dark:text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
        <button
          type="button"
          className="absolute top-0 right-0 z-30 flex items-center justify-center h-full  cursor-pointer group focus:outline-none"
          data-carousel-next
        >
          <span className="inline-flex items-center justify-center md:w-8 h-10 md:h-20  bg-[#CDF27E] dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
              aria-hidden="true"
              className="w-4 h-4 md:w-6 md:h-6 text-black dark:text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default HomeSlider;
