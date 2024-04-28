import React from 'react';
import Image from 'next/image';
import avatar from '../../../../public/images/avatar.png';
import doctor from '../../../../public/images/doctor.png';
import { AiFillDelete, AiTwotoneStar } from 'react-icons/ai';
import { FaClinicMedical, FaRegClock, FaStethoscope } from 'react-icons/fa';
import logo from '../../../../public/images/home.png';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { AddRemoveFavourite } from '@/services';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const RehabCard = ({
    UserType,
    stars,
    experience,
    id,
    name,
    description,
    education,
    fees,
    workingAt,
    alt,
    images,
}) => {
    const [loading, setLoading] = useState(false);
    const [dateFrom, setDateFrom] = useState('')
    const [btnLoading, setbtnLoading] = useState(false);
    let isFavourite = false;
    const [dateTo, setDateTo] = useState('')
    const router = useRouter()
    const MySwal = withReactContent(Swal);

    var arr = [];
    for (var a = 0; a < stars; a++) {
        arr.push(a);
    }
    useEffect(() => {
        if (arr.length === stars) {
            setLoading(true);
        }
    }, [arr]);
    let handleLike = () => {
        try {
            let is_rehab;
            if (UserType == "Rehabilitation Care") {
                is_rehab = true
            } else {
                is_rehab = false
            }
            let params = {
                is_add_rehab: is_rehab,
                type: UserType,
                category: UserType,
                rehab_id: is_rehab ? id : null,
                user_id: is_rehab ? null : id,
            }
            MySwal.showLoading();
            AddRemoveFavourite(params)
                .then((res) => {
                    console.log("resdata...........", res.data)
                    if (res.data.added) {
                        MySwal.fire({
                            icon: "success",
                            text: " Successfull",
                        });
                    }
                })
                .catch((err) => {
                    console.log("send error.nnnnn..", err);
                    MySwal.fire({
                        icon: "error",
                        // title: 'Oops...',
                        text: err?.response?.data?.message,
                    });
                })
                .finally(() => {
                    MySwal.hideLoading();
                });
        } catch (error) {
            MySwal.fire({
                icon: "error",
                // title: 'Oops...',
                text: error?.response?.data?.message,
            });
        }
    };
    return (
        <div>
            <div className="bg-[#a2a4a] grid grid-cols-1 font-[poppinsregular] text-black rounded-md grid-rows-[1fr_4fr_1fr]  gap-y-2 h-[520px] ">
                <div className="bg-[#1A3578] rounded-t-md">
                    <Image
                        src={doctor}
                        className="h-full w-full mix-blend-soft-light"
                        alt="avatar"
                    />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="flex justify-center -mt-12">
                        <Image
                            src={images}
                            width={100}
                            height={100}
                            className="h-[80px] w-[80px] rounded-full"
                            alt={alt}
                        />
                    </div>
                    <div>
                        <h2 className="text-black text-xl font-semibold font-[barlowregular]">
                            {name}
                        </h2>
                    </div>
                    <div>
                        <h2 className="text-[#777777]">{description}</h2>
                    </div>
                    {/* <div>
            <h4 className="text-xs text-[#1A3578] font-semibold">
              {education} / {experience} Years Experience{' '}
            </h4>
          </div> */}
                    {/* <div>
            <h2 className="text-[#777777]">Working at {workingAt} Hospital</h2>
          </div> */}
                    <div>
                        <div className="text-yellow-400 flex items-center ">
                            {loading
                                ? arr.map((doc, index) => {
                                    return <AiTwotoneStar key={index} />;
                                })
                                : ''}

                            <div className="flex">
                                <h2 className="text-black text-lg ml-3">4.9</h2>
                                <h2 className="text-[#777777] ml-1 text-lg">{'(124)'}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between  gap-16 w-full px-2 ">
                        <div className="flex items-center px-2 gap-2">
                            <div className="text-[#1A3578] text-2xl">
                                {' '}
                                <FaStethoscope />
                            </div>

                            <h2 className="text-xs">Clinic care service</h2>
                        </div>

                        <div className="flex items-center  gap-2">
                            <div className="text-[#1A3578] text-xl md:text-2xl mb-2 flex justify-start">
                                {' '}
                                <Image
                                    src={logo}
                                    alt="home"
                                    className="h-10 w-10 object-contain"
                                />
                            </div>
                            <h2 className="text-xs">Home care service</h2>
                        </div>
                    </div>
                    <div className="flex items-center justify-between w-full px-4">
                        <h2>Packeges</h2>
                        <div className="flex items-center gap-2 mr-7">
                            <div className="text-[#1A3578] text-2xl">
                                <FaRegClock />
                            </div>
                            <h2 className="text-xs mr-2">45 Minuts</h2>
                        </div>
                    </div>
                    <div className="w-full flex justify-between  px-4">
                        <select className="bg-[#F1F6F9] text-sm px-6 text-black py-1 text-start rounded-md">
                            <option>perDay</option>
                            <option>perHour</option>
                        </select>
                        <div>
                            {' '}
                            <h2 className="text-xs mr-4 mt-4">Fee: ${fees}</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 grid-row-2 w-full px-3 gap-2">
                        <div>
                            <h2>From</h2>
                        </div>
                        <div>
                            <h2>To</h2>
                        </div>
                        {/* <div>
              <input
                type="date"
                className="bg-[#F1F6F9] text-sm w-full px-1 py-1 rounded-sm"
                onChange={(e)=>{setDateFrom(e.target.value)}}
              />
            </div>
            <div>
              <input
                type="date"
                className="bg-[#F1F6F9] text-sm w-full px-1 py-1 rounded-sm"
                onChange={(e)=>{setDateTo(e.target.value)}}
              />
            </div> */}
                        <div></div>
                    </div>
                </div>

                <div className="flex justify-center items-center px-4 border-t-2 border-dashed">
                    <Link href={{
                        pathname: `/booking`,
                        query: {
                            id: id,
                            from: dateFrom,
                            to: dateTo,
                            type: UserType
                        }
                    }
                    }>
                        <button className="bg-[#CDF27E] w-full py-2 rounded-md" style={{ width: "340px" }}>
                            Book Page
                        </button>
                    </Link>

                    <button
                        className=" flex justify-center items-center border-2 rounded"
                        style={{
                            width: "50px",
                            background: "none"
                        }}
                        onClick={() => handleLike()}
                    >
                        {router.pathname == "/save-rehab" ? (
                            <span className="text-red-500 text-lg flex space-x-6 ">
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
        </div>
    );
}

export default RehabCard;
