const fs = require("fs");
const path = require("path");

/**
 * This pnpmfile.js script is used to modify the lockfile so starters are linked to internal packages even
 * though their dependency versions point to the public registry.
 * It checks if the project is in the monorepo, if so, any packages used in the project
 * available in the monorepo are linked to the local package.
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
