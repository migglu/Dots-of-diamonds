var loginURL = 'http://' + window.location.host + '/login';

var login = io.connect(loginURL);

login.on('login', function (data) {
	setCookie("Dots-of-Diamonds", data.token);
	window.location = '/chat';
});

function send(form)
{
	var pass = form.pass.value;
	var name = form.user.value;
	pass = hex_sha256(pass);
	
	
	
	login.emit('login', {'pass': pass, 'user': name});
	

}

if(getCookie('Dots-of-Diamonds'))
{
	window.location = '/chat';
}
