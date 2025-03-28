import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get users who need notifications
    const now = new Date();
    const { data: notifications, error: notificationError } = await supabase
      .from('notification_settings')
      .select(`
        *,
        users:auth.users(phone_number)
      `)
      .lte('next_notification', now)
      .eq('assessment_reminders', true);

    if (notificationError) throw notificationError;

    // Process each notification
    for (const notification of notifications) {
      const phoneNumber = notification.users?.phone_number;
      if (!phoneNumber) continue;

      // Send SMS using your preferred service
      // This is a placeholder for SMS sending logic
      console.log(`Sending reminder to ${phoneNumber}`);

      // Update next notification time
      const nextNotification = new Date();
      nextNotification.setDate(nextNotification.getDate() + 7);

      await supabase
        .from('notification_settings')
        .update({
          last_notification: now.toISOString(),
          next_notification: nextNotification.toISOString()
        })
        .eq('id', notification.id);
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});