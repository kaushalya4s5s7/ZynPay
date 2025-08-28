"use client"

import React, { useEffect } from 'react'
import useFullPageLoader from '@/hooks/usePageLoader'
import Loader from '@/components/ui/loader'
import { motion, AnimatePresence } from 'framer-motion'
import Home from '@/app/pages/Home'; // Assuming Hero is the component exported from '@/pages/Home'


const LandingPage = () => {
    const [isSplashscreenVisible, setSplashscreenVisible] = React.useState(false);
    const [isFirstLoad, setIsFirstLoad] = React.useState(true);

    useEffect(() => {
        const hasSeenSplash = localStorage.getItem('hasSeenSplash') === 'true';
        if (!hasSeenSplash) {
            setSplashscreenVisible(false);
            localStorage.setItem('hasSeenSplash', 'true');
        } else {
            setSplashscreenVisible(false);
        }
        setIsFirstLoad(false);
    }, []);

    const handleShowSplash = () => {
        setSplashscreenVisible(false);
    };

    if (isFirstLoad) return null;

    return (
        <>
            
                    <motion.div
                        key="home-content"
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: 1,
                            transition: {
                                duration: 0.8,
                                ease: "easeInOut",
                                delay: 0.2
                            }
                        }}
                        className="bg-transparent"
                    >
                        <Home  />
                    </motion.div>
             
        </>
    );
};

const Landing = useFullPageLoader(LandingPage, <Loader />);

export default Landing;