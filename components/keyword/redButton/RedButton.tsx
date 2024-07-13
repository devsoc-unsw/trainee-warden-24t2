import React from 'react';

interface redButtonProps {
  label: string;
  onClick?: () => void;
}

const RedButton: React.FC<redButtonProps> = ({
  label,
  onClick,
}) => {
  return (
    <>
      <div className='buttonDiv py-3'>
        <button
          className={"bg-figma-red border-black border-2 text-white text-2xl font-bold py-2 px-4 rounded w-[400px]"}
        >
          {label}
        </button>
      </div>
      
    </>
  )

};
export default RedButton;