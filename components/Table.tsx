import {
  IMember,
  deleteHandlerProps,
  editHandlerProps,
} from "@/utils/Interfaces";
import React from "react";
import TableRow from "./TableRow";

interface ITable {
  members: IMember[];
  selectedMembers: string[];
  isAllSelected: boolean;
  editHandler: ({ fieldName, memberId, value }: editHandlerProps) => void;
  deleteHandler: ({ memberId }: deleteHandlerProps) => void;
  selectionHandler: (memberId: string) => void;
  handleAllSelection: () => void;
}

const Table: React.FC<ITable> = ({ members, selectedMembers, isAllSelected, editHandler, deleteHandler, selectionHandler, handleAllSelection }) => {
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>
            <input type="checkbox" name="" id="" onChange={handleAllSelection} checked={isAllSelected} />
          </th>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {members?.map((member) => (
          <TableRow
            key={member?.id}
            member={member}
            selectedMembers={selectedMembers}
            editHandler={editHandler}
            deleteHandler={deleteHandler}
            selectionHandler={selectionHandler}
          />
        ))}
      </tbody>
    </table>
  );
};

export default Table;
