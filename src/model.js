function calc_max(v){
	var ans=0
	v.forEach(x=>{if (x>ans) ans=x})
	return ans
}
export default function itemsModel([list,setList]){
	function load(){
		var loaded_list=JSON.parse(localStorage.getItem('todo'))||[]
		setList(loaded_list)
	}
	function append_item(tx){
		var keys=list.map(x=>x.key)
		var key=calc_max(keys)+1//Math.max(...keys)+1
		//tx='yo, '+tx+', bro!'
    	var new_list=list.concat([{tx,key,completed:false}])
		save(new_list)
	}
	function delete_item(key){
		var index=list.findIndex(x=>{return x.key===key})
		if (index!==-1)
			save([...list.slice(0,index),...list.slice(index+1)])
	}
	function toggle_completed(key){
		var index=list.findIndex(x=>{return x.key===key})
		if (index!==-1)
			save(_update_list(list,key,item=>item.completed^=true))
	}
	function clear_completed(){
		save(list.filter(x=>!x.completed))
	}
	function toggle_all(){
		var completed=list.filter(x=>!x.completed).length>0
		save(list.map(x=>cp(x,{completed})))
	}
	function update_text(tx,key){
		save(_update_list(list,key,item=>item.tx=tx))
	}	
	function _update_list(list,key,cb){
		var index=list.findIndex(x=>{return x.key===key})
		if (index===-1)
			return list
		var item=list[index]
		cb(item)
		return [...list.slice(0,index),item,...list.slice(index+1)]
	}
	function save(new_list){
		localStorage.setItem('todo', JSON.stringify(new_list||list));
		setList(new_list)
	}
	return {list,delete_item,toggle_completed,clear_completed,toggle_all,update_text,load,append_item}	
}
