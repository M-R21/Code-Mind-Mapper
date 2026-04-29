from abc import ABC, abstractmethod

class FrameworkPlugin(ABC):
    plugin_id: str
    display_name: str
    supported_versions: list[str]

    @abstractmethod
    def extract_nodes(self, files: list, symbol_table: dict) -> list:
        ...

    @abstractmethod
    def extract_edges(self, nodes: list, symbol_table: dict) -> list:
        ...

    @abstractmethod
    def node_types(self) -> list[str]:
        ...

    def post_process(self, nodes: list, edges: list) -> tuple[list, list]:
        return nodes, edges
