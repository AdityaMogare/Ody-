const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");
const workspaceModules = path.resolve(workspaceRoot, "node_modules");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  workspaceModules,
];
// Let Metro resolve hoisted deps from the workspace root (react, react-dom, etc.)
config.resolver.disableHierarchicalLookup = false;
config.resolver.extraNodeModules = {
  "@ody/api-client": path.resolve(workspaceRoot, "packages/api-client/src"),
  "@ody/shared": path.resolve(workspaceRoot, "packages/shared/src"),
  "@ody/types": path.resolve(workspaceRoot, "packages/types/src"),
  react: path.resolve(workspaceModules, "react"),
  "react-dom": path.resolve(workspaceModules, "react-dom"),
  "react-native": path.resolve(workspaceModules, "react-native"),
  "react-native-web": path.resolve(workspaceModules, "react-native-web"),
};

module.exports = config;
