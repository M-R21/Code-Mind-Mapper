import os
from cortex.scanner import FileScanner
from cortex.resolver import SymbolResolver

def test_resolver_extracts_symbols():
    project_root = os.path.join(os.path.dirname(__file__), 'fixtures', 'django_blog')
    scanner = FileScanner(project_root)
    files = scanner.scan()
    
    resolver = SymbolResolver()
    symbol_table = resolver.resolve(files)
    
    assert 'models::Post' in symbol_table.classes
    assert 'views::PostListView' in symbol_table.classes
    
    post_cls = symbol_table.classes['models::Post']
    assert 'Model' in post_cls['bases']
