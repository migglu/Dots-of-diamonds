var token = getCookie("Dots-of-Diamonds");
var conversationId = -1;
var loggedInUsers = null;
var chats = {'-1': document.getElementById('chat')};
var highlightColor = '#dde';
var normalColor = '#eee';

function emit(field) {
	if(conversationId == -1) {
		emitPublic(field);
	} else {
		emitPrivate(field, conversationId);
	}
}

function clearField(field) {
	field.value = '';
}

function emitPublic(field)
{
	chat.emit('publicMessage', {"msg":field.value, "token": token});
	clearField(field);
}

function emitPrivate(field, id)
{
	chat.emit('privateMessage', {'msg':field.value, 'token': token, 'id': id});
	clearField(field);
}

function logout()
{
	chat.emit('logout', {"token": token});
	window.location = '/index';
	deleteCookie("Dots-of-Diamonds");
}

function scrollToBottom(field)
{
	field.scrollTop = field.scrollHeight;
}

function setNewMessage(field, user, message)
{
	field.innerHTML += user + ': ' + message + '<br />';
	scrollToBottom(field);
}

function makeNewChatbox(id)
{
	var newDiv = document.createElement('div');
	newDiv.type = 'div';
	newDiv.value = '';
	newDiv.id = 'chat_' + id;
	newDiv.setAttribute('class', 'chatbox');
	document.getElementById('chats').appendChild(newDiv);
	chats[id] = newDiv;
	console.log(chats);
}

function setChatToForeground(value)
{
	if(chats[value] == undefined)
	{
		makeNewChatbox(value);
	}
	setChatsToBackground();
	chats[value].style.zIndex = 1;
	if(value == -1) {
		document.getElementById('public').style.backgroundColor = highlightColor;
	} else {
		document.getElementById('user_' + value).style.backgroundColor = highlightColor;
	}
}

function setChatsToBackground()
{
	for(var key in chats)
	{
		chats[key].style.zIndex = 0;
	}
	
	var childNodes = document.getElementById('users').getElementsByTagName('div');
	for(var i = 0; i < childNodes.length; i++)
	{
		childNodes[i].style.backgroundColor = normalColor; 
	}
	document.getElementById('public').style.backgroundColor = normalColor;

}

function setConversationTo(value)
{
	conversationId = value;
	setChatToForeground(value);
}

function getIndexFromField(field)
{
	var startIndex = field.id.indexOf('_') + 1;
	return field.id.substring(startIndex);
}

function setConversation(field)
{
	conversationId = getIndexFromField(field);
	setChatToForeground(conversationId);
}

function rewriteLoggedInUsers() {
	var users = document.getElementById('users');
	users.innerHTML = '';
	var key;
	for (key in loggedInUsers)
	{
		var value = loggedInUsers[key].name;
		var id = loggedInUsers[key].id;
		if(conversationId == id) {
			
		}
		users.innerHTML += '<div class="userElement" id="user_' + id + '" onclick="setConversation(this);">' + value + '<span id="counter_' + id + '"></span></div>';
	}
}

function addChatListeners() {
	
	chat.on('publicMessage', function (data) {
		setNewMessage(chats['-1'], data.user, data.msg);
	});
	
	chat.on('privateMessage', function (data) {
		if(chats[data.id] === undefined)
		{
			makeNewChatbox(data.id);
		}
		setNewMessage(chats[data.id], data.user, data.msg);
	});
	
	chat.on('loggedList', function(array) {
		loggedInUsers = array;
		rewriteLoggedInUsers();
	});
}

setChatToForeground(-1);
