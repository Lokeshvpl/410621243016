import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AverageCalculator = () => {
  const [windowSize, setWindowSize] = useState(10);
  const [windowPrevState, setWindowPrevState] = useState([]);
  const [windowCurrState, setWindowCurrState] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [avg, setAvg] = useState(0);

  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        const response = await axios.get('/numbers/${windowSize}');
        setWindowPrevState(response.data.windowPrevState);
        setWindowCurrState(response.data.windowCurrState);
        setNumbers(response.data.numbers);
        setAvg(response.data.avg);
      } catch (error) {
        console.error('Error fetching numbers:', error);
      }
    };

    fetchNumbers();
  }, [windowSize]);

  return (
    <div>
      <h2>Average Calculator</h2>
      <p>Window Size: {windowSize}</p>
      <h3>Window Previous State</h3>
      <ul>
        {windowPrevState.map((num, index) => (
          <li key={index}>{num}</li>
        ))}
      </ul>
      <h3>Window Current State</h3>
      <ul>
        {windowCurrState.map((num, index) => (
          <li key={index}>{num}</li>
        ))}
      </ul>
      <h3>Numbers Received</h3>
    
        {numbers.map((num, index) => (
          <li key={index}>{num}</li>
        ))}
      
      <p>Average: {avg.toFixed(2)}</p>
    </div>
  )
};

export default AverageCalculator;