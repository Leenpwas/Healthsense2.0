import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import { format } from 'npm:date-fns@3.3.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationData {
  userId: string;
  phoneNumber: string;
  lastAssessment?: Date;
  assessmentScores?: Record<string, number>;
}

function generateMessage(data: NotificationData): string {
  const baseUrl = Deno.env.get('APP_URL');
  const { lastAssessment, assessmentScores } = data;

  let message = 'Time for your mental health check-in! ';

  if (lastAssessment) {
    const lastCheck = format(new Date(lastAssessment), 'MMM d');
    message += `Your last assessment was on ${lastCheck}. `;
  }

  if (assessmentScores) {
    const wellbeingScore = assessmentScores.wellbeing || 0;
    message += `Your previous well-being score was ${wellbeingScore}/100. `;
  }

  message += `\nComplete your assessment here: ${baseUrl}/mental-health`;

  return message;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get users due for notifications
    const now = new Date();
    const { data: notifications, error: notificationError } = await supabase
      .from('notification_settings')
      .select(`
        *,
        users:auth.users(id, phone_number),
        assessments:mental_health_assessments(
          completed_at,
          scores
        )
      `)
      .lte('next_notification', now)
      .eq('assessment_reminders', true);

    if (notificationError) throw notificationError;

    // Process each notification
    for (const notification of notifications) {
      const phoneNumber = notification.users?.phone_number;
      if (!phoneNumber) continue;

      const lastAssessment = notification.assessments?.[0];
      const message = generateMessage({
        userId: notification.users.id,
        phoneNumber,
        lastAssessment: lastAssessment?.completed_at,
        assessmentScores: lastAssessment?.scores
      });

      // Send SMS (implement your SMS provider integration here)
      console.log(`Sending to ${phoneNumber}: ${message}`);

      // Calculate next notification
      const nextNotification = new Date();
      nextNotification.setDate(nextNotification.getDate() + 7);

      // Update notification history and next schedule
      await supabase
        .from('notification_settings')
        .update({
          last_notification: now.toISOString(),
          next_notification: nextNotification.toISOString(),
          notification_history: supabase.sql`notification_history || ${JSON.stringify([{
            sent_at: now.toISOString(),
            message
          }])}::jsonb`
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