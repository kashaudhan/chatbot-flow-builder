import React from "react";
import { Handle, Position } from "reactflow";

type MessageNodeProps = {
  data: {
    label: string
  };
  selected: boolean
}

const MessageNode: React.FC<MessageNodeProps> = ({ data, selected }) => {
  return (
    <div
      className={`w-40 shadow-lg rounded-lg bg-white ${
        selected ? "border-solid border-[1px] border-green-500" : ""
      } `}
    >
      <div className="flex flex-col">
        <div className="max-h-max px-2 py-1 text-left text-black text-xs font-bold rounded-t-lg bg-teal-200">
          Send Message
        </div>
        <div className="px-3 py-2 ">
          <div className="text-xs font-normal text-black">
            {data.label}
          </div>
        </div>
      </div>

      <Handle
        id="left"
        type="target"
        position={Position.Left}
        className="w-1 rounded-full bg-slate-500"
      />
      <Handle
        id="right"
        type="source"
        position={Position.Right}
        className="w-1 rounded-full bg-gray-500"
      />
    </div>
  );
};

export default MessageNode;
