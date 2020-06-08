import axios from 'axios';

const sendEmail = async params => {
  const data = {
    service_id: 'gmail',
    template_id: 'template_W574eIH7',
    user_id: 'user_hdVnZdGPAUC5Bc08zcrEE',
    template_params: {
      ...params,
      to_email: 'adm.at.gwampi@gmail.com',
      app_name: 'Moneytor'
    }
  };
   
  axios({
    method: 'post',
    url: 'https://api.emailjs.com/api/v1.0/email/send',
    data
  })
  .then(res => {
    console.log("INFO: mail sent");
    return true;
  })
  .catch(err => {
    console.log("ERROR: could not send email");
    return false;
  })
};

export { sendEmail };
