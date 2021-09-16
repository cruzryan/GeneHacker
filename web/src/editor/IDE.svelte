<script>
  import Tab from "./Tab.svelte";
  import Plasmid from "./plasmid/Plasmid.svelte";
  import FilePicker from "./FilePicker.svelte";
  import Menu from "./Menu.svelte";
  import TextEditor from "./TextEditor.svelte";
  import { GeneAMA } from "./GeneAMA";
  import { getData } from "../store";
  import { editor_info } from "../store";

  let editorinfo;
  //Current tab in left panel
  let left_tab;

  //Current tab in right panel
  let right_tab;

	editor_info.subscribe(value => {
		editorinfo = value;
    left_tab = editorinfo.left_panel.tabs[editorinfo.left_panel.current_tab];
	});

  //TEST DATA: TO-DO: REMOVE THIS
  let sq_data = getData("getTestPlasmid");
  new GeneAMA(sq_data);

  console.log(GeneAMA.getFeatures())
</script>

<main>
  {#if editorinfo.show_filepicker == true}
    <FilePicker/>
  {/if}
  <div class="menubar">
    <h1 class="menubar-item">FILE</h1>
    <h1 class="menubar-item">VIEW</h1>
    <h1 class="menubar-item">HELP</h1>
  </div>
  {#if editorinfo.show_menu == true}
    <Menu/>
  {/if}

  <div class="windows">
    <div class="window">
      <div class="tabs hide-native-scrollbar">
        <Tab active={true} text={left_tab.name} icon_type={left_tab.type} />
      </div>

      <div class="panel">
        {#if left_tab.type == "plasmid"}
        <Plasmid />
        {/if}
      </div>
    </div>
    {#if editorinfo.split_window == true}
    <div class="window">
      <div class="tabs hide-native-scrollbar">
        <Tab text="Sars-Cov-2 Findings" icon_type="lab" />
      </div>

      <div class="panel">
        <TextEditor/>
      </div>
    </div>
    {/if}
  </div>
</main>

<style>
  main {
    background-color: #fcfcfc;
    display: flex;
    flex-direction: column;
  }

  .menubar {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100vw;
    height: 5vh;
  }

  .menubar-item {
    padding-left: 2em;
    padding-right: 2em;
    font-size: 13px;
    font-weight: 500;
    color: #a7a9ae;
    cursor: pointer;
  }

  .menubar-item:hover {
    color: #3d3e40;
  }

  .windows {
    width: 100vw;
    height: 95vh;
    display: flex;
    flex-direction: row;
  }

  .window {
    width: 100%;
    height: inherit;
    overflow-y: hidden;
    overflow-x: hidden;
  }

  .panel {
    width: inherit;
    height: inherit;
    background-color: white;
    border-left: 1px solid rgba(226, 223, 223, 0.78);
    display: flex;
    align-items: center;
  }

  /*TODO: Make Y-overflow scrolling act like X-overflow scrolling */
  .tabs {
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    scrollbar-width: none !important;
    scrollbar-width: none;
  }

  /* To hide tab scrollbar while still being able to scroll */
  .hide-native-scrollbar {
    scrollbar-width: none; /* Firefox 64 */
    -ms-overflow-style: none; /* Internet Explorer 11 */
  }

  .hide-native-scrollbar::-webkit-scrollbar {
    /** WebKit */
    display: none;
  }

  .tabs::-webkit-scrollbar {
    display: none; /* Safari and width: 0;height: 0;Chrome */
  }
</style>
