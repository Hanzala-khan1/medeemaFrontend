import React from 'react'
import Detail from '@/components/Detail/Detail'
import Navbar from '@/components/Common/Navbar/Navbar'
import Footer from '@/components/Common/Footer'
import { useRouter } from 'next/router'

const Booking = () => {
    const router = useRouter();
    const QueryData = router.query;
    return (
        <>
        {QueryData && (
            <>
                <Navbar />
                <Detail  type={QueryData.type} id={QueryData.id} from={QueryData.from} to={QueryData.from}/>
                <Footer />
            </>
        )
        }
        </>
    )
}

export default Booking