import React, { useState, useEffect } from "react";
import logo1 from "../../public/images/logo1.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { Input, message, Form, Upload, Button, Spin, Modal } from "antd";
import { InboxOutlined } from '@ant-design/icons';
import withReactContent from "sweetalert2-react-content";
import { initialUserFormState } from "@/globalvaraible/varaible.golobal";
import { convertEmptyStringToNull } from "@/globalvaraible/commonfunctions";
import { userSignup } from "@/services";
import axios from "axios";
import { BASE_URL } from "@/services/endpoints";


const Index = () => {
  const MySwal = withReactContent(Swal);
  const router = useRouter();

  const [formData, setFormData] = useState(initialUserFormState);
  const [fileList, setFileList] = useState([]);
  const [editData, setEditData] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadImage, setUploadImage] = useState(false);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const validatePassword = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    setError("");
    return true;
  };

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!validatePassword()) {
        return;
      }
      let { confirmpassword, confirmPassword, username, ...data } = formData

      let userData = convertEmptyStringToNull(data)
      userData['type'] = 'Individual'
      let params = new FormData();

      Object.entries(userData).forEach(([key, value]) => {
        if (key !== 'images') {
          params.append(key, value);
        }
      });

      if (userData.images && userData.images.length > 0) {
        userData.images.forEach((image) => {
          params.append('images', image);
        });
      }


      // MySwal.showLoading();
      console.log("herererererrererererererererrer")
      const response = await axios.post(`${BASE_URL}/user/register`, params, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("aggggggggyyyyyyyyyyyyyyyyyyy Aya ")
      if (response.data.auth) {
        console.log("resdata...........", res.data)
        MySwal.fire({
          icon: "success",
          text: " Sign Up Successfull",
        });
      }
      // router.push("/login");
      // console.log("send error.nnnnn..", err);
      // MySwal.fire({
      //   icon: "error",
      //   // title: 'Oops...',
      //   text: err?.response?.data?.message,
      // });
      // router.push("/login");
    } catch (error) {
      console.log("err.message ", error)
      MySwal.fire({
        icon: "error",
        // title: 'Oops...',
        text: error?.response?.data?.message,
      });
    }
  };
  const handleChange = (info) => {
    setFileList(info.fileList);
    console.log("images", info.fileList)

    const images = fileList.map(file => file.originFileObj);

    setFormData((prevFormData) => ({ ...prevFormData, images: images }));

    if (info.file.status === 'uploading') {
      message.loading('Uploading...');
    }

    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    }
  };
  const beforeUpload = (file) => {
    // Validate file type (optional)
    const isImage = file.type.indexOf('image/') === 0;
    if (!isImage) {
      message.error('You can only upload image files!');
      return Promise.reject(file);
    }

    // Validate file size (optional)
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return Promise.reject(file);
    }

    // You can also perform additional validations here

    return Promise.resolve();
  };

  return (
    <div className={`parent pb-12`}>
      <div className=" font-[poppinsregular] flex flex-1 flex-col h-[100%] px-6 py-4">
        <Link href="/">
          <div className="fixed top-6 left-6">
            <Image
              src={logo1}
              className="h-[50px] w-[130px] lg:h-[80px] lg:w-[200px] object-contain lg:ml-6"
              alt="logo"
            />
          </div>
        </Link>

        <div className="flex justify-center items-center -mt-6  flex-1 lg:mt-0">
          <form onSubmit={handleFormSubmit}>
            <div className="mt-24 lg:mt-0 bg-slate-950 bg-opacity-40 w-full sm:w-[650px] rounded-md flex flex-col gap-2 px-8 shadow-sm shadow-blue-950 py-4">
              <h1 className="text-2xl lg:text-3xl text-[#C6ED73]">Join Us</h1>
              <h4 className="text-sm mb-1 text-gray-300">
                To Keep connected with us please Sign up with your personal
                information.
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 text-white gap-y-1">
                <div className="flex flex-col ">
                  <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                    Full Name
                  </label>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleFormChange}
                    placeholder="Your Name"
                    className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-white rounded-md"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs lg:text-sm text-[#C6ED73] -mb-1 mt-2">
                    Email Address
                  </label>
                  <Input
                    autoComplete="off"
                    name="email"
                    type="email"
                    onChange={handleFormChange}
                    required
                    value={formData.email}
                    placeholder="Enter Your Email"
                    className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent outline-none border mt-2 px-4 text-gray-300 rounded-md"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs lg:text-sm text-[#C6ED73] -mb-1 mt-2">
                    Enter Password
                  </label>
                  <Input.Password
                    autoComplete="off"
                    name="password"
                    type="password"
                    onChange={handleFormChange}
                    required
                    value={formData.password}
                    placeholder="Password"
                    className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-300 rounded-md"
                    iconRender={(visible) =>
                      visible ? (
                        <div className="cursor-pointer">
                          <h6 className="cursor-pointer">Hide</h6>
                        </div>
                      ) : (
                        <div className="cursor-pointer">
                          <h6 className="cursor-pointer">Show</h6>
                        </div>
                      )
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs lg:text-sm text-[#C6ED73] -mb-1 mt-2">
                    Confirm Password
                  </label>
                  <Input.Password
                    autoComplete="off"
                    name="confirmPassword"
                    type="password"
                    onChange={handleFormChange}
                    required
                    value={formData.confirmPassword}
                    placeholder="Confirm Password"
                    className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-300 rounded-md"
                    iconRender={(visible) =>
                      visible ? (
                        <div className="cursor-pointer">
                          <h6 className="cursor-pointer">Hide</h6>
                        </div>
                      ) : (
                        <div className="cursor-pointer">
                          <h6 className="cursor-pointer">Show</h6>
                        </div>
                      )
                    }
                  />
                </div>
                <div className="flex flex-col ">
                  <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                    Education
                  </label>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleFormChange}
                    placeholder="Education"
                    className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-300 rounded-md"
                  />
                </div>
                <div className="flex flex-col ">
                  <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                    Experience
                  </label>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleFormChange}
                    placeholder="Experience"
                    className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-300 rounded-md"
                  />
                </div>
                <div className="flex flex-col ">
                  <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                    Address
                  </label>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    placeholder="address"
                    className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-300 rounded-md"
                  />
                </div>
                <div className="flex flex-col ">
                  <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                    City
                  </label>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    placeholder="City"
                    className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-300 rounded-md"
                  />
                </div>
                <div className="flex flex-col ">
                  <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                    Phone
                  </label>
                  <Input
                    autoComplete="off"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    maxLength={11}
                    onChange={handleFormChange}
                    placeholder="Phone"
                    className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-300 rounded-md"
                  />
                </div>
                <div className="flex flex-col ">
                  <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                    DOB
                  </label>
                  <input
                    autoComplete="off"
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleFormChange}
                    placeholder=""
                    className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-400 rounded-md"
                  />
                </div>
                <div className="flex flex-col ">
                  <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                    Gender
                  </label>
                  <select
                    className="  placeholder:text-gray-400 text-md lg:text-sm py-3 bg-transparent  border outline-none mt-2 px-4 text-gray-400  rounded-md"
                    name="gender"
                    value={formData.gender}
                    onChange={handleFormChange}
                    placeholder="Gender"
                  >
                    <option defaultChecked className="py-2" value="male">
                      Male
                    </option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col ">
                  <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                    Specialization
                  </label>
                  <select
                    className="appearance-none placeholder:text-gray-400 text-md lg:text-sm py-3 bg-transparent border outline-none mt-2 px-4 text-gray-400 rounded-md"
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                  >
                    <option value="PhysioDcotor">Physio</option>
                    <option value="Aya">Aya</option>
                    <option value="Nurses">Nurse</option>
                  </select>

                </div>
                <div className="flex flex-col ">
                  <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                    fee perHour
                  </label>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="perHour"
                    value={formData.perHour}
                    maxLength={11}
                    onChange={handleFormChange}
                    placeholder="Fee per Hour"
                    className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-300 rounded-md"
                  />
                </div>
                <div className="flex flex-col ">
                  <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                    fee perDay
                  </label>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="perDay"
                    value={formData.perDay}
                    maxLength={11}
                    onChange={handleFormChange}
                    placeholder="Fee per Day"
                    className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-300 rounded-md"
                  />
                </div>
                <div className="flex flex-col ">
                  <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                    Hospital You are working
                  </label>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="hospital"
                    value={formData.hospital}
                    maxLength={100}
                    onChange={handleFormChange}
                    placeholder="Hospital Your are working in"
                    className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-300 rounded-md"
                  />
                </div>
                <div className="flex flex-col ">
                  <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                    Discount Upto in %
                  </label>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="discount"
                    value={formData.discount}
                    maxLength={100}
                    onChange={handleFormChange}
                    placeholder="Hospital Your are working in"
                    className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-300 rounded-md"
                  />
                </div>

                <div className="flex flex-col ">
                  <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                    Emergency contact
                  </label>
                  <Input
                    autoComplete="off"
                    type="tel"
                    name="emergency"
                    value={formData.emergency}
                    maxLength={11}
                    onChange={handleFormChange}
                    placeholder="Emergency contact"
                    className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-300 rounded-md"
                  />
                </div>
                <div className="flex flex-col ">
                  <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                    Availability Yes/No
                  </label>
                  <Input
                    autoComplete="off"
                    type="tel"
                    name="availability"
                    value={formData.availability}
                    maxLength={11}
                    onChange={handleFormChange}
                    placeholder="Emergency contact"
                    className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-300 rounded-md"
                  />
                </div>
                <div className="flex flex-col col-span-2 ">
                  <label className="text-xs lg:text-sm text-[#C6ED73]   -mb-1 mt-2">
                    why you?
                  </label>
                  <Input
                    autoComplete="off"
                    type="text"
                    name="description"
                    value={formData.description}
                    maxLength={1000}
                    onChange={handleFormChange}
                    placeholder="Why you ?"
                    className=" placeholder:text-gray-400 text-xs lg:text-sm py-2 bg-transparent border outline-none mt-2 px-4 text-gray-300 rounded-md"
                    style={{ height: '5rem' }}
                  />
                </div>

                <div className="col-span-2 mt-4">
                  <Form.Item
                    label={<span className="text-white">Image</span>}
                    name="image"
                  >
                    <Upload
                      name="images" // Rename 'name' for clarity
                      listType="picture-card"
                      fileList={fileList}
                      onChange={handleChange}
                      multiple
                      beforeUpload={beforeUpload}
                      accept="image/*"
                    >
                      {fileList.length > 0 ? (
                        <InboxOutlined />
                      ) : (
                        <div>
                          <InboxOutlined />
                          <div className="ant-upload-text">upload</div>
                        </div>
                      )}
                    </Upload>

                  </Form.Item>
                </div>
                <div>
                </div>
              </div>
              <div className="flex justify-center mt-2 ">
                {loading ? (
                  <div className="h-12 w-24 flex justify-center">
                    <Spin />
                  </div>
                ) : editData ? (
                  <button
                    type="submit"
                    className="w-full text-xs lg:text-sm py-3 hover:bg-[#7ba129] bg-[#C6ED73] font-semibold rounded-md"
                  >
                    Sign Up
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full text-xs lg:text-sm py-3 hover:bg-[#7ba129] bg-[#C6ED73] font-semibold rounded-md"
                  >
                    Sign Up
                  </button>
                )}
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

export default Index;
