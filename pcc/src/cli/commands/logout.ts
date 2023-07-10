import ora from 'ora';
import { rmSync, existsSync } from 'fs';
import { AUTH_FILE_PATH } from '../../lib/localStorage';

function logout() {
  const fetchStarter = ora('Logging you out...').start();
  if (existsSync(AUTH_FILE_PATH)) rmSync(AUTH_FILE_PATH);

  fetchStarter.succeed('Successfully logged you out from PPC client!');
}

export default logout;
