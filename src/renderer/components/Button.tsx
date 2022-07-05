import React from 'react';

type Props = {
  onClick?: () => void;
  children: React.ReactNode | null | undefined;
  danger?: boolean;
};

const Button = ({ danger, ...props }: Props) => {
  return (
    <button
      onClick={props.onClick}
      className={`bg-${danger ? 'red' : 'blue'}-500 hover:bg-${
        danger ? 'red' : 'blue'
      }-700 text-white font-bold py-2 px-4 rounded`}
    >
      {props.children}
    </button>
  );
};

export default Button;
