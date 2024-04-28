import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

const CategoryCard = ({ title, description, path, images }) => {
  const router = useRouter();

  const handleClick = () => {
    let targetPage;
    switch (title) {
      case "Ask Experts":
        targetPage = "/ask-expert";
        router.push(targetPage)
        break;
      default:
        targetPage = "/List";
        const query = { page: title };
        router.push({
          pathname: targetPage,
          query: query,
        });
    }
  };

  return (
    <div className="lg:flex sm:grid sm:grid-cols-2  bg-[#F1F6F9] rounded-e-lg">
      <button
        className="flex justify-center w-full sm:justify-start lg:w-[450px] sm:w-full  lg:h-[230px] sm:h-[250px]"
        onClick={handleClick}
      >
        <Image
          src={images}
          width={200}
          height={200}
          className=" w-[100%]  h-[100%]"
          style={{ objectFit: "cover" }}
          alt=".."
        />
      </button>
      <div className=" text-center justify-center items-center md:text-left  px-4  lg:py-8 grid h-[170px] md:h-[230px]">
        <button
          className="  text-[#1A3578] text-center md:text-start text-xl font-semibold mt-2 "
          onClick={handleClick}
        >
          {title ? title : "Rehabilitation center"}
        </button>
        <span className=" text-sm text-gray-400 lg:mt-2">{description}</span>
        <div>
          <button
            className="   sm:mt-2 lg:mt-4 text-xs md:text-sm font-medium  bg-[#CDF27E]  text-black  py-2  lg:px-4 rounded-md w-[100px] lg:w-[120px]"
            onClick={handleClick}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
export default CategoryCard;
