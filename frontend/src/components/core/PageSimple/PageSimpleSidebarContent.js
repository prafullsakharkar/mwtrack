import { useSelector } from 'react-redux';
import CustomScrollbars from '@/components/core/CustomScrollbars';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { selectContrastMainTheme } from '@/stores/core/settingsSlice';
import clsx from 'clsx';

function PageSimpleSidebarContent(props) {
  const theme = useTheme();
  const contrastTheme = useSelector(selectContrastMainTheme(theme.palette.primary.main));

  return (
    <CustomScrollbars enable={props.innerScroll}>
      {props.header && (
        <ThemeProvider theme={contrastTheme}>
          <div className={clsx('PageSimple-sidebarHeader', props.variant)}>{props.header}</div>
        </ThemeProvider>
      )}

      {props.content && <div className="PageSimple-sidebarContent">{props.content}</div>}
    </CustomScrollbars>
  );
}

export default PageSimpleSidebarContent;
