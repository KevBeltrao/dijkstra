import { createContext, useReducer } from 'react';

export const ProgressContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'START':
      return {
        shouldShow: true,
        value: 0,
      };
    case 'UPDATE':
      return {
        shouldShow: true,
        value: action.value,
      };
    case 'STOP':
      return {
        shouldShow: false,
        value: 0,
      };
    default:
      return state
  }
};

const ProgressComponent = ({ children }) => {
  const [progressValue, progressDispatch] = useReducer(reducer, { shouldShow: false, value: 0 });

  return (
    <ProgressContext.Provider value={{ progressValue, progressDispatch }}>
      {children}      
    </ProgressContext.Provider>
  );
}
 
export default ProgressComponent;
