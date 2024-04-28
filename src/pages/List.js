import React from 'react'
import List from '@/components/List/List'
import Navbar from '@/components/Common/Navbar/Navbar'
import Footer from '@/components/Common/Footer'
import { useRouter } from 'next/router'

const PhysioList = () => {
    const router = useRouter();
    const { page } = router.query;
    return (
        <>
            {page && (<>
                <Navbar />
                <List UserType={page} />
                <Footer />
            </>
            )
            }
        </>
    )
}

export default PhysioList