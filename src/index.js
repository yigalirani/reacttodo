import React, { useState, useEffect,useRef}  from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './base.css';
document.querySelector('body').className ='learn-bar'
function Input ({onEnter}){
	var [text,setText]=useState('')
	function onChange(e){
		setText(e.target.value)
	}
	function onSubmit(e){
		e.preventDefault();
		if (onEnter)
			onEnter(e.target[0].value)
		setText('')
	}	
	return <form onSubmit={onSubmit} >
			    <input autoFocus='yes' className="new-todo" placeholder="What needs to be done?" type="text" value={text} onChange={onChange}/>
		   </form>
}
function BlurInput({inital_text,text_update}){
	var [text,setText]=useState(inital_text)
	const input_ref=useRef()
	useEffect(x=>{
		input_ref.current.focus()

	})
	function onChange(e){
		setText(e.target.value)
	}
	function onBlur(){
		text_update(text,true)
	}
	function onKeyUp(e){
		if (e.which === 13) {//enter key
			text_update(text,true)
		}
		if (e.which === 27) {//escape key
			text_update(text,false) //false, dont update the data
		}		
	}
	return <input ref={input_ref} className='edit' value={text} type="text" {...{onBlur,onChange,onKeyUp}} autoFocus="yes"/>
}
function calc_max(v){
	var ans=0
	v.forEach(x=>{if (x>ans) ans=x})
	return ans
}
function itemsModel([list,setList]){
	function load(){
		var loaded_list=JSON.parse(localStorage.getItem('todo'))||[]
		setList(loaded_list)
	}
	function append_item(tx){
		var keys=list.map(x=>x.key)
		var key=calc_max(keys)+1//Math.max(...keys)+1
    var new_list=list.concat([{tx,key,completed:false}])
		save(new_list)
	}
	function ondestroy(key){
		var index=list.findIndex(x=>{return x.key===key})
		if (index!==-1)
			save([...list.slice(0,index),...list.slice(index+1)])
	}
	function onToggle(key){
		var index=list.findIndex(x=>{return x.key===key})
		if (index!==-1)
			save(update_list(list,key,item=>item.completed^=true))
	}
	function clear_completed(){
		save(list.filter(x=>!x.completed))
	}
	function toggle_all(){
		var completed=list.filter(x=>!x.completed).length>0
		save(list.map(x=>cp(x,{completed})))
	}
	function onChange(tx,key){
		save(update_list(list,key,item=>item.tx=tx))
	}	
	function update_list(list,key,cb){
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

	return {list,ondestroy,onToggle,clear_completed,toggle_all,onChange,load,save,append_item}	

}
function TodoItem({item,model}){
	var checkbox_props={onChange:_=>{model.onToggle(item.key)},checked:''}
	var [editing,setEditing]=useState('')
	var li_props={className:editing}
	if (item.completed){
		checkbox_props.checked='checked';
		li_props.className+=' completed'
	}
	function text_update(tx,shuld_update){
		setEditing('') 
		if (shuld_update)
			model.onChange(tx,item.key)
	}
	function destroy_item(){
		model.ondestroy(item.key)
	}
	return 	<li {...li_props}>
				<div className="view">
					<input className="toggle" type="checkbox" {...checkbox_props}/>
					<label onDoubleClick={x=>setEditing('editing')}>{item.tx}</label>
					<button className="destroy" onClick={destroy_item}></button>
				</div>
				<BlurInput inital_text={item.tx} {...{text_update}}  />
			</li>
}

function TodoList({stab,model}){
	var filters={
		active:x=>!x.completed,
		completed:x=>x.completed
	}
	var filtered=model.list.filter(filters[stab]||(x=>true))
	return <ul className='todo-list'>{filtered.map(x=><TodoItem item={x} key={x.key} {...{model}}/>) }</ul>
}
function cp(a,b){
	return Object.assign({}, a,b);
}
function eq(a,b){
	return (a.toLowerCase()===b.toLowerCase())
}
function Tab({tab,stab,setStab}){
	var a={}
	if (eq(tab,stab))
		a.className='selected'
	return <li><a href={'#'+tab} {...a} onClick={x=>setStab(tab.toLowerCase())}>{tab}</a> </li>
}
function activeTodoCount(list){
	var ans=list.filter(x=>!x.completed).length
	if (ans===1)
		return '1 item'
	return ans+' items'
}
function Footer({setStab,model,stab}){
	if (model.list.length===0)
		return ''
	var link_props={stab,setStab}
	return <footer className="footer">
	<span className="todo-count"><strong>{activeTodoCount(model.list)}</strong> left</span>
			<ul  className="filters">
				{['All','Active','Completed'].map(x=><Tab tab={x} key={x} {...link_props}/> )}
			</ul>
			<button className="clear-completed" onClick={model.clear_completed}>Clear completed</button>
	</footer>
}
function calcFilter() {
	return document.location.hash.toLowerCase().substring(1)
}

function TodoApp(){
	var model=itemsModel(useState([]))
	var [stab,setStab]=useState(calcFilter())//seed the state from url

	useEffect(_=>{ 
		model.load()
		return x=>model.save()
	},[])

	return <section className='todoapp'>
			<header className='header'>
				<h1>todos</h1>
				<Input  onEnter={model.append_item}/>
			</header>
			<section className="main">
				<input className="toggle-all" type="checkbox" onChange={model.toggle_all} checked/>
				<label htmlFor="toggle-all" onClick={model.toggle_all} >Mark all as complete  </label>
				<TodoList {...{stab,model}}/>
			</section>
			<Footer {...{setStab,model,stab}}/>		
		</section>
}//just diccovered this trik: {...{
ReactDOM.render(
	<TodoApp/>
	,
	 document.querySelector('body'));

