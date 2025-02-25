const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

/**
 * This pnpm install hook links all packages in the monorepo to their local versions.
 * This allows us to use published version numbers in package.json files, while still
 * depending on the local version of the package when inside the monorepo.
 */
const monorepoRoot = findMonorepoRoot(process.cwd());
const workspacePackages = new Map();

// Read the workspace configuration from pnpm-workspace.yaml
const workspaceConfig = yaml.load(
  fs.readFileSync(path.join(monorepoRoot, "pnpm-workspace.yaml"), "utf8"),
);

// Process each workspace pattern
workspaceConfig.packages.forEach((pattern) => {
  if (pattern.endsWith("/*")) {
    // Handle wildcard patterns like "packages/*"
    const dirPath = pattern.slice(0, -2); // Remove the "/*"
    const allDirs = fs.readdirSync(path.join(monorepoRoot, dirPath));
    allDirs
      .filter((dir) => {
        return fs.statSync(path.join(monorepoRoot, dirPath, dir)).isDirectory();
      })
      .forEach((dir) => {
        const pkgPath = path.join(monorepoRoot, dirPath, dir);
        try {
          const pkgName = require(path.join(pkgPath, "package.json")).name;
          workspacePackages.set(pkgName, pkgPath);
        } catch (err) {
          // Skip directories without a package.json
        }
      });
  } else {
    // Handle specific paths like "starters/nextjs-starter"
    const pkgPath = path.join(monorepoRoot, pattern);
    try {
      if (fs.existsSync(pkgPath) && fs.statSync(pkgPath).isDirectory()) {
        const pkgName = require(path.join(pkgPath, "package.json")).name;
        workspacePackages.set(pkgName, pkgPath);
      }
    } catch (err) {
      // Skip directories without a package.json
    }
  }
});

console.log(Object.fromEntries(workspacePackages));

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
