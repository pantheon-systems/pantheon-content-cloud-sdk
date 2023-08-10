interface Props {
  viewFormat: string;
  setViewFormat: (format: string) => void;
}

export default function ViewFormatChooser({
  viewFormat,
  setViewFormat,
}: Props) {
  return (
    <select value={viewFormat} onChange={(e) => setViewFormat(e.target.value)}>
      <option value="desktop">Desktop</option>
      <option value="mobile">Mobile</option>
    </select>
  );
}
