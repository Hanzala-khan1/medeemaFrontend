import React, { useState, useEffect, useCallback, useMemo } from "react";
import Banner from "../Common/Banner";
import { FaCaretDown, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Image from "next/image";
import useRazorpay from "react-razorpay";
import { useRouter } from "next/router";
import { db, auth } from "../../firebase";
import { Input } from "antd";
import mapPic from "../../../public/images/map.png";
import img1 from "../../../public/images/img1.png";
import img2 from "../../../public/images/img2.png";
import img3 from "../../../public/images/img3.png";
import doctor from "../../../public/images/svg/doctor.svg";
import noimg from "../../../public/images/noimg.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
  where,
} from "firebase/firestore";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import {
  AiTwotoneStar,
  AiOutlineClockCircle,
  AiOutlineBulb,
  AiOutlineAccountBook,
  AiTwotoneCar,
} from "react-icons/ai";
import { getDocs } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { addOrder, getSingleRehab } from "@/services";
import { useSelector } from "react-redux";
const Detail = () => {
  const { user } = useSelector((state) => state.root.user);
  const router = useRouter();
  const [state, setState] = useState(false);
  const [acAmount, setAmount] = useState(null);
  const [newDiffDays, setDiffDays] = useState(1);
  const [Razorpay] = useRazorpay();
  const [box, setBox] = useState(false);
  const { rehabId } = router.query;
  const { id, from, to } = router.query;
  const [rehabData, setrehabData] = useState(null);
  const [imgView, setImgView] = useState(
    rehabData ? rehabData?.images[0]?.url : img2
  );
  const [isLogined, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [fees, setFees] = useState(null);
  const MySwal = withReactContent(Swal);
  // console.log(id, from, to);
  const [formData, setFormData] = useState({
    package: "perday",
    rate: "perHour",
    bookFrom: from !== "" ? from : "",
    bookTo: to !== "" ? to : "",
    patientName: "",
    altPhone: "",
    phone: "",
    dob: "",
    message: "",
    patientGender: "male",
    ref: "",
  });
  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     setFormData((e) => ({ ...e, patientId: user?.uid }));
  //     // console.log(router.query.rehabId);
  //     setIsLoggedIn(true);
  //   });
  //   unsubscribe();
  //   const fetchRehabData = async () => {
  //     getSingleRehab(rehabId)
  //       .then((res) => {
  //         console.log("res.....", res?.data);
  //       })
  //       .catch((err) => {
  //         console.log("err....", err?.response?.data);
  //       })
  //       .finally(() => {});
  //     const docRef = doc(db, "rehab", rehabId);
  //     try {
  //       const docSnap = await getDoc(docRef);
  //       if (docSnap.exists()) {
  //         setrehabData(docSnap.data());
  //         setImgView(docSnap.data()?.images[0]?.url);
  //         // console.log("Fetched rehab data:", docSnap.data());
  //       } else {
  //         console.log("No such document!");
  //       }
  //     } catch (error) {
  //       console.log("Error fetching rehab data: ", error);
  //     }
  //   };

  //   if (rehabId) {
  //     fetchRehabData();
  //   }
  // }, [rehabId]);

  useEffect(() => {
    if (rehabId) {
      fetchRehabData();
    }
  }, [rehabId]);

  const fetchRehabData = async () => {
    getSingleRehab(rehabId)
      .then((res) => {
        console.log("res.....", res?.data);
        setrehabData(res?.data?.rehab);
        setImgView(res?.data?.rehab?.images[0]?.url);
      })
      .catch((err) => {
        console.log("err....", err?.response?.data);
      })
      .finally(() => {});
    // const docRef = doc(db, "rehab", rehabId);
    // try {
    //   const docSnap = await getDoc(docRef);
    //   if (docSnap.exists()) {
    //     setrehabData(docSnap.data());
    //     setImgView(docSnap.data()?.images[0]?.url);
    //     // console.log("Fetched rehab data:", docSnap.data());
    //   } else {
    //     console.log("No such document!");
    //   }
    // } catch (error) {
    //   console.log("Error fetching rehab data: ", error);
    // }
  };
  const calculateDiscountedPrice = (price, discount) => {
    const discountedPrice = price - (price * discount) / 100;
    return discountedPrice.toFixed(2);
  };
  const calculateStars = (review) => {
    const rating = Math.floor(review / 20);
    return Math.min(rating, 5);
  };
  const handleData = () => {
    const fromDate = new Date(formData?.bookFrom);
    const toDate = new Date(formData?.bookTo);
    const timeDiff = Math.abs(fromDate.getTime() - toDate?.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  };
  const handlePhone = (e) => {
    setFormData((prev) => ({ ...prev, phone: e }));
  };
  const handleAltPhone = (e) => {
    setFormData((prev) => ({ ...prev, altPhone: e }));
  };
  const handleRateChange = (event) => {
    if (rehabData) {
      if (event.target.value == "perDay") {
        setFees(parseInt(rehabData?.perDay));
      } else {
        setFees(parseInt(rehabData?.perHour));
      }
    }
    const { name, value } = event.target;
    setFormData((e) => ({ ...e, [name]: value }));
  };
  const handleReason = (e) => {
    const { name, value } = e.target;
    if (value == "more") {
      setBox(true);
    } else {
      setBox(false);
    }
    setFormData((prev) => ({ ...prev, reason: value }));
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    calculateBusinessDays();
    if (formData.rate === "perHour") {
      const amount =
        Number(rehabData?.perHour * diffDays * 100) * 8 || rehabData?.perHour;
      setAmount(parseInt(amount));
      localStorage.setItem("amount", amount);
      setFormData((prev) => ({
        ...prev,
        amount: rehabData?.perHour * diffDays * 8,
      }));
    } else {
      const amount =
        Number(rehabData.perDay * diffDays) * 100 || rehabData?.perHour;
      setAmount(parseInt(amount));
      localStorage.setItem("amount", amount);
      setFormData((prev) => ({
        ...prev,
        amount: rehabData?.perDay * diffDays,
      }));
    }

    if (isDateDisabled(selectedDate)) {
      // Show an error or alert message here
      //   alert("This date is not available");
      setErrorMessage("not available on this date");
      event.target.value = ""; // Clear the selected date
      return;
    }
    const { name, value } = event.target;
    setFormData((e) => ({ ...e, [name]: value }));
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    if (formData.rate === "perHour") {
      setFormData((prev) => ({
        ...prev,
        amount: rehabData?.perHour * diffDays * 8,
      }));
      localStorage.setItem("amount", fees * diffDays * 8);
    } else {
      setFormData((prev) => ({
        ...prev,
        amount: rehabData?.perDay * diffDays,
      }));
      localStorage.setItem("amount", fees * diffDays);
    }
    handleData();
    setFormData((e) => ({ ...e, [name]: value }));
  };

  const isDateDisabled = (date) => {
    // return rehabData?.unavailability.includes(date);
    if (rehabData?.availability === "weekdays") {
      const selectedDay = new Date(date).getDay();
      return (
        rehabData?.unavailability?.includes(date) ||
        selectedDay === 0 ||
        selectedDay === 6
      );
    }
    if (rehabData?.availability === "weekend") {
      const selectedDay = new Date(date).getDay();
      return (
        rehabData?.unavailability.includes(date) ||
        (selectedDay > 0 && selectedDay < 6)
      );
    }
    return rehabData?.unavailability?.includes(date);
  };

  const fetchCoupon = async () => {
    let arr = [];
    const docRef = query(
      collection(db, "coupons"),
      where("holder", "==", localStorage.getItem("id"))
    );
    try {
      const res = await getDocs(docRef);
      arr = res?.docs[0]?.data();
      return arr;
    } catch (error) {
      console.log(error);
    }
  };
  const { data, isLoading } = useQuery(["Coupon"], fetchCoupon, {
    staleTime: 60000,
  });
  //  if(!isLoading){
  //   console.log(data)
  //  }

  const addData = async () => {
    const {
      bookFrom,
      bookTo,
      patientName,
      phone,
      message,
      dob,
      amount,
      altPhone,
      patientGender,
      rate,
      reason,
    } = formData;
    console.log("fff dddd.......", formData);
    let params = {
      recieverId: rehabData._id,
      userId: user._id,
      package: formData?.package,
      amount: JSON.stringify(amount),
      from: bookFrom,
      to: bookTo,
      patientName: patientName,
      gender: patientGender,
      message: "Booking Message",
      phone: phone,
      altPhone: altPhone,
      DOB: dob,
      rate: rate,
      type: "rehab",
      reasonForBooking: reason,
    };
    console.log("pp....", params);

    if (
      dob &&
      phone &&
      altPhone &&
      bookFrom &&
      bookTo &&
      patientName &&
      patientGender &&
      reason
    ) {
      addOrder(params)
        .then((res) => {
          console.log("ress.....", res);
          if (res?.status == "201") {
            MySwal.fire("Your Booking application submitted");
          }
        })
        .catch((err) => {
          console.log("errrr", err.response.data);
        })
        .finally(() => {});
    } else {
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill all field",
      });
    }

    // {
    //   "recieverId": "657724889602e163a567ffd2",
    //   "userId": "657880ceebd9c9f673391eef",
    //   "package": "Standard",
    //   "amount": "50.00",
    //   "from": "Hospital A",
    //   "to": "Clinic B",
    //   "patientName": "John Doe",
    //   "gender": "Male",
    //   "message": "Scheduled appointment",
    //   "phone": "555-1234",
    //   "altPhone": "555-5678",
    //   "DOB": "1990-01-01",
    //   "rate": "5 stars",
    //   "type": "Regular",
    //   "reasonForBooking": "Routine checkup"
    // }
    // if (isLogined) {
    // if (
    //   bookFrom !== "" &&
    //   bookTo !== "" &&
    //   patientName !== "" &&
    //   phone !== "" &&
    //   message !== ""
    // ) {
    // const rehabRef = collection(db, "orders");
    // try {
    //   const res = await addDoc(rehabRef, {
    //     receiverId: rehabData?.auth_id,
    // amount: Number(fees * diffDays),
    //   receiverName: rehabData.name,
    //   patientDetail: { ...formData },
    //   type: "rehab",
    //   status: "pending",
    //   payment: "unpaid",
    // });

    // await updateDoc(doc(db, "orders", res.id), {
    //   id: res.id,
    //   Date: Timestamp.fromDate(new Date()),
    // });
    // if (
    //   data?.couponUsed == false &&
    //   data?.signUp == true &&
    //   calculation / 100 > 5000
    // ) {
    //   handlePayment(res.id, calculation - 150000);
    // } else {
    //   handlePayment(res.id, calculation);
    // }

    // MySwal.fire("Your Booking application submitted");
    // setTimeout(() => {
    //   router.reload("rehab-detail");
    // }, 3000);
    //   } catch (err) {
    //     console.log(err);
    //     MySwal.fire({
    //       icon: "error",
    //       title: "Oops...",
    //       text: "Please LogIn !",
    //     });
    //   }
    // } else {
    //   MySwal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Please fill all field",
    //   });
    // }
    // } else {
    //   MySwal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: "Please LogIn first",
    //   });
    // }
  };
  const handleCloseModal = () => {
    setErrorMessage("");
  };
  const updateBooking = async (id, razer) => {
    const docRef = doc(db, "orders", id);
    try {
      const res = await updateDoc(docRef, {
        payment: razer,
        paidDate: Timestamp.fromDate(new Date()),
      });
      MySwal.fire("Your Booking application submitted");

      setFormData({
        package: "perday",
        rate: "perHour",
        bookFrom: from !== "" ? from : "",
        bookTo: to !== "" ? to : "",
        patientName: "",
        altPhone: "",
        phone: "",
        dob: "",
        message: "",
        patientGender: "male",
        ref: "",
      });
    } catch (error) {
      console.log(error);
    }
  };
  const calculateBusinessDays = () => {
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    // Adjust start date to the beginning of the day
    startDate.setHours(0, 0, 0, 0);

    // Adjust end date to the end of the day
    endDate.setHours(23, 59, 59, 999);

    let currentDate = startDate;
    let businessDays = 0;

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();

      // Exclude Saturdays (6) and Sundays (0)
      // Exclude Saturdays (6), Sundays (0), and unavailable days
      if (
        dayOfWeek !== 6 &&
        dayOfWeek !== 0 &&
        !rehabData?.unavailability?.includes(
          currentDate.toISOString().split("T")[0]
        )
      ) {
        businessDays++;
      }

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    diffDays = businessDays;
    // console.log(businessDays);

    return businessDays;
  };
  const fromDate = new Date(formData?.bookFrom);
  const toDate = new Date(formData?.bookTo);

  const timeDiff = Math.abs(fromDate.getTime() - toDate?.getTime());

  var diffDays = calculateBusinessDays();
  // = Math.ceil(timeDiff / (1000 * 3600 * 24))

  calculateBusinessDays();

  const tiifDays = diffDays * 8;
  const calculation = useMemo(() => {
    if (formData.rate === "perHour") {
      return Number(
        rehabData?.perHour * diffDays * 8 * 100 -
          (rehabData?.discount / 100) *
            (rehabData?.perHour * diffDays * 8 * 100)
      );

      // localStorage.setItem("amount", rehabData?.perHour*diffDays *8);
    } else {
      // localStorage.setItem("amount", rehabData?.perDay * diffDays );

      return Number(
        rehabData?.perDay * diffDays * 100 -
          (rehabData?.discount / 100) * (rehabData?.perDay * diffDays * 100)
      );
    }
    return parseInt(rehabData?.perDay * diffDays * 100);
  }, [handleDateChange, formData.rate]);
  // console.log(calculation);
  const handlePayment = useCallback(
    async (id, docs) => {
      // await OrderApi.createOrder({
      //   products: cart?.products,
      //   customerId: localStorage.getItem("id"),
      //   amount: sum,
      //   date: serverTimestamp(),
      //   status: "New",
      // });

      const options = {
        key: "rzp_test_sfwDxiLmKtw7ol",
        amount: parseInt(docs),
        currency: "INR",
        name: "Dummy",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        handler: (res) => {
          localStorage.clear();
          updateBooking(id, res.razorpay_payment_id);
        },
        modal: {
          ondismiss: async () => {
            const docRef = doc(db, "orders", id);
            sessionStorage.clear();
            try {
              const res = await deleteDoc(docRef);
              sessionStorage.clear();
              setFormData({
                package: "perday",
                rate: "perHour",
                bookFrom: "",
                bookTo: "",
                patientName: "",
                altPhone: "",
                phone: "",
                dob: "",
                message: "",
                patientGender: "male",
              });
            } catch (error) {
              console.log(error);
            }
          },
        },
        prefill: {
          name: "Piyush Garg",
          email: "youremail@example.com",
          contact: "03334814702",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzpay = new Razorpay(options);
      rzpay.open();
    },
    [Razorpay]
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
              spaceBetween={15}
              slidesPerView={3}
              onSlideChange={() => console.log("slide change")}
              // onSwiper={(swiper) =>
              //   console.log(swiper)
              // }
            >
              {rehabData?.images?.map((doc, index) => {
                return (
                  <SwiperSlide key={index}>
                    <div>
                      <button
                        onClick={() => {
                          setImgView(rehabData ? doc.url : noimg);
                        }}
                      >
                        {" "}
                        <Image
                          className="  object-cover w-[80px] lg:w-[150px] h-[80px] lg:h-[150px] "
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

        {rehabData ? (
          <div className="col-span-1 md:col-span-4 bg-white px-6  py-8">
            <div>
              <h2 className="text-2xl text-[#1A3578] font-bold  w-[80%]">
                {rehabData?.name}
              </h2>
            </div>
            <div className="grid lg:flex justify-between px-4 items-center">
              <div className="flex gap-3 mt-2 text-sm font-medium">
                <s className=" text-[#ABABAB] text-sm">{rehabData?.perDay}</s>
                <h4 className="bg-green-100 ">{rehabData?.discount}%</h4>
                <span className="text-sm text-[#1A3578] font-semibold">
                  {calculateDiscountedPrice(
                    rehabData?.perDay,
                    rehabData?.discount
                  )}
                </span>
              </div>
              <div className="text-[#F8C100] flex items-center gap-2">
                <div className="flex">
                  {Array.from({
                    length: calculateStars(rehabData?.reviews),
                  }).map((_, index) => (
                    <AiTwotoneStar key={index} />
                  ))}
                </div>
                <h2 className="text-black text-base">{rehabData?.reviews}</h2>
                <h2 className="text-[#ABABAB] text-base">{"(234)"}</h2>
              </div>
            </div>
            <div className="text-black lg:flex mt-4">
              <h4>{rehabData.description}</h4>
            </div>
            <div>
              <h4 className="text-xl text-[#1A3578] font-bold mt-4">
                Why reserve this Rehab
              </h4>{" "}
            </div>
            <div className="mt-4 flex flex-wrap items-start justify-start lg:gap-2 gap-y-4">
              {rehabData.doctorAvail && (
                <div className="flex items-center gap-2">
                  <div className="text-lg bg-[#CDF27E] px-1 py-1">
                    <AiOutlineClockCircle />
                  </div>
                  <h4 className="text-black">
                    24/7 Doctors and Nurse available
                  </h4>
                </div>
              )}
              {rehabData.powerBackup && (
                <div className="flex items-center justify-end md:mx-auto gap-2">
                  <div className="text-lg bg-[#CDF27E] px-1 py-1">
                    <AiOutlineBulb />
                  </div>
                  <h4 className="text-black">24/ Power backup</h4>
                </div>
              )}
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
              {rehabData.parkingFacility && (
                <div className="flex items-center md:mx-auto  gap-2 lg:pl-4">
                  <div className="text-lg bg-[#CDF27E]  px-1 py-1">
                    <AiTwotoneCar />
                  </div>
                  <h4 className="text-black">Parking Facility</h4>
                </div>
              )}
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
                  {/* 161 Trumpeter Ave, Soldotna, Alaska 99669, USA */}
                  {rehabData?.address}
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
                  <strong className="font-bold">{rehabData?.name} </strong>
                  <span className="block sm:inline">{errorMessage}</span>
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
                  Amount:{" "}
                  {rehabData
                    ? formData.rate == "perHour"
                      ? Number(rehabData?.perHour * diffDays * 8)
                      : Number(rehabData?.perDay * diffDays)
                    : "NA"}
                </span>
                <span>Discount : {rehabData?.discount}%</span>
                <span>
                  Total :{" "}
                  {formData.rate == "perHour"
                    ? Number(
                        rehabData?.perHour * 8 * diffDays -
                          (rehabData?.discount / 100) *
                            (rehabData?.perHour * 8 * diffDays)
                      )
                    : Number(
                        rehabData?.perDay * diffDays -
                          (rehabData?.discount / 100) *
                            (rehabData?.perDay * diffDays)
                      )}
                </span>
                <span>
                  {" "}
                  {data?.couponUsed == false &&
                  data?.signUp == true &&
                  calculation / 100 > 500 ? (
                    <span>{`G.T :${calculation / 100 - 1500}`}</span>
                  ) : (
                    <span>{`G.T :${calculation / 100}`}</span>
                  )}
                </span>
                <div>
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
                </div>
              </div>
              <div className="grid text-black grid-rows-[80px_80px_80px_80px_120px_80px] ">
                <div className="flex flex-col px-2 row-span-1 md:col-span-1 col-span-2">
                  <label className=""> Select package</label>
                  <select
                    onChange={handleFormChange}
                    name="package"
                    className="h-[42px] w-full text-lg px-2 bg-transparent border border-black rounded-md"
                  >
                    <option value="perday">Per day</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="flex flex-col px-2 row-span-1 md:col-span-1 col-span-2">
                  <label className=""> Select Rate</label>
                  <select
                    onChange={handleRateChange}
                    name="rate"
                    placeholder="select rate"
                    className="h-[42px] text-lg px-2 w-full bg-transparent border placeholder:text-gray-400 border-black rounded-md"
                  >
                    <option value="perHour">{`Per Hour ${rehabData?.perHour}`}</option>
                    <option value="perDay">{`Per Day ${rehabData?.perDay}`}</option>
                  </select>
                </div>
                <div className="flex flex-col row-span-1 px-2 md:col-span-1 col-span-2">
                  <label className=""> From </label>
                  <input
                    onChange={handleDateChange}
                    value={from !== "" ? from : formData.bookFrom}
                    name="bookFrom"
                    type="date"
                    placeholder="12-May-2023"
                    className="py-2 px-2 bg-transparent border w-full placeholder:text-gray-400 border-black rounded-md"
                  />
                </div>
                <div className="flex flex-col row-span-1 px-2  md:col-span-1 col-span-2">
                  <label className=""> To </label>
                  <input
                    onChange={handleDateChange}
                    value={to !== "" ? to : formData.bookTo}
                    name="bookTo"
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
                    name="patientGender"
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
                    className="py-2 px-2 bg-transparent border border-black rounded-md"
                    onChange={handleFormChange}
                    value={formData.altPhone}
                    name="altPhone"
                  />
                </div>
                <div className="flex flex-col px-2 mb-2 md:mb-0  col-span-2">
                  <label className="md:mt-0"> Date of Birth</label>
                  <input
                    type="date"
                    placeholder="+91 555 334 4"
                    className="py-2 px-2 bg-transparent border w-full placeholder:text-gray-400 border-black rounded-md"
                    onChange={handleFormChange}
                    value={formData.dob}
                    name="dob"
                  />
                </div>
                <div className="flex flex-col px-2 mt-2 md:-mt-6 col-span-2">
                  {/* <label className="rounded-t-md px-2  border border-black ">
                    
                    Reason For Booking
                  </label> */}
                  <select
                    onChange={handleReason}
                    name="reason"
                    className="rounded-t-md px-2 py-2 focus:outline-none bg-white border border-black "
                  >
                    <option defaultChecked selected disabled>
                      Reason for Booking
                    </option>
                    <option value="urgent">Reason 1</option>
                    <option value="monthly">Reason 2</option>
                    <option value="more">Other</option>
                  </select>
                  {box ? (
                    <textarea
                      value={formData.reason}
                      placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                      className={` ${
                        box ? "block" : "hidden"
                      }py-2 px-2 bg-transparent focus:outline-none  border-b border-x rounded-b-md border-black `}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          reason: e.target.value,
                        }));
                      }}
                      rows="3"
                      name="reason"
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div
                  className={`${
                    !box ? "md:-mt-6" : "md:mt-4"
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
          <p>Loading...</p>
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
