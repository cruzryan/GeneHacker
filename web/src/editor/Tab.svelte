<script>
    export let icon_type = "";
    export let text = "";
    export let active = false;
</script>

<div class={active? "tab tab-active" : "tab tab-inactive"}>
    {#if icon_type == "plasmid"}
    <div class="tab-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#767C89">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
        </svg>
    </div>
    {/if}

    {#if icon_type == "lab"}
    <div class="tab-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#767C89">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
    </div>
    {/if}
        <h1 class="tab-text">{text}</h1>
    
    <div class="tab-close-icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#767C89">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
    </div>
</div>

<style>
       /*
        TO-DO: FIX text overflow in tabs
    */
    .tab{
        min-width: 230px;
        width: 230px;
        height: 30px;
        
        display: flex;
        flex-direction: row;
        background-color: white;
        align-items: center;
        margin-top: 2.5vh;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-top: 1px solid #F8F8F8;
        border-left: 1px solid #F8F8F8;
        border-right: 1px solid #F8F8F8;
        box-shadow: 0px 0px 3px #F8F8F8;
        /* border-top: 1px solid rgba(0, 136, 255, 0.626); */
        cursor: pointer;
    }

    .tab-active{
        border-top: 1.2px solid rgb(0, 200, 255);
    }

    .tab-inactive{
        opacity: 0.6;
    }

    .tab-window1{
        margin-left: 5vw;
    }

    .tab-icon{
        height: 15px;
        width: 15px;
        margin-left: 1em;
        margin-right: 0.3em;
        margin-top: -0.25em;
    }

    .tab-close-icon{
        height: 15px;
        width: 15px;
        right: 0px;
        float: right;
        margin-top: -0.25em;
    }

    .tab-close-icon:hover{
        transform: scale(1.2);
    }

    .tab-text{
        font-size: 12px;
        width: 70%;
        color: #767C89;
    }
</style>