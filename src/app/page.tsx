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
  NodeMouseHandler,
  useReactFlow,
  OnConnect,
  addEdge,
} from "reactflow";
import "reactflow/dist/base.css";
import { FLOW_KEY, flowStyle, initialNodes } from "@/constants";
import MessageNode from "@/components/message-node";
import ControlPanel from "@/components/control-panel";
import { id } from "@/utils";

const App = () => {
  const reactFlowWrapper = useRef<any>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedElements, setSelectedElements] = useState<any>([]);
  const [nodeName, setNodeName] = useState("");

  const { setViewport } = useReactFlow();

  // Define custom node types
  const nodeTypes = useMemo(
    () => ({
      messageNode: MessageNode,
    }),
    []
  );

  // Handle node click
  const onNodeClick: NodeMouseHandler  = useCallback((event, node) => {
    setSelectedElements([node]);
    setNodeName(node.data.label);
    setNodes((nodes) =>
      nodes.map((n) => ({
        ...n,
        selected: n.id === node.id,
      }))
    );
  }, []);

  // Handle edge connection
  const onConnect: OnConnect = useCallback(
    (params: any) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  // Enable drop effect on drag over
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);


  // Handle drop event to add a new node
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: id.generateNewId(),
        type,
        position,
        data: { label: `${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const isNodeUnconnected = useCallback(() => {
    let unconnectedNodes = nodes.filter(
      (node) =>
        !edges.find(
          (edge) => edge.source === node.id || edge.target === node.id
        )
    );

    return unconnectedNodes.length > 0;
  }, [nodes, edges]);

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const emptyTargetHandles = checkEmptyTargetHandles();

      if (nodes.length > 1 && (emptyTargetHandles > 1 || isNodeUnconnected())) {
        alert(
          "Error: More than one node has an empty target handle or there are unconnected nodes."
        );
      } else {
        const flow = reactFlowInstance.toObject();
        localStorage.setItem(FLOW_KEY, JSON.stringify(flow));
        alert("Save successful!"); // Provide feedback when save is successful
      }
    }
  }, [reactFlowInstance, nodes, isNodeUnconnected]);

  const checkEmptyTargetHandles = () => {
    let emptyTargetHandles = 0;
    edges.forEach((edge) => {
      if (!edge.targetHandle) {
        emptyTargetHandles++;
      }
    });
    return emptyTargetHandles;
  };

  const onPanClick = () => {
    setSelectedElements([]); // Reset selected elements when clicking on pane
    setNodes((nodes) =>
      nodes.map((n) => ({
        ...n,
        selected: false, // Reset selected state of nodes when clicking on pane
      }))
    );
  }

  const restoreOnMount = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(FLOW_KEY) as string);

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);


  React.useEffect(() => {
    if (selectedElements.length > 0) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedElements[0]?.id) {
            node.data = {
              ...node.data,
              label: nodeName,
            };
          }
          return node;
        })
      );
    } else {
      // Clear name when no node is selected
      setNodeName("");
    }
  }, [nodeName, selectedElements, setNodes]);

  React.useEffect(() => {
    restoreOnMount();
  }, [])
  

  return (
    <>
    <div className="bg-gray-200 border-b-[1px] border-blue-500 px-14 py-2 flex justify-end relative top-0 w-full">
      <button onClick={onSave} className="px-4 py-2 bg-white text-blue-500 border-[1px] hover:bg-gray-300 rounded-lg">save changes</button>
    </div>
    <div className="flex flex-row lg:flex-row">
      <div className="flex-grow h-[93vh]" ref={reactFlowWrapper}>
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
          onPaneClick={onPanClick}
          fitView
        >
          <Background variant={BackgroundVariant.Cross} gap={12} size={0.5} />
          <Controls />
        </ReactFlow>
      </div>
      <ControlPanel
        nodeName={nodeName}
        setNodeName={setNodeName}
        selectedNode={selectedElements[0]}
        setSelectedElements={setSelectedElements}
      />
    </div>
    </>
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
