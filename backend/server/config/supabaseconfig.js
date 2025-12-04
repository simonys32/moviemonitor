
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv';

import { fileURLToPath } from 'url';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

const supabaseUrl = process.env.HOST_URL;
const supabaseKey = process.env.API_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;