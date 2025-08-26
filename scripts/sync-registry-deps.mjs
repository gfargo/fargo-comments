// scripts/sync-registry-deps.mjs
import fs from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline";
import config from "./registry.config.mjs";

const ROOT = process.cwd();
const PACKAGE_JSON_PATH = path.join(ROOT, "package.json");
const CONFIG_PATH = path.join(ROOT, "scripts", "registry.config.mjs");

// Read package.json
function readPackageJson() {
  const content = fs.readFileSync(PACKAGE_JSON_PATH, "utf-8");
  return JSON.parse(content);
}

// Create readline interface for prompting
function createPrompt() {
  return createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

// Compare versions and return differences
function compareVersions(registryDeps, packageDeps) {
  const differences = [];
  
  for (const [depName, registryVersion] of Object.entries(registryDeps)) {
    const packageVersion = packageDeps[depName];
    
    if (!packageVersion) {
      differences.push({
        name: depName,
        type: 'missing',
        registryVersion,
        packageVersion: null,
      });
    } else if (packageVersion !== registryVersion) {
      differences.push({
        name: depName,
        type: 'mismatch',
        registryVersion,
        packageVersion,
      });
    }
  }
  
  return differences;
}

// Prompt user for updates
async function promptForUpdates(differences, rl) {
  const updates = {};
  
  for (const diff of differences) {
    const { name, type, registryVersion, packageVersion } = diff;
    
    if (type === 'missing') {
      console.log(`\n❌ Missing dependency: ${name}`);
      console.log(`   Registry has: ${registryVersion}`);
      console.log(`   Package.json: not found`);
      
      const answer = await new Promise(resolve => {
        rl.question(`   Keep registry version "${registryVersion}"? (y/n): `, resolve);
      });
      
      if (answer.toLowerCase() !== 'y') {
        const newVersion = await new Promise(resolve => {
          rl.question(`   Enter new version (or press Enter to remove): `, resolve);
        });
        
        if (newVersion.trim()) {
          updates[name] = newVersion.trim();
        } else {
          updates[name] = null; // Mark for removal
        }
      }
    } else if (type === 'mismatch') {
      console.log(`\n⚠️  Version mismatch: ${name}`);
      console.log(`   Registry has: ${registryVersion}`);
      console.log(`   Package.json: ${packageVersion}`);
      
      const answer = await new Promise(resolve => {
        rl.question(`   Update registry to package.json version "${packageVersion}"? (y/n/c): `, resolve);
      });
      
      if (answer.toLowerCase() === 'y') {
        updates[name] = packageVersion;
      } else if (answer.toLowerCase() === 'c') {
        const customVersion = await new Promise(resolve => {
          rl.question(`   Enter custom version: `, resolve);
        });
        
        if (customVersion.trim()) {
          updates[name] = customVersion.trim();
        }
      }
    }
  }
  
  return updates;
}

// Update the registry config file
function updateConfigFile(updates) {
  if (Object.keys(updates).length === 0) {
    console.log('\n✅ No updates needed.');
    return;
  }
  
  // Read the current config file as text
  let configContent = fs.readFileSync(CONFIG_PATH, 'utf-8');
  
  // Find the dependencies object
  const dependenciesStart = configContent.indexOf('dependencies: {');
  const dependenciesEnd = configContent.indexOf('},', dependenciesStart) + 1;
  
  if (dependenciesStart === -1 || dependenciesEnd === -1) {
    console.error('❌ Could not find dependencies object in config file');
    return;
  }
  
  // Extract current dependencies
  const beforeDeps = configContent.substring(0, dependenciesStart + 'dependencies: {'.length);
  const afterDeps = configContent.substring(dependenciesEnd);
  
  // Build new dependencies object
  const currentDeps = { ...config.defaults.dependencies };
  
  // Apply updates
  for (const [name, version] of Object.entries(updates)) {
    if (version === null) {
      delete currentDeps[name];
    } else {
      currentDeps[name] = version;
    }
  }
  
  // Format new dependencies
  const depsEntries = Object.entries(currentDeps).sort(([a], [b]) => a.localeCompare(b));
  const newDepsLines = depsEntries
    .map(([name, version], index) => {
      const isLast = index === depsEntries.length - 1;
      const comma = isLast ? '' : ',';
      return `      ${JSON.stringify(name)}: ${JSON.stringify(version)}${comma}`;
    })
    .join('\n');
  
  // Reconstruct the file
  const newConfigContent = beforeDeps + '\n' + newDepsLines + '\n    ' + afterDeps;
  
  // Write back to file
  fs.writeFileSync(CONFIG_PATH, newConfigContent, 'utf-8');
  
  console.log('\n✅ Registry config updated!');
  console.log('📝 Updated dependencies:');
  for (const [name, version] of Object.entries(updates)) {
    if (version === null) {
      console.log(`   - Removed: ${name}`);
    } else {
      console.log(`   - ${name}: ${version}`);
    }
  }
}

// Auto-update function (non-interactive)
function autoUpdate(differences) {
  const updates = {};
  
  for (const diff of differences) {
    const { name, type, packageVersion } = diff;
    
    if (type === 'mismatch' && packageVersion) {
      // Auto-update to package.json version
      updates[name] = packageVersion;
      console.log(`✓ Auto-updating ${name}: ${diff.registryVersion} → ${packageVersion}`);
    } else if (type === 'missing') {
      console.log(`⚠️  Skipping missing dependency: ${name} (not found in package.json)`);
    }
  }
  
  return updates;
}

// Main function
async function main() {
  const isAutoMode = process.argv.includes('--auto');
  
  console.log('🔍 Checking registry dependencies against package.json...\n');
  
  // Read package.json
  const packageJson = readPackageJson();
  const allPackageDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };
  
  // Get registry dependencies
  const registryDeps = config.defaults.dependencies;
  
  // Compare versions
  const differences = compareVersions(registryDeps, allPackageDeps);
  
  if (differences.length === 0) {
    console.log('✅ All registry dependencies are in sync with package.json!');
    return;
  }
  
  console.log(`Found ${differences.length} difference(s):`);
  
  let updates;
  
  if (isAutoMode) {
    // Auto-update mode
    updates = autoUpdate(differences);
  } else {
    // Interactive mode
    const rl = createPrompt();
    
    try {
      updates = await promptForUpdates(differences, rl);
    } finally {
      rl.close();
    }
  }
  
  // Apply updates
  updateConfigFile(updates);
  
  // Suggest regenerating registry
  if (Object.keys(updates).length > 0) {
    console.log('\n💡 Consider running `npm run gen:registry` to update the registry files.');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}