import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://khclruldvcdqvawtofwe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtoY2xydWxkdmNkcXZhd3RvZndlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1NjIyMTksImV4cCI6MjA3OTEzODIxOX0.LsfX4eoqyT_Nk8fJm70MP_OM5C3Rp5SCVXTyoe_M9sY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)