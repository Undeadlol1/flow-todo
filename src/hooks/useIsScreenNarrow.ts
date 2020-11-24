import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export function useIsScreenNarrow(): boolean {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('xs'));
}
