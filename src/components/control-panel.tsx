import React from "react";

type ControlPanelProps = {
  nodeName: string;
  setNodeName: (name: string) => void;
  selectedNode: boolean;
  setSelectedElements: ([]) => void;
};

const ControlPanel: React.FC<ControlPanelProps> = ({
  nodeName,
  setNodeName,
  selectedNode,
  setSelectedElements,
}) => {
  const handleInputChange = (event: any) => {
    setNodeName(event.target.value);
  };
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside className="border-r-2 border-black-500 border-2 p-4 text-sm bg-white w-64 h-screen text-black">
      {selectedNode ? (
        <div>
          <h3 className="text-xl mb-2 text-blue-500">Update Node</h3>
          <label className="block mb-2 text-sm font-medium text-blue-500">
            Node Name:
          </label>
          <input
            type="text"
            className="block w-full pt-2 px-3 pb-3 text-gray-700 border border-blue-300 rounded-lg bg-white focus:outline-none focus:border-blue-500"
            value={nodeName}
            onChange={handleInputChange}
          />
          <button
            className="mt-4 bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
            onClick={() => setSelectedElements([])}
          >
            Go Back
          </button>
        </div>
      ) : (
        <div
          className="flex flex-col bg-white p-3 border-2 border-blue-400 rounded cursor-move justify-center items-center text-blue-500 hover:bg-gray-300/50 hover:text-black transition-colors duration-200"
          onDragStart={(event) => onDragStart(event, "messageNode")}
          draggable
        >
          <i className="my-2">icon</i>
          <p>Message</p>
        </div>
      )}
    </aside>
  );
};

export default ControlPanel;
