import os
import tree_sitter
from tree_sitter import Parser
import tree_sitter_python
import tree_sitter_javascript

def parse_file_structure(filepath: str):
    """
    Parses source into a concrete syntax tree to extract static facts:
    imports, exports, function/class definitions, call sites, inheritance.
    """
    results = {
        "functions": [],
        "classes": [],
        "imports": []
    }
    
    if not os.path.exists(filepath):
        return results
        
    ext = os.path.splitext(filepath)[1]
    
    try:
        if ext == ".py":
            language = tree_sitter.Language(tree_sitter_python.language())
        elif ext in [".js", ".jsx", ".ts", ".tsx"]:
            # Note: For full robust support, TS/TSX needs tree_sitter_typescript, 
            # but we use javascript as a fallback structural analyzer here.
            language = tree_sitter.Language(tree_sitter_javascript.language())
        else:
            return results
            
        parser = Parser(language)
        
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            
        tree = parser.parse(bytes(content, "utf8"))
        root_node = tree.root_node
        
        # Extremely simplified AST traversal for demonstration
        # In a production app, we'd use language-specific Tree-sitter Queries
        def traverse(node):
            if node.type in ['function_definition', 'function_declaration', 'arrow_function']:
                # Find name if possible
                for child in node.children:
                    if child.type == 'identifier':
                        results["functions"].append(content[child.start_byte:child.end_byte])
                        break
            elif node.type in ['class_definition', 'class_declaration']:
                for child in node.children:
                    if child.type == 'identifier':
                        results["classes"].append(content[child.start_byte:child.end_byte])
                        break
            elif node.type in ['import_statement', 'import_from_statement']:
                # Try to extract the module being imported
                for child in node.children:
                    if child.type in ['string', 'dotted_name']:
                        val = content[child.start_byte:child.end_byte].strip("'\"")
                        results["imports"].append(val)
                        
            for child in node.children:
                traverse(child)
                
        traverse(root_node)
        
    except Exception as e:
        print(f"Error parsing {filepath}: {e}")
        
    return results

