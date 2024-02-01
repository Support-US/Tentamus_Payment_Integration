import React, { useEffect, useState } from 'react'
import Confetti from 'react-confetti';



const ConfettiEffect = () => {

    const [windowwith, setWindowWidth] = useState(window.innerWidth)
    const [windowheight, setWindowHeight] = useState(window.innerHeight)

    const handleWindowResize = () => {
        setWindowWidth(window?.innerWidth || 0)
        setWindowHeight(window?.innerWidth || 0)
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowResize)
        document.body.style.overflow = 'hidden'

        return () => {
            window.removeEventListener('resize', handleWindowResize)
            document.body.style.overflow = 'auto'
        }
    }, [])


    

    return (
        <>
            <Confetti
                width={windowwith}
                height={windowheight}
                recycle={false}
                numberOfPieces={300}
            />

        </>
    )
}

export default ConfettiEffect;