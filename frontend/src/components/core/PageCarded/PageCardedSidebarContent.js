import { useSelector } from 'react-redux';
import CustomScrollbars from '@/components/core/CustomScrollbars';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { selectContrastMainTheme } from '@/stores/core/settingsSlice';
import clsx from 'clsx';

function PageCardedSidebarContent(props) {
  const theme = useTheme();
  const contrastTheme = useSelector(selectContrastMainTheme(theme.palette.primary.main));

  return (
    <CustomScrollbars enable={props.innerScroll}>
      {props.header && (
        <ThemeProvider theme={contrastTheme}>
          <div
            className={clsx(
              'PageCarded-sidebarHeader',
              props.variant,
              props.sidebarInner && 'PageCarded-sidebarHeaderInnerSidebar'
            )}
          >
            {props.header}
          </div>
        </ThemeProvider>
      )}

      {props.content && <div className="PageCarded-sidebarContent">{props.content}</div>}
    </CustomScrollbars>
  );
}

export default PageCardedSidebarContent;
