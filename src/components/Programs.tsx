import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Music } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CulturalProgram {
  id: string;
  name: string;
  description: string;
  type: 'event' | 'workshop' | 'competition' | 'festival';
  date: string;
  time: string;
  venue: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  eligibility: string;
  created_at: string;
}

const CulturalPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<CulturalProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('cultural_programs')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching cultural programs:', error);
      // Mock data for demo
      setPrograms([
        {
          id: '1',
          name: 'Annual Cultural Fest - "Utsav 2024"',
          description: 'Three-day cultural extravaganza featuring music, dance, drama competitions and celebrity performances.',
          type: 'festival',
          date: '2024-03-15',
          time: '9:00 AM - 10:00 PM',
          venue: 'College Amphitheater',
          status: 'upcoming',
          eligibility: 'Open to all college students',
          created_at: '2024-01-01'
        },
        {
          id: '2',
          name: 'Classical Music Concert',
          description: 'Evening of classical ragas featuring renowned artists and student performances.',
          type: 'event',
          date: '2024-02-20',
          time: '6:00 PM - 9:00 PM',
          venue: 'Auditorium Hall',
          status: 'upcoming',
          eligibility: 'Open to all',
          created_at: '2024-01-01'
        },
        {
          id: '3',
          name: 'Dance Workshop - Contemporary Styles',
          description: 'Learn contemporary dance techniques from professional choreographers.',
          type: 'workshop',
          date: '2024-02-10',
          time: '3:00 PM - 6:00 PM',
          venue: 'Dance Studio',
          status: 'upcoming',
          eligibility: 'Basic dance experience preferred',
          created_at: '2024-01-01'
        },
        {
          id: '4',
          name: 'Inter-College Drama Competition',
          description: 'Annual inter-college drama competition with themes on social issues.',
          type: 'competition',
          date: '2024-01-25',
          time: '10:00 AM - 5:00 PM',
          venue: 'Main Stage',
          status: 'completed',
          eligibility: 'College drama teams',
          created_at: '2024-01-01'
        },
        {
          id: '5',
          name: 'Art Exhibition - "Young Visionaries"',
          description: 'Exhibition showcasing artwork by talented students from various departments.',
          type: 'event',
          date: '2024-01-18',
          time: '11:00 AM - 6:00 PM',
          venue: 'Art Gallery',
          status: 'completed',
          eligibility: 'Student artists',
          created_at: '2024-01-01'
        },
        {
          id: '6',
          name: 'Poetry Slam Session',
          description: 'Open mic poetry session where students can share their original compositions.',
          type: 'event',
          date: '2024-02-28',
          time: '4:00 PM - 7:00 PM',
          venue: 'Library Lawn',
          status: 'upcoming',
          eligibility: 'Open to all poetry enthusiasts',
          created_at: '2024-01-01'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      event: '🎭',
      workshop: '🛠️',
      competition: '🏆',
      festival: '🎪'
    };
    return icons[type] || '🎨';
  };

  const filteredPrograms = programs.filter(program => {
    if (filter === 'upcoming') return program.status === 'upcoming' || program.status === 'ongoing';
    if (filter === 'past') return program.status === 'completed';
    return true;
  });

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8 mx-auto"></div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-96"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">College Cultural Programs & Events</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover upcoming cultural events, workshops, and competitions happening on campus
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              filter === 'upcoming' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              filter === 'past' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Past Events
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{getTypeIcon(program.type)}</span>
                  {getStatusBadge(program.status)}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{program.name}</h3>
                <div className="flex items-center space-x-2 text-purple-200">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{formatDate(program.date)}</span>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-6 line-height-relaxed">
                  {program.description}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <div>
                      <span className="text-sm text-gray-500">Time:</span>
                      <p className="font-semibold text-gray-900">{program.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <div>
                      <span className="text-sm text-gray-500">Venue:</span>
                      <p className="font-semibold text-gray-900">{program.venue}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="text-sm text-gray-500">Eligibility:</span>
                      <p className="font-semibold text-gray-900">{program.eligibility}</p>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-6 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200">
                  {program.status === 'completed' ? 'View Photos' : 'Register Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {filter === 'upcoming' 
                ? 'No upcoming events scheduled. Check back later!'
                : 'No events found for the selected filter.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CulturalPrograms;
