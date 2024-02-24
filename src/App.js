import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [authToken, setAuthToken] = useState('');
  const [file, setFile] = useState(null);
  const [processingResult, setProcessingResult] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState('');

  const authenticate = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3001/authenticate', { withCredentials: true });

      if (response.data && response.data.accessToken) {
        setAuthToken(response.data.accessToken);
        setIsAuthenticated(true);
        console.log('Authentication successful:', response.data);
      } else {
        console.error('Authentication failed. Invalid response format.');
      }
    } catch (error) {
      console.error('Error authenticating:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const processMedia = async () => {
    if (!file) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:3001/process-audio', formData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      console.log('Media processing successful:', response.data);
      setProcessingResult(response.data);
    } catch (error) {
      console.error('Error processing media:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getIntelligence = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3001/call-score-status', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      console.log('Intelligence fetched successfully:', response.data);
      setProcessingResult(response.data);
    } catch (error) {
      console.error('Error fetching intelligence:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getCallScore = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:3001/get-call-score', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      console.log('Call score fetched successfully:', response.data);
      setProcessingResult(response.data);
    } catch (error) {
      console.error('Error fetching call score:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch typing test text on component mount
    const fetchTypingTest = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/get-typing-test');
        setTypingText(response.data.typingText);
      } catch (error) {
        console.error('Error fetching typing test:', error.message);
      }
    };
  
    fetchTypingTest();
  }, []);

  return (
    <div className="App min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Test App</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue"
        onClick={authenticate}
        disabled={isLoading}
      >
        {isLoading ? 'Authenticating...' : 'Authenticate'}
      </button>
      <input
        type="file"
        accept=".mp3, .wav, .mp4"
        onChange={handleFileChange}
        disabled={!isAuthenticated || isLoading}
        className="mt-4"
      />
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mt-4 disabled:opacity-50"
        onClick={processMedia}
        disabled={!isAuthenticated || !file || isLoading}
      >
        {isLoading ? 'Processing...' : 'Process Media'}
      </button>
      <button
        className="bg-purple-500 text-white px-4 py-2 rounded mt-4 disabled:opacity-50"
        onClick={getIntelligence}
        disabled={!isAuthenticated || isLoading}
      >
        {isLoading ? 'Fetching Intelligence...' : 'Get Intelligence'}
      </button>
      <button
        className="bg-yellow-500 text-white px-4 py-2 rounded mt-4 disabled:opacity-50"
        onClick={getCallScore}
        disabled={!isAuthenticated || isLoading || !processingResult || processingResult.status !== 'completed'}
      >
        {isLoading ? 'Fetching Call Score...' : 'Get Call Score'}
      </button>

      {isLoading && <p>Loading...</p>}

      {processingResult ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Processing Result</h2>
          <pre className="bg-gray-200 p-4 rounded">{JSON.stringify(processingResult, null, 2)}</pre>
        </div>
      ) : null}
    </div>
  );
}

export default App;
