import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Download, Zap, Eye, Sparkles, ChevronLeft, ChevronRight, MailCheck  } from 'lucide-react';
import axios from 'axios';
import pdf from "./display.pdf";
import output from "./output.pdf"
import logo from "./logo.png"
import FloatingChatWidget from './Chatbot';
import outputimg from "./output.png"
import SuccessModal from './popup';

// Mock components (replace with actual implementations if available)
const DocumentEditor = () => (
  <div className="border border-gray-200 rounded-lg bg-white p-4">
    Document Editor Placeholder
  </div>
);
const ChatUI = () => (
  <div className="border border-gray-200 rounded-lg bg-white p-4">
    Chat UI Placeholder
  </div>
);

// Load PDF.js from CDN
const loadPDFJS = () => {
  return new Promise((resolve) => {
    if (window.pdfjsLib) {
      resolve(window.pdfjsLib);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    document.head.appendChild(script);
  });
};

// Simulated function to simulate delay for each step
const simulateStep = (stepName, delay = 2000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${stepName} completed`);
    }, delay);
  });
};

const Simulation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfPages, setPdfPages] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedEStamp, setUploadedEStamp] = useState(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageGroup, setPageGroup] = useState(0);
   const [showPopup, setShowPopup] = useState(false);
  const pagesPerGroup = 5;

  const [steps, setSteps] = useState([
    { title: 'Upload Document', icon: Upload, completed: false, description: 'Select your document to begin processing' },
    { title: 'Quality Check', icon: Eye, completed: false, description: 'Validating document integrity and format' },
    { title: 'Document Analysis', icon: Zap, completed: false, description: 'AI-powered content analysis in progress' },
    { title: 'Generate Report', icon: Sparkles, completed: false, description: 'Creating comprehensive insights' },
    { title: 'Edit & Download', icon: Download, completed: false, description: 'Finalize and export your report' },
  ]);

  // Simulate automatic file upload for demo using local PDF
  useEffect(() => {
    if (currentStep === 0) {
      const simulateFileUpload = async () => {
        setPdfLoading(true);
        setUploadProgress(0);
        const mockFile = new File([""], "display.pdf", { type: "application/pdf" });
        setFile(mockFile);
        await processPDF(pdf);
        setTimeout(() => {
          handleNextStep();
        }, 2000);
      };
      simulateFileUpload();
    }
  }, []);

  // Automatic step progression with alert for final step
  useEffect(() => {
    let timer;
    if (currentStep > 0 && currentStep < steps.length - 1) {
      timer = setTimeout(async () => {
        if (currentStep === 2) {
          const mockEStamp = new File([""], "estamp.pdf", { type: "application/pdf" });
          setUploadedEStamp(mockEStamp);
          await simulateStep('E-Stamp Upload', 1000);
        } else if (currentStep === 3 && !report) {
          await generateReport();
        }
        handleNextStep();
      }, 5000);
    } else if (currentStep === steps.length - 1) {
      // Show alert when reaching the final step
      // alert('Document was successfully send to the mail');
      setShowPopup(true)
    }
    return () => clearTimeout(timer);
  }, [currentStep, report]);

  // Smooth progress animation for steps
  useEffect(() => {
    const targetProgress = (currentStep / (steps.length - 1)) * 100;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < targetProgress) {
          return Math.min(prev + 2, targetProgress);
        }
        clearInterval(interval);
        return prev;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [currentStep, steps.length]);

  // Process PDF (local or uploaded) with progress tracking
  const processPDF = async (pdfSource) => {
    setPdfLoading(true);
    setUploadProgress(0);
    try {
      const pdfjsLib = await loadPDFJS();
      let pdfDoc;

      if (typeof pdfSource === 'string') {
        pdfDoc = await pdfjsLib.getDocument(pdfSource).promise;
      } else {
        const arrayBuffer = await pdfSource.arrayBuffer();
        pdfDoc = await pdfjsLib.getDocument(arrayBuffer).promise;
      }

      const pages = [];
      const totalPages = pdfDoc.numPages;

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;

        const canvasDataUrl = canvas.toDataURL('image/png');

        const textContent = await page.getTextContent();
        const text = textContent.items.map(item => item.str).join(' ');

        pages.push({
          pageNumber: i,
          canvas: canvasDataUrl,
          text: text || 'No text extracted from this page',
        });

        // Update progress based on pages processed
        const progressPercentage = Math.round((i / totalPages) * 100);
        setUploadProgress(progressPercentage);
      }

      setPdfPages(pages);
      setCurrentPageIndex(0);
      setPageGroup(0);
    } catch (error) {
      console.error('Error processing PDF:', error);
      setUploadProgress(0); // Reset progress on error
    } finally {
      setPdfLoading(false);
      setUploadProgress(100); // Ensure progress is 100% when complete
    }
  };

  const Sendmail = async () => {
    await simulateStep('Send Email', 1000);
    console.log("Simulated email sent");
  };

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
      setUploadProgress(0);
      await processPDF(uploadedFile);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setUploadProgress(0);
      await processPDF(droppedFile);
    } else {
      alert('Please drop a PDF file');

    }
  };

  const handleEStampUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedEStamp(file);
      alert(`E-STAMP document "${file.name}" uploaded successfully!`);
    } else {
      alert('Please select a PDF file');
    }
  };

  const goToPreviousPage = () => {
    setCurrentPageIndex(prev => {
      const newIndex = prev > 0 ? prev - 1 : pdfPages.length - 1;
      const newGroup = Math.floor(newIndex / pagesPerGroup);
      setPageGroup(newGroup);
      return newIndex;
    });
  };

  const goToNextPage = () => {
    setCurrentPageIndex(prev => {
      const newIndex = prev < pdfPages.length - 1 ? prev + 1 : 0;
      const newGroup = Math.floor(newIndex / pagesPerGroup);
      setPageGroup(newGroup);
      return newIndex;
    });
  };

  const goToPage = (index) => {
    setCurrentPageIndex(index);
    setPageGroup(Math.floor(index / pagesPerGroup));
  };

const Popup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center">
        {/* Icon inside header with background */}
        <div className="flex justify-center items-center mb-4">
          <MailCheck className="w-12 h-12 text-white bg-blue-700 p-3 rounded-full" />
        </div>
        
        {/* Success message */}
        <h3 className="text-lg font-semibold text-black-800 mb-4">Success</h3>
        
        {/* Popup message */}
        <p className="text-gray-600 mb-6">{message}</p>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

  const goToPreviousPageGroup = () => {
    setPageGroup(prev => Math.max(prev - 1, 0));
  };

  const goToNextPageGroup = () => {
    setPageGroup(prev => Math.min(prev + 1, Math.floor((pdfPages.length - 1) / pagesPerGroup)));
  };

  const handleNextStep = async () => {
    if (currentStep < steps.length - 1) {
      setIsProcessing(true);
      const stepName = steps[currentStep].title;
      await simulateStep(stepName, 1500);
      const newSteps = [...steps];
      newSteps[currentStep].completed = true;
      setSteps(newSteps);
      setCurrentStep(currentStep + 1);
      setIsProcessing(false);
    }
  };

  const generateReport = async () => {
    setIsProcessing(true);
    await simulateStep('Generate Report', 2000);
    await Sendmail();
    const generatedReport = `
FoxMandal
Solicitors & Advocates
To,
Report On Title
09th January 2025

    `;
    setReport(generatedReport);
    setIsProcessing(false);
  };

  
  
  return (
   <>
    
    <div className="min-h-screen bg-gray-100">
      
      <div className="relative max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center mb-8 space-x-4 flex-col md:flex-row md:space-x-4">
          <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            <img src={logo} alt="Fox Mandal Logo" className="max-w-full max-h-full object-contain" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900">Fox Mandal</h1>
            <p className="text-gray-600 text-sm">Legal Document Processor</p>
          </div>
        </div>
        <hr />
        <br />

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200">
              <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            {steps.map((step, index) => {
              const isActive = currentStep === index;
              const isCompleted = step.completed;
              return (
                <div key={index} className="flex flex-col items-center relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    isCompleted || isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                  </div>
                  <span className={`mt-2 text-sm font-medium transition-all duration-300 ${
                    isCompleted || isActive ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {currentStep === 0 && (
            <div className="text-center">
              <div 
                className={`border-2 border-dashed rounded-lg p-16 transition-all duration-300 ${
                  file ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                      file && !pdfLoading ? 'bg-blue-600' : 'bg-gray-400'
                    } transition-all duration-300`}>
                      {file && !pdfLoading ? <CheckCircle className="w-8 h-8 text-white" /> : <Upload className="w-8 h-8 text-white" />}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {file ? `Selected: ${file.name} (${pdfPages.length} pages)` : 'Demo: Simulating PDF upload...'}
                    </p>
                    {pdfLoading && (
                      <div className="mt-4 w-64 mx-auto">
                        <div className="bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-blue-600 text-sm mt-2">Processing PDF... {uploadProgress}%</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Check</h3>
                <p className="text-gray-600">Reviewing document pages and extracted text content from display.pdf</p>
              </div>
              {pdfPages.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
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
                    <div className="flex items-center space-x-2 overflow-x-auto">
                      <button
                        onClick={goToPreviousPageGroup}
                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={pageGroup === 0}
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      {pdfPages.slice(pageGroup * pagesPerGroup, (pageGroup + 1) * pagesPerGroup).map((_, index) => {
                        const globalIndex = pageGroup * pagesPerGroup + index;
                        return (
                          <button
                            key={globalIndex}
                            onClick={() => goToPage(globalIndex)}
                            className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                              currentPageIndex === globalIndex
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                              }`}
                          >
                            {globalIndex + 1}
                          </button>
                        );
                      })}
                      <button
                        onClick={goToNextPageGroup}
                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={pageGroup >= Math.floor((pdfPages.length - 1) / pagesPerGroup)}
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  {pdfPages[currentPageIndex] && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <h4 className="font-medium text-gray-800">Page {pdfPages[currentPageIndex].pageNumber}</h4>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Page Preview</h5>
                            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                              <img 
                                src={pdfPages[currentPageIndex].canvas} 
                                alt={`Page ${pdfPages[currentPageIndex].pageNumber}`}
                                className="w-full h-auto max-h-96 object-contain"
                              />
                            </div>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">OCR Extracted Text</h5>
                            <div className="border border-gray-200 rounded-lg bg-white p-4 max-h-96 overflow-y-auto">
                              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                                {`
                                Under your instructions, we have undertaken scrutiny of various title deeds, title documents and other revenue documents in respect of the property more fully described in the Schedule below and drawn a Title Report. Please find below the Title Report issued based on the copies of the documents furnished to us by the Client.

I. DESCRIPTION OF THE LANDS

Survey No. 46/1, measuring to an extent of 10 acres 11 guntas, situated at Harlapura village, Betageri hobli, Gadag taluk, and Gadag district.

II. LIST OF THE DOCUMENT REVIEWED

| Serial No. | Description of Documents |
|------------|------------------------|
| 1. | Record of Tenancy and Crops for the period 1987-88 to 2003-04, issued by the office of Tahsildar, Gadag taluk |
| 2. | Mutation Register Extract bearing No. 120/2003-04, issued by the office of Tahsildar, Gadag taluk |
| 3. | Record of Tenancy and Crops for the period 2004-05 to 2015-16, issued by the office of Tahsildar, Gadag taluk |
| 4. | Gift Deed dated 10.03.2015 registered as document No. GDG-1-10167/2014-15 of book-1, stored in CD No. GDGD320, at the office of Sub-Registrar, Gadag |
| 5. | Mutation Register Extract bearing No. H140/2014-15, issued by the office of Tahsildar, Gadag taluk |
| 6. | Mutation Register Extract bearing No. H9/2016-17, issued by the office of Tahsildar, Gadag taluk |
| 7. | Record of Tenancy and Crops for the period 2016-17, issued by the office of Tahsildar, Gadag taluk |
| 8. | Mortgage Deed dated 07.12.2017 registered on 06.01.2018 as document No. GDG-1 Part-V-00110/2017-18, stored in CD No. GDGD371, at the office of Sub-Registrar, Gadag |
| 9. | Mutation Register Extract bearing No. T272/2017-18, issued by the office of Tahsildar, Gadag taluk |
| 10. | 11 E Sketch bearing No. 08031016922504001, issued by the office of Tahsildar, Gadag taluk |
| 11. | Partition Deed dated 19.01.2018, registered as document No. GDG-1-09812/2017-18 of book-1, stored in CD No. GDGD371, at the office of Sub-Registrar, Gadag |
| 12. | Mutation Register Extract bearing No. H92/2017-18, issued by the office of Tahsildar, Gadag taluk |
| 13. | Record of Tenancy and Crops for the period 2017-18 to 2024-25, issued by the office of Tahsildar, Gadag taluk |
| 14. | Mutation Register Extract bearing No. T140/2024-25, issued by the office of Tahsildar, Gadag taluk |
| 15. | Latest Record of Tenancy and Crops for the period 2024-25, issued by the office of Tahsildar, Gadag taluk |
| 16. | Karnataka Revision Settlement Akarband, issued by the office of Department of Survey & Land Records |
| 17. | Tippani/PT Sheet issued by the office of the Department of Land Records |
| 18. | Village Map of Harlapura village, issued by Director of Land Records |
| 19. | Encumbrance Certificate for the period from 01.04.1985 to 31.03.2004, issued by the office of Sub-Registrar, Gadag |
| 20. | Encumbrance Certificate for the period from 01.04.2004 to 12.08.2024, issued by the office of Sub-Registrar, Gadag |
| 21. | Encumbrance Certificate for the period from 01.04.2024 to 01.01.2025, issued by the office of Sub-Registrar, Gadag |
| 22. | Notarized Genealogical Tree dated 10.09.2024, 02.01.2025, declared by Mr. Chandrashekar s/o. Shivaji Halalli |

III. DEVOLUTION OF TITLE

| SL No. | SURVEY No. | EXTENT Acres | EXTENT Guntas/Cents | EXTENT OF KHARAB LAND A | EXTENT OF KHARAB LAND B | OWNER/S |
|--------|------------|--------------|---------------------|--------------------------|--------------------------|---------|
| 1. | 46/1 | 10 | 11 | 00 | 00 | Mr. Chandrashekar s/o. Shivaji Halalli |

IV. OBSERVATIONS

Based on the documents reviewed, the following observations are noted:
1. The Record of Tenancy and Crops (RTC) from 1987-88 to 2024-25 consistently shows the land under Survey No. 46/1, measuring 10 acres 11 guntas, with no discrepancies in the extent of the land.
2. The Mutation Register Extracts (120/2003-04, H140/2014-15, H9/2016-17, T272/2017-18, H92/2017-18, T140/2024-25) confirm the chain of title transfers and ownership changes, culminating in Mr. Chandrashekar s/o. Shivaji Halalli as the current owner.
3. The Gift Deed dated 10.03.2015 and Partition Deed dated 19.01.2018, both registered at the Sub-Registrar’s office in Gadag, establish the legal transfer of the property to Mr. Chandrashekar.
4. The Mortgage Deed dated 07.12.2017 indicates an encumbrance that was cleared as per the Encumbrance Certificates covering the period up to 01.01.2025.
5. The Encumbrance Certificates (01.04.1985 to 01.01.2025) show no pending encumbrances or claims against the property as of the latest date.
6. The Notarized Genealogical Tree dated 10.09.2024 and 02.01.2025 confirms the family members associated with the property, which is relevant for future transactions.

V. LEGAL SCRUTINY

The documents have been scrutinized for authenticity and legal validity:
- All registered deeds (Gift Deed, Mortgage Deed, Partition Deed) are duly stamped and registered as per the Karnataka Stamp Act and Registration Act.
- The RTCs and Mutation Extracts are issued by the competent authority (Tahsildar, Gadag taluk) and align with the revenue records.
- The 11 E Sketch and Karnataka Revision Settlement Akarband confirm the physical boundaries and measurements of the land.
- No legal disputes or claims are evident from the Encumbrance Certificates or other documents provided.

                                `}
                              </pre>
                            </div>
                          </div>
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
          )}

          {currentStep === 2 && (
            <div className="py-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Document Analysis</h3>
                <p className="text-gray-600 mb-6">Simulating document analysis and E-Stamp upload (Demo).</p>
              </div>
              <div className="mb-8">
                <div className="bg-orange-100 border-l-4 border-orange-400 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="text-lg font-semibold text-orange-800">E-STAMP</h4>
                        <span className="ml-2 px-2 py-1 bg-orange-200 text-orange-800 text-xs font-medium rounded-full">
                          (Required)
                        </span>
                      </div>
                      <p className="text-orange-700 text-sm mb-2">
                        {uploadedEStamp ? `Uploaded: ${uploadedEStamp.name}` : 'Simulating E-Stamp upload...'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              {!report ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-6 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Generating Report</h3>
                  <p className="text-gray-600 mb-8">Simulating report generation (Demo).</p>
                </div>
              ) : (
                <div className="py-8">
                  <div className="mb-8">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">Generated Report & Document Preview</h3>
                    <p className="text-gray-600">Reviewing document pages and generated report (Demo)</p>
                     <div>
                                <h5 className="font-medium text-gray-700 mb-2">Page Preview</h5>
                                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                                  <img 
                                    src={outputimg} 
                                  
                                    className="w-full h-auto max-h-96 object-contain"
                                  />
                                </div>
                              </div>
                  </div>
                  {pdfPages.length == 0 ? (
                    <div className="space-y-6 mb-8">
                      <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
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
                        <div className="flex items-center space-x-2 overflow-x-auto">
                          <button
                            onClick={goToPreviousPageGroup}
                            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={pageGroup === 0}
                          >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                          </button>
                          {pdfPages.slice(pageGroup * pagesPerGroup, (pageGroup + 1) * pagesPerGroup).map((_, index) => {
                            const globalIndex = pageGroup * pagesPerGroup + index;
                            return (
                              <button
                                key={globalIndex}
                                onClick={() => goToPage(globalIndex)}
                                className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                                  currentPageIndex === globalIndex
                                  ? 'bg-blue-600 text-white'
                                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                {globalIndex + 1}
                              </button>
                            );
                          })}
                          <button
                            onClick={goToNextPageGroup}
                            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={pageGroup >= Math.floor((pdfPages.length - 1) / pagesPerGroup)}
                          >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      </div>
                      {pdfPages[currentPageIndex] && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                            <h4 className="font-medium text-gray-800">Page {pdfPages[currentPageIndex].pageNumber}</h4>
                          </div>
                          <div className="p-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div>
                                <h5 className="font-medium text-gray-700 mb-2">Page Preview</h5>
                                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                                  <img 
                                    src={pdfPages[currentPageIndex].canvas} 
                                    alt={`Page ${pdfPages[currentPageIndex].pageNumber}`}
                                    className="w-full h-auto max-h-96 object-contain"
                                    />
                                </div>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-700 mb-2">OCR Extracted Text</h5>
                                <div className="border border-gray-200 rounded-lg bg-white p-4 max-h-96 overflow-y-auto">
                                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                                    {`
                                                                    Under your instructions, we have undertaken scrutiny of various title deeds, title documents and other revenue documents in respect of the property more fully described in the Schedule below and drawn a Title Report. Please find below the Title Report issued based on the copies of the documents furnished to us by the Client.

I. DESCRIPTION OF THE LANDS

Survey No. 46/1, measuring to an extent of 10 acres 11 guntas, situated at Harlapura village, Betageri hobli, Gadag taluk, and Gadag district.

II. LIST OF THE DOCUMENT REVIEWED

| Serial No. | Description of Documents |
|------------|------------------------|
| 1. | Record of Tenancy and Crops for the period 1987-88 to 2003-04, issued by the office of Tahsildar, Gadag taluk |
| 2. | Mutation Register Extract bearing No. 120/2003-04, issued by the office of Tahsildar, Gadag taluk |
| 3. | Record of Tenancy and Crops for the period 2004-05 to 2015-16, issued by the office of Tahsildar, Gadag taluk |
| 4. | Gift Deed dated 10.03.2015 registered as document No. GDG-1-10167/2014-15 of book-1, stored in CD No. GDGD320, at the office of Sub-Registrar, Gadag |
| 5. | Mutation Register Extract bearing No. H140/2014-15, issued by the office of Tahsildar, Gadag taluk |
| 6. | Mutation Register Extract bearing No. H9/2016-17, issued by the office of Tahsildar, Gadag taluk |
| 7. | Record of Tenancy and Crops for the period 2016-17, issued by the office of Tahsildar, Gadag taluk |
| 8. | Mortgage Deed dated 07.12.2017 registered on 06.01.2018 as document No. GDG-1 Part-V-00110/2017-18, stored in CD No. GDGD371, at the office of Sub-Registrar, Gadag |
| 9. | Mutation Register Extract bearing No. T272/2017-18, issued by the office of Tahsildar, Gadag taluk |
| 10. | 11 E Sketch bearing No. 08031016922504001, issued by the office of Tahsildar, Gadag taluk |
| 11. | Partition Deed dated 19.01.2018, registered as document No. GDG-1-09812/2017-18 of book-1, stored in CD No. GDGD371, at the office of Sub-Registrar, Gadag |
| 12. | Mutation Register Extract bearing No. H92/2017-18, issued by the office of Tahsildar, Gadag taluk |
| 13. | Record of Tenancy and Crops for the period 2017-18 to 2024-25, issued by the office of Tahsildar, Gadag taluk |
| 14. | Mutation Register Extract bearing No. T140/2024-25, issued by the office of Tahsildar, Gadag taluk |
| 15. | Latest Record of Tenancy and Crops for the period 2024-25, issued by the office of Tahsildar, Gadag taluk |
| 16. | Karnataka Revision Settlement Akarband, issued by the office of Department of Survey & Land Records |
| 17. | Tippani/PT Sheet issued by the office of the Department of Land Records |
| 18. | Village Map of Harlapura village, issued by Director of Land Records |
| 19. | Encumbrance Certificate for the period from 01.04.1985 to 31.03.2004, issued by the office of Sub-Registrar, Gadag |
| 20. | Encumbrance Certificate for the period from 01.04.2004 to 12.08.2024, issued by the office of Sub-Registrar, Gadag |
| 21. | Encumbrance Certificate for the period from 01.04.2024 to 01.01.2025, issued by the office of Sub-Registrar, Gadag |
| 22. | Notarized Genealogical Tree dated 10.09.2024, 02.01.2025, declared by Mr. Chandrashekar s/o. Shivaji Halalli |

III. DEVOLUTION OF TITLE

| SL No. | SURVEY No. | EXTENT Acres | EXTENT Guntas/Cents | EXTENT OF KHARAB LAND A | EXTENT OF KHARAB LAND B | OWNER/S |
|--------|------------|--------------|---------------------|--------------------------|--------------------------|---------|
| 1. | 46/1 | 10 | 11 | 00 | 00 | Mr. Chandrashekar s/o. Shivaji Halalli |

IV. OBSERVATIONS

Based on the documents reviewed, the following observations are noted:
1. The Record of Tenancy and Crops (RTC) from 1987-88 to 2024-25 consistently shows the land under Survey No. 46/1, measuring 10 acres 11 guntas, with no discrepancies in the extent of the land.
2. The Mutation Register Extracts (120/2003-04, H140/2014-15, H9/2016-17, T272/2017-18, H92/2017-18, T140/2024-25) confirm the chain of title transfers and ownership changes, culminating in Mr. Chandrashekar s/o. Shivaji Halalli as the current owner.
3. The Gift Deed dated 10.03.2015 and Partition Deed dated 19.01.2018, both registered at the Sub-Registrar’s office in Gadag, establish the legal transfer of the property to Mr. Chandrashekar.
4. The Mortgage Deed dated 07.12.2017 indicates an encumbrance that was cleared as per the Encumbrance Certificates covering the period up to 01.01.2025.
5. The Encumbrance Certificates (01.04.1985 to 01.01.2025) show no pending encumbrances or claims against the property as of the latest date.
6. The Notarized Genealogical Tree dated 10.09.2024 and 02.01.2025 confirms the family members associated with the property, which is relevant for future transactions.

V. LEGAL SCRUTINY

The documents have been scrutinized for authenticity and legal validity:
- All registered deeds (Gift Deed, Mortgage Deed, Partition Deed) are duly stamped and registered as per the Karnataka Stamp Act and Registration Act.
- The RTCs and Mutation Extracts are issued by the competent authority (Tahsildar, Gadag taluk) and align with the revenue records.
- The 11 E Sketch and Karnataka Revision Settlement Akarband confirm the physical boundaries and measurements of the land.
- No legal disputes or claims are evident from the Encumbrance Certificates or other documents provided.
                                    `}
                                  </pre>
                                </div>
                              </div>
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
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="py-8">
              {report ? (
                <div>
                  <FloatingChatWidget />
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Your Report is Ready!</h3>
                  {showPopup && (
            <Popup
              message="Document was successfully sent to the mail"
              onClose={() => setShowPopup(false)}
            />
          )}
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href={output}
                      
                      download
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                              <Download className="w-4 h-4" />

                      <span>Download Report</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">Please generate the report first.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">© 2025 Fox Mandal & Associates. All rights reserved.</p>
        </div>
      </div>
    </div>
                </>
  );
};

export default Simulation;