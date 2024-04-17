"use client";

import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { Club } from "@/lib/types";

type UserData = {
  userID: string;
  fname: string;
  lname: string;
  email: string;
  memberOf: Club[];
  ratings: [];
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
    userID: "",
    fname: "",
    lname: "",
    email: "",
    ratings: [],
    memberOf: [],
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
    userID: "",
    fname: "",
    lname: "",
    email: "",
    ratings: [],
    memberOf: [],
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
