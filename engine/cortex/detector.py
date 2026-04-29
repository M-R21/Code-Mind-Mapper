import os
from .models import SourceFile, FrameworkProfile

class FrameworkDetector:
    def detect(self, project_root: str, files: list[SourceFile]) -> FrameworkProfile:
        score_django = 0.0
        score_flask = 0.0
        
        # Check requirements or pyproject
        req_path = os.path.join(project_root, 'requirements.txt')
        if os.path.exists(req_path):
            content = open(req_path).read().lower()
            if 'django' in content: score_django += 0.8
            if 'flask' in content: score_flask += 0.8
            
        pyproject_path = os.path.join(project_root, 'pyproject.toml')
        if os.path.exists(pyproject_path):
            content = open(pyproject_path).read().lower()
            if 'django' in content: score_django += 0.8
            if 'flask' in content: score_flask += 0.8

        # Heuristics based on file content
        for f in files:
            if f.relative_path.endswith('manage.py'):
                score_django += 0.9
            
            if f.raw_ast:
                content = open(f.path).read()
                if 'INSTALLED_APPS' in content:
                    score_django += 0.85
                if 'django' in content.lower():
                    score_django += 0.5
                if 'flask' in content.lower():
                    score_flask += 0.8
                if 'app = Flask(' in content or 'Flask(__name__)' in content:
                    score_flask += 0.9
                    
        primary = "unknown"
        confidence = 0.0
        plugins = []
        
        if score_django > score_flask and score_django >= 0.8:
            primary = "django"
            confidence = min(score_django / 2.0, 1.0)
            plugins.append("django")
        elif score_flask > score_django and score_flask >= 0.8:
            primary = "flask"
            confidence = min(score_flask / 2.0, 1.0)
            plugins.append("flask")
            
        return FrameworkProfile(
            primary=primary,
            version_hint=None,
            plugins_to_load=plugins,
            confidence=confidence
        )
