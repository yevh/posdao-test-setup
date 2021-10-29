module.exports = function (cmd) {
return new Promise((resolve, reject) => {
	const { spawn } = require('child_process');
	cmd = cmd.replace(" 2>/dev/null", "");
	cmd = cmd.split("'").join(""); //replaceAll
	console.log('**** CMD:', cmd);
	exec = spawn("cmd.exe", ["/c", cmd])
	exec.stdout.on('data', function (data) {
		console.log("**** Response" + data);
		let resp;
	
	  try {
		console.log('**** Data: ' + data);
		resp = JSON.parse(data);
	  } catch(e) {
		reject(e);
	  }
	  console.log('**** Request:', cmd);
	  if (resp.hasOwnProperty('result')) {
		resolve(resp.result);
	  } else {
        reject(new Error(`JSON RPC result is undefined. Response text: ${exec.stdout}`));
	  }
	});
  })
}
