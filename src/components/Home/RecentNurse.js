import React from "react";
import NurseCard from "../Common/NurseCard";
import avatar from "../../../public/images/avatar.png";
import { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase";
import { RevealWrapper } from "next-reveal";
const RecentNurse = () => {
  const [nurses, setNurses] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNurse = async () => {
      try {
        const q = query(collection(db, "nurses"), limit(3));
        const querySnapshot = await getDocs(q);
        const dataArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNurses(dataArray);
      } catch (error) {
        console.log("Error fetching data: ", error);
        setError("Error fetching data. Please try again later.");
      }
    };

    fetchNurse();
  }, []);

  const data = [
    {
      title: "Lorem ipsum",
      url: avatar,
      oldPrice: "$14.00",
      discount: "5%",
      newPrice: "$14.00",
      stars: 5,
      review: 240,
      experience: "Bachelor's in Nursing /10 Years Experience ",
    },
    {
      title: "Lorem ipsum",
      url: avatar,
      oldPrice: "$14.00",
      discount: "5%",
      newPrice: "$14.00",
      stars: 4,
      review: 240,
      experience: "Bachelor's in Nursing /10 Years Experience ",
    },
    {
      title: "Lorem ipsum",
      url: avatar,
      oldPrice: "$14.00",
      discount: "5%",
      newPrice: "$14.00",
      stars: 5,
      review: 240,
      experience: "Bachelor's in Nursing /10 Years Experience ",
    },
  ];
  if (nurses.length === 0) {
    return (
      <div>
        <h2>Loading</h2>
      </div>
    );
  }

  return (
    // <div className='flex flex-wrap-3 justify-center md:justify-between gap-x-1 w-full bg-black '>
    <div>
      <h1 className="text-[#1A3578] text-2xl text-center md:text-start md:text-3xl font-semibold">
        Recently Viewed Nursing
      </h1>
      <div className="md:w-[50%] mb-4">
        <h4 className="text-center md:text-start text-sm mt-2 mb-8 text-[#777777]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-content-evenly">
        {nurses.map((nurse) => {
          if (nurse?.ref === "") {
            return <React.Fragment key={nurse?.id} />;
          }
          return (
            <RevealWrapper
              rotate={{ x: 0, y: 0, z: 0 }}
              origin="left"
              delay={200}
              duration={900}
              distance="200px"
              reset={true}
              viewOffset={{ top: 0, right: 0, bottom: 0, left: 0 }}
              key={nurse?.id}
            >
              <NurseCard
                key={nurse?.id}
                id={nurse?.id}
                name={nurse?.name}
                education={nurse?.education}
                perDay={nurse?.perDay}
                perHour={nurse?.perHour}
                working={nurse?.workingAt}
                years={nurse?.years}
                images={nurse?.images?.url}
                fees={nurse?.fees}
              />
            </RevealWrapper>
          );
        })}
      </div>
    </div>
  );
};

export default RecentNurse;
