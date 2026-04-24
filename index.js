const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.post('/bfhl', (req, res) => {
  const data = req.body.data || [];

  const user_id = "yourname_ddmmyyyy";
  const email_id = "your_email";
  const college_roll_number = "your_roll";

  const invalid_entries = [];
  const duplicate_edges = [];
  const seenEdges = new Set();
  const validEdges = [];

  // Validate Input
  data.forEach((entry) => {
    const trimmed = entry.trim();

    if (!/^[A-Z]->[A-Z]$/.test(trimmed) || trimmed[0] === trimmed[3]) {
      invalid_entries.push(entry);
      return;
    }

    if (seenEdges.has(trimmed)) {
      if (!duplicate_edges.includes(trimmed)) {
        duplicate_edges.push(trimmed);
      }
      return;
    }

    seenEdges.add(trimmed);
    validEdges.push(trimmed);
  });

  // Build Graph
  const childrenMap = {};
  const parentMap = {};

  validEdges.forEach(edge => {
    const [parent, child] = edge.split('->');

    // multi-parent: first parent wins
    if (parentMap[child]) return;

    parentMap[child] = parent;

    if (!childrenMap[parent]) childrenMap[parent] = [];
    childrenMap[parent].push(child);
  });

  // Collect all nodes
  const nodes = new Set();
  validEdges.forEach(edge => {
    const [p, c] = edge.split('->');
    nodes.add(p);
    nodes.add(c);
  });

  // DFS
  function dfs(node, path) {
    if (path.has(node)) {
      return { cycle: true };
    }

    path.add(node);

    let subtree = {};
    let depth = 1;

    if (childrenMap[node]) {
      subtree[node] = {};
      let maxChildDepth = 0;

      for (let child of childrenMap[node]) {
        const res = dfs(child, new Set(path));

        if (res.cycle) return { cycle: true };

        subtree[node] = { ...subtree[node], ...res.tree };
        maxChildDepth = Math.max(maxChildDepth, res.depth);
      }

      depth += maxChildDepth;
    } else {
      subtree[node] = {};
    }

    return { tree: subtree, depth };
  }

  // Process Components
  const visited = new Set();
  const hierarchies = [];
  let total_trees = 0;
  let total_cycles = 0;
  let largest_tree_root = "";
  let maxDepth = 0;

  nodes.forEach(node => {
    if (visited.has(node)) return;

    const component = new Set();

    function collect(n) {
      if (component.has(n)) return;
      component.add(n);

      if (childrenMap[n]) {
        childrenMap[n].forEach(collect);
      }

      if (parentMap[n]) {
        collect(parentMap[n]);
      }
    }

    collect(node);
    component.forEach(n => visited.add(n));

    // Find root
    let root = null;

    for (let n of component) {
      if (!parentMap[n]) {
        root = n;
        break;
      }
    }

    // Pure cycle case
    if (!root) {
      root = [...component].sort()[0];
    }

    const res = dfs(root, new Set());

    if (res.cycle) {
      total_cycles++;
      hierarchies.push({
        root,
        tree: {},
        has_cycle: true
      });
    } else {
      total_trees++;

      if (
        res.depth > maxDepth ||
        (res.depth === maxDepth && root < largest_tree_root)
      ) {
        maxDepth = res.depth;
        largest_tree_root = root;
      }

      hierarchies.push({
        root,
        tree: res.tree,
        depth: res.depth
      });
    }
  });

  // Final Response
  res.json({
    user_id,
    email_id,
    college_roll_number,
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary: {
      total_trees,
      total_cycles,
      largest_tree_root
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});