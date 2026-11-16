import React from 'react';
import Navbar from '../homepage/Navbar';


const RootLayout = ({children}: LayoutProps<"/">) => {
    return (
        <div>
            <Navbar/>
            
            {children}
        </div>
    );
};

export default RootLayout;