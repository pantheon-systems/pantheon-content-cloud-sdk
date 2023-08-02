interface Props {
  viewFormat: string;
  // eslint-disable-next-line no-unused-vars
  setViewFormat: (format: string) => void;
}

export default ({ viewFormat, setViewFormat }: Props) => (
  <>
    <select value={viewFormat} onChange={(e) => setViewFormat(e.target.value)}>
      <option value="desktop">Desktop</option>
      <option value="mobile">Mobile</option>
    </select>
  </>
);
