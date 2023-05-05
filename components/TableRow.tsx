import {
  IMember,
  deleteHandlerProps,
  editHandlerProps,
} from "@/utils/Interfaces";
import React, {
  FormEvent,
  useState,
} from "react";

interface ITableRow {
  member: IMember;
  selectedMembers: string[];
  editHandler: ({ fieldName, memberId, value }: editHandlerProps) => void;
  deleteHandler: ({ memberId }: deleteHandlerProps) => void;
  selectionHandler: (memberId: string) => void;
}

const TableRow: React.FC<ITableRow> = ({
  member,
  selectedMembers,
  editHandler,
  deleteHandler,
  selectionHandler
}) => {
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const handleEditMode = () => {
    setIsEditable((pre) => !pre);
  };

  const handleValueChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    editHandler({ fieldName: name, value: value, memberId: member?.id });
  };

  const handleDelete = () => {
    deleteHandler({ memberId: member?.id });
  };

  const handleCheckBox = () => {
    selectionHandler(member?.id)
  }

  return (
    <tr key={member?.id} className={`${selectedMembers?.indexOf(member?.id) >= 0 ? 'bg-gray-300 text-blue-500' : ''}`}>
      <td className="table_input-checkbox">
        <input type="checkbox" checked={selectedMembers?.indexOf(member?.id) >= 0} onChange={handleCheckBox} />
      </td>
      <td className="table_input">
        {isEditable ? (
          <input
            type="text"
            value={member?.name}
            name="name"
            onChange={(e) => handleValueChange(e)}
          />
        ) : (
          member?.name
        )}
      </td>
      <td className="table_input">
        {isEditable ? (
          <input
            type="email"
            value={member?.email}
            name="email"
            onChange={(e) => handleValueChange(e)}
          />
        ) : (
          member?.email
        )}
      </td>
      <td className="table_input-small">
        {isEditable ? (
          <input
            type="text"
            value={member?.role}
            name="role"
            onChange={(e) => handleValueChange(e)}
          />
        ) : (
          member?.role
        )}
      </td>
      <td className="flex align-middle justify-center gap-4 w-48 table__actions">
        <button onClick={handleEditMode}>{isEditable ? "Save" : "Edit"}</button>
        <button onClick={handleDelete}>Delete</button>
      </td>
    </tr>
  );
};

export default TableRow;
