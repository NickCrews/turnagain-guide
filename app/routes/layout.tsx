export default function RoutesLayout(props: {
    children: React.ReactNode;
    detail: React.ReactNode;
  }) {
    return (
      // this is the height of the header, I cant figure out a way to get it to
      // work out without hardcoding it.
      <div className="h-[calc(100dvh-4rem)]">
          {props.children}
          {props.detail}
          <div id="modal-root" />
      </div>
    );
  }