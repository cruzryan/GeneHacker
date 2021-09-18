package main

import (
	"fmt"
	"log"
	"net/http"
	"embed"
	"io/fs"
)

//go:embed static/*
var static embed.FS

func setup_frontend_server(){
	fmt.Println("Starting frontend server...");
	contentStatic, _ := fs.Sub(static, "static")
	fs := http.FileServer(http.FS(contentStatic))
  	http.Handle("/", fs)
	
  	log.Println("Listening on :4040...")
  	err2 := http.ListenAndServe(":4040", nil)
  	check(err2)
}


