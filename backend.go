package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

type ProjectPath struct {
	name string
	path string
}

type Settings struct {
	project_paths []ProjectPath
	theme         string
	lang          string
	version       string
}

type Project struct {
	version  string
	dna      []string
	rna      []string
	plasmids []string
}

var (
	settings Settings
)

//TO-DO: Fix this so the program doesn't crash
func check(e error) {
	if e != nil {
		panic(e)
	}
}

func getSettings() string {
	//TO-DO: Save settings in %APPDATA%
	settings_json, err := ioutil.ReadFile("C:\\Users\\rncb0\\Code\\GeneHacker\\tests_resources\\setting.json")
	check(err)
	return string(settings_json)
}

//TO-DO: Fix this so it sets one in place, in case it doesn't find it
func returnSettings(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	settings_str := getSettings()
	fmt.Fprintf(w, "%s", settings_str)
}

//Gets project information at localhost:6969/location=[path]
func returnProject(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	location := r.URL.Query().Get("location")
	if location != "" {
		proj_json, err := ioutil.ReadFile(location)
		check(err)
		fmt.Fprintf(w, "%s", proj_json)
	}
}

func setup_go_server() {
	//Server API
	http.HandleFunc("/settings", returnSettings)
	http.HandleFunc("/proj", returnProject)
	//Nice
	http.ListenAndServe(":6969", nil)
}
