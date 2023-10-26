const nodeVersion = process.versions.node;
const checkNodeVersion = (version) => {
  if (parseInt(nodeVersion) < 16) {
    process.stdout.write(
      "\x1b[31m" +
        `ERROR: Running on older Node.js version("${nodeVersion}"). Please upgrade the Node.js version to "${version}" or higher.\n`,
    );
    process.exit(1);
  }
};
checkNodeVersion(16);
