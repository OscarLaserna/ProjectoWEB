'use client';

import { useEffect, useState } from 'react';

export default function SampleClientComponent() {
  const [leftCount, setLeftCount] = useState(0);
  const [rightCount, setRightCount] = useState(0);

  function handleLeftClick() {
    setLeftCount((count) => count + 1);
  }

  function handleRightClick() {
    setRightCount((count) => count + 1);
  }

  /*        AL CLICKAR CUALQUIER BOTON SALTA UN ALERT
  useEffect(() => {
      alert("Component rendered");
  })
  */

  // TODO : muestra solo una vez, cuando lo renderiza por primera vez o cada vez que presiones F5
  /*
  useEffect(() =>
  alert("Component rendered!"), []);
  */
  //TODO: cada vez que se actualice leftCount (no el boton), es decir cuando se presione 
  useEffect(() =>
  alert("Component rendered!"), [leftCount]);

  return (
    <div>
      <p>
        You clicked {leftCount} and {rightCount} times
      </p>
      <button
        className='rounded-md bg-gray-800 px-4 py-2 text-center text-gray-100 hover:bg-gray-700 hover:text-gray-50'
        onClick={handleLeftClick}
      >
        Left button
      </button>
      <button
        className='rounded-md bg-gray-800 px-4 py-2 text-center text-gray-100 hover:bg-gray-700 hover:text-gray-50'
        onClick={handleRightClick}
      >
        Right button
      </button>
    </div>
  );
}