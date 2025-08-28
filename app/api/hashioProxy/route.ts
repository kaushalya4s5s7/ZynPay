// app/api/hashioProxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const HASHIO_URL = 'https://testnet.hashio.io/api';
  
  try {
    const body = await request.json();
    console.log('Proxying request to Hashio:', body); // For debugging
    
    const hashioRes = await fetch(HASHIO_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ZynPay-kaia-App/1.0',
      },
      body: JSON.stringify(body),
    });

    if (!hashioRes.ok) {
      throw new Error(`Hashio responded with status: ${hashioRes.status}`);
    }

    const data = await hashioRes.json();
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('Hashio proxy error:', error); // For debugging
    return NextResponse.json({ 
      error: 'Failed to fetch from Hashio', 
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}