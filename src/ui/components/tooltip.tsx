const Tooltip = ({ children, text }) => {
  return (
    <>
      <div className="tooltip-container">
        <div className="tooltip-box">{text}</div>
        <div>{children}</div>
      </div>
      <style jsx>{`
        .tooltip-container {
          position: relative;
        }

        .tooltip-box {
          position: absolute;
          background: rgba(97, 97, 97, 0.9);
          color: #fff;
          padding: 5px 12px;
          border-radius: 20px;
          top: calc(100% + 5px);
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          font-size: 14px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .tooltip-container:hover .tooltip-box,
        .tooltip-container:focus .tooltip-box {
          opacity: 1;
        }
      `}</style>
    </>
  );
};

export default Tooltip;
