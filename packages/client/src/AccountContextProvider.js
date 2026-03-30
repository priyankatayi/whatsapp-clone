import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountContext = createContext();

export const useAccountContext = () => useContext(AccountContext);

const AccountContextProvider = ({ children }) => {
  const [loggedIn, setIsLoggedIn] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const checkUser = async () => {
      const res = await fetch(
        "https://whatsapp-clone-server-1rbm.onrender.com/auth/login",
        {
          credentials: "include",
        },
      );
      const val = await res.json();
      setIsLoggedIn(val.loggedIn);
      if (val.loggedIn) {
        navigate("/home");
      }
    };
    checkUser();
  }, [navigate]);
  return (
    <AccountContext.Provider value={{ loggedIn, setIsLoggedIn }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContextProvider;
