import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('[API] GET /api/todos - Fetching from Supabase');
    
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('[API] GET /api/todos - Supabase Error:', error);
      throw error;
    }
    
    console.log('[API] GET /api/todos - Success, found', data?.length || 0, 'todos');
    return NextResponse.json(data || []);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[API] GET /api/todos - Error:', errorMessage);
    return NextResponse.json({
      error: 'Failed to fetch todos',
      details: errorMessage
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[API] POST /api/todos - Creating new todo');
    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('todos')
      .insert([{
        title,
        description: description || null,
        completed: false
      }])
      .select()
      .single();
    
    if (error) {
      console.error('[API] POST /api/todos - Supabase Error:', error);
      throw error;
    }

    console.log('[API] POST /api/todos - Success, created todo:', data?.id);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[API] POST /api/todos - Error:', errorMessage);
    return NextResponse.json({
      error: 'Failed to create todo',
      details: errorMessage
    }, { status: 500 });
  }
}