import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://nfc-backend-9c1q.onrender.com/api/plans')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(plans => setPlans(plans))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const onSubscribe = planId => {
    navigate('/', { state: { scrollToContact: true } });
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-white">Loading plans...</div>;
  if (error)  return <div className="flex justify-center items-center h-screen text-red-400">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-16 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-5xl font-bold text-[#D4AF37] mb-4">Choose Your Plan</h1>
        <p className="text-gray-400 text-lg">Select a plan that suits your needs</p>
        <div className="inline-flex rounded-full bg-white/10 backdrop-blur-md p-1 mt-6">
          {['monthly','quarterly'].map(cycle => (
            <button
              key={cycle}
              onClick={() => setBillingCycle(cycle)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                billingCycle === cycle
                  ? 'bg-[#D4AF37] text-black shadow-xl'
                  : 'text-gray-300 hover:bg-white/20'
              }`}
            >
              {cycle === 'monthly' ? 'Monthly' : 'Quarterly (free 1 month)'}
            </button>
          ))}
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {plans.map(plan => (
          <div
            key={plan.id}
            className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 flex flex-col shadow-2xl transition-transform transform hover:-translate-y-3 hover:shadow-3xl"
          >
            {/* Featured ribbon */}
            {plan.featured && (
              <div className="absolute top-0 right-0 bg-gradient-to-br from-yellow-400 to-yellow-500 text-black px-4 py-1 rounded-tl-2xl rounded-br-2xl text-xs font-bold tracking-wide">
                POPULAR
              </div>
            )}

            {/* Title & price */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#D4AF37]">{plan.name}</h2>
              <p className="mt-2 text-3xl">
                ₹{plan.prices[billingCycle]}
                <span className="text-lg font-medium text-gray-400">
                  /{billingCycle === 'monthly' ? 'mo' : '3 mo'}
                </span>
              </p>
            </div>

            {/* Tagline */}
            {plan.tagline && (
              <p className="text-gray-400 italic mb-4">{plan.tagline}</p>
            )}

            {/* Benefits list */}
            <ul className="flex-1 mb-6 space-y-4 text-gray-200">
              {plan.benefits.map((benefit, i) => (
                <li key={i} className="group relative flex items-center gap-2">
                  <span className="flex-1">{benefit.title}</span>
                  {benefit.detail && (
                    <>
                      <div className="w-5 h-5 flex items-center justify-center border border-gray-400 rounded-full text-gray-400 group-hover:text-white group-hover:border-white transition-colors cursor-pointer">
                        ℹ
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center">
                        <div className="bg-gray-800 text-white text-sm rounded-lg p-3 max-w-xs text-center shadow-lg z-20">
                          {benefit.detail}
                        </div>
                        <div className="w-3 h-3 bg-gray-800 rotate-45 -mt-1 z-10" />
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>

            {/* CTA button */}
            <button
              onClick={() => onSubscribe(plan.id)}
              className="mt-auto bg-gradient-to-br from-yellow-400 to-yellow-500 text-black font-semibold py-3 rounded-full shadow-xl hover:shadow-2xl transition-all"
            >
              {billingCycle === 'monthly'
                ? `Start ${plan.name} — ₹${plan.prices.monthly}/mo`
                : `Start ${plan.name} — ₹${plan.prices.quarterly}/3 mo`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlansPage; 