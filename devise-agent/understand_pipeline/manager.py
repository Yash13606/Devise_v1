import os
import json
from .parser import parse_file_structure
import json

class UnderstandPipelineManager:
    def __init__(self, target_directory: str):
        self.target_directory = target_directory
        self.nodes = []
        self.edges = []
    
    def run_pipeline(self):
        """Runs the 5-agent pipeline to generate the knowledge graph."""
        self._project_scanner()
        self._file_analyzer()
        self._architecture_analyzer()
        self._tour_builder()
        self._graph_reviewer()
        
        return {
            "nodes": self.nodes,
            "edges": self.edges
        }

    def _project_scanner(self):
        # Discover files
        for root, dirs, files in os.walk(self.target_directory):
            if "node_modules" in dirs:
                dirs.remove("node_modules")
            if ".git" in dirs:
                dirs.remove(".git")
            
            for file in files:
                if file.endswith((".py", ".ts", ".tsx", ".js", ".md")):
                    filepath = os.path.join(root, file)
                    self.nodes.append({
                        "id": filepath,
                        "label": file,
                        "type": "file",
                        "path": filepath
                    })

    def _file_analyzer(self):
        # Extract imports/exports using Tree-sitter
        for node in self.nodes:
            if node["type"] == "file":
                ast_data = parse_file_structure(node["path"])
                
                # Add function and class nodes
                for func in ast_data.get("functions", []):
                    func_id = f"{node['id']}::{func}()"
                    self.nodes.append({
                        "id": func_id,
                        "label": f"{func}()",
                        "type": "function",
                        "path": node["path"]
                    })
                    self.edges.append({
                        "source": node["id"],
                        "target": func_id,
                        "type": "contains"
                    })
                    
                for cls in ast_data.get("classes", []):
                    cls_id = f"{node['id']}::{cls}"
                    self.nodes.append({
                        "id": cls_id,
                        "label": cls,
                        "type": "class",
                        "path": node["path"]
                    })
                    self.edges.append({
                        "source": node["id"],
                        "target": cls_id,
                        "type": "contains"
                    })
                
                # Add dependency edges for imports
                for imp in ast_data.get("imports", []):
                    # In a real app we'd resolve `imp` to a file path
                    # For now, we link the import string to the file
                    self.edges.append({
                        "source": node["id"],
                        "target": imp,
                        "type": "imports"
                    })

    def _architecture_analyzer(self):
        # Identify layers (API, Service, Data, UI)
        for node in self.nodes:
            if "frontend" in node["path"]:
                node["layer"] = "UI"
            elif "api" in node["path"]:
                node["layer"] = "API"
            elif "agent" in node["path"]:
                node["layer"] = "Agent Pipeline"
            else:
                node["layer"] = "Utility"

    def _tour_builder(self):
        # Generate guided tours
        pass

    def _graph_reviewer(self):
        # Validate graph
        pass

if __name__ == "__main__":
    manager = UnderstandPipelineManager(".")
    graph = manager.run_pipeline()
    print(json.dumps(graph, indent=2))
