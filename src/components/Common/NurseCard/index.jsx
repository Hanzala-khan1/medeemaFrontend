import React from 'react';
import Image from 'next/image';
import avatar from '../../../../public/images/avatar.png';
import doctor from '../../../../public/images/doctor.png';
import {AiTwotoneStar} from 'react-icons/ai';
import {FaClinicMedical, FaRegClock} from 'react-icons/fa';
import {useState, useEffect} from 'react';
import logo from '../../../../public/images/home.png';
import {useRouter} from 'next/router';

const NurseCard = ({
  background,
  foreground,
  title,
  oldPrice,
  newPrice,
  url,
  discount,
  stars,
  review,
  experience,
  id,
  name,
  education,
  perDay,
  perHour,
  working,
  years,
  images,
  fees,
  type, // prop for distinguishing between Nurse and Aya data
}) => {
  const [loading, setLoading] = useState(false);
  const [dateFrom,setDateFrom]=useState('');
  const [dateTo,setDateTo]=useState('');
  const router = useRouter();

  var arr = [];
  for (var a = 0; a < stars; a++) {
    arr.push(a);
  }
  useEffect(() => {
    if (arr.length === stars) {
      setLoading(true);
    }
  }, [arr]);

  const handleNavigation = () => {
    if (type === 'aya') {
      // Navigate to aya-detail page
      router.push({pathname:'/aya-detail',query:{id:id,from:dateFrom,to:dateTo}});
    }
    else if (type == 'physio'){
      router.push({pathname:'/physio-detail',query:{id:id,from:dateFrom,to:dateTo}});
    }
     else {
      // Navigate to nurse-detail page
      router.push({pathname:'/nurse-detail',query:{id:id,from:dateFrom,to:dateTo}});
    }
  };

  return (
    <div className="px-4 md:px-0">
      <div
        className={`${
          background ? `bg-${background}` : 'bg-[#F1F6F9]'
        }  grid grid-cols-1 text-black rounded-md grid-rows-[1fr_4fr_1fr] w-full  h-[500px] `}>
        <div className="bg-[#1A3578] h-[65px] rounded-t-md">
          <Image
            src={doctor}
            className="h-full w-full mix-blend-soft-light"
            alt="avatar"
          />
        </div>
        <div className="flex flex-col items-center font-[poppinsregular]  ">
          <div className="flex justify-center -mt-14">
            <Image
              src={images}
              width={100}
              height={100}
              className="h-[90px] w-[90px] rounded-full"
              alt="avatar"
            />
          </div>
          <div>
            <h2 className="text-black text-lg font-semibold mt-4 capitalize font-[barlowregular]">
              {name}
            </h2>
          </div>
          <div>
            <h4 className="text-xs text-[#1A3578] font-medium">
              Experience: {experience}{' '}
            </h4>
          </div>
          <div>
            <h2 className="text-gray-400 text-sm ">Working at {working} </h2>
          </div>
          <div>
            <div className="text-yellow-400 flex items-center ">
              {loading
                ? arr.map((doc, index) => {
                    return <AiTwotoneStar key={index} />;
                  })
                : ''}

              <div className="flex">
                <h2 className="text-black text-base  ml-3">{stars}</h2>
                <h2 className="text-[#777777] ml-1 text-base ">{'(124)'}</h2>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center w-full px-4 font-medium mt-4 ">
            <div className="flex items-center gap-2">
              <div className="text-[#1A3578] text-xl md:text-2xl mb-2 flex justify-start">
                {' '}
                <Image
                  src={logo}
                  alt="home"
                  className="h-6 w-6 object-contain"
                />
              </div>

              <h2 className="text-sm md:text-sm font-[poppinsregular] ">
                Home care service
              </h2>
            </div>
            <div>
              {fees ? (
                <h2 className="text-sm md:text-base">Fee: {fees}</h2>
              ) : (
                <h2 className="text-sm md:text-base">Fee: {perHour}</h2>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between w-full  px-4 mt-4">
            <h2 className="text-sm mb-1">Packeges</h2>
            <div className="flex items-center gap-2">
              <div className="text-[#1A3578]">
                <FaRegClock />
              </div>
              <h2 className="text-sm">45 Minuts</h2>
            </div>
          </div>
          <div className="w-full justify-start px-4">
            <select
              className={`${
                foreground ? `bg-[${foreground}]` : 'bg-white'
              } px-4  pr-8 md:pr-12 text-black text-sm py-2 text-start rounded-md`}>
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </div>
          <div className="w-full">
            <div className="grid grid-cols-2 gap-x-7 self-center grid-row-2 w-full  px-4 text-sm mt-2">
              <div className="  col-span-1">
                <h2>From</h2>
              </div>
              <div className=" col-span-1 ">
                <h2>To</h2>
              </div>
              <div className="col-span-1   ">
                <input
                  type="date"
                  onChange={(e)=>{setDateFrom(e.target.value)}}
                  className={`${
                    foreground ? `bg-[${foreground}]` : 'bg-white'
                  } text-xs py-2 px-1   w-full   rounded-sm`}
                />
              </div>
              <div className="col-span-1  ">
                <input
                  type="date"
                 onChange={(e)=>{setDateTo(e.target.value)}}
                  className={`${
                    foreground ? `bg-[${foreground}]` : 'bg-white'
                  } text-xs py-2 px-1   w-full   rounded-sm`}
                />{' '}
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex justify-center items-center px-4 border-t-2 border-[#9da5b9] border-dashed">
          <button className="bg-[#CDF27E] w-full text-sm font-semibold py-3 rounded-md" onClick={handleNavigation}>
            Book Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default NurseCard;
