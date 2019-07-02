import React, { useState, useEffect }  from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './base.css';
document.querySelector('body').className ='learn-bar'
function Input ({onEnter,onChanged}){//trickster input: shows num changes, replaces dwight with diapers
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
function TodoItem({item,onToggle,ondestroy}){
	console.log('render item',item)
	var checkbox_props={onChange:_=>{console.log('to',item.key);onToggle(item.key)}}
	var li_props={}
	if (item.completed){
		checkbox_props.checked='checked';
		li_props.className='completed'
	}
	return 	<li {...li_props}  >
				<div className="view">
					<input className="toggle" type="checkbox" {...checkbox_props}/>
					<label>{item.tx}</label>
					<button className="destroy" onClick={ondestroy}></button>
					<input className="edit" />
				</div>
			</li>
}

function TodoList({list,tab,onToggle}){
	var filters={
		All:x=>true,
		Active:x=>!x.completed,
		Completed:x=>x.completed
	}
	var filtered=list.filter(filters[tab]||(x=>true))
	return <ul className='todo-list'>{filtered.map(x=><TodoItem item={x} key={x.key} onToggle={onToggle}/>) }</ul>
}
function cp(x){
	return Object.assign({}, x);
}
function update_list(list,key,cb){
	var index=list.findIndex(x=>{return x.key==key})
	if (index==-1)
		return list
	var item=list[index]
	cb(item)
	return [...list.slice(0,index),item,...list.slice(index+1)]
}
function Tab({tab,selected_tab,setTab}){
	return <li><a href={'#'+tab} onClick={x=>setTab(tab)}>{tab}</a> </li>
}
function activeTodoCount(list){
	var ans=list.filter(x=>!x.completed).length
	if (ans==1)
		return '1 item'
	return ans+' items'
}
function Footer({list,selected_tab,setTab,clear_completed}){
	if (list.length==0)
		return ''
	var link_props={selected_tab,setTab}
	return <footer className="footer">
	<span className="todo-count"><strong>{activeTodoCount(list)}</strong> left</span>
			<ul  className="filters">
				{['All','Active','Completed'].map(x=><Tab tab={x} {...link_props}/> )}
			</ul>
			<button className="clear-completed" onClick={clear_completed}>Clear completed</button>
	</footer>
}
function TodoApp(){
	var [list,setList]=useState([])
	var [key,setKey]=useState(1)
	var [tab,setTab]=useState('all')
	function append_item(tx){
		setKey(key+1)
		setList(list.concat([{tx,key,completed:false}]))
	}
	function onToggle(key){
		var index=list.findIndex(x=>{return x.key==key})
		console.log('onToggle',key,index)
		if (index!=-1)
			setList(update_list(list,key,item=>item.completed^=true))

	}
	function clear_completed(){
		setList(list.filter(x=>!x.completed))
	}

	return <section className='todoapp'>
			<header className='header'>
				<h1>todos</h1>
				<Input  autofocus="" onEnter={append_item}/>
			</header>
			<section className="main">
				<input className="toggle-all" type="checkbox"/>
				<label htmlFor="toggle-all">Mark all as complete</label>
				<TodoList list={list} tab={tab} onToggle={onToggle}/>
			</section>
			<Footer list={list} setTab={setTab} clear_completed={clear_completed}/>		
		</section>
}
ReactDOM.render(
	<TodoApp/>
	,
	 document.querySelector('body'));

