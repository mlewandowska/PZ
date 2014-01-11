$(function(){
	'use strict';

	var socket = io.connect('http://localhost:3000');

	socket.on('connect', function (data) {
		console.log('Po��czony!');

		$('#row').children().remove();
	});

	var subInnerBoxId = 0;
	var subBoxCount = 0;

	var parentId;

	var rgb2hex = function (rgb) {

		var hexDigits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"]; 

		var hex = function (x) {
			return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
		}

		 rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		 return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	};

	var getDarkenColor = function(color , percent) { 
		var R = parseInt(color.substring(1,3),16);
		var G = parseInt(color.substring(3,5),16);
		var B = parseInt(color.substring(5,7),16);

		// console.log('r: ' + R + ' g: ' + G + ' b: ' + B);

		R = parseInt(R * (100 - percent) / 100);
		G = parseInt(G * (100 - percent) / 100);
		B = parseInt(B * (100 - percent) / 100);

		R = (R<255)?R:255;
		G = (G<255)?G:255;
		B = (B<255)?B:255;

		var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
		var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
		var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

		// console.log('r: ' + RR + ' g: ' + GG + ' b: ' + BB);

		return '#' + RR + GG + BB;
	};

	var getNextBoxColor = function(boxId){

		if(boxId%20===1) return '#b8ff5c';
		else if(boxId%20===2) return '#d6b6e6';
		else if(boxId%20===3) return '#fbff00';
		else if(boxId%20===4) return '#1eb486';
		else if(boxId%20===5) return '#fe6f5e';
		else if(boxId%20===6) return '#794044';
		else if(boxId%20===7) return '#5cb8ff';
		else if(boxId%20===8) return '#981b1e';
		else if(boxId%20===9) return '#93c572';
		else if(boxId%20===10) return '#404679';
		else if(boxId%20===11) return '#ecca61';
		else if(boxId%20===12) return '#ffe2e3';
		else if(boxId%20===13) return '#794044';
		else if(boxId%20===14) return '#e2fffe';
		else if(boxId%20===15) return '#53868b';
		else if(boxId%20===16) return '#00513d';
		else if(boxId%20===17) return '#F4A460';
		else if(boxId%20===18) return '#54FF9F';
		else if(boxId%20===19) return '#FFF68F';


		else return 'gray';

	};
	//--------------------subBox
	var drawSubBox = function(id, content){

		return '<div class="span4">'+
			'<div class="hero-unit"  id="'+id+'" style="display: none;">'+
				'<table class="table">'+
					'<tr>'+
						'<td><h3 id="content'+id+'">'+content+'</h3></td>'+
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
							

							// '<button class="btn btn-danger"  id="btnRm'+
							// id +
							// '">'+
							// 	'<i class="icon-trash icon-white"></i>'+
							// '</button>'+
							// '<button class="btn btn-primary"  id="btnSave'+
							// id +
							// '">'+
							// 	'<i class="icon-plus icon-white"></i>'+
							// '</button>'+

						'</td>'+
					'</tr>'+
				'</table>'+
			'</div>'+
		'</div>';
	};

	var addBoxAction = function (subBoxId, content) {
		$('#row').append(drawSubBox(subBoxId, content));
		$('#'+subBoxId).css('background', getNextBoxColor(subBoxId));
		$('#btnSave'+subBoxId).click( function() { 
			$('#myAddSubBoxModal').modal('show');
			var parent = $(this).attr('id');
			parentId = parseInt(parent.substring(7,parent.length),10);
			// addInnerBoxClick(this); 
		});
		$('#'+subBoxId).slideDown();
		$('#'+subBoxId+' .content').css('color', 'black');
		$('#btnRm'+subBoxId).click( function() {
			var parent = $(this).attr('id');
			parent = parseInt(parent.substring(5,parent.length),10);
			console.log(parentId);
			socket.emit('rmBox', parent);
			// rmSubBoxClick();
		});
		// subBoxId++;
		// subBoxCount++;

		$('.span4').css('margin','5px 5px 0px 5px');
		$('.btn').css('margin', '2px');
	};

	var rmSubBoxAction = function(parentId){
		
		console.log('#'+parentId);

		$('#'+parentId).slideUp('fast', function(){ 
			$('#'+parentId).parent().remove(); 
			// subBoxCount--;

			$('.span4').css('margin','5px 5px 0px 5px');
		});
	};

	$('#myAddBoxSaveBtn').click(function(){
		var content = $('#myAddBoxModalContent').val();
		if(content.length > 0){
			socket.emit('addNewBox', content);
			// addBoxAction(subBoxId, content);
			$('#myAddBoxModal').modal('hide');
			$('#myAddBoxModalContent').val('');
		// 	subBoxId++;
		}
	});

	var addBoxClick = function(){

		$('#myAddBoxModal').modal('show');		
	};

	$('#addSubBoxBtn').click( function() { addBoxClick(); });

	//-----------------------innerSubBox

	var addInnerBoxAction = function(parentId, content, subInnerBoxId){
			
			console.log(parentId);

			$('#'+parentId).append(drawSubInnerBox(subInnerBoxId, content));
			var innerBoxColor = rgb2hex($('#'+parentId).css('background-color'));
			var innerBoxDarkenColor = getDarkenColor(innerBoxColor,20);
			console.log(innerBoxColor);
			console.log(innerBoxDarkenColor);
			$('#sub'+subInnerBoxId).css('background', innerBoxDarkenColor);
			
			$('#sub'+subInnerBoxId).slideDown();
			$('#sub'+subInnerBoxId).css('color','black');
			
			$('#innerRm'+subInnerBoxId).click(
				function(){ socket.emit('rmInnerBox', subInnerBoxId); }
			);

			// subInnerBoxId++;
			$('.btn').css('margin', '2px');
	};

	var drawSubInnerBox = function(id, content){

		return '<div class="hero-unit" id="sub'+
		id +
		'"  style="display: none;">'+
			// '<div class="row-fluid">'+
				// '<div class="span12">'+
					'<table class="table">'+
						'<tr>'+
							'<td><h3 class="content">'+content+'</h3></td>'+
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
				// '</div>'+
			// '</div>'+
		'</div>';
	};

	var rmInnerBoxAction = function(data){
		
		$('#sub'+data.id).slideUp('fast', function(){ $('#sub'+data.id).remove(); });
	};

	$('#myAddSubBoxSaveBtn').click(function(){
		var content = $('#myAddSubBoxModalContent').val();
			if(content.length > 0){
				var data = { 'parent': parentId, 'content': content };
				console.log(data);
				socket.emit('addInnerBox', data);
				$('#myAddSubBoxModal').modal('hide');
				// subInnerBoxId++;
				$('#myAddSubBoxModalContent').val('');
			}
	});

	$('#editMainBoxBtn').click(function() {
		$('#mainContent').hide();
		$('#editMainContent').show();
	});

	$('#editMainContentBtn').click( function() {
		socket.emit('setNewBoxContent', {'id': 0, 'content': $('#editMainContentVal').val()});
		$('#mainContent').show();
		$('#editMainContent').hide();
	});

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
		console.log(data);
		addInnerBoxAction(data.parent, data.content, data.id);
	});

	socket.on('rmInnerBox', function (data) {
		rmInnerBoxAction(data);
	});

	socket.on('setNewBoxContent', function (data){
		if(data.id === 0){
			$('#mainContent').text(data.content);
			$('#editMainContentVal').val(data.content);
		} else {}
	});
});