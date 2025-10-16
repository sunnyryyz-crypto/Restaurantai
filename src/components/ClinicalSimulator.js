import React, { useState, useEffect } from 'react';
import { FlaskConical, Clock, Heart, Activity, Thermometer, Eye } from 'lucide-react';
import Button from './Button';

const MOCK_CASES = [
  {
    id: 1,
    title: "Acute Myocardial Infarction Management",
    description: "65 y/o male with history of hypertension, presenting with acute onset of severe substernal chest pain. Vitals stable upon arrival.",
    initialVitals: {
      bloodPressure: "160/95",
      heartRate: "95",
      temperature: "37.2°C",
      respiratoryRate: "22",
      oxygenSaturation: "95%"
    },
    chiefComplaint: "Severe chest pain for 2 hours",
    objectives: [
      "Stabilize the patient",
      "Perform appropriate diagnostic tests",
      "Initiate appropriate treatment",
      "Arrange for definitive care"
    ],
    timeLimit: 20
  },
  {
    id: 2,
    title: "Pneumonia Management",
    description: "45 y/o female with fever, cough, and shortness of breath. Physical exam reveals crackles in the right lower lobe.",
    initialVitals: {
      bloodPressure: "130/80",
      heartRate: "110",
      temperature: "38.5°C",
      respiratoryRate: "28",
      oxygenSaturation: "88%"
    },
    chiefComplaint: "Fever and cough for 3 days",
    objectives: [
      "Establish diagnosis",
      "Assess severity",
      "Initiate appropriate antibiotic therapy",
      "Monitor response to treatment"
    ],
    timeLimit: 15
  }
];

