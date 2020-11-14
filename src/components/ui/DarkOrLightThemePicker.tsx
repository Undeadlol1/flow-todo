import React, { memo } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import { useDispatch, useSelector } from 'react-redux';
import { uiSelector } from '../../store/selectors';
import { useTypedTranslate } from '../../services/index';
import { setColorScheme, UiColorScheme } from '../../store/uiSlice';

const DarkOrLightThemePicker = () => {
  const t = useTypedTranslate();
  const dispatch = useDispatch();
  const uiState = useSelector(uiSelector);

  function setTheme(
    event: React.ChangeEvent<{
      value: unknown;
      name?: string | undefined;
    }>,
  ) {
    dispatch(setColorScheme(event.target.value as UiColorScheme));
  }

  return (
    <Card>
      <CardContent>
        <FormControl fullWidth>
          <InputLabel id="theme-selector">
            {t('select_theme')}
          </InputLabel>
          <Select
            labelId="theme-selector"
            value={uiState.preferedColorScheme}
            onChange={setTheme}
          >
            <MenuItem value="dark">{t('select_theme_dark')}</MenuItem>
            <MenuItem value="light">
              {t('select_theme_light')}
            </MenuItem>
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  );
};

export default memo(DarkOrLightThemePicker);
