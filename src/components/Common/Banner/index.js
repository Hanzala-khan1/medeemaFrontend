import React from 'react'
import img1 from '../../../../public/images/Header.png'
import Image from 'next/image'

const Banner = ({title,subHeading1,subHeading2}) => {
    return (
        <div>
            <div className='bg-[#1A3578C7] h-[200px]'>
                <Image src={img1} className='w-full object-cover   mix-blend-soft-light h-[200px] opacity-75 blur-sm ' alt="header" />
                <div className='relative px-12 -top-[140px] '>
                    <h2 className='text-[25px] md:text-[36px] font-semibold text-white'>{title}</h2>
                    <div className='flex'>
                        <h4 className='text-white text-sm'>{subHeading1}</h4>
                        <h4 className='text-[#CDF27E] text-sm'>-{subHeading2}</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner