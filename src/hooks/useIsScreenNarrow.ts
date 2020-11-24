import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

export function useIsScreenNarrow(): boolean {
  const theme = useTheme();
  const isScreenNarrow = useMediaQuery(theme.breakpoints.down('xs'));
  return isScreenNarrow;
}
