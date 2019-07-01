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
function TodoItem({item,ontoggle,ondestroy}){
	var checkbox_props={}
	var li_props={key:item.key}
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

function TodoList({list}){
	return <ul className='todo-list'>{list.map(x=><TodoItem item={x} key={x.key}/>) }</ul>
}
function TodoApp(){
	var [list,setList]=useState([{tx:'take over the world',key:333}])
	return <section className='todoapp'>
			<header className='header'>
				<h1>todos</h1>
				<Input  autofocus=""/>
			</header>
			<section className="main">
				<input className="toggle-all" type="checkbox"/>
				<label htmlFor="toggle-all">Mark all as complete</label>
				<TodoList list={list}/>
			</section>
			<footer id="footer"></footer>			
		</section>
}
ReactDOM.render(
	<TodoApp/>
	,
	 document.querySelector('body'));

