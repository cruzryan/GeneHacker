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
	});

  function isPlasmidTab(){
      if(editorinfo.left_panel.tabs[editorinfo.left_panel.current_tab] == undefined) return false;
      if(editorinfo.left_panel.tabs[editorinfo.left_panel.current_tab].type == "plasmid") return true;
      return false;
  }


  let menuIndex = 0;
  function showMenu(index){
    menuIndex = index;

    let new_editinfo = editorinfo;
    new_editinfo.show_menu = true;
    editor_info.set(new_editinfo)  
  }

</script>

<main>
  {#if editorinfo.show_filepicker == true}
    <FilePicker/>
  {/if}
  <div class="menubar">
    <h1 class="menubar-item" on:click={() => showMenu(0)}>FILE</h1>
    <h1 class="menubar-item" on:click={() => showMenu(1)}>VIEW</h1>
    <h1 class="menubar-item" on:click={() => showMenu(2)}>HELP</h1>
  </div>
  {#if editorinfo.show_menu == true}
    <Menu key={menuIndex}/>
  {/if}

  <div class="windows">
    <div class="window">
      <div class="tabs hide-native-scrollbar">
        {#each editorinfo.left_panel.tabs as t, i}
          <Tab key={i} id={i} panel="left" active={editorinfo.activePanel == "left" && editorinfo.activeTab == i} text={t.name} icon_type={t.type} />
        {/each}

        {#if editorinfo.left_panel.tabs.length == 0}
          <Tab active={true} text="Empty Tab" icon_type="empty" />
        {/if}
      </div>

      <div class="panel">
        {#if editorinfo.left_panel.tabs[editorinfo.left_panel.current_tab] != undefined && editorinfo.left_panel.tabs[editorinfo.left_panel.current_tab].type == "plasmid"}
          <Plasmid src={editorinfo.current_project.inventory[editorinfo.left_panel.tabs[editorinfo.left_panel.current_tab].uuid]}/>
        {/if}

        {#if editorinfo.left_panel.tabs[editorinfo.left_panel.current_tab] != undefined && editorinfo.left_panel.tabs[editorinfo.left_panel.current_tab].type == "text-editor"}
          <TextEditor inventory_id={editorinfo.left_panel.tabs[editorinfo.left_panel.current_tab].uuid}/>
        {/if}
      </div >
    </div>

    {#if editorinfo.split_window == true}
    <div class="window">
      <div class="tabs hide-native-scrollbar">
        {#each editorinfo.right_panel.tabs as t, i}
          <Tab id={i} panel="right" active={editorinfo.activePanel == "right" && editorinfo.activeTab == i} text={t.name} icon_type={t.type} />
        {/each}

        {#if editorinfo.right_panel.tabs.length == 0}
          <Tab active={false} text="Empty Tab" icon_type="empty" />
        {/if}
      </div>

      <div class="panel">
        <!-- <TextEditor/> -->
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
