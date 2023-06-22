import React, { useState, createContext,  useContext } from 'react';

export const ThemeContext = createContext({
  themeName: 'light',
  toggleTheme: () => {},
});

export default ThemeContext;

export function ThemeController({ children }) {
  const [themeName, setThemeName] = useState('light');


  const toggleTheme = () => {
    const newTheme = themeName === 'light' ? 'dark' : 'light';
    setThemeName(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}