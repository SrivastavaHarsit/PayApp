// frontend/src/App.jsx
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';

import  Signup  from './pages/Signup';
import  Signin  from './pages/Signin';
import Dashboard from './pages/Dashboard';
import SendMoney  from './pages/SendMoney';
import RequireAuth from './routes/RequireAuth';


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />}/>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          {/* Authenticated Routes */}
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/send" element={<SendMoney />} />
          </Route>
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/signin" replace />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
