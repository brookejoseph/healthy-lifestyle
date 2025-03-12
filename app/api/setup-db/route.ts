import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Create health_data table
    const { error: tableError } = await supabase.rpc("create_health_data_table", {})

    if (tableError) {
      return NextResponse.json({ error: tableError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Database setup completed successfully" })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json({ error: "Failed to set up database" }, { status: 500 })
  }
}

// SQL function to create the health_data table
// This should be created in the Supabase SQL editor:
/*
create or replace function create_health_data_table()
returns void as $$
begin
  -- Create health_data table if it doesn't exist
  create table if not exists health_data (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    data jsonb not null,
    analyzed boolean default false,
    longevity_score integer,
    health_age integer,
    focus_areas text[],
    insights text,
    created_at timestamp with time zone default now()
  );

  -- Create index on user_id
  create index if not exists health_data_user_id_idx on health_data(user_id);
  
  -- Set up RLS policies
  alter table health_data enable row level security;
  
  -- Create policy to allow users to select their own data
  drop policy if exists "Users can view their own health data" on health_data;
  create policy "Users can view their own health data"
    on health_data for select
    using (auth.uid() = user_id);
  
  -- Create policy to allow users to insert their own data
  drop policy if exists "Users can insert their own health data" on health_data;
  create policy "Users can insert their own health data"
    on health_data for insert
    with check (auth.uid() = user_id);
  
  -- Create policy to allow users to update their own data
  drop policy if exists "Users can update their own health data" on health_data;
  create policy "Users can update their own health data"
    on health_data for update
    using (auth.uid() = user_id);
  
  -- Create policy to allow users to delete their own data
  drop policy if exists "Users can delete their own health data" on health_data;
  create policy "Users can delete their own health data"
    on health_data for delete
    using (auth.uid() = user_id);
end;
$$ language plpgsql;
*/

