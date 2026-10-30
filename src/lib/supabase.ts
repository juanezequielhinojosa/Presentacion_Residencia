import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ehuepkuoaepkfyedlant.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_9ctmokJS8yxVNMy9LYDf8w_YVg-VCVX';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
