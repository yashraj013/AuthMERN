import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendVerifyOtp, verifyAccount, error, clearError } = useAuth();

  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [info, setInfo] = useState('');

  const state = location.state || {};
  const userId = state.userId;
  const email = state.email;

  useEffect(() => {
    if (!userId) {
      // If no userId provided, redirect to register
      navigate('/register', { replace: true });
    }
  }, [userId, navigate]);

  const handleResend = async () => {
    if (!userId) return;
    clearError();
    setInfo('');
    const res = await sendVerifyOtp(userId);
    if (res.success) {
      setInfo('A new OTP has been sent to your email.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !otp.trim()) return;
    clearError();
    setIsSubmitting(true);
    const res = await verifyAccount(userId, otp.trim());
    setIsSubmitting(false);
    if (res.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center auth-bg">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="card-header text-center">
            <h1 className="text-2xl font-bold mb-2">Verify your email</h1>
            <p className="text-gray-600">
              {email ? `We sent a 6-digit code to ${email}` : 'Enter the 6-digit code sent to your email'}
            </p>
          </div>

          <div className="card-body">
            {error && (
              <div className="alert alert-error mb-3">{error}</div>
            )}
            {info && (
              <div className="alert alert-success mb-3">{info}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="otp" className="form-label">6-digit OTP</label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="form-input tracking-widest text-center"
                  placeholder="Enter code"
                />
              </div>

              <button type="submit" disabled={isSubmitting || otp.length !== 6} className="btn btn-primary w-full mt-2">
                {isSubmitting ? (
                  <>
                    <span className="spinner mr-2"></span>
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <button onClick={handleResend} className="btn-link">Resend OTP</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;



