var actionsStack = class{
	constructor(){
		this.actions = [];
		this.index = 0;
	}
	addAction(type,data){
		this.actions.push({t:type,d:data});
		this.index = this.actions.length;
	}
	getLastAction(){
		if(this.index>0){
			this.index--;
			return this.actions[this.index];
		}else{
			return null;
		}
	}
	getNextAction(){
		this.index++;
		if(this.actions.length > this.index) return this.actions[this.index];
		else return null;
	}
}
//fix actions stack npm module
export default actionsStack;