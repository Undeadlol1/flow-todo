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

export const Theme: FunctionComponent<{
  isMobile?: boolean;
}> = React.memo(({ isMobile, children }) => {
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
          props: isMobile
            ? {
                MuiButton: {
                  size: 'small',
                },
                MuiFilledInput: {
                  margin: 'dense',
                },
                MuiFormControl: {
                  margin: 'dense',
                },
                MuiFormHelperText: {
                  margin: 'dense',
                },
                MuiIconButton: {
                  size: 'small',
                },
                MuiInputBase: {
                  margin: 'dense',
                },
                MuiInputLabel: {
                  margin: 'dense',
                },
                MuiListItem: {
                  dense: true,
                },
                MuiOutlinedInput: {
                  margin: 'dense',
                },
                MuiFab: {
                  size: 'small',
                },
                MuiTable: {
                  size: 'small',
                },
                MuiTextField: {
                  margin: 'dense',
                },
                MuiToolbar: {
                  variant: 'dense',
                },
              }
            : {},
          overrides: isMobile
            ? {
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
