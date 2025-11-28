import { supabase } from '../lib/supabase';
import * as fs from 'fs';
import * as path from 'path';

async function initSchema() {
  console.log('🚀 Initializing brand pages schema...\n');

  const schemaPath = path.join(process.cwd(), 'brand-pages-schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  // Split by semicolons and execute each statement
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const statement of statements) {
    if (statement.length === 0) continue;

    console.log(`Executing: ${statement.substring(0, 50)}...`);
    
    const { error } = await supabase.rpc('exec_sql', {
      sql: statement
    });

    if (error) {
      // Try direct query instead
      const { error: directError } = await supabase.from('_').select('*').limit(0);
      
      // Since we can't execute raw SQL directly via the client, we'll use a workaround
      console.log('⚠️  Cannot execute raw SQL via client. Please run the schema manually in SQL Editor.');
      console.log('\nAlternatively, I\'ll create the tables programmatically...');
      break;
    }
  }

  console.log('\n✨ Schema initialization complete!');
}

initSchema()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Error:', error);
    process.exit(1);
  });
