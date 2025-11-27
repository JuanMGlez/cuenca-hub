'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Brain, Sparkles, FileText, BarChart3, Paperclip, X } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { useKGRAG } from '@/hooks/useKGRAG';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  reliability?: number;
  citations?: string[];
  sources?: any[];
  numSources?: number;
  processingTime?: number;
  chartUrl?: string;
  analysisType?: string;
  attachedFile?: { name: string; size: number; };
  dataSummary?: any;
}

export default function TlamatIA() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '¡Hola! Soy TlamatIA, tu agente conversacional especializado en ciencias ambientales y restauración de cuencas. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { query, loading } = useKGRAG();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
      status: 'sent',
      attachedFile: selectedFile ? { name: selectedFile.name, size: selectedFile.size } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = trimmedInput;
    const currentFile = selectedFile;
    setInput('');
    setSelectedFile(null);
    setIsTyping(true);

    try {
      const result = await query(currentInput, selectedFile);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: result.answer,
        timestamp: new Date(),
        reliability: result.traceability?.reliability_score,
        citations: result.citations,
        sources: result.sources,
        numSources: result.num_sources,
        processingTime: result.processing_time,
        chartUrl: result.chart_url,
        analysisType: result.type,
        dataSummary: result.data_summary
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Lo siento, hubo un error procesando tu consulta. Por favor, intenta nuevamente.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { icon: BarChart3, label: 'Analizar Datos', prompt: 'Analiza los datos que subí y genera visualizaciones' },
    { icon: FileText, label: 'Generar Reporte', prompt: 'Genera un reporte detallado de los datos' },
    { icon: Sparkles, label: 'Sugerir Estrategias', prompt: 'Sugiere estrategias basadas en el análisis' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6d194]/10 via-white to-[#1e5b4f]/5">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-[#98989A]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-3 text-[#98989A] hover:text-[#1e5b4f] transition-all duration-300 group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="font-medium">Dashboard</span>
              </Link>
              
              <div className="w-px h-6 bg-[#98989A]/30"></div>
              
              <div className="flex items-center space-x-3">
                <Logo variant="dashboard" showText={false} />
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1e5b4f] via-[#002f2a] to-[#161a1d] rounded-2xl flex items-center justify-center shadow-xl border border-white/20">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#a57f2c] to-[#e6d194] rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-[#1e5b4f] to-[#002f2a] bg-clip-text text-transparent">TlamatIA</h1>
                  <p className="text-sm text-[#98989A]">Agente Conversacional Inteligente</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-gradient-to-r from-[#a57f2c]/10 to-[#e6d194]/20 px-4 py-2 rounded-full border border-[#a57f2c]/30">
              <div className="w-2 h-2 bg-[#a57f2c] rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-[#161a1d]">IA Activa</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white/90 backdrop-blur-sm border-r border-[#98989A]/20 p-6">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[#161a1d] mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => setInput(action.prompt)}
                  className="w-full flex items-center p-4 bg-gradient-to-r from-white to-[#e6d194]/10 backdrop-blur-sm rounded-2xl border border-[#98989A]/20 hover:border-[#1e5b4f]/30 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1e5b4f] to-[#002f2a] flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-[#161a1d] text-left">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[#161a1d] mb-4">Capacidades</h3>
            <div className="space-y-3">
              {[
                { icon: '🧠', title: 'Análisis Científico', desc: 'Interpretación de datos ambientales' },
                { icon: '📊', title: 'Visualización', desc: 'Gráficos y análisis de datos' },
                { icon: '🔬', title: 'Investigación', desc: 'Consulta de literatura científica' },
                { icon: '💡', title: 'Recomendaciones', desc: 'Estrategias de restauración' }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-white/60 to-[#e6d194]/5 backdrop-blur-sm rounded-xl border border-[#98989A]/10">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-[#161a1d]">{item.title}</p>
                    <p className="text-xs text-[#98989A]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-2xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.type === 'assistant' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-[#1e5b4f] to-[#002f2a] rounded-lg flex items-center justify-center">
                        <Brain className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-medium text-[#98989A]">TlamatIA</span>
                      <span className="text-xs text-[#98989A]" suppressHydrationWarning>
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                  
                  <div className={`p-4 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-[#1e5b4f] via-[#002f2a] to-[#161a1d] text-white ml-12 shadow-xl' 
                      : 'bg-white/90 backdrop-blur-sm border border-[#98989A]/20 shadow-lg'
                  }`}>
                    {message.type === 'user' ? (
                      <div>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        {message.attachedFile && (
                          <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-white/20">
                            <FileText className="w-4 h-4 text-white/80" />
                            <span className="text-xs text-white/80">
                              {message.attachedFile.name} ({(message.attachedFile.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            img: ({ src, alt, ...props }) => {
                              if (!src || typeof src !== 'string' || src.trim() === '') return null;
                              return (
                                <img 
                                  src={src} 
                                  alt={alt} 
                                  {...props} 
                                  className="cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => setModalImage(src)}
                                />
                              );
                            }
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                    
                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-[#98989A]/20">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-2 h-2 bg-[#a57f2c] rounded-full"></div>
                          <span className="text-sm font-medium text-[#161a1d]">
                            Respuesta basada en {message.sources.length} documentos científicos
                          </span>
                        </div>
                        
                        <div className="bg-gradient-to-r from-[#e6d194]/20 to-[#a57f2c]/10 p-3 rounded-lg border border-[#a57f2c]/20">
                          <div className="text-sm text-[#161a1d] mb-2">
                            📚 <strong>Fuentes consultadas:</strong>
                          </div>
                          <div className="space-y-2">
                            {message.sources.slice(0, 2).map((source, idx) => (
                              <div key={idx} className="text-sm text-[#98989A]">
                                <span className="inline-block w-6 h-5 bg-[#1e5b4f] text-white text-xs rounded text-center leading-5 mr-2">
                                  [{source.number}]
                                </span>
                                <span className="font-medium text-[#161a1d]">{source.title || source.filename.replace('.pdf', '')}</span>
                                {source.author && (
                                  <div className="text-xs text-[#98989A] ml-8">
                                    Por: {source.author}
                                  </div>
                                )}
                                <div className="text-xs text-[#98989A] ml-8 mt-1">
                                  "{source.preview?.substring(0, 120)}..."
                                </div>
                              </div>
                            ))}
                            {message.sources.length > 2 && (
                              <details className="mt-2">
                                <summary className="text-xs text-[#98989A] cursor-pointer hover:text-[#1e5b4f] font-medium">
                                  + Ver {message.sources.length - 2} fuentes adicionales
                                </summary>
                                <div className="mt-2 space-y-2">
                                  {message.sources.slice(2).map((source, idx) => (
                                    <div key={idx + 2} className="text-sm text-[#98989A]">
                                      <span className="inline-block w-6 h-5 bg-[#1e5b4f] text-white text-xs rounded text-center leading-5 mr-2">
                                        [{source.number}]
                                      </span>
                                      <span className="font-medium text-[#161a1d]">{source.title || source.filename.replace('.pdf', '')}</span>
                                      {source.author && (
                                        <div className="text-xs text-[#98989A] ml-8">
                                          Por: {source.author}
                                        </div>
                                      )}
                                      <div className="text-xs text-[#98989A] ml-8 mt-1">
                                        "{source.preview?.substring(0, 120)}..."
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </details>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 text-xs text-[#98989A]">
                          <span>✓ Información verificada con literatura científica</span>
                          {message.processingTime && (
                            <span>Procesado en {message.processingTime.toFixed(1)}s</span>
                          )}
                        </div>
                        
                        {message.chartUrl && (
                          <div className="mt-4">
                            <div className="bg-gradient-to-r from-[#e6d194]/20 to-[#a57f2c]/10 p-3 rounded-lg mb-3 border border-[#a57f2c]/20">
                              <div className="text-sm font-medium text-[#161a1d] mb-2">
                                📈 <strong>Visualización de Datos:</strong>
                              </div>
                              {message.dataSummary && (
                                <div className="text-xs text-[#98989A]">
                                  {message.dataSummary.rows} filas × {message.dataSummary.columns} columnas | {message.dataSummary.numeric_columns} numéricas
                                </div>
                              )}
                            </div>
                            <img 
                              src={message.chartUrl} 
                              alt="Gráfico de análisis" 
                              className="w-full max-w-lg rounded-xl border border-[#98989A]/30 shadow-xl cursor-pointer hover:opacity-80 hover:scale-[1.02] transition-all duration-300"
                              onClick={() => setModalImage(message.chartUrl!)}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {message.chartUrl && (
                    <div className="mt-4">
                      <div className="bg-gradient-to-r from-[#e6d194]/20 to-[#a57f2c]/10 p-3 rounded-lg mb-3 border border-[#a57f2c]/20">
                        <div className="text-sm font-medium text-[#161a1d] mb-2">
                          📈 <strong>Visualización de Datos:</strong>
                        </div>
                        {message.dataSummary && (
                          <div className="text-xs text-[#98989A]">
                            {message.dataSummary.rows} filas × {message.dataSummary.columns} columnas | {message.dataSummary.numeric_columns} numéricas
                          </div>
                        )}
                      </div>
                      <img 
                        src={message.chartUrl} 
                        alt="Gráfico de análisis" 
                        className="w-full max-w-lg rounded-xl border border-[#98989A]/30 shadow-xl cursor-pointer hover:opacity-80 hover:scale-[1.02] transition-all duration-300"
                        onClick={() => setModalImage(message.chartUrl!)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-2xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-[#1e5b4f] to-[#002f2a] rounded-lg flex items-center justify-center">
                      <Brain className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-[#98989A]">TlamatIA está escribiendo...</span>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm border border-[#98989A]/20 shadow-lg p-4 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#1e5b4f] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#1e5b4f] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-[#1e5b4f] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-[#98989A]/20 bg-white/90 backdrop-blur-sm p-6">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div 
                  className={`flex items-end space-x-4 bg-white/80 backdrop-blur-sm rounded-2xl border p-4 shadow-xl transition-all duration-300 ${
                    isDragging 
                      ? 'border-[#1e5b4f] border-2 bg-[#1e5b4f]/5 shadow-2xl' 
                      : 'border-[#98989A]/30 hover:border-[#1e5b4f]/40'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      const file = files[0];
                      if (file.type.includes('csv') || file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                        setSelectedFile(file);
                      }
                    }
                  }}
                >
                  <div className="flex-1">
                    {selectedFile && (
                      <div className="flex items-center space-x-2 mb-2 p-3 bg-gradient-to-r from-[#a57f2c]/10 to-[#e6d194]/20 rounded-xl border border-[#a57f2c]/30">
                        <FileText className="w-4 h-4 text-[#a57f2c]" />
                        <span className="text-sm text-[#161a1d] font-medium">{selectedFile.name}</span>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="p-1 hover:bg-[#a57f2c]/20 rounded-lg transition-all duration-200"
                        >
                          <X className="w-3 h-3 text-[#a57f2c]" />
                        </button>
                      </div>
                    )}
                    <textarea
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        // Auto-resize
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder={isDragging ? "Suelta tu archivo CSV/Excel aquí..." : "Pregúntame sobre ciencias ambientales, análisis de datos o estrategias de restauración..."}
                      className="w-full resize-none bg-transparent border-none outline-none text-sm placeholder-[#98989A] text-[#161a1d] overflow-y-auto"
                      style={{ minHeight: '24px', maxHeight: '120px' }}
                      rows={1}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 hover:bg-[#e6d194]/20 text-[#98989A] hover:text-[#a57f2c] rounded-xl transition-all duration-300"
                      title="Subir CSV/Excel"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="p-3 bg-gradient-to-r from-[#1e5b4f] via-[#002f2a] to-[#161a1d] text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center mt-4 space-x-6 text-xs text-[#98989A]">
                <span>Presiona Enter para enviar</span>
                <span>•</span>
                <span>Shift + Enter para nueva línea</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div 
          className="fixed inset-0 bg-[#161a1d]/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setModalImage(null)}
        >
          <div className="relative max-w-full max-h-full">
            <img 
              src={modalImage} 
              alt="Vista ampliada" 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
            />
            <button 
              onClick={() => setModalImage(null)}
              className="absolute top-4 right-4 text-white bg-[#161a1d]/80 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#161a1d] transition-all duration-300 border border-white/20"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}