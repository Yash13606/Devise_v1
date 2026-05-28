import React, { useState, useEffect } from 'react';
import { GraphViewer } from '../components/KnowledgeGraph/GraphViewer';

export const UnderstandDashboard: React.FC = () => {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/understand/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ directory: '.' }),
      });
      const result = await response.json();
      if (result.status === 'success') {
        setGraphData(result.graph);
        setScanned(true);
      }
    } catch (error) {
      console.warn("API server unavailable, falling back to mock graph for demonstration.", error);
      // Fallback mock graph
      setGraphData({
        nodes: [
          { id: 'api/index.py', label: 'index.py', type: 'file', layer: 'API' },
          { id: 'frontend/src/App.tsx', label: 'App.tsx', type: 'file', layer: 'UI' },
          { id: 'frontend/src/pages/UnderstandDashboard.tsx', label: 'UnderstandDashboard.tsx', type: 'file', layer: 'UI' },
          { id: 'devise-agent/manager.py', label: 'manager.py', type: 'file', layer: 'Agent Pipeline' },
          { id: 'devise-agent/parser.py', label: 'parser.py', type: 'file', layer: 'Agent Pipeline' }
        ],
        edges: [
          { source: 'frontend/src/pages/UnderstandDashboard.tsx', target: 'api/index.py', type: 'import' },
          { source: 'api/index.py', target: 'devise-agent/manager.py', type: 'import' },
          { source: 'devise-agent/manager.py', target: 'devise-agent/parser.py', type: 'import' },
          { source: 'frontend/src/App.tsx', target: 'frontend/src/pages/UnderstandDashboard.tsx', type: 'import' }
        ]
      });
      setScanned(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Understand Anything</h1>
          <p className="text-muted-foreground mt-2">
            Interactive codebase knowledge graph. Explore layers, connections, and structure.
          </p>
        </div>
        <button
          onClick={handleScan}
          disabled={loading}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium"
        >
          {loading ? 'Scanning...' : 'Scan Codebase'}
        </button>
      </div>

      {scanned ? (
        <GraphViewer data={graphData} />
      ) : (
        <div className="border-2 border-dashed rounded-lg p-12 text-center text-muted-foreground">
          <p>Click "Scan Codebase" to generate the structural graph.</p>
        </div>
      )}
    </div>
  );
};
