import React from "react";

type Props = {
  actionWorkSpaceId: string;
};

const Sidebar = ({ actionWorkSpaceId }: Props) => {
  return (
    <div className="bg-[#111111] flex-none relative p-4 h-full w-[250px] flex flex-col">
      Sidebar
    </div>
  );
};

export default Sidebar;
