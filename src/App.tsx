import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import Hero from './components/Hero';
import News from './components/News';
import Gallery from './components/Gallery';
import Programs from './components/Programs';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import Login from './components/Login';

export interface User {
  id: string;
  email: string;
}

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const renderContent = () => {
    if (currentSection === 'admin') {
      if (!user) {
        return <Login />;
      }
      return <AdminPanel />;
    }

    return (
      <>
        <Hero />
        {currentSection === 'home' && (
          <div className="space-y-16">
            <News />
            <Gallery />
            <Programs />
          </div>
        )}
        {currentSection === 'news' && <News />}
        {currentSection === 'gallery' && <Gallery />}
        {currentSection === 'programs' && <Programs />}
      </>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentSection={currentSection} 
        setCurrentSection={setCurrentSection}
        user={user}
        setUser={setUser}
      />
      <main>
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;
