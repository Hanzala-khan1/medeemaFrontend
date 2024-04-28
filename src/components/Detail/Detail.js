import React, { useState, useEffect, useCallback, useMemo } from "react";
import Banner from "../Common/Banner";
import Image from "next/image";
import useRazorpay from "react-razorpay";
import { useRouter } from "next/router";
import mapPic from "../../../public/images/map.png";
import doctor from "../../../public/images/svg/doctor.svg";
import noimg from "../../../public/images/noimg.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import {
    AiOutlineClockCircle,
    AiOutlineBulb,
    AiOutlineAccountBook,
    AiTwotoneCar,
} from "react-icons/ai";
import {addOrder, getSingleRehab, getUserById } from "@/services";
import { useSelector } from "react-redux";
import { initialBookingFormState } from "@/globalvaraible/varaible.golobal";


const Detail = ({ type, id, from, to }) => {
    const router = useRouter();
    const [Razorpay] = useRazorpay();
    const [box, setBox] = useState(false);
    const [data, setData] = useState({});
    const [imgView, setImgView] = useState(
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRvY3RvcnN8ZW58MHx8MHx8fDA%3D"
        )
    const [errorMessage, setErrorMessage] = useState("");
    const [fees, setFees] = useState(null);
    const MySwal = withReactContent(Swal);
    const [formData, setFormData] = useState(initialBookingFormState);
    useEffect(() => {
            getData();
            console.log("calling api in details")
    }, [id]);

    const getData = async () => {
        try {
            MySwal.showLoading();
            // console.log("ttttttttttttttttttvvvvvvvvvvvvvvvv",id)
            let user_data;
            if (type != "Rehabilitation Care") {
                user_data = await getUserById(id)
            } else {
                user_data = await getSingleRehab(id)
            }
            console.log("ttttttttttttttttttvvvvvvvvvvvvvvvv",user_data)
            if (!user_data) {
                MySwal.fire({
                    icon: "info",
                    // title: 'Oops...',
                    text: "No Data found",
                });
            }
            MySwal.hideLoading();
            user_data.data.userList['images'] = [
                {
                    url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRvY3RvcnN8ZW58MHx8MHx8fDA%3D"
                },
                {
                    url: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGRvY3RvcnN8ZW58MHx8MHx8fDA%3D"
                },
                {
                    url: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fGRvY3RvcnN8ZW58MHx8MHx8fDA%3D"
                },
                {
                    url: "https://images.unsplash.com/photo-1640876777002-badf6aee5bcc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fGRvY3RvcnN8ZW58MHx8MHx8fDA%3D"
                },
                {
                    url:"https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9jdG9yfGVufDB8fDB8fHww"
                },
                {
                    url:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZG9jdG9yfGVufDB8fDB8fHww"
                },
                {
                    url:"https://plus.unsplash.com/premium_photo-1661764878654-3d0fc2eefcca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D"
                },
                {
                    url:"https://plus.unsplash.com/premium_photo-1661757221486-183030ef8670?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D"
                },
                {
                    url:"https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D"
                },
                {
                    url:"https://plus.unsplash.com/premium_photo-1661766718556-13c2efac1388?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTN8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D"
                },
                {
                    url:"https://plus.unsplash.com/premium_photo-1661690006963-7c8868418ed6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fGJ1ZWF0aWZ1bCUyMGxhZHklMjBudXJzZXN8ZW58MHx8MHx8fDA%3D"
                },
                {
                    url:"https://plus.unsplash.com/premium_photo-1661270443521-390dd7111b8e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzd8fG51cnNlc3xlbnwwfHwwfHx8MA%3D%3D"
                },
            ];
            if (type != "Rehabilitation Care") {
                setData(user_data.data.userList)
            } else {
                setData(user_data.data.rehab)
            }

            console.log("uesssssssssrrrrrrrrrrrrrrr",user_data.data.rehab)
            
            MySwal.close();
        } catch (error) {
            MySwal.fire({
                icon: "error",
                // title: 'Oops...',
                text: error?.response?.data?.message,
            });
        }

    };
console.log("daradradarddatdatadtadatdatadatdat",data)
    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const addData = async (e) => {
        try {
            e.preventDefault();
            let is_rehab;
            switch (type) {
                case "Rehabilitation Care":
                    is_rehab = true;
                    formData.booking_type = "rehab"
                    formData.requested_rehab_id = id
                    break;
                default:
                    is_rehab = false;
                    formData.booking_type = "user"
                    formData.requested_user_id = id
                    break;
            }
            formData.is_booked_rehab = is_rehab
            let params = formData
            console.log(params)
            MySwal.showLoading();

            let booked = await addOrder(params)
            console.log("booooooookkkkkkkkkkkkkkkkkkkkkkkkeeeeeeeeeeeeddddddd",booked)
            if (!booked) {
                MySwal.fire({
                    icon: "success",
                    // title: 'Oops...',
                    text: booked?.response?.data?.message,
                });
            } else {
                MySwal.fire({
                    icon: "success",
                    // title: 'Oops...',
                    text: "Booked Successfull",
                });
            }
            
            router.push("/orders");

            MySwal.hideLoading();
        } catch (error) {
            MySwal.fire({
                icon: "error",
                // title: 'Oops...',
                text: error?.response?.data?.message,
            });
        }
    }

    const handlePayment = useCallback(
        // async (id, docs) => {
        //     // await OrderApi.createOrder({
        //     //   products: cart?.products,
        //     //   customerId: localStorage.getItem("id"),
        //     //   amount: sum,
        //     //   date: serverTimestamp(),
        //     //   status: "New",
        //     // });

        //     const options = {
        //         key: "rzp_test_sfwDxiLmKtw7ol",
        //         amount: parseInt(docs),
        //         currency: "INR",
        //         name: "Dummy",
        //         description: "Test Transaction",
        //         image: "https://example.com/your_logo",
        //         handler: (res) => {
        //             localStorage.clear();
        //             updateBooking(id, res.razorpay_payment_id);
        //         },
        //         modal: {
        //             ondismiss: async () => {
        //                 const docRef = doc(db, "orders", id);
        //                 sessionStorage.clear();
        //                 try {
        //                     const res = await deleteDoc(docRef);
        //                     sessionStorage.clear();
        //                     setFormData({
        //                         package: "perday",
        //                         rate: "perHour",
        //                         bookFrom: "",
        //                         bookTo: "",
        //                         patientName: "",
        //                         altPhone: "",
        //                         phone: "",
        //                         dob: "",
        //                         message: "",
        //                         patientGender: "male",
        //                     });
        //                 } catch (error) {
        //                     console.log(error);
        //                 }
        //             },
        //         },
        //         prefill: {
        //             name: "Piyush Garg",
        //             email: "youremail@example.com",
        //             contact: "03334814702",
        //         },
        //         notes: {
        //             address: "Razorpay Corporate Office",
        //         },
        //         theme: {
        //             color: "#3399cc",
        //         },
        //     };

        //     const rzpay = new Razorpay(options);
        //     rzpay.open();
        // },
        // [Razorpay]
    );
    return (
        <div className="mb-12 ">
            <Banner
                title={"Rehabilitaion Details"}
                subHeading1={"Home"}
                subHeading2={"Rehabilitation Detals"}
            />
            <div className="grid grid-cols-1 md:grid-cols-7 w-full px-4 lg:px-28 mt-12 ">
                <div className=" grid grid-rows-[300px] lg:grid-rows-[650px_150px] col-span-1 md:col-span-3 gap-2 lg:gap-9 rounded-lg">
                    <div className="px-4 md:px-0">
                        <Image
                            className="p-4 lg:p-0 h-full  w-full object-cover "
                            loading="lazy"
                            src={imgView}
                            alt="img2"
                            width={200}
                            height={150}
                        />
                    </div>
                    <div className="   h-[80px] lg:h-[150px] px-4 w-[320px] mb-2 md:mb-0 md:w-[450px]">
                        <Swiper
                            modules={[Navigation, Pagination, Scrollbar, A11y]}
                            spaceBetween={15}
                            slidesPerView={4}
                            navigation
                            pagination={{ clickable: true }}
                            scrollbar={{ draggable: true }}
                            onSlideChange={() => console.log("slide change")}
                            onSwiper={(swiper) =>
                                console.log(swiper)
                            }
                        >
                            {data?.images?.map((doc, index) => {
                                return (
                                    <SwiperSlide key={index}>
                                        <div>
                                            <button
                                                onClick={() => {
                                                    setImgView(data ? doc.url : noimg);
                                                }}
                                            >
                                                {" "}
                                                <Image
                                                    className="  object-cover w-[1000px] lg:w-[150px] h-[80px] lg:h-[150px] "
                                                    src={doc.url ? doc.url : noimg}
                                                    alt="img2"
                                                    width={200}
                                                    height={150}
                                                />
                                            </button>
                                        </div>
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </div>
                </div>

                {data ? (
                    <div className="col-span-1 md:col-span-4 bg-white px-6  py-8">
                        <div>
                            <h2 className="text-2xl text-[#1A3578] font-bold  w-[80%]">
                                {data?.full_name}
                            </h2>
                        </div>
                        <div className="grid lg:flex justify-between px-4 items-center">
                            <div className="flex gap-3 mt-2 text-sm font-medium">
                                <h4 className=" text-[#ABABAB] text-sm">perday:{data.perDay}$</h4>
                                {/* <h4 className="bg-green-100 ">discount {data.discount}%</h4> */}
                                <span className="text-sm text-[#1A3578] font-semibold">
                                discount {data.discount}%
                                </span>
                            </div>
                            <div className="text-[#F8C100] flex items-center gap-2">
                              4
                                <h2 className="text-black text-base">reviews</h2>
                                <h2 className="text-[#ABABAB] text-base">{"(234)"}</h2>
                            </div>
                        </div>
                        <div className="text-black lg:flex mt-4">
                            <h4>{data.description}</h4>
                        </div>
                        <div>
                            <h4 className="text-xl text-[#1A3578] font-bold mt-4">
                                Why reserve this Rehab
                            </h4>{" "}
                        </div>
                        <div className="mt-4 flex flex-wrap items-start justify-start lg:gap-2 gap-y-4">
                            {/* {data.doctorAvail && ( */}
                                <div className="flex items-center gap-2">
                                    <div className="text-lg bg-[#CDF27E] px-1 py-1">
                                        <AiOutlineClockCircle />
                                    </div>
                                    <h4 className="text-black">
                                        24/7 Doctors and Nurse available
                                    </h4>
                                </div>
                            {/* // )} */}
                            {/* {data.powerBackup && ( */}
                                <div className="flex items-center justify-end md:mx-auto gap-2">
                                    <div className="text-lg bg-[#CDF27E] px-1 py-1">
                                        <AiOutlineBulb />
                                    </div>
                                    <h4 className="text-black">24/ Power backup</h4>
                                </div>
                            {/* )} */}
                            <div className="flex items-center  gap-2">
                                <div className="text-lg bg-[#CDF27E] px-1 py-1">
                                    <Image
                                        src={doctor}
                                        alt="doctor"
                                        className="h-5  w-5 bg-[#CDF27E]  "
                                    />
                                </div>
                                <h4 className="text-black">Certified Doctors and Nurse</h4>
                            </div>
                            {/* {data.parkingFacility && ( */}
                                <div className="flex items-center md:mx-auto  gap-2 lg:pl-4">
                                    <div className="text-lg bg-[#CDF27E]  px-1 py-1">
                                        <AiTwotoneCar />
                                    </div>
                                    <h4 className="text-black">Parking Facility</h4>
                                </div>
                            {/* )} */}
                            <div className="flex items-center   gap-2">
                                <div className="text-lg bg-[#CDF27E]  px-1 py-1">
                                    <AiOutlineAccountBook />
                                </div>
                                <h4 className="text-black">
                                    {"(Count)  of booking in last one month"}
                                </h4>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 text-black h-[100px] mt-6 gap-4 ">
                            <div className="bg-[#1A3578] px-4 py-3 text-white">
                                <h3 className="text-lg">Rehab Adreess</h3>
                                <h4 className="mt-2 text-sm text-gray-200 font-normal">
                                  {data.address}
                                </h4>
                            </div>
                            <div>
                                <Image
                                    src={mapPic}
                                    className="h-[100px] w-full object-cover"
                                    alt="map"
                                />
                            </div>
                        </div>
                        <div className=" mt-36 md:mt-8">
                            <h2 className="my-4 text-[#1A3578] text-2xl font-semibold">
                                Reserve Shedule
                            </h2>
                            {errorMessage && (
                                <div
                                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                                    role="alert"
                                >
                                    <strong className="font-bold">{data?.name} </strong>
                                    <span className="block sm:inline">{data?.name}</span>
                                    <span
                                        onClick={handleCloseModal}
                                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                                    >
                                        <svg
                                            className="fill-current h-6 w-6 text-red-500"
                                            role="button"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <title>Close</title>
                                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                                        </svg>
                                    </span>
                                </div>
                             )} 
                            <div className="mb-1 ml-2 text-black space-x-3">
                                <span>
                                    Amount:100
                                </span>
                                <span>Discount : 100%</span>
                                {/* <span>
                                    Total :{" "}
                                    {formData.rate == "perHour"
                                        ? Number(
                                            data?.perHour * 8 * diffDays -
                                            (data?.discount / 100) *
                                            (data?.perHour * 8 * diffDays)
                                        )
                                        : Number(
                                            data?.perDay * diffDays -
                                            (data?.discount / 100) *
                                            (data?.perDay * diffDays)
                                        )}
                                </span> */}
                                <span>
                                    {/* {" "}
                                    {data?.couponUsed == false &&
                                        data?.signUp == true &&
                                        calculation / 100 > 500 ? (
                                        <span>{`G.T :${calculation / 100 - 1500}`}</span>
                                    ) : (
                                        <span>{`G.T :${calculation / 100}`}</span>
                                    )} */}
                                </span>
                                {/* <div>
                                    {data?.signUp && data?.couponUsed == false ? (
                                        <span className="flex space-x-2">
                                            <span> Coupon 1500</span>{" "}
                                            <span className="text-green-600">
                                                {" "}
                                                <FaCheckCircle />
                                            </span>{" "}
                                            <span>
                                                for use coupon booking amount should greater than 5000{" "}
                                            </span>{" "}
                                        </span>
                                    ) : (
                                        <span className="flex space-x-2"> </span>
                                    )}
                                </div> */}
                            </div>
                            <div className="grid text-black grid-rows-[80px_80px_80px_80px_120px_80px] ">
                                <div className="flex flex-col px-2 row-span-1 md:col-span-1 col-span-2">
                                    <label className=""> Select package</label>
                                    <select
                                        onChange={handleFormChange}
                                        name="package"
                                        value={formData.package}
                                        className="h-[42px] w-full text-lg px-2 bg-transparent border border-black rounded-md"
                                    >
                                        <option value="perDay">Per day</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                                <div className="flex flex-col px-2 row-span-1 md:col-span-1 col-span-2">
                                    <label className=""> Select Rate</label>
                                    <select
                                        onChange={handleFormChange}
                                        value={formData.rate_type}
                                        name="rate_type"
                                        placeholder="select rate"
                                        className="h-[42px] text-lg px-2 w-full bg-transparent border placeholder:text-gray-400 border-black rounded-md"
                                    >
                                        <option value="perHour">per hour</option>
                                        <option value="perDay">perday</option>
                                    </select>
                                </div>
                                <div className="flex flex-col row-span-1 px-2 md:col-span-1 col-span-2">
                                    <label className=""> From </label>
                                    <input
                                        onChange={handleFormChange}
                                        value={formData.from}
                                        name="from"
                                        type="date"
                                        placeholder="12-May-2023"
                                        className="py-2 px-2 bg-transparent border w-full placeholder:text-gray-400 border-black rounded-md"
                                    />
                                </div>
                                <div className="flex flex-col row-span-1 px-2  md:col-span-1 col-span-2">
                                    <label className=""> To </label>
                                    <input
                                        onChange={handleFormChange}
                                        value={formData.to}
                                        name="to"
                                        type="date"
                                        placeholder="14-May-2023"
                                        className="py-2 px-2 bg-transparent border w-full placeholder:text-gray-400 border-black rounded-md"
                                    />
                                </div>
                                <div className="flex flex-col row-span-1 px-2 md:col-span-1 col-span-2">
                                    <label className=""> Patient Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="py-2 px-2 bg-transparent border placeholder:text-gray-400 border-black rounded-md"
                                        onChange={handleFormChange}
                                        value={formData.patientName}
                                        name="patientName"
                                    />
                                </div>
                                <div className="flex flex-col row-span-1 -mt-10 md:-mt-1 px-2 md:col-span-1 col-span-2">
                                    <label className=""> Gender</label>
                                    <select
                                        onChange={handleFormChange}
                                        value={formData.gender}
                                        name="gender"
                                        className="h-[42px] text-lg px-2 bg-transparent border border-black rounded-md"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div className="flex flex-col  px-2 md:col-span-1 -mt-10 md:-mt-1 col-span-2 ">
                                    <label className=""> Phone Number</label>
                                    <input
                                        type="tel"
                                        maxLength={13}
                                        placeholder="Phone Number"
                                        className="py-2 px-2 bg-transparent border  text-black border-black rounded-md"
                                        onChange={handleFormChange}
                                        value={formData.phone}
                                        name="phone"
                                    />
                                </div>
                                <div className="flex flex-col px-2 md:col-span-1 my-2 md:my-0 md:-mt-1 col-span-2">
                                    <label className="hidden md:block"> Alternative number</label>
                                    <label className="block md:hidden"> Alternative num</label>
                                    <input
                                        type="tel"
                                        placeholder="Alternative number"
                                        maxLength={13}
                                        className="py-2 px-2 bg-transparent border border-black rounded-md"
                                        onChange={handleFormChange}
                                        value={formData.alternative_phone}
                                        name="alternative_phone"
                                    />
                                </div>
                                <div className="flex flex-col px-2 mb-2 md:mb-0  col-span-2">
                                    <label className="md:mt-0"> Date of Birth</label>
                                    <input
                                        type="date"
                                        placeholder="+91 555 334 4"
                                        className="py-2 px-2 bg-transparent border w-full placeholder:text-gray-400 border-black rounded-md"
                                        onChange={handleFormChange}
                                        value={formData.DOB}
                                        name="DOB"
                                    />
                                </div>
                                <div className="flex flex-col px-2 mt-2 md:-mt-6 col-span-2">
                                    {/* <label className="rounded-t-md px-2  border border-black ">
                    
                    Reason For Booking
                  </label> */}
                                    <select
                                        onChange={handleFormChange}
                                        name="reason_for_booking"
                                        value={formData.reason_for_booking}
                                        className="rounded-t-md px-2 py-2 focus:outline-none bg-white border border-black "
                                    >
                                        <option defaultChecked selected disabled>
                                            Reason for Booking
                                        </option>
                                        <option value="urgent">Reason 1</option>
                                        <option value="monthly">Reason 2</option>
                                        <option value="more">Other</option>
                                    </select>
                                    {formData.reason_for_booking == "more" ? (
                                        <textarea
                                            value={formData.reason}
                                            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                                            className={` ${formData.reasonForBooking == "more" ? "block" : "hidden"
                                                }py-2 px-2 bg-transparent focus:outline-none  border-b border-x rounded-b-md border-black `}
                                                onChange={handleFormChange}

                                            rows="3"
                                            name="reason"
                                        />
                                    ) : (
                                        ""
                                    )}
                                </div>
                                <div
                                    className={`${!formData.reason_for_booking == "more" ? "md:-mt-6" : "md:mt-4"
                                        } col-span-2 mt-3 `}
                                >
                                    <button
                                        className="bg-[#CDF27E] w-full mb-2 py-2 rounded-lg "
                                        onClick={addData}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p></p>
                )}
            </div>
        </div>
    );
};

export async function getServerSideProps(context) {
    const { query } = context;

    // Retrieve the query parameter
    const rehabId = query.rehabId;

    // You can fetch additional data here if needed

    // Return the props to be passed to the component
    return {
        props: {
            rehabId,
        },
    };
}
export default Detail;
