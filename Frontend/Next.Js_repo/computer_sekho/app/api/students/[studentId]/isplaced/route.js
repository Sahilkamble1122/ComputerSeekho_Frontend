import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  try {
    const { studentId } = params;
    const { searchParams } = new URL(request.url);
    const isPlaced = searchParams.get('isPlaced');

    if (!studentId || isPlaced === null) {
      return NextResponse.json(
        { error: 'studentId and isPlaced parameter are required' },
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

    // Call the Spring Boot backend endpoint
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/students/${studentId}/isplaced?isPlaced=${encodeURIComponent(isPlaced)}`;
    const res = await fetch(backendUrl, {
      method: 'PATCH',
      headers: { 'Authorization': authHeader }
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { error: `Failed to update placement status: ${errorText}` },
        { status: res.status }
      );
    }

    const updatedStudent = await res.json();
    return NextResponse.json(updatedStudent, { status: res.status });
  } catch (error) {
    console.error('Error updating student placement status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
