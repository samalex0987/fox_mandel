import React, { useState, useEffect } from 'react';
import { ArrowRight, MessageCircle, X, Minimize2 , Sparkles} from 'lucide-react';

const FloatingChatWidget = () => {
  const [message, setMessage] = useState('');
  const [currentReply, setCurrentReply] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Simple bot responses based on keywords - FIXED VERSION
  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    // Check for greetings first
    if (msg.includes('hello') || msg.includes('hi')) {
      return "Hello! How can I help you today?";
    } 
    // Check for specific document question about gift deed
    else if (msg.includes('when was the gift deed for survey no. 46 executed') || msg.includes('gift deed') && msg.includes('survey no. 46')) {
      return "According to the document records, I can help you find information about Survey No. 46. Let me search for the gift deed details.";
    }
    // Check for partition deed question
    else if (msg.includes('after the partition deed') || (msg.includes('partition deed') && msg.includes('chandrashekar')) || (msg.includes('extent of land') && msg.includes('survey no. 46'))) {
      return "After the Partition Deed, Mr. Chandrashekar s/o. Shivaji Halalli was allotted 10 acres 11 guntas in Survey No. 46.";
    }
    // Check for 2024-25 ownership question in Kannada
    else if (msg.includes('ಇತ್ತೀಚಿನ 2024-25') || (msg.includes('ಸರ್ವೆ ನಂ. 46/1') && msg.includes('ಮಾಲೀಕರು')) || msg.includes('2024-25 ರ ದಾಖಲೆಗಳ ಪ್ರಕಾರ')) {
      return "ಇತ್ತೀಚಿನ 2024-25 ರ ದಾಖಲೆಗಳ ಪ್ರಕಾರ, ಸರ್ವೆ ನಂ. 46/1 ರ ಮಾಲೀಕರು ಶ್ರೀ ಚಂದ್ರಶೇಖರ್ ಬಿನ್ ಶಿವಾಜಿ ಹಳಳ್ಳಿ.";
    }
    // Check for customer/contract related queries
    else if (msg.includes('contract') || msg.includes('customer')) {
      return "I can help you analyze customer contracts. What specific information are you looking for?";
    } 
    // Check for help requests
    else if (msg.includes('help')) {
      return "I'm here to assist you! You can ask me about contracts, documents, or any other questions.";
    } 
    // Check for thanks
    else if (msg.includes('thanks') || msg.includes('thank you')) {
      return "You're welcome! Is there anything else I can help you with?";
    } 
    // Check for name questions
    else if (msg.includes('what is your name') || msg.includes('your name') || msg.includes('name')) {
      return "My name is FOXI. I am here to help answer your questions related to documents and contracts.";
    } 
    // Check for document analysis requests
    else if (msg.includes('analyze document') || msg.includes('document analysis')) {
      return "I can help analyze documents for key information, dates, parties involved, and important clauses. What document would you like me to review?";
    }
    // Check for legal questions
    else if (msg.includes('legal') || msg.includes('law') || msg.includes('rights')) {
      return "I can provide general information about legal documents, but please consult with a qualified legal professional for specific legal advice.";
    }
    // Check for goodbye/exit
    else if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('exit')) {
      return "Goodbye! Feel free to reach out if you need any assistance with documents or contracts.";
    }
    // Default response for unmatched queries
    else {
      return "I understand your query. Let me help you find the information you need. Could you please provide more specific details?";
    }
  };

  // Typewriter Component
  const TypewriterText = ({ text, onComplete }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      if (currentIndex < text.length) {
        const timer = setTimeout(() => {
          setDisplayText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
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

  // Handle sending message and trigger animation
  const handleSendMessage = () => {
    if (!message.trim()) return;

    const currentMessage = message;
    setMessage(''); // Clear input immediately
    setIsTyping(true);
    setCurrentReply('');
    setShouldAnimate(false);

    setTimeout(() => {
      const botResponse = getBotResponse(currentMessage);
      setCurrentReply(botResponse);
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
        <div className={`mb-4 transition-all duration-300 ease-in-out ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
        }`}>
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
                  {!currentReply && !isTyping && (
                    <div className="text-center text-gray-500 text-sm mt-8">
                      <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Hi! I'm Foxi, your AI assistant.</p>
                      <p>Ask me anything about documents!</p>
                    </div>
                  )}

                  {/* Reply Section */}
                  {(isTyping || currentReply) && (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 bg-white rounded-lg p-3 shadow-sm">
                          {isTyping ? (
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
                          ) : (
                            <div className="text-gray-700 text-sm">
                              {shouldAnimate ? (
                                <TypewriterText
                                  text={currentReply}
                                  onComplete={() => setShouldAnimate(false)}
                                />
                              ) : (
                                <span>{currentReply}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="w-full text-sm resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={1}
                        style={{ minHeight: '36px', maxHeight: '100px' }}
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isTyping}
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