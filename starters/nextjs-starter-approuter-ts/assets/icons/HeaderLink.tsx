interface Props {
  height: number;
  width: number;
  fill?: string;
}
export default function HeaderLink({ height, width, fill }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      width={width}
      fill={fill}
      viewBox="0 0 576 512"
    >
      <path d="M0 256C0 167.6 71.6 96 160 96h64c17.7 0 32 14.3 32 32s-14.3 32-32 32H160c-53 0-96 43-96 96s43 96 96 96h64c17.7 0 32 14.3 32 32s-14.3 32-32 32H160C71.6 416 0 344.4 0 256zm576 0c0 88.4-71.6 160-160 160H352c-17.7 0-32-14.3-32-32s14.3-32 32-32h64c53 0 96-43 96-96s-43-96-96-96H352c-17.7 0-32-14.3-32-32s14.3-32 32-32h64c88.4 0 160 71.6 160 160zM192 224H384c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-17.7 0-32-14.3-32-32s14.3-32 32-32z"></path>
    </svg>
  );
}
