steal("can/view/parser","can-simple-dom", "can/util",function(canParser, simpleDOM, can){
	
	
	var oldBuildFrag = can.buildFragment;
	
	
	can.buildFragment = function(text, context){
		if(context.childNodes) {
			
			var parser = new simpleDOM.HTMLParser(function(string){
				
				var tokens = [];
				var currentTag,
					currentAttr;
				canParser(string, {
			    	start: function( tagName, unary ){
			    		current = { type: "StartTag", attributes: {} };
			    	},
					end: function( tagName, unary ){
						tokens.push(current);
						current = undefined;
					},
					close:     function( tagName ){
						tokens.push({type: "EndTag"});
					},
					attrStart: function( attrName ){
						currentTag.attributes[attrName] = "";
						currentAttr = attrName;
					},
					attrEnd:   function( attrName ){},
					attrValue: function( value ){
						currentTag.attributes[currentAttr] += value;
					},
					chars:     function( value ){
						tokens.push({type:"Chars", chars: value});
					},
					comment:   function( value ){
						tokens.push({type:"Comment", chars: value});
					},
					special:   function( value ){},
					done:      function( ){}
			   });
			   
			   return tokens;
			}, context.ownerDocument || context, simpleDOM.voidMap);
			
			return parser.parse(text);
			
		} else {
			return oldBuildFrag.apply(this, arguments);
		}
	};
	
});