const Address = require('address-rfc2821').Address;

exports.hook_rcpt = function (next, connection, params) { 

  this.loginfo(JSON.stringify());
  this.loginfo("Staring auth0 custom hook processing...");

  const decodeRealEmail = encodedEmail => {
    const b64 = encodedEmail.split('_')[0];
    return Buffer.from(b64,"base64").toString('ascii');
  }

  const decodeRealEmail2 = encodedEmail => {
    const hex = encodedEmail.split('_')[0];
    return Buffer.from(hex,"hex").toString('ascii');
  }


  const rcpt = params[0];
  const realEmail = decodeRealEmail(rcpt.user).trim();

  this.loginfo(`Switching from ${rcpt} -> ${realEmail}`);

  connection.transaction.rcpt_to.pop();
  connection.transaction.rcpt_to.push(new Address(`<${realEmail}>`));
  connection.relaying = true;
  
  connection.transaction.remove_header("To");  
  connection.transaction.add_header("To",realEmail);

  const [user,host] = realEmail.split('@');
  rcpt.user = user;
  rcpt.domain = host;
	
	next();
}
