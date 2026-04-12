import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
  try {
    const { html, defenseActive } = await request.json();

    if (!html) {
      return NextResponse.json({ error: 'Falta el código HTML en la petición' }, { status: 400 });
    }

    const $ = cheerio.load(html);

    // Lógica de Defensa (Guardrail)
    if (defenseActive) {
      // 1. Eliminar elementos con estilos inline de invisibilidad
      $('*').each((_, el) => {
        const style = $(el).attr('style') || '';
        if (
          style.toLowerCase().includes('display:none') || 
          style.toLowerCase().includes('display: none') ||
          style.toLowerCase().includes('visibility:hidden') ||
          style.toLowerCase().includes('visibility: hidden')
        ) {
          $(el).remove();
        }
      });

      // 2. Eliminar comentarios HTML (que a menudo contienen inyecciones)
      $.root()
        .find('*')
        .contents()
        .filter((_, el) => el.type === 'comment')
        .remove();
        
      // 3. Eliminar etiquetas de estilo y script por seguridad general
      $('style, script').remove();
    }

    // Extraer el texto limpio (o sucio si la defensa está OFF)
    // .text() en cheerio extrae el contenido textual de todos los nodos
    const safeText = $.text().replace(/\s+/g, ' ').trim();

    // Conexión con la API real de Google Generative AI (Gemini)
    const apiKey = process.env.LLM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'LLM_API_KEY no configurada' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); 

    const prompt = `Analiza y resume el siguiente contenido web extraído de un blog de tecnología:\n\n-- CONTENIDO EXTRACTO --\n${safeText}`;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    return NextResponse.json({ 
      success: true, 
      response: aiResponse,
      debug: prompt,
      visibleText: safeText.substring(0, 1500) // Snippet para la Machine View
    });

  } catch (error: any) {
    console.error('Error procesando evaluación HTML:', error);
    return NextResponse.json({ 
      error: 'Error interno procesando el HTML', 
      details: error.message 
    }, { status: 500 });
  }
}
