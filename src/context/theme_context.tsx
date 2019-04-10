import React from 'react';
export const themes = {
  main: {
    primary: '#6cb6f5',
    primaryLight: '#cbe0f2',
    primaryMedium: '#c5e3fc',
    darkgrey: '#47525d',
    colors: {
      primary: '#6cb6f5',
      primaryLight: '#cbe0f2',
      primaryMedium: '#c5e3fc',
      darkgrey: '#47525d',
      text: '#666',
    }
  },
};

export interface ThemeType {
  colors: {
    primary: string
    primaryLight: string
    primaryMedium: string
    darkgrey: string
    text: string
  }
}

const ThemeContext = React.createContext(themes.main);
export default ThemeContext;