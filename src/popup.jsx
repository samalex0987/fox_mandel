import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Download, Zap, Eye, Sparkles, ChevronLeft, ChevronRight, Mail, X } from 'lucide-react';


const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        <div className="p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Success icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          {/* Success message */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Email Sent Successfully!
            </h3>
            <p className="text-gray-600 mb-6">
              Your document has been successfully processed and sent to the specified email address.
            </p>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Continue
              </button>
              <a
                href={output}
                download
                className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default SuccessModal
