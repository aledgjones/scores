export const NotFound = () => {
  return (
    <>
      <div className="not-found">
        <p>
          <span>404</span>
          <span> | </span>
          <span>Not Found</span>
        </p>
      </div>
      <style jsx>{`
        .not-found {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100vw;
          height: 100vh;
        }
      `}</style>
    </>
  );
};
