import React from "react";
import NurseCard from "../Common/NurseCard";
import avatar from "../../../public/images/avatar.png";
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { getDocs, collection, query, limit } from "firebase/firestore";
import PhysioCard from "../Common/PhysioCard";
import { RevealWrapper } from "next-reveal";
const RecentPysio = () => {
  const [physio, setPhysio] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhysio = async () => {
      try {
        const q = query(collection(db, "physio"), limit(3));
        const querySnapshot = await getDocs(q);
        const dataArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPhysio(dataArray);
      } catch (error) {
        console.log("Error fetching data: ", error);
        setError("Error fetching data. Please try again later.");
      }
    };

    fetchPhysio();
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
  if (physio.legth === 0) {
    return <></>;
  }
  return (
    <div>
      <h1 className="text-[#1A3578] text-2xl text-center md:text-start md:text-3xl font-semibold">
        Recently Viewed Pysio Care
      </h1>
      <div className="md:w-[50%] mb-4">
        <h4 className="text-center md:text-start text-sm mt-2 mb-8 text-[#777777]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-content-evenly ">
        {physio.legth > 0 ? (
          physio.map((physio) => {
            if (physio?.ref == "") {
              return <></>;
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
                key={physio?.id}
              >
                <NurseCard
                  key={physio?.id}
                  id={physio?.id}
                  name={physio?.name}
                  education={physio?.education}
                  gender={physio?.gender}
                  experience={physio?.experience}
                  homeCare={physio?.homeCare}
                  clinicCare={physio?.clinicCare}
                  working={physio?.workingAt}
                  images={physio?.images?.url}
                  alt={physio?.images?.name}
                  fees={physio?.perDay}
                  type="physio"
                />
              </RevealWrapper>
            );
          })
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
    </div>
  );
};

export default RecentPysio;
