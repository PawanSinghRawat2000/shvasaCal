import { BrowserRouter, Route, Routes } from "react-router-dom"
import Calendar from "./components/calendar/Calendar"
import Auth from "./components/auth/Auth"
import Protected from "./components/protected/Protected"
import UpcomingEvents from "./components/upcomingevents/UpcomingEvents"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/calendar" element={<Protected>
            <Calendar />
          </Protected>} />
          <Route path="/login" element={<Auth />} />
          <Route path="/upcoming-events" element={<UpcomingEvents />} />
          <Route path="*" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
