import os
from cortex.scanner import FileScanner
from cortex.resolver import SymbolResolver
from cortex.plugins.django_plugin import DjangoPlugin

def test_django_plugin_extracts_nodes():
    project_root = os.path.join(os.path.dirname(__file__), 'fixtures', 'django_blog')
    scanner = FileScanner(project_root)
    files = scanner.scan()
    
    resolver = SymbolResolver()
    symbol_table = resolver.resolve(files)
    
    plugin = DjangoPlugin()
    nodes = plugin.extract_nodes(files, symbol_table)
    
    node_types = [n.node_type for n in nodes]
    assert 'model' in node_types
    assert 'view' in node_types
    assert 'serializer' in node_types
    
    models = [n for n in nodes if n.node_type == 'model']
    assert len(models) >= 4 # Post, Category, Tag, Author
