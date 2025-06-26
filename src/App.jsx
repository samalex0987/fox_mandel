import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Download, Edit3, Zap, Eye, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import DocumentEditor from './Document';
import logo from "./logo.png"
import pdf from "./display.pdf"
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

const App = () => {


  

  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfPages, setPdfPages] = useState([]);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [uploadedEStamp, setUploadedEStamp] = useState(null);
  const [isEditingReport, setIsEditingReport] = useState(false);
  const [editableReport, setEditableReport] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(0); // For carousel navigation
  const [steps, setSteps] = useState([
    { title: 'Upload Document', icon: Upload, completed: false, description: 'Select your document to begin processing' },
    { title: 'Quality Check', icon: Eye, completed: false, description: 'Validating document integrity and format' },
    { title: 'Document Analysis', icon: Zap, completed: false, description: 'AI-powered content analysis in progress' },
    { title: 'Generate Report', icon: Sparkles, completed: false, description: 'Creating comprehensive insights' },
    { title: 'Edit & Download', icon: Download, completed: false, description: 'Finalize and export your report' },
  ]);

  // Smooth progress animation
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

  // Handle file upload with drag and drop support
  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setFile(uploadedFile);
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
      await processPDF(droppedFile);
    } else {
      alert('Please drop a PDF file');
    }
  };

  // Process PDF to extract pages and text
  const processPDF = async (file) => {
    setPdfLoading(true);
    try {
      const pdfjsLib = await loadPDFJS();
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      
      const pages = [];
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        
        // Render page to canvas
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        // Extract text
        const textContent = await page.getTextContent();
        const text = textContent.items.map(item => item.str).join(' ');
        
        pages.push({
          pageNumber: pageNum,
          canvas: canvas.toDataURL(),
          text: text.trim() || 'No text found on this page'
        });
      }
      
      setPdfPages(pages);
      setCurrentPageIndex(0); // Reset to first page
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Error processing PDF file');
    } finally {
      setPdfLoading(false);
    }
  };

  // Handle E-STAMP upload
  const handleEStampUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploadedEStamp(file);
      alert(`E-STAMP document "${file.name}" uploaded successfully!`);
    } else {
      alert('Please select a PDF file');
    }
  };

  // Carousel navigation functions
  const goToPreviousPage = () => {
    setCurrentPageIndex(prev => prev > 0 ? prev - 1 : pdfPages.length - 1);
  };

  const goToNextPage = () => {
    setCurrentPageIndex(prev => prev < pdfPages.length - 1 ? prev + 1 : 0);
  };

  const goToPage = (index) => {
    setCurrentPageIndex(index);
  };

  // Simulate moving to the next step
  const handleNextStep = async () => {
    if (currentStep < steps.length - 1) {
      setIsProcessing(true);
      const stepName = steps[currentStep].title;

      // Update current step first
      setCurrentStep(currentStep + 1);
      
      // Simulate processing with visual feedback
      await simulateStep(stepName, 1500);
      
      const newSteps = [...steps];
      newSteps[currentStep].completed = true;
      setSteps(newSteps);
      setIsProcessing(false);
    }
  };

  // Simulate report generation
  const generateReport = async () => {
    setIsProcessing(true);
    await simulateStep('Generate Report', 2000);
    
    const generatedReport = `
    
FoxMandal
Solicitors & Advocates
To,
Report On Title
09th January 2025

Vivid Renewables Private Limited,
Regional Office @ Astra Tower, 5th Floor,
Chetan Vihar, Plot No: 15 to 20
Chetan college Road, Shirur Park, Vidyanagar
Hubli- 580021, Karnataka, India.

Hereunder referred to as 'the Client'

Dear Sir,

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

Upon perusal of the documents furnished to us,

1. It is learnt from the Record of Tenancy and Crops for the period 1987-88 to 2003-04, issued by the office of Tahsildar, Gadag taluk, that the name of Mr. Shivaji s/o. Ramappa Halalli is recorded as owner in possession of land bearing Survey No. 46, measuring an extent of 20 acres 22 guntas.
2. It is observed from the Mutation Register Extract bearing No. 120/2003-04, issued by the office of Tahsildar, Gadag taluk, that Mr. Shivaji s/o. Ramappa Halalli has availed loan amount of Rs. 50,000 and mortgaged the land bearing Survey No. 46 measuring 20 acres 22 guntas in favour of Vyavasaya Seva Sahakari Bank, Harlapura.
   Note: Discharge of mortgage created vide MR No. 120/2003-04 in favour of Vyavasaya Seva Sahakari Bank, Harlapura.
3. It is learnt from the Record of Tenancy and Crops for the period 2004-05 to 2015-16, issued by the office of Tahsildar, Gadag taluk, that the name of Mr. Shivaji s/o. Ramappa Halalli is recorded as owner in possession of land bearing Survey No. 46, measuring an extent of 20 acres 22 guntas.
4. It is observed from the Gift Deed dated 10.03.2015 that Mr. Shivaji, son of Ramappa Halalli, being the absolute owner of the land, and acting out of natural love and affection, gifted the land bearing Survey No. 46, measuring a total of 20 acres 22 guntas, jointly in favor of his two sons namely., (i). Mr. Yallappa and (ii). Mr. Chandrashekar, and the said deed was registered as document No. GDG-110167/2014-15 of book-1, stored in CD No. GDGD320, at the office of Sub-Registrar, Gadag. And the same is recorded in Mutation Register Extract bearing No. H140/201415 , issued by the office of Tahsildar, Gadag taluk.
5. It is observed from the Mutation Register Extract bearing No. H9/2016-17, issued by the office of Tahsildar, Gadag taluk, that the name of Mr. Shivaji s/o. Ramappa Halalli was removed and the names of (i). Mr. Yallappa and (ii). Mr. Chandrashekar sons of Shivaji Halalli was mutated as joint owners with respect to land bearing Survey No. 46, measuring an extent of 20 acres 22 guntas.
6. It is learnt from the Record of Tenancy and Crops for the period 2016-17, issued by the office of Tahsildar, Gadag taluk, that the names of (i). Mr. Yallappa and (ii). Mr. Chandrashekar sons of Shivaji Halalli are recorded as joint owners in possession of land bearing Survey No. 46, measuring an extent of 20 acres 22 guntas.
7. It is observed from the Mortgage Deed dated 07.12.2017, that Mr. Chandrashekar and Mr. Yallappa sons of Shivaji Halalli have availed loan amount of Rs. 40,000 and mortgaged the land bearing Survey No. 46, measuring an extent of 20 acres 22 guntas in favour of Primary Agricultural Pathina Sahakari Sangha and the said deed was registered on 06.01.2018 as document No. GDG-1 Part-V-00110/2017-18, stored in CD No. GDGD371, at the office of Sub-Registrar, Gadag. And the same is recorded in Mutation Register Extract bearing No. T272/2017-18, issued by the office of Tahsildar, Gadag taluk.
   Note: Discharge of mortgage created vide mortgage deed registered on 06.01.2018 as document No. GDG-1 Part-V-00110/2017-18, to be provided.
8. It is observed from the 11 E Sketch bearing No. 08031016922504001, issued by the office of Tahsildar, Gadag taluk, that provides that the land bearing Survey No. 46 totally measuring to an extent of 20 acres 22 guntas, is divided into two blocks, (i). The land measuring 10 acres 11 guntas belongs to Mr. Chandrashekar s/o. Shivaji Halalli in the 1st Block and (ii). The land measuring to an extent of 10 acres 11 guntas belongs to Mr. Yallappa s/o. Shivaji Halalli in the 2nd Block.
9. It is observed from the Partition Deed dated 19.01.2018, registered as document No. GDG-1-09812/2017-18 of book-1, stored in CD No. GDGD371, at the office of Sub-Registrar, Gadag., that (i). Mr. Chandrashekar and (ii). Mr. Yallappa sons of Shivaji Halalli being the joint owners entered into partition and partitioned the land bearing Survey No. 46 measuring an extent of 20 acres 22 guntas. As per the terms herein (i). Mr. Chandrashekar s/o. Shivaji Halalli was allotted with land measuring an extent of 10 acres 11 guntas out of 20 acres 22 guntas in Survey No. 46 and (ii). Mr. Yallappa s/o. Shivaji Halalli was allotted with land measuring an extent of 10 acres 11 guntas out of 20 acres 22 guntas in Survey No. 46. And the same is recorded in Mutation Register Extract bearing No. H92/2017-18, issued by the office of Tahsildar, Gadag taluk.
10. It is learnt from the Record of Tenancy and Crops for the period 2017-18 to 2024-25, issued by the office of Tahsildar, Gadag taluk, that the names of the owners recorded as follows:
    (i). Mr. Chandrashekar s/o. Shivaji Halalli is recorded as owner in possession of land measuring an extent of 10 acres 11 guntas out of 20 acres 22 guntas in Survey No. 46.
    (ii). Mr. Yallappa s/o. Shivaji Halalli is recorded as owner in possession of land measuring an extent of 10 acres 11 guntas out of 20 acres 22 guntas in Survey No. 46.
11. It is observed from the Mutation Register Extract bearing No. T140/2024-25, issued by the office of Tahsildar, Gadag taluk, that the land bearing Survey No. 46, totally measuring an extent of 20 acres 22 guntas has been phodied/bifurcated and renumbered as detailed below:
    (i). The land measuring an extent of 10 acres 11 guntas out of 20 acres 22 guntas in Survey No. 46 was renumbered and assigned with New Survey No. 46/1 and which was mutated in the name of Mr. Chandrashekar s/o. Shivaji Halalli.
    (ii). The land measuring an extent of 10 acres 11 guntas out of 20 acres 22 guntas in Survey No. 46 was renumbered and assigned with New Survey No. 46/2 and which was mutated in the name of Mr. Yallappa s/o. Shivaji Halalli.
12. It is learnt from the latest Record of Tenancy and Crops for the period 2024-25, issued by the office of Tahsildar, Gadag taluk, that the name of Mr. Chandrashekar s/o. Shivaji Halalli is recorded as owner in possession of land bearing Survey No. 46/1 measuring an extent of 10 acres 11 guntas.
13. The Karnataka Revision Settlement Akarband, issued by the office of Department of Survey & Land Records, provides the total extent measuring 20 acres 22 guntas with no kharab in land bearing mother Survey No. 46.
14. Tippani/PT Sheet issued by the office of the Department of Land Records, confirms the topographical shape of mother Survey number 46.
15. Village Map of Harlapura village, issued by Director of Land Records reflects the existence of Land bearing Survey No. 46.
    Note: Latest Property Tax paid receipt to be provided.

IV. ENCUMBRANCE CERTIFICATE

1. Encumbrance Certificate for the period from 01.04.1985 to 31.03.2004, issued by the office of Sub-Registrar, Gadag, with regard to Survey No. 46 measuring to an extent of 20 acres 22 guntas, does not reflect any transactions.
2. Encumbrance Certificate for the period from 01.04.2004 to 12.08.2024, issued by the office of Sub-Registrar, Gadag, with regard to Survey No. 46 measuring to an extent of 20 acres 22 guntas, reflects the entries as follows:

| SI. No. | Transactions | Document No | Remark |
|---------|--------------|-------------|--------|
| 1. | Partition Deed | Dated 19.01.2018 document No. GDG-1-09812/2017-18 | Nil |
| 2. | Mortgage Deed | Dated 07.12.2017 document No. GDG-1 Part-V-00110/2017-18 | Nil |
| 3. | Gift Deed | Dated 10.03.2015 document No. GDG-1-10167/2014-15 | Nil |

3. Encumbrance Certificate for the period from 01.04.2024 to 01.01.2025, issued by the office of Sub-Registrar, Gadag, with regard to Survey No. 46/1 measuring to an extent of 10 acres 11 guntas, does not reflect any transactions.
4. Mortgage/s reflected in Mutation Register's:
   (i). MR. No. 120/2003-04 reflects the mortgage in favour of Vyavasaya Seva Sahakari Bank, Harlapura.
   (ii). MR. No. T272/2017-18 reflects the mortgage in favour of Primary Agricultural Pathina Sahakari Sangha.

V. OTHER OBSERVATIONS

(i)
ALL THAT PIECE AND PARCEL of the Agricultural land bearing Survey No. 46/1 measuring 10 acres 11 guntas, situated at Harlapura village, Gadag taluk, Betageri hobli, Gadag district and bound on:

East by: Survey No. 47
West by: Survey No. 43
North by: Survey No. 45
South by: Survey No. 46/2.
[Boundaries are ascertained from the Tippani, PT sheet/Ghat plot]

(ii) RESTRICTIONS ON TRANSFERABILITY
a. Land Ceiling: The Measurement of Schedule Property falls within the prescribed limit provided under Section 63 of Karnataka Land Reforms Act.
b. Minor's interest: NO
c. Grant/Inam Lands: NO

(iii) ENDORSEMENTS:
Note: PTCL, Nil Tenancy and Nil Acquisition endorsement issued by the concerned authority.

(iv) FAMILY TREE OF THE CURRENT LANDOWNERS

1. It is learnt from the Notarized Genealogical Tree dated 10.09.2024, 02.01.2025, declared by Mr. Chandrashekar s/o. Shivaji Halalli.
Husband: Mr. Chandrashekar alias Chandrashekarappa s/o. Shivaji Halalli (50 years)
Wife: Mrs. Neelamma (45 years)

| 1. | Mrs. Kaveri w/o. Manjappa Honalli (27 years) |
| 2. | Mrs. Bheemavva w/o. Gavisiddappa Arera (24 years) |
| 3. | Ms. Lakshmavva d/o. Chandrashekar Halalli (23 years) unmarried |
| 4. | Ms. Yallamma d/o. Chandrashekar Halalli (19 years) unmarried |
| 5. | Master. Venkappa alias Yankappa s/o. Chandrashekar Halalli (15 years) |

VI. INDEPENDENT VERIFICATIONS
(i) Sub-Registrar Search's: The Sub-Registrar Search Report, issued by Mr. B.P.Gubber Advocate and the same is attached to this report as an annexure.
(ii) Revenue Records Search: The Revenue Search Report, issued by Mr. B.P.Gubber Advocate and the same is attached to this report as an annexure.

VII. LITIGATION SEARCH RESULTS
(i) The Litigation Search Report, issued by Mr. B.P.Gubber Advocate and the same is attached to this report as an annexure.
(ii) The PACL Land scam Search Report, issued by Mr. B.P.Gubber Advocate and the same is attached to this report as an annexure.

VIII. SPECIAL CATEGORY LANDS
Upon perusal of documents scrutinized above, it is found that the schedule property DOES NOT come under the purview of SC/ST/Minors/Inam/Grant lands or any land under Special Categories.

IX. OPINION AND RECOMMENDATION
Upon review and scrutiny of the documents furnished to us and based on independent searches by Mr.B.P. Gubber Advocate, we are of the opinion that, Mr. Chandrashekar s/o. Shivaji Halalli is the absolute owner having valid, clear and marketable title, with respect to land bearing Survey No. 46/1 measuring to an extent of 10 acres 22 guntas, situated at Harlapura village, Gadag taluk, betageri hobli, Gadag district.

Following person are to be joined as signatories in the future Deed/s:

| SI. No. | Owner/s or Khatedars or Co-owners | SI.No | Family Members |
|---------|-----------------------------------|-------|----------------|
| 1 | Mr. Chandrashekar s/o. Shivaji Halalli | 1 | Mrs. Neelamma w/o. Chandrashekar Halalli |
| | | 2 | Mrs. Kaveri w/o. Manjappa Honalli |
| | | 3 | Mrs. Bheemavva w/o. Gavisiddappa Arera |
| | | 4 | Ms. Lakshmavva d/o. Chandrashekar Halalli |
| | | 5 | Ms. Yallamma d/o. Chandrashekar Halalli |
| | | 6 | Master. Venkappa alias Yankappa (15 years) M/g father Mr. Chandrashekar Halalli |

X. CONTACT DETAILS
If any clarification in relation to this Report is required, please contact:
Prashantha Kumar S. T
Senior Partner
Fox Mandal & Associates
"FM House"
6/12, Primrose Road
Bangalore 560025
Phone: +918025595911
Mobile: +919880162142
e-mail: prashantha.kumar@foxmandal.in
    `;

    setReport(generatedReport);
    setEditableReport(generatedReport);

    const newSteps = [...steps];
    newSteps[3].completed = true;
    setSteps(newSteps);
    setIsProcessing(false);
  };

  // Handle report editing
  const handleEditReport = () => {
    setIsEditingReport(true);
  };

  const handleUpdateReport = () => {
    setReport(editableReport);
    setIsEditingReport(false);
  };

  const handleCancelEdit = () => {
    setEditableReport(report);
    setIsEditingReport(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="relative max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
       <div className="flex items-center mb-8 space-x-4 flex-col md:flex-row md:space-x-4">
  {/* Logo Container */}
  <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
    <img src={logo} alt="Fox Mandal Logo" className="max-w-full max-h-full object-contain" />
  </div>

  {/* Text Content */}
  <div className="text-center md:text-left">
    <h1 className="text-2xl font-bold text-gray-900">Fox Mandal</h1>
    <p className="text-gray-600 text-sm">Legal Document Processor</p>
  </div>
</div>
<hr />
<br />


        {/* Progress Steps at Top */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200">
              <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>

            {/* Step Indicators */}
            {steps.map((step, index) => {
              const isActive = currentStep === index;
              const isCompleted = step.completed;
              const isPending = index > currentStep;

              return (
                <div key={index} className="flex flex-col items-center relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-blue-600 text-white' 
                      : isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-500'
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
          {/* File Upload Step */}
          {currentStep === 0 && (
            <div className="text-center">
              <div 
                className={`border-2 border-dashed rounded-lg p-16 transition-all duration-300 ${
                  file ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                      file ? 'bg-blue-600' : 'bg-gray-400'
                    } transition-all duration-300`}>
                      {file ? <CheckCircle className="w-8 h-8 text-white" /> : <Upload className="w-8 h-8 text-white" />}
                    </div>
                    <button className="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium mb-4 hover:bg-gray-800 transition-colors">
                      Select PDF File
                    </button>
                    <p className="text-gray-600 text-sm">
                      {file ? `Selected: ${file.name} (${pdfPages.length} pages)` : 'or drag and drop your PDF file here'}
                    </p>
                    {pdfLoading && (
                      <p className="text-blue-600 text-sm mt-2">Processing PDF...</p>
                    )}
                  </div>
                </label>
              </div>
              
              {file && !pdfLoading && pdfPages.length > 0 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleNextStep}
                    disabled={isProcessing}
                    className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Start Quality Check'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Quality Check - Carousel View */}
          {currentStep === 1 && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality Check</h3>
                <p className="text-gray-600">Review your document pages and extracted text content</p>
              </div>
              
              {pdfPages.length > 0 ? (
                <div className="space-y-6">
                  {/* Page Navigation Header */}
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
                    
                    {/* Page Number Indicators */}
                    <div className="flex items-center space-x-2">
                      {pdfPages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToPage(index)}
                          className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                            currentPageIndex === index
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
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
                              <img 
                                src={pdfPages[currentPageIndex].canvas} 
                                alt={`Page ${pdfPages[currentPageIndex].pageNumber}`}
                                className="w-full h-auto max-h-96 object-contain"
                              />
                            </div>
                          </div>
                          
                          {/* Extracted Text */}
                          <div>
                             <DocumentEditor  />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Controls */}
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
                        onClick={handleNextStep}
                        disabled={isProcessing}
                        className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? 'Processing...' : 'Approve & Continue'}
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
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No PDF pages to display</p>
                </div>
              )}
            </div>
          )}

          {/* Document Analysis */}
          {currentStep === 2 && (
            <div className="py-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Document Analysis</h3>
                <p className="text-gray-600 mb-6">Our system has analyzed your uploaded documents and identified some missing documents that may be required for accurate processing.</p>
              </div>

              {/* Missing Documents Section */}
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
                        {uploadedEStamp ? `Uploaded: ${uploadedEStamp.name}` : 'Document missing'}
                      </p>
                    </div>
                    <div className="ml-4">
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        id="estamp-upload"
                        onChange={handleEStampUpload}
                      />
                      <label htmlFor="estamp-upload">
                        <button 
                          type="button"
                          className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                            uploadedEStamp 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-gray-800 hover:bg-gray-900'
                          }`}
                          onClick={() => document.getElementById('estamp-upload').click()}
                        >
                          {uploadedEStamp ? 'Uploaded ✓' : 'Upload'}
                        </button>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Progress */}
              {/* <div className="text-center mb-8">
                <div className="max-w-xs mx-auto mb-6">
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full animate-pulse w-3/4"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Analyzing document content and structure...</p>
              </div>
               */}
              <div className="text-center">
                <button
                  onClick={handleNextStep}
                  disabled={isProcessing}
                  className="px-8 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Continue to Report Generation'}
                </button>
              </div>
            </div>
          )}

          {/* Generate Report */}
          {currentStep === 3 && (
  <div>
    {!report ? (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-6 bg-blue-600 rounded-lg flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Ready to Generate Report</h3>
        <p className="text-gray-600 mb-8">Your document has been analyzed. Generate your comprehensive report now.</p>
        
        <button
          onClick={generateReport}
          disabled={isProcessing}
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Generating Report...' : 'Generate Report'}
        </button>
      </div>
    ) : (
      <div className="py-8">
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Generated Report & Document Preview</h3>
          <p className="text-gray-600">Review your document pages, extracted text content, and the generated report</p>
        </div>

        {/* PDF Pages Carousel View */}
        {pdfPages.length > 0 ? (
          <div className="space-y-6 mb-8">
            {/* Page Navigation Header */}
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
              
              {/* Page Number Indicators */}
              <div className="flex items-center space-x-2">
                {pdfPages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToPage(index)}
                    className={`w-8 h-8 text-xs font-medium rounded-lg transition-colors ${
                      currentPageIndex === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
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
                        <img 
                          src={pdfPages[currentPageIndex].canvas} 
                          alt={`Page ${pdfPages[currentPageIndex].pageNumber}`}
                          className="w-full h-auto max-h-96 object-contain"
                        />
                      </div>
                    </div>
                    
                    {/* OCR Extracted Text */}
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">OCR Extracted Text</h5>
                      <div className="border border-gray-200 rounded-lg bg-white p-4 max-h-96 overflow-y-auto">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                          {pdfPages[currentPageIndex].text || 'No text extracted from this page'}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={goToPreviousPage}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={pdfPages.length <= 1}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Page</span>
              </button>
              
              {/* <div className="text-center">
                <button
                  onClick={handleNextStep}
                  disabled={isProcessing}
                  className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Approve & Continue'}
                </button>
              </div> */}
              
              <button
                onClick={goToNextPage}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={pdfPages.length <= 1}
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No PDF pages to display</p>
          </div>
        )}

        {/* Report Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {/* <h3 className="text-2xl font-semibold text-gray-800">Generated Report Summary</h3>
            <p className="text-gray-600 mt-1">Review and edit your document analysis report</p> */}
          </div>
          <div className="flex space-x-3">
            {/* {!isEditingReport ? (
              <button
                onClick={handleEditReport}
                className="px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleUpdateReport}
                  className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Update
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )} */}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          {/* <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Document Analysis Report</h4>
                <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div> */}
          
          {/* <div className="p-6">
            {isEditingReport ? (
              <div>
                <textarea
                  value={editableReport}
                  onChange={(e) => setEditableReport(e.target.value)}
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Edit your report content here..."
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                  {report}
                </pre>
              </div>
            )}
          </div> */}
        </div>
        
        <div className="mt-8 text-center">
          <button
            onClick={handleNextStep}
            disabled={isProcessing}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Continue to Final Step'}
          </button>
        </div>
      </div>
    )}
  </div>
)}
          {/* Edit and Download Report */}
          {currentStep === 4 && (
            <div className="py-8">
              {report ? (
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Your Report is Ready!</h3>
                  {/* <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-2">Document Analysis Report</h4>
                        <pre className="text-sm text-gray-600 whitespace-pre-wrap">{report}</pre>
                      </div>
                    </div>
                  </div> */}
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {/* <button
                      onClick={() => alert('Opening report editor...')}
                      className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Report</span>
                    </button> */}
                    <a
                      href={pdf}
                      download
                      onClick={() => alert('Downloading report...')}
                      className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
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
  );
};

export default App;