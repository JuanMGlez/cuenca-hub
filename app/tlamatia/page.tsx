'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Mic, MicOff, Brain, Sparkles, FileText, Image, BarChart3, Zap, Copy, ThumbsUp, ThumbsDown, RotateCcw, Volume2 } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
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
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simular respuesta del agente
    setTimeout(() => {
      const responses = [
        'Excelente pregunta sobre la cuenca Lerma-Chapala-Santiago. Basándome en los datos más recientes, puedo decirte que...',
        'Los indicadores de calidad del agua muestran tendencias interesantes. Permíteme analizar los patrones...',
        'Para la restauración de ecosistemas acuáticos, recomiendo considerar estos factores clave...',
        'Los datos de monitoreo sugieren que las estrategias de conservación están mostrando resultados positivos...'
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const quickActions = [
    { icon: BarChart3, label: 'Analizar Datos', color: '#9b2247' },
    { icon: FileText, label: 'Generar Reporte', color: '#1e5b4f' },
    { icon: Image, label: 'Visualizar Mapas', color: '#a57f2c' },
    { icon: Sparkles, label: 'Sugerir Estrategias', color: '#161a1d' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-3 text-slate-600 hover:text-[#1e5b4f] transition-colors group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Dashboard</span>
              </Link>
              
              <div className="w-px h-6 bg-slate-300"></div>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#1e5b4f] to-[#002f2a] rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#1e5b4f]">TlamatIA</h1>
                  <p className="text-sm text-slate-500">Agente Conversacional Inteligente</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200/60">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">IA Activa</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-slate-200/60 p-6">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Acciones Rápidas</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/60 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform" style={{backgroundColor: `${action.color}20`}}>
                    <action.icon className="w-5 h-5" style={{color: action.color}} />
                  </div>
                  <span className="text-xs font-medium text-slate-700 text-center">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Capacidades</h3>
            <div className="space-y-3">
              {[
                { icon: '🧠', title: 'Análisis Científico', desc: 'Interpretación de datos ambientales' },
                { icon: '📊', title: 'Visualización', desc: 'Gráficos y mapas interactivos' },
                { icon: '🔬', title: 'Investigación', desc: 'Consulta de literatura científica' },
                { icon: '💡', title: 'Recomendaciones', desc: 'Estrategias de restauración' }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white/40 backdrop-blur-sm rounded-xl">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
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
                      <span className="text-xs font-medium text-slate-600">TlamatIA</span>
                      <span className="text-xs text-slate-400">{message.timestamp.toLocaleTimeString()}</span>
                    </div>
                  )}
                  
                  <div className={`p-4 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-[#1e5b4f] to-[#002f2a] text-white ml-12' 
                      : 'bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>

                  {message.type === 'assistant' && (
                    <div className="flex items-center space-x-2 mt-2">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                        <Copy className="w-3 h-3 text-slate-400" />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                        <Volume2 className="w-3 h-3 text-slate-400" />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                        <ThumbsUp className="w-3 h-3 text-slate-400" />
                      </button>
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                        <ThumbsDown className="w-3 h-3 text-slate-400" />
                      </button>
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
                    <span className="text-xs font-medium text-slate-600">TlamatIA está escribiendo...</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm p-4 rounded-2xl">
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
          <div className="border-t border-slate-200/60 bg-white/80 backdrop-blur-sm p-6">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="flex items-end space-x-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-4 shadow-lg">
                  <div className="flex-1">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Pregúntame sobre ciencias ambientales, análisis de datos o estrategias de restauración..."
                      className="w-full resize-none bg-transparent border-none outline-none text-sm placeholder-slate-400 max-h-32"
                      rows={1}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsListening(!isListening)}
                      className={`p-2 rounded-xl transition-all duration-200 ${
                        isListening 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'hover:bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="p-2 bg-gradient-to-r from-[#1e5b4f] to-[#002f2a] text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center mt-4 space-x-6 text-xs text-slate-500">
                <span>Presiona Enter para enviar</span>
                <span>•</span>
                <span>Shift + Enter para nueva línea</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>Potenciado por IA</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}