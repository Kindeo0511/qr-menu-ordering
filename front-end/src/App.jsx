import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import Login_Page from "./pages/login_page";
import AdminDashboard from "./pages/admin_dashboard";
import OrderMenuPage from "./pages/order_menu_page";
import KitchenPage from "./pages/kitchen_page";
import CashierPage from "./pages/cashier_page";
import { Routes, Route } from "react-router-dom";
import { GetCurrentUser } from "./services/user_service";
// import { RefreshToken } from "./auth/user_auth";
import { AuthProvider } from "./auth/user_auth";
function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState("");

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Login_Page
                setAccessToken={setAccessToken}
                setUser={setUser}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={showPassword}
              />
            }
          />
          <Route
            path="/admin-dashboard"
            element={<AdminDashboard username={username} />}
          />
          <Route path="/menu/:tableId" element={<OrderMenuPage />} />
          <Route path="/secret-kitchen/" element={<KitchenPage />} />
          <Route
            path="/secret-cashier/"
            element={<CashierPage user={user} />}
          />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
