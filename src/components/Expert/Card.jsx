import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router'; // Import the useRouter hook

const Card = ({ url, specialist, nextPage }) => {
  const router = useRouter(); // Initialize the router

  const handleButtonClick = () => {
    // Use the router to navigate to the specified nextPage
    router.push('/SpecialistPage');
  };

  return (
    <div className='mb-10'>
      <Image src={url} width={200} height={200} className='w-[150px] h-[180px] rounded-t-md object-cover' alt="img" />
      <button className='px-4 w-full bg-[#1A3578] py-2 rounded-b-md text-white' onClick={handleButtonClick}>
        {specialist}
      </button>
    </div>
  );
};

export default Card;
