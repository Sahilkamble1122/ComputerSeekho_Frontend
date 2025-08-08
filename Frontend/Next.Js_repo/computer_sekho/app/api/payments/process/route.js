import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { studentId, paymentTypeId, paymentDate, courseId, batchId, amount, status } = body;

    // Validate required fields
    if (!studentId || !amount || !paymentTypeId) {
      return NextResponse.json(
        { error: 'Missing required fields: studentId, amount, paymentTypeId' },
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

    // Step 1: Get current student data to check pending fees
    const studentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/students/${studentId}`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

    if (!studentResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch student data' },
        { status: 400 }
      );
    }

    const student = await studentResponse.json();
    
    // Validate payment amount
    if (amount > student.pendingFees) {
      return NextResponse.json(
        { error: 'Payment amount cannot exceed pending fees' },
        { status: 400 }
      );
    }

    // Step 2: Process payment and create receipt
    const paymentData = {
      studentId: parseInt(studentId),
      paymentTypeId: parseInt(paymentTypeId),
      paymentDate: paymentDate || new Date().toISOString().split('T')[0],
      courseId: parseInt(courseId),
      batchId: parseInt(batchId),
      amount: parseFloat(amount),
      status: status || 'Successful'
    };

    const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/payment-with-type`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      return NextResponse.json(
        { error: `Payment processing failed: ${errorText}` },
        { status: 400 }
      );
    }

    const paymentResult = await paymentResponse.json();

    // Step 3: Update student's pending fees
    const newPendingFees = student.pendingFees - amount;
    
    const updateStudentData = {
      ...student,
      pendingFees: newPendingFees
    };

    const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/students/${studentId}`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateStudentData)
    });

    if (!updateResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to update student pending fees' },
        { status: 400 }
      );
    }

    // Step 4: Create receipt record
    const receiptData = {
      paymentId: paymentResult.paymentId,
      studentId: parseInt(studentId),
      receiptAmount: parseFloat(amount),
      receiptDate: paymentDate || new Date().toISOString().split('T')[0],
      receiptNumber: `RCP-${Date.now()}-${studentId}`,
      paymentTypeId: parseInt(paymentTypeId)
    };

    const receiptResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/receipts`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(receiptData)
    });

    if (!receiptResponse.ok) {
      console.warn('Failed to create receipt record, but payment was processed');
    }

    return NextResponse.json({
      success: true,
      paymentId: paymentResult.paymentId,
      newPendingFees: newPendingFees,
      message: 'Payment processed successfully'
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
