import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { studentId } = params;
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/students/${studentId}`;
    const res = await fetch(backendUrl, {
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


