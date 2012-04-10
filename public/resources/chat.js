var token = getCookie("Dots-of-Diamonds");
var conversationId = -1;
var loggedInUsers = null;
var chats = {'-1': document.getElementById('chat')};
var highlightColor = '#dde';
var normalColor = '#eee';
var addedListeners = false;

function emit(field) {
	if(conversationId == -1) {
		emitPublic(field);
	} else {
		emitPrivate(field, conversationId);
	}
	console.log('Emitting a message!');
}

function clearField(field) {
	field.value = '';
}

function emitPublic(field)
{
	chat.emit('publicMessage', {"msg":field.value, "token": getCookie("Dots-of-Diamonds")});
	clearField(field);
}

function emitPrivate(field, id)
{
	chat.emit('privateMessage', {'msg':field.value, 'token': getCookie("Dots-of-Diamonds"), 'id': id});
	setNewMessage(document.getElementById('chat_' + id), 'Me', field.value);
	clearField(field);
}

function logout()
{
	chat.emit('logout', {"token": getCookie("Dots-of-Diamonds")});
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
	resetCounter(document.getElementById('counter'));
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
	resetCounter(document.getElementById('counter_' + conversationId));
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

function resetCounter(field)
{
	if(field != undefined)
	{
		field.innerHTML = '';
	}
}

function incrementCounter(field)
{
	var count = field.innerHTML.substring(1, field.innerHTML.length-1);
	if(!isNaN(count))
	{
		count++;
	} else {
		count = 1;
	}
	
	field.innerHTML = '(' + count + ')';
}

function addChatListeners() {
	
	chat.on('publicMessage', function (data) {
		console.log('Recieved a message: ' + data.msg);
		setNewMessage(chats['-1'], data.user, data.msg);
	});
	
	chat.on('privateMessage', function (data) {
		if(chats[data.id] === undefined)
		{
			makeNewChatbox(data.id);
		}
		
		if(conversationId != data.id)
		{
			incrementCounter(document.getElementById('counter_' + data.id));
		}
		setNewMessage(chats[data.id], data.user, data.msg);
	});
	
	chat.on('loggedList', function(array) {
		loggedInUsers = array; //FIXME - discards all 'new message' notifications :(
		rewriteLoggedInUsers();
	});
	
	addedListeners = true;
}

setChatToForeground(-1);
