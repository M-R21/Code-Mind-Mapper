from dataclasses import dataclass, field
from typing import Any
import ast

@dataclass
class SourceFile:
    path: str
    relative_path: str
    module_path: str
    language: str
    size_bytes: int
    line_count: int
    raw_ast: ast.Module | None
    parse_errors: list[str] = field(default_factory=list)

@dataclass
class FrameworkProfile:
    primary: str
    version_hint: str | None
    plugins_to_load: list[str]
    confidence: float

@dataclass
class GraphNode:
    id: str
    label: str
    node_type: str
    metadata: dict[str, Any]
    file_path: str
    line_start: int
    line_end: int
    complexity: int
    docstring: str | None

@dataclass
class GraphEdge:
    source_id: str
    target_id: str
    edge_type: str
    metadata: dict[str, Any]

@dataclass
class GraphMeta:
    project_name: str
    framework: str
    analysis_duration_ms: int
    node_count: int
    edge_count: int
    file_count: int
    warnings: list[str]

@dataclass
class CytoscapeGraph:
    nodes: list[dict]
    edges: list[dict]
    meta: GraphMeta
