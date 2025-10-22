'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LocalAuthManager } from '@/lib/localAuth'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    if (typeof window !== 'undefined') {
      try {
        if (LocalAuthManager.isLoggedIn()) {
          const user = LocalAuthManager.getCurrentUser()
          if (user && user.role) {
            const dashboardRoute = LocalAuthManager.getDashboardRoute(user.role)
            router.push(dashboardRoute)
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      }
    }
  }, [router])

  const handleClearData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados? Isso vai apagar todas as contas e configurações.')) {
      localStorage.clear()
      alert('✅ Dados limpos com sucesso! A página será recarregada.')
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{
      background: `linear-gradient(135deg, 
        #250e2c 0%, 
        #837ab6 25%, 
        #cc8db3 50%, 
        #f6a5c0 75%, 
        #FFD99E 100%
      )`
    }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${50 + Math.random() * 100}px`,
              height: `${50 + Math.random() * 100}px`,
              background: `linear-gradient(135deg, ${
                ['#60A5FA', '#8B5CF6', '#06B6D4', '#10B981'][Math.floor(Math.random() * 4)]
              } 0%, transparent 70%)`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
        
        {/* Geometric shapes */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`shape-${i}`}
            className="absolute opacity-10 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          >
            <div className="w-8 h-8 bg-white rotate-45 rounded-sm" />
          </div>
        ))}
      </div>

      {/* Clear Data button (canto inferior esquerdo) */}
      <button
        onClick={handleClearData}
        className="absolute bottom-8 left-8 z-50 text-red-400/80 hover:text-red-400 font-medium px-4 py-2 rounded-lg hover:bg-red-500/10 transition-all text-sm"
        title="Limpar todos os dados salvos"
      >
        🗑️ Limpar Dados
      </button>

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="text-white font-bold text-2xl" style={{ fontFamily: 'Poppins' }}>
              OrganizeKids
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#inicio" className="text-white/80 hover:text-white transition-colors font-medium">
              Início
            </a>
            <a href="#funcionalidades" className="text-white/80 hover:text-white transition-colors font-medium">
              Funcionalidades
            </a>
            <a href="#planos" className="text-white/80 hover:text-white transition-colors font-medium">
              Planos
            </a>
            <a href="#sobre" className="text-white/80 hover:text-white transition-colors font-medium">
              Sobre Nós
            </a>
            <a href="#contato" className="text-white/80 hover:text-white transition-colors font-medium">
              Contato
            </a>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <button 
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
              onClick={() => window.location.href = '/login'}
            >
              Começar Grátis
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 bg-black/20 backdrop-blur-md rounded-xl p-4">
            <div className="flex flex-col space-y-4">
              <a href="#inicio" className="text-white/80 hover:text-white transition-colors">Início</a>
              <a href="#funcionalidades" className="text-white/80 hover:text-white transition-colors">Funcionalidades</a>
              <a href="#planos" className="text-white/80 hover:text-white transition-colors">Planos</a>
              <a href="#sobre" className="text-white/80 hover:text-white transition-colors">Sobre Nós</a>
              <a href="#contato" className="text-white/80 hover:text-white transition-colors">Contato</a>
              <button 
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold mt-4"
                onClick={() => window.location.href = '/login'}
              >
                Começar Grátis
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
        <div className="text-center max-w-5xl mx-auto">
          <h1 
            className="text-4xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'Poppins' }}
          >
            Organize a rotina da sua família de forma{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-400 bg-clip-text text-transparent">
              simples
            </span>{' '}
            e{' '}
            <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
              divertida
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Com o OrganizeKids, pais, crianças e adolescentes transformam tarefas do dia a dia em conquistas. 
            Mais do que um app, é um jeito de criar hábitos saudáveis, melhorar o foco e fortalecer os vínculos familiares.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 shadow-xl min-w-[200px]"
              onClick={() => window.location.href = '/login'}
            >
              Começar Agora
            </button>
            <button 
              className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-sm min-w-[200px]"
              onClick={() => document.getElementById('funcionalidades')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Conheça as Funcionalidades
            </button>
          </div>
        </div>
      </section>

      {/* Problem + Solution Section */}
      <section className="relative z-10 py-20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8" style={{ fontFamily: 'Poppins' }}>
              Rotina organizada, menos estresse e mais tempo de qualidade
            </h2>
            <p className="text-lg lg:text-xl text-white/80 leading-relaxed">
              Sabemos que o dia a dia é corrido: estudos, trabalho, afazeres domésticos e compromissos. 
              Muitas vezes, organizar tudo isso em família parece impossível.
              <br /><br />
              O OrganizeKids nasceu para resolver esse problema, oferecendo uma plataforma intuitiva que 
              conecta pais, filhos e adolescentes, ajudando cada um a cumprir suas tarefas com motivação e propósito.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-5xl font-bold text-white text-center mb-16" style={{ fontFamily: 'Poppins' }}>
            Funcionalidades em Destaque
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Modo Pais */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">👨‍👩‍👧</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Modo Pais</h3>
              <p className="text-white/80 leading-relaxed">
                Adicione tarefas para seus filhos, acompanhe o progresso e incentive bons hábitos com um sistema intuitivo e eficaz.
              </p>
            </div>

            {/* Modo Criança */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🧒</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Modo Criança</h3>
              <p className="text-white/80 leading-relaxed">
                Tarefas apresentadas de forma lúdica, com sistema de pontos, conquistas e recompensas que tornam a organização divertida.
              </p>
            </div>

            {/* Modo Adolescente */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">👩‍🎓</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Modo Adolescente</h3>
              <p className="text-white/80 leading-relaxed">
                Calendário inteligente, rotina personalizada, foco em estudos e autocuidado para desenvolver autonomia.
              </p>
            </div>

            {/* Temas Personalizáveis */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎨</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Temas Personalizáveis</h3>
              <p className="text-white/80 leading-relaxed">
                Deixe o app com a cara da sua família! Escolha cores, ícones e layouts que reflitam a personalidade de cada membro.
              </p>
            </div>

            {/* Relatórios */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Relatórios e Gráficos</h3>
              <p className="text-white/80 leading-relaxed">
                Acompanhe o desenvolvimento das crianças e visualize o progresso de todos com dashboards intuitivos e informativos.
              </p>
            </div>

            {/* Gamificação */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🏆</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Sistema de Recompensas</h3>
              <p className="text-white/80 leading-relaxed">
                Conquistas, medalhas e recompensas personalizadas que motivam toda a família a manter bons hábitos consistentemente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="relative z-10 py-20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-5xl font-bold text-white text-center mb-16" style={{ fontFamily: 'Poppins' }}>
            Histórias reais, resultados incríveis
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 lg:p-12 border border-white/20 text-center">
              <div className="text-6xl mb-6">💬</div>
              <p className="text-xl lg:text-2xl text-white/90 italic mb-8 leading-relaxed">
                "Com o OrganizeKids, meu filho aprendeu a organizar seus estudos e até a hora de brincar ficou mais produtiva. 
                A rotina da nossa família mudou para melhor!"
              </p>
              <div className="text-white/70 font-semibold">
                – Carla, mãe do Pedro (9 anos)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Differentials Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-5xl font-bold text-white text-center mb-16" style={{ fontFamily: 'Poppins' }}>
            Por que escolher o OrganizeKids?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">🎮</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Experiência Gamificada</h3>
              <p className="text-white/80">Motiva crianças com jogos e conquistas</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">🔗</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Integração Familiar</h3>
              <p className="text-white/80">Conecta pais e filhos em tempo real</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Simples e Intuitivo</h3>
              <p className="text-white/80">Interface amigável para todas as idades</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">⚖️</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Equilíbrio Familiar</h3>
              <p className="text-white/80">Organização e bem-estar juntos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="relative z-10 py-20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8" style={{ fontFamily: 'Poppins' }}>
              Estamos só começando
            </h2>
            <p className="text-lg lg:text-xl text-white/80 leading-relaxed mb-12">
              Nosso objetivo é ir além: em breve, o OrganizeKids terá integração com dispositivos de saúde, 
              lembretes inteligentes e novas formas de gamificação para manter toda a família engajada.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-lg font-bold text-white mb-2">Integração IoT</h3>
                <p className="text-white/70 text-sm">Conecte dispositivos inteligentes da casa</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-lg font-bold text-white mb-2">IA Personalizada</h3>
                <p className="text-white/70 text-sm">Sugestões inteligentes baseadas no comportamento</p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-4">🌍</div>
                <h3 className="text-lg font-bold text-white mb-2">Comunidade Global</h3>
                <p className="text-white/70 text-sm">Conecte-se com outras famílias pelo mundo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8" style={{ fontFamily: 'Poppins' }}>
              Pronto para transformar a rotina da sua família?
            </h2>
            <p className="text-xl text-white/80 mb-12">
              Junte-se a milhares de famílias que já descobriram como a organização pode ser divertida e eficaz.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button 
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-5 rounded-xl font-bold text-xl hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 shadow-xl min-w-[250px]"
                onClick={() => window.location.href = '/signup'}
              >
                Começar Agora
              </button>
              <button 
                className="border-2 border-white/30 text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-white/10 transition-all backdrop-blur-sm min-w-[250px]"
                onClick={() => window.location.href = '/login'}
              >
                Teste Grátis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/40 backdrop-blur-md py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">O</span>
                </div>
                <span className="text-white font-bold text-2xl" style={{ fontFamily: 'Poppins' }}>
                  OrganizeKids
                </span>
              </div>
              <p className="text-white/70 max-w-md">
                Transformando a rotina familiar através da organização inteligente e gamificação. 
                Mais do que um app, uma nova forma de viver em família.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold mb-4">Links Rápidos</h3>
              <div className="space-y-2">
                <a href="#inicio" className="block text-white/70 hover:text-white transition-colors">Início</a>
                <a href="#funcionalidades" className="block text-white/70 hover:text-white transition-colors">Funcionalidades</a>
                <a href="#" className="block text-white/70 hover:text-white transition-colors">Política de Privacidade</a>
                <a href="#" className="block text-white/70 hover:text-white transition-colors">Termos de Uso</a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold mb-4">Contato</h3>
              <div className="space-y-2">
                <p className="text-white/70">contato@organizekids.com</p>
                <div className="flex space-x-4 mt-4">
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="text-white/50" style={{ fontFamily: 'Poppins' }}>
              © 2025 OrganizeKids – Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
