module.exports = function(){

	var mongo = require('mongodb');

	var Box = function (id,content){
		this.trash = false;
		this.id = id;
		this.content = content;
		return this;
	};

	var InnerBox = function (id, content, parent){
		this.trash = false;
		this.id = id;
		this.content = content;
		this.parent = parent;
		return this;
	};

	var boxFlag = false;		//czy lista box-ów została pobrana z bazy do pamięci
	var innerBoxFlag = false;	//czy lista innerBox-ów została pobrana z bazy do pamięci

	var box = [ new Box(0, 'temat główny') ];
	var innerBox = [];

	var mongoInsert = function(collectionName, item){
		var db = new mongo.Db('test', new mongo.Server('localhost', 27017), {safe: true});
		db.open(function (err) {
			if(err){ console.log(err); } 
			else{
				console.log('Połączony z bazą!');
				db.collection(collectionName, function (err, coll) {
					if(err) { console.log(err); }
					else{
						console.log('insert');
						coll.insert(item, function(err){ if(err) { console.log(err); } });
						db.close();
					}
				});
			}
		});
	};

	var mongoRemove = function(collectionName, item){
		var db = new mongo.Db('test', new mongo.Server('localhost', 27017), {safe: true});
		db.open(function (err) {
			if(err){ console.log(err); } 
			else{
				console.log('Połączony z bazą!');
				var boxes;
				db.collection(collectionName, function (err, coll) {
					if(err) { console.log(err); }
					else{
						console.log('remove');
						coll.update({'id': item.id }, {$set: {'trash': true} }, function(err){ if(err) { console.log(err); } });
						db.close();
					}
				});
			}
		});
	};

	var mongoUpdate = function(collectionName, item){
		var db = new mongo.Db('test', new mongo.Server('localhost', 27017), {safe: true});
		db.open(function (err) {
			if(err){ console.log(err); } 
			else{
				console.log('Połączony z bazą!');
				var boxes;
				db.collection(collectionName, function (err, coll) {
					if(err) { console.log(err); }
					else{
						console.log('update');
						coll.update({'id': item.id }, {$set: { 'content': item.content }}, function(err){ if(err) { console.log(err); } });
						db.close();
					}
				});
			}
		});
	};

	return{
		getAllBoxes: function (socket, callback){
			if(!boxFlag){
				var db = new mongo.Db('test', new mongo.Server('localhost', 27017), {safe: true});
				db.open(function (err) {
					if(err){ console.log(err); } 
					else{
						console.log('Połączony z bazą!');
						db.collection('boxes', function (err, coll) {
							if(err) { console.log(err); }
							else{
								coll.find().toArray(function (err, items) {
									if(err) { console.log(err); }
									else {
										if(items.length === 0){
											console.log('insert');
											coll.insert(new Box(0, 'temat główny'),function(err){ if(err) { console.log(err); } });
										}
										else{
											console.log('setter');
											box = items;
										}
										db.close();
										boxFlag = true;
										callback(socket, box);
									}
								});
							}
						});
					}
				});
			}
			else{
				console.log('Wczytuję boxy z pamięci.');
				callback(socket,box);
			}
		},
		addBox: function (data) {
			var id = box.length;
			box[id] = new Box(id,data);
			mongoInsert('boxes', box[id]);
			return box[id];
		},
		rmBox: function (data) {
			var id = data;
			for(var i =0; i < innerBox.length; i++){
				if(!innerBox[i].trash && innerBox[i].parent === id){
					innerBox[i].trash = true;
					mongoRemove('innerBoxes', innerBox[i]);
				}
			}
			box[id].trash = true;
			mongoRemove('boxes', box[id]);
		},
		editBox: function (data) {
			box[data.id].content = data.content;
			mongoUpdate('boxes', box[data.id]);
		},
		getAllInnerBoxes: function (socket, callback) {
			if(!innerBoxFlag){
				var db = new mongo.Db('test', new mongo.Server('localhost', 27017), {safe: true});
				db.open(function (err) {
					if(err){ console.log(err); } 
					else{
						console.log('Połączony z bazą!');
						db.collection('innerBoxes', function (err, coll) {
							if(err) { console.log(err); }
							else{
								coll.find().toArray(function (err, items) {
									if(err) { console.log(err); }
									else {
										console.log('setter');
										innerBox = items;
										innerBoxFlag = true;
										callback(socket, innerBox);
									}
								});
							}
						});
					}
				});
			}
			else{
				console.log('Wczytuję innerBoxy z pamięci.');
				callback(socket, innerBox);
			}
		},
		addInnerBox: function (data){
			var id = innerBox.length;
			innerBox[id] = new InnerBox(id, data.content, data.parent);
			mongoInsert('innerBoxes', innerBox[id]);
			return innerBox[id];
		},
		rmInnerBox: function (data){
			var id = data;
			innerBox[id].trash = true;
			mongoRemove('innerBoxes', innerBox[id]);
		},
		editInnerBox: function (data) {
			innerBox[data.id].content = data.content;
			mongoUpdate('innerBoxes', innerBox[data.id]);
		}
	};
};