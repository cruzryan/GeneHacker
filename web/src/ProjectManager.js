import { getData } from "./store";
import {current_screen} from "./store";
let current_screen_value;
current_screen.subscribe(value => {current_screen_value = value;});


import {GeneAMA} from "./editor/GeneAMA";
import { CircularMap } from "./editor/plasmid/CircularMap";

import { editor_info } from "./store";
let editorinfo;
editor_info.subscribe(value => {
	editorinfo = value;
});
let settings = {};

let currentProject = {};

let num = 0;

export default class ProjectManager{

	constructor(){
		/*FOR DEBUGGING PURPOSES*/
		// let p0 = this.constructor.getSettings().project_paths[0];
		// this.constructor.openProject(p0.path)

		new GeneAMA({});
	}

	static getSettings(){
		let settings_b64 = getData("settings");

		let settings_json = this.b64_to_utf8(settings_b64);

		settings = JSON.parse(settings_json)
		return settings;
	}

	static getProject(path){
		let proj_b64 = getData("proj?location=" + path);
		let proj_json = this.b64_to_utf8(proj_b64);
		return JSON.parse(proj_json)
	}

	static addPlasmid(data_b64){
		let data = JSON.parse(this.b64_to_utf8(data_b64));
		let item = {
			name: "Unamed Plasmid",
			type: "plasmid",
			data 
		}
		currentProject.inventory.push(item)
		this.updateStore()
	}

	static openProject(path){
		currentProject = this.getProject(path);
    	current_screen.set("EDITOR")
    	let new_editinfo = editorinfo;
    	new_editinfo.current_project = currentProject;
    	editor_info.set(new_editinfo)    
	}

	static getCurrentProject(){
		return currentProject;
	}

	static updateStore(){
		let new_editinfo = editorinfo;
    	new_editinfo.current_project = currentProject;
    	editor_info.set(new_editinfo)   
	}

	static addItemToInventory(item){
		currentProject.inventory.push(item);
		this.updateStore()
	}

	static deleteItemFromInventory(index){
		currentProject.inventory.splice(index,1);
		this.updateStore()
	}

	static changeItemName(index, name){
		let new_editinfo = editorinfo;
		currentProject.inventory[index].name = name;
		//TO-DO: Fix this for right panel too
		for(let i = 0; i < new_editinfo.left_panel.tabs.length; i++){
			if(new_editinfo.left_panel.tabs[i].uuid == index){
				new_editinfo.left_panel.tabs[i].name = name;
			}
		}
		this.updateStore()
	}

	static createNewTab(index){	
		let ft = currentProject.inventory[index];

		let tab = {
			name: ft.name,
			type: ft.type,
			uuid: index, 
		}

		let new_editinfo = editorinfo;
		if(new_editinfo.activePanel == "left"){
			new_editinfo.left_panel.current_tab = new_editinfo.left_panel.tabs.length;
			new_editinfo.activeTab = new_editinfo.left_panel.tabs.length;
			new_editinfo.left_panel.tabs.push(tab);
		}

		if(new_editinfo.activePanel == "right"){
			new_editinfo.right_panel.current_tab = new_editinfo.right_panel.tabs.length;
			new_editinfo.activeTab = new_editinfo.right_panel.tabs.length;
			new_editinfo.right_panel.tabs.push(tab);
		}

    	editor_info.set(new_editinfo)   
	}

	static setActiveTab(index, panel){
		let new_editinfo = editorinfo;
		new_editinfo.activeTab = index;
		new_editinfo.activePanel = panel;
		if(new_editinfo.activePanel == "left"){
			new_editinfo.left_panel.current_tab = index;
		}

		if(new_editinfo.activePanel == "right"){
			new_editinfo.right_panel.current_tab = index;
		}
    	editor_info.set(new_editinfo)   
	}

	static closeTab(index,panel){
		let new_editinfo = editorinfo;
		if(panel == "right"){
			new_editinfo.right_panel.tabs.splice(index,1);	
			if(new_editinfo.right_panel.current_tab >= 0){
				new_editinfo.right_panel.current_tab = index-1;
			}
		}else if(panel == "left"){
			new_editinfo.left_panel.tabs.splice(index,1);	
			if(new_editinfo.left_panel.current_tab >= 0){
				new_editinfo.left_panel.current_tab = index-1;
			}
		}
    	editor_info.set(new_editinfo)   
	}

	static savePlasmidOnStore(){
		let state = GeneAMA.getCurrentState();
		//If state is not empty then update the store 
		if(Object.keys(state).length != 0){
			let new_editinfo = editorinfo;
			let item = new_editinfo.current_project.inventory[new_editinfo.left_panel.tabs[new_editinfo.left_panel.current_tab].uuid];
			item.data = state;
    		editor_info.set(new_editinfo)   
		} 
	}

	static loadNewPlasmid(plasmid){
		GeneAMA.loadNewData(plasmid.data);
		CircularMap.loop();
	}

	static b64_to_utf8( str ) {
  		return decodeURIComponent(escape(window.atob( str )));
	}

}