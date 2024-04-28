import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Import the Link component

const Card = ({ url, specialist, href }) => {
  return (
    <div className="mb-10">
      <Link href={href}>
        {/* Wrap the card content with the Link component */}
        <a>
          <Image src={url} width={200} height={200} className="w-[150px] h-[180px] rounded-t-md object-cover" alt="img" />
          <button className="px-4 w-full bg-[#1A3578] py-2 rounded-b-md text-white">{specialist}</button>
        </a>
      </Link>
    </div>
  );
};

export default Card;
