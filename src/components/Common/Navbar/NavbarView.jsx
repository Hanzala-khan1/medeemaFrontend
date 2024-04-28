import React, { useState, useEffect } from "react";
import logo from "../../../../public/images/logo.png";
import phoneImg from "../../../../public/images/phone.png";
import emailImg from "../../../../public/images/email.png";
import fb from "../../../../public/images/fb.png";
import twitter from "../../../../public/images/twitter.png";
import insta from "../../../../public/images/insta.png";
import { AiOutlineAim, AiOutlineAlert } from "react-icons/ai";
import p from "../../../../public/images/p.png";
import menu from "../../../../public/images/menu.png";
import Image from "next/image";
import Link from "next/link";
import { auth, db, storage } from "../../../firebase";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";

import {
  setDoc,
  doc,
  collection,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
  getMetadata,
} from "firebase/storage";
// import Modal from "react-modal";
import Swal from "sweetalert2";
import { Input, Select, Form, Upload, Button, Spin, Modal } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
import withReactContent from "sweetalert2-react-content";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RevealWrapper } from "next-reveal";
import { useGeolocated } from "react-geolocated";
import { useDispatch, useSelector } from "react-redux";
import { addEmergency, userLogout } from "@/services";
import { setIsLoggedIn, setRole, setToken, setUser } from "@/redux";
const NavbarView = () => {
  const dispatch = useDispatch();

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      backgroundColor: "#e2e8f0",

      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    message: "",
    city: "",
    id: "",
  });
  const queryClient = useQueryClient();
  const { TextArea } = Input;
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };
  const handleGenderChange = (value) => {
    setFormData((e) => ({ ...e, gender: value }));
  };
  const handleSpeciality = (value) => {
    setFormData((e) => ({ ...e, speciality: value }));
  };
  const Router = useRouter();
  const [username, setUsername] = useState("");
  const [editData, setEditData] = useState(false);
  const [email, setEmail] = useState("");
  const [preview, setPreview] = useState("");
  const [btnAdd, setBtnAdd] = useState("primary");
  const [password, setPassword] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [role, setRole] = useState("aya");
  const [uplodedUrl, setUploadedUrl] = useState("");
  const [error, setError] = useState("");
  const MySwal = withReactContent(Swal);
  const [inUpdate, setInUpdate] = useState(false);
  const [arr, setarr] = useState([]);
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [uploadImage, setUploadImage] = useState(true);
  const [videoUpload, setVideoUpload] = useState(null);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [videoPreview, setVideoPreview] = useState("");

  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 1000,
    });
  var previewArr = [];

  console.log(uploadImage);
  const validatePassword = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    setError("");
    return true;
  };
  const uploadButton = editData ? (
    <div className="flex">
      {videoPreview ? ( // Check if there's a video preview
        <video width={90} height={95} controls>
          <source src={videoPreview} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : preview ? ( // Check if there's an image preview
        <Image
          src={preview}
          className="object-cover rounded-xl"
          width={90}
          height={95}
          alt="image"
        />
      ) : (
        <div className="ant-upload-text">Upload</div>
      )}
    </div>
  ) : (
    <div className="flex">
      {videoPreview ? ( // Check if there's a video preview
        <video width={90} height={95} controls>
          <source src={videoPreview} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : preview ? ( // Check if there's an image preview
        <Image
          src={preview}
          className="object-cover rounded-xl"
          width={90}
          height={95}
          alt="image"
        />
      ) : (
        <div className="ant-upload-text">Upload</div>
      )}
    </div>
  );

  const searchlocation = async () => {
    if (isGeolocationEnabled) {
      const { longitude, latitude } = coords;
      setLatitude(latitude);
      setLongitude(longitude);
    }
  };
  const addData = async (imageUrl, uid) => {
    // setBtnAdd("disable");

    const newCityRef = collection(db, "emergency-messages");
    // const {title,fees,address,powerAvail,doctorAvail,}=formData

    try {
      const res = await addDoc(newCityRef, {
        ...formData,
        senderId: localStorage.getItem("id"),
        sent_at: Timestamp.now(),
      });

      await updateDoc(doc(db, "emergency-messages", res.id), {
        id: res.id,
      });

      MySwal.fire({
        icon: "success",
        // title: 'Oops...',
        text: " Message sent",
      });
      setImgUrl("");

      setBtnAdd("primary");
      handleCancel();
      // router.reload("/doctors");
      setToggle(!toggle);
      setIsOpen(false);

      setLoading(false);
    } catch (err) {
      handleCancel();
      console.log(err);
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      setLoading(false);
      handleCancel();
    }
  };
  const createUser = async () => {
    createUserWithEmailAndPassword(
      auth,
      formData?.email,
      formData?.password
    ).then((userCredential) => {
      const user = userCredential.user;

      const userData = {
        name: formData?.name,
        email: formData?.email,
        role: "doctor",
        id: user.uid,
      };
      const usersCollectionRef = collection(db, "users");
      const userDocRef = doc(usersCollectionRef, user.uid);

      setDoc(userDocRef, userData)
        .then(() => {
          imgUrl == "" ? addData("", user?.uid) : handleUploadImage(user?.uid);
        })
        .catch((error) => {
          console.log("Error saving user data:", error);
        });
    });
  };
  const addMutaion = useMutation(addData, {
    onSuccess: () => {},
  });
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try{
    if (!isLoggedIn) {
      MySwal.fire({
        icon: "error",
        text: "Please Log In",
      });
    } else {
      console.log("here",formData)
     const emergency= await addEmergency(formData)
     MySwal.fire({
      icon: "success",
      // title: 'Oops...',
      text: " added Successfully",
    });
    closeModal()
      handleCancel()
    }

   } catch(error ){
    console.log(error)
      MySwal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  };

  // video function working for both image and videos

  const uploadFileVideo = () => {
    if (videoUpload == null) return;

    const filename = videoUpload.name;

    const uniqueID = Date.now().toString();

    const videoRef = ref(
      storage,
      `${formData.name}/${videoUpload.name.replace(/\s+/gm, "-") + uniqueID}`
    );

    const uploadTask = uploadBytesResumable(videoRef, videoUpload);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Track upload progress here if needed
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // setUploadProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        // Once the upload is complete, get the video's metadata
        const metadataRef = ref(
          storage,
          `${formData.name}/${uploadTask.snapshot.metadata.name}`
        );

        getMetadata(metadataRef).then((metadata) => {
          const duration = metadata.durationMillis;
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            // Store the video's URL and other information as needed
            setUploadedVideos((prev) => [
              ...prev,
              { url, id: uniqueID, duration },
            ]);

            // Log a message when the video is sent to the database
          });
        });
      }
    );
  };

  // not working
  const handleUploadImage = () => {
    if (imgUrl == null) return;

    const filename = imgUrl.name;
    const uniqueID = Date.now().toString();

    const imgRef = ref(
      storage,
      `images/${imgUrl.name.replace(/\s+/gm, "-") + uniqueID}`
    );

    const uploadTask = uploadBytesResumable(imgRef, imgUrl);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Track upload progress here if needed
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // setUploadProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        // Once the upload is complete, get the image's download URL
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            // Handle the image URL as needed
            // You can call other functions here or update state with the image URL
          })
          .catch((error) => {
            console.log(error);
          });
      }
    );
  };

  const register = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const values = {
        username: username,
        email: email,
        role: role,
      };

      await setDoc(userRef, values, { merge: true });
      addData(user.uid, values);
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: error,
      });
      console.error("Error creating user:", error.message);
    }
  };
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setToggle(!toggle);
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFormData({
      name: "",
      address: "",
      message: "",
      city: "",
      id: "",
    });
  }

  const [toggle, setToggle] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isLoggedIn, role } = useSelector((state) => state.root.user);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     setIsLoggedIn(!!user);
  //   });

  //   return () => unsubscribe();
  // }, []);
  const handleCancel = () => {
    setFormData({
      name: "",
      address: "",
      message: "",
      city: "",
      id: "",
    });
    setPreview("");
    // setImgName("");
    // setVisible(false);
    setLoading(false);
  };
  const handleLogout = () => {
    MySwal.showLoading();

    userLogout()
      .then((res) => {
        console.log("rresss...", res?.data);
        if (!res?.data?.auth) {
          dispatch(setIsLoggedIn(false));
          dispatch(setUser({}));
          dispatch(setToken(null));
          dispatch(setRole(""));
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          MySwal.fire({
            icon: "success",
            // title: 'Oops...',
            text: " LogedOut Successfull",
          });
          Router.push("/");
        }
      })
      .catch((err) => {
        console.log("errr...", err);
      })
      .finally(() => {
        MySwal.hideLoading();
      });
    // auth
    //   .signOut()
    //   .then(() => {
    //     // setIsLoggedIn(false);
    //     Router.push("/");
    //     localStorage.clear();
    //     queryClient.invalidateQueries();
    //   })
    //   .catch((error) => {
    //     console.log("Logout error:", error);
    //   });
  };

  const renderAuthButtons = () => {
    if (isLoggedIn) {
      return (
        <button
          onClick={handleLogout}
          className="text-base bg-[#CDF27E] py-2 px-6 rounded-md sm:px-6"
        >
          Logout
        </button>
      );
    } else {
      return (
        <>
          <Link
            href={{
              pathname: "/login",
              query: { path: Router.pathname, ...Router.query },
            }}
          >
            <button className="text-base bg-[#CDF27E] py-2 px-6 rounded-md sm:px-6">
              Login
            </button>
          </Link>
          <Link href="/Signup">
            <button className="text-sm text-[#1A3578] border border-[#1A3578] rounded-md py-2 px-4 sm:px-4">
              Sign Up
            </button>
          </Link>
          <Link href="/join-us">
            <button className="text-sm text-[#1A3578] border border-[#1A3578] rounded-md py-2 px-4 sm:px-4">
             Register as Service Provider
            </button>
          </Link>
        </>
      );
    }
  };

  const handleClickSocialButtons = (type) => {
    const url =
      type == "fb"
        ? "https://web.facebook.com/"
        : type == "insta"
        ? "https://www.instagram.com/"
        : type == "twitter"
        ? "https://twitter.com/"
        : type == "p"
        ? "https://www.pinterest.com/"
        : null;
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  return (
    <div className="navbar-container   ">
      <div className="hidden lg:contents">
        <div className="w-full m-auto bg-[#1A3578]  md:border-b font-medium py-2 border-gray-500  flex text-white justify-between ">
          <div className="flex ml-4 sm:ml-[10%] gap-x-4 sm:gap-x-12 mt-1">
            <div className="flex  sm:gap-x-2">
              <Image
                className="h-3 w-4 md:h-4 md:w-5 mt-[2px]"
                src={phoneImg}
                alt="phone"
              />
              <span className="text-[10px] md:text-sm font-normal">
                +91 34 4555 5
              </span>
            </div>
            <div className="flex gap-x-1 sm:gap-x-2">
              <Image
                className="h-3 w-4 md:h-4 md:w-5 mt-[2px]"
                src={emailImg}
                alt="phone"
              />
              <span className="text-[10px] md:text-sm font-normal">
                Company@email.com
              </span>
            </div>
            <div className="flex gap-x-1 items-center sm:gap-x-2">
              <button
                className="text-[#CDF27E] text-2xl  flex items-center space-x-2"
                onClick={() => {
                  isLoggedIn
                    ? setIsOpen(true)
                    : MySwal.fire({
                        icon: "error",
                        text: "Please Login ",
                      });
                }}
              >
                <span className="-mt-1">
                  <AiOutlineAlert />
                </span>
                <span className="text-sm text-white "> Emergency</span>
              </button>
            </div>
          </div>
          <div className="flex mr-4 sm:mr-[10%] gap-x-1 sm:gap-x-2">
            <div
              onClick={() => handleClickSocialButtons("fb")}
              className=" bg-gray-500 h-5 w-5 md:h-7 md:w-7 flex justify-center items-center rounded-full"
            >
              <Image
                width={20}
                height={20}
                className="h-4 w-4 object-contain"
                src={fb}
                alt="phone"
              />
            </div>
            <div
              onClick={() => handleClickSocialButtons("insta")}
              className=" bg-gray-500 h-5 w-5 md:h-7 md:w-7  flex justify-center items-center rounded-full"
            >
              <Image
                width={20}
                height={20}
                className="h-4 w-4 object-contain"
                src={insta}
                alt="phone"
              />
            </div>
            <div
              onClick={() => handleClickSocialButtons("twitter")}
              className=" bg-gray-500 h-5 w-5 md:h-7 md:w-7 flex justify-center items-center rounded-full"
            >
              <Image
                width={50}
                height={50}
                className="h-4 w-4 object-contain"
                src={twitter}
                alt="phone"
              />
            </div>
            <div
              onClick={() => handleClickSocialButtons("p")}
              className=" bg-gray-500 h-5 w-5 md:h-7 md:w-7 flex justify-center items-center rounded-full"
            >
              <Image
                width={20}
                height={20}
                src={p}
                className="h-4 w-4 object-contain"
                alt="phone"
              />
            </div>
          </div>
        </div>
      </div>
      <div className=" m-auto md:bg-[#E6EBF9]  md:border-b font-medium py-2 border-gray-500  flex text-black justify-between items-center">
        <div className="flex justify-between  w-full lg:w-[20%] gap-x-1 pl-2">
          {/* mobile bar icons */}
          <Link href="/">
            <Image
              className="ml-8 h-[50px] w-[120px] lg:ml-[60px]"
              src={logo}
              alt="logo"
            />
          </Link>
          <span
            onClick={() => {
              setToggle(!toggle);
            }}
            className="lg:hidden  pr-8 sm:pr-20 mt-2 lg:mt-6 "
          >
            <div className="h-8 w-10 bg-[#1A3578] rounded-sm flex justify-center items-center">
              <Image src={menu} className="text-white  h-6 w-6" size={30} />
            </div>
          </span>
          {/* logo */}
        </div>
        {/* desktop menu */}
        <div>
          <nav>
            <ul className="lg:flex hidden items-center gap-x-10 font-medium -ml-44">
              <li>
                <Link href="/">Home</Link>
              </li>
              {isLoggedIn ? (
                <li>
                  <Link href="/conversation">Messages</Link>
                </li>
              ) : (
                ""
              )}

              <li>
                <Link href="/ask-expert">Ask Experts</Link>
              </li>

              {isLoggedIn && (
                <li className=" text-black py-2 px-2 rounded-md">
                  <Link href="/save-rehab">Favourites</Link>
                </li>
              )}

              {isLoggedIn && (
                <>
                  <li className=" text-black py-2 px-2 rounded-md">
                    <Link href="/orders">My Orders</Link>
                  </li>
                  <li className=" text-black py-2 px-2 rounded-md">
                    <Link href="/win">Win 1500</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>

        <div className="lg:flex hidden px-2 items-center font-normal gap-x-4 mr-[7%]">
          {renderAuthButtons()}
        </div>
      </div>
      {/* mobile menu */}
      {
        <div
          className={` absolute top-16 py-3 ${
            toggle
              ? " transition-all delay-50 duration-1000 translate-y-0"
              : " opacity-0 transition-all delay-50 duration-1000  ease-out  -translate-y-[450px] "
          } mobile menu lg:hidden z-40  bg-white w-full `}
        >
          <ul className=" flex flex-col items-center  gap-y-1 px-2 ">
            <li className="hover:bg-[#00538F]/80 w-full text-center  focus:bg-[#00538F]/80 hover:text-white focus:text-white text-black py-2 px-2 ">
              <Link href="/"> Home </Link>
            </li>
            {isLoggedIn ? (
              <li className=" text-black hover:bg-[#00538F]/80 focus:bg-[#00538F]/80 w-full  hover:text-white focus:text-white text-center py-2 px-2 ">
                <Link href="/conversation">Messages</Link>
              </li>
            ) : (
              ""
            )}

            <li className=" text-black py-2 px-2 hover:bg-[#00538F]/80 w-full hover:text-white  focus:text-white focus:bg-[#00538F]/80 text-center ">
              <Link href="/ask-expert">Ask Experts</Link>
            </li>
            {isLoggedIn ? (
              <li className=" text-black py-2 px-2 hover:bg-[#00538F]/80 w-full hover:text-white  focus:text-white focus:bg-[#00538F]/80 text-center rounded-md">
                <Link href="/save-rehab">Saved Rehab</Link>
              </li>
            ) : (
              ""
            )}

            {isLoggedIn ? (
              <li className=" text-black py-2 px-2 hover:bg-[#00538F]/80 w-full hover:text-white  focus:text-white focus:bg-[#00538F]/80 text-center rounded-md">
                <Link href="/win">Win 1500</Link>
              </li>
            ) : (
              ""
            )}

            <li className=" text-black py-2 px-2 hover:bg-[#00538F]/80 w-full hover:text-white  focus:text-white focus:bg-[#00538F]/80 text-center flex justify-center rounded-md">
              <button
                className="text-red-700 text-xl flex items-center space-x-2"
                onClick={() => {
                  isLoggedIn
                    ? setIsOpen(true)
                    : MySwal.fire({
                        icon: "error",
                        text: "Please Login ",
                      });
                }}
              >
                <span>
                  <AiOutlineAlert />
                </span>
                <span className="text-sm text-black hover:text-white focus:text-white">
                  {" "}
                  Emergency
                </span>
              </button>
            </li>
            {isLoggedIn ? (
              <li className=" text-black py-2 px-2 rounded-md">
                <button
                  onClick={handleLogout}
                  className="text-base bg-[#CDF27E] py-2 px-6 rounded-md sm:px-6"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <ul className="flex gap-x-2">
                  <li className=" text-black py-2 px-2 rounded-md">
                    <Link href={{ pathname: "/login", query: Router.pathname }}>
                      <button className="text-base bg-[#CDF27E] py-2 px-6 rounded-md sm:px-6">
                        Login
                      </button>
                    </Link>
                  </li>
                  <li className=" text-black py-2 px-2 rounded-md">
                    <Link href="/Signup">
                      <button className="text-sm text-[#1A3578] border border-[#1A3578] rounded-md py-2 px-4 sm:px-4">
                        Sign Up
                      </button>
                    </Link>
                  </li>
                  <li className=" text-black py-2 px-2 rounded-md">
                    <Link href="/join-us">
                      <button className="text-sm text-[#1A3578] border border-[#1A3578] rounded-md py-2 px-4 sm:px-4">
                        Join Us
                      </button>
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      }

      <Modal
        open={modalIsOpen}
        title="Emergency Message"
        onCancel={closeModal}
        footer={false}
        // style={{overflowY:"scroll"}}
      >
        <div className="flex justify-end  ">
          <button onClick={closeModal} className="text-xl text-white">
            X
          </button>
        </div>

        <form
        onSubmit={handleFormSubmit}
        >
          <div className="grid grid-cols-12 gap-x-4 text-black gap-y-4">
            <div className=" col-span-6 ">
              <label className="">Name</label>
              <Input
                required
                type="text"
                className=" placeholder:text-gray-700 text-black"
                autoComplete="off"
                value={formData.name}
                name="name"
                style={{ color: "black" }}
                onChange={handleFormChange}
                placeholder="Name"
              />
            </div>
            <div className="col-span-6  ">
              <label className="">City</label>
              <Input
                // required
                type="text"
                className="  placeholder:text-gray-700 text-black"
                autoComplete="off"
                value={formData.city}
                style={{ color: "black" }}
                color="black"
                name="city"
                onChange={handleFormChange}
                placeholder="City (optional)"
              />
            </div>
            <div className="col-span-12  ">
              <label className="">Address</label>
              <Input
                // required
                type="text"
                className=" placeholder:text-gray-700 text-black "
                autoComplete="off"
                value={formData.address}
                name="address"
                style={{ color: "black" }}
                onChange={handleFormChange}
                placeholder="Address (optional)"
              />
            </div>

            <div className="col-span-12  ">
              <div className="  w-full">
                <label className=" ">Message</label>
                <TextArea
                  rows="2"
                  type="text"
                  className=" placeholder:text-gray-700 text-black"
                  autoComplete="off"
                  value={formData.message}
                  name="message"
                  style={{ color: "black" }}
                  placeholder="Enter Your Message"
                  onChange={handleFormChange}
                />
              </div>
            </div>

            {/* <div className="col-span-12">
              <Form.Item
                label="Select"
                name="media"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    setUploadImage(true);
                    return e;
                  }

                  if (e.file.type.startsWith("image/")) {
                    setUploadImage(true);
                    setImgUrl(e.file);
                    let b = URL.createObjectURL(e.file);
                    setPreview(b);
                  } else if (e.file.type.startsWith("video/")) {
                    setUploadImage(false);
                    setVideoUpload(e.file);
                    setVideoPreview(URL.createObjectURL(e.file)); // Set video preview URL
                  }

                  setInUpdate(true);
                  // Handle setting the video upload here
                  setVideoUpload(e.file); // Assuming e.file is the video file
                  return e && e.fileList;
                }}
              >
                <Upload
                  className="ml-11"
                  name="media"
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={() => false}
                  accept="image/*,video/*"
                  // onChange={(event) => {
                  //   setVideoUpload(event.target.files[0]);
                  // }}
                >
                  {uploadButton}
                </Upload>
              </Form.Item>
            </div> */}

            <div className="col-span-12 flex justify-end">
              <Button
                type={btnAdd}
                onClick={handleFormSubmit}
                style={{ width: "120px" }}
                htmlType="submit"
                className="bg-blue-900"
              >
                Send
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NavbarView;
