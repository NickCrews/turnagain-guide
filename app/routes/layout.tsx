export default function RoutesLayout(props: {
    children: React.ReactNode;
    detail: React.ReactNode;
  }) {
    return (
      <>
          {props.children}
          {props.detail}
          <div id="modal-root" />
      </>
    );
  }