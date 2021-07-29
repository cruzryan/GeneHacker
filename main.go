package main

func main() {

	//Gives rsc info to our executable
	setup_syso()
	//Server to deal with with the file system using HTTP Requestss
	go setup_go_server()
	//Sets up webview and shows window
	show_window()

}