const ClinicalSimulator = () => {
  const [caseState, setCaseState] = useState('initial'); // 'initial', 'active', 'finished'
  const [currentCase, setCurrentCase] = useState(null);
  const [time, setTime] = useState(0);
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState('');
  const [vitals, setVitals] = useState({});
  const [patientCondition, setPatientCondition] = useState('Fair');

  useEffect(() => {
    let interval = null;
    if (caseState === 'active') {
      interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000); // Simulate 1 second = 1 minute in case time
    } else if (interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [caseState]);

  const handleStartCase = (caseId) => {
    const selectedCase = MOCK_CASES.find(c => c.id === caseId);
    setCurrentCase(selectedCase);
    setCaseState('active');
    setTime(0);
    setOrders([]);
    setNewOrder('');
    setVitals(selectedCase.initialVitals);
    setPatientCondition('Fair');
  };

  const handleEnterOrder = () => {
    if (newOrder.trim()) {
      const order = {
        id: Date.now(),
        time: time,
        text: newOrder,
        type: 'Order',
        status: 'Pending'
      };
      setOrders([order, ...orders]);
      setNewOrder('');
      
      // Simulate order processing and patient response
      setTimeout(() => {
        setOrders(prev => prev.map(o => 
          o.id === order.id ? { ...o, status: 'Completed' } : o
        ));
        
        // Simulate patient improvement based on appropriate orders
        if (newOrder.toLowerCase().includes('aspirin') || newOrder.toLowerCase().includes('nitroglycerin')) {
          setPatientCondition('Improving');
          setVitals(prev => ({
            ...prev,
            heartRate: (parseInt(prev.heartRate) - 5).toString(),
            bloodPressure: '150/90'
          }));
        }
      }, 2000);
    }
  };

  const handleAdvanceTime = (minutes) => {
    setTime(t => t + minutes);
    // Simulate time progression effects
    if (time > 10 && patientCondition === 'Fair') {
      setPatientCondition('Deteriorating');
    }
  };

  const handleEndCase = () => {
    setCaseState('finished');
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getVitalColor = (vital, value) => {
    switch (vital) {
      case 'heartRate':
        return parseInt(value) > 100 ? 'text-red-600' : 'text-green-600';
      case 'bloodPressure':
        return value.includes('160') ? 'text-red-600' : 'text-green-600';
      case 'temperature':
        return value.includes('38') ? 'text-red-600' : 'text-green-600';
      case 'oxygenSaturation':
        return parseInt(value) < 95 ? 'text-red-600' : 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  if (caseState === 'initial') {
    return (
      <div className="p-8">
        <h2 className="text-3xl font-extrabold text-purple-800 mb-6 text-center">Clinical Management Simulator (CCS)</h2>
        <p className="text-lg text-gray-600 mb-10 text-center">Practice the Computer-Based Case Simulations component of Step 3 by managing virtual patients.</p>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {MOCK_CASES.map((caseItem) => (
            <div key={caseItem.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-t-4 border-purple-500">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FlaskConical className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{caseItem.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{caseItem.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {caseItem.timeLimit} min</span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Case Simulation</span>
                </div>
                <Button 
                  onClick={() => handleStartCase(caseItem.id)} 
                  className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-300 w-full"
                  icon={FlaskConical}
                >
                  Start Case
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (caseState === 'finished') {
    return (
      <div className="p-8 bg-white rounded-xl shadow-xl max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-green-800 mb-4">Case Completed!</h2>
        <p className="text-lg text-gray-600 mb-6">You have successfully completed the {currentCase?.title} case.</p>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Case Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Time Taken:</span> {formatTime(time)}
            </div>
            <div>
              <span className="font-medium">Orders Placed:</span> {orders.length}
            </div>
            <div>
              <span className="font-medium">Final Condition:</span> {patientCondition}
            </div>
            <div>
              <span className="font-medium">Objectives Met:</span> {currentCase?.objectives.length || 0}
            </div>
          </div>
        </div>

        <div className="flex space-x-4 justify-center">
          <Button onClick={() => setCaseState('initial')} primary={false}>
            Back to Cases
          </Button>
          <Button onClick={() => handleStartCase(currentCase?.id)} className="bg-purple-600 hover:bg-purple-700">
            Retry Case
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-purple-800 mb-2">{currentCase?.title}</h3>
          <p className="text-gray-700">{currentCase?.description}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600 flex items-center">
            <Clock className="w-6 h-6 mr-2" />
            {formatTime(time)}
          </div>
          <div className="text-sm text-gray-500">Time Elapsed</div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Patient Information & Vitals */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Chief Complaint</h4>
            <p className="text-gray-700">{currentCase?.chiefComplaint}</p>
          </div>

          {/* Vitals Display */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-100 rounded-lg text-center">
              <Heart className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <p className="text-xs text-gray-500">Heart Rate</p>
              <p className={`text-xl font-bold ${getVitalColor('heartRate', vitals.heartRate)}`}>
                {vitals.heartRate} bpm
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg text-center">
              <Activity className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-xs text-gray-500">Blood Pressure</p>
              <p className={`text-xl font-bold ${getVitalColor('bloodPressure', vitals.bloodPressure)}`}>
                {vitals.bloodPressure}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg text-center">
              <Thermometer className="w-6 h-6 mx-auto mb-2 text-orange-500" />
              <p className="text-xs text-gray-500">Temperature</p>
              <p className={`text-xl font-bold ${getVitalColor('temperature', vitals.temperature)}`}>
                {vitals.temperature}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg text-center">
              <Eye className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-xs text-gray-500">O2 Sat</p>
              <p className={`text-xl font-bold ${getVitalColor('oxygenSaturation', vitals.oxygenSaturation)}`}>
                {vitals.oxygenSaturation}
              </p>
            </div>
          </div>

          {/* Order Entry */}
          <div className="border p-4 rounded-lg bg-gray-50">
            <h4 className="font-bold mb-2 text-gray-800">Enter New Order</h4>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newOrder}
                onChange={(e) => setNewOrder(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEnterOrder()}
                placeholder="e.g., Aspirin 325mg PO STAT, ECG, Cardiac Enzymes"
                className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
              <Button onClick={handleEnterOrder} className="bg-purple-600 hover:bg-purple-700">
                Place Order
              </Button>
            </div>
            <div className="mt-3 flex space-x-3">
              <Button onClick={() => handleAdvanceTime(5)} primary={false}>Advance 5 min</Button>
              <Button onClick={() => handleAdvanceTime(30)} primary={false}>Advance 30 min</Button>
              <Button onClick={handleEndCase} className="bg-red-500 hover:bg-red-600">
                End Case
              </Button>
            </div>
          </div>

          {/* Case Objectives */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">Case Objectives:</h4>
            <ul className="list-disc list-inside text-purple-700 space-y-1">
              {currentCase?.objectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Orders Timeline */}
        <div className="md:col-span-1 border-l pl-4">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Orders & Timeline</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {orders.length === 0 ? (
              <p className="text-gray-500 italic">No orders placed yet. Start managing the patient!</p>
            ) : (
              orders.map((item) => (
                <div key={item.id} className={`p-3 bg-white border rounded-lg shadow-sm ${
                  item.status === 'Completed' ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs text-gray-500 font-mono">[{formatTime(item.time)}]</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      item.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="font-medium text-gray-800 text-sm">{item.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalSimulator;