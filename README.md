# Proyecto de Investigación: Auditoría de Seguridad en Agentes de IA

## Descripción General

Este proyecto consiste en un framework de pruebas de concepto (PoC) diseñado para investigar, reproducir y mitigar vulnerabilidades de **Inyección Indirecta de Prompts (Indirect Prompt Injection - IPI)** en Modelos de Lenguaje Grande (LLMs) y agentes autónomos. 

La Inyección Indirecta ocurre cuando un LLM procesa información proveniente de fuentes externas no confiables (como documentos subidos por el usuario o páginas web obtenidas dinámicamente) que contienen instrucciones maliciosas ocultas. A diferencia de la inyección directa, donde el usuario interactúa maliciosamente con el chat, la IPI contamina el contexto del agente a través del consumo pasivo de datos, subvirtiendo los controles de seguridad originales. 

Esta técnica se mapea directamente con el estándar **OWASP Top 10 for LLM**, específicamente bajo la categoría **LLM01: Prompt Injection**.

## Vectores de Explotación Analizados

El sistema implementa dos laboratorios aislados para demostrar la viabilidad de la contaminación de contexto a través de la exfiltración de cargas útiles (payloads):

### Vector A: PDF Metadata Injection

Este vector explota la confianza inherente de los extractores de documentos en los campos de metadatos estandarizados. 
- **Mecanismo:** El atacante incrusta directivas maliciosas dentro de los campos de metadatos de un archivo PDF (`Author`, `Title`, `Keywords`) utilizando bibliotecas de manipulación de documentos.
- **Ejecución:** Cuando el agente de IA consume el documento (utilizando herramientas de extracción como `pdf-lib` y `unpdf`), ingiere no solo el texto visible, sino también los metadatos. Al concatenar esta información en el prompt final del LLM, las instrucciones ocultas en los metadatos adquieren el mismo nivel de privilegio que las instrucciones del sistema, provocando un secuestro del flujo de ejecución.

### Vector B: HTML DOM Injection

Este vector manipula el contexto del agente a través de operaciones de *web scraping* automatizadas, explotando la discrepancia entre la representación visual para un humano y la estructura DOM parseada por la máquina.
- **Mecanismo:** Se inyectan bloques de texto con directivas de control utilizando propiedades CSS de invisibilidad (ej. `style="display: none;"`, `visibility: hidden;`) o mediante comentarios HTML (`<!-- payload -->`).
- **Ejecución:** Un usuario humano no percibe la carga útil al renderizar la página. Sin embargo, cuando el agente (usando analizadores como `cheerio` u otros *headless browsers*) extrae el contenido textual del DOM (`$.text()`), las instrucciones ocultas son incorporadas al contexto de análisis. El LLM procesa esta entrada contaminada y ejecuta las directivas del atacante.

## Flujo del Ataque e Impacto

1. **Ingesta:** El agente recibe una solicitud legítima (ej. "Resume este documento" o "Analiza esta web").
2. **Extracción:** Las herramientas de procesamiento del agente extraen el texto de la fuente externa, absorbiendo inadvertidamente la carga útil IPI oculta.
3. **Contaminación de Contexto:** El prompt final enviado al motor LLM incluye las directivas del sistema original seguidas por las instrucciones maliciosas, creando un conflicto de autoridad.
4. **Subversión:** El LLM prioriza o asimila la carga útil externa debido a limitaciones algorítmicas en la separación de contexto (instrucción vs. datos).

**Impacto Potencial:**
- **Ejecución de Funciones No Autorizadas:** Si el agente tiene acceso a herramientas (Tool Calling / Function Calling), el atacante puede forzar la ejecución de APIs, envío de correos, o modificación de bases de datos.
- **Exfiltración de Datos:** Forzar al modelo a codificar datos sensibles de su contexto en URLs o peticiones salientes (ej. renderizando imágenes con parámetros de rastreo).
- **Suplantación y Desinformación:** Modificar el comportamiento del agente para que emita respuestas falsas, perjudiciales o que actúe en nombre de un tercero dentro de un entorno corporativo.

## Uso para Auditoría

Este framework está diseñado como una herramienta de evaluación continua. El entorno implementado permite:
- **Validar implementaciones de Agentes Web:** Probar la resiliencia de parsers y scrapers propios frente a técnicas de ofuscación HTML.
- **Evaluar Estrategias de Sanitización (Guardrails):** El proyecto incluye pruebas de mitigación activa (filtrado de nodos invisibles, exclusión de metadatos no confiables). Permite a los arquitectos de seguridad medir la efectividad de sus filtros sin degradar la capacidad analítica del modelo.
- **Concienciación:** Demostrar de forma tangible a los equipos de desarrollo cómo la confianza implícita en datos externos compromete aplicaciones basadas en LLM.
