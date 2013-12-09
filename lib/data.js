module.exports = function(){

	var Box = function (id,content){
		this.id = id;
		this.content = content;
		return this;
	}

	var InnerBox = function (id, content, parent){
		this.id = id;
		this.content = content;
		this.parent = parent;
		return this;
	}

	var box = [ new Box(0, 'temat g³ówny') ];
	var innerBox = [];

	return{
		addBox: function (data) {
			var id = box.length;
			console.log('id: ' + id);
			box[id] = new Box(id,data);
			return box[id];
		},
		rmBox: function (data) {
			var id = data;
			for(var i =0; i < innerBox.length; i++){
				if(innerBox[i] && innerBox[i].parent === id){
					innerBox[i] = undefined;
				}
			}

			box[id] = undefined;
		},
		editBox: function (data) {
			box[data.id].content = data.content;
		},
		getAllBoxes: function (){
			return box;
		},
		addInnerBox: function (data){
			var id = innerBox.length;
			innerBox[id] = new InnerBox(id, data.content, data.parent);
			return innerBox[id];
		},
		getAllInnerBoxes: function () {
			return innerBox;
		},
		rmInnerBox: function (data){
			var id = data;
			innerBox[id] = undefined;
		},
		editInnerBox: function (data) {
			innerBox[data.id].content = data.content;
		}
	}
};