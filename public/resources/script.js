
function hash(element)
{
	var pass = document.forms["register"].pass.value
	document.forms["register"].pass.value = hex_md5(pass);
}
