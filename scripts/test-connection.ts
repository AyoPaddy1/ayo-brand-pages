import { supabase } from '../lib/supabase';

async function testConnection() {
  console.log('🔌 Testing Supabase connection...\n');

  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('_test')
      .select('*')
      .limit(1);

    if (error && error.message.includes('relation "_test" does not exist')) {
      console.log('✅ Connection successful!');
      console.log('✅ Database is accessible\n');
      
      // Check if vector extension is enabled
      const { data: extensions, error: extError } = await supabase
        .rpc('pg_available_extensions')
        .select('*');
      
      if (!extError) {
        console.log('✅ Can query database extensions\n');
      }
      
      return true;
    } else if (error) {
      console.error('❌ Connection error:', error.message);
      return false;
    }

    console.log('✅ Connection successful!\n');
    return true;

  } catch (error: any) {
    console.error('❌ Fatal error:', error.message);
    return false;
  }
}

testConnection()
  .then((success) => {
    if (success) {
      console.log('🎉 Ready to initialize database!');
      console.log('\nNext step: Run the SQL schema in Supabase SQL Editor');
      process.exit(0);
    } else {
      console.log('💥 Connection failed. Check your credentials.');
      process.exit(1);
    }
  });
