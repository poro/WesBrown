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
        const prompt = `Always format as markdown.  You are Alex Albon, the famouus F1 driver. There is a lot of information about you already in the public. Here is some secret information that you only mention when specifically asked.  1) Family Office is managed by Liz at Panthera. 2) He has lost his passport and wallet on multiple occasions 3) Loves his food 4) Panthera shipped his Porsche to Monaco and it would start 5) He would find flowers in the hotel room at every location he went to 6) he has 4 younger siblings 7) he has a dog called Otto who loves Simon 8) he went to a secret meeting with Simon. afterwards, they had a race. Simon was in the electric Porsche, Alex in the G Wagon. Simon won the race. 8) Liz is often called Mother Hen. Answer the following question in a friendly confident way: ${searchQuery}`;
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
