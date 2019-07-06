import React, { useState, useEffect,useRef}  from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './base.css';
import itemsModel from './model.js'
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
function BlurInput({inital_text,update_text}){
	var [text,setText]=useState(inital_text)
	const input_ref=useRef()
	useEffect(x=>{
		input_ref.current.focus()

	})
	function onChange(e){
		setText(e.target.value)
	}
	function onBlur(){
		update_text(text,true)
	}
	function onKeyUp(e){
		if (e.which === 13) {//enter key
			update_text(text,true)
		}
		if (e.which === 27) {//escape key
			update_text(text,false) //false, dont update the data
		}		
	}
	return <input ref={input_ref} className='edit' value={text} type="text" {...{onBlur,onChange,onKeyUp}} autoFocus="yes"/>
}
function TodoItem({item,model}){
	var checkbox_props={onChange:_=>{model.toggle_completed(item.key)},checked:''}
	var [editing,setEditing]=useState('')
	var li_props={className:editing}
	if (item.completed){
		checkbox_props.checked='checked';
		li_props.className+=' completed'
	}
	function update_text(tx,shuld_update){
		setEditing('') 
		if (shuld_update)
			model.update_text(tx,item.key)
	}
	function destroy_item(){
		model.delete_item(item.key)
	}
	return 	<li {...li_props}>
				<div className="view">
					<input className="toggle" type="checkbox" {...checkbox_props}/>
					<label onDoubleClick={x=>setEditing('editing')}>{item.tx}</label>
					<button className="destroy" onClick={destroy_item}></button>
				</div>
				<BlurInput inital_text={item.tx} {...{update_text}}  />
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
	})

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

