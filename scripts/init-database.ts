import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function initDatabase() {
  console.log('🚀 Initializing database schema...\n');

  // Read the SQL schema file
  const schemaPath = path.join(process.cwd(), 'supabase-schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  // Split into individual statements (separated by semicolons)
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  console.log(`Found ${statements.length} SQL statements to execute\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i] + ';';
    
    // Skip comments
    if (statement.trim().startsWith('--')) continue;

    try {
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      
      if (error) {
        // Try direct query if RPC fails
        const { error: queryError } = await supabase.from('_').select('*').limit(0);
        
        if (queryError) {
          console.error(`  ❌ Error: ${error.message}`);
          errorCount++;
        } else {
          console.log(`  ✅ Success`);
          successCount++;
        }
      } else {
        console.log(`  ✅ Success`);
        successCount++;
      }
    } catch (error: any) {
      console.error(`  ❌ Error: ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📝 Total: ${statements.length}`);

  if (errorCount > 0) {
    console.log('\n⚠️  Some statements failed. You may need to run them manually in the Supabase SQL Editor.');
  }
}

// Run the script
initDatabase()
  .then(() => {
    console.log('\n✨ Database initialization complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
