package main

import (
	"image"
	"log"
	"os"

	"github.com/tc-hib/winres"
	"github.com/tc-hib/winres/version"
)

func setup_syso() {
	// First create an empty resource set
	rs := winres.ResourceSet{}

	// Make an icon group from a png file
	f, err := os.Open("./resources/gh_icon.png")
	if err != nil {
		log.Fatalln(err)
	}
	defer f.Close()
	img, _, err := image.Decode(f)
	if err != nil {
		log.Fatalln(err)
	}
	f.Close()
	icon, _ := winres.NewIconFromResizedImage(img, nil)

	// Add the icon to the resource set, as "APPICON"
	rs.SetIcon(winres.Name("APPICON"), icon)

	// Make a VersionInfo structure
	vi := version.Info{
		FileVersion:    [4]uint16{1, 0, 0, 0},
		ProductVersion: [4]uint16{1, 0, 0, 1},
	}
	vi.Set(0, version.ProductName, "GeneHacker")
	vi.Set(0, version.ProductVersion, "v1.0.0.1")

	// Add the VersionInfo to the resource set
	rs.SetVersionInfo(vi)

	// Add a manifest
	rs.SetManifest(winres.AppManifest{

		/*

			THIS IS FOR ADMINISTRATOR

		*/

		// ExecutionLevel: winres.RequireAdministrator,
		// DPIAwareness:        DPIPerMonitorV2,
		UseCommonControlsV6: true,
	})

	// Create an object file for amd64
	out, err := os.Create("rsrc_windows_amd64.syso")
	defer out.Close()
	if err != nil {
		log.Fatalln(err)
	}
	err = rs.WriteObject(out, winres.ArchAMD64)
	if err != nil {
		log.Fatalln(err)
	}

}
