import { createContext, useContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Badge, SafeArea, TabBar } from "antd-mobile";
import {
  AppOutline,
  MessageFill,
  MessageOutline,
  UnorderedListOutline,
  UserOutline,
} from "antd-mobile-icons";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import { DashboardPage } from "./routes/dashboard/DashboardPage";
import { EmptyLayout } from "./layouts/EmptyLayout";
import { LoginPage } from "./routes/login/LoginPage";
import { getUserLogin } from "./helper";
import { FoodPage } from "./routes/food/FoodPage";

export interface UserLogin {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface AuthContextType {
  user: UserLogin | null;
  signin: (user: UserLogin, callback: VoidFunction) => void;
  signout: (callback: VoidFunction) => void;
}

export const authProvider = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    authProvider.isAuthenticated = true;
    callback();
  },
  signout(callback: VoidFunction) {
    authProvider.isAuthenticated = false;
    callback();
  },
};
const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => {
  return useContext(AuthContext);
};
const userLogin = await getUserLogin();

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [user, setUser] = useState<UserLogin | null>(userLogin);

  let signin = (newUser: UserLogin, callback: VoidFunction) => {
    return authProvider.signin(() => {
      setUser(newUser);
      callback();
    });
  };

  let signout = (callback: VoidFunction) => {
    return authProvider.signout(() => {
      setUser(null);
      callback();
    });
  };
  let value = { user, signin, signout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function RequireAuth({ children }: { children: JSX.Element }) {
  let auth = useAuth();
  let location = useLocation();

  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route
              index
              element={
                <RequireAuth>
                  <DashboardPage />
                </RequireAuth>
              }
            />
            <Route
              path="foods"
              element={
                <RequireAuth>
                  <FoodPage />
                </RequireAuth>
              }
            />
          </Route>
          <Route path="login" element={<EmptyLayout />}>
            <Route index element={<LoginPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
