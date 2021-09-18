package main

func main() {

	//Gives rsc info to our executable
	// setup_syso()

	//Server to deal with frontend
	go setup_frontend_server()

	//Server to deal with with the file system using HTTP Requestss
	setup_backend_server()

}
