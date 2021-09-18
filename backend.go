package main

import (
	b64 "encoding/base64"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"runtime"
	"strings"
	"path/filepath"
	"github.com/sqweek/dialog"
)

var (
	settings string
)

//TO-DO: Fix this so the program doesn't crash
func check(e error) {
	if e != nil {
		panic(e)
	}
}
func getSettings() string {
	default_settings := "ewoJInByb2plY3RfcGF0aHMiOiBbXSwKCSJ0aGVtZSI6ICJsaWdodCIsCgkibGFuZyI6ICJlbiIsCgkidmVyc2lvbiI6ICIxLjAiCn0="
	appdata := os.Getenv("APPDATA")
	path := appdata + "\\GeneHacker\\settings.ghsettings"
	settings_json, err := ioutil.ReadFile(path)
	if err != nil {
		// err2 := ioutil.WriteFile(path, []byte(default_settings), 0755)
		// check(err2)
		os.Mkdir(appdata + "\\GeneHacker\\",  os.ModePerm)
		f, err := os.Create(path)
		check(err)
		_, err2 := f.WriteString(default_settings)
		check(err2)
		return default_settings
	}
	return string(settings_json)
}

//TO-DO: Fix this so it sets one in place, in case it doesn't find it
func returnSettings(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	settings_str := getSettings()
	fmt.Fprintf(w, "%s", settings_str)
}

//Update settings at localhost:6969/update?settings=[new_settings]
func updateSettings(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	appdata := os.Getenv("APPDATA")
	path := appdata + "\\GeneHacker\\settings.ghsettings"

	new_settings := r.URL.Query().Get("settings")
	if new_settings != "" {
		f, err := os.OpenFile(path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
		check(err)
		if err := os.Truncate(path, 0); err != nil {
			check(err)
		}
		_, err = f.Write([]byte(new_settings))
		check(err)
		f.Close()
	}

	fmt.Fprintf(w, "done")
}

//Gets project information at localhost:6969/proj?location=[path]
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

//Turning gbk into json then b64 at localhost:6969/gbk?data=[...]
func gbk_b64(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	data_64 := r.URL.Query().Get("data")
	data, err := b64.StdEncoding.DecodeString(data_64)
	check(err)
	plasmid_str := ""
	if string(data) != ""{
		plasmid_str = getAsString(string(data))
	}

	plasmid_b64 := b64.StdEncoding.EncodeToString([]byte(plasmid_str))

	fmt.Fprintf(w, "%s\n", plasmid_b64)
}

//For testing purposes
func returnTestPlasmid(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	// plas_data := getFileData("tests_resources\\addgeneplasmid.gbk")
	plas_data := getFileData("tests_resources\\sars-cov-2.gbk")

	plasmid_str := getAsString(plas_data)

	fmt.Fprintf(w, "%s\n", plasmid_str)
}

func open(url string) error {
    var cmd string
    var args []string

    switch runtime.GOOS {
    case "windows":
        cmd = "cmd"
        args = []string{"/c", "start"}
    case "darwin":
        cmd = "open"
    default: // "linux", "freebsd", "openbsd", "netbsd"
        cmd = "xdg-open"
    }
    args = append(args, url)
    return exec.Command(cmd, args...).Start()
}

//Turning gbk into json then b64 at localhost:6969/save?data=[...]
//Where data is structured this way:  file_path::new_file
func save(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	data_64 := strings.Replace(r.URL.Query().Get("data")," ","+",100);
	data, err := b64.StdEncoding.DecodeString(data_64)
	check(err)
	
	data_str := string(data)

	file_path := ""
	json_data := ""

	load_data := false

	for i := 0; i < len(data_str); i++ {

		if(load_data == false){
			if(string(data_str[i]) != "|"){
				file_path += string(data_str[i])
			}
		}else{
			json_data += string(data_str[i])
		}

		
		if(string(data_str[i]) == "|"){
			load_data = true;
			continue
		}

 	}

	json_data_b64 := b64.StdEncoding.EncodeToString([]byte(json_data))


	f, err := os.OpenFile(file_path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	check(err)
	if err := os.Truncate(file_path, 0); err != nil {
		check(err)
	}
	_, err = f.Write([]byte(json_data_b64))
	check(err)
	f.Close()

	fmt.Fprintf(w, "\nDone!")
}

func newProjLocation(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	file, err := dialog.File().Title("Save As").Filter("GeneHacker", ".gh").Save()
	check(err)
	fmt.Fprintf(w, file)
}


//saves & creates folders at localhost:6969/saveAs?data=[data]
func saveAs(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	data_64 := strings.Replace(r.URL.Query().Get("data")," ","+",100);
	data, err := b64.StdEncoding.DecodeString(data_64)
	check(err)
	
	data_str := string(data)

	file_path := ""
	json_data := ""

	load_data := false

	for i := 0; i < len(data_str); i++ {

		if(load_data == false){
			if(string(data_str[i]) != "|"){
				file_path += string(data_str[i])
			}
		}else{
			json_data += string(data_str[i])
		}

		
		if(string(data_str[i]) == "|"){
			load_data = true;
			continue
		}

 	}
	dir := filepath.Dir(file_path)
 	os.MkdirAll(dir, os.ModePerm)

	json_data_b64 := b64.StdEncoding.EncodeToString([]byte(json_data))

	f, err := os.OpenFile(file_path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	check(err)
	if err := os.Truncate(file_path, 0); err != nil {
		check(err)
	}
	_, err = f.Write([]byte(json_data_b64))
	check(err)
	f.Close()

	fmt.Fprintf(w, "\nDone!")
}

func setup_backend_server() {

	//Server API
	http.HandleFunc("/settings", returnSettings)
	http.HandleFunc("/update", updateSettings)
	http.HandleFunc("/proj", returnProject)
	http.HandleFunc("/getTestPlasmid", returnTestPlasmid)
	http.HandleFunc("/gbk", gbk_b64)
	http.HandleFunc("/save", save)
	http.HandleFunc("/saveAs", saveAs)
	http.HandleFunc("/loc", newProjLocation)

	fmt.Println("Server started!")
	open("http://localhost:4040")
	//Nice
	http.ListenAndServe(":6969", nil)
}
