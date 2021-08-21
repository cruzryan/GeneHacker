package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"strconv"
	"strings"
)

type Reference struct {
	Authors string
	Title   string
	Journal string
}

type Plasmid struct {
	Locus      string
	Definition string
	Accession  string
	Version    string
	Keywords   string
	Source     string
	Organism   string
	References []Reference
	Features   []map[string]interface{}
	DNA        string
}

var (
	feature_types = [...]string{
		"     source", "     gene", "     promoter", "     CDS", "     terminator",
		"     misc_feature", "     rep_origin", "     primer_bind",
	}
)

func getFileData(path string) string {
	bytes, err := ioutil.ReadFile(path)
	if err != nil {
		log.Fatal(err)
	}

	return string(bytes)
}

func nextLine(file *[]rune, pos int) int {
	for i := pos; i < len(*file); i++ {
		if (*file)[i] == '\n' {
			return i
		}
	}

	return -1
}

func currentWord(file *[]rune, text string, pos int) bool {
	return string((*file)[pos:pos+len(text)]) == text
}

/*
	If the initial word of the line IS the word we want:
		then make the value of the plasmid the rest of the line
*/
func asignRestOfTheLine(file *[]rune, pos *int, word string) string {
	isWord := currentWord(file, word, *pos)
	if isWord {
		eol := nextLine(file, *pos)
		//TO-DO: Maybe converting to "string" is kinda dumb?
		result := string((*file)[*pos+len(word) : eol])
		*pos = eol
		return result
	}
	return ""
}

func isFeature(file *[]rune, pos int) (bool, string) {
	for k := 0; k < len(feature_types); k++ {
		if currentWord(file, feature_types[k], pos) {
			return true, feature_types[k]
		}
	}
	return false, ""
}

func shouldIgnore(c rune) bool {
	ignore_char := [...]rune{' ', '\\', '/', '\r', '\n', '\t', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'}
	for l := 0; l < len(ignore_char); l++ {
		if c == ignore_char[l] {
			return true
		}
	}
	return false
}

func isAlphaNumeric(c rune) bool {
	numbers := [...]rune{'1', '2', '3', '4', '5', '6', '7', '8', '9', '0'}

	for l := 0; l < len(numbers); l++ {
		if c == numbers[l] {
			return true
		}
	}

	return false
}

//Shoutout to Lex Fridman
func lex(data string) *Plasmid {

	plasmid := new(Plasmid)

	file := []rune(data)
	all_features := []map[string]interface{}{}
	// feature := map[string]interface{}{}

	look_for_features := false

	for i := 0; i < len(file); i++ {

		// fmt.Print(" ", i, " ", string(file[i]))

		if plasmid.Locus == "" {
			plasmid.Locus = asignRestOfTheLine(&file, &i, "LOCUS")
		}

		if plasmid.Definition == "" {
			plasmid.Definition = asignRestOfTheLine(&file, &i, "DEFINITION")
		}

		if plasmid.Accession == "" {
			plasmid.Accession = asignRestOfTheLine(&file, &i, "ACCESSION")
		}

		if plasmid.Version == "" {
			plasmid.Version = asignRestOfTheLine(&file, &i, "VERSION")
		}

		if plasmid.Keywords == "" {
			plasmid.Keywords = asignRestOfTheLine(&file, &i, "KEYWORDS")
		}

		if plasmid.Source == "" {
			plasmid.Source = asignRestOfTheLine(&file, &i, "SOURCE")
		}

		if plasmid.Organism == "" {
			plasmid.Organism = asignRestOfTheLine(&file, &i, "ORGANISM")
		}

		if currentWord(&file, "REFERENCE", i) {
			eol := nextLine(&file, i)
			newRef := new(Reference)

			//Search for end of reference
			eor := 0
			for k := eol; k < len(file); k++ {
				if currentWord(&file, "REFERENCE", k) || currentWord(&file, "FEATURES", k) {
					eor = k
					break
				}
			}

			//References
			//TO-DO: Clean this up
			for l := eol; l < eor; l++ {
				if currentWord(&file, "AUTHORS", l) {
					weol := nextLine(&file, l)
					newRef.Authors = string((file)[l+len("AUTHORS") : weol])
					l = weol
				}

				if currentWord(&file, "TITLE", l) {
					weol := nextLine(&file, l)
					newRef.Title = string((file)[l+len("TITLE") : weol])
					l = weol
				}

				if currentWord(&file, "JOURNAL", l) {
					weol := nextLine(&file, l)
					newRef.Journal = string((file)[l+len("JOURNAL") : weol])
					l = weol
				}
			}
			plasmid.References = append(plasmid.References, *newRef)
		}

		if currentWord(&file, "FEATURES", i) {
			look_for_features = true
		}

		if currentWord(&file, "ORIGIN", i) {
			look_for_features = false

			var dna strings.Builder

			for k := i + 6; k < len(file); k++ {
				if s := shouldIgnore(file[k]); s != true {
					dna.WriteRune(file[k])
				}
			}

			plasmid.DNA = dna.String()
		}

		if look_for_features {
			current_feature := map[string]interface{}{}
			feature_found, name := isFeature(&file, i)
			current_feature["Kind"] = strings.TrimSpace(name)

			if feature_found {

				var start_loc strings.Builder
				var end_loc strings.Builder
				capture_start := true

				//Find when the feature starts and when it should end
				for o := i + 1; o < len(file); o++ {
					if file[o] == '\n' {
						current_feature["start"], _ = strconv.Atoi(start_loc.String())
						current_feature["end"], _ = strconv.Atoi(end_loc.String())
						break
					}

					if file[o-1] == '.' && file[o] == '.' {
						capture_start = false
					}

					if isAlpha := isAlphaNumeric(file[o]); isAlpha {
						if capture_start {
							start_loc.WriteRune(file[o])
						} else {
							end_loc.WriteRune(file[o])
						}
					}
				}

				//Get feature attributes
				for m := i + 1; m < len(file); m++ {

					//If you find the next feature, break;
					if f, _ := isFeature(&file, m); f {
						all_features = append(all_features, current_feature)
						current_feature = map[string]interface{}{}
						i = m - 1
						break
					}

					if string(file[m-len("                     /"):m]) == "                     /" {
						var f_name strings.Builder
						var f_content strings.Builder

						content_start := 0
						for l := m; l < len(file); l++ {
							if file[l] == '=' {
								content_start = l + 1
								break
							} else {
								f_name.WriteRune(file[l])
							}
						}

						for y := content_start; y < len(file); y++ {
							if string(file[y-len("                     /"):y]) == "                     /" {
								break
							} else {
								if t, _ := isFeature(&file, y); t {
									break
								}
								f_content.WriteRune(file[y])
							}
						}

						current_feature[f_name.String()] = strings.TrimSuffix(f_content.String(), "\r\n                     /")
					}

				}
			}

		}

	}

	plasmid.Features = all_features
	return plasmid
}

func getAsString(data string) string {

	plas := lex(data)
	p, err := json.MarshalIndent(&plas, "", "")
	if err != nil {
		fmt.Println(err)
		//TO-DO: Return an error
		return ""
	}
	return string(p)
}

func getAsPlasmidStruct(data string) Plasmid {
	return *lex(data)
}

func prettyPrint(data interface{}) {
	var p []byte
	//    var err := error
	p, err := json.MarshalIndent(data, "", "\t")
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Printf("%s \n", p)
}
