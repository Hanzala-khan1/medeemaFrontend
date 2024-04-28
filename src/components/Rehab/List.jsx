import Banner from "../Common/Banner";
import { BsSearch, BsGeoAltFill, BsArrowDownUp } from "react-icons/bs";
import { AiOutlineAim } from "react-icons/ai";
import { FaFilter } from "react-icons/fa";
import { db } from "../../firebase";
import React, { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import Card from "../Common/Card";
import nearbySort from "nearby-sort";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Dropdown } from "antd";
import { getAllRehab } from "@/services";
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

  const [likedItems, setLikedItems] = useState([]);

  // ... other state variables and functions ...

  // Function to handle when a user clicks the "liked" button
  const handleLikeClick = (rehabId) => {
    // Check if the item is already liked
    if (likedItems.includes(rehabId)) {
      // Item is already liked, so remove it from likedItems
      setLikedItems(likedItems.filter((id) => id !== rehabId));
    } else {
      // Item is not liked, so add it to likedItems
      setLikedItems([...likedItems, rehabId]);
    }
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
    fetchphysio();
  }, []);

  const fetchphysio = async () => {
    MySwal.showLoading();
    getAllRehab()
      .then((res) => {
        console.log("rehab res....", res?.data);
        setData(res?.data.rehabList);
      })
      .catch((err) => {
        console.log("err...", err?.response?.data);
      })
      .finally(() => {
        MySwal.hideLoading();
        MySwal.close();
      });
    // var arr = [];
    // try {
    //   const q = query(collection(db, "rehab"));

    //   const res = await getDocs(q);
    //   res.docs.map((doc) => {
    //     arr.push(doc.data());
    //   });
    //   return arr;
    // } catch (error) {
    //   console.log("Error fetching data: ", error);
    //   setError("Error fetching data. Please try again later.");
    // }
  };

  // fetchphysio();
  // const { isLoading, data } = useQuery(["Rehab"], fetchphysio, {
  //   staleTime: 60000,
  // });
  // if (!isLoading) {
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
  const searchlocation = async () => {
    if (isGeolocationEnabled) {
      const { longitude, latitude } = coords;
      let arr = [];

      let myCordinates = { lat: latitude, long: longitude };
      try {
        let ascSortedData = await nearbySort(myCordinates, data);
        setFilter("");
        setMyLoc(true);
        queryClient.setQueriesData(ascSortedData);
        setSearchArr(ascSortedData);
        ascSortedData?.map((doc, index) => {
          if (index < 3) {
            arr.push(doc);
          } else {
            return;
          }
        });
      } catch (error) {
        console.log(error);
      }

      // setphysio(arr)
    } else {
      MySwal.fire({
        icon: "error",

        text: "Please Enable Location or Reload your page",
      });
    }
  };

  // coords,isGeolocationAvailable,isGeolocationEnabled,
  // console.log({physio})
  const handleSearch = () => {
    // const res = comments?.includes(searchMessage)
    const newArr = data?.filter((obj) =>
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
  return (
    <div className="flex-1 text-[#777777]">
      <Banner
        title={"Rehab Care List"}
        subHeading1={"Home"}
        subHeading2={"Rehabilitation List"}
      />
      <div className="py-12 w-full  flex justify-center flex-col items-center gap-2">
        <h1 className="text-[#1A3578] text-3xl font-bold">Rehab List</h1>
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
        <button onClick={searchlocation}>
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
                  key={doc._id}
                  rehabId={doc._id}
                  title={doc.name}
                  oldPrice={doc.perDay}
                  newPrice={calculateDiscountedPrice(doc.perDay, doc.discount)}
                  discount={doc.discount}
                  stars={calculateStars(doc.review)}
                  review={doc.review}
                  like={doc?.likes ? doc?.likes : []}
                  background="bg-white"
                >
                  {/* Add the "liked" button and handle its click event */}
                  <button
                    onClick={() => handleLikeClick(doc._id)}
                    style={{
                      // Conditionally set the color based on whether the item is liked
                      color: likedItems.includes(doc._id) ? "red" : "black",
                    }}
                  >
                    Liked
                  </button>
                </Card>
              ))
            : ""}
        </div>
      </div>

      <div className=" flex justify-center items-center px-30  md:px-[70px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 mb-[20px] lg:grid-cols-3 gap-4 place-content-evenly ">
          {filter == "ascending"
            ? data
                ?.sort((el1, el2) =>
                  el1.name.localeCompare(el2.name, undefined, {
                    numeric: false,
                  })
                )
                .map((doc) => (
                  <Card
                    key={doc._id}
                    rehabId={doc._id}
                    title={doc.name}
                    oldPrice={doc.perDay}
                    newPrice={calculateDiscountedPrice(
                      doc.perDay,
                      doc.discount
                    )}
                    discount={doc.discount}
                    stars={calculateStars(doc.review)}
                    review={doc.review}
                    like={doc?.likes ? doc?.likes : []}
                    background="bg-white"
                  />
                ))
            : filter == "descending"
            ? data
                ?.sort((a, b) => b.name.localeCompare(a.name))
                .map((doc) => (
                  <Card
                    key={doc._id}
                    rehabId={doc._id}
                    title={doc.name}
                    oldPrice={doc.perDay}
                    newPrice={calculateDiscountedPrice(
                      doc.perDay,
                      doc.discount
                    )}
                    discount={doc.discount}
                    like={doc?.likes ? doc?.likes : []}
                    stars={calculateStars(doc.review)}
                    review={doc.review}
                    background="bg-white"
                  />
                ))
            : filter == "high-price"
            ? data
                ?.sort((a, b) => b.perDay - a.perDay)
                .map((doc) => (
                  <Card
                    key={doc._id}
                    rehabId={doc._id}
                    title={doc.name}
                    oldPrice={doc.perDay}
                    like={doc?.likes ? doc?.likes : []}
                    newPrice={calculateDiscountedPrice(
                      doc.perDay,
                      doc.discount
                    )}
                    discount={doc.discount}
                    stars={calculateStars(doc.review)}
                    review={doc.review}
                    background="bg-white"
                  />
                ))
            : filter == "low-price"
            ? data
                ?.sort((a, b) => a.perDay - b.perDay)
                .map((doc) => (
                  <Card
                    key={doc._id}
                    rehabId={doc._id}
                    title={doc.name}
                    oldPrice={doc.perDay}
                    newPrice={calculateDiscountedPrice(
                      doc.perDay,
                      doc.discount
                    )}
                    discount={doc.discount}
                    stars={calculateStars(doc.review)}
                    review={doc.review}
                    like={doc?.likes ? doc?.likes : []}
                    background="bg-white"
                  />
                ))
            : myLoc
            ? data?.map((doc) => (
                <Card
                  key={doc._id}
                  rehabId={doc._id}
                  title={doc.name}
                  like={doc?.likes ? doc?.likes : []}
                  oldPrice={doc.perDay}
                  newPrice={calculateDiscountedPrice(doc.perDay, doc.discount)}
                  discount={doc.discount}
                  stars={calculateStars(doc.review)}
                  review={doc.review}
                  background="bg-white"
                />
              ))
            : data?.map((doc) => (
                <Card
                  key={doc._id}
                  rehabId={doc._id}
                  title={doc.name}
                  oldPrice={doc.perDay}
                  newPrice={calculateDiscountedPrice(doc.perDay, doc.discount)}
                  discount={doc.discount}
                  stars={calculateStars(doc.review)}
                  review={doc.review}
                  like={doc?.likes ? doc?.likes : []}
                  background="bg-white"
                >
                  {/* Add the "liked" button and handle its click event */}
                  <button
                    onClick={() => handleLikeClick(doc._id)}
                    style={{
                      // Conditionally set the color based on whether the item is liked
                      color: likedItems.includes(doc._id) ? "red" : "black",
                    }}
                  >
                    Liked
                  </button>
                </Card>
              ))}
        </div>
      </div>
    </div>
  );
};

export default List;
