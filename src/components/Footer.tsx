import React from 'react';
import { MapPin, Phone, Mail, GraduationCap } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* College Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <GraduationCap className="h-8 w-8 text-blue-400" />
              <div>
                <h3 className="text-xl font-bold">JPTT College</h3>
                <p className="text-gray-400 text-sm">Jehal Prasad Teachers Training</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Established in 2017, we are committed to providing quality teacher education 
              and shaping the future of education in Bihar.
            </p>
            <div className="text-sm text-gray-400">
              <p>Established: 2nd May 2017</p>
              <p>Session Started: 2018</p>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1" />
                <div>
                  <p className="text-gray-300">Pathra English, odhanpur</p>
                  <p className="text-gray-300">Nawada - 805123</p>
                  <p className="text-gray-300">Bihar, India</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-blue-400" />
                <p className="text-gray-300">+91 XXXXX XXXXX</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <p className="text-gray-300">info@jpttcollege.edu.in</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Admissions</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Academic Calendar</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Faculty</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Student Portal</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Alumni</a></li>
              <li><a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">Placement Cell</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Jehal Prasad Teachers Training College. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
