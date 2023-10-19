import clsx from 'clsx';

function PageCardedHeader(props) {
  return (
    <div className={clsx('PageCarded-header', 'container')}>{props.header && props.header}</div>
  );
}

export default PageCardedHeader;
