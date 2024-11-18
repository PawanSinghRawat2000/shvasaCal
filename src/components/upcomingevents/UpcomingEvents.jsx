import React, { useEffect, useState } from 'react'
import Navbar from '../navbar/Navbar'
import Pagination from '../pagination/Pagination';
import { format } from 'date-fns';
import { postData } from '../../utils/api';

const tagStyle = {
    "Important": "bg-red-500",
    "Birthday": "bg-pink-500",
    "Family Event": "bg-green-500"
}

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};
function UpcomingEvents() {
    const [page, setPage] = useState(1);
    const [eventList, setEventList] = useState([]);
    const [syncWithGoogle, setSyncWithGoogle] = useState(false);
    const [filter, setFilter] = useState(null);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const googleSyncCookie = getCookie("google_sync_token");
        if (googleSyncCookie === "1") {
            setSyncWithGoogle(true);
        } else {
            setSyncWithGoogle(false);
        }
    }, []);

    useEffect(() => {
        const fetchAllUpcomingEvents = async () => {
            try {
                const data = {
                    page,
                    filter
                }
                const events = await postData("getUpcomingEvents", data);
                if (events.error) {
                    alert(events.error);
                    return;
                }
                setEventList(events.events);
                setTotalPages(events.totalPages);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };
        fetchAllUpcomingEvents();
    }, [page, filter])

    return (
        <>
            <Navbar setSyncWithGoogle={setSyncWithGoogle} syncWithGoogle={syncWithGoogle} />
            <div className="py-24 px-4 flex flex-col gap-5 items-center relative">
                <h1 className='text-2xl font-bold'>My upcoming events (In App Only)</h1>
                <div class="flex flex-col gap-2">
                    <div className='flex absolute top-28 right-60 gap-2 items-center'>
                        <p className='text-xl font-semibold'>Filter by:</p>
                        <select onChange={(e) => setFilter(e.target.value)}>
                            <option value="">Please selected</option>
                            <option value="Important">Important</option>
                            <option value="Birthday">Birthday</option>
                            <option value="Family Event">Family Event</option>
                        </select>
                    </div>
                    {eventList.map((event) => (
                        <div
                            className={`flex flex-col items-center space-y-2 p-4 rounded-lg 
                            ${event.tag ? tagStyle[event.tag] : 'bg-orange-500'} 
                            bg-blue-500 text-slate-800 text-sm shadow-lg transition-transform 
                            hover:scale-105 hover:shadow-xl hover:cursor-pointer`}
                        >
                            <span className="font-semibold text-lg">{event.title}</span>
                            <span className="text-sm text-gray-100">{`${format(new Date(event.startTime), 'dd MMM yyyy')}`}</span>
                            <span className="text-sm text-gray-100">{`${format(new Date(event.startTime), 'hh:mm a')} - ${format(new Date(event.endTime), 'hh:mm a')}`}</span>
                        </div>
                    ))}

                </div>
                {!!totalPages && <Pagination totalPages={totalPages} setPage={setPage} />}
            </div>
        </>
    )
}

export default UpcomingEvents
