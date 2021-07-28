package main

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

func setup_go_server() {

}
