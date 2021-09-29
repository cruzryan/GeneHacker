package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
)

//go:embed web/public/*
var public embed.FS

func setup_frontend_server() {
	fmt.Println("Starting frontend server...")
	contentPublic, _ := fs.Sub(public, "web/public")
	fs := http.FileServer(http.FS(contentPublic))
	http.Handle("/", fs)

	log.Println("Listening on :4040...")
	err2 := http.ListenAndServe(":4040", nil)
	check(err2)
}
