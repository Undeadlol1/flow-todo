import React, { FunctionComponent } from 'react';
import {
  ThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import i18n from 'i18next';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useSelector } from 'react-redux';
import { uiSelector } from './store/selectors';
import { ruRU, enUS } from '@material-ui/core/locale/';

export const Theme: FunctionComponent<{}> = ({ children }) => {
  const uiState = useSelector(uiSelector);
  const { language } = i18n;
  const theme = React.useMemo(
    () =>
      createMuiTheme(
        {
          palette: {
            primary: { main: '#81D4FA' },
            secondary: {
              main: '#00838F',
              contrastText: '#ffffff',
            },
            type: uiState.preferedColorScheme,
          },
        },
        // @ts-ignore
        { ru: ruRU, en: enUS }[language],
      ),
    [language, uiState.preferedColorScheme],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
