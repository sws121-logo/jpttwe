import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Users, Award } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Program {
  id: string;
  name: string;
  description: string;
  duration: string;
  eligibility: string;
  fee: number;
  created_at: string;
}

const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrograms(data || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
      // Mock data for demo
      setPrograms([
        {
          id: '1',
          name: 'Bachelor of Education (B.Ed)',
          description: 'A comprehensive two-year program designed to prepare future teachers with modern pedagogical skills and educational methodologies.',
          duration: '2 Years',
          eligibility: 'Graduate with minimum 50% marks',
          fee: 45000,
          created_at: '2024-01-01'
        },
        {
          id: '2',
          name: 'Diploma in Elementary Education (D.El.Ed)',
          description: 'A specialized program focused on primary education teaching methods and child psychology for aspiring elementary teachers.',
          duration: '2 Years',
          eligibility: 'Higher Secondary (12th) with minimum 50% marks',
          fee: 35000,
          created_at: '2024-01-01'
        },
        {
          id: '3',
          name: 'Certificate Course in Teaching',
          description: 'Short-term certification program for working professionals looking to enhance their teaching skills and methodologies.',
          duration: '6 Months',
          eligibility: 'Graduate degree in any discipline',
          fee: 15000,
          created_at: '2024-01-01'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatFee = (fee: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(fee);
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8 mx-auto"></div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Programs</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive teacher training programs designed to shape future educators
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                <BookOpen className="h-12 w-12 text-white mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">{program.name}</h3>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-6 line-height-relaxed">
                  {program.description}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <span className="text-sm text-gray-500">Duration:</span>
                      <p className="font-semibold text-gray-900">{program.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <div>
                      <span className="text-sm text-gray-500">Eligibility:</span>
                      <p className="font-semibold text-gray-900">{program.eligibility}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-purple-600" />
                    <div>
                      <span className="text-sm text-gray-500">Annual Fee:</span>
                      <p className="font-bold text-2xl text-purple-600">{formatFee(program.fee)}</p>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {programs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No programs available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Programs;