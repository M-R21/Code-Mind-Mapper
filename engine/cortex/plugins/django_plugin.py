from typing import Any
from .base import FrameworkPlugin
from ..models import GraphNode, GraphEdge
from .registry import registry

class DjangoPlugin(FrameworkPlugin):
    plugin_id = "django"
    display_name = "Django"
    supported_versions = ["3.x", "4.x", "5.x"]

    def node_types(self) -> list[str]:
        return ["model", "view", "viewset", "url_pattern", "form", "serializer", "admin", "signal"]

    def extract_nodes(self, files: list, symbol_table: Any) -> list[GraphNode]:
        nodes = []
        for key, cls in symbol_table.classes.items():
            bases = cls["bases"]
            decorators = cls["decorators"]
            
            node_type = None
            if any("Model" in b for b in bases) and "models" in cls["file_path"]:
                node_type = "model"
            elif any("View" in b for b in bases) and "views" in cls["file_path"]:
                node_type = "view"
            elif any("ViewSet" in b for b in bases):
                node_type = "viewset"
            elif any("Form" in b for b in bases):
                node_type = "form"
            elif any("Serializer" in b for b in bases):
                node_type = "serializer"
            elif any("ModelAdmin" in b for b in bases) or "admin.register" in str(decorators):
                node_type = "admin"
                
            if node_type:
                nodes.append(GraphNode(
                    id=key,
                    label=cls["name"],
                    node_type=node_type,
                    metadata={"framework": "django", "bases": bases, "decorators": decorators},
                    file_path=cls["file_path"],
                    line_start=cls["line_start"],
                    line_end=cls["line_end"],
                    complexity=0,
                    docstring=cls["docstring"]
                ))
                
        # Basic URL and Signal extraction (from functions or variables)
        for key, func in symbol_table.functions.items():
            decorators = func["decorators"]
            node_type = None
            
            if "receiver" in str(decorators):
                node_type = "signal"
            elif "views" in func["file_path"] and "request" in str(func.get("node", "")): # Simplified check
                node_type = "view"
                
            if node_type:
                nodes.append(GraphNode(
                    id=key,
                    label=func["name"],
                    node_type=node_type,
                    metadata={"framework": "django", "decorators": decorators},
                    file_path=func["file_path"],
                    line_start=func["line_start"],
                    line_end=func["line_end"],
                    complexity=0,
                    docstring=func["docstring"]
                ))
        return nodes

    def extract_edges(self, nodes: list[GraphNode], symbol_table: Any) -> list[GraphEdge]:
        edges = []
        # In a full implementation, we'd look at AST calls (e.g. models.ForeignKey)
        # For phase 1, we will map some basic relationships based on imports or simple rules
        return edges

registry.register(DjangoPlugin())
