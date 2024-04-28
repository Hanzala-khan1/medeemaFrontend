import React, { useState } from "react";
import logo1 from "../../../public/images/logo1.png";
import Image from "next/image";
import {
  AiOutlineGooglePlus,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { BsFacebook, BsGoogle, BsApple } from "react-icons/bs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { useRouter } from "next/router";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Input } from "antd";
import { userLogin } from "@/services";
import { useDispatch } from "react-redux";
import { setIsLoggedIn, setRole, setToken, setUser } from "@/redux";
const LogInPage = () => {
  const MySwal = withReactContent(Swal);
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const fProvider = new FacebookAuthProvider();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState("");

  const dispatch = useDispatch();
  const handleSignIn = async () => {
    let params = {
      email: email,
      password: password,
    };
    MySwal.showLoading();

    userLogin(params)
      .then((res) => {
        if (res?.status == 200 && res?.statusText == "OK") {
          dispatch(setIsLoggedIn(true));
          dispatch(setUser(res?.data?.user));
          dispatch(setToken(res?.data?.token));
          dispatch(setRole(res?.data?.user?.role));
          localStorage.setItem('token',res?.data?.token)
          localStorage.setItem('user',JSON.stringify(res?.data?.user))
          MySwal.fire({
            icon: "success",
            // title: 'Oops...',
            text: " LogedIn Successfull",
          });
          router.push("/");
        }
      })
      .catch((err) => {
        console.log("err..", err?.response?.data);
      })
      .finally(() => {
        MySwal.hideLoading();
      });
    // try {
    //   const userCredential = await signInWithEmailAndPassword(
    //     auth,
    //     email,
    //     password
    //   );
    //   const user = userCredential.user;
    //   localStorage.setItem("id", user?.uid);
    //   localStorage.setItem("role", "user");
    //   localStorage.setItem("token", user?.uid);
    //   MySwal.fire({
    //     icon: "success",
    //     // title: 'Oops...',
    //     text: " LogedIn Successfull",
    //   });
    //   router.push("/");
    // } catch (error) {
    //   console.error("Error signing in:", error);
    //   setError("Invalid email or password");
    // }
  };
  const logInwithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const values = {
        username: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        role: "user",
        id: user.uid,
        created_at: Timestamp.now(),
      };

      await setDoc(userRef, values, { merge: true });
      localStorage.setItem("id", user.uid);
      localStorage.setItem("role", "user");
      localStorage.setItem("token", user.uid);
      MySwal.fire({
        icon: "success",
        // title: 'Oops...',
        text: " LogedIn Successfull",
      });
      router.push(router?.query?.path);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  const logInwithFacebook = async () => {
    try {
      const userCredential = await signInWithPopup(auth, fProvider);
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const values = {
        username: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        role: "user",
        id: user.uid,
        created_at: Timestamp.now(),
      };

      await setDoc(userRef, values, { merge: true });
      localStorage.setItem("id", user.id);
      localStorage.setItem("role", "user");
      localStorage.setItem("token", user.uid);
      MySwal.fire({
        icon: "success",
        // title: 'Oops...',
        text: " LogedIn Successfull",
      });
      router.push({
        pathname: router?.query?.pathname,
        query: { ...router?.query },
      });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    switch (state) {
      case "email":
        handleSignIn();
        break;
      case "facebook":
        logInwithFacebook();
        break;
      case "google":
        logInwithGoogle();
        break;
      default:
        break;
    }
  };
  return (
    <div className={` parent h-[115vh]  lg:h-[100vh] `}>
      <div className=" font-[poppinsregular] flex flex-1 flex-col h-full px-6 py-4">
        <Link href="/">
          <div className="fixed top-6 left-6 ">
            <Image
              src={logo1}
              className="h-[50px] w-[130px] lg:h-[80px] lg:w-[200px] object-contain lg:ml-16 "
              alt="logo"
            />
          </div>
        </Link>
        <div className="flex justify-center items-center -mt-24 flex-1 lg:mt-0  ">
          <form onSubmit={handleSubmit}>
            <div className=" justify-center  bg-slate-950 bg-opacity-40 w-full sm:w-[450px] rounded-md flex flex-col gap-3 px-8 shadow-sm shadow-blue-950 py-6 ">
              <h1 className=" text-2xl lg:text-3xl font-[barlowregular] text-[#C6ED73]">
                Log in
              </h1>
              <h4 className="text-xs lg:text-sm mb-1 text-gray-300">
                To Keep connected with us please Log in with your personal
                information .
              </h4>
              <div className="flex flex-col mt-2">
                <label className="text-xs lg:text-sm text-[#C6ED73] -mb-1">
                  User Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  className="text-xs lg:text-sm py-2 outline-none placeholder:text-gray-300 bg-transparent border mt-2 px-4  text-white rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs lg:text-sm text-[#C6ED73] -mb-1">
                  Enter Password
                </label>
                <Input.Password
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ color: "white" }}
                  value={password}
                  placeholder="Enter Password"
                  className="text-xs text-white placeholder:text-gray-300 lg:text-sm py-2 outline-none bg-transparent border mt-2 px-4  rounded-md"
                  iconRender={(visible) =>
                    visible ? (
                      <span className="text-xl text-white  cursor-pointer">
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
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <input type="checkbox" className="h-4 w-4" />
                  <h2 className="text-xs lg:text-sm text-gray-300">
                    Remember Me
                  </h2>
                </div>
                <div>
                  <Link href="/forget">
                    <h2 className="text-xs lg:text-sm text-[#C6ED73]">
                      Forgot Password?
                    </h2>
                  </Link>
                </div>
              </div>
              <div className="mt-4">
                <button
                  className="w-full py-2 hover:bg-[#7ba129] text-sm bg-[#C6ED73] font-semibold rounded-md"
                  onClick={() => {
                    setState("email");
                  }}
                >
                  Log in
                </button>
              </div>
              <div className="flex justify-center text-xs mt-2 lg:text-sm text-gray-300">
                <h2>Or Log in with</h2>
              </div>
              <div className="flex justify-around items-center  px-4">
                <button
                  className="hover:text-white  text-sm text-[#C6ED73]"
                  onClick={() => {
                    setState("facebook");
                  }}
                >
                  <div className="flex gap-2 items-center  ">
                    <div className=" mb-1">
                      <BsFacebook />
                    </div>
                    <div className="">Facebook</div>
                  </div>
                </button>
                <button
                  className="hover:text-white text-sm  text-[#C6ED73]"
                  onClick={() => {
                    setState("google");
                  }}
                >
                  <div className="flex gap-2 items-center  ">
                    <div className="mb-1">
                      <BsGoogle />
                    </div>
                    <div className=" ">Google</div>
                  </div>
                </button>
              </div>
              <div className="text-center text-gray-300 py-4">
                <Link href="/Signup">
                  <button className="text-xs lg:text-sm hover:text-[#C6ED73] ">
                    New user? Create an account now.
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

export default LogInPage;
