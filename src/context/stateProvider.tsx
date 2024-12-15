"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface StateContextType {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  zoom: boolean;
  setZoom: React.Dispatch<React.SetStateAction<boolean>>;
  lessonID: string;
  setLessonID: React.Dispatch<React.SetStateAction<string>>;
  lesson: Lesson | undefined; // Allow lesson to be undefined
  setLesson: React.Dispatch<React.SetStateAction<Lesson | undefined>>; // Match the type with the state
}

const StateContext = createContext<StateContextType | undefined>(undefined);

interface StateProviderProps {
  children: ReactNode;
}

export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<string>("white");
  const [color, setColor] = useState<string>("black");
  const [zoom, setZoom] = useState<boolean>(false);
  const [lessonID, setLessonID] = useState<string>("");

  const state: StateContextType = {
    theme,
    setTheme,
    zoom,
    setZoom,
    color,
    setColor,
    lessonID,
    setLessonID,
  };

  return (
    <StateContext.Provider value={state}>{children}</StateContext.Provider>
  );
};

export const useStateValue = (): StateContextType => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateValue must be used within a StateProvider");
  }
  return context;
};
