import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Banner from "../Common/Banner";
import {
  BsSearch,
  BsFillCaretRightFill,
  BsCheckCircleFill,
  BsFillBackspaceReverseFill,
} from "react-icons/bs";
import doc1 from "../../../public/images/doc1.png";
import doc2 from "../../../public/images/doc2.png";
import Card22 from "./Card22";
import Card from "./Card";
import Query from "./Query";
import CommentsCard from "./CommentsCard";
import Image from "next/image";
import adsImg from "../../../public/images/ads.png";
import ModalPage from "../Common/Modal";
import { AiOutlineClose } from "react-icons/ai";
import avatar from "../../../public/images/new.png";
import { Select, message, Spin } from "antd";
import { db } from "../../firebase";
import { useQuery } from "@tanstack/react-query";
import { getFirestore, collection, query, getDocs } from "firebase/firestore";
import SpecialistPage from "./SpecialistPage ";

const { Option } = Select;

const ExpertPage = () => {
  const [doctors, setdoctors] = useState([]);
  const [searchMessage, setSearchMessage] = useState("");
  const [btnShow, setBtnShow] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [error, setError] = useState(null);
  const [state, setState] = useState(false);
  const [updaterState, setUpdaterState] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState([]);
  const [matchingHospitals, setMatchingHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [insLoading, setInsLoading] = useState(false);
  const [allHospitalsa, setAllHospitals] = useState([]);
  const fetchInsurance = async () => {
    let arr = [];
    const dbRef = collection(db, "insurance");
    try {
      const res = await getDocs(dbRef);
      res.docs.map((doc) => {
        arr.push(doc.data());
      });
      return arr;
    } catch (error) {
      console.log(error);
    }
  };
  const {
    isLoading: isLoadingInsurance,
    data: insuranceData,
    error: insuranceError,
  } = useQuery(["insurance"], fetchInsurance, {
    staleTime: 60000,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = collection(db, "expert-doctor");
        const querySnapshot = await getDocs(q);
        const dataArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setdoctors(dataArray);
      } catch (error) {
        console.log("Error fetching data: ", error);
        setError("Error fetching data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  // Fetch the hospital data from Firebase
  const fetchHospitals = async () => {
    let arr = [];
    try {
      const q = collection(db, "expert");
      const querySnapshot = await getDocs(q);
      const dataArray = querySnapshot.docs.map((doc) => {
        arr.push(doc.data());
      });
      setMatchingHospitals(arr);
      setAllHospitals(dataArray);
      // console.log(dataArray);
      setIsLoading(false);
      return arr;
    } catch (error) {
      console.log("Error fetching hospitals: ", error);
    }
  };

  const { data: allHospitals, isLoading: hospitalLoading } = useQuery(
    ["Hospitals"],
    fetchHospitals,
    {
      staleTime: 60000,
    }
  );
  const handleChange2 = (selectedOptions) => {
    setSelectedInsurance(selectedOptions);
  };
  const searchHospitals = () => {
    // Perform the search based on the selected insurance array
    console.log("hospitals.....", matchingHospitals);
    const filteredHospitals = matchingHospitals?.filter((hospital) => {
      const hospitalInsurance = hospital?.insurance?.map((ins) => ins);
      setInsLoading(true);
      return selectedInsurance?.every((ins) =>
        hospitalInsurance?.includes(ins)
      );
    });

    setMatchingHospitals(filteredHospitals);
  };
  const clearSearch = () => {
    setSelectedInsurance([]);
    setMatchingHospitals(allHospitals);
    setInsLoading(true);
  };

  const [comments, setcomments] = useState([]);
  const [error1, setError1] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "askQuestions"));
        const querySnapshot = await getDocs(q);
        const dataArray1 = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const filteredComments = dataArray1.filter(
          (comment) => comment.type === "public"
        );
        // console.log(filteredComments);
        setcomments(filteredComments);
        setUpdaterState(true);
      } catch (error) {
        setUpdaterState(true);
        console.log("Error fetching data: ", error);
        setError("Error fetching data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const Button = () => {
    return (
      <button
        className="text-xl"
        onClick={() => {
          setState(false);
        }}
      >
        <AiOutlineClose />
      </button>
    );
  };

  const doctors1 = [
    {
      name: "",
      specialist: "Gynacologits",
      url: doc1,
    },
    {
      name: "",
      specialist: "Cardiologist",
      url: doc2,
    },
    {
      name: "",
      specialist: "Gynacologits",
      url: doc2,
    },
    {
      name: "",
      specialist: "Cardiologist",
      url: doc2,
    },
    {
      name: "",
      specialist: "Gynacologits",
      url: doc1,
    },
    {
      name: "",
      specialist: "Cardiologist",
      url: doc1,
    },
    {
      name: "",
      specialist: "Cardiologist",
      url: doc1,
    },
    {
      name: "",
      specialist: "Cardiologist",
      url: doc2,
    },
    {
      name: "",
      specialist: "Cardiologist",
      url: doc1,
    },
    {
      name: "",
      specialist: "Cardiologist",
      url: doc2,
    },
  ];
  const comments1 = [
    {
      name: "",
      title: "",
    },
    {
      name: "",
      title: "",
    },
    {
      name: "",
      title: "",
    },
    {
      name: "",
      title: "",
    },
  ];

  const updateState = (e) => {
    setUpdaterState(e);
  };
  // Handle input change for search
  const handleSearchChange = (e) => {
    setSearchMessage(e.target.value);
  };

  // Search function
  const search = () => {
    const searchTerms = searchMessage.toLowerCase().split(" ");

    const newArr = comments?.filter((obj) =>
      searchTerms.every((term) =>
        Object.values(obj).some((val) =>
          val.toString().toLowerCase().includes(term)
        )
      )
    );

    setBtnShow(true);
    setSearchResult(newArr);
  };

  // const search = () => {

  //   const newArr = comments?.filter((obj) =>
  //     Object.values(obj).some((val) =>
  //       val.toString().includes(searchMessage?.toLowerCase())
  //     )
  //   );
  //   setBtnShow(true);
  //   setSearchResult(newArr);

  // };
  // const history = useHistory(); // Get the history object

  return (
    <div className="">
      <Banner
        title={"Ask Expert"}
        subHeading1={"Home"}
        subHeading2={"Ask Expert"}
      />

      <div className="flex flex-col justify-center items-center gap-3 ">
        <h2 className="text-center text-4xl text-[#1A3578] font-bold mt-4 md:mt-8">
          Ask Experts
        </h2>
        <h4 className="text-sm text-center text-[#777777] w-96 ">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </h4>
        <div
          className={`flex items-center ${
            searchResult.length > 0 ? "text-black" : ""
          }`}
        >
          {/* /////////////////////////////////////// */}

          {/* <input
            type="search"
            placeholder="Search for Expert"
            className={`py-2 px-2 w-[280px] rounded-l-md border border-gray-500 outline-none ${searchMessage ? "text-black" : ""
              }`}
            onChange={handleSearchChange}
            value={searchMessage}
          />

          <button
            className="border px-4 py-2 rounded-r-md hover:bg-[#3b5595] bg-[#1A3578] text-white text-2xl"
            onClick={search}
          >
            <BsSearch />
          </button> */}
        </div>

        {searchResult.length !== 0 ? (
          <div className="border mx-12">
            <div className="flex justify-between">
              <h2
                className={`${btnShow ? "flex" : "hidden"} text-xl text-black`}
              >
                Search Results...
              </h2>
              <button
                className={`${
                  btnShow ? "flex" : "hidden"
                } bg-red-400 justify-center items-center text-xl px-2 py-1 rounded-full font-bold`}
                onClick={() => {
                  setSearchResult([]);
                  setBtnShow(false);
                }}
              >
                <span>Clear All</span>
              </button>
            </div>

            {searchResult.map((doc, index) => (
              <CommentsCard
                key={index}
                replays={doc.replays}
                name={doc.sender.username}
                time={doc.time}
                message={doc.message}
              />
            ))}
          </div>
        ) : (
          ""
        )}
      </div>

      {/* /////////////////////////////////////// */}

      <Query state={updaterState} updateFunc={updateState} />
      <h2 className="text-center text-4xl text-[#1A3578] font-bold my-4 md:my-8">
        Search For insurance
      </h2>

      <div>
        <div className="flex justify-center gap-x-2  items-center">
          <Select
            mode="multiple"
            placeholder="Select insurance"
            onChange={handleChange2}
            className="mt-2 w-[250px] text-black h-[30px] focus:text-black flex-center"
            value={selectedInsurance}
            style={{ color: "black" }}
            tokenSeparators={[","]}
          >
            {!isLoadingInsurance ? (
              insuranceData.map((dataCat) => (
                <Option key={dataCat?.name}>{dataCat?.name}</Option>
              ))
            ) : (
              <Option>Loading</Option>
            )}
          </Select>

          <button
            className="mt-2 text-white bg-[#1A3578] px-4 h-[30px] rounded-md"
            onClick={searchHospitals}
          >
            Search
          </button>
          <button
            className="mt-2 text-white bg-[#1A3578] h-[30px] px-4 rounded-md"
            onClick={clearSearch}
          >
            Get All
          </button>
        </div>

        <div className="mt-6 flex flex-wrap px-4  justify-center gap-x-2 items-center">
          {insLoading
            ? matchingHospitals.map((hospital, index) => (
                <Card22 key={index} specialist={hospital?.name} />
              ))
            : ""}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-[8fr_2fr] md:px-16 gap-4">
          <div className="mb-4 col-span-1">
            {comments.map((doc, index) => {
              return doc.type == "public" ? (
                <CommentsCard
                  key={index}
                  replays={doc?.replays}
                  name={doc?.sender?.username}
                  time={doc?.time}
                  message={doc?.message}
                />
              ) : (
                "NA"
              );
            })}
            <div className="flex justify-end mt-2">
              {!updaterState ? (
                <Spin />
              ) : (
                <button
                  onClick={() => {
                    setUpdaterState(false);
                  }}
                  className="bg-[#3b5595] px-3 py-1 text-white rounded-lg"
                >
                  Reload
                </button>
              )}
            </div>
          </div>
          <div className=" hidden col-span-1 md:flex justify-start flex-col gap-4">
            <div>
              <button
                className=" text-xl  flex justify-end w-[160px] "
                onClick={() => {
                  setState(true);
                }}
              >
                <h2 className="text-xs px-3 z-10 bg-[#CDF27E] ">Skipp Add X</h2>
              </button>
              <div className=" z-0 -mt-4">
                <Image
                  width={200}
                  height={600}
                  src={adsImg}
                  className=" h-[600px] w-[160px] "
                  alt="ads"
                />
              </div>
            </div>
            <div>
              <button
                className=" text-xl  flex justify-end w-[160px] "
                onClick={() => {
                  setState(true);
                }}
              >
                <h2 className="text-xs px-3 z-10 bg-[#CDF27E] ">Skipp Add X</h2>
              </button>
              <div className=" z-0 -mt-4">
                <Image
                  width={100}
                  height={100}
                  src={adsImg}
                  className=" h-[600px] w-[160px] "
                  alt="ads"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalPage state={state} Button={Button} />
    </div>
  );
};

export default ExpertPage;
