const SMSActivate = require("../lib");
const sms = new SMSActivate(process.env.SMS_TOKEN);

sms
  .getBalance()
  .then(async (balance) => {
    if (balance > 0) {
      const { id, number } = await sms.getNumber("ya", 1); // yandex
      console.log(`Number: ${number}, Order Id: ${id}`);

      await sms.setStatus(id, 1);

      // you can add timeout to here
      const waitForCode = setInterval(async () => {
        const code = await sms.getCode(id);
        if (code) {
          clearInterval(waitForCode);
          console.log(`code received: ${code}`);
          await sms.setStatus(id, 6);
        }
      }, 1000);
    } else {
      console.log("Balance is zero", balance);
    }
  })
  .catch(console.error);
