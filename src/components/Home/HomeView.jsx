import React, { useState, useEffect } from "react";
import Navbar from "../Common/Navbar/Navbar";
import Footer from "../Common/Footer/index";
import HomeCategory from "./Category";
import HomeSlider from "./slider";
import RecentRehab from "./RecentRehab";
import RecentNurse from "./RecentNurse";
import RecentAya from "./RecentAya";
import RecentPysio from "./RecentPysio";
import { auth, db, storage } from "../../firebase";
import { getCategories } from "@/services";
import { useSelector } from "react-redux";

const HomeView = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isLoggedIn } = useSelector((state) => state.root.user);
  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     setIsLoggedIn(!!user);
  //   });

  //   return () => unsubscribe();
  // }, []);

  return (
    <div className="bg-white ">
      <Navbar />
      <HomeSlider />
      <div className="parent4 bg-white pt-10 md:pt-20 px-[30px]  md:px-[70px] mx-auto max-w-[1440px] mb-20">
        <HomeCategory />

        {isLoggedIn && (
          <>
            <div className="mt-12 md:mt-20 ">
              <RecentRehab />
            </div>

            <div className="mt-12 md:mt-20 ">
              <RecentNurse />
            </div>
            <div className="mt-12 md:mt-20 ">
              <RecentAya />
            </div>

            <div className="mt-12 md:mt-20 ">
              <RecentPysio />
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default HomeView;
