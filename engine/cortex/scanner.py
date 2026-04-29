import os
import ast
from pathlib import Path
from .models import SourceFile

class FileScanner:
    def __init__(self, project_root: str, exclude_patterns: list[str] | None = None):
        self.project_root = Path(project_root).resolve()
        self.exclude_patterns = exclude_patterns or [
            '__pycache__', '.git', 'node_modules', 'venv', '.venv', 'env', 'migrations'
        ]

    def scan(self) -> list[SourceFile]:
        source_files = []
        for root, dirs, files in os.walk(self.project_root):
            dirs[:] = [d for d in dirs if d not in self.exclude_patterns]
            
            for file in files:
                if file.endswith('.py'):
                    file_path = Path(root) / file
                    rel_path = file_path.relative_to(self.project_root)
                    
                    # Compute module path
                    module_parts = list(rel_path.parent.parts)
                    if file_path.stem != '__init__':
                        module_parts.append(file_path.stem)
                    module_path = ".".join(module_parts)
                    
                    try:
                        content = file_path.read_text(encoding='utf-8')
                        try:
                            raw_ast = ast.parse(content, filename=str(file_path))
                            parse_errors = []
                        except SyntaxError as e:
                            raw_ast = None
                            parse_errors = [str(e)]
                            
                        source_files.append(SourceFile(
                            path=str(file_path),
                            relative_path=str(rel_path),
                            module_path=module_path,
                            language="python",
                            size_bytes=len(content.encode('utf-8')),
                            line_count=len(content.splitlines()),
                            raw_ast=raw_ast,
                            parse_errors=parse_errors
                        ))
                    except Exception as e:
                        # Skip files we can't read
                        pass
        return source_files
