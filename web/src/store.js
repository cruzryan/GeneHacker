import { writable } from 'svelte/store';


//Possible screens: "HOME", "EDITOR"
export const current_screen = writable("HOME");

export const editor_info = writable({
    split_window: false,
    show_filepicker: true,
    show_menu: false,

    screen_on_top_showing: false,
    show_replace: false,
    show_goto: false,
    show_insert: false,
    show_new_feature: false,

    current_project: {},

    //Active tabs
    activeTab: 0,
    activePanel: "left",

    left_panel: {
        current_tab: 0,
        tabs: []
    },
    right_panel: {
        current_tab: 0,
        tabs: []
    }
});

export function getData(type){
    let url = "http://127.0.0.1:6969/" + type;
    try {
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", url, false);
        xhttp.send();
        return xhttp.response;
    } catch (error) {
    }
}