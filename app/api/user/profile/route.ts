/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /app/api/user/profile/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/db';
import { authOptions } from '../../auth/authOptions';

// GET /api/user/profile - Get user profile
export async function GET(request: any) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        partnerName: true,
        phoneNumber: true,
        partnerPhoneNumber: true,
      },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request: any) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const data = await request.json();
    
    // Validate phone number format if provided
    if (data.phoneNumber && !isValidPhoneNumber(data.phoneNumber)) {
      return NextResponse.json({ 
        error: 'Invalid phone number format. Please include country code (e.g., +1234567890)' 
      }, { status: 400 });
    }
    
    if (data.partnerPhoneNumber && !isValidPhoneNumber(data.partnerPhoneNumber)) {
      return NextResponse.json({ 
        error: 'Invalid partner phone number format. Please include country code (e.g., +1234567890)' 
      }, { status: 400 });
    }
    
    // Only allow updating certain fields
    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: data.name,
        partnerName: data.partnerName,
        phoneNumber: data.phoneNumber,
        partnerPhoneNumber: data.partnerPhoneNumber,
      },
      select: {
        id: true,
        name: true,
        email: true,
        partnerName: true,
        phoneNumber: true,
        partnerPhoneNumber: true,
      },
    });
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
}

// Helper function to validate phone number format
function isValidPhoneNumber(phoneNumber: any) {
  // Allow only digits, plus sign at the beginning, and require at least 10 digits
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phoneNumber);
}