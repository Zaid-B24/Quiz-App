import { useState } from 'react';

const useInput = (value = '') => {
  const [input, setInput] = useState(value);

  const handleChange = (val) => {
    setInput(val);
  };

  return { value: input, onChange: handleChange };
};

export default useInput;
