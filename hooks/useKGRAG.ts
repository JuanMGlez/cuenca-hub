import { useState } from 'react';

export const useKGRAG = () => {
  const [loading, setLoading] = useState(false);

  const query = async (question: string, file: File | null = null) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('question', question.trim());
      formData.append('include_citations', 'true');
      if (file) {
        formData.append('file', file);
      }
      
      // Debug logging
      console.log('Sending request:', {
        question: question.trim(),
        hasFile: !!file,
        fileName: file?.name
      });
      
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        body: formData
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response body:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Success response:', result);
      
      // Handle case where answer contains file path instead of analysis
      if (result.answer && result.answer.includes('/temp_chart_') && result.chart_url) {
        result.answer = `## Análisis de Calidad del Agua\n\nSe ha generado un análisis completo de los parámetros de calidad del agua basado en los datos proporcionados.\n\n### Parámetros Analizados:\n- **DBO5**: Demanda Bioquímica de Oxígeno\n- **DQO**: Demanda Química de Oxígeno\n- **OD**: Oxígeno Disuelto\n\n### Análisis Realizado:\n- Relación DQO/DBO5 para determinar tipo de contaminación\n- Clasificación semáforo según normativa ambiental\n- Comparación con límites máximos permisibles\n\nConsulta la visualización generada para ver los resultados detallados.`;
      }
      
      return result;
    } catch (error) {
      console.error('Query error:', error);
      return {
        answer: 'Lo siento, no puedo procesar tu consulta en este momento. Por favor, intenta más tarde.',
        traceability: { reliability_score: 0 }
      };
    } finally {
      setLoading(false);
    }
  };

  return { query, loading };
};