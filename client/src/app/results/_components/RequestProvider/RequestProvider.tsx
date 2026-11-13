"use client";

import { createContext, useContext, useState } from "react";

type RequestContextValue = {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
};

const RequestContext = createContext<RequestContextValue | null>(null);

type ProviderProps = {
  initialText: string;
  children: React.ReactNode;
};

export const RequestProvider: React.FC<ProviderProps> = ({
  initialText,
  children,
}) => {
  const [text, setText] = useState<string>(initialText);

  return (
    <RequestContext.Provider value={{ text, setText }}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequestText = () => {
  const value = useContext(RequestContext);

  if (!value)
    throw new Error("useRequestText must be used inside RequestProvider");

  return value;
};
