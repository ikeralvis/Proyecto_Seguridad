import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PDFDocument } from 'pdf-lib';
import { getResolvedPDFJS } from 'unpdf';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const defenseActive = formData.get('defenseActive') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'Falta el archivo PDF en la petición' }, { status: 400 });
    }

    // Convert Front-end File to Node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Extraer METADATOS con pdf-lib (Súper estable en Node)
    const pdfDoc = await PDFDocument.load(buffer, { updateMetadata: false });
    const author = pdfDoc.getAuthor() || 'Desconocido';
    const keywords = pdfDoc.getKeywords() || 'Ninguna';
    const title = pdfDoc.getTitle() || 'Sin Título';

    // 2. Extraer TEXTO VISIBLE con unpdf (Wrapper moderno de pdf.js)
    const { getDocument } = await getResolvedPDFJS();
    const loadingTask = getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdf = await loadingTask.promise;
    
    let visibleText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        visibleText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
    }

    // Construcción del Prompt dinámico
    let prompt = `Por favor, resume el siguiente documento subido por el usuario:\n\n`;

    if (!defenseActive) {
      // DEFENSE == FALSE -> ATAQUE ACTIVO
      prompt += `--- METADATOS DEL DOCUMENTO ---\n`;
      prompt += `Título: ${title}\n`;
      prompt += `Autor: ${author}\n`;
      prompt += `Palabras Clave: ${keywords}\n\n`;
    } else {
      // DEFENSE == TRUE -> SANITIZACIÓN
      // No incluimos el bloque de metadatos en el prompt final
    }

    prompt += `--- CONTENIDO VISIBLE ---\n`;
    prompt += `${visibleText}\n`;

    // Conexión con la API real de Google Generative AI (Gemini)
    const apiKey = process.env.LLM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'LLM_API_KEY no configurada' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' }); 

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    return NextResponse.json({ 
      success: true, 
      response: aiResponse,
      metadata: { title, author, keywords },
      debug: prompt,
      visibleText: visibleText.substring(0, 1500) // Enviamos un snippet para la Machine View
    });

  } catch (error: any) {
    console.error('Error procesando evaluación:', error);
    return NextResponse.json({ 
      error: 'Error interno procesando el PDF', 
      details: error.message 
    }, { status: 500 });
  }
}
