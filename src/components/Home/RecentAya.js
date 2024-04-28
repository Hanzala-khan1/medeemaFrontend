import React from 'react'
import NurseCard from '../Common/NurseCard';
import avatar from '../../../public/images/avatar.png'
import { useState, useEffect } from 'react';
import { db } from '@/firebase';

import { getDocs, collection, doc, query, limit } from 'firebase/firestore';
import { RevealWrapper } from 'next-reveal';
const RecentAya = () => {

  const [aya, setAya] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAya = async () => {
      try {
        const q = query(collection(db, 'aya'), limit(3));
        const querySnapshot = await getDocs(q);
        const dataArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        // console.log('Fetched Ayas:', dataArray); // working here!
        setAya(dataArray);
      } catch (error) {
        console.log('Error fetching data: ', error);
        setError('Error fetching data. Please try again later.');
      }
    };

    fetchAya();
  }, []);

  const data = [
    {
      title: "Lorem ipsum",
      url: avatar,
      oldPrice: "$14.00",
      discount: '5%',
      newPrice: "$14.00",
      stars: 5,
      review: 240,
      experience: "Bachelor's in Nursing /10 Years Experience "
    },
    {
      title: "Lorem ipsum",
      url: avatar,
      oldPrice: "$14.00",
      discount: '5%',
      newPrice: "$14.00",
      stars: 4,
      review: 240,
      experience: "Bachelor's in Nursing /10 Years Experience "
    },
    {
      title: "Lorem ipsum",
      url: avatar,
      oldPrice: "$14.00",
      discount: '5%',
      newPrice: "$14.00",
      stars: 5,
      review: 240,
      experience: "Bachelor's in Nursing /10 Years Experience "
    }

  ]
  if (aya.length === 0) {
    return <></>;
  }
  return (
    <div>
      <h1 className='text-[#1A3578] text-2xl text-center md:text-start md:text-3xl font-semibold'>
        Recently Viewed Aya Care
      </h1>
      <div className='md:w-[50%] mb-4'>
        <h4 className='text-center md:text-start text-sm mt-2 mb-8 text-[#777777]'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </h4>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-content-evenly'>
        {aya.length > 0 ? (
          aya.map(nurse => {
            if (nurse?.ref === '') {
              return <></>;
            }
            return (
              <RevealWrapper
                rotate={{ x: 0, y: 0, z: 0 }}
                origin='left'
                delay={200}
                duration={900}
                distance='200px'
                reset={true}
                viewOffset={{ top: 0, right: 0, bottom: 0, left: 0 }}
                key={nurse?.id}
              >
                <NurseCard
                  key={nurse?.id}
                  id={nurse?.id}
                  address={nurse?.address}
                  details={nurse?.details}
                  discount={nurse?.discount}
                  education={nurse.education}
                  email={nurse?.email}
                  experience={nurse?.experience}
                  fees={nurse?.perDay}
                  gender={nurse?.gender}
                  images={nurse?.images?.url}
                  name={nurse?.name}
                  phone={nurse?.phone}
                  working={nurse?.workingAt}
                  recentWorkPlace={nurse?.recentWorkPlace}
                  type='aya' // if data is for aya
                />
              </RevealWrapper>
            );
          })
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
    </div>

  )
}

export default RecentAya