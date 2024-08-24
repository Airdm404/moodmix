import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req) {
  const { moods } = await req.json();

  const moodNames = moods.join(', ');
  const prompt = `Generate a 10-song playlist where each song is a blend of the following moods: ${moodNames}. Provide a mix of genres and styles that reflect these blended moods.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates music playlists." },
        { role: "user", content: prompt },
      ],
    });

    const generatedPlaylist = completion.choices[0].message.content.trim().split('\n');
    return new Response(JSON.stringify({ playlist: generatedPlaylist }), { status: 200 });
  } catch (error) {
    console.error('Error generating playlist:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate playlist' }), { status: 500 });
  }
}