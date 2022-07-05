import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type Props = {
  todo: Todo;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
};

function TodoItem({
  todo: { completed, id, title },
  onComplete,
  onDelete,
}: Props) {
  const color = id % 2 === 0 ? 'bg-green-500' : 'bg-gray-500';
  const hoverColor = id % 2 === 0 ? 'bg-green-600' : 'bg-gray-600';
  return (
    <div
      className={`flex w-full ${color} px-3 py-2 justify-between hover:${hoverColor} cursor-pointer`}
    >
      <div className="text-white">{title}</div>
      {completed ? (
        <FontAwesomeIcon
          icon={faTrash}
          size="2x"
          color="red"
          onClick={() => onDelete(id)}
        />
      ) : (
        <FontAwesomeIcon
          icon={faCheck}
          color="green"
          size="2x"
          onClick={() => onComplete(id)}
        />
      )}
    </div>
  );
}

export default TodoItem;
