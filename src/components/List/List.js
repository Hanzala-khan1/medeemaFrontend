import Banner from "../Common/Banner";
import { BsSearch, BsX, BsArrowDownUp } from "react-icons/bs";
import { AiOutlineAim } from "react-icons/ai";
// import { FaFilter } from "react-icons/fa";
// import { db } from "../../firebase";
import React, { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
// import Card from "../Common/Card";
// import nearbySort from "nearby-sort";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
// import { Dropdown } from "antd";
import { getAllRehab, getUserByType } from "@/services";
import PhysioCard from "../Common/PhysioCard";
import { BASE_URL } from "@/services/endpoints";
import axios from "axios";
import RehabCard from "../Common/RehabCard";





const List = ({ UserType }) => {
  const [usersData, setUsersData] = useState([]);
  const [rehabData, setRehabData] = useState([]);
  // const [searchArr, setSearchArr] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  // const [myLoc, setMyLoc] = useState(false);
  const [sortfilter, setsortfilter] = useState("");
  const [pricefilter, setpricefilter] = useState("");
  const MySwal = withReactContent(Swal);
  // const queryClient = useQueryClient();
  // const [data, setData] = useState([]);
  const { coords, isGeolocationAvailable, isGeolocationEnabled, getPosition } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 1000,
    });

  useEffect(() => {
    GetUserData()

  }, [UserType])
  console.log("hhahhahahahahhahahahahah", rehabData)
  const GetUserData = async () => {
    try {
      MySwal.showLoading();
      let role;
      switch (UserType) {
        case "Nursing Care":
          role = "Nurses";
          break;
        case "Aya Care":
          role = "Aya";
          break;
        case "Physio Care":
          role = "PhysioDcotor";
          break;
        default:
          role = UserType;
      }
      if (role!="Rehabilitation Care"){

      let params = {
        "limit": 10,
        "page": 1,
        "role": role,
        "type": "Individual"
      };
      if (sortfilter) {
        params['sort'] = sortfilter
      }
      if (pricefilter) {
        params['pricefilter'] = pricefilter
      }
      if (searchInput) {
        params['search'] = searchInput

      }
      let user_data = await getUserByType(params)
      if (!user_data) {
        MySwal.fire({
          icon: "info",
          // title: 'Oops...',
          text: "No Data found",
        });
      }
      MySwal.hideLoading();
      setUsersData(user_data.data.userList.results)
      MySwal.close();
    }else{
      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      // let data = {
      //   page: 1, 
      //   limit: 20, 
      // };
      let url = `${BASE_URL}/user/getAllRehabLists`;

      // const userCount = await axios.get(url, data,{ headers });
      const rehablist = await axios({
        method: 'post',
        url: url,
        data: {
          page: 1,
          limit: 20,
        }
      });;
      if (rehablist.data.userList) {
        setRehabData(rehablist.data.userList.results);
      }
      else {
        console.log("no rehab Found")
      }
      MySwal.hideLoading();
      MySwal.close();

    }
    } catch (error) {
      MySwal.fire({
        icon: "error",
        // title: 'Oops...',
        text: error?.response?.data?.message,
      });
    }
  };

  const handleValueChange = (e) => {
    const value = e.target.value;
    switch (value) {
      case "ascending":
        setsortfilter("ascending");
        break;
      case "descending":
        setsortfilter("descending");

        break;
      case "high-price":
        setpricefilter("high-price");

        break;
      case "low-price":
        setpricefilter("low-price");
        break;
    }
  };
  // const searchlocation = async () => {
  //   if (isGeolocationEnabled) {
  //     const { longitude, latitude } = coords;
  //     let arr = [];

  //     let myCordinates = { lat: latitude, long: longitude };
  //     try {
  //       let ascSortedData = await nearbySort(myCordinates, data);
  //       setFilter("");
  //       setMyLoc(true);
  //       queryClient.setQueriesData(ascSortedData);
  //       setSearchArr(ascSortedData);
  //       ascSortedData?.map((doc, index) => {
  //         if (index < 3) {
  //           arr.push(doc);
  //         } else {
  //           return;
  //         }
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }

  //     // setphysio(arr)
  //   } else {
  //     MySwal.fire({
  //       icon: "error",

  //       text: "Please Enable Location or Reload your page",
  //     });
  //   }
  // };
  const handleSearch = () => {
    GetUserData()
  };
  const handleRemovefilter = () => {
    setSearchInput("");
    setsortfilter("");
    setpricefilter("");
    GetUserData()
  }
  return (
    <div className="flex-1 text-[#777777]">
      <Banner
        title={"Rehab Care List"}
        subHeading1={"Home"}
        subHeading2={"Rehabilitation List"}
      />
      <div className="py-12 w-full  flex justify-center flex-col items-center gap-2">
        <h1 className="text-[#1A3578] text-3xl font-bold">{UserType}</h1>
        <div className="w-[60%] md:w-[40%] mb-6">
          <h4 className="text-center text-[#777777] text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
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
          <button
            className="border px-4  h-full  md:py-0 md:h-full rounded-r-md hover:bg-[#3b5595] bg-[#1A3578] text-white text-2xl"
            onClick={handleRemovefilter}
          >
            <BsX />
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
          </div>
        </div>

        <button
        // onClick={searchlocation}
        >
          <div className="bg-white px-8 py-2 mt-2 items-center flex gap-4 rounded-sm shadow-sm hover:shadow-md">
            <h4>Detect Nearest Rehab</h4>
            <div className="text-xl text-[#1A3578]">
              <AiOutlineAim />
            </div>
          </div>
        </button>
      </div>
      <div className=" flex justify-center items-center px-30   md:px-[70px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 mb-[20px] lg:grid-cols-3 gap-4 place-content-evenly ">
          {UserType !== "Rehabilitation Care"?(usersData
            ? usersData?.map((user) => (
              <PhysioCard
                key={user._id}
                id={user._id}
                name={user.full_name}
                education={user.education}
                gender={user.gender}
                experience={user.experience}
                fees={user.perDay}
                homeCare={user.role}
                clinicCare={user.role}
                workingAt={user.hospital}
                images={"https://plus.unsplash.com/premium_photo-1711390047540-a76d80a9620e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8"}
                alt={user.role}
                background={"grey"}
                foreground={"#F1F6F9"}
                UserType={UserType}
              />
            ))
            : ""):(
              rehabData
              ? rehabData?.map((user) => (
                <RehabCard
                  key={user._id}
                  id={user._id}
                  name={user.Name}
                  description={user.description}
                  gender={user.gender}
                  experience={user.experience}
                  fees={user.perDay}
                  homeCare={user.role}
                  clinicCare={user.role}
                  workingAt={user.hospital}
                  images={"https://plus.unsplash.com/premium_photo-1711390047540-a76d80a9620e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8"}
                  alt={user.role}
                  background={"grey"}
                  foreground={"#F1F6F9"}
                  UserType={UserType}
                />
              ))
              : ""
            )}
        </div>
      </div>

    </div>
  );
};

export default List;
