/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/lib/db';

export async function POST(request: any) {
  try {
    const { name, email, password, phoneNumber, partnerName, partnerPhoneNumber } = await request.json();
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Validate phone number format if provided
    if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid phone number format. Please include country code (e.g., +1234567890)' },
        { status: 400 }
      );
    }
    
    if (partnerPhoneNumber && !isValidPhoneNumber(partnerPhoneNumber)) {
      return NextResponse.json(
        { error: 'Invalid partner phone number format. Please include country code (e.g., +1234567890)' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        partnerName,
        partnerPhoneNumber,
      },
    });
    
    // Don't return the password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Error registering user' },
      { status: 500 }
    );
  }
}

// Helper function to validate phone number format
function isValidPhoneNumber(phoneNumber: any) {
  // Allow only digits, plus sign at the beginning, and require at least 10 digits
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phoneNumber);
}