import React, { useEffect } from "react";
import Image from "next/image";
import dummy from "../../../../public/images/dummy.png";
import { useState } from "react";
import { AiTwotoneStar } from "react-icons/ai";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { Spin, message } from "antd";
import { AiFillDelete } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  arrayUnion,
  doc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/firebase";
import { AddRemoveFavourite } from "@/services";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux";

const Card = ({
  rehabId,
  title,
  oldPrice,
  newPrice,
  url,
  thumbnail,
  discount,
  stars,
  review,
  background,
  like,
}) => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const info = (e) => {
    messageApi.info(e);
  };
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setbtnLoading] = useState(false);
  const { user, token } = useSelector((state) => state.root.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (stars > 0) {
      setLoading(true);
    }
  }, [stars]);

  let isFavourite = false;
  if (user?.savedRehab?.includes(rehabId)) {
    isFavourite = true;
  }

  const handleAddLike = async (e) => {
    setbtnLoading(true);

    let params = {
      rehabId: rehabId,
      userId: user?._id,
    };

    AddRemoveFavourite(params)
      .then((res) => {
        console.log("Re.....", res);
        dispatch(setUser(res?.data?.user));
      })
      .catch((err) => {
        console.log("err....", err?.response?.data);
      })
      .finally(() => {
        setbtnLoading(false);
      });

    // const docRef = doc(db, "users", localStorage.getItem("id"));
    // try {
    //   const res = await updateDoc(docRef, {
    //     savedRehab: arrayUnion({
    //       id: rehabId,
    //       title: title,
    //       oldPrice: oldPrice,
    //       newPrice: newPrice,
    //       //  url: url,
    //       discount: discount,
    //       // stars,
    //       // review,
    //     }),
    //   });
    //   setbtnLoading(false);
    //   queryClient.invalidateQueries({ querkey: ["Rehab"] });
    //   queryClient.invalidateQueries({ querkey: ["Recent-Rehab"] });
    // } catch (error) {
    //   console.log(error);
    //   setbtnLoading(false);
    // }
  };
  const handleLike = () => {
    // const token = localStorage.getItem("id");

    // if (!isLoading) {
    //   const result = data?.savedRehab?.filter((res2) => {
    //     return res2.id == rehabId;
    //   });
    if (token) {
      handleAddLike();
    } else {
      setbtnLoading(false);
      info("Please Login First");
    }
    // }
  };

  const fetchData = async () => {
    const docRef = doc(db, "users", localStorage.getItem("id"));
    var arr;
    try {
      const res = await getDoc(docRef);
      arr = res.data();
      return arr;
    } catch (error) {
      console.log(error);
    }
  };

  const { data, isLoading } = useQuery(["UserData"], fetchData, {
    staleTime: 60000,
  });
  const deleteSave = async (e) => {
    const result = data?.savedRehab?.filter((doc) => {
      return doc.id !== e;
    });
    const docRef = doc(db, "users", localStorage.getItem("id"));
    try {
      await updateDoc(docRef, {
        savedRehab: result,
      });
      queryClient.invalidateQueries({ querkey: ["Rehab"] });
      queryClient.invalidateQueries({ querkey: ["Recent-Rehab"] });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`${
        background ? background : "bg-[#F1F6F9]"
      } border px-6 md:px-2 py-6 sm:py-3 text-[#777777]  w-full   rounded-md flex flex-col`}
    >
      {contextHolder}
      <Image
        src={thumbnail ? thumbnail : dummy}
        width={200}
        height={200}
        className="h-[200px] w-full px-2"
        alt="dummy"
      />
      <div className="pl-2">
        <h2 className="text-xl  text-[#1A3578] pt-2 mt-4 font-medium">
          {title}
        </h2>
        <div className="flex gap-3 py-2 ">
          <s className="text-base">{oldPrice}</s>
          <h4 className="bg-green-100 px-1 ">{discount}%</h4>
          <h4 className="text-base text-[#1A3578]"> {newPrice}</h4>
        </div>
        <div className="text-yellow-400 flex items-center mb-4">
          {loading
            ? Array.from({ length: stars }).map((_, index) => (
                <AiTwotoneStar key={index} />
              ))
            : null}

          <div>
            <h2 className="text-black ml-3">{review}</h2>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[6fr_2fr] gap-2 px-2">
        <Link href={`/rehab-detail?rehabId=${rehabId}`}>
          <button className="bg-[#CDF27E] rounded text-sm font-semibold text-black w-full py-2">
            Book Now
          </button>
        </Link>

        <button
          className=" flex justify-center items-center border-2 rounded"
          onClick={() => {
            handleLike();
            // router.pathname == "/save-rehab"
            //   ? deleteSave(rehabId)
            //   : handleLike();
          }}
        >
          {router.pathname == "/save-rehab" ? (
            <span className="text-red-500 text-lg flex space-x-2">
              <AiFillDelete />
            </span>
          ) : (
            <span className="text-red-500 flex space-x-2">
              {btnLoading ? (
                <Spin />
              ) : isFavourite ? (
                <BsHeartFill />
              ) : (
                <BsHeart />
              )}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Card;
