package main

import "github.com/webview/webview"

func show_window() {
	debug := true
	w := webview.New(debug)
	defer w.Destroy()
	w.SetTitle("GeneHacker")
	w.SetSize(1200, 700, webview.HintNone)
	w.Navigate("http://127.0.0.1:5000")
	w.Run()
}
