import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getData } from '../../utils/api';

function Navbar({ syncWithGoogle,setSyncWithGoogle}) {
    const navigate = useNavigate();
    const handleLogout = async()=>{
        const response = await getData("logout");
        if(response.error){
            alert(response.error);
            return;
        }
        localStorage.removeItem('user');
        navigate('/login');
    }
    const handleSignIn = async() => {
        const response = await getData("googleAuth");
        if(response.redirectUrl){
            window.location.href = response.redirectUrl;
        } else {
            localStorage.setItem("googleSync", 1);
            setSyncWithGoogle(true);
        }
    }
    const handleSignout=()=>{
        localStorage.removeItem("googleSync");
        setSyncWithGoogle(false);
    }
    return (
        <nav className="fixed top-0 left-0 w-screen bg-gray-800 z-10">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="absolute -inset-0.5"></span>
                            <span className="sr-only">Open main menu</span>

                            <svg className="block size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                            <svg className="hidden size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <Link to="/calendar" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Calendar</Link>
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <Link to="/upcoming-events" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Upcoming Events</Link>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <div className="relative ml-3">
                            <div>
                                <button type="button" className="flex rounded-full bg-orange-600 text-sm focus:outline-none px-3 py-2 text-white" onClick={syncWithGoogle?handleSignout:handleSignIn}>
                                    {syncWithGoogle?"Stop google Sync":"Sync with google"}
                                </button>
                            </div>
                        </div>

                        <div className="relative ml-3">
                            <div>
                                <button type="button" className="flex rounded-full bg-orange-600 text-sm focus:outline-none px-3 py-2 text-white" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

    )
}

export default Navbar
