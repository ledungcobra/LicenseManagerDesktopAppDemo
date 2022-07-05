import React from 'react';

type Props = {
  onSubmit: (title: string) => void;
};

function AddTodoForm({ onSubmit }: Props) {
  const [title, setTitle] = React.useState('');

  return (
    <div className="w-full mb-5 bg-green-50 py-3 rounded">
      <input
        className="w-full h-10 p-2 border-2 border-gray-400 rounded-lg mb-2"
        type="text"
        placeholder="Add new todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        className="w-full h-10 p-2 border-2 border-gray-400 rounded-lg"
        onClick={() => {
          if (title) {
            onSubmit(title);
            setTitle('');
          }
        }}
      >
        Submit
      </button>
    </div>
  );
}

export default AddTodoForm;
