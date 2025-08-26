// scripts/registry.config.mjs

/** Helper: include/exclude sets as glob-ish regexes (for future use) */

export default {
  outDir: "registry",
  baseUrl: "https://commentsby.okayd.com", // used in registry.json manifest
  // Global dependency defaults (merged into items; item-specific deps win)
  defaults: {
    dependencies: {
      "@emoji-mart/data": "latest",
      "@lexical/link": "latest",
      "@lexical/list": "latest",
      "@lexical/react": "latest",
      "@lexical/utils": "latest",
      "class-variance-authority": "^0.7.1",
      "clsx": "^2.1.1",
      "date-fns": "4.1.0",
      "emoji-mart": "latest",
      "lexical": "latest",
      "lexical-beautiful-mentions": "latest",
      "lucide-react": "^0.454.0",
      "tailwind-merge": "^2.5.5",
    }
  },
  // Path rewriter: since files are already organized under lib/comments/,
  // we just need to ensure proper @/ prefixing
  pathRewriter: (fromPath) => {
    // App demo files stay as-is (but we exclude them anyway)
    if (fromPath.startsWith("app/")) return fromPath;
    
    // Everything else gets @/ prefix
    return `@/${fromPath}`;
  },

  items: [
    {
      name: "okayd-comments-core",
      fileName: "core.json",
      type: "registry:lib",
      dependencies: null, // merges defaults
      // Collect files for core system
      include: [
        // Core adapters (base interface + local storage + index)
        /^lib\/comments\/adapters\/(comment-storage-adapter\.ts|local-storage-adapter\.ts|index\.ts)$/,

        // Core components (variations + lexical system)
        /^lib\/comments\/components\/comments\/comment-variations\.tsx$/,
        /^lib\/comments\/components\/comments\/comment-action-bar\.tsx$/,
        /^lib\/comments\/components\/comments\/comment-source-reference\.tsx$/,
        /^lib\/comments\/components\/comments\/delete-confirmation-dialog\.tsx$/,
        /^lib\/comments\/components\/comments\/variants\/.*\.tsx$/,

        /^lib\/comments\/components\/lexical\/(lexical-comment-composer\.tsx|lexical-read-only-renderer\.tsx|mention-component\.tsx)$/,
        /^lib\/comments\/components\/lexical\/config\/.*\.ts$/,
        /^lib\/comments\/components\/lexical\/plugins\/.*\.tsx$/,
        /^lib\/comments\/components\/lexical\/utils\/.*\.(ts|tsx)$/,

        // Contexts
        /^lib\/comments\/contexts\/(comment-context\.tsx|mention-context\.tsx)$/,

        // Hooks
        /^lib\/comments\/hooks\/(use-comment-actions\.ts|use-comment-config\.ts|use-comment-context-hooks\.ts|use-comments-from-source\.ts)$/,

        // Reducer, Types
        /^lib\/comments\/reducers\/comment-reducer\.ts$/,
        /^lib\/comments\/types\/(comment-hooks\.ts|comments\.ts)$/,

        // Utilities
        /^lib\/comments\/comment-events\.ts$/,
        /^lib\/comments\/lexical-utils\.ts$/,
        /^lib\/comments\/utils\/(formatTimeAgo\.ts|generateId\.ts)$/,
      ],
      exclude: [
        // Exclude all demo files
        /^app\/_demo\//,
      ],
      registryDependencies: [], // none; this is the base
    },

    {
      name: "okayd-comments-comment-list",
      fileName: "comment-list.json",
      type: "registry:lib",
      dependencies: null,
      include: [
        /^lib\/comments\/components\/comments\/comment-list\.tsx$/,
        /^lib\/comments\/components\/comments\/comment-search\.tsx$/, // Required dependency
      ],
      exclude: [
        /^app\/_demo\//,
      ],
      registryDependencies: ["core"], // shorthand resolved by script
    },

    {
      name: "okayd-comments-drawer",
      fileName: "drawer.json",
      type: "registry:lib",
      dependencies: null,
      include: [
        /^lib\/comments\/components\/comments\/comment-drawer\.tsx$/,
      ],
      exclude: [
        /^app\/_demo\//,
      ],
      registryDependencies: ["core", "comment-list"],
    },

    // Adapters with consistent okayd-comments namespace
    {
      name: "okayd-comments-adapter-server-actions",
      fileName: "adapter-server-actions.json",
      type: "registry:lib",
      dependencies: null,
      include: [
        /^lib\/comments\/adapters\/server-action-adapter\.ts$/,
        /^lib\/comments\/adapters\/cached-server-action-adapter\.ts$/, // optional
      ],
      exclude: [
        /^app\/_demo\//,
      ],
      registryDependencies: ["core"],
    },
    {
      name: "okayd-comments-adapter-api",
      fileName: "adapter-api.json",
      type: "registry:lib",
      dependencies: null,
      include: [/^lib\/comments\/adapters\/api-adapter\.ts$/],
      exclude: [
        /^app\/_demo\//,
      ],
      registryDependencies: ["core"],
    },
    {
      name: "okayd-comments-adapter-tanstack-query",
      fileName: "adapter-tanstack-query.json",
      type: "registry:lib",
      dependencies: { "@tanstack/react-query": "^5.0.0" },
      include: [/^lib\/comments\/adapters\/tanstack-query-adapter\.ts$/],
      exclude: [
        /^app\/_demo\//,
      ],
      registryDependencies: ["core"],
    },
  ],
};