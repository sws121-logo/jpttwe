import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, DollarSign, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface FeeStructure {
  id: string;
  program_name: string;
  academic_year: string;
  tuition_fee: number;
  admission_fee: number;
  examination_fee: number;
  library_fee: number;
  laboratory_fee: number;
  other_fees: number;
  total_fee: number;
  due_date: string;
  created_at: string;
  fee_structure_image?: string;
}

const FeesManagement: React.FC = () => {
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFee, setEditingFee] = useState<FeeStructure | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    program_name: '',
    academic_year: '2024-25',
    tuition_fee: 0,
    admission_fee: 0,
    examination_fee: 0,
    library_fee: 0,
    laboratory_fee: 0,
    other_fees: 0,
    due_date: '',
    fee_structure_image: '',
  });

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const { data, error } = await supabase
        .from('fees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFees(data || []);
    } catch (error) {
      console.error('Error fetching fees:', error);
      // Mock data for demo
      setFees([
        {
          id: '1',
          program_name: 'Bachelor of Education (B.Ed)',
          academic_year: '2024-25',
          tuition_fee: 35000,
          admission_fee: 5000,
          examination_fee: 3000,
          library_fee: 1000,
          laboratory_fee: 1000,
          other_fees: 0,
          total_fee: 45000,
          due_date: '2024-07-15',
          created_at: '2024-01-01',
          fee_structure_image: ''
        },
        {
          id: '2',
          program_name: 'Diploma in Elementary Education (D.El.Ed)',
          academic_year: '2024-25',
          tuition_fee: 28000,
          admission_fee: 4000,
          examination_fee: 2000,
          library_fee: 500,
          laboratory_fee: 500,
          other_fees: 0,
          total_fee: 35000,
          due_date: '2024-07-15',
          created_at: '2024-01-01',
          fee_structure_image: ''
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalFee = (data = formData) => {
    return data.tuition_fee + data.admission_fee + data.examination_fee + 
           data.library_fee + data.laboratory_fee + data.other_fees;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setImageUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `fee-structures/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('fee-structures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('fee-structures')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, fee_structure_image: publicUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const total_fee = calculateTotalFee();
    const submitData = { ...formData, total_fee };

    try {
      if (editingFee) {
        const { data, error } = await supabase
          .from('fees')
          .update(submitData)
          .eq('id', editingFee.id)
          .select()
          .single();

        if (error) throw error;
        
        setFees(prev => prev.map(item => 
          item.id === editingFee.id 
            ? { ...item, ...data }
            : item
        ));
      } else {
        const { data, error } = await supabase
          .from('fees')
          .insert([submitData])
          .select()
          .single();

        if (error) throw error;
        
        setFees(prev => [data, ...prev]);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving fee structure:', error);
      alert('Error saving fee structure. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: FeeStructure) => {
    setEditingFee(item);
    setFormData({
      program_name: item.program_name,
      academic_year: item.academic_year,
      tuition_fee: item.tuition_fee,
      admission_fee: item.admission_fee,
      examination_fee: item.examination_fee,
      library_fee: item.library_fee,
      laboratory_fee: item.laboratory_fee,
      other_fees: item.other_fees,
      due_date: item.due_date,
      fee_structure_image: item.fee_structure_image || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fee structure?')) return;

    try {
      const { error } = await supabase
        .from('fees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setFees(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting fee structure:', error);
      alert('Error deleting fee structure. Please try again.');
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, fee_structure_image: '' }));
  };

  const resetForm = () => {
    setFormData({
      program_name: '',
      academic_year: '2024-25',
      tuition_fee: 0,
      admission_fee: 0,
      examination_fee: 0,
      library_fee: 0,
      laboratory_fee: 0,
      other_fees: 0,
      due_date: '',
      fee_structure_image: '',
    });
    setEditingFee(null);
    setShowForm(false);
  };

  const formatFee = (fee: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(fee);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Fees Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Fee Structure</span>
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-auto">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {editingFee ? 'Edit Fee Structure' : 'Add New Fee Structure'}
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Program Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.program_name}
                        onChange={(e) => setFormData({ ...formData, program_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Academic Year *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.academic_year}
                        onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="2024-25"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Due Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.due_date}
                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tuition Fee (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.tuition_fee}
                        onChange={(e) => setFormData({ ...formData, tuition_fee: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Admission Fee (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.admission_fee}
                        onChange={(e) => setFormData({ ...formData, admission_fee: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Examination Fee (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.examination_fee}
                        onChange={(e) => setFormData({ ...formData, examination_fee: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Library Fee (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.library_fee}
                        onChange={(e) => setFormData({ ...formData, library_fee: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Laboratory Fee (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.laboratory_fee}
                        onChange={(e) => setFormData({ ...formData, laboratory_fee: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Other Fees (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.other_fees}
                        onChange={(e) => setFormData({ ...formData, other_fees: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Total Fee:</span>
                      <span className="text-lg font-bold text-blue-600">
                        {formatFee(calculateTotalFee())}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Fee Structure Image
                  </label>
                  
                  {formData.fee_structure_image ? (
                    <div className="space-y-2">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <img 
                          src={formData.fee_structure_image} 
                          alt="Fee structure preview" 
                          className="max-h-48 mx-auto rounded"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="w-full px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 flex items-center justify-center space-x-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Remove Image</span>
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer block"
                      >
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-600">
                          {imageUploading ? 'Uploading...' : 'Click to upload fee structure image'}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, JPEG up to 5MB
                        </p>
                      </label>
                    </div>
                  )}
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
                  disabled={loading || imageUploading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : editingFee ? 'Update' : 'Save'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fees List */}
      <div className="space-y-6">
        {fees.map((fee) => (
          <div key={fee.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{fee.program_name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Academic Year: {fee.academic_year}
                      </span>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        Due: {new Date(fee.due_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(fee)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(fee.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {fee.fee_structure_image && (
                  <div className="mt-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <ImageIcon className="h-4 w-4" />
                      <span>Fee Structure Image:</span>
                    </div>
                    <a 
                      href={fee.fee_structure_image} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <img 
                        src={fee.fee_structure_image} 
                        alt="Fee structure" 
                        className="h-20 rounded border cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Tuition Fee</div>
                <div className="text-lg font-semibold text-gray-900">{formatFee(fee.tuition_fee)}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Admission Fee</div>
                <div className="text-lg font-semibold text-gray-900">{formatFee(fee.admission_fee)}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Examination Fee</div>
                <div className="text-lg font-semibold text-gray-900">{formatFee(fee.examination_fee)}</div>
              </div>
              <div className="text-center p-3 bg-blue-100 rounded-lg">
                <div className="text-sm text-blue-700">Total Fee</div>
                <div className="text-xl font-bold text-blue-800">{formatFee(fee.total_fee)}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-xs text-gray-600">Library Fee</div>
                <div className="text-sm font-medium">{formatFee(fee.library_fee)}</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-xs text-gray-600">Laboratory Fee</div>
                <div className="text-sm font-medium">{formatFee(fee.laboratory_fee)}</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-xs text-gray-600">Other Fees</div>
                <div className="text-sm font-medium">{formatFee(fee.other_fees)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {fees.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No fee structures found. Add your first fee structure!</p>
        </div>
      )}
    </div>
  );
};

export default FeesManagement;
