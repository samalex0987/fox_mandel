import React, { useState, useEffect } from 'react';
import { ArrowRight, MessageCircle, X, Minimize2, Sparkles } from 'lucide-react';

const FloatingChatWidget = () => {
  const [message, setMessage] = useState('');
  const [currentReply, setCurrentReply] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [isDemo, setIsDemo] = useState(false);

  // Simple bot responses based on keywords
  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    // Sample conversation flow
    if (msg.includes('hello')) {
      return "Hello! How can I help you today?";
    } else if (msg.includes('survey no. 46')) {
      return "Survey No. 46 is owned by Mr. Chandrashekar according to the latest records.";
    } else if (msg.includes('thank you')) {
      return "You're welcome! Is there anything else I can assist you with?";
    } else {
      return "I understand your query. Could you please provide more specific details?";
    }
  };

  // Typewriter Component for text animation
  const TypewriterText = ({ text, onComplete }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (currentIndex < text.length) {
        const timer = setTimeout(() => {
          setDisplayText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, 30);
        return () => clearTimeout(timer);
      } else {
        onComplete && onComplete();
      }
    }, [currentIndex, text, onComplete]);

    useEffect(() => {
      setDisplayText('');
      setCurrentIndex(0);
    }, [text]);

    return <span>{displayText}</span>;
  };

  // Demo function to simulate a conversation
  const runDemo = () => {
    setIsDemo(true);
    setIsOpen(true);
    setChatHistory([]);
    
    // Demo message 1
    setTimeout(() => {
      setChatHistory([{ type: 'user', text: 'Hello' }]);
      setIsTyping(true);
      
      setTimeout(() => {
        const response = getBotResponse('Hello');
        setChatHistory(prev => [...prev, { type: 'bot', text: response }]);
        setIsTyping(false);
        setShouldAnimate(true);
      }, 1000);
    }, 500);

    // Demo message 2
    setTimeout(() => {
      setChatHistory(prev => [...prev, { type: 'user', text: 'What is the ownership of Survey No. 46?' }]);
      setIsTyping(true);
      
      setTimeout(() => {
        const response = getBotResponse('What is the ownership of Survey No. 46?');
        setChatHistory(prev => [...prev, { type: 'bot', text: response }]);
        setIsTyping(false);
        setShouldAnimate(true);
      }, 1000);
    }, 4000);

    // Demo message 3
    setTimeout(() => {
      setChatHistory(prev => [...prev, { type: 'user', text: 'Thank you' }]);
      setIsTyping(true);
      
      setTimeout(() => {
        const response = getBotResponse('Thank you');
        setChatHistory(prev => [...prev, { type: 'bot', text: response }]);
        setIsTyping(false);
        setShouldAnimate(true);
      }, 1000);
    }, 8000);

    // Close demo
    setTimeout(() => {
      setIsOpen(false);
      setIsDemo(false);
    }, 12000);
  };

  const handleSendMessage = () => {
    if (!message.trim() || isDemo) return;

    const userMessage = message.trim();
    setChatHistory(prev => [...prev, { type: 'user', text: userMessage }]);
    setMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(userMessage);
      setChatHistory(prev => [...prev, { type: 'bot', text: botResponse }]);
      setIsTyping(false);
      setShouldAnimate(true);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Run demo on component mount
  useEffect(() => {
    runDemo();
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const maximizeChat = () => {
    setIsMinimized(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Widget */}
      {isOpen && (
        <div
          className={`mb-4 transition-all duration-300 ease-in-out ${
            isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
          }`}
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Chat with Foxi</h3>
                  <p className="text-blue-100 text-xs">AI Document Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isMinimized ? (
                  <button
                    onClick={minimizeChat}
                    className="text-white/80 hover:text-white transition-colors p-1"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={maximizeChat}
                    className="text-white/80 hover:text-white transition-colors text-xs px-2 py-1 bg-white/20 rounded"
                  >
                    Expand
                  </button>
                )}
                <button
                  onClick={toggleChat}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Content - Only show when not minimized */}
            {!isMinimized && (
              <>
                {/* Chat Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  {chatHistory.length === 0 && !isTyping && (
                    <div className="text-center text-gray-500 text-sm mt-8">
                      <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Hi! I'm Foxi, your AI assistant.</p>
                      <p>Ask me anything about documents!</p>
                    </div>
                  )}

                  {/* Chat Messages */}
                  <div className="space-y-4">
                    {chatHistory.map((msg, index) => (
                      <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.type === 'bot' && (
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Sparkles className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 bg-white rounded-lg p-3 shadow-sm max-w-xs">
                              <div className="text-gray-700 text-sm">
                                {index === chatHistory.length - 1 && shouldAnimate ? (
                                  <TypewriterText
                                    text={msg.text}
                                    onComplete={() => setShouldAnimate(false)}
                                  />
                                ) : (
                                  <span>{msg.text}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        {msg.type === 'user' && (
                          <div className="bg-blue-600 text-white rounded-lg p-3 shadow-sm max-w-xs">
                            <div className="text-sm">{msg.text}</div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-sm">Foxi is typing</span>
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.1s' }}
                              ></div>
                              <div
                                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0.2s' }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={isDemo ? "Demo is running..." : "Type your message..."}
                        disabled={isDemo}
                        className="w-full text-sm resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        rows={1}
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isTyping || isDemo}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors shadow-sm flex-shrink-0"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${
          isOpen ? 'scale-90' : 'scale-100 animate-pulse'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">!</span>
            </div>
          </>
        )}
      </button>
    </div>
  );
};

export default FloatingChatWidget;