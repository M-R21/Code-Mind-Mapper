from typing import Any
import ast
from .base import FrameworkPlugin
from ..models import GraphNode, GraphEdge

class UniversalPlugin(FrameworkPlugin):
    plugin_id = "universal"
    display_name = "Universal Extractors"
    supported_versions = ["*"]

    def node_types(self) -> list[str]:
        return ["file", "class", "function"]

    def extract_nodes(self, files: list, symbol_table: Any) -> list[GraphNode]:
        nodes = []
        for file in files:
            nodes.append(GraphNode(
                id=file.module_path,
                label=file.path.split('/')[-1],
                node_type="file",
                metadata={"size_bytes": file.size_bytes, "line_count": file.line_count},
                file_path=file.path,
                line_start=1,
                line_end=file.line_count,
                complexity=0,
                docstring=None
            ))
            
        for key, cls in symbol_table.classes.items():
            nodes.append(GraphNode(
                id=key,
                label=cls["name"],
                node_type="class",
                metadata={"bases": cls["bases"], "decorators": cls["decorators"]},
                file_path=cls["file_path"],
                line_start=cls["line_start"],
                line_end=cls["line_end"],
                complexity=0,
                docstring=cls["docstring"]
            ))
            
        for key, func in symbol_table.functions.items():
            nodes.append(GraphNode(
                id=key,
                label=func["name"],
                node_type="function",
                metadata={"decorators": func["decorators"]},
                file_path=func["file_path"],
                line_start=func["line_start"],
                line_end=func["line_end"],
                complexity=0, # Computed later
                docstring=func["docstring"]
            ))
        return nodes

    def extract_edges(self, nodes: list[GraphNode], symbol_table: Any) -> list[GraphEdge]:
        edges = []
        for key, imp in symbol_table.imports.items():
            edges.append(GraphEdge(
                source_id=imp["source_module"],
                target_id=imp["target_module"],
                edge_type="imports",
                metadata={}
            ))
        # Add basic inheritance edges
        for key, cls in symbol_table.classes.items():
            for base in cls["bases"]:
                # Attempt to find the full path of the base class. Simple approach:
                # We assume base is a local class if we can't find it directly, just edge by name
                # In a real impl, we'd use import table to resolve base.
                edges.append(GraphEdge(
                    source_id=key,
                    target_id=base, # Might need resolution
                    edge_type="model_inherits", # generic inherits
                    metadata={}
                ))
        return edges
