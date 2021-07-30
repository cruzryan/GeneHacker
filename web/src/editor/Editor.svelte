<script>
    import Tab from "./Tab.svelte"
    import Plasmid from "./plasmid/Plasmid.svelte"
</script>

<main>

    <div class="menubar">
        <h1 class="menubar-item">FILE</h1>
        <h1 class="menubar-item">VIEW</h1>
        <h1 class="menubar-item">HELP</h1>
    </div>

    <div class="windows">
        <div class="window">
            <div class="tabs hide-native-scrollbar">
                <Tab active={true} text="Yeast with milk" icon_type="plasmid"/>
            </div>

            <div class="panel">
                <Plasmid/>
            </div>
        </div>
        <div class="window">
            <div class="tabs hide-native-scrollbar">
               <Tab text="Sars-Cov-2 Findings" icon_type="lab"/>
            </div>

            <div class="panel">
            </div>
        </div>
    </div>

</main>

<style>

    main {
		background-color: #FCFCFC;
        display: flex;
        flex-direction: column;
    }


    .menubar{
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100vw;
        height: 5vh;
    }


    .menubar-item{
        padding-left: 2em;
        padding-right: 2em;
        font-size: 13px;
        font-weight: 500;
        color: #a7a9ae;
        cursor: pointer;
    }

    .menubar-item:hover{
        color: #3d3e40;
    }

    .windows{
       width: 100vw;
       height: 95vh; 
       display: flex;
       flex-direction: row;
    }

    .window{
        width: 100%;
        height: inherit;
        overflow-y: hidden;
        overflow-x: hidden;
    }
    
    .panel{
        width:inherit;
        height:inherit;
        background-color: white;
        border-left: 1px solid rgba(226, 223, 223, 0.78)
    }
    
    /*TODO: Make Y-overflow scrolling act like X-overflow scrolling */
    .tabs{
        display: flex;
        flex-direction: row;
        overflow-x:scroll;

        scrollbar-width: none;
    }

    /* To hide tab scrollbar while still being able to scroll */
    .hide-native-scrollbar {
        scrollbar-width: none; /* Firefox 64 */
        -ms-overflow-style: none; /* Internet Explorer 11 */
    }
    
    .hide-native-scrollbar::-webkit-scrollbar { /** WebKit */
        display: none;
    }

    .tabs::-webkit-scrollbar { 
        display: none;  /* Safari and width: 0;height: 0;Chrome */
    }

</style>