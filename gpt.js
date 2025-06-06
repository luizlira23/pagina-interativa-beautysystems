import { OpenAI } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method not allowed");
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const { faturamentoAtual, faturamentoObjetivo, procedimentos, roiLav, roiUlt } = req.body;

  const prompt = `Você é um consultor de expansão da Beautysystems. A clínica tem como principais procedimentos: ${procedimentos}.
  O ROI para Lavieen foi ${roiLav}% e para Ultraformer foi ${roiUlt}%.
  O faturamento atual da clínica é de R$${faturamentoAtual} e ela busca chegar a R$${faturamentoObjetivo}.
  Baseado nisso, escreva uma recomendação personalizada e consultiva explicando como essas tecnologias podem alavancar as vendas.
  Especifique ações práticas, retorno esperado e próximos passos recomendados.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Você é um especialista em vendas e estética avançada." },
        { role: "user", content: prompt }
      ]
    });

    res.status(200).json({ texto: completion.choices[0].message.content });
  } catch (error) {
    console.error("Erro GPT:", error);
    res.status(500).json({ erro: "Erro ao chamar o GPT" });
  }
}