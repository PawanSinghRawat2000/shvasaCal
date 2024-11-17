import { BrowserRouter, Route, Routes } from "react-router-dom"
import Calendar from "./components/calendar/Calendar"
import Auth from "./components/auth/Auth"
import GoogleRedirect from "./components/redirectComponent/GoogleRedirect"
import Protected from "./components/protected/Protected"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/calendar" element={<Protected>
            <Calendar />
          </Protected>} />
          <Route path="/login" element={<Auth />} />
          <Route path="/googlecallback" element={<GoogleRedirect />} />
          <Route path="*" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
