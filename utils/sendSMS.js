const sendSMS = async (phone, message) => {
  console.log("=================================");
  console.log("📱 SMS NOTIFICATION (SIMULATED)");
  console.log("To:", phone);
  console.log("Message:", message);
  console.log("Status: SENT ✅");
  console.log("=================================\n");
};

module.exports = sendSMS;