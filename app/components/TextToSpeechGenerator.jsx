'use client';

import React, { useState } from 'react';

const TextToSpeechGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const cleanText = (text) => {
    const markTags = [];
    let cleanedText = text;

    // Extract and temporarily store mark tags
    const markRegex = /<mark[^>]*>.*?<\/mark>/g;
    let markIndex = 0;
    cleanedText = cleanedText.replace(markRegex, (match) => {
      markTags.push(match);
      return `__MARK${markIndex++}__`;
    });

    // Remove punctuation except for spaces and mark placeholders
    cleanedText = cleanedText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()'"]/g, '');

    // Restore mark tags
    markTags.forEach((tag, index) => {
      cleanedText = cleanedText.replace(`__MARK${index}__`, tag);
    });

    return cleanedText;
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text');
      return;
    }

    setIsGenerating(true);
    setError('');
    setSuccess(false);

    try {
      const cleanedText = cleanText(inputText);
      
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: cleanedText }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const { audioUrl, timingUrl } = await response.json();

      // Create download links for the audio file
      const audioLink = document.createElement('a');
      audioLink.href = audioUrl;
      audioLink.download = audioUrl.split('/').pop(); // Get filename from URL
      audioLink.click();

      // Create download links for the timing file
      const timingLink = document.createElement('a');
      timingLink.href = timingUrl;
      timingLink.download = timingUrl.split('/').pop(); // Get filename from URL
      timingLink.click();

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Text to Speech Generator</h1>
      
      <div className="space-y-4">
        <textarea
          placeholder="Enter your text here..."
          className="w-full min-h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        
        <button 
          onClick={handleGenerate} 
          disabled={isGenerating || !inputText.trim()}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : 'Generate Audio'}
        </button>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 text-green-700 rounded-lg">
            Files generated successfully! Check your downloads folder.
          </div>
        )}
      </div>
    </div>
  );
};

export default TextToSpeechGenerator;