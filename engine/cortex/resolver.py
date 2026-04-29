import ast
from typing import Any
from .models import SourceFile

class SymbolTable:
    def __init__(self):
        self.classes: dict[str, dict[str, Any]] = {}
        self.functions: dict[str, dict[str, Any]] = {}
        self.imports: dict[str, dict[str, Any]] = {}

class SymbolResolver:
    def resolve(self, files: list[SourceFile]) -> SymbolTable:
        table = SymbolTable()

        def resolve_import_from_module(file: SourceFile, module: str | None, level: int) -> str | None:
            if level <= 0:
                return module

            is_package = file.relative_path.endswith('__init__.py')
            if is_package:
                base_parts = file.module_path.split('.')
            else:
                base_parts = file.module_path.split('.')[:-1]

            drop = max(0, level - 1)
            if drop > 0:
                base_parts = base_parts[:-drop]

            if module:
                parts = base_parts + module.split('.') if base_parts else module.split('.')
                return '.'.join(parts)

            return '.'.join(base_parts) if base_parts else None
        
        for file in files:
            if not file.raw_ast: continue
            
            for node in file.raw_ast.body:
                if isinstance(node, ast.ClassDef):
                    bases = []
                    for b in node.bases:
                        if isinstance(b, ast.Name): bases.append(b.id)
                        elif isinstance(b, ast.Attribute): bases.append(b.attr)
                        
                    decorators = []
                    for d in node.decorator_list:
                        if isinstance(d, ast.Name): decorators.append(d.id)
                        elif isinstance(d, ast.Call) and isinstance(d.func, ast.Name):
                            decorators.append(d.func.id)
                            
                    class_key = f"{file.module_path}::{node.name}"
                    table.classes[class_key] = {
                        "name": node.name,
                        "module_path": file.module_path,
                        "file_path": file.path,
                        "bases": bases,
                        "decorators": decorators,
                        "line_start": node.lineno,
                        "line_end": getattr(node, 'end_lineno', node.lineno),
                        "docstring": ast.get_docstring(node),
                        "node": node
                    }
                elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    decorators = []
                    for d in node.decorator_list:
                        if isinstance(d, ast.Name): decorators.append(d.id)
                        elif isinstance(d, ast.Call) and isinstance(d.func, ast.Name):
                            decorators.append(d.func.id)
                            
                    func_key = f"{file.module_path}::{node.name}"
                    table.functions[func_key] = {
                        "name": node.name,
                        "module_path": file.module_path,
                        "file_path": file.path,
                        "decorators": decorators,
                        "line_start": node.lineno,
                        "line_end": getattr(node, 'end_lineno', node.lineno),
                        "docstring": ast.get_docstring(node),
                        "node": node
                    }
                elif isinstance(node, ast.Import):
                    for alias in node.names:
                        table.imports[f"{file.module_path}::{alias.name}"] = {
                            "source_module": file.module_path,
                            "target_module": alias.name
                        }
                elif isinstance(node, ast.ImportFrom):
                    if node.module or node.level:
                        target_module = resolve_import_from_module(file, node.module, node.level)
                        if target_module:
                            for alias in node.names:
                                table.imports[f"{file.module_path}::{alias.name}"] = {
                                    "source_module": file.module_path,
                                    "target_module": target_module,
                                    "imported_name": alias.name
                                }
        return table
