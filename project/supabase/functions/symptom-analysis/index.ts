import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function analyzeSymptoms(symptoms: string[]) {
  try {
    const searchQuery = symptoms.join('+') + '+disease+symptoms';
    const url = `https://www.google.com/search?q=${searchQuery}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const html = await response.text();
    
    // Extract relevant information from the response
    const results = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = doc.querySelectorAll('.BNeawe');
    
    elements.forEach(element => {
      const text = element.textContent;
      if (text && text.length > 50) {  // Filter out short snippets
        results.push(text);
      }
    });

    // Process the results
    const analysis = {
      possibleConditions: [],
      recommendations: ['Consult a doctor', 'Get relevant tests', 'Monitor symptoms'],
      urgencyLevel: determineUrgency(symptoms),
      shouldSeeDoctor: true,
      insights: results.slice(0, 3)  // Take top 3 results
    };

    return {
      analysis,
      results: results.slice(0, 5)  // Return top 5 results
    };
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw error;
  }
}

function determineUrgency(symptoms: string[]): string {
  const urgentSymptoms = [
    'chest pain',
    'difficulty breathing',
    'severe pain',
    'unconscious',
    'bleeding',
    'stroke',
    'heart attack'
  ];

  const hasUrgentSymptom = symptoms.some(symptom =>
    urgentSymptoms.some(urgent => symptom.toLowerCase().includes(urgent))
  );

  return hasUrgentSymptom ? 'high' : 'medium';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms } = await req.json();

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      throw new Error('Invalid symptoms provided');
    }

    const result = await analyzeSymptoms(symptoms);

    return new Response(
      JSON.stringify(result),
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