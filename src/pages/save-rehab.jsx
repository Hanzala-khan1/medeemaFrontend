import Banner from "../components/Common/Banner";
import { BsSearch, BsGeoAltFill, BsArrowDownUp } from "react-icons/bs";
import { AiOutlineAim } from "react-icons/ai";
import { FaFilter } from "react-icons/fa";
import { db } from "../firebase";
import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  getDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { useGeolocated } from "react-geolocated";
import Card from "../components/Common/Card";
// import avatar from ../../public/images/avatar.png';
import nearbySort from "nearby-sort";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Dropdown } from "antd";
import Footer from "@/components/Common/Footer";
import Navbar from "@/components/Common/Navbar/Navbar";
import { getAllFav } from "@/services";
import { useSelector } from "react-redux";
const List = () => {
  const [nur, setPhysio] = useState([]);
  const [error, setError] = useState(null);
  const [searchArr, setSearchArr] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [show, setShow] = useState(<></>);
  const [alphaSearch, setAlphaSearch] = useState(null);
  const [myLoc, setMyLoc] = useState(false);
  const [filter, setFilter] = useState("");
  const MySwal = withReactContent(Swal);
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.root.user);
  const [data, setData] = useState([]);
  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 1000,
    });

  const calculateDiscountedPrice = (price, discount) => {
    const discountedPrice = price - (price * discount) / 100;
    return discountedPrice.toFixed(2);
  };
  const calculateStars = (review) => {
    const rating = Math.floor(review / 20);
    return rating;
  };
  useEffect(() => {
    if (searchArr) {
      setShow(
        <div className="mx-12 flex justify-between items-center mb-2 ">
          <h2 className="">
            Search Items `({searchArr ? searchArr?.length : "0"})`
          </h2>
          <button
            className="hover:bg-[#3b5595] bg-[#1A3578] px-2 text-white "
            onClick={() => {
              setSearchArr(null);
            }}
          >
            Clear all
          </button>
        </div>
      );
    } else {
      setShow(<></>);
    }
  }, [searchArr]);

  useEffect(() => {
    fetchSavedRehab();
  }, []);
  const fetchSavedRehab = () => {
    getAllFav(user._id)
      .then((res) => {
        console.log("reh res......", res);
        if (res?.status == "200") {
          console.log("cc....");
          setData(res?.data?.savedRehab?.results);
        }
      })
      .catch((err) => {
        console.log("err...", err?.response?.data);
      })
      .finally(() => {});
  };
  const fetchphysio = async () => {
    var arr = [];
    try {
      const docRef = doc(db, "users", localStorage.getItem("id"));

      const res = await getDoc(docRef);
      //   res.data()
      // console.log(res.data())
      arr = res?.data();
      return arr;
    } catch (error) {
      console.log("Error fetching data: ", error);
      setError("Error fetching data. Please try again later.");
    }
  };

  // const { isLoading, data } = useQuery(["Rehab"], fetchphysio, {
  //   staleTime: 60000,
  // });
  // if (!isLoading) {
  //   // console.log(data)
  // }
  const handleValueChange = (e) => {
    const value = e.target.value;
    switch (value) {
      case "ascending":
        setFilter("ascending");
        break;
      case "descending":
        setFilter("descending");

        break;
      case "high-price":
        setFilter("high-price");

        break;
      case "low-price":
        setFilter("low-price");
        break;
    }
  };
  //   const searchlocation = async()=>{
  //     if(isGeolocationEnabled ){

  //     const {longitude,latitude}=coords
  //     let arr=[]

  //     let myCordinates= {lat:latitude,long:longitude};
  //     try{
  //       let ascSortedData = await nearbySort(myCordinates, data);
  //       setFilter("")
  //       setMyLoc(true)
  //       queryClient.setQueriesData(ascSortedData)
  //       console.log(ascSortedData,"neares")
  // setSearchArr(ascSortedData)
  //       ascSortedData?.map((doc,index)=>{
  //         if(index<3){
  //           arr.push(doc)
  //         }else{
  //           return
  //         }

  //       })
  //     }catch(error){
  //       console.log(error)
  //     }

  //     // setphysio(arr)
  //     console.log(longitude,latitude)

  //     }else{
  //       MySwal.fire({
  //         icon: "error",

  //         text: "Please Enable Location or Reload your page",
  //       });
  //     }
  //   }

  // coords,isGeolocationAvailable,isGeolocationEnabled,
  // console.log({physio})
  const handleSearch = () => {
    // const res = comments?.includes(searchMessage)
    const newArr = data?.savedRehab?.filter((obj) =>
      Object.values(obj).some((val) =>
        val.toString().includes(searchInput?.toLocaleLowerCase())
      )
    );
    // setBtnShow(true)
    if (newArr == []) {
      const newArr = physio?.filter((obj) =>
        Object.values(obj).some((val) =>
          val.toString().includes(searchInput?.toLowerCase())
        )
      );
      setSearchArr(newArr);
    }

    setSearchArr(newArr);

    // console.log(newArr, "data");
  };
  const sortItems = [
    {
      key: "1",
      label: (
        <button
          onClick={() => {
            setFilter("ascending");
            setMyLoc(false);
          }}
        >
          a-z
        </button>
      ),
    },
    {
      key: "2",
      label: (
        <button
          onClick={() => {
            setFilter("descending");
            setMyLoc(false);
          }}
        >
          z-a
        </button>
      ),
    },
  ];
  const filterItems = [
    {
      key: "1",
      label: (
        <button
          onClick={() => {
            setFilter("high-price");
            setMyLoc(false);
          }}
        >
          High to Low
        </button>
      ),
    },
    {
      key: "2",
      label: (
        <button
          onClick={() => {
            setFilter("low-price");
            setMyLoc(false);
          }}
        >
          Low to High
        </button>
      ),
    },
  ];

  console.log("save......", data);
  return (
    <div className="flex-1 text-[#777777]">
      <Navbar />
      <Banner
        title={"Rehab Care List"}
        subHeading1={"Home"}
        subHeading2={"Rehabilitation List"}
      />
      <div className="py-12 w-full  flex justify-center flex-col items-center gap-2">
        <h1 className="text-[#1A3578] text-3xl font-bold">Favourite List</h1>
        <div className="w-[60%] md:w-[40%] mb-6">
          <h4 className="text-center text-[#777777] text-sm">
            Lorem ipsu dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </h4>
        </div>
        <div className="md:flex items-center hidden flex-wrap justify-center  md:h-[40px]">
          <input
            type="search"
            className="border px-8 py-3 md:py-0 md:h-full outline-none"
            placeholder="Search for physio"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />

          <select
            className="border px-4 py-4 md:py-0 md:h-full"
            placeholder=""
            onChange={handleValueChange}
          >
            <option value={"Sort By"} disabled selected hidden>
              Sort By
            </option>
            <option value={"ascending"}>a-z</option>
            <option value={"descending"}>z-a</option>
          </select>

          <select
            className="border w-72 md:w-auto px-6 py-3 md:py-0 md:h-full"
            onChange={handleValueChange}
          >
            <option disabled selected hidden value={"Filter"}>
              Filter
            </option>
            <option value={"high-price"}>High to Low</option>
            <option value={"low-price"}>Low to High</option>
          </select>
          <button
            className="border px-4  py-3 md:py-0 md:h-full hover:bg-[#3b5595] bg-[#1A3578] text-white text-2xl"
            onClick={handleSearch}
          >
            <BsSearch />
          </button>
        </div>
        <div className=" md:hidden flex h-[50px] gap-1">
          <div className="flex items-center h-[50px]">
            <input
              type="search"
              className="  h-full outline-none border rounded-l-md px-2"
              placeholder="search"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
            />
            <button
              className="border px-4  h-full  md:py-0 md:h-full rounded-r-md hover:bg-[#3b5595] bg-[#1A3578] text-white text-2xl"
              onClick={handleSearch}
            >
              <BsSearch />
            </button>
          </div>
          <Dropdown
            menu={{
              items: sortItems,
            }}
            placement="bottom"
            arrow={{
              pointAtCenter: true,
            }}
          >
            <button className="px-4 h-full border border-[#1A35785E] bg-white ">
              <BsArrowDownUp />
            </button>
          </Dropdown>
          <Dropdown
            menu={{
              items: filterItems,
            }}
            placement="bottom"
            arrow={{
              pointAtCenter: true,
            }}
          >
            <button className="px-4 h-full border border-[#1A35785E] bg-white ">
              <FaFilter />
            </button>
          </Dropdown>
        </div>
        <button>
          <div className="bg-white px-8 py-2 mt-2 items-center flex gap-4 rounded-sm shadow-sm hover:shadow-md">
            <h4>Detect Nearest Rehab</h4>
            <div className="text-xl text-[#1A3578]">
              <AiOutlineAim />
            </div>
          </div>
        </button>
      </div>
      {show}
      <div className=" flex justify-center items-center px-30   md:px-[70px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 mb-[20px] lg:grid-cols-3 gap-4 place-content-evenly ">
          {searchArr
            ? searchArr?.map((doc) => (
                <Card
                  key={doc?._id}
                  rehabId={doc?._id}
                  title={doc?.name}
                  thumbnail={doc?.name}
                  oldPrice={doc?.perDay}
                  newPrice={calculateDiscountedPrice(
                    doc?.perDay,
                    doc?.discount
                  )}
                  discount={doc?.discount}
                  stars={calculateStars(doc?.review)}
                  review={doc?.review}
                  like={doc?.likes ? doc?.likes : []}
                  background="bg-white"
                />
              ))
            : ""}
        </div>
      </div>

      <div className=" flex justify-center items-center px-30  md:px-[70px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 mb-[20px] lg:grid-cols-3 gap-4 place-content-evenly ">
          { data?.map((doc) => (
                <Card
                  key={doc?._id}
                  rehabId={doc?._id}
                  title={doc.is_add_rehab?doc.rehab_id.name:doc.user_id.name}
                  thumbnail={"https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9jdG9yfGVufDB8fDB8fHww"}
                  oldPrice={doc?.perDay}
                  newPrice={calculateDiscountedPrice(
                    doc?.perDay,
                    doc?.discount
                  )}
                  discount={doc?.discount}
                  stars={calculateStars(doc?.review)}
                  review={doc?.review}
                  like={doc?.likes ? doc?.likes : []}
                  background="bg-white"
                />
              ))
              }
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default List;
