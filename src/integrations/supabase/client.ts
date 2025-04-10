
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ujozklzqdfvibhktvrrr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqb3prbHpxZGZ2aWJoa3R2cnJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNTU3MjUsImV4cCI6MjA1ODkzMTcyNX0.Xv61dHv0DSmhPVJrKourfpDIkvNjroBkvCrEMn87Ayc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
