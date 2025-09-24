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
import StudentFees from './components/StudentFees'; // Add this import
import FeesManagement from './pages/FeesManagement'; // Add this import

export interface User {
  id: string;
  email: string;
  user_type?: 'admin' | 'student'; // Add user type distinction
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
    // Admin fee management
    if (currentSection === 'admin-fees') {
      if (!user) {
        return <Login />;
      }
      return <FeesManagement />;
    }

    // Student fee management
    if (currentSection === 'student-fees') {
      return <StudentFees />;
    }

    // Main admin panel
    if (currentSection === 'admin') {
      if (!user) {
        return <Login />;
      }
      return <AdminPanel />;
    }

    // Public sections
    return (
      <>
        <Hero />
        {currentSection === 'home' && (
          <div className="space-y-16">
            <News />
            <Gallery />
            <Programs />
            {/* Add fees preview section to home page */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Fee Information</h2>
                <p className="mt-4 text-lg text-gray-600">
                  View and manage your fee payments conveniently
                </p>
                <button
                  onClick={() => setCurrentSection('student-fees')}
                  className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  View Fee Details
                </button>
              </div>
            </div>
          </div>
        )}
        {currentSection === 'news' && <News />}
        {currentSection === 'gallery' && <Gallery />}
        {currentSection === 'programs' && <Programs />}
        {currentSection === 'fees' && <StudentFees />} // Direct fees section access
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
