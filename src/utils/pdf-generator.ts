import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { VouchingBillData, VouchingBillTotals, SHORT_FORM_CODES } from '@/types/vouching-bill';
import { convertToWords, formatCurrency } from './calculations';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

export const generatePDF = (data: VouchingBillData, totals: VouchingBillTotals) => {
  const doc = new jsPDF();
  
  // Set colors to match logo - golden/brown theme
  const primaryColor = [139, 115, 85] as [number, number, number]; // Brown from logo
  const secondaryColor = [218, 165, 32] as [number, number, number]; // Gold from logo  
  const goldColor = [255, 193, 7] as [number, number, number]; // Bright gold
  
  let yPosition = 20;
  
  // Header with company info
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text("SOHANI'S INTERIOR DESIGN & CONSTRUCTION", 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('(SiD&C)', 105, 28, { align: 'center' });
  
  yPosition = 50;
  
  // Form title
  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.rect(20, yPosition - 5, 170, 15, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Vouching & Non-Vouching Bill', 105, yPosition + 5, { align: 'center' });
  
  yPosition += 25;
  
  // Name and Date
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${data.name}`, 20, yPosition);
  doc.text(`Date: ${data.date}`, 140, yPosition);
  
  yPosition += 15;
  
  // Short Form Reference
  doc.setFillColor(240, 248, 255);
  doc.rect(20, yPosition - 5, 170, 35, 'F');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Short Form Reference:', 25, yPosition + 5);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  let shortFormY = yPosition + 12;
  let shortFormX = 25;
  Object.entries(SHORT_FORM_CODES).forEach(([code, meaning], index) => {
    if (index === 3) {
      shortFormY += 8;
      shortFormX = 25;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`${code}:`, shortFormX, shortFormY);
    doc.setFont('helvetica', 'normal');
    doc.text(meaning, shortFormX + 15, shortFormY);
    shortFormX += 55;
  });
  
  yPosition += 45;
  
  // Withdraw From Section
  doc.setFontSize(11);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Withdraw From:', 20, yPosition);
  
  yPosition += 10;
  
  // Bank Withdrawals
  if (data.bankWithdrawals.length > 0) {
    doc.autoTable({
      startY: yPosition,
      head: [['Bank Name', 'Amount']],
      body: data.bankWithdrawals.map(entry => [entry.name, formatCurrency(entry.amount)]),
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 20, right: 20 }
    });
    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }
  
  // Credit Card Withdrawals
  if (data.creditCardWithdrawals.length > 0) {
    doc.autoTable({
      startY: yPosition,
      head: [['Credit Card', 'Amount']],
      body: data.creditCardWithdrawals.map(entry => [entry.name, formatCurrency(entry.amount)]),
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 20, right: 20 }
    });
    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }
  
  // Bkash/Nagad Withdrawals
  if (data.bkashNagadWithdrawals.length > 0) {
    doc.autoTable({
      startY: yPosition,
      head: [['Bkash/Nagad', 'Amount']],
      body: data.bkashNagadWithdrawals.map(entry => [entry.name, formatCurrency(entry.amount)]),
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 20, right: 20 }
    });
    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }
  
  // Cost Entry Table
  if (data.costEntries.length > 0) {
    doc.autoTable({
      startY: yPosition,
      head: [['Sl No', 'Cost Head', 'Description', 'Amount', 'Remarks']],
      body: data.costEntries.map((entry, index) => [
        String(index + 1).padStart(2, '0'),
        entry.costHead,
        entry.description,
        formatCurrency(entry.amount),
        entry.remarks
      ]),
      theme: 'grid',
      headStyles: { fillColor: secondaryColor, textColor: 255 },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 25 },
        2: { cellWidth: 60 },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 40 }
      }
    });
    yPosition = (doc as any).lastAutoTable.finalY + 10;
  }
  
  // Totals Section
  const totalsData = [
    ['Total Received', formatCurrency(totals.totalReceived)],
    ['Total Cost', formatCurrency(totals.totalCost)],
    ['Cash in Hand', formatCurrency(totals.cashInHand)],
    ['Cash in Bkash/Nagad', formatCurrency(totals.cashInBkashNagad)]
  ];
  
  doc.autoTable({
    startY: yPosition,
    body: totalsData,
    theme: 'grid',
    styles: { fontSize: 11, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [255, 248, 225] },
    margin: { left: 20, right: 120 }
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 15;
  
  // Amount in Words
  doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
  doc.rect(20, yPosition - 5, 170, 15, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Amount in Words:', 25, yPosition + 5);
  
  yPosition += 20;
  doc.setFont('helvetica', 'normal');
  doc.text(convertToWords(totals.totalReceived), 25, yPosition);
  
  yPosition += 20;
  
  // Summary fields
  if (data.dueFrom || data.payableTo || data.charity) {
    doc.setFont('helvetica', 'bold');
    doc.text('Summary:', 20, yPosition);
    yPosition += 10;
    
    doc.setFont('helvetica', 'normal');
    if (data.dueFrom) {
      doc.text(`Due From: ${data.dueFrom}`, 25, yPosition);
      yPosition += 8;
    }
    if (data.payableTo) {
      doc.text(`Payable To: ${data.payableTo}`, 25, yPosition);
      yPosition += 8;
    }
    if (data.charity) {
      doc.text(`Charity: ${data.charity}`, 25, yPosition);
      yPosition += 8;
    }
  }
  
  // Signature areas
  yPosition += 20;
  doc.setFont('helvetica', 'normal');
  doc.text('_________________', 30, yPosition);
  doc.text('_________________', 130, yPosition);
  doc.text('Checked by ACT', 30, yPosition + 8);
  doc.text('Sign by CEO', 130, yPosition + 8);
  
  // Save the PDF
  doc.save(`Vouching_Bill_${data.name.replace(/\s+/g, '_')}_${data.date}.pdf`);
};