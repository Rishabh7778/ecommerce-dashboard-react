import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useBulkAddProductsMutation, type Product } from '../services/productApi';
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const BulkUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<Product[]>([]);
  const [bulkAddProducts, { isLoading }] = useBulkAddProductsMutation();

  // 1. File Select hone par sirf data read karke state mein rakhenge
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      
      // Excel to JSON conversion
      const data = XLSX.utils.sheet_to_json(ws) as Product[];
      setExcelData(data); // Data state mein save ho gaya
    };
    reader.readAsBinaryString(selectedFile);
  };

  // 2. Button click hone par Backend (SQL) ko bhejenge
  const handleUploadToServer = async () => {
    if (excelData.length === 0) {
      alert("Pehle valid excel file select karein!");
      return;
    }

    try {
      // Loop karke ya bulk endpoint par data bhejein
      await bulkAddProducts(excelData).unwrap();
      alert("Mubarak ho! Saara data SQL database mein save ho gaya.");
      setFile(null);
      setExcelData([]);
    } catch (err) {
      console.error(err);
      alert("Upload failed! Backend console check karein.");
    }
  };

  return (
    <div className="mx-auto p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-white shadow-sm max-w-md">
      <div className="flex flex-col items-center text-center">
        <UploadCloud size={48} className="text-gray-300 mb-4" />
        <h3 className="font-bold text-[#253D4E] text-lg mb-1">Bulk Product Upload</h3>
        <p className="text-xs text-gray-400 mb-6">Upload .xlsx or .xls files only</p>
        
        {/* Custom File Input */}
        <label className="w-full mb-4">
          <input 
            type="file" 
            className="hidden" 
            accept=".xlsx, .xls" 
            onChange={handleFileSelect} 
          />
          <div className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 py-3 px-4 rounded-xl text-sm font-medium text-gray-600 transition-all">
            {file ? file.name : "Select Excel File"}
          </div>
        </label>

        {/* File ki details agar select ho gayi ho */}
        {excelData.length > 0 && (
          <div className="flex items-center gap-2 text-green-600 text-sm mb-6 bg-green-50 px-4 py-2 rounded-lg">
            <CheckCircle size={16} />
            <span>{excelData.length} items found in sheet</span>
          </div>
        )}

        {/* MAIN UPLOAD BUTTON */}
        <button 
          onClick={handleUploadToServer}
          disabled={isLoading || excelData.length === 0}
          className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
            isLoading || excelData.length === 0 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
            : 'bg-[#3BB77E] hover:bg-[#2fa06c] text-white'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Saving to SQL Database...
            </>
          ) : (
            "Upload to Server"
          )}
        </button>

        {/* Error indication */}
        {!file && (
          <p className="mt-4 text-[10px] text-gray-400 flex items-center gap-1">
            <AlertCircle size={12} /> Make sure headers match SQL schema
          </p>
        )}
      </div>
    </div>
  );
};

export default BulkUpload;