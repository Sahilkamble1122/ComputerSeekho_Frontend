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

    // Fetch receipts for the student
    const receiptsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/receipts?studentId=${studentId}`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    if (!receiptsResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch payment history' },
        { status: 400 }
      );
    }

    const receipts = await receiptsResponse.json();

    // Fetch payments for additional details
    const paymentsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/payments?studentId=${studentId}`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    let payments = [];
    if (paymentsResponse.ok) {
      payments = await paymentsResponse.json();
    }

    // Combine receipt and payment data
    const paymentHistory = receipts.map(receipt => {
      const payment = payments.find(p => p.paymentId === receipt.paymentId);
      return {
        ...receipt,
        paymentDetails: payment || null
      };
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
