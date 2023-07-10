import { Console } from 'console';
import { Transform } from 'stream';

export function printTable(input: {}[]) {
  const ts = new Transform({
    transform(chunk, enc, cb) {
      cb(null, chunk);
    },
  });
  const logger = new Console({ stdout: ts });
  logger.table(input);
  const table = (ts.read() || '').toString();
  let result = '';
  for (let row of table.split(/[\r\n]+/)) {
    let r = row.replace(/[^┬]*┬/, '┌');
    r = r.replace(/^├─*┼/, '├');
    r = r.replace(/│[^│]*/, '');
    r = r.replace(/^└─*┴/, '└');
    r = r.replace(/'/g, ' ');
    result += `${r}\n`;
  }
  console.log(result);
}
