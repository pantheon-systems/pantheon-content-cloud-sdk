const fs = require("fs");
const path = require("path");

/**
 * This pnpm install hook links all packages in the monorepo to their local versions.
 * This allows us to use published version numbers in package.json files, while still
 * depending on the local version of the package when inside the monorepo.
 */
const monorepoRoot = findMonorepoRoot(process.cwd());
const workspacePackages = new Map();

// Read the workspace configuration from pnpm-workspace.yaml
const workspaceYamlContent = fs.readFileSync(
  path.join(monorepoRoot, "pnpm-workspace.yaml"),
  "utf8",
);

// Simple parsing of the YAML file to extract package patterns
const packagePatterns = [];
const lines = workspaceYamlContent.split("\n");
let inPackagesSection = false;

for (const line of lines) {
  if (line.trim().startsWith("packages:")) {
    inPackagesSection = true;
    continue;
  }

  if (inPackagesSection && line.trim().startsWith("-")) {
    // Extract the pattern, removing the dash and spaces
    const pattern = line.trim().substring(1).trim();
    if (pattern) {
      packagePatterns.push(pattern);
    }
  } else if (
    inPackagesSection &&
    !line.trim().startsWith("#") &&
    line.trim() !== ""
  ) {
    // If we hit a non-comment, non-empty line that doesn't start with a dash,
    // we're out of the packages section
    inPackagesSection = false;
  }
}

// Process each workspace pattern
packagePatterns.forEach((pattern) => {
  if (pattern.endsWith("/*")) {
    // Handle wildcard patterns like "packages/*"
    const dirPath = pattern.slice(0, -2); // Remove the "/*"
    const fullDirPath = path.join(monorepoRoot, dirPath);

    // Check if directory exists before trying to read it
    if (!fs.existsSync(fullDirPath)) {
      console.warn(`Warning: Directory not found: ${fullDirPath}`);
      return;
    }

    try {
      const allDirs = fs.readdirSync(fullDirPath);
      allDirs
        .filter((dir) => {
          try {
            return fs.statSync(path.join(fullDirPath, dir)).isDirectory();
          } catch (err) {
            return false;
          }
        })
        .forEach((dir) => {
          const pkgPath = path.join(fullDirPath, dir);
          try {
            const pkgName = require(path.join(pkgPath, "package.json")).name;
            workspacePackages.set(pkgName, pkgPath);
          } catch (err) {
            // Skip directories without a package.json
          }
        });
    } catch (err) {
      console.warn(
        `Warning: Error processing directory pattern ${pattern}: ${err.message}`,
      );
    }
  } else {
    // Handle specific paths like "starters/nextjs-starter"
    const pkgPath = path.join(monorepoRoot, pattern);

    // Check if directory exists before trying to access it
    if (!fs.existsSync(pkgPath)) {
      console.warn(`Warning: Package path not found: ${pkgPath}`);
      return;
    }

    try {
      if (fs.statSync(pkgPath).isDirectory()) {
        const pkgJsonPath = path.join(pkgPath, "package.json");
        if (fs.existsSync(pkgJsonPath)) {
          const pkgName = require(pkgJsonPath).name;
          workspacePackages.set(pkgName, pkgPath);
        }
      }
    } catch (err) {
      console.warn(
        `Warning: Error processing package path ${pattern}: ${err.message}`,
      );
    }
  }
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
