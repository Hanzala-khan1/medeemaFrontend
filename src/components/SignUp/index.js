import React, { useEffect, useState } from "react";
import logo1 from "../../../public/images/logo1.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Input } from "antd";
import { userSignup } from "@/services";
import { useDispatch } from "react-redux";
import { initialUserFormState } from "@/globalvaraible/varaible.golobal";
import { convertEmptyStringToNull } from "@/globalvaraible/commonfunctions";

const SignUpPage = () => {
  const MySwal = withReactContent(Swal);
  const router = useRouter();
  const [formData, setFormData] = useState(initialUserFormState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const [error, setError] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    // setCoupon(router.query.coupon);
  }, []);
  const validatePassword = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    setError("");
    return true;
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!validatePassword()) {
      return;
    }
    let { confirmpassword,confirmPassword,username, ...data } = formData
    data['type'] = 'Visiter'
    data['role'] = 'Visiter'
    let userData=convertEmptyStringToNull(data)
    let params = userData
    MySwal.showLoading();
    userSignup(params)
      .then((res) => {
        if (res.data.auth) {
          MySwal.fire({
            icon: "success",
            // title: 'Oops...',
            text: " Sign Up Successfull",
          });
          router.push("/login");
        }
      })
      .catch((err) => {
        console.log("send error.nnnnn..", err);
        MySwal.fire({
          icon: "error",
          // title: 'Oops...',
          text: err?.response?.data?.message,
        });
      })
      .finally(() => {
        MySwal.hideLoading();
      });
  };


  return (
    <div className={` parent md:h-[100vh] xl:h-[150vh] `}>
      <div className=" font-[poppinsregular]  flex flex-1 flex-col  px-6 py-4">
        <Link href="/">
          <div className="fixed top-6 left-6">
            <Image
              src={logo1}
              className="h-[50px] w-[130px] lg:h-[80px] lg:w-[200px] object-contain lg:ml-16"
              alt="logo"
            />
          </div>
        </Link>
        <div className="flex justify-center items-center mb-12 flex-1 lg:mt-12">
          <form onSubmit={handleSignUp}>
            <div className="mt-24 lg:mt-0 bg-slate-950 bg-opacity-40 w-full sm:w-[450px] rounded-md flex flex-col gap-2 px-8 shadow-sm shadow-blue-950 py-4">
              <h1 className="text-2xl lg:text-3xl text-[#C6ED73]">Sign Up</h1>
              <h4 className="text-sm mb-1 text-gray-300">
                To Keep connected with us please Sign up with your personal
                information.
              </h4>
              <div className="flex flex-col mt-2">
                <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                  full Name
                </label>
                <Input
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs lg:text-sm text-[#C6ED73] -mb-1 mt-2">
                  Email Address
                </label>
                <Input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  required
                  value={formData.email}
                  placeholder="Enter Your Email"
                  className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent outline-none border mt-2 px-4 text-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                  Address
                </label>
                <Input
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                  phone
                </label>
                <Input
                  name="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                  gender
                </label>
                <Input
                  name="gender"
                  type="text"
                  value={formData.gender}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                  city
                </label>
                <Input
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs lg:text-sm text-[#C6ED73] -mb-1 mt-2">
                  Enter Password
                </label>
                <Input.Password
                  name="password"
                  type="password"
                  onChange={handleChange}
                  required
                  value={formData.password}
                  placeholder="Password"
                  className="text-xs lg:text-sm py-2 bg-transparent outline-none border mt-2 px-4 text-gray-300 rounded-md"
                  iconRender={(visible) =>
                    visible ? (
                      <span className="text-xl text-white cursor-pointer">
                        <FaEye />
                      </span>
                    ) : (
                      <span className="text-xl cursor-pointer">
                        <FaEyeSlash />
                      </span>
                    )
                  }
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs lg:text-sm text-[#C6ED73] -mb-1 mt-2">
                  Re-enter Password
                </label>
                <Input.Password
                  name="confirmPassword"
                  type="password"
                  onChange={handleChange}
                  required
                  value={formData.confirmPassword}
                  placeholder="re-enter Password"
                  className="text-xs text-white placeholder:text-gray-300 lg:text-sm py-2 outline-none bg-transparent border mt-2 px-4  rounded-md"
                  iconRender={(visible) =>
                    visible ? (
                      <div className="text-lg text-white cursor-pointer">
                        <FaEye />
                      </div>
                    ) : (
                      <div className="text-lg cursor-pointer">
                        <FaEyeSlash />
                      </div>
                    )
                  }
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full text-xs lg:text-sm py-3 hover:bg-[#7ba129] bg-[#C6ED73] font-semibold rounded-md"
                >
                  Sign Up
                </button>
              </div>
              <div className="text-center text-gray-300 py-4">
                <Link href="/login">
                  <button className="text-xs lg:text-sm hover:text-[#C6ED73]">
                    Already have an account?
                    <span className="text-[#C6ED73]">Log in.</span>{" "}
                  </button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
