Full Stack Challenge for bajaj finserv
Overview

This project is a full-stack implementation for processing hierarchical node relationships.

It includes:

A REST API that accepts node data and builds tree or cycle structures.

A simple frontend to interact with the API and display results.
Tech Stack:

Backend: Node.js, Express
Frontend: HTML, CSS, JavaScript
Hosting: Render (backend), Vercel (frontend)

Live Links:
Backend API:
https://full-stack-challenge-siya.onrender.com/bfhl
Frontend:
https://full-stack-challenge-siya.vercel.app

API Endpoint
POST /bfhl

Request Body:
{
  "data": ["A->B", "A->C", "B->D"]
}
How It Works
Input Validation

Each entry is validated to match the format:
X->Y

X->Y

### Input Validation

**Rules:**
- Only uppercase letters are allowed  
- Invalid inputs like `hello`, `1->2`, `A->` are collected separately  
- Self-loops like `A->A` are treated as invalid  

---

### Duplicate Handling
- Duplicate edges are ignored after the first occurrence  
- Stored in `duplicate_edges`  

---

### Graph Construction
- Parent-child relationships are stored using maps  
- If a node has multiple parents, only the first occurrence is used  

---

### Component Processing
- The graph may contain multiple independent components  
- Each component is processed separately  

---

### Root Identification
- A root is a node that never appears as a child  
- If no such node exists (cycle case), the lexicographically smallest node is chosen  

---

### Cycle Detection
- DFS is used to detect cycles  
- If a cycle is found:
  - `tree` is empty  
  - `has_cycle` is set to `true`  

---

### Depth Calculation
- For valid trees, depth is the number of nodes in the longest root-to-leaf path  

Summary

The API returns:

Total number of valid trees
Total number of cycles
Root of the largest tree (by depth)
Example Response
## Example Response

```json
{
  "hierarchies": [
    {
      "root": "A",
      "tree": {
        "A": {
          "B": {
            "D": {}
          },
          "C": {}
        }
      },
      "depth": 3
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```
Running Locally
Backend
npm install
node index.js

Runs on:
http://localhost:3000

Frontend
Open index.html in a browser
Enter input like:
A->B, A->C

Notes:
CORS is enabled for cross-origin requests
The API handles up to 50 nodes efficiently
No database is used

Author
Siya Srivastava
