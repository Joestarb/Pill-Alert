import { createClient } from '@supabase/supabase-js';



const supabaseUrl = 'https://cvrnzmdgqzifbaxqgifd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2cm56bWRncXppZmJheHFnaWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzI5MzYsImV4cCI6MjA2Mzg0ODkzNn0.gOpQvrw_mtjwV3_jRCi8Pf579a1apovR3RBzmXIQJSI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
