import React from 'react';
import Navbar from '../homepage/Navbar';
import Banner from '../homepage/Banner';

const RootLayout = ({children}: LayoutProps<"/">) => {
    return (
        <div>
            <Navbar/>
            
            {children}
        </div>
    );
};

export default RootLayout;