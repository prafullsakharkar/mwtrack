import { styled } from '@mui/material/styles';
import PageSimple from '@/components/core/PageSimple';
import DemoContent from '@/components/core/DemoContent';

const Root = styled(PageSimple)(({ theme }) => ({
  '& .PageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
  },
  '& .PageSimple-toolbar': {},
  '& .PageSimple-content': {},
  '& .PageSimple-sidebarHeader': {},
  '& .PageSimple-sidebarContent': {},
}));

function ExamplePage(props) {
  return (
    <Root
      header={
        <div className="p-24">
          <h4>Example Page</h4>
        </div>
      }
      content={
        <div className="p-24">
          <h4>Content</h4>
          <br />
          <DemoContent />
        </div>
      }
      scroll="content"
    />
  );
}

export default ExamplePage;
