import React, { useEffect, useState } from 'react'
import {
    add,
    eachDayOfInterval,
    endOfMonth,
    format,
    getDay,
    isEqual,
    isSameMonth,
    isToday,
    parse,
    startOfToday,
    startOfWeek,
    endOfWeek
} from 'date-fns'
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import EventPopup from '../popups/EventPopup';
import Navbar from '../navbar/Navbar';
import { FaRegUserCircle } from "react-icons/fa";
import { postData } from '../../utils/api';
import { useNavigate, useParams } from 'react-router-dom';

let colStartClasses = [
    '',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
    'col-start-7',
]
const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

const tagStyle = {
    "Important": "bg-red-500",
    "Birthday": "bg-pink-500",
    "Family Event": "bg-green-500"
}

function Calendar() {
    let today = startOfToday();
    let [selectedDay, setSelectedDay] = useState(today)
    let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
    let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())
    const [showEventPopup, setShowEventPopup] = useState(false);
    const [eventDayTime, setEventDayTime] = useState();
    const [currentWeek, setCurrentWeek] = useState(getCurrentWeek(today));
    const [eventList, setEventList] = useState([]);
    const [syncWithGoogle, setSyncWithGoogle] = useState(false);
    const [userList, setUserList] = useState([]);
    const [userSearch, setUserSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState("");
    const params = useParams();
    const navigate = useNavigate();
    let days = eachDayOfInterval({
        start: firstDayCurrentMonth,
        end: endOfMonth(firstDayCurrentMonth),
    })
    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }
    const handleMonthChange = (month) => {
        if (month === "prev") {
            let firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 })
            setCurrentMonth(format(firstDayPrevMonth, 'MMM-yyyy'))
        } else {
            let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
            setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
        }
    }
    const handleTimeSlotClick = (dayItem, hour) => {
        if (selectedUser) {
            alert("You can only create events for yourself.");
            return;
        }
        const startHour = hour % 12 === 0 ? 12 : hour % 12;
        const endHour = (hour + 1) % 24;
        const startSuffix = hour < 12 || hour === 24 ? " AM" : " PM";
        const endSuffix = endHour < 12 || endHour === 24 ? " AM" : " PM";
        const startDateTime = new Date(dayItem.date);
        startDateTime.setHours(hour, 0, 0, 0);
        const endDateTime = new Date(dayItem.date);
        endDateTime.setHours(hour + 1, 0, 0, 0);
        const eventDayTimeObj = {
            startTime: startDateTime,
            endTime: endDateTime,
            displayStartTime: `${startHour}:00${startSuffix}`,
            displayEndTime: `${(endHour % 12 === 0 ? 12 : endHour % 12)}:00${endSuffix}`,
        };
        setEventDayTime(eventDayTimeObj);
        setShowEventPopup(true);
    };
    function getCurrentWeek(date = new Date()) {
        const start = startOfWeek(date, { weekStartsOn: 0 });
        const end = endOfWeek(date, { weekStartsOn: 0 });
        const weekDays = eachDayOfInterval({ start, end });
        return weekDays.map((day) => ({
            date: day,
            formatted: format(day, 'dd'),
            day: format(day, 'EEE'),
        }));
    };

    const fetchAllEvents = async (userId = "") => {
        try {
            const startDate = currentWeek[0].date;
            const endDate = currentWeek[6].date;
            const weekBody = {
                startDate,
                endDate,
                userId
            }
            const weeklyResponse = await postData("getWeeklyEvents", weekBody);
            if (weeklyResponse.error) {
                alert(response.error);
                return;
            }
            setEventList(weeklyResponse.event);
            if (syncWithGoogle && !userId) {
                try {
                    const eventsBody = {
                        startDate,
                        endDate,
                    };
                    const eventsResponse = await postData("events", eventsBody);
                    if (eventsResponse.error) {
                        alert(eventsResponse.error);
                        return;
                    }
                    setEventList((prev) => [
                        ...eventsResponse.map((gevent) => ({
                            id: gevent.id,
                            title: gevent.summary,
                            startTime: gevent.start.dateTime,
                            endTime: gevent.end.dateTime,
                        })),
                        ...prev,
                    ]);
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    useEffect(() => {
        const currWeek = getCurrentWeek(selectedDay);
        if (JSON.stringify(currWeek) != JSON.stringify(currentWeek)) setCurrentWeek(currWeek);
    }, [selectedDay])

    useEffect(() => {
        if (currentWeek.length) fetchAllEvents();
    }, [currentWeek, syncWithGoogle]);

    useEffect(() => {
        const fetchUsers = async () => {

            const users = await postData("users", { userSearch });
            if (users.error) {
                alert(users.error);
                return;
            }
            setUserList(users.data);
        }
        if (userSearch === "" || selectedUser) {
            setUserList([]);
            return;
        }
        const timeout = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => {
            clearTimeout(timeout);
        }
    }, [userSearch])

    useEffect(() => {
        if (selectedUser) {
            fetchAllEvents(selectedUser);
        }
    }, [selectedUser])
    useEffect(() => {
        const googleSync = params.sync;
        if (googleSync == "1" || localStorage.getItem("googleSync")) {
            setSyncWithGoogle(true);
        }
        searchParams.delete("sync");
        navigate({ search: searchParams.toString() }, { replace: true });
    }, [params,navigate]);

    return (
        <>
            <Navbar setSyncWithGoogle={setSyncWithGoogle} syncWithGoogle={syncWithGoogle} />
            <div className="py-16 px-4 flex gap-6">
                <div className="fixed flex flex-col left-4 pt-36 w-[256px] h-full z-10 bg-white">
                    <div className="flex items-center text-sm">
                        <h2 className="flex-auto font-semibold text-gray-900">
                            {format(firstDayCurrentMonth, 'MMMM yyyy')}
                        </h2>
                        <button
                            type="button"
                            onClick={() => handleMonthChange("prev")}
                            className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                        >
                            <span className="sr-only">Previous month</span>
                            <MdOutlineNavigateBefore className="w-5 h-5" aria-hidden="true" />
                        </button>
                        <button
                            onClick={() => handleMonthChange("next")}
                            type="button"
                            className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                        >
                            <span className="sr-only">Next month</span>
                            <MdOutlineNavigateNext className="w-5 h-5" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
                        {weekDays.map((weekDay, index) => (
                            <span className='text-sm' key={index}>{weekDay}</span>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 mt-2 text-sm">
                        {days.map((day, dayIdx) => (
                            <div
                                key={day.toString()}
                                className={classNames(
                                    dayIdx === 0 && colStartClasses[getDay(day)],
                                    'py-1.5 text-sm'
                                )}
                            >
                                <button
                                    type="button"
                                    onClick={() => setSelectedDay(day)}
                                    className={classNames(
                                        isEqual(day, selectedDay) && 'text-white',
                                        !isEqual(day, selectedDay) &&
                                        isToday(day) &&
                                        'text-orange-500',
                                        !isEqual(day, selectedDay) &&
                                        !isToday(day) &&
                                        isSameMonth(day, firstDayCurrentMonth) &&
                                        'text-gray-900',
                                        !isEqual(day, selectedDay) &&
                                        !isToday(day) &&
                                        !isSameMonth(day, firstDayCurrentMonth) &&
                                        'text-gray-400',
                                        isEqual(day, selectedDay) && isToday(day) && 'bg-orange-500',
                                        isEqual(day, selectedDay) &&
                                        !isToday(day) &&
                                        'bg-gray-900',
                                        !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                                        (isEqual(day, selectedDay) || isToday(day)) &&
                                        'font-semibold',
                                        'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                                    )}
                                >
                                    <time dateTime={format(day, 'yyyy-MM-dd')}>
                                        {format(day, 'd')}
                                    </time>
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="mt-2 flex gap-2.5 items-center relative">
                        <FaRegUserCircle className='w-6 h-6' />
                        <input type="text" placeholder='Search a user by email' className='border-none focus:outline-none bg-slate-200 rounded-md px-2 py-1' value={userSearch} onChange={(e) => { setUserSearch(e.target.value); setSelectedUser("") }} />
                        {!!userList.length && <div className='absolute top-8 left-0 bg-white border px-2 py-1 rounded-md'>
                            {userList.map((user) => (
                                <div key={user._id} className='py-1 px-2 hover:bg-slate-200 hover:rounded-md cursor-pointer' onClick={() => { setSelectedUser(user._id); setUserSearch(user.email); setUserList([]) }}>{user.email}</div>
                            ))}
                        </div>}
                    </div>
                </div>
                <div className='flex ml-80 mt-20'>
                    <div className="flex flex-col items-start">
                        <span className="w-20 h-20 text-center">
                        </span>
                        {Array.from({ length: 24 }, (_, i) => (
                            <span key={i} className="w-20 h-20 text-center">
                                {`${i > 12 ? i - 12 : i} ${i < 12 ? "AM" : "PM"}`}
                            </span>
                        ))}
                    </div>
                    <div className="grid grid-cols-[repeat(7,9rem)] flex-1 border-l">
                        {currentWeek.map((dayItem, index) => (
                            <div key={index} className="flex flex-col border-r" >
                                <div className="w-full h-20 text-center font-semibold text-gray-900 flex flex-col">
                                    <p className='w-full'>{dayItem.day}</p>
                                    <p className='w-full'>{dayItem.formatted}</p>
                                </div>
                                {Array.from({ length: 24 }, (_, hour) => (
                                    <div
                                        key={`${dayItem.day}-${hour}`}
                                        className="h-20 border-t flex justify-center items-center hover:bg-gray-200 relative"
                                    >
                                        <button
                                            onClick={() => handleTimeSlotClick(dayItem, hour)}
                                            className="text-sm text-gray-700 w-full h-full"
                                        >
                                            {eventList.map((event) => {
                                                const eventStartHour = new Date(event.startTime).getHours();
                                                const eventEndHour = new Date(event.endTime).getHours();
                                                const eventStartMinutes = new Date(event.startTime).getMinutes();
                                                const eventEndMinutes = new Date(event.endTime).getMinutes();
                                                const isSameDay =
                                                    new Date(event.startTime).toDateString() === new Date(dayItem.date).toDateString();
                                                const isWithinHour =
                                                    isSameDay &&
                                                    ((hour === eventStartHour && eventStartMinutes < 60) ||
                                                        (hour > eventStartHour && hour < eventEndHour) ||
                                                        (hour === eventEndHour && eventEndMinutes > 0));

                                                if (isWithinHour) {
                                                    const startPercentage =
                                                        hour === eventStartHour ? (eventStartMinutes / 60) * 100 : 0;
                                                    const endPercentage =
                                                        hour === eventEndHour ? (eventEndMinutes / 60) * 100 : 100;

                                                    const heightPercentage = endPercentage - startPercentage;
                                                    return (
                                                        <div
                                                            key={event._id || event.id}
                                                            className={`absolute ${event.tag ? tagStyle[event.tag] : (event.createdBy ? 'bg-orange-500' : 'bg-blue-500')} text-white text-xs rounded border border-slate-500`}
                                                            style={{
                                                                top: `${startPercentage}%`,
                                                                height: `${heightPercentage}%`,
                                                                left: '4px',
                                                                right: '4px',
                                                            }}
                                                            title={`${format(new Date(event.startTime), 'hh:mm a')} - ${format(new Date(event.endTime), 'hh:mm a')}`}
                                                        >
                                                            {event.title}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })}

                                        </button>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                {showEventPopup && <EventPopup setShowEventPopup={setShowEventPopup} eventDayTime={eventDayTime} setEventDayTime={setEventDayTime} eventList={eventList} setEventList={setEventList} syncWithGoogle={syncWithGoogle} />}
            </div>
        </>
    )
}

export default Calendar
