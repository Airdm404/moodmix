import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { image_url } = await req.json();

    if (!image_url) {
      return new Response(JSON.stringify({ error: 'Image URL is required.' }), { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: "You're a helpful assistant that generates music playlists."
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: `Analyze the emotions in this image and generate a 10-song playlist that reflects those emotions. Format the playlist so that each song is on a new line, like this:

1. "Song Title" by Artist
2. "Song Title" by Artist
3. "Song Title" by Artist
4. "Song Title" by Artist
5. "Song Title" by Artist
6. "Song Title" by Artist
7. "Song Title" by Artist
8. "Song Title" by Artist
9. "Song Title" by Artist
10. "Song Title" by Artist` },
            { type: 'image_url', image_url: { url: image_url } },
          ],
        },
      ],
    });

    const analysisResult = completion.choices[0].message.content.trim();
    return new Response(JSON.stringify({ result: analysisResult }), { status: 200 });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return new Response(JSON.stringify({ error: 'Failed to analyze image' }), { status: 500 });
  }
}