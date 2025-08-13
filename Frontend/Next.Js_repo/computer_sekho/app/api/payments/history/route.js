import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Get token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    // Fetch all receipts and filter by studentId
    const receiptsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/receipts`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    let receipts = [];
    if (receiptsResponse.ok) {
      const allReceipts = await receiptsResponse.json();
      // Filter receipts by studentId
      receipts = Array.isArray(allReceipts) 
        ? allReceipts.filter(receipt => String(receipt.studentId) === String(studentId))
        : (allReceipts.data || []).filter(receipt => String(receipt.studentId) === String(studentId));
    }

    // Fetch all payments and filter by studentId
    const paymentsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/payments`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    let payments = [];
    if (paymentsResponse.ok) {
      const allPayments = await paymentsResponse.json();
      // Filter payments by studentId
      payments = Array.isArray(allPayments)
        ? allPayments.filter(payment => String(payment.studentId) === String(studentId))
        : (allPayments.data || []).filter(payment => String(payment.studentId) === String(studentId));
    }

    // Create comprehensive payment history
    let paymentHistory = [];

    // First, add all receipts with their payment details
    receipts.forEach(receipt => {
      const payment = payments.find(p => p.paymentId === receipt.paymentId);
      paymentHistory.push({
        ...receipt,
        paymentDetails: payment || null,
        isReceipt: true
      });
    });

    // Then, add any payments that don't have receipts (like initial payments)
    payments.forEach(payment => {
      const hasReceipt = paymentHistory.some(item => item.paymentId === payment.paymentId);
      if (!hasReceipt) {
        paymentHistory.push({
          receiptId: `payment_${payment.paymentId}`,
          receiptNumber: `P${payment.paymentId}`,
          receiptAmount: payment.amount,
          receiptDate: payment.paymentDate,
          createdDate: payment.paymentDate,
          studentId: payment.studentId,
          paymentId: payment.paymentId,
          paymentDetails: payment,
          isReceipt: false,
          isInitialPayment: true // Mark as initial payment if no receipt exists
        });
      }
    });

    // Sort by date (oldest first to show initial payment first)
    paymentHistory.sort((a, b) => {
      const dateA = new Date(a.receiptDate || a.createdDate || a.paymentDate || 0);
      const dateB = new Date(b.receiptDate || b.createdDate || b.paymentDate || 0);
      return dateA - dateB;
    });

    return NextResponse.json({
      success: true,
      data: paymentHistory
    });

  } catch (error) {
    console.error('Payment history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
