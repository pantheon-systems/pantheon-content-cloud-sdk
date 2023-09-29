export const IconUp = ({
  flip,
  style,
}: {
  flip?: boolean;
  style?: React.CSSProperties;
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      transform={flip ? "scale(1,-1)" : undefined}
      style={style}
    >
      <path
        d="M13 5.39062L14.0312 6.46875L23.0312 15.4688L24.1094 16.5L22 18.6562L20.9219 17.5781L13 9.65625L5.03125 17.5781L4 18.6562L1.84375 16.5L2.92188 15.4688L11.9219 6.46875L13 5.39062Z"
        fill="#23232D"
      />
    </svg>
  );
};
