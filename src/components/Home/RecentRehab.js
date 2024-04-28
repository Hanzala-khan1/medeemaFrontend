import React from "react";
import Card from "../../components/Common/Card/index";
import dummy from "../../../public/images/dummy.png";
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getDocs, collection, query, limit } from "firebase/firestore";
import { RevealWrapper } from "next-reveal";
const RehabList = () => {
  // const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    var arr = [];
    try {
      const q = collection(db, "rehab");
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.map((doc) => {
        arr.push(doc.data());
      });
      return arr;
    } catch (error) {
      console.log("Error fetching data: ", error);
      setError("Error fetching data. Please try again later.");
    }
  };

  const { data, isLoading } = useQuery(["Recent-Rehab"], fetchData, {
    staleTime: 60000,
  });
  if (!isLoading) {
  }
  const calculateDiscountedPrice = (price, discount) => {
    const discountedPrice = price - (price * discount) / 100;
    return discountedPrice.toFixed(2);
  };

  // Function for rating:
  const calculateStars = (review) => {
    const rating = Math.floor(review / 20);
    return rating;
  };
  const data1 = [
    {
      title: "Lorem ipsum",
      url: dummy,
      oldPrice: "$14.00",
      discount: "5%",
      newPrice: "$14.00",
      stars: 5,
      review: 240,
    },
    {
      title: "Lorem ipsum",
      url: dummy,
      oldPrice: "$14.00",
      discount: "5%",
      newPrice: "$14.00",
      stars: 4,
      review: 240,
    },
    {
      title: "Lorem ipsum",
      url: dummy,
      oldPrice: "$14.00",
      discount: "5%",
      newPrice: "$14.00",
      stars: 4,
      review: 240,
    },
    {
      title: "Lorem ipsum",
      url: dummy,
      oldPrice: "$14.00",
      discount: "5%",
      newPrice: "$14.00",
      stars: 4,
      review: 240,
    },
  ];
  if (data == []) {
    return <></>;
  }
  return (
    <div>
      <h1 className="text-[#1A3578] text-2xl text-center md:text-start md:text-3xl font-semibold">
        Recently Viewed Rehabilitation
      </h1>
      <div className="md:w-[50%] mb-4">
        <h4 className="text-center md:text-start text-sm mt-2 mb-8 text-[#777777]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </h4>
      </div>
      <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-4 place-content-evenly ">
        {data?.map((doc) => {
          if (doc?.ref == "") {
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
              key={doc?.id}
            >
              <Card
                key={doc?.id}
                rehabId={doc?.id}
                title={doc?.name}
                thumbnail={doc?.images[0]?.url}
                oldPrice={doc?.perDay}
                newPrice={calculateDiscountedPrice(doc?.perDay, doc?.discount)}
                discount={doc?.discount}
                stars={calculateStars(doc?.review)}
                review={doc?.review}
                like={doc?.likes ? doc?.likes : []}
                background="bg-white"
              />
            </RevealWrapper>
          );
        })}
      </div>
    </div>
  );
};

export default RehabList;
