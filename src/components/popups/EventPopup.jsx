import React, { useEffect, useState } from 'react'
import { postData } from '../../utils/api';

function EventPopup({ setShowEventPopup, eventDayTime, setEventDayTime, eventList, setEventList, syncWithGoogle }) {
    const [title, setTitle] = useState("");
    const [tag, setTag] = useState("");

    const isEventOverlapping = (newEvent, existingEvents) => {
        return existingEvents.some(event => {
            const eventStart = new Date(event.startTime).getTime();
            const eventEnd = new Date(event.endTime).getTime();
            const newEventStart = new Date(newEvent.startTime).getTime();
            const newEventEnd = new Date(newEvent.endTime).getTime();
            const isSameDay =
                new Date(event.startTime).toDateString() ===
                new Date(newEvent.startTime).toDateString();
            return (
                isSameDay && (newEventStart < eventEnd && newEventEnd > eventStart)
            );
        });
    };

    const createEvent = async (e) => {
        e.preventDefault();
        const postBody = {
            title,
            tag,
            startTime: eventDayTime.startTime,
            endTime: eventDayTime.endTime,
            sync: syncWithGoogle
        }
        if (isEventOverlapping(postBody, eventList)) {
            alert("The event overlaps with an existing event. Please choose a different time.");
            return;
        }
        const savedEvent = await postData("createEvent", postBody);
        if (savedEvent.error) {
            alert(savedEvent.error);
            return;
        }
        setEventList([...eventList, savedEvent.event])
        setShowEventPopup(false);
    }
    const timeIntervals = Array.from({ length: 24 * 4 }, (_, i) => {
        const hours24 = Math.floor(i / 4);
        const minutes = (i % 4) * 15;
        const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
        const suffix = hours24 < 12 ? "AM" : "PM";
        const date = new Date(eventDayTime.startTime);
        date.setHours(hours24, minutes, 0, 0);

        return {
            dateTime: date,
            displayTime: `${hours12}:${minutes.toString().padStart(2, "0")} ${suffix}`, // Formatted 12-hour time
        };
    });

    return (
        <div className='fixed top-[50%] left-[50%]  translate-x-[-50%] translate-y-[-50%] w-96 z-10 border border-slate-400 bg-white rounded-md py-1 px-2'>
            <form className='flex flex-col gap-6' onSubmit={createEvent}>
                <div className="flex w-full justify-between">
                    <h2 className="font-bold">Add Event</h2>
                    <span className='cursor-pointer font-bold text-xl' onClick={() => setShowEventPopup(false)}>&times;</span>
                </div>
                <div className='flex flex-col gap-1.5'>
                    <label htmlFor="title">Add Title</label>
                    <input id='title' type="text" placeholder='Shvasa Interview' required onChange={(e) => setTitle(e.target.value)} />
                    <label htmlFor="tag">Add tag</label>
                    {/* <input id="tag" type="text" placeholder='Meeting' onChange={(e) => setTag(e.target.value)} /> */}
                    <select id="tag" onChange={(e) => setTag(e.target.value)}>
                        <option value="">Please selected</option>
                        <option value="Important">Important</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Family Event">Family Event</option>
                    </select>
                    <label htmlFor="startTime">Start Time</label>
                    <select
                        id="startTime"
                        required
                        onChange={(e) => setEventDayTime({ ...eventDayTime, startTime: e.target.value, displayStartTime: e.target.selectedOptions[0].dataset.displaytime })}
                        value={eventDayTime.startTime}
                    >
                        {timeIntervals.map((time, index) => (
                            <option key={index} value={time.dateTime} data-displaytime={time.displayTime}>
                                {time.displayTime}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="endTime">End Time</label>
                    <select
                        id="endTime"
                        required
                        onChange={(e) => setEventDayTime({ ...eventDayTime, endTime: e.target.value, displayEndTime: e.target.selectedOptions[0].displaytime })}
                        value={eventDayTime.endTime}
                    >
                        {timeIntervals.map((time, index) => (
                            <option key={index} value={time.dateTime} data-displaytime={time.displayTime}>
                                {time.displayTime}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className='px-2 py-1 bg-blue-500 text-center rounded-md text-white'>
                    Save
                </button>
            </form>
        </div>
    )
}

export default EventPopup
