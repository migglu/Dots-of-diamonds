
function setCookie(name, value)
{
	var c_value=escape(value);
	document.cookie= name + "=" + c_value;
}

function getCookie(cookieName)
{
	var i, name, data, ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
		name = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		data = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		name = name.replace(/^\s+|\s+$/g,"");
		if (name == cookieName)
		{
			return unescape(data);
		}
	}
}