import React from 'react';
import Navbar from '../homepage/Navbar';


const RootLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div>
            <Navbar/>
            
            {children}
        </div>
    );
};

export default RootLayout;