import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Download, Eye, Search, Filter } from 'lucide-react';
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
  fee_structure_image?: string;
}

interface PaymentRecord {
  id: string;
  student_id: string;
  fee_structure_id: string;
  amount_paid: number;
  payment_date: string;
  payment_method: string;
  transaction_id: string;
  status: 'completed' | 'pending' | 'failed';
  installment_number: number;
  due_date: string;
}

const StudentFeesManagement: React.FC = () => {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [studentInfo, setStudentInfo] = useState({
    name: 'John Doe',
    student_id: 'STU2024001',
    program: 'Bachelor of Education (B.Ed)',
    current_semester: '3rd Semester',
    academic_year: '2024-25'
  });

  useEffect(() => {
    fetchFeeStructures();
    fetchPaymentHistory();
  }, []);

  const fetchFeeStructures = async () => {
    try {
      const { data, error } = await supabase
        .from('fees')
        .select('*')
        .order('academic_year', { ascending: false });

      if (error) throw error;
      setFeeStructures(data || []);
      
      // Auto-select student's program fee structure
      if (data && data.length > 0) {
        const studentProgram = data.find(fee => 
          fee.program_name.includes('B.Ed') || fee.program_name === studentInfo.program
        );
        if (studentProgram) {
          setSelectedProgram(studentProgram.id);
        }
      }
    } catch (error) {
      console.error('Error fetching fee structures:', error);
      // Mock data for demo
      setFeeStructures([
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
          fee_structure_image: ''
        }
      ]);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('student_id', studentInfo.student_id)
        .order('payment_date', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
      
      // Mock payment data for demo
      if (!data || data.length === 0) {
        setPayments([
          {
            id: '1',
            student_id: 'STU2024001',
            fee_structure_id: '1',
            amount_paid: 15000,
            payment_date: '2024-06-15',
            payment_method: 'Online Transfer',
            transaction_id: 'TXN00123456',
            status: 'completed',
            installment_number: 1,
            due_date: '2024-06-30'
          },
          {
            id: '2',
            student_id: 'STU2024001',
            fee_structure_id: '1',
            amount_paid: 15000,
            payment_date: '2024-07-10',
            payment_method: 'Credit Card',
            transaction_id: 'TXN00123457',
            status: 'completed',
            installment_number: 2,
            due_date: '2024-07-15'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[status as keyof typeof statusConfig]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const selectedFeeStructure = feeStructures.find(fee => fee.id === selectedProgram);
  const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, payment) => sum + payment.amount_paid, 0);
  const remainingAmount = (selectedFeeStructure?.total_fee || 0) - totalPaid;
  const paymentProgress = (totalPaid / (selectedFeeStructure?.total_fee || 1)) * 100;

  const filteredPayments = payments.filter(payment =>
    payment.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.payment_method.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadReceipt = (payment: PaymentRecord) => {
    // Simulate receipt download
    const receiptContent = `
      FEE PAYMENT RECEIPT
      --------------------
      Student: ${studentInfo.name}
      Student ID: ${studentInfo.student_id}
      Program: ${studentInfo.program}
      
      Payment Date: ${formatDate(payment.payment_date)}
      Transaction ID: ${payment.transaction_id}
      Amount Paid: ${formatFee(payment.amount_paid)}
      Payment Method: ${payment.payment_method}
      Installment: ${payment.installment_number}
      
      Status: ${payment.status.toUpperCase()}
      
      Thank you for your payment!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${payment.transaction_id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading fee information...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Student Info Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Student:</span> {studentInfo.name}
              </div>
              <div>
                <span className="font-medium">Student ID:</span> {studentInfo.student_id}
              </div>
              <div>
                <span className="font-medium">Program:</span> {studentInfo.program}
              </div>
              <div>
                <span className="font-medium">Semester:</span> {studentInfo.current_semester}
              </div>
              <div>
                <span className="font-medium">Academic Year:</span> {studentInfo.academic_year}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Fee Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Total Fee</h3>
              <p className="text-2xl font-bold text-gray-900">
                {selectedFeeStructure ? formatFee(selectedFeeStructure.total_fee) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Paid Amount Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Paid Amount</h3>
              <p className="text-2xl font-bold text-green-600">{formatFee(totalPaid)}</p>
            </div>
          </div>
        </div>

        {/* Remaining Amount Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">Remaining Amount</h3>
              <p className="text-2xl font-bold text-orange-600">{formatFee(remainingAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {selectedFeeStructure && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Payment Progress</span>
            <span className="text-sm text-gray-600">{Math.round(paymentProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${paymentProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Fee Structure Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Fee Structure Details</h2>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Program</option>
            {feeStructures.map(fee => (
              <option key={fee.id} value={fee.id}>
                {fee.program_name} ({fee.academic_year})
              </option>
            ))}
          </select>
        </div>

        {selectedFeeStructure ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Tuition Fee</div>
                <div className="text-lg font-semibold">{formatFee(selectedFeeStructure.tuition_fee)}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Admission Fee</div>
                <div className="text-lg font-semibold">{formatFee(selectedFeeStructure.admission_fee)}</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Examination Fee</div>
                <div className="text-lg font-semibold">{formatFee(selectedFeeStructure.examination_fee)}</div>
              </div>
              <div className="text-center p-3 bg-blue-100 rounded-lg">
                <div className="text-sm text-blue-700">Total Fee</div>
                <div className="text-xl font-bold text-blue-800">{formatFee(selectedFeeStructure.total_fee)}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-xs text-gray-600">Library Fee</div>
                <div className="text-sm font-medium">{formatFee(selectedFeeStructure.library_fee)}</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-xs text-gray-600">Laboratory Fee</div>
                <div className="text-sm font-medium">{formatFee(selectedFeeStructure.laboratory_fee)}</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <div className="text-xs text-gray-600">Other Fees</div>
                <div className="text-sm font-medium">{formatFee(selectedFeeStructure.other_fees)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                Due Date: <span className="font-medium">{formatDate(selectedFeeStructure.due_date)}</span>
              </div>
              {selectedFeeStructure.fee_structure_image && (
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Eye className="h-4 w-4" />
                  <span>View Fee Structure</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Please select a program to view fee details
          </div>
        )}
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Payment History</h2>
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {filteredPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Installment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(payment.payment_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.transaction_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatFee(payment.amount_paid)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.payment_method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{payment.installment_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => downloadReceipt(payment)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-900"
                      >
                        <Download className="h-4 w-4" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No payment records found
          </div>
        )}
      </div>

      {/* Make Payment Button */}
      <div className="flex justify-center">
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
          Make Payment
        </button>
      </div>
    </div>
  );
};

export default StudentFeesManagement;
