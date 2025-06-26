import React, { useState } from 'react';

const DocumentEditor = () => {
  const [editingMode, setEditingMode] = useState('direct'); // 'direct' or 'structured'
  const [textTab, setTextTab] = useState('translated'); // 'translated' or 'raw'
  const [translatedText, setTranslatedText] = useState(`TM2107BAS4C014CC Document No-12 Main Details Document Date 28-07-2024
'Main State Registration Department¹
Number 46
(41st Section Document)

Details, Gedagi Mohammad Validation, 2017-2018 Processing -State Registration Department
Documentation. Gedagi 4.0. Number, 192 Validation Section 3. Reference Sad
Documents, Section Approval Section 3. Verification
Reference. State Approval Department, GDC- 1-09812-2017-18

Processing Documentation
Date 19/01/2018`);
  const [rawOcrText, setRawOcrText] = useState(`TM2107BAS4C014CC ನಮ್ಮ ಎನ್-12 ಮುಖ್ಯತನ ನಾಲೆಲು ಮುದ್ಯಾದ ದಿನಾಂಕ 28-07-2024
'ಮುಖ್ಯತನ ರಾಜ್ಯ ಸ್ಪ್ಸ್ ಪ್ರೀತ ಸಂಸ್ಟಾ¹
ನಂಬುಮ 46
(41 ನೇ ಎಂಗೆ ದೊಡ್ಯ)

ಬೆಟ್ಟ , ಗೆದಗಿ ಮೊಹಮಾಬು ವಷ್ಪ ,2017-2018 ಮಾಕಲಿ -ಸೆಲ್ ರಾಜ್ಯ ನೊಡುದಾ 
ತಾಮೊತ್ತ . ಗೆದಗಿ 4.0. ನಂಬುಯ , 192 ಬುಲಾವಮೆ ಸ್ಟೆ 3. ತೊಮೂಲೆ Sad
ಮೊಚುಕೆ , ಬೆಗಿಯೋ ಸ್ಪಧೆೆಸ್ತೆ ಸ್ಟೆ 3. ವೊಟುಯ
ಗಾ೭ುಮ . ಸೊರಾಸ್ಪ್ರೊ ಸಂಸ್ಟೀ, GDC- 1-09812-2017-18

ಎ ಅಗ೟ುಮೊಟುದೀ
ದಿನಾಂಕ 19/01/2018`);

  const handleSaveChanges = () => {
    alert('Changes saved successfully!');
  };

  const handleProceedToAnalysis = () => {
    alert('Proceeding to Document Analysis...');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Choose Editing Mode</h2>
      
      {/* Mode Toggle Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setEditingMode('direct')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            editingMode === 'direct'
              ? 'bg-slate-700 text-white shadow-lg'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Direct Text Editing
        </button>
        <button
          onClick={() => setEditingMode('structured')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            editingMode === 'structured'
              ? 'bg-slate-700 text-white shadow-lg'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Structured Form
        </button>
      </div>

      {/* Conditional Content Based on Editing Mode */}
      {editingMode === 'direct' ? (
        <>
          {/* Text Type Toggle */}
          <div className="flex gap-6 mb-4">
            <button
              onClick={() => setTextTab('translated')}
              className={`pb-2 font-medium transition-all duration-200 ${
                textTab === 'translated'
                  ? 'text-yellow-600 border-b-2 border-yellow-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Translated Text
            </button>
            <button
              onClick={() => setTextTab('raw')}
              className={`pb-2 font-medium transition-all duration-200 ${
                textTab === 'raw'
                  ? 'text-yellow-600 border-b-2 border-yellow-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Raw OCR Text
            </button>
          </div>

          {/* Text Editor Area */}
          <div className="bg-white rounded-lg border border-gray-300 p-6 mb-6 shadow-sm">
            <div className="text-sm text-gray-500 mb-2">
              {textTab === 'translated' ? 'Translated Text (Editable)' : 'Raw OCR Text (Editable)'}
            </div>
            <textarea
              value={textTab === 'translated' ? translatedText : rawOcrText}
              onChange={(e) => textTab === 'translated' ? setTranslatedText(e.target.value) : setRawOcrText(e.target.value)}
              className="w-full h-80 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm leading-relaxed"
              placeholder={textTab === 'translated' ? "Enter translated text here..." : "Enter raw OCR text here..."}
              style={{ 
                fontFamily: textTab === 'raw' ? 'monospace' : 'inherit',
                direction: textTab === 'raw' ? 'ltr' : 'ltr'
              }}
            />
            <div className="flex justify-end mt-2">
              <div className="w-4 h-4 bg-gray-300 rounded cursor-pointer"></div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Structured Form */}
          <div className="space-y-6">
            {/* Land Type & Possession Section */}
            <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Land Type & Possession</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Type of Land</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="agricultural">Agricultural</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Survey Reference</label>
                  <input 
                    type="text" 
                    placeholder="Survey Reference"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Possession Type</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                    <option value="market">Market</option>
                    <option value="mortgage">Mortgage</option>
                    <option value="freehold">Freehold</option>
                  </select>
                  <div className="absolute right-3 top-9 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Any Encumbrance / Mortgage?</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">If Yes, In Favor of</label>
                  <input 
                    type="text" 
                    placeholder="If Yes, In Favor of"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Additional Reference Numbers Section */}
            <div className="bg-white rounded-lg border border-gray-300 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"/>
                    <path d="M8 6h4v2H8V6zM8 10h4v2H8v-2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Additional Reference Numbers</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Reference Number 1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <input 
                    type="text" 
                    placeholder="Reference Number 2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <input 
                    type="text" 
                    placeholder="Reference Number 3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Action Buttons */}
      {/* <div className="flex gap-4 mt-6">
        <button
          onClick={handleSaveChanges}
          className="flex-1 bg-slate-700 text-white py-3 px-6 rounded-lg font-medium hover:bg-slate-800 transition-colors duration-200 shadow-md"
        >
          Save Changes
        </button>
        <button
          onClick={handleProceedToAnalysis}
          className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
        >
          Proceed to Document Analysis
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div> */}

      {/* Status Indicator */}
      <div className="mt-4 text-sm text-gray-600">
        Current Mode: <span className="font-medium capitalize">{editingMode === 'direct' ? 'Direct Text Editing' : 'Structured Form'}</span>
        {editingMode === 'direct' && (
          <>
            {' • '}
            Text Type: <span className="font-medium capitalize">{textTab === 'translated' ? 'Translated Text' : 'Raw OCR Text'}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentEditor;