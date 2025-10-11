import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://lnauoicvoiwepewwssny.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuYXVvaWN2b2l3ZXBld3dzc255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3OTQ5MDgsImV4cCI6MjA3MTM3MDkwOH0.sKc4IqOPldDDMwd-a8uqZLLSnvB47o0A5vRvrpjBsX8"
);
