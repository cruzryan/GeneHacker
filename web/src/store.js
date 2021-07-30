import { writable } from 'svelte/store';


//Possible screens: "HOME", "EDITOR"
export const current_screen = writable("EDITOR");

export const editor_info = writable({
    split_window: false,
    left_panel: [{
        name: "Yeast with milk",
        type: "plasmid",
        active: true,
        data: ""
    }],
    right_panel: []
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


// export const split_window = writable(false);