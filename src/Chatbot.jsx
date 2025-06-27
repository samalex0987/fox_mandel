import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

const ChatUI = () => {
  const [message, setMessage] = useState('');
  const [currentReply, setCurrentReply] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false); // ✅ Control animation

  // Simple bot responses based on keywords
  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    if (msg.includes('hello') || msg.includes('hi')) {
      return "Hello! How can I help you today?";
    } else if (msg.includes('contract') || msg.includes('customer')) {
      return "I can help you analyze customer contracts. What specific information are you looking for?";
    } else if (msg.includes('help')) {
      return "I'm here to assist you! You can ask me about contracts, documents, or any other questions.";
    } else if (msg.includes('thanks')) {
      return "You're welcome! Is there anything else I can help you with?";
    }else if (msg.includes('what is your name') || msg.includes('your name') || msg.includes('name')) {
      return "My name is FOXI i am here to help to answer you question related to generated Documents";
    } else if (msg.includes('bye') || msg.includes('goodbye')) {
    }else if (msg.includes('do you know tamil') || msg.includes('you know tamil') || msg.includes('tamil theriyuma')) {
      return "Konjam theriyum because i am just sample";
    } else if (msg.includes('bye') || msg.includes('goodbye')) {
      return "Goodbye! Feel free to reach out if you need any assistance.";
    } else {
      return "I understand your query. Let me help you find the information you need.";
    }
  };

  // ✅ Typewriter Component
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
        onComplete && onComplete(); // ✅ Stop animation
      }
    }, [currentIndex, text, onComplete]);

    useEffect(() => {
      // Reset on new text only when animation is triggered
      setDisplayText('');
      setCurrentIndex(0);
    }, [text]);

    return <span>{displayText}</span>;
  };

  // ✅ Handle sending message and trigger animation
  const handleSendMessage = () => {
    if (!message.trim()) return;

    const currentMessage = message;
    setIsTyping(true);
    setCurrentReply('');
    setShouldAnimate(false); // Reset animation

    setTimeout(() => {
      const botResponse = getBotResponse(currentMessage);
      setCurrentReply(botResponse);
      setIsTyping(false);
      setShouldAnimate(true); // ✅ Trigger animation
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Chat Input */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-1">
          <div className="flex items-start gap-4 ">
            {/* Message Input Area */}
            <div className="flex-1 ">
              <textarea
                onChange={(e) => setMessage(e.target.value)}
                placeholder="👋 Hi! I'm Foxi. Ask me anything about documents, or general questions."
                className="w-full text-gray-700 text-lg resize-none border-none outline-none bg-transparent placeholder-gray-400"
                rows={2}
                style={{ minHeight: '60px' }}
              />
            </div>
          </div>

          {/* Reply Section */}
          {(isTyping || currentReply) && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-1">
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
                    <div className="text-gray-700 text-base">
                      {shouldAnimate ? (
                        <>
                        <TypewriterText
                          text={currentReply}
                          onComplete={() => setShouldAnimate(false)}
                        />
                        </>
                      ) : (
                        <>
                       
                        <span>{currentReply}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex-1"></div>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isTyping}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              <span>Ask Foxi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default ChatUI;
