
function hash(element)
{
	var pass = element.pass.value
	if(pass != '')
	{
		element.pass.value = hex_sha256(pass);
	}
}
