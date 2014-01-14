$(function(){
	'use strict';

	//var socket = io.connect('localhost:8080');
	var socket = io.connect(window.location.hostname);

	socket.on('connect', function (data) {
		console.log('Połączony!');

		$('#row').children().remove();
	});

	$('#editMainContent').css('display', 'none');
	$('#editMainBoxBtn').tooltip({trigger: 'hover', title: 'edytuj'});
	$('#addSubBoxBtn').tooltip({trigger: 'hover', title: 'dodaj kategorię'});

	var parentId;

	//------------------funkcje pomocnicze NIE MOJE 
	var rgb2hex = function (rgb) {

		var hexDigits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"]; 

		var hex = function (x) {
			return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
		};

		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	};

	var getDarkenColor = function(color , percent) { 
		var R = parseInt(color.substring(1,3),16);
		var G = parseInt(color.substring(3,5),16);
		var B = parseInt(color.substring(5,7),16);

		// console.log('r: ' + R + ' g: ' + G + ' b: ' + B);

		R = parseInt(R * (100 - percent) / 100,10);
		G = parseInt(G * (100 - percent) / 100,10);
		B = parseInt(B * (100 - percent) / 100,10);

		R = (R<255)?R:255;
		G = (G<255)?G:255;
		B = (B<255)?B:255;

		var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
		var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
		var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

		// console.log('r: ' + RR + ' g: ' + GG + ' b: ' + BB);

		return '#' + RR + GG + BB;
	};
		//-----------------ta już moja :D
	var getNextBoxColor = function(boxId){

         var colors = [ '#b8ff5c','#d6b6e6','#fbff00','#1eb486','#fe6f5e','#794044','#5cb8ff',
         '#981b1e','#93c572','#404679','#ecca61','#ffe2e3','#794044','#e2fffe','#53868b',
         '#00513d','#F4A460','#54FF9F','#FFF68F','gray' ];

         return colors[(boxId%20)];
	};
	//--------------------subBox
	var drawSubBox = function(id, content){

		return '<div class="span4">'+
			'<div class="hero-unit"  id="'+id+'" style="display: none;">'+
				'<table class="table">'+
					'<tr>'+
						'<td>'+
							'<h3 id="content'+id+'">'+content+'</h3>'+
							'<div class="form-inline" id="editBoxContent'+id+'" style="display: none">'+
										'<input type="text" class="input-medium" id="editBoxContentVal'+id+'" maxlength="16">'+
										'<button class="btn" id="editBoxContentCancelBtn'+id+'">'+
											'<i class="icon-remove"></i>'+
										'</button>'+
										'<button class="btn btn-primary" id="editBoxContentBtn'+id+'">'+
											'<i class="icon-ok icon-white"></i>'+
										'</button>'+
							'</div>'+
						'</td>'+
						'<td style="text-align: right;">'+
						'<div class="btn-group">'+
							'<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">'+
							'<i class="icon-wrench"></i>'+
							'</a>'+
							'<ul class="dropdown-menu" style="text-align: left; min-width: 30px;">'+
							'<li><button class="btn btn-link"  id="btnSave'+ id + '">'+
								'<i class="icon-plus"></i>'+
								'</button></li>'+
									'<li class="divider"/>'+
							'<li><button class="btn btn-link" id="btnEdit'+ id +'">'+
									'<i class="icon-pencil"></i>'+
									'</button></li>'+
								'<li class="divider"/>'+
							'<li><button class="btn btn-link"  id="btnRm'+ id + '">'+
								'<i class="icon-trash"></i>'+
								'</button></li>'+
							'</ul>'+
						'</div>'+
						'</td>'+
					'</tr>'+
				'</table>'+
			'</div>'+
		'</div>';
	};

	//dodawanie duzego boxa
	var addBoxAction = function (subBoxId, content) {
		$('#row').append(drawSubBox(subBoxId, content));
		$('#'+subBoxId).css('background', getNextBoxColor(subBoxId));
		$('#'+subBoxId).slideDown();

		//obsluga dodawania malego boxa z menu
		$('#btnSave'+subBoxId).click( function() { 
			$('#myAddSubBoxModal').modal('show');
			var parent = $(this).attr('id');
			parentId = parseInt(parent.substring(7,parent.length),10); // <------
			$('#myAddSubBoxModalLabel').text('Dodaj podkategorię: ' + $('#content'+parentId).text());
		});
				
		//usun duzego boxa
		$('#btnRm'+subBoxId).click( function() {
			var id = $(this).attr('id');
			id = parseInt(id.substring(5,id.length),10);
			socket.emit('rmBox', id);
		});

		//edytuj duzego boxa
		$('#btnEdit'+subBoxId).click( function() {
			var BoxId = $(this).attr('id');
			BoxId = BoxId.substring(7,BoxId.length);
			$('#editBoxContentVal'+BoxId).val($('#content'+BoxId).text());
			$('#content'+BoxId).hide();
			$('#editBoxContent'+BoxId).show();

		});

		//anuluj edycje boxa
		$('#editBoxContentCancelBtn'+subBoxId).click( function () {
			var BoxId = $(this).attr('id');
			BoxId = BoxId.substring(23,BoxId.length);
			$('#editBoxContent'+BoxId).hide();
			$('#content'+BoxId).show();
		});
		
		//potwierdz edycje boxa
		$('#editBoxContentBtn'+subBoxId).click( function (){
			var BoxId = $(this).attr('id');
			BoxId = BoxId.substring(17,BoxId.length);
			socket.emit('setNewBoxContent', {'id': BoxId, 'content': $('#editBoxContentVal'+BoxId).val()});
			$('#editBoxContent'+BoxId).hide();
			$('#content'+BoxId).show();
		} );

		$('#'+subBoxId+' .content').css('color', 'black');
		$('.span4').css('margin','5px 5px 0px 5px');
		$('.btn').css('margin', '2px');
		$('.dropdown-toggle').tooltip({trigger: 'hover', title: 'opcje'});
		$('#btnSave'+subBoxId).tooltip({trigger: 'hover', title: 'dodaj podkategorię', placement: 'left'});
		$('#btnRm'+subBoxId).tooltip({trigger: 'hover', title: 'usuń kategorię', placement: 'left'});
		$('#btnEdit'+subBoxId).tooltip({trigger: 'hover', title: 'edytuj kategorię', placement: 'left'});
	};

	//akcja usuwania duzego boxu
	var rmSubBoxAction = function(parentId){
		$('#'+parentId).slideUp('fast', function(){ 
			$('#'+parentId).parent().remove(); 
			$('.span4').css('margin','5px 5px 0px 5px');
		});
	};

	//obsluga klawisza dodaj z modala
	$('#myAddBoxSaveBtn').click(function(){
		var content = $('#myAddBoxModalContent').val();
		if(content.length > 0){
			socket.emit('addNewBox', content);
			$('#myAddBoxModal').modal('hide');
			$('#myAddBoxModalContent').val('');
		}
	});

	var addBoxClick = function(){
		$('#myAddBoxModal').modal('show');		
	};

	$('#addSubBoxBtn').click( function() { addBoxClick(); });

	//-----------------------innerSubBox

	var addInnerBoxAction = function(parentId, content, subInnerBoxId){
		$('#'+parentId).append(drawSubInnerBox(subInnerBoxId, content));
			var innerBoxColor = rgb2hex($('#'+parentId).css('background-color'));
			var innerBoxDarkenColor = getDarkenColor(innerBoxColor,20);

			$('#sub'+subInnerBoxId).css('background', innerBoxDarkenColor);
			
			$('#sub'+subInnerBoxId).slideDown();
			$('#sub'+subInnerBoxId).css('color','black');
			
			//usuwanie malego boxa
			$('#innerRm'+subInnerBoxId).click(function (){
				socket.emit('rmInnerBox', subInnerBoxId); 
			});

			//edycja malego boxa
			$('#innerEdit'+subInnerBoxId).click( function () {
				var BoxId = $(this).attr('id');
				BoxId = BoxId.substring(9,BoxId.length);
				$('#editInnerBoxContentVal'+BoxId).val($('#innerContent'+BoxId).text());
				$('#innerContent'+BoxId).hide();
				$('#editInnerBoxContent'+BoxId).show();
			});

			//rezygnacja z edycji
		$('#editInnerBoxContentCancelBtn'+subInnerBoxId).click( function () {
			var BoxId = $(this).attr('id');
			BoxId = BoxId.substring(28,BoxId.length);
			$('#editInnerBoxContent'+BoxId).hide();
			$('#innerContent'+BoxId).show();		
		});
		
			//potwierdzenie edycji
		$('#editInnerBoxContentBtn'+subInnerBoxId).click( function (){
			var BoxId = $(this).attr('id');
			BoxId = BoxId.substring(22,BoxId.length);
			socket.emit('setNewInnerBoxContent', {'id': BoxId, 'content': $('#editInnerBoxContentVal'+BoxId).val()});
			$('#editInnerBoxContent'+BoxId).hide();
			$('#innerContent'+BoxId).show();
		} );

			$('.btn').css('margin', '2px');
			$('.dropdown-toggle').tooltip({trigger: 'hover', title: 'opcje'});
			$('#innerRm'+subInnerBoxId).tooltip({trigger: 'hover', title: 'usuń podkategorię', placement: 'left'});
			$('#innerEdit'+subInnerBoxId).tooltip({trigger: 'hover', title: 'edytuj podkategorię', placement: 'left'});
	};

	var drawSubInnerBox = function(id, content){

		return '<div class="hero-unit" id="sub'+id+'"  style="display: none;">'+
					'<table class="table">'+
						'<tr>'+
							'<td><h3 id="innerContent'+id+'">'+content+'</h3>'+
							'<div class="form-inline" id="editInnerBoxContent'+id+'" style="display: none">'+
								'<input type="text" class="input-small" id="editInnerBoxContentVal'+id+'" maxlength="16">'+
								'<button class="btn" id="editInnerBoxContentCancelBtn'+id+'">'+
									'<i class="icon-remove"></i>'+
								'</button>'+
								'<button class="btn btn-primary" id="editInnerBoxContentBtn'+id+'">'+
									'<i class="icon-ok icon-white"></i>'+
								'</button>'+
							'</div>'+
							'</td>'+
							'<td style="text-align: right;">'+
							'<div class="btn-group">'+
									'<a class="btn dropdown-toggle" data-toggle="dropdown" href="#">'+
									'<i class="icon-wrench"></i>'+
									'</a>'+
									'<ul class="dropdown-menu" style="text-align: left; min-width: 30px;">'+
									'<li><button class="btn btn-link" id="innerEdit'+ id +'">'+
										'<i class="icon-pencil"></i>'+
										'</button></li>'+
										'<li class="divider"/>'+
									'<li><button class="btn btn-link" id="innerRm'+ id + '">'+
											'<i class="icon-trash"></i>'+
										'</button></li>'+
									'</ul>'+
								'</div>'+
							'</td>'+
						'</tr>'+
					'</table>'+
		'</div>';
	};

	var rmInnerBoxAction = function(data){
		
		$('#sub'+data).slideUp('fast', function(){ $('#sub'+data).remove(); });
	};

	//potwierdzenie dodawania podkategorii
	$('#myAddSubBoxSaveBtn').click(function(){
		var content = $('#myAddSubBoxModalContent').val();
			if(content.length > 0){
				var data = { 'parent': parentId, 'content': content };
				socket.emit('addInnerBox', data);
				$('#myAddSubBoxModal').modal('hide');
				$('#myAddSubBoxModalContent').val('');
			}
	});

	//edycja tematu
	$('#editMainBoxBtn').click(function() {
		$('#mainContent').hide();
		$('#editMainContent').show();
	});

	//potwierdzenie edycji tematu
	$('#editMainContentBtn').click( function() {
		socket.emit('setNewBoxContent', {'id': 0, 'content': $('#editMainContentVal').val()});
		$('#mainContent').show();
		$('#editMainContent').hide();
	});
	//rezygnacja z edycji tematu
	$('#editMainContentCancelBtn').click( function() {
		$('#mainContent').show();
		$('#editMainContent').hide();
		$('#editMainContentVal').val($('#mainContent').text());
	});

	//-----------------------socket
	socket.on('addNewBox', function (data) {
		if(data.id === 0){
			$('#mainContent').text(data.content);
			$('#editMainContentVal').val(data.content);
		}else {
			addBoxAction(data.id, data.content);
		}
	});

	socket.on('rmBox', function (data) {
		rmSubBoxAction(data);
	});

	socket.on('addNewInnerBox', function (data) {
		addInnerBoxAction(data.parent, data.content, data.id);
	});

	socket.on('rmInnerBox', function (data) {
		rmInnerBoxAction(data);
	});

	socket.on('setNewBoxContent', function (data){
		if(data.id === 0){ //edycja glownego boxa
			$('#mainContent').text(data.content);
			$('#editMainContentVal').val(data.content);
		} else { //pozostale duze boxy
			$('#content'+data.id).text(data.content);
			$('#editBoxContentVal'+data.id).val(data.content); //ustawiamy pole formularza
		}
	});

	socket.on('setNewInnerBoxContent', function (data){
			$('#innerContent'+data.id).text(data.content);
			$('#editInnerBoxContentVal'+data.id).val(data.content);
	});
});