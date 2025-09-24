import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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

const CulturalProgramsManagement: React.FC = () => {
  const [programs, setPrograms] = useState<CulturalProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProgram, setEditingProgram] = useState<CulturalProgram | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'event' as const,
    date: '',
    time: '',
    venue: '',
    status: 'upcoming' as const,
    eligibility: '',
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('cultural_programs')
        .select('*')
        .order('date', { ascending: false });

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
          name: 'Inter-College Drama Competition',
          description: 'Annual inter-college drama competition with themes on social issues.',
          type: 'competition',
          date: '2024-01-25',
          time: '10:00 AM - 5:00 PM',
          venue: 'Main Stage',
          status: 'completed',
          eligibility: 'College drama teams',
          created_at: '2024-01-01'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingProgram) {
        const { error } = await supabase
          .from('cultural_programs')
          .update(formData)
          .eq('id', editingProgram.id);

        if (error) throw error;
        
        setPrograms(prev => prev.map(item => 
          item.id === editingProgram.id 
            ? { ...item, ...formData }
            : item
        ));
      } else {
        const newItem = {
          id: Date.now().toString(),
          ...formData,
          created_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('cultural_programs')
          .insert([formData]);

        if (error) throw error;
        
        setPrograms(prev => [newItem, ...prev]);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving cultural program:', error);
      alert('Error saving cultural program. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: CulturalProgram) => {
    setEditingProgram(item);
    setFormData({
      name: item.name,
      description: item.description,
      type: item.type,
      date: item.date,
      time: item.time,
      venue: item.venue,
      status: item.status,
      eligibility: item.eligibility,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cultural program?')) return;

    try {
      const { error } = await supabase
        .from('cultural_programs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPrograms(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting cultural program:', error);
      alert('Error deleting cultural program. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'event',
      date: '',
      time: '',
      venue: '',
      status: 'upcoming',
      eligibility: '',
    });
    setEditingProgram(null);
    setShowForm(false);
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

  const getTypeBadge = (type: string) => {
    const styles = {
      event: 'bg-purple-100 text-purple-800',
      workshop: 'bg-orange-100 text-orange-800',
      competition: 'bg-red-100 text-red-800',
      festival: 'bg-pink-100 text-pink-800'
    };
    
    const typeLabels = {
      event: 'Event',
      workshop: 'Workshop',
      competition: 'Competition',
      festival: 'Festival'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[type]}`}>
        {typeLabels[type]}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Cultural Programs Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Cultural Program</span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-full overflow-auto">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {editingProgram ? 'Edit Cultural Program' : 'Add New Cultural Program'}
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Program Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Annual Cultural Fest"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Program Type
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="event">Event</option>
                      <option value="workshop">Workshop</option>
                      <option value="competition">Competition</option>
                      <option value="festival">Festival</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., 6:00 PM - 9:00 PM"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., College Amphitheater"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Eligibility
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.eligibility}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Open to all college students"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Describe the cultural program..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Programs List */}
      <div className="space-y-6">
        {programs.map((program) => (
          <div key={program.id} className="bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{program.name}</h3>
                  {getTypeBadge(program.type)}
                  {getStatusBadge(program.status)}
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(program.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>{program.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{program.venue}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(program)}
                  className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(program.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 mb-3">{program.description}</p>
            
            <div className="flex items-center space-x-2 text-sm">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-700">Eligibility: </span>
              <span className="text-gray-600">{program.eligibility}</span>
            </div>
          </div>
        ))}
      </div>

      {programs.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No cultural programs found. Add your first cultural program!</p>
        </div>
      )}
    </div>
  );
};

export default CulturalProgramsManagement;
