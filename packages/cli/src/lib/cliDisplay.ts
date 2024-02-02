import { Console } from "console";
import { Transform } from "stream";

export function printTable(
  input: { [key: string]: string | number | boolean }[],
) {
  if (input.length === 0) return;

  // Adding space padding at the end. console.table doesn't handle it out of the box.
  const columnPaddings = Object.keys(input[0]).reduce(
    (prev: { [key: string]: number }, curr) => {
      prev[curr] = curr.toString().length;
      return prev;
    },
    {},
  );
  input.forEach((row) => {
    Object.keys(columnPaddings).forEach((column) => {
      if (row[column].toString().length > columnPaddings[column])
        columnPaddings[column] = row[column].toString().length;
    });
  });

  const inputWithPaddings: { [key: string]: string | number }[] = [];
  input.forEach((row) => {
    inputWithPaddings.push(
      Object.keys(columnPaddings).reduce(
        (prev: { [key: string]: string }, curr) => {
          const formattedValue =
            typeof row[curr] === "boolean"
              ? row[curr]
                ? "✅"
                : "❌"
              : row[curr].toString();

          prev[curr] = formattedValue.padEnd(columnPaddings[curr]);
          return prev;
        },
        {},
      ),
    );
  });

  // Starting formatting input into table
  const ts = new Transform({
    transform(chunk, enc, cb) {
      cb(null, chunk);
    },
  });
  const logger = new Console({ stdout: ts });
  logger.table(inputWithPaddings);
  const table = (ts.read() || "").toString();
  let result = "";
  for (const row of table.split(/[\r\n]+/)) {
    let r = row.replace(/[^┬]*┬/, "┌");
    r = r.replace(/^├─*┼/, "├");
    r = r.replace(/│[^│]*/, "");
    r = r.replace(/^└─*┴/, "└");
    r = r.replace(/'/g, " ");
    result += `${r}\n`;
  }
  console.log(result);
}
