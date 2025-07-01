import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Download, Edit3, Zap, Eye, Sparkles, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const QualityCheckStep = () => {
  // Sample data for demonstration
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pdfPages] = useState(
    Array.from({ length: 25 }, (_, i) => ({
      pageNumber: i + 1,
      canvas: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`, // placeholder
      text: `Sample text content for page ${i + 1}. This is extracted text from the PDF document that would normally be processed by OCR.`
    }))
  );

  const goToPreviousPage = () => {
    setCurrentPageIndex(prev => prev > 0 ? prev - 1 : pdfPages.length - 1);
  };

  const goToNextPage = () => {
    setCurrentPageIndex(prev => prev < pdfPages.length - 1 ? prev + 1 : 0);
  };

  const goToPage = (index) => {
    setCurrentPageIndex(index);
  };

  // Helper function to get visible page numbers for pagination
  const getVisiblePageNumbers = () => {
    const totalPages = pdfPages.length;
    const current = currentPageIndex;
    const delta = 2; // Number of pages to show on each side of current page
    
    let start = Math.max(0, current - delta);
    let end = Math.min(totalPages - 1, current + delta);
    
    // Adjust if we're near the beginning or end
    if (end - start < delta * 2) {
      if (start === 0) {
        end = Math.min(totalPages - 1, start + delta * 2);
      } else if (end === totalPages - 1) {
        start = Math.max(0, end - delta * 2);
      }
    }
    
    const pages = [];
    
    // Always show first page if not in range
    if (start > 0) {
      pages.push(0);
      if (start > 1) {
        pages.push('ellipsis-start');
      }
    }
    
    // Add visible range
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Always show last page if not in range
    if (end < totalPages - 1) {
      if (end < totalPages - 2) {
        pages.push('ellipsis-end');
      }
      pages.push(totalPages - 1);
    }
    
    return pages;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Check</h3>
          <p className="text-gray-600">Review your document pages and extracted text content</p>
        </div>
        
        {pdfPages.length > 0 ? (
          <div className="space-y-6">
            {/* Improved Page Navigation Header */}
            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Navigation Controls */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={goToPreviousPage}
                    className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={pdfPages.length <= 1}
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <div className="text-sm font-medium text-gray-700">
                    Page {currentPageIndex + 1} of {pdfPages.length}
                  </div>
                  
                  <button
                    onClick={goToNextPage}
                    className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={pdfPages.length <= 1}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                
                {/* Smart Page Number Indicators */}
                <div className="flex items-center space-x-1 overflow-x-auto max-w-full">
                  {getVisiblePageNumbers().map((pageItem, index) => {
                    if (pageItem === 'ellipsis-start' || pageItem === 'ellipsis-end') {
                      return (
                        <div key={pageItem} className="px-2 py-1 text-gray-400">
                          <MoreHorizontal className="w-4 h-4" />
                        </div>
                      );
                    }
                    
                    const pageIndex = pageItem;
                    return (
                      <button
                        key={pageIndex}
                        onClick={() => goToPage(pageIndex)}
                        className={`min-w-[32px] h-8 text-xs font-medium rounded-lg transition-colors flex-shrink-0 ${
                          currentPageIndex === pageIndex
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {pageIndex + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile-friendly Page Input */}
              <div className="mt-3 sm:hidden">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">Go to page:</label>
                  <input
                    type="number"
                    min="1"
                    max={pdfPages.length}
                    value={currentPageIndex + 1}
                    onChange={(e) => {
                      const page = parseInt(e.target.value) - 1;
                      if (page >= 0 && page < pdfPages.length) {
                        goToPage(page);
                      }
                    }}
                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-sm text-gray-600">of {pdfPages.length}</span>
                </div>
              </div>
            </div>

            {/* Current Page Display */}
            {pdfPages[currentPageIndex] && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h4 className="font-medium text-gray-800">Page {pdfPages[currentPageIndex].pageNumber}</h4>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* PDF Page Image */}
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Page Preview</h5>
                      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                        <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
                          <div className="text-center">
                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Page {pdfPages[currentPageIndex].pageNumber} Preview</p>
                            <p className="text-sm text-gray-400 mt-1">PDF rendering would appear here</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Extracted Text */}
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Extracted Text</h5>
                      <div className="border border-gray-200 rounded-lg bg-white p-4 h-96 overflow-y-auto">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {pdfPages[currentPageIndex].text || 'No text extracted from this page'}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Navigation Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousPage}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={pdfPages.length <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Page</span>
              </button>
              
              <div className="text-center">
                <button
                  className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Approve & Continue
                </button>
              </div>
              
              <button
                onClick={goToNextPage}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={pdfPages.length <= 1}
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Alternative Compact Navigation for Many Pages */}
            {pdfPages.length > 10 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-800 font-medium">Quick Navigation:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => goToPage(0)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      First
                    </button>
                    <button
                      onClick={() => goToPage(Math.floor(pdfPages.length / 2))}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Middle
                    </button>
                    <button
                      onClick={() => goToPage(pdfPages.length - 1)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Last
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No PDF pages to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QualityCheckStep;