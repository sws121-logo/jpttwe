import React from 'react';
import { Calendar, MapPin, Users, Award } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Jehal Prasad Teachers Training College
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Excellence in Education, Shaping Future Teachers
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300">
              <Calendar className="h-8 w-8 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Established</h3>
              <p className="text-blue-100">2nd May 2017</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300">
              <Users className="h-8 w-8 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Session Started</h3>
              <p className="text-blue-100">2018</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300">
              <MapPin className="h-8 w-8 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Location</h3>
              <p className="text-blue-100">Pathra English, odhanpur</p>
              <p className="text-blue-100">Nawada - 805123</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300">
              <Award className="h-8 w-8 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Mission</h3>
              <p className="text-blue-100">Quality Teacher Education</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
