"use client";

import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

type UserData = {
  fname: string;
  lname: string;
  email: string;
};

interface ContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  data: UserData;
  setData: Dispatch<SetStateAction<UserData>>;
}

const GlobalContext = createContext<ContextProps>({
  isLoggedIn: false,
  setIsLoggedIn: (): boolean => false,
  data: {
    fname: "",
    lname: "",
    email: "",
  },
  setData: (): UserData[] => [],
});

export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [data, setData] = useState<UserData>({
    fname: "",
    lname: "",
    email: "",
  });

  return (
    <GlobalContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, data, setData }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
