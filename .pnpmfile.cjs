const fs = require("fs");
const path = require("path");

/**
 * This pnpm install hook links all packages in the monorepo to their local versions.
 * This allows us to use published version numbers in package.json files, while still
 * depending on the local version of the package when inside the monorepo.
 */
const monorepoRoot = findMonorepoRoot(process.cwd());
const workspacePackageDirectories = [
  "packages",
  "starters",
  "configs",
  "local_testing",
];
const workspacePackages = new Map();

workspacePackageDirectories.forEach((workspacePackageDir) => {
  const allDirs = fs.readdirSync(path.join(monorepoRoot, workspacePackageDir));
  allDirs
    .filter((dir) => {
      return fs
        .statSync(path.join(monorepoRoot, workspacePackageDir, dir))
        .isDirectory();
    })
    .forEach((dir) => {
      const pkgPath = path.join(monorepoRoot, workspacePackageDir, dir);
      const pkgName = require(path.join(pkgPath, "package.json")).name;
      workspacePackages.set(pkgName, pkgPath);
    });
});

module.exports = {
  hooks: {
    // This runs after package.json is parsed but before versions are resolved
    // We just set the dependencies to the local version if they are in the monorepo
    // These changes to the package.json are not saved to disk, but the resolved versions
    // are, which is fine for us because users cloning the starterkits will not use the
    // monorepo's lockfile
    readPackage(pkg) {
      for (const dep in pkg.dependencies) {
        if (workspacePackages.has(dep)) {
          console.log(`INFO: Linking ${pkg.name} to local version of ${dep}`);
          pkg.dependencies[dep] = `workspace:*`;
        }
      }
      for (const dep in pkg.devDependencies) {
        if (workspacePackages.has(dep)) {
          console.log(`INFO: Linking ${pkg.name} to local version of ${dep}`);
          pkg.devDependencies[dep] = `workspace:*`;
        }
      }

      return pkg;
    },
  },
};

function findMonorepoRoot(currentDir) {
  let dir = currentDir;
  while (dir !== path.parse(dir).root) {
    if (fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return null;
}
