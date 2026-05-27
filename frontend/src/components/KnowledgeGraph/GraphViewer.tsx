import React, { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

interface Node {
  id: string;
  label: string;
  type: string;
  layer?: string;
  x?: number;
  y?: number;
}

interface Link {
  source: string;
  target: string;
  type: string;
}

interface GraphData {
  nodes: Node[];
  edges: Link[];
}

export const GraphViewer: React.FC<{ data: GraphData }> = ({ data }) => {
  const fgRef = useRef<any>();
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth * 0.8,
        height: window.innerHeight * 0.8,
      });
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getNodeColor = (node: Node) => {
    if (node.layer === 'UI') return '#3b82f6';
    if (node.layer === 'API') return '#10b981';
    if (node.layer === 'Agent Pipeline') return '#8b5cf6';
    return '#6b7280';
  };

  return (
    <div className="border rounded-lg shadow-sm bg-white overflow-hidden">
      <ForceGraph2D
        ref={fgRef}
        width={windowSize.width}
        height={windowSize.height}
        graphData={{ nodes: data.nodes, links: data.edges }}
        nodeLabel="label"
        nodeColor={getNodeColor}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        onNodeClick={(node) => {
          fgRef.current.centerAt(node.x, node.y, 1000);
          fgRef.current.zoom(8, 2000);
        }}
      />
    </div>
  );
};
