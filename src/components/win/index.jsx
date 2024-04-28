import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button, Spin, message } from "antd";
import { useRouter } from "next/router";
import logo from "../../../public/images/logo1.png";
import {
  Timestamp,
  addDoc,
  collection,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterShareButton,
  TwitterIcon,
  WhatsappIcon,
  WhatsappShareButton,
  PinterestShareButton,
  PinterestIcon,
} from "react-share";

const Winpage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [state, setState] = useState(false);
  const info = () => {
    messageApi.info("Coppied to Clpboard");
  };
  const router = useRouter();
  const { asPath } = useRouter();
  const [pageOrigin, setPageOrigin] = useState("");
  useEffect(() => {
    if (localStorage?.getItem("token")) {
      setState(true);
    }
    const origin =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "";

    const URL = `${origin}`;
    setPageOrigin(URL);
  }, []);

  const queryClient = useQueryClient();
  const [couponCode, setCoupon] = useState(0);
  const [loading, setLoading] = useState(false);
  async function coupongenerator() {
    setLoading(true);
    var coupon = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 6; i++) {
      coupon += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    const docRef = collection(db, "coupons");
    try {
      const res = await addDoc(docRef, {
        coupon: coupon,
        holder: localStorage.getItem("id"),
        date: Timestamp.now(),
        couponUsed: false,
      });
      await updateDoc(doc(db, "coupons", res.id), {
        id: res.id,
      });
      queryClient.invalidateQueries({ queryKey: ["Coupon"] });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    return setCoupon(coupon);
  }

  const fetchData = async () => {
    let arr = [];
    const docRef = query(
      collection(db, "coupons"),
      where("holder", "==", localStorage.getItem("id"))
    );

    try {
      const res = await getDocs(docRef);
      //   console.log(res.docs[0].data())
      arr = res.docs[0].data();
      //   console.log(res.docs[0].data())
      return arr;
    } catch (error) {
      console.log(error);
    }
  };
  const { data, isLoading } = useQuery(["Coupon"], fetchData, {
    staleTime: 60000,
  });
  // if(!isLoading){
  //     console.log(data,"data")
  // }

  return (
    <>
      {state ? (
        <div>
          {contextHolder}
          <div className="pt-24">
            <h2 className="text-xl md:text-4xl text-blue-900  text-center mb-12 font-bold">
              Genterate Your Referral Code{" "}
            </h2>
          </div>
          {data ? (
            <div className="flex justify-center items-center pb-4">
              <div className=" parent  md:h-[500px]  outline-dashed outline-4 outline-blue-900 outline-offset-4 w-[350px] md:w-[800px] mb-24">
                <div className="bg-gradient-to-r bg-gradient-35 h-full w-full px-4 flex flex-col items-center gap-y-6  from-blue-900 to-transparent">
                  <div>
                    <Image src={logo} height={200} width={200} alt="logo" />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-4xl text-white font-bold">
                      Generate Referral link
                    </h4>
                  </div>
                  <div>
                    <h4 className="text-sm md:text-lg text-green-200 font-bold">
                      You wil get 1500 discount when someone signup from your
                      link
                    </h4>
                  </div>
                  <div className="flex  items-center md:mt-12 mb-4  ">
                    <div className="md:h-[60px] w-full px-4 rounded-l-lg  border-green-200 border-2 text-white text-center md:text-xl flex justify-center items-center ">
                      <span>{`${pageOrigin}/Signup?coupon=${data?.coupon}`}</span>
                    </div>
                    {loading ? (
                      <Spin />
                    ) : (
                      <button
                        className="bg-green-200 md:w-[80px] rounded-r-lg h-[52px] md:h-[60px] px-4"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${pageOrigin}/Signup?coupon=${data?.coupon}`
                          );
                          info();
                        }}
                      >
                        Copy Url
                      </button>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg md:text-2xl text-white font-bold ml-5">
                      Share link with
                    </h4>
                    <div className="mt-4">
                      <FacebookShareButton
                        style={{ marginRight: 20 }}
                        url={`${pageOrigin}/Signup?coupon=${data?.coupon}`}
                      >
                        <FacebookIcon size={35} round />
                      </FacebookShareButton>
                      <LinkedinShareButton
                        style={{ marginRight: 20 }}
                        url={`${pageOrigin}/Signup?coupon=${data?.coupon}`}
                      >
                        <LinkedinIcon size={35} round />
                      </LinkedinShareButton>
                      <TwitterShareButton
                        style={{ marginRight: 20 }}
                        url={`${pageOrigin}/Signup?coupon=${data?.coupon}`}
                      >
                        <TwitterIcon size={35} round />
                      </TwitterShareButton>
                      <WhatsappShareButton
                        style={{ marginRight: 20 }}
                        url={`${pageOrigin}/Signup?coupon=${data?.coupon}`}
                      >
                        <WhatsappIcon size={35} round />
                      </WhatsappShareButton>
                    </div>
                  </div>

                  {/* <div>Hello</div> */}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center pb-4">
              <div className=" parent  md:h-[400px]  outline-dashed outline-4 outline-blue-900 outline-offset-4 w-[390px] md:w-[800px] mb-24">
                <div className="bg-gradient-to-r bg-gradient-35 h-full w-full px-4 flex flex-col items-center gap-y-6  from-blue-900 to-transparent">
                  <div>
                    <Image src={logo} height={200} width={200} alt="logo" />
                  </div>
                  <div>
                    <h4 className="text-4xl text-white font-bold">
                      Generate Referral link
                    </h4>
                  </div>
                  <div>
                    <h4 className="text-lg text-green-200 font-bold">
                      You wil get 1500 discount when someone signup from your
                      link
                    </h4>
                  </div>
                  <div className="flex  items-center mt-12 ">
                    <div className="md:h-[40px] px-4 rounded-l-lg  border-green-200 border-2 text-white text-center text-xl flex justify-center items-center ">
                      <span>
                        {couponCode == 0
                          ? "Please Generate Code"
                          : `${pageOrigin}/Signup?coupon=${couponCode}`}
                      </span>
                    </div>
                    {loading ? (
                      <button className="bg-green-200  rounded-r-lg h-[60px] md:h-[40px] px-4">
                        <Spin />
                      </button>
                    ) : (
                      <button
                        className="bg-green-200  rounded-r-lg h-[60px] md:h-[40px] px-4"
                        onClick={coupongenerator}
                      >
                        Generate
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-[60vh]">
          {" "}
          <h2>Please LogIn </h2>
        </div>
      )}{" "}
    </>
  );
};

export default Winpage;
