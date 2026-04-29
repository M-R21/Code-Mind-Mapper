from .models import GraphNode, GraphEdge, CytoscapeGraph, GraphMeta

class GraphBuilder:
    def build(self, nodes: list[GraphNode], edges: list[GraphEdge], meta: GraphMeta) -> CytoscapeGraph:
        cy_nodes = []
        cy_edges = []
        node_map = {n.id: n for n in nodes}

        # Ensure all edge endpoints exist as nodes
        for e in edges:
            for node_id in (e.source_id, e.target_id):
                if node_id not in node_map:
                    node_map[node_id] = GraphNode(
                        id=node_id,
                        label=node_id,
                        node_type="external",
                        metadata={"external": True, "module": node_id},
                        file_path="",
                        line_start=0,
                        line_end=0,
                        complexity=0,
                        docstring=None
                    )

        nodes = list(node_map.values())
        node_degrees = {n.id: {'in': 0, 'out': 0} for n in nodes}
        
        for e in edges:
            if e.source_id in node_degrees:
                node_degrees[e.source_id]['out'] += 1
            if e.target_id in node_degrees:
                node_degrees[e.target_id]['in'] += 1
                
        for n in nodes:
            in_deg = node_degrees.get(n.id, {}).get('in', 0)
            out_deg = node_degrees.get(n.id, {}).get('out', 0)
            
            cy_nodes.append({
                "data": {
                    "id": n.id,
                    "label": n.label,
                    "nodeType": n.node_type,
                    "metadata": n.metadata,
                    "filePath": n.file_path,
                    "lineStart": n.line_start,
                    "lineEnd": n.line_end,
                    "complexity": n.complexity,
                    "docstring": n.docstring,
                    "degree": in_deg + out_deg,
                    "inDegree": in_deg,
                    "outDegree": out_deg,
                    "decorators": n.metadata.get("decorators", [])
                }
            })
            
        for idx, e in enumerate(edges):
            cy_edges.append({
                "data": {
                    "id": f"e{idx}",
                    "source": e.source_id,
                    "target": e.target_id,
                    "edgeType": e.edge_type,
                    "metadata": e.metadata
                }
            })
            
        return CytoscapeGraph(nodes=cy_nodes, edges=cy_edges, meta=meta)
