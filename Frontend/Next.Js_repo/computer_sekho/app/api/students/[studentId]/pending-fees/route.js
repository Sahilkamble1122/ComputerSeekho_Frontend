import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  try {
    const { studentId } = params;
    const { searchParams } = new URL(request.url);
    const pendingFees = searchParams.get('pendingFees');

    if (!studentId || pendingFees == null) {
      return NextResponse.json(
        { error: 'studentId and pendingFees are required' },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/students/${studentId}/pending-fees?pendingFees=${encodeURIComponent(pendingFees)}`;
    const res = await fetch(backendUrl, {
      method: 'PATCH',
      headers: { 'Authorization': authHeader }
    });

    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch { json = text; }

    return NextResponse.json(json, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


