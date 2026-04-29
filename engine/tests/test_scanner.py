import os
from cortex.scanner import FileScanner

def test_scanner_finds_files():
    project_root = os.path.join(os.path.dirname(__file__), 'fixtures', 'django_blog')
    scanner = FileScanner(project_root)
    files = scanner.scan()
    
    assert len(files) > 0
    file_names = [f.relative_path for f in files]
    assert 'models.py' in file_names
    assert 'views.py' in file_names
    
    # Check if AST parsed correctly
    models_file = next(f for f in files if f.relative_path == 'models.py')
    assert models_file.raw_ast is not None
    assert models_file.module_path == "models"
