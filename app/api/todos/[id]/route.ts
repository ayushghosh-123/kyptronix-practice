import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('[API] GET /api/todos/[id] - Fetching todo:', id);
    
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error('[API] GET /api/todos/[id] - Not found or error:', error);
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[API] GET /api/todos/[id] - Error:', errorMessage);
    return NextResponse.json({ error: 'Failed to fetch todo', details: errorMessage }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, completed } = body;

    console.log('[API] PUT /api/todos/[id] - Updating todo:', id);
    
    const { data, error } = await supabase
      .from('todos')
      .update({ title, description, completed })
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) {
      console.error('[API] PUT /api/todos/[id] - Not found or error:', error);
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[API] PUT /api/todos/[id] - Error:', errorMessage);
    return NextResponse.json({ error: 'Failed to update todo', details: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('[API] DELETE /api/todos/[id] - Deleting todo:', id);
    
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('[API] DELETE /api/todos/[id] - Error:', error);
      throw error;
    }

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[API] DELETE /api/todos/[id] - Error:', errorMessage);
    return NextResponse.json({ error: 'Failed to delete todo', details: errorMessage }, { status: 500 });
  }
}