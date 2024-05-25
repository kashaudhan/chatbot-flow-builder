"use client";

import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/base.css";
import { flowStyle, initialNodes } from "@/constants";
import MessageNode from "@/components/message-node";

const App = () => {
  // States and hooks setup
  const reactFlowWrapper = useRef<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedElements, setSelectedElements] = useState<any>([]);

  // Define custom node types
  const nodeTypes = useMemo(
    () => ({
      messageNode: MessageNode,
    }),
    []
  );

  // Handle node click
  const onNodeClick = useCallback((event: any, node: any) => {}, []);

  // Handle edge connection
  const onConnect = useCallback((params: any) => {}, []);

  // Enable drop effect on drag over
  const onDragOver = useCallback((event: any) => {}, []);

  // Handle drop event to add a new node
  const onDrop = useCallback((event: any) => {}, []);

  return (
    <div className="flex flex-row min-h-screen lg:flex-row">
      <div className="flex-grow h-screen" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          nodeTypes={nodeTypes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          style={flowStyle}
          onNodeClick={onNodeClick}
          onPaneClick={() => {}}
          fitView
        >
          <Background variant={BackgroundVariant.Cross} gap={12} size={0.5} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

// ReactFlowProvider wrapper
function FlowWithProvider() {
  return (
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  );
}

export default FlowWithProvider;
