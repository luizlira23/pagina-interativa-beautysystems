import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { nome, clinica, objetivo, tempo, tecnologias, procedimentos, desafios } = req.body;

    // Validação simples de dados obrigatórios
    if (!nome || !clinica || !objetivo) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes: nome, clínica ou objetivo.' });
    }

    const prompt = `
Você é um especialista da Beautysystems. Com base nas informações abaixo, gere uma resposta personalizada e estratégica:

- Nome do responsável: ${nome}
- Nome da clínica: ${clinica}
- Meta de faturamento: R$${objetivo}
- Tempo de atuação da clínica: ${tempo} anos
- Tecnologias locadas: ${tecnologias}
- Procedimentos mais realizados: ${procedimentos}
- Desafios atuais: ${desafios?.join(', ') || 'Nenhum informado'}

1. Sugira duas tecnologias da Beautysystems que mais fazem sentido para essa realidade.
2. Explique o porquê de cada uma, como elas contribuem para o faturamento.
3. Aponte os protocolos mais indicados para aplicar com essas tecnologias.
4. Finalize com uma orientação estratégica de como vender esses protocolos ao público-alvo.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Você é um especialista em vendas e estética avançada.' },
        { role: 'user', content: prompt }
      ]
    });

    const resposta = completion.choices?.[0]?.message?.content || 'Não foi possível gerar uma resposta personalizada.';

    res.status(200).json({ resposta });

  } catch (error) {
    console.error('Erro na função diagnostico.js:', error);
    res.status(500).json({ error: 'Erro ao processar resposta com a OpenAI.' });
  }
}
