import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  
  // Modern color palette
  const deepBlue = [11, 61, 145] as [number, number, number]; // Deep blue header
  const teal = [0, 121, 107] as [number, number, number]; // Teal accent
  const gold = [251, 192, 45] as [number, number, number]; // Gold highlight
  const lightTeal = [178, 223, 219] as [number, number, number]; // Light teal for bank
  const lightPurple = [206, 147, 216] as [number, number, number]; // Light purple for credit card
  const lightOrange = [255, 183, 77] as [number, number, number]; // Light orange for bkash/nagad
  const softBlue = [227, 242, 253] as [number, number, number]; // Soft blue for reference
  const lightGray = [245, 245, 245] as [number, number, number]; // Light gray
  
  let yPosition = 20;
  
  // Header with gradient effect (simulate with rectangle)
  doc.setFillColor(deepBlue[0], deepBlue[1], deepBlue[2]);
  doc.rect(0, 0, 210, 45, 'F');
  
  // Add teal accent strip
  doc.setFillColor(teal[0], teal[1], teal[2]);
  doc.rect(0, 40, 210, 5, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text("SOHANI'S INTERIOR DESIGN & CONSTRUCTION", 105, 22, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('(SiD&C)', 105, 32, { align: 'center' });
  
  yPosition = 60;
  
  // Form title with gold banner
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(20, yPosition - 8, 170, 18, 'F');
  doc.setTextColor(0, 0, 0);  // Black text on gold
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Vouching & Non-Vouching Bill', 105, yPosition + 2, { align: 'center' });
  
  yPosition += 25;
  
  // Form Information Section - Light gray box
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(18, yPosition - 5, 174, 20, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(18, yPosition - 5, 174, 20, 'S');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${data.name}`, 25, yPosition + 5);
  doc.text(`Date: ${data.date}`, 140, yPosition + 5);
  
  yPosition += 25;
  
  // Short Form Reference - Soft blue info box
  doc.setFillColor(softBlue[0], softBlue[1], softBlue[2]);
  doc.rect(18, yPosition - 5, 174, 40, 'F');
  doc.setDrawColor(100, 149, 237);
  doc.setLineWidth(0.5);
  doc.rect(18, yPosition - 5, 174, 40, 'S');
  
  doc.setTextColor(deepBlue[0], deepBlue[1], deepBlue[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Short Form Reference:', 25, yPosition + 5);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  let shortFormY = yPosition + 15;
  let shortFormX = 25;
  Object.entries(SHORT_FORM_CODES).forEach(([code, meaning], index) => {
    if (index === 3) {
      shortFormY += 10;
      shortFormX = 25;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(`${code}:`, shortFormX, shortFormY);
    doc.setFont('helvetica', 'normal');
    doc.text(meaning, shortFormX + 18, shortFormY);
    shortFormX += 60;
  });
  
  yPosition += 50;
  
  // Withdraw From Section Title
  doc.setFontSize(14);
  doc.setTextColor(deepBlue[0], deepBlue[1], deepBlue[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Withdraw From:', 20, yPosition);
  
  yPosition += 15;
  
  // Bank Withdrawals - Light teal header
  if (data.bankWithdrawals.length > 0) {
    autoTable(doc, {
      startY: yPosition,
      head: [['Bank Name', 'Amount']],
      body: data.bankWithdrawals.map(entry => [entry.name, `৳ ${entry.amount.toLocaleString()}`]),
      theme: 'grid',
      headStyles: { fillColor: lightTeal, textColor: 0, fontStyle: 'bold', fontSize: 11 },
      alternateRowStyles: { fillColor: [249, 249, 249] },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
      },
      styles: { 
        fontSize: 10,
        cellPadding: 5,
        font: 'helvetica'
      }
    });
    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Credit Card Withdrawals - Light purple header
  if (data.creditCardWithdrawals.length > 0) {
    autoTable(doc, {
      startY: yPosition,
      head: [['Credit Card', 'Amount']],
      body: data.creditCardWithdrawals.map(entry => [entry.name, `৳ ${entry.amount.toLocaleString()}`]),
      theme: 'grid',
      headStyles: { fillColor: lightPurple, textColor: 0, fontStyle: 'bold', fontSize: 11 },
      alternateRowStyles: { fillColor: [249, 249, 249] },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
      },
      styles: { 
        fontSize: 10,
        cellPadding: 5,
        font: 'helvetica'
      }
    });
    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Bkash/Nagad Withdrawals - Light orange header
  if (data.bkashNagadWithdrawals.length > 0) {
    autoTable(doc, {
      startY: yPosition,
      head: [['Bkash/Nagad', 'Amount']],
      body: data.bkashNagadWithdrawals.map(entry => [entry.name, `৳ ${entry.amount.toLocaleString()}`]),
      theme: 'grid',
      headStyles: { fillColor: lightOrange, textColor: 0, fontStyle: 'bold', fontSize: 11 },
      alternateRowStyles: { fillColor: [249, 249, 249] },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
      },
      styles: { 
        fontSize: 10,
        cellPadding: 5,
        font: 'helvetica'
      }
    });
    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Cost Entry Table - Main dynamic table with alternating rows
  if (data.costEntries.length > 0) {
    autoTable(doc, {
      startY: yPosition,
      head: [['Sl No', 'Cost Head', 'Description', 'Amount', 'Remarks']],
      body: data.costEntries.map((entry, index) => [
        String(index + 1).padStart(2, '0'),
        entry.costHead,
        entry.description,
        `৳ ${entry.amount.toLocaleString()}`,
        entry.remarks
      ]),
      theme: 'grid',
      headStyles: { fillColor: teal, textColor: 255, fontStyle: 'bold', fontSize: 11 },
      alternateRowStyles: { fillColor: [248, 249, 250] },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center', fontStyle: 'normal' },
        1: { cellWidth: 25, fontStyle: 'normal' },
        2: { cellWidth: 60, fontStyle: 'normal' },
        3: { cellWidth: 40, halign: 'right', fontStyle: 'bold' },
        4: { cellWidth: 40, fontStyle: 'normal' }
      },
      styles: { 
        fontSize: 10,
        cellPadding: 5,
        font: 'helvetica'
      }
    });
    yPosition = (doc as any).lastAutoTable.finalY + 20;
  }
  
  // Summary Section - Totals box with gold highlight
  autoTable(doc, {
    startY: yPosition,
    body: [
      ['Total Received', `৳ ${totals.totalReceived.toLocaleString()}`],
      ['Total Cost', `৳ ${totals.totalCost.toLocaleString()}`],
      ['Cash in Hand', `৳ ${totals.cashInHand.toLocaleString()}`],
      ['Cash in Bkash/Nagad', `৳ ${totals.cashInBkashNagad.toLocaleString()}`]
    ],
    theme: 'grid',
    styles: { 
      fontSize: 12, 
      fontStyle: 'bold',
      cellPadding: 6,
      font: 'helvetica'
    },
    alternateRowStyles: { fillColor: [255, 248, 225] }, // Gold background
    margin: { left: 20, right: 120 },
    columnStyles: {
      0: { cellWidth: 'auto', fontStyle: 'bold' },
      1: { cellWidth: 'auto', halign: 'right', fontStyle: 'bold' }
    }
  });
  
  yPosition = (doc as any).lastAutoTable.finalY + 20;
  
  // Amount in Words - Gold banner
  doc.setFillColor(gold[0], gold[1], gold[2]);
  doc.rect(20, yPosition - 8, 170, 18, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Amount in Words:', 25, yPosition + 2);
  
  yPosition += 20;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.text(convertToWords(totals.totalReceived), 25, yPosition);
  
  yPosition += 25;
  
  // Summary fields section
  if (data.dueFrom || data.payableTo || data.charity) {
    // Calculate height based on number of fields
    const fieldCount = (data.dueFrom ? 1 : 0) + (data.payableTo ? 1 : 0) + (data.charity ? 1 : 0);
    
    // Summary header with light background
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(20, yPosition - 5, 170, 8 * fieldCount + 15, 'F');
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.5);
    doc.rect(20, yPosition - 5, 170, 8 * fieldCount + 15, 'S');
    
    doc.setTextColor(deepBlue[0], deepBlue[1], deepBlue[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Additional Summary:', 25, yPosition + 5);
    yPosition += 15;
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    if (data.dueFrom) {
      doc.text(`Due From: ${data.dueFrom}`, 30, yPosition);
      yPosition += 8;
    }
    if (data.payableTo) {
      doc.text(`Payable To: ${data.payableTo}`, 30, yPosition);
      yPosition += 8;
    }
    if (data.charity) {
      doc.text(`Charity: ${data.charity}`, 30, yPosition);
      yPosition += 8;
    }
    yPosition += 10;
  }
  
  // Footer separator line
  yPosition += 15;
  doc.setDrawColor(deepBlue[0], deepBlue[1], deepBlue[2]);
  doc.setLineWidth(1);
  doc.line(20, yPosition, 190, yPosition);
  
  // Signature areas with dotted lines
  yPosition += 20;
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Create dotted lines for signatures
  doc.setLineWidth(0.5);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(30, yPosition, 90, yPosition);
  doc.line(130, yPosition, 180, yPosition);
  
  // Reset line pattern
  doc.setLineDashPattern([], 0);
  
  doc.setFont('helvetica', 'normal');
  doc.text('Checked by ACT', 30, yPosition + 10);
  doc.text('Sign by CEO', 130, yPosition + 10);
  
  // Save the PDF with formatted filename
  const safeFileName = data.name.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Vouching_Bill_${safeFileName}_${data.date}.pdf`);
};