import React, { FunctionComponent } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import i18n from 'i18next';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useSelector } from 'react-redux';
import { ruRU, enUS } from '@material-ui/core/locale/';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { uiSelector } from './store/selectors';

export const Theme: FunctionComponent<{
  isMobile?: boolean;
}> = React.memo(({ isMobile, children }) => {
  const uiState = useSelector(uiSelector);
  const { language } = i18n;
  const theme = React.useMemo(
    () => createMuiTheme(
        {
          zIndex: {
            /*
              On mobile devices snacbkar has bottom margin.
              This margin overlaps FAB and makes it unusable.
            */
            snackbar: 0,
          },
          palette: {
            primary: { main: '#81D4FA' },
            secondary: {
              main: '#00838F',
              contrastText: '#ffffff',
            },
            type: uiState.preferedColorScheme,
          },
          props: isMobile
            ? {
                MuiSnackbar: {
                  anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                  },
                },
              }
            : {},
          overrides: isMobile
            ? {
                MuiSnackbar: {
                  root: {
                    // Prevent snackbar from overflowing FAB.
                    marginBottom: 90,
                  },
                },
                MuiIconButton: {
                  sizeSmall: {
                    // Adjust spacing to reach minimal touch target hitbox
                    marginLeft: 4,
                    marginRight: 4,
                    padding: 12,
                  },
                },
              }
            : {},
        },
        // @ts-ignore
        { ru: ruRU, en: enUS }[language],
      ),
    [language, uiState.preferedColorScheme, isMobile],
  );
  // Make font sizes responsive
  // @ts-ignore
  theme.typography.h1 = {
    fontSize: '2.4rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '3rem',
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
});
