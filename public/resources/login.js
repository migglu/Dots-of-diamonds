var login = io.connect('http://130.204.179.226:3000/login');

login.on('login', function (data) {
	//console.log(data);
	
	setCookie("Dots-of-Diamonds", data.token);
	//console.log(getCookie("Dots-of-Diamonds"));
	
	window.location = "/chat";
});

function send(form)
{
	var pass = form.pass.value;
	var name = form.user.value;
	pass = hex_md5(pass);
	login.emit('login', {'pass': pass, 'user': name});
	window.stop();
	return false;
}
