import React, { useState, useEffect, useCallback, useMemo } from "react";
import Banner from "../Common/Banner";
import { FaCheckCircle, FaCaretDown, FaTimesCircle } from "react-icons/fa";
import Image from "next/image";
import useRazorpay from "react-razorpay";
import { useRouter } from "next/router";
import { db, auth } from "../../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "react-phone-number-input/style.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import noimg from "../../../public/images/noimg.png";

const Detail = () => {
  const [imgView, setImgView] = useState(false);
  const [state, setState] = useState(false);
  const [acAmount, setAmount] = useState(null);
  const [newDiffDays, setDiffDays] = useState(1);
  const [Razorpay] = useRazorpay();
  const router = useRouter();
  const [box, setBox] = useState(false);
  const { id, from, to } = router.query;
  const [nursesData, setnursesData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [fees, setFees] = useState(null);
  const MySwal = withReactContent(Swal);
  const [formData, setFormData] = useState({
    package: "perday",
    rate: "perHour",
    bookFrom: from !== "" ? from : "",
    bookTo: to !== "" ? to : "",
    patientName: "",
    altPhone: "",
    phone: "",
    reason: "",
    dob: "",
    message: "",
    patientGender: "male",
    ref: "",
  });
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setFormData((e) => ({ ...e, patientId: user?.uid }));
      setIsLoggedIn(true);
    });
    unsubscribe();
    const fetchnursesData = async () => {
      try {
        const docRef = doc(db, "nurses", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setnursesData(docSnap.data());
        } else {
        }
      } catch (error) {
        console.log("Error fetching nurses data: ", error);
      }
    };

    if (id) {
      fetchnursesData();
    }
  }, [id]);

  const handleData = () => {
    const fromDate = new Date(formData?.bookFrom);
    const toDate = new Date(formData?.bookTo);
    const timeDiff = Math.abs(fromDate.getTime() - toDate?.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
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
  const handleAltPhone = (e) => {
    setFormData((prev) => ({ ...prev, altPhone: e }));
  };
  const handleRateChange = (event) => {
    if (nursesData) {
      if (event.target.value == "perDay") {
        setFees(parseInt(nursesData?.perDay));
      } else {
        setFees(parseInt(nursesData?.perHour));
      }
    }
    const { name, value } = event.target;
    setFormData((e) => ({ ...e, [name]: value }));
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    calculateBusinessDays();
    if (formData.rate === "perHour") {
      const amount =
        Number(nursesData?.perHour * diffDays * 100) * 8 || nursesData?.perHour;
      setAmount(parseInt(amount));
      localStorage.setItem("amount", amount);
      setFormData((prev) => ({
        ...prev,
        amount: nursesData?.perHour * diffDays * 8,
      }));
    } else {
      const amount =
        Number(nursesData.perDay * diffDays) * 100 || nursesData?.perHour;
      setAmount(parseInt(amount));
      localStorage.setItem("amount", amount);
      setFormData((prev) => ({
        ...prev,
        amount: nursesData?.perDay * diffDays,
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
        amount: nursesData?.perHour * diffDays * 8,
      }));
      localStorage.setItem("amount", fees * diffDays * 8);
    } else {
      setFormData((prev) => ({
        ...prev,
        amount: nursesData?.perDay * diffDays,
      }));
      localStorage.setItem("amount", fees * diffDays);
    }
    handleData();
    setFormData((e) => ({ ...e, [name]: value }));
  };

  const isDateDisabled = (date) => {
    // return nursesData?.unavailability.includes(date);
    if (nursesData?.availability === "weekdays") {
      const selectedDay = new Date(date).getDay();
      return (
        nursesData?.unavailability?.includes(date) ||
        selectedDay === 0 ||
        selectedDay === 6
      );
    }
    if (nursesData?.availability === "weekend") {
      const selectedDay = new Date(date).getDay();
      return (
        nursesData?.unavailability.includes(date) ||
        (selectedDay > 0 && selectedDay < 6)
      );
    }
    return nursesData?.unavailability?.includes(date);
  };
  const fetchCoupon = async () => {
    let arr = [];
    const docRef = query(
      collection(db, "coupons"),
      where("holder", "==", localStorage.getItem("id"))
    );
    try {
      const res = await getDocs(docRef);
      arr = res.docs[0].data();
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
    const { bookFrom, bookTo, patientName, altPhone, message } = formData;
    if (isLoggedIn) {
      // if (
      //   bookFrom !== "" &&
      //   bookTo !== "" &&
      //   patientName !== "" &&
      //   altPhone !== ""

      // ) {
      const nursesRef = collection(db, "orders");
      try {
        const res = await addDoc(nursesRef, {
          receiverId: nursesData?.auth_id,
          // amount: Number(fees * diffDays),
          receiverName: nursesData.name,
          patientDetail: { ...formData },
          type: "nurse",
          status: "pending",
          payment: "unpaid",
          ref: nursesData.ref ? nursesData.ref : "",
        });

        await updateDoc(doc(db, "orders", res.id), {
          id: res.id,
          Date: Timestamp.fromDate(new Date()),
        });
        if (
          data?.couponUsed == false &&
          data?.signUp == true &&
          calculation / 100 > 5000
        ) {
          handlePayment(res.id, calculation - 150000);
        } else {
          handlePayment(res.id, calculation);
        }
        // MySwal.fire("Your Booking application submitted");
        // setTimeout(() => {
        //   router.reload("nurses-detail");
        // }, 3000);
      } catch (err) {
        MySwal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please LogIn !",
        });
      }
      // } else {
      //   MySwal.fire({
      //     icon: "error",
      //     title: "Oops...",
      //     text: "Please fill all field",
      //   });
      // }
    } else {
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please LogIn first",
      });
    }
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
        rate: "perday",
        bookFrom: from !== "" ? from : "",
        bookTo: to !== "" ? to : "",
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
        !nursesData?.unavailability?.includes(
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
        nursesData?.perHour * diffDays * 8 * 100 -
          (nursesData?.discount / 100) *
            (nursesData?.perHour * diffDays * 8 * 100)
      );

      // localStorage.setItem("amount", nursesData?.perHour*diffDays *8);
    } else {
      // localStorage.setItem("amount", nursesData?.perDay * diffDays );

      return Number(
        nursesData?.perDay * diffDays * 100 -
          (nursesData?.discount / 100) * (nursesData?.perDay * diffDays * 100)
      );
    }
    return parseInt(nursesData?.perDay * diffDays * 100);
  }, [handleDateChange, formData.rate]);
  // console.log(calculation)
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
    <div className="mb-12">
      <Banner
        title={""}
        subHeading1={"Home"}
        subHeading2={"nurses care Details"}
      />
      <div className="lg:flex lg:flex-row justify-center sm:flex sm:flex-col w-full px-6 md:px-12 mt-12 gap-6 mx-0">
        <div className="lg:w-[30%] sm:w-[100%]   col-span-1 md:col-span-2 gap-10">
          <div className="bg-white py-2 px-2">
            {nursesData ? (
              <div className="flex gap-2">
                <div>
                  <Image
                    src={
                      nursesData?.images?.url ? nursesData?.images?.url : noimg
                    }
                    width={100}
                    height={100}
                    alt={nursesData?.images?.name}
                    className=" w-[100%]  h-[100%]"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="">
                  <div className="flex gap-2 items-center">
                    <h2 className="text-lg text-black font-semibold">
                      {nursesData.name}
                    </h2>{" "}
                    {/*added text-black class*/}
                    <div className="text-green-600">
                      <FaCheckCircle />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm text-[#1A3578]">
                      Education: {nursesData.education} /{nursesData.experience}{" "}
                      Years Experience{" "}
                    </h3>
                  </div>
                  <div>
                    <h3 className="text-xs text-[#B1B1B1]">
                      Working at {nursesData.workingAt} Hospital
                    </h3>
                  </div>
                  <div className=" w-full mt-2">
                    <button className="bg-[#1A3578] w-full text-white md:px-6 py-2 rounded-md">
                      Home Care Service
                    </button>
                  </div>
                  <div className="  w-full mt-2">
                    <button className="bg-[#CDF27E] w-full text-black px-6 py-2  rounded-md">
                      Fee: {nursesData?.fees}/- (per day)
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <div className="mt-4">
            <div></div>
          </div>
        </div>
        <div className="lg:w-[55%] sm:w-[100%] bg-white px-6">
          <div className="mt-8">
            <h2 className="text-xl font-bold">Details:</h2>
            <h4 className="mt-4 text-[#777777]">
              Assessing, observing, and speaking to patients. Recording details
              and symptoms of patient medical history and current health.
              Preparing patients for exams and treatment. Administering
              medications and treatments, then monitoring patients for side
              effects and reactions.
            </h4>
          </div>
          <div className=" mt-6 md:mt-8">
            <h2 className="my-4 text-[#1A3578 text-2xl font-semibold">
              Reserve Shedule
            </h2>
            {errorMessage && (
              <div
                class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong class="font-bold">Error!</strong>
                <span class="block sm:inline">{errorMessage}</span>
                <span
                  onClick={handleCloseModal}
                  class="absolute top-0 bottom-0 right-0 px-4 py-3"
                >
                  <svg
                    class="fill-current h-6 w-6 text-red-500"
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
                {nursesData
                  ? formData.rate == "perHour"
                    ? Number(nursesData?.perHour * diffDays * 8)
                    : Number(nursesData?.perDay * diffDays)
                  : "NA"}
              </span>
              <span>Discount : {nursesData?.discount}%</span>
              <span>
                Total :{" "}
                {formData.rate == "perHour"
                  ? Number(
                      nursesData?.perHour * 8 * diffDays -
                        (nursesData?.discount / 100) *
                          (nursesData?.perHour * 8 * diffDays)
                    )
                  : Number(
                      nursesData?.perDay * diffDays -
                        (nursesData?.discount / 100) *
                          (nursesData?.perDay * diffDays)
                    )}
              </span>
              <span>
                {" "}
                {data?.couponUsed == false &&
                data?.signUp == true &&
                calculation / 100 > 5000 ? (
                  <span>{`G.T :${Math.round(calculation / 100 - 1500)}`}</span>
                ) : (
                  <span>{`G.T :${Math.round(calculation / 100)}`}</span>
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
                  <option value="perHour">{`Per Hour ${nursesData?.perHour}`}</option>
                  <option value="perDay">{`Per Day ${nursesData?.perDay}`}</option>
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
                  className="rounded-t-md px-2 py-2 focus:outline-none  border border-black "
                >
                  <option defaultChecked selected disabled>
                    Reason for Booking
                  </option>
                  <option value="urgent">Reason 1</option>
                  <option value="monthly">Reason 2</option>
                  <option value="more">other...</option>
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
                className={`${!box ? "md:-mt-6" : "md:mt-4"} col-span-2 mt-3 `}
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
      </div>
    </div>
  );
};

export default Detail;
