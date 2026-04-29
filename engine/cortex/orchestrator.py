import time
from .scanner import FileScanner
from .detector import FrameworkDetector
from .resolver import SymbolResolver
from .graph import GraphBuilder
from .models import CytoscapeGraph, GraphMeta
from .plugins.registry import registry
from .metrics import calculate_complexity

class AnalysisOrchestrator:
    def analyze(self, path: str, options: dict) -> CytoscapeGraph:
        start_time = time.time()
        
        # 1. Scan files
        scanner = FileScanner(path)
        files = scanner.scan()
        
        # 2. Detect framework
        detector = FrameworkDetector()
        profile = detector.detect(path, files)
        
        # 3. Resolve symbols
        resolver = SymbolResolver()
        symbol_table = resolver.resolve(files)
        
        # Calculate complexity for functions in symbol table
        for key, func in symbol_table.functions.items():
            if "node" in func:
                func["complexity"] = calculate_complexity(func["node"])
                
        # 4. Run plugins
        active_plugins = registry.get_plugins_for_profile(profile)
        # Always run universal plugin
        universal = registry.plugins.get("universal")
        if universal and universal not in active_plugins:
            active_plugins.append(universal)
            
        all_nodes = []
        all_edges = []
        for plugin in active_plugins:
            nodes = plugin.extract_nodes(files, symbol_table)
            edges = plugin.extract_edges(nodes, symbol_table)
            
            # Update complexity from symbol table
            for n in nodes:
                if n.node_type == "function" and n.id in symbol_table.functions:
                    n.complexity = symbol_table.functions[n.id].get("complexity", 0)
                    
            nodes, edges = plugin.post_process(nodes, edges)
            all_nodes.extend(nodes)
            all_edges.extend(edges)
            
        # 5. Build Graph
        meta = GraphMeta(
            project_name=path.split('/')[-1],
            framework=profile.primary,
            analysis_duration_ms=int((time.time() - start_time) * 1000),
            node_count=len(all_nodes),
            edge_count=len(all_edges),
            file_count=len(files),
            warnings=[]
        )
        
        builder = GraphBuilder()
        return builder.build(all_nodes, all_edges, meta)
