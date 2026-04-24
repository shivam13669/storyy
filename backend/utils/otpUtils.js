/**
 * Generate a random 6-digit OTP
 * @returns {string} 6-digit OTP code
 */
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Get OTP expiration time (5 minutes from now)
 * @returns {string} ISO timestamp for expiration
 */
export function getOTPExpirationTime() {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
  return expiresAt.toISOString();
}

/**
 * Check if OTP has expired
 * @param {string} expiresAt - ISO timestamp of expiration
 * @returns {boolean} True if OTP has expired
 */
export function isOTPExpired(expiresAt) {
  const now = new Date();
  const expiryDate = new Date(expiresAt);
  return now > expiryDate;
}

/**
 * Verify OTP code
 * @param {string} inputOTP - OTP entered by user
 * @param {string} storedOTP - OTP stored in database
 * @param {string} expiresAt - Expiration timestamp
 * @returns {Object} Verification result with status and message
 */
export function verifyOTP(inputOTP, storedOTP, expiresAt) {
  // Check if OTP has expired
  if (isOTPExpired(expiresAt)) {
    return {
      success: false,
      message: 'OTP has expired. Please request a new one.',
      code: 'OTP_EXPIRED',
    };
  }

  // Check if OTP matches
  if (inputOTP.trim() !== storedOTP.trim()) {
    return {
      success: false,
      message: 'Invalid OTP. Please check and try again.',
      code: 'INVALID_OTP',
    };
  }

  return {
    success: true,
    message: 'OTP verified successfully',
    code: 'OTP_VERIFIED',
  };
}

/**
 * Check if email has exceeded OTP send limit for a specific purpose
 * @param {Array} sendHistory - Array of send history records
 * @param {number} limit - Maximum OTPs allowed (default 3)
 * @returns {Object} Check result with exceeded flag and remaining count
 */
export function checkOTPSendLimit(sendHistory, limit = 3) {
  const count = sendHistory.length;
  const exceeded = count >= limit;

  return {
    exceeded,
    count,
    limit,
    remaining: Math.max(0, limit - count),
  };
}

/**
 * Check if resend is allowed based on cooldown
 * @param {Object} lastOTPData - Last OTP record
 * @param {number} cooldownSeconds - Cooldown period in seconds (default 30)
 * @returns {Object} Check result with allowed flag and remaining seconds
 */
export function checkResendCooldown(lastOTPData, cooldownSeconds = 30) {
  if (!lastOTPData || !lastOTPData.createdAt) {
    return {
      allowed: true,
      remaining: 0,
    };
  }

  const createdTime = new Date(lastOTPData.createdAt).getTime();
  const now = new Date().getTime();
  const elapsedSeconds = Math.floor((now - createdTime) / 1000);
  const remaining = Math.max(0, cooldownSeconds - elapsedSeconds);

  return {
    allowed: remaining === 0,
    remaining,
  };
}

/**
 * Check if wrong OTP attempts exceed limit
 * @param {Array} attempts - Array of attempt records
 * @param {number} limit - Maximum attempts allowed (default 3)
 * @returns {Object} Check result with exceeded flag and attempt count
 */
export function checkWrongAttemptLimit(attempts, limit = 3) {
  const wrongAttempts = attempts.filter(a => !a.isCorrect).length;
  const exceeded = wrongAttempts >= limit;

  return {
    exceeded,
    wrongAttempts,
    limit,
    remaining: Math.max(0, limit - wrongAttempts),
  };
}

/**
 * Check if email is currently blocked
 * @param {Object} activeBlock - Active block record from database
 * @returns {Object} Check result with blocked flag and remaining time
 */
export function checkEmailBlock(activeBlock) {
  if (!activeBlock) {
    return {
      blocked: false,
      remaining: 0,
    };
  }

  const now = new Date().getTime();
  const unblockTime = new Date(activeBlock.unblockAt).getTime();
  const remainingMs = Math.max(0, unblockTime - now);
  const remainingMinutes = Math.ceil(remainingMs / (60 * 1000));

  return {
    blocked: remainingMs > 0,
    remaining: remainingMinutes,
    unblockAt: activeBlock.unblockAt,
  };
}
