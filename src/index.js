import React, { useState, useEffect }  from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './base.css';
document.querySelector('body').className ='learn-bar'
function Input ({onEnter}){//trickster input: shows num changes, replaces dwight with diapers
	var [text,setText]=useState('')
	var onChange=(e)=>{
		setText(e.target.value)
	}
	var onSubmit=(e)=>{
		e.preventDefault();
		if (onEnter)
			onEnter(e.target[0].value)
		setText('')
	}	
	return <form onSubmit={onSubmit} >
			    <input className="new-todo" placeholder="What needs to be done?" type="text" value={text} onChange={onChange}/>
		   </form>
}
function BlurInput(props){//className,value
	var [text,setText]=useState(props.inital_text)
	function onChange(e){
		setText(e.target.value)
	}
	function onBlur(){
		props.onBlur(text,true)
	}
	function onKeyUp(e){
		if (e.which === 13) {//enter key
			props.onBlur(text,true)
		}

		if (e.which === 27) {//escape key
			props.onBlur(text,false) //false, dont update the data
		}		

	}
	return <input {...props} value={text} type="text" onBlur={onBlur} onChange={onChange} onKeyUp={onKeyUp}/>
}
function TodoItem({item,onToggle,ondestroy,onChange}){
	console.log('render item',item)
	var checkbox_props={onChange:_=>{console.log('to',item.key);onToggle(item.key)},checked:''}
	var [editing,setEditing]=useState('')
	var li_props={className:editing}
	if (item.completed){
		checkbox_props.checked='checked';
		li_props.className+=' completed'
	}
	function onBlur(tx,shuld_update){
		setEditing('') 
		if (shuld_update)
			onChange(tx,item.key)
		//console.log('onblue',tx,shuld_update)

	}
	return 	<li {...li_props}>
				<div className="view">
					<input className="toggle" type="checkbox" {...checkbox_props}/>
					<label onDoubleClick={x=>setEditing('editing')}>{item.tx}</label>
					<button className="destroy" onClick={ondestroy}></button>
				</div>
				<BlurInput className="edit" inital_text={item.tx} onBlur={onBlur}  autoFocus="yes"/>
			</li>
}

function TodoList({list,tab,onToggle,onChange}){
	var filters={
		All:x=>true,
		Active:x=>!x.completed,
		Completed:x=>x.completed
	}
	var filtered=list.filter(filters[tab]||(x=>true))
	return <ul className='todo-list'>{filtered.map(x=><TodoItem item={x} key={x.key} onToggle={onToggle} onChange={onChange}/>) }</ul>
}
function cp(a,b){
	return Object.assign({}, a,b);
}
function eq(a,b){
	return (a.toLowerCase()==b.toLowerCase())
}
function update_list(list,key,cb){
	var index=list.findIndex(x=>{return x.key==key})
	if (index==-1)
		return list
	var item=list[index]
	cb(item)
	return [...list.slice(0,index),item,...list.slice(index+1)]
}
function Tab({tab,stab,setStab}){
	var a={}
	console.log('tab',stab,tab)
	if (eq(tab,stab))
		a.className='selected'
	return <li><a href={'#'+tab} {...a} onClick={x=>setStab(tab)}>{tab}</a> </li>
}
function activeTodoCount(list){
	var ans=list.filter(x=>!x.completed).length
	if (ans==1)
		return '1 item'
	return ans+' items'
}
function Footer({list,stab,setStab,clear_completed,tab}){
	if (list.length==0)
		return ''
	var link_props={stab,setStab}
	return <footer className="footer">
	<span className="todo-count"><strong>{activeTodoCount(list)}</strong> left</span>
			<ul  className="filters">
				{['All','Active','Completed'].map(x=><Tab tab={x} key={x} {...link_props}/> )}
			</ul>
			<button className="clear-completed" onClick={clear_completed}>Clear completed</button>
	</footer>
}
function calcFilter() {
		switch (document.location.hash.toLowerCase()){
			case '#/active': return 'active';
			case '#/completed': return 'completed';
			default:return 'all';
		}
	}
function TodoApp(){
	var [list,setList]=useState([])
	var [key,setKey]=useState(1)
	var [stab,setStab]=useState(calcFilter())//seed the state from url
	function append_item(tx){
		setKey(key+1)
		setList(list.concat([{tx,key,completed:false}]))
	}
	function onToggle(key){
		var index=list.findIndex(x=>{return x.key==key})
		//console.log('onToggle',key,index)
		if (index!=-1)
			setList(update_list(list,key,item=>item.completed^=true))

	}
	function clear_completed(){
		setList(list.filter(x=>!x.completed))
	}

	function toggle_all(){
		//console.log('toggle_all')
		var completed=list.filter(x=>!x.completed).length>0
		setList(list.map(x=>cp(x,{completed})))
	}
	function onChange(text,key){
		setList(update_list(list,key,item=>item.text=text))
	}
	var checked={checked:'checked'}
	return <section className='todoapp'>
			<header className='header'>
				<h1>todos</h1>
				<Input  autofocus="" onEnter={append_item}/>
			</header>
			<section className="main">
				<input className="toggle-all" type="checkbox" onChange={toggle_all} checked/>
				<label htmlFor="toggle-all" onClick={toggle_all} >Mark all as complete  </label>
				<TodoList {...{list,stab,onToggle,onChange}}/>
			</section>
			<Footer {...{list,setStab,clear_completed,stab}}/>		
		</section>
}//just diccovered this trik: {...{
ReactDOM.render(
	<TodoApp/>
	,
	 document.querySelector('body'));

