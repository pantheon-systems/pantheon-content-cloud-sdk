const result = process.versions.node;
const checkNodeVersion = (version) => {
  const versionRegex = new RegExp(`^${version}\\..*`);
  const versionCorrect = result.match(versionRegex);
  if (!versionCorrect) {
    process.stdout.write(
      "\x1b[31m" +
        `ERROR: Running on older Node.js version("${result}"). Please upgrade the Node.js version to "${version}" or higher.\n`,
    );
    process.exit(1);
  }
};
checkNodeVersion(16);
