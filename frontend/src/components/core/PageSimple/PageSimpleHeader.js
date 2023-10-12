import clsx from 'clsx';

function PageSimpleHeader(props) {
  return (
    <div className={clsx('PageSimple-header', props.className)}>
      <div className="container">{props.header && props.header}</div>
    </div>
  );
}

export default PageSimpleHeader;
