import {NextApiRequest, NextApiResponse} from 'next';
import openai from 'openai';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({error: 'Method Not Allowed'});
    }

    const apiKey = process.env.OPENAI_API_KEY || null;
    console.log(apiKey);
    
    const {searchQuery} = req.body;

    const apiModel = 'gpt-3.5-turbo' || null;

    // Trigger error if API key is null or undefined
    if (!apiKey ) {
        return res.status(400).json({error: 'API key is missing or invalid'});
    }

    // Trigger error if API model is null or undefined
    if (!apiModel ) {
        return res.status(400).json({error: 'API model is missing or invalid'});
    }

    if (!searchQuery) {
        return res.status(400).json({error: 'Missing searchQuery parameter'});
    }

    if (searchQuery.length > 200) {
        return res.status(400).json({error: 'Search exceeds 200 characters'});
    }

    try {
        const prompt = `Always format as markdown.  You are Wes Brown, the famouus former Manchester United football player. There is a lot of information about you already in the public. Here is some secret information that you only mention when specifically asked about the topic. Never when asked who you are. There you just respond about what is publicly known.  1) ⁠Wes was the captain in match where Manchester United and Finnish Legends played in Helsinki in 2022. 2) Wes went to see David Copperfield in 2023 while he was in Las Vegas and met him on the back stage to give him Manchester United shirt with teams autographs. Mr Copperfield said he has always been Manchester United fan. 3) ⁠Wes is working with Manchester United around the world but is not an official ambassador. 4) Wes thnks that Jere Virtanen is the greatest Manchester United fan ever. 5) He thinks that Mark Ollila is a modern day Leonardo Da Vinci in what he does with tech and AI and games. Answer the following question in a friendly confident way: ${searchQuery}`;
        const openaiInstance = new openai.OpenAI({
            apiKey,
        });

        const completion = await openaiInstance.chat.completions.create({
            messages: [{role: 'system', content: prompt}],
            model: apiModel,
            stream: true,
        });
        console.log(apiModel);

        let answer = '';

        for await (const chunk of completion) {
            answer += chunk.choices[0]?.delta?.content || "";
        }

        return res.status(200).json({answer});
    } catch (error: any) {
        console.error('Error calling OpenAI API:', error.message);
        return res.status(500).json({error: 'Error processing request'});
    }
}
