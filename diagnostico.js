export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { nome, clinica, objetivo, tempo, tecnologias, procedimentos, desafios } = req.body;

  const prompt = `
Você é um especialista da Beautysystems. Com base nas informações abaixo, gere uma resposta personalizada e estratégica:

- Nome do responsável: ${nome}
- Nome da clínica: ${clinica}
- Meta de faturamento: R$${objetivo}
- Tempo de atuação da clínica: ${tempo} anos
- Tecnologias locadas: ${tecnologias}
- Procedimentos mais realizados: ${procedimentos}
- Desafios atuais: ${desafios.join(', ')}

1. Sugira duas tecnologias da Beautysystems que mais fazem sentido para essa realidade.
2. Explique o porquê de cada uma, como elas contribuem para o faturamento.
3. Aponte os protocolos mais indicados para aplicar com essas tecnologias.
4. Finalize com uma orientação estratégica de como vender esses protocolos ao público-alvo.
  `;

  try {
    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const result = await gptResponse.json();
    const resposta = result.choices?.[0]?.message?.content || 'Não foi possível gerar uma resposta.';

    res.status(200).json({ resposta });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar resposta com a OpenAI.' });
  }
}
