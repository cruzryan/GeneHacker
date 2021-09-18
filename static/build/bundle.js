
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.40.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    //Possible screens: "HOME", "EDITOR"
    const current_screen = writable("HOME");

    const editor_info = writable({

        project_path: "",
        name: "",

        split_window: false,
        show_filepicker: true,
        show_menu: false,

        screen_on_top_showing: false,
        show_replace: false,
        show_goto: false,
        show_insert: false,
        show_new_feature: false,

        current_project: {},

        //Active tabs
        activeTab: 0,
        activePanel: "left",

        left_panel: {
            current_tab: 0,
            tabs: []
        },
        right_panel: {
            current_tab: 0,
            tabs: []
        }
    });

    function getData(type){
        let url = "http://127.0.0.1:6969/" + type;
        try {
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", url, false);
            xhttp.send();
            return xhttp.response;
        } catch (error) {
        }
    }

    /*GeneAMA (Gene Ask Me Anything)

        This file does serveral things:

        1. Manages state of the current gene
        2. Parses gene 
        3. Locates primers etc
    */

    let plasmid = {};

    class GeneAMA{

        constructor(plasmid_json){
            plasmid = Object.assign({}, plasmid_json.data);
            // console.log("PLASMID LOADDED, FEATURE LENGTH: ", plasmid.Features.length)
        }

        static getCurrentState(){
            return plasmid;
        }

        static loadNewData(data){
            plasmid = Object.assign({}, data);
        }

        static getFeatures(){
            return [...plasmid.Features]
            // return plasmid.Features;
        }

        static getSequence(){
            return plasmid.DNA
            // return plasmid.DNA;
        }

        static getName(){
            return plasmid.Keywords;
        }

        static updateFeatures(features){
            plasmid.Features = features;
            ProjectManager.savePlasmidOnStore();
        }

        static addFeature(start, end, label){
            let f = {
                Kind: "any",
                note: "",
                start, end, label
            };
            plasmid.Features.push(f);
            ProjectManager.savePlasmidOnStore();
        }

        static updateSequence(newSequence){
            plasmid.DNA = newSequence;  
            ProjectManager.savePlasmidOnStore();      
        }

        //Returns an array of feature datas;
        static getFeatureDataFromPosition(position){     

            let pos = position+1;
            let fd = [];

            let features = plasmid.Features;

            for(let i = 0; i < features.length; i++){

                let feature = features[i];

                if (feature.label === undefined) continue;

                if(pos >= feature.start && pos <= feature.end){
                    fd.push(feature);
                }
            }

            return fd;
        }

    }

    current_screen.subscribe(value => {});
    let editorinfo$1;
    editor_info.subscribe(value => {
    	editorinfo$1 = value;
    });
    let settings = {};

    let currentProject = {};

    class ProjectManager{

    	constructor(){
    		/*FOR DEBUGGING PURPOSES*/
    		// let p0 = this.constructor.getSettings().project_paths[0];
    		// this.constructor.openProject(p0.path)

    		new GeneAMA({});
    	}

    	static getSettings(){
    		let settings_b64 = getData("settings");

    		let settings_json = this.b64_to_utf8(settings_b64);

    		settings = JSON.parse(settings_json);
    		console.log(settings);
    		return settings;
    	}

    	static getProject(path){
    		let proj_b64 = getData("proj?location=" + path);
    		let proj_json = this.b64_to_utf8(proj_b64);
    		return JSON.parse(proj_json)
    	}

    	static addPlasmid(data_b64){
    		let data = JSON.parse(this.b64_to_utf8(data_b64));
    		let item = {
    			name: "Unamed Plasmid",
    			type: "plasmid",
    			data 
    		};
    		currentProject.inventory.push(item);
    		this.updateStore();
    	}

    	static openProject(path){
    		currentProject = this.getProject(path);
        	current_screen.set("EDITOR");
        	let new_editinfo = editorinfo$1;
        	new_editinfo.current_project = currentProject;
        	editor_info.set(new_editinfo);    
    	}

    	static getCurrentProject(){
    		return currentProject;
    	}

    	static updateStore(){
    		let new_editinfo = editorinfo$1;
        	new_editinfo.current_project = currentProject;
        	editor_info.set(new_editinfo);   
    	}

    	static addItemToInventory(item){
    		currentProject.inventory.push(item);
    		this.updateStore();
    	}

    	static deleteItemFromInventory(index){
    		currentProject.inventory.splice(index,1);
    		this.updateStore();
    	}

    	static changeItemName(index, name){
    		let new_editinfo = editorinfo$1;
    		currentProject.inventory[index].name = name;
    		//TO-DO: Fix this for right panel too
    		for(let i = 0; i < new_editinfo.left_panel.tabs.length; i++){
    			if(new_editinfo.left_panel.tabs[i].uuid == index){
    				new_editinfo.left_panel.tabs[i].name = name;
    			}
    		}
    		this.updateStore();
    	}

    	static createNewTab(index){	
    		let ft = currentProject.inventory[index];

    		let tab = {
    			name: ft.name,
    			type: ft.type,
    			uuid: index, 
    		};

    		let new_editinfo = editorinfo$1;
    		if(new_editinfo.activePanel == "left"){
    			new_editinfo.left_panel.current_tab = new_editinfo.left_panel.tabs.length;
    			new_editinfo.activeTab = new_editinfo.left_panel.tabs.length;
    			new_editinfo.left_panel.tabs.push(tab);
    		}

    		if(new_editinfo.activePanel == "right"){
    			new_editinfo.right_panel.current_tab = new_editinfo.right_panel.tabs.length;
    			new_editinfo.activeTab = new_editinfo.right_panel.tabs.length;
    			new_editinfo.right_panel.tabs.push(tab);
    		}

        	editor_info.set(new_editinfo);   
    	}

    	static setActiveTab(index, panel){
    		let new_editinfo = editorinfo$1;
    		new_editinfo.activeTab = index;
    		new_editinfo.activePanel = panel;
    		if(new_editinfo.activePanel == "left"){
    			new_editinfo.left_panel.current_tab = index;
    		}

    		if(new_editinfo.activePanel == "right"){
    			new_editinfo.right_panel.current_tab = index;
    		}
        	editor_info.set(new_editinfo);   
    	}

    	static closeTab(index,panel){
    		let new_editinfo = editorinfo$1;
    		if(panel == "right"){
    			new_editinfo.right_panel.tabs.splice(index,1);	
    			if(new_editinfo.right_panel.current_tab >= 0){
    				new_editinfo.right_panel.current_tab = index-1;
    			}
    		}else if(panel == "left"){
    			new_editinfo.left_panel.tabs.splice(index,1);	
    			if(new_editinfo.left_panel.current_tab >= 0){
    				new_editinfo.left_panel.current_tab = index-1;
    			}
    		}
        	editor_info.set(new_editinfo);   
    	}

    	static savePlasmidOnStore(){
    		let state = GeneAMA.getCurrentState();
    		//If state is not empty then update the store 
    		if(Object.keys(state).length != 0){
    			let new_editinfo = editorinfo$1;
    			let item = new_editinfo.current_project.inventory[new_editinfo.left_panel.tabs[new_editinfo.left_panel.current_tab].uuid];
    			item.data = state;
        		editor_info.set(new_editinfo);   
    		} 
    	}

    	static loadNewPlasmid(plasmid){
    		GeneAMA.loadNewData(plasmid.data);
    	}

    	static b64_to_utf8( str ) {
      		return decodeURIComponent(escape(window.atob( str )));
    	}

    }

    /* src\home\Project.svelte generated by Svelte v3.40.3 */
    const file$c = "src\\home\\Project.svelte";

    function create_fragment$c(ctx) {
    	let div;
    	let h10;
    	let t0_value = /*name*/ ctx[1].charAt(0) + "";
    	let t0;
    	let t1;
    	let h11;
    	let t2;
    	let div_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h10 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			h11 = element("h1");
    			t2 = text(/*name*/ ctx[1]);
    			attr_dev(h10, "class", "project-letter svelte-1a7fw1k");
    			add_location(h10, file$c, 66, 4, 1420);
    			attr_dev(h11, "class", "project-title svelte-1a7fw1k");
    			add_location(h11, file$c, 67, 4, 1474);
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(getColorClass(/*key*/ ctx[0])) + " svelte-1a7fw1k"));
    			add_location(div, file$c, 65, 0, 1354);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h10);
    			append_dev(h10, t0);
    			append_dev(div, t1);
    			append_dev(div, h11);
    			append_dev(h11, t2);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*name*/ 2 && t0_value !== (t0_value = /*name*/ ctx[1].charAt(0) + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*name*/ 2) set_data_dev(t2, /*name*/ ctx[1]);

    			if (dirty & /*key*/ 1 && div_class_value !== (div_class_value = "" + (null_to_empty(getColorClass(/*key*/ ctx[0])) + " svelte-1a7fw1k"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getColorClass(n) {
    	switch (n % 5) {
    		case 0:
    			return "project purple";
    		case 1:
    			return "project lightblue";
    		case 2:
    			return "project pink";
    		case 3:
    			return "project orange";
    		case 4:
    			return "project teal";
    	}
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Project', slots, []);
    	let { key = 0 } = $$props;
    	let { name = "" } = $$props;
    	let { path = "" } = $$props;

    	function openPath() {
    		updateProj(path, name);
    		ProjectManager.openProject(path);
    	}

    	let editorinfo;

    	editor_info.subscribe(value => {
    		editorinfo = value;
    	});

    	function updateProj(path, name) {
    		let new_editinfo = {
    			name,
    			project_path: path,
    			split_window: false,
    			show_filepicker: true,
    			show_menu: false,
    			screen_on_top_showing: false,
    			show_replace: false,
    			show_goto: false,
    			show_insert: false,
    			show_new_feature: false,
    			current_project: {},
    			//Active tabs
    			activeTab: 0,
    			activePanel: "left",
    			left_panel: { current_tab: 0, tabs: [] },
    			right_panel: { current_tab: 0, tabs: [] }
    		};

    		editor_info.set(new_editinfo);
    	}

    	const writable_props = ['key', 'name', 'path'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Project> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => openPath();

    	$$self.$$set = $$props => {
    		if ('key' in $$props) $$invalidate(0, key = $$props.key);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('path' in $$props) $$invalidate(3, path = $$props.path);
    	};

    	$$self.$capture_state = () => ({
    		ProjectManager,
    		key,
    		name,
    		path,
    		getColorClass,
    		openPath,
    		editor_info,
    		editorinfo,
    		updateProj
    	});

    	$$self.$inject_state = $$props => {
    		if ('key' in $$props) $$invalidate(0, key = $$props.key);
    		if ('name' in $$props) $$invalidate(1, name = $$props.name);
    		if ('path' in $$props) $$invalidate(3, path = $$props.path);
    		if ('editorinfo' in $$props) editorinfo = $$props.editorinfo;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [key, name, openPath, path, click_handler];
    }

    class Project extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { key: 0, name: 1, path: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Project",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get key() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get path() {
    		throw new Error("<Project>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Project>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\home\Home.svelte generated by Svelte v3.40.3 */

    const { console: console_1$3 } = globals;
    const file$b = "src\\home\\Home.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    // (108:3) {#each settings.project_paths as proj, i}
    function create_each_block$5(ctx) {
    	let project;
    	let current;

    	project = new Project({
    			props: {
    				key: /*i*/ ctx[16],
    				name: /*proj*/ ctx[14].name,
    				path: /*proj*/ ctx[14].path
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(project.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(project, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(project.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(project.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(project, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(108:3) {#each settings.project_paths as proj, i}",
    		ctx
    	});

    	return block;
    }

    // (115:1) {#if showSaveDialog}
    function create_if_block$8(ctx) {
    	let div2;
    	let div1;
    	let h1;
    	let t1;
    	let input0;
    	let t2;
    	let input1;
    	let t3;
    	let button0;
    	let t4;
    	let button0_class_value;
    	let t5;
    	let div0;
    	let button1;
    	let t7;
    	let button2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "New project";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			input1 = element("input");
    			t3 = space();
    			button0 = element("button");
    			t4 = text("Pick location");
    			t5 = space();
    			div0 = element("div");
    			button1 = element("button");
    			button1.textContent = "Cancel";
    			t7 = space();
    			button2 = element("button");
    			button2.textContent = "Save";
    			attr_dev(h1, "class", "svelte-14aav3q");
    			add_location(h1, file$b, 117, 3, 4389);
    			attr_dev(input0, "placeholder", "Project name...");
    			attr_dev(input0, "class", "svelte-14aav3q");
    			add_location(input0, file$b, 118, 3, 4414);
    			attr_dev(input1, "placeholder", "Authors...");
    			attr_dev(input1, "class", "svelte-14aav3q");
    			add_location(input1, file$b, 119, 3, 4482);
    			attr_dev(button0, "class", button0_class_value = "" + (null_to_empty(/*location*/ ctx[3] != "" ? "location" : "") + " svelte-14aav3q"));
    			add_location(button0, file$b, 120, 3, 4548);
    			attr_dev(button1, "class", "cancelbtn svelte-14aav3q");
    			add_location(button1, file$b, 123, 4, 4676);
    			attr_dev(button2, "class", "savebtn svelte-14aav3q");
    			add_location(button2, file$b, 124, 4, 4741);
    			attr_dev(div0, "class", "buttons svelte-14aav3q");
    			add_location(div0, file$b, 122, 3, 4649);
    			attr_dev(div1, "class", "container svelte-14aav3q");
    			add_location(div1, file$b, 116, 2, 4361);
    			attr_dev(div2, "class", "save svelte-14aav3q");
    			add_location(div2, file$b, 115, 1, 4339);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, input0);
    			set_input_value(input0, /*name_input*/ ctx[1]);
    			append_dev(div1, t2);
    			append_dev(div1, input1);
    			set_input_value(input1, /*authors_input*/ ctx[2]);
    			append_dev(div1, t3);
    			append_dev(div1, button0);
    			append_dev(button0, t4);
    			append_dev(div1, t5);
    			append_dev(div1, div0);
    			append_dev(div0, button1);
    			append_dev(div0, t7);
    			append_dev(div0, button2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[11]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[12]),
    					listen_dev(button0, "click", /*pickLocation*/ ctx[8], false, false, false),
    					listen_dev(button1, "click", /*cancel*/ ctx[7], false, false, false),
    					listen_dev(button2, "click", /*saveAs*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name_input*/ 2 && input0.value !== /*name_input*/ ctx[1]) {
    				set_input_value(input0, /*name_input*/ ctx[1]);
    			}

    			if (dirty & /*authors_input*/ 4 && input1.value !== /*authors_input*/ ctx[2]) {
    				set_input_value(input1, /*authors_input*/ ctx[2]);
    			}

    			if (dirty & /*location*/ 8 && button0_class_value !== (button0_class_value = "" + (null_to_empty(/*location*/ ctx[3] != "" ? "location" : "") + " svelte-14aav3q"))) {
    				attr_dev(button0, "class", button0_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(115:1) {#if showSaveDialog}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let main;
    	let div5;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div4;
    	let div1;
    	let svg0;
    	let path0;
    	let t1;
    	let div2;
    	let svg1;
    	let path1;
    	let t2;
    	let div3;
    	let svg2;
    	let path2;
    	let path3;
    	let t3;
    	let div12;
    	let div7;
    	let div6;
    	let svg3;
    	let path4;
    	let t4;
    	let input;
    	let t5;
    	let div9;
    	let div8;
    	let t6;
    	let h10;
    	let t8;
    	let h11;
    	let t10;
    	let div11;
    	let div10;
    	let h12;
    	let t12;
    	let h13;
    	let t14;
    	let t15;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*settings*/ ctx[5].project_paths;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = /*showSaveDialog*/ ctx[0] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div5 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div4 = element("div");
    			div1 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t1 = space();
    			div2 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t2 = space();
    			div3 = element("div");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			t3 = space();
    			div12 = element("div");
    			div7 = element("div");
    			div6 = element("div");
    			svg3 = svg_element("svg");
    			path4 = svg_element("path");
    			t4 = space();
    			input = element("input");
    			t5 = space();
    			div9 = element("div");
    			div8 = element("div");
    			t6 = space();
    			h10 = element("h1");
    			h10.textContent = "Projects";
    			t8 = space();
    			h11 = element("h1");
    			h11.textContent = `${/*number_of_projs*/ ctx[6]}`;
    			t10 = space();
    			div11 = element("div");
    			div10 = element("div");
    			h12 = element("h1");
    			h12.textContent = "+";
    			t12 = space();
    			h13 = element("h1");
    			h13.textContent = "New Project";
    			t14 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t15 = space();
    			if (if_block) if_block.c();
    			if (!src_url_equal(img.src, img_src_value = /*gh_icon_monochrome*/ ctx[4])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "monochrome logo");
    			attr_dev(img, "class", "svelte-14aav3q");
    			add_location(img, file$b, 59, 3, 1436);
    			attr_dev(div0, "class", "sidebar-logo svelte-14aav3q");
    			add_location(div0, file$b, 58, 2, 1405);
    			attr_dev(path0, "strokelinecap", "round");
    			attr_dev(path0, "strokelinejoin", "round");
    			attr_dev(path0, "strokewidth", 2);
    			attr_dev(path0, "d", "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10");
    			add_location(path0, file$b, 65, 5, 1692);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "class", "h-6 w-6");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke", "currentColor");
    			add_location(svg0, file$b, 64, 4, 1575);
    			attr_dev(div1, "class", "sidebar-icons-icon svelte-14aav3q");
    			add_location(div1, file$b, 63, 3, 1537);
    			attr_dev(path1, "strokelinecap", "round");
    			attr_dev(path1, "strokelinejoin", "round");
    			attr_dev(path1, "strokewidth", 2);
    			attr_dev(path1, "d", "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253");
    			add_location(path1, file$b, 71, 5, 2103);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "class", "h-6 w-6");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke", "currentColor");
    			add_location(svg1, file$b, 70, 4, 1986);
    			attr_dev(div2, "class", "sidebar-icons-icon svelte-14aav3q");
    			add_location(div2, file$b, 69, 3, 1948);
    			attr_dev(path2, "strokelinecap", "round");
    			attr_dev(path2, "strokelinejoin", "round");
    			attr_dev(path2, "strokewidth", 2);
    			attr_dev(path2, "d", "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z");
    			add_location(path2, file$b, 76, 5, 2604);
    			attr_dev(path3, "strokelinecap", "round");
    			attr_dev(path3, "strokelinejoin", "round");
    			attr_dev(path3, "strokewidth", 2);
    			attr_dev(path3, "d", "M15 12a3 3 0 11-6 0 3 3 0 016 0z");
    			add_location(path3, file$b, 77, 5, 3168);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "class", "h-6 w-6");
    			attr_dev(svg2, "fill", "none");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			attr_dev(svg2, "stroke", "currentColor");
    			add_location(svg2, file$b, 75, 4, 2487);
    			attr_dev(div3, "class", "sidebar-icons-icon svelte-14aav3q");
    			add_location(div3, file$b, 74, 3, 2449);
    			attr_dev(div4, "class", "sidebar-icons");
    			add_location(div4, file$b, 62, 2, 1505);
    			attr_dev(div5, "class", "sidebar svelte-14aav3q");
    			add_location(div5, file$b, 57, 1, 1380);
    			attr_dev(path4, "stroke-linecap", "round");
    			attr_dev(path4, "stroke-linejoin", "round");
    			attr_dev(path4, "stroke-width", "2");
    			attr_dev(path4, "d", "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z");
    			add_location(path4, file$b, 87, 5, 3523);
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "class", "h-6 w-6");
    			attr_dev(svg3, "fill", "none");
    			attr_dev(svg3, "viewBox", "0 0 24 24");
    			attr_dev(svg3, "stroke", "currentColor");
    			add_location(svg3, file$b, 86, 4, 3406);
    			attr_dev(div6, "class", "search-icon svelte-14aav3q");
    			add_location(div6, file$b, 85, 3, 3375);
    			attr_dev(input, "class", "search-input svelte-14aav3q");
    			attr_dev(input, "placeholder", "Type in to search...");
    			attr_dev(input, "type", "text");
    			add_location(input, file$b, 92, 3, 3677);
    			attr_dev(div7, "class", "search svelte-14aav3q");
    			add_location(div7, file$b, 84, 2, 3349);
    			attr_dev(div8, "class", "projects-info-circle svelte-14aav3q");
    			add_location(div8, file$b, 96, 3, 3804);
    			attr_dev(h10, "class", "projects-info-title svelte-14aav3q");
    			add_location(h10, file$b, 97, 3, 3849);
    			attr_dev(h11, "class", "projects-info-number svelte-14aav3q");
    			add_location(h11, file$b, 98, 3, 3899);
    			attr_dev(div9, "class", "projects-info svelte-14aav3q");
    			add_location(div9, file$b, 95, 2, 3771);
    			attr_dev(h12, "class", "project-letter svelte-14aav3q");
    			add_location(h12, file$b, 103, 4, 4080);
    			attr_dev(h13, "class", "project-title svelte-14aav3q");
    			add_location(h13, file$b, 104, 4, 4119);
    			attr_dev(div10, "class", "project project-new svelte-14aav3q");
    			add_location(div10, file$b, 102, 3, 4002);
    			attr_dev(div11, "class", "projects-list svelte-14aav3q");
    			add_location(div11, file$b, 101, 2, 3970);
    			attr_dev(div12, "class", "projects svelte-14aav3q");
    			add_location(div12, file$b, 82, 1, 3321);
    			attr_dev(main, "class", "svelte-14aav3q");
    			add_location(main, file$b, 56, 0, 1371);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div5);
    			append_dev(div5, div0);
    			append_dev(div0, img);
    			append_dev(div5, t0);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, svg0);
    			append_dev(svg0, path0);
    			append_dev(div4, t1);
    			append_dev(div4, div2);
    			append_dev(div2, svg1);
    			append_dev(svg1, path1);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			append_dev(div3, svg2);
    			append_dev(svg2, path2);
    			append_dev(svg2, path3);
    			append_dev(main, t3);
    			append_dev(main, div12);
    			append_dev(div12, div7);
    			append_dev(div7, div6);
    			append_dev(div6, svg3);
    			append_dev(svg3, path4);
    			append_dev(div7, t4);
    			append_dev(div7, input);
    			append_dev(div12, t5);
    			append_dev(div12, div9);
    			append_dev(div9, div8);
    			append_dev(div9, t6);
    			append_dev(div9, h10);
    			append_dev(div9, t8);
    			append_dev(div9, h11);
    			append_dev(div12, t10);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, h12);
    			append_dev(div10, t12);
    			append_dev(div10, h13);
    			append_dev(div11, t14);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div11, null);
    			}

    			append_dev(main, t15);
    			if (if_block) if_block.m(main, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div10, "click", /*click_handler*/ ctx[10], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*settings*/ 32) {
    				each_value = /*settings*/ ctx[5].project_paths;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$5(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$5(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div11, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*showSaveDialog*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let gh_icon_monochrome = "./gh_icon_monochrome.png";
    	let settings = ProjectManager.getSettings();
    	let number_of_projs = settings.project_paths.length;
    	let editorinfo;

    	editor_info.subscribe(value => {
    		editorinfo = value;
    	});

    	let showSaveDialog = false;
    	let name_input = "";
    	let authors_input = "";
    	let location = "";

    	function cancel() {
    		$$invalidate(0, showSaveDialog = false);
    		$$invalidate(1, name_input = "");
    		$$invalidate(2, authors_input = "");
    		$$invalidate(3, location = "");
    	}

    	function pickLocation() {
    		console.log("Picking location");
    		let path = getData("loc");
    		$$invalidate(3, location = path + ".gh");
    	}

    	function saveAs() {
    		let settings = ProjectManager.getSettings();
    		settings.project_paths.push({ name: name_input, path: location });
    		let settings_b64 = window.btoa(unescape(encodeURIComponent(JSON.stringify(settings))));
    		getData("update?settings=" + settings_b64);

    		let project = {
    			name: name_input,
    			authors: authors_input,
    			inventory: []
    		};

    		let data = window.btoa(unescape(encodeURIComponent(location + "|" + JSON.stringify(project))));
    		getData("saveAs?data=" + data);
    		ProjectManager.openProject(location);
    		cancel();
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, showSaveDialog = true);

    	function input0_input_handler() {
    		name_input = this.value;
    		$$invalidate(1, name_input);
    	}

    	function input1_input_handler() {
    		authors_input = this.value;
    		$$invalidate(2, authors_input);
    	}

    	$$self.$capture_state = () => ({
    		ProjectManager,
    		Project,
    		gh_icon_monochrome,
    		getData,
    		settings,
    		number_of_projs,
    		editor_info,
    		editorinfo,
    		showSaveDialog,
    		name_input,
    		authors_input,
    		location,
    		cancel,
    		pickLocation,
    		saveAs
    	});

    	$$self.$inject_state = $$props => {
    		if ('gh_icon_monochrome' in $$props) $$invalidate(4, gh_icon_monochrome = $$props.gh_icon_monochrome);
    		if ('settings' in $$props) $$invalidate(5, settings = $$props.settings);
    		if ('number_of_projs' in $$props) $$invalidate(6, number_of_projs = $$props.number_of_projs);
    		if ('editorinfo' in $$props) editorinfo = $$props.editorinfo;
    		if ('showSaveDialog' in $$props) $$invalidate(0, showSaveDialog = $$props.showSaveDialog);
    		if ('name_input' in $$props) $$invalidate(1, name_input = $$props.name_input);
    		if ('authors_input' in $$props) $$invalidate(2, authors_input = $$props.authors_input);
    		if ('location' in $$props) $$invalidate(3, location = $$props.location);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		showSaveDialog,
    		name_input,
    		authors_input,
    		location,
    		gh_icon_monochrome,
    		settings,
    		number_of_projs,
    		cancel,
    		pickLocation,
    		saveAs,
    		click_handler,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\editor\Tab.svelte generated by Svelte v3.40.3 */
    const file$a = "src\\editor\\Tab.svelte";

    // (23:4) {#if icon_type == "plasmid"}
    function create_if_block_2$5(ctx) {
    	let div;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4");
    			attr_dev(path, "class", "svelte-rldfnf");
    			add_location(path, file$a, 25, 12, 776);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-6 w-6 svelte-rldfnf");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "#767C89");
    			add_location(svg, file$a, 24, 8, 657);
    			attr_dev(div, "class", "tab-icon svelte-rldfnf");
    			add_location(div, file$a, 23, 4, 625);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(23:4) {#if icon_type == \\\"plasmid\\\"}",
    		ctx
    	});

    	return block;
    }

    // (31:4) {#if icon_type == "text-editor"}
    function create_if_block_1$6(ctx) {
    	let div;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z");
    			attr_dev(path, "class", "svelte-rldfnf");
    			add_location(path, file$a, 33, 12, 1359);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-6 w-6 svelte-rldfnf");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "#767C89");
    			add_location(svg, file$a, 32, 8, 1240);
    			attr_dev(div, "class", "tab-icon svelte-rldfnf");
    			add_location(div, file$a, 31, 4, 1208);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(31:4) {#if icon_type == \\\"text-editor\\\"}",
    		ctx
    	});

    	return block;
    }

    // (39:4) {#if icon_type == "empty"}
    function create_if_block$7(ctx) {
    	let div;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z");
    			attr_dev(path, "class", "svelte-rldfnf");
    			add_location(path, file$a, 41, 12, 1927);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-6 w-6 svelte-rldfnf");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "#767C89");
    			add_location(svg, file$a, 40, 8, 1808);
    			attr_dev(div, "class", "tab-icon svelte-rldfnf");
    			add_location(div, file$a, 39, 4, 1776);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(39:4) {#if icon_type == \\\"empty\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div1;
    	let t0;
    	let t1;
    	let t2;
    	let h1;
    	let t3;
    	let t4;
    	let div0;
    	let svg;
    	let path;
    	let div1_class_value;
    	let mounted;
    	let dispose;
    	let if_block0 = /*icon_type*/ ctx[0] == "plasmid" && create_if_block_2$5(ctx);
    	let if_block1 = /*icon_type*/ ctx[0] == "text-editor" && create_if_block_1$6(ctx);
    	let if_block2 = /*icon_type*/ ctx[0] == "empty" && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			h1 = element("h1");
    			t3 = text(/*text*/ ctx[1]);
    			t4 = space();
    			div0 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(h1, "class", "tab-text svelte-rldfnf");
    			add_location(h1, file$a, 46, 4, 2204);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M6 18L18 6M6 6l12 12");
    			attr_dev(path, "class", "svelte-rldfnf");
    			add_location(path, file$a, 50, 12, 2418);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-6 w-6 svelte-rldfnf");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "#767C89");
    			add_location(svg, file$a, 49, 8, 2299);
    			attr_dev(div0, "class", "tab-close-icon svelte-rldfnf");
    			add_location(div0, file$a, 48, 4, 2244);
    			attr_dev(div1, "key", /*key*/ ctx[3]);

    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(/*active*/ ctx[2]
    			? "tab tab-active"
    			: "tab tab-inactive") + " svelte-rldfnf"));

    			add_location(div1, file$a, 21, 0, 495);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t0);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t1);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, h1);
    			append_dev(h1, t3);
    			append_dev(div1, t4);
    			append_dev(div1, div0);
    			append_dev(div0, svg);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*close*/ ctx[4], false, false, false),
    					listen_dev(div1, "click", /*setActive*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*icon_type*/ ctx[0] == "plasmid") {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_2$5(ctx);
    					if_block0.c();
    					if_block0.m(div1, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*icon_type*/ ctx[0] == "text-editor") {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_1$6(ctx);
    					if_block1.c();
    					if_block1.m(div1, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*icon_type*/ ctx[0] == "empty") {
    				if (if_block2) ; else {
    					if_block2 = create_if_block$7(ctx);
    					if_block2.c();
    					if_block2.m(div1, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*text*/ 2) set_data_dev(t3, /*text*/ ctx[1]);

    			if (dirty & /*key*/ 8) {
    				attr_dev(div1, "key", /*key*/ ctx[3]);
    			}

    			if (dirty & /*active*/ 4 && div1_class_value !== (div1_class_value = "" + (null_to_empty(/*active*/ ctx[2]
    			? "tab tab-active"
    			: "tab tab-inactive") + " svelte-rldfnf"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tab', slots, []);
    	let { icon_type = "" } = $$props;
    	let { text = "" } = $$props;
    	let { active = false } = $$props;
    	let { id = null } = $$props;
    	let { panel = null } = $$props;
    	let { key = null } = $$props;

    	function close() {
    		if (id == null) return;
    		ProjectManager.closeTab(id, panel);
    	}

    	function setActive() {
    		if (id == null) return;
    		ProjectManager.setActiveTab(id, panel);
    	}

    	const writable_props = ['icon_type', 'text', 'active', 'id', 'panel', 'key'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tab> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('icon_type' in $$props) $$invalidate(0, icon_type = $$props.icon_type);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('active' in $$props) $$invalidate(2, active = $$props.active);
    		if ('id' in $$props) $$invalidate(6, id = $$props.id);
    		if ('panel' in $$props) $$invalidate(7, panel = $$props.panel);
    		if ('key' in $$props) $$invalidate(3, key = $$props.key);
    	};

    	$$self.$capture_state = () => ({
    		ProjectManager,
    		icon_type,
    		text,
    		active,
    		id,
    		panel,
    		key,
    		close,
    		setActive
    	});

    	$$self.$inject_state = $$props => {
    		if ('icon_type' in $$props) $$invalidate(0, icon_type = $$props.icon_type);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('active' in $$props) $$invalidate(2, active = $$props.active);
    		if ('id' in $$props) $$invalidate(6, id = $$props.id);
    		if ('panel' in $$props) $$invalidate(7, panel = $$props.panel);
    		if ('key' in $$props) $$invalidate(3, key = $$props.key);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [icon_type, text, active, key, close, setActive, id, panel];
    }

    class Tab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			icon_type: 0,
    			text: 1,
    			active: 2,
    			id: 6,
    			panel: 7,
    			key: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get icon_type() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon_type(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get panel() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set panel(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    let p5$2, w$1, h$1;
    //The sequence position to start drawing from
    let sp = 0;
    let n_rendered = 0;

    //Maximum aminoacids shown per line
    let maxamino = 0;

    let cursor_info = {
        unit: null,
        pos: null
    }; 

    //We use these later to delete / copy / paste aminoacids 
    let markers_info = {
        m1: null,
        m2: null,
        //0 = no markers, 1 = one marker, 2 = two markers
        num_shown: 0,
    };

     let editorinfo;

      editor_info.subscribe(value => {
            editorinfo = value;
        });

    class SequenceMap {

        constructor(ctx, width, height){
            p5$2 = ctx;
            w$1 = width;
            h$1 = height;
        }

        static destroy(){
            console.log("destroy called");
            p5$2 = null;
        }
        
        //When we want to draw again
        static loop(){
            if(editorinfo.split_window) return;
            p5$2.loop();
        }

        static resize(newWidth, newHeight){
            if(editorinfo.split_window) return;
            w$1 = newWidth;
            h$1 = newHeight;
        }


        static goToFeature(feature_name){
            if(editorinfo.split_window) return;
            let ft = GeneAMA.getFeatures();
            for(let i = 0; i < ft.length; i++){
                if(ft[i].label == feature_name){
                    sp = ft[i].start-1;
                    p5$2.loop();
                    return;
                }
            }
        }

        static moveCursor(dir){
            if(editorinfo.split_window) return;
            if(dir == "right"){
                cursor_info.pos++;
            }else {
                cursor_info.pos--;
            }
        }

        static addMarker(){
            if(editorinfo.split_window) return;
            switch(markers_info.num_shown){
                case 0: {
                    markers_info.m1 = sp+(maxamino*cursor_info.unit)+cursor_info.pos;
                    markers_info.num_shown = 1;
                } break;

                case 1: {
                    markers_info.m2 = sp+(maxamino*cursor_info.unit)+cursor_info.pos;
                    markers_info.num_shown = 2;
                }break;

                case 2: {
                    markers_info = {
                        m1: null,
                        m2: null,
                        num_shown: 0,
                    };

                    CircularMap.clearSelection();
                }
            }

            //Stop showing cursor
            cursor_info = {
                unit: null,
                pos: null
            }; 
            p5$2.loop();
        } 

        static updateMarkers(m1, m2){
            if(editorinfo.split_window) return;
            markers_info.m1 = m1;
            markers_info.m2 = m2;
            markers_info.num_shown = 2;
            this.goto(m1, false);
        }

        static goto(pos, moveCursor){
            if(editorinfo.split_window) return;
            for(let i = 0; i < GeneAMA.getSequence().length; i+=maxamino){
                if(i > pos){
                    sp = i - maxamino;
                    if(moveCursor === true){
                        cursor_info.unit = 0;
                        cursor_info.pos = pos - sp;    
                    }
                    return;
                }
            }
        }

        static clearMarkers(){
            if(editorinfo.split_window) return;
            console.log(editorinfo.split_window);
            markers_info.m1 = null;
            markers_info.m2 = null;
            markers_info.num_shown = 0;
            p5$2.loop();
        }


        static getSelected(){
            if(editorinfo.split_window) return;
            let start = markers_info.m1;
            let end = markers_info.m2;
            return [start, end]
        }

        static getNumberOfMarkers(){
            if(editorinfo.split_window) return;
            return markers_info.num_shown;
        }

        mouseClicked(e){

            if(editorinfo.screen_on_top_showing) return;
            //Check if user clicked on the letters
            cursor_info.unit = this.hitboxCheck();
            if(cursor_info.unit != -1){
                cursor_info.pos = this.mouse_to_sequence(cursor_info.unit);
            }

        }

        scroll(dir){
            if(editorinfo.screen_on_top_showing) return;

            let seq = GeneAMA.getSequence();

            switch(dir){
                case "up":
                        if (sp - maxamino > 0){
                            sp -= maxamino;
                            p5$2.loop();
                        }else {
                            sp = 0;
                            p5$2.loop();
                        } 
     
                break;

                case "down":
                    if (sp+(maxamino*n_rendered) > seq.length) return;
                    sp += maxamino;
                    p5$2.loop();
                break;  
            }
        }
        
        calculate_sequence_width(sequence, x){
            return (x*1.5) + ((sequence.length-1)*10) + 5 ;
        }

        get_amino_inverse(amino){
            switch(amino){
                case "a": return "t";
                case "t": return "a";
                case "g": return "c";
                case "c": return "g";
                default: console.warn("Couldn't get inverse aminoacid");
            }
        }


        //Since codons need 3 aminoacids, we need to display the maximum multiple of 3 of aminoacids given
        maxAminoacidsShown(sequence){
            // return Math.floor(sequence.length/3)*3;
            return sequence.length;
        } 

        getCodon(amino_seq){
            let aminos = amino_seq.toUpperCase().replace(/T/g,"U");
            if ("GCU, GCC, GCA, GCG ".includes(aminos)) return "A";
            if ("AUU, AUC, AUA".includes(aminos)) return "I";
            if ("CGU, CGC, CGA, CGG; AGA, AGG".includes(aminos)) return "R";
            if ("CUU, CUC, CUA, CUG; UUA, UUG".includes(aminos)) return "L";
            if ("AAU, AAC".includes(aminos)) return "N";
            if ("AAA, AAG".includes(aminos)) return "K";
            if ("GAU, GAC".includes(aminos)) return "D";
            if ("AUG".includes(aminos)) return "M";
            if ("UUU, UUC".includes(aminos)) return "F";
            if ("UGU, UGC".includes(aminos)) return "C";
            if ("CCU, CCC, CCA, CCG".includes(aminos)) return "P";
            if ("CAA, CAG".includes(aminos)) return "Q";
            if ("UCU, UCC, UCA, UCG; AGU, AGC".includes(aminos)) return "S";
            if ("GAA, GAG".includes(aminos)) return "E";
            if ("ACU, ACC, ACA, ACG".includes(aminos)) return "T";
            if ("UGG".includes(aminos)) return "W";
            if ("GGU, GGC, GGA, GGG".includes(aminos)) return "G";
            if ("UAU, UAC".includes(aminos)) return "Y";
            if ("CAU, CAC".includes(aminos)) return "H";
            if ("GUU, GUC, GUA, GUG".includes(aminos)) return "V";
            if ("UAA, UGA, UAG".includes(aminos)) return "X";

            return "0";
        }

        getCodonColor(codon){
            switch(codon){
                case "I": return "#FFE0E0";
                case "R": return "#ffc4d6";
                case "L": return "#ffac81";
                case "N": return "#eae4e9";
                case "K": return "#fff1e6";
                case "D": return "#fde2e4";
                case "M": return "#eeddd3";
                case "F": return "#e2ece9";
                case "C": return "#bee1e6";
                case "P": return "#f0efeb";
                case "Q": return "#dfe7fd";
                case "S": return "#cddafd";
                case "E": return "#BAE394";
                case "T": return "#a8e6cf";
                case "W": return "#cddcdf";
                case "G": return "#b8c0ff";
                case "Y": return "#4B8CA8";
                case "H": return "#71A7CD";
                case "V": return "#dfe7fd";
                case "A": return "#EFD581";
                case "X": return "#f08080";
                case "0": return "#fff";
            }
        }

        getMaxAminosPerLine(sequence){

            let x = 0;

            let unit_w = w$1-(w$1/10);

            let real_x = x;
            let maxAminoacids = this.maxAminoacidsShown(sequence); 


            for(let i = 0; i < maxAminoacids; i++){
                let k = (real_x*1.5) + (i*10) + 5;
                if(k > unit_w+15){ return  i; }
            }
        }

        featureListContainsCDS(fl){
            for(let i = 0; i < fl.length; i++){
                if (fl[i].Kind === "CDS"){
                    return [true, i];

                }
            }
            return [false, -1];
        }

        renderUnit(x,y,sequence, seq_start, feature_data, index){
            
            let unit_w = w$1-(w$1/10);
            let unit_h = h$1/4;

            let real_x = x;
            let real_y = y + (unit_h - (unit_h/10));
            let maxAminoacids = this.maxAminoacidsShown(sequence); 

            n_rendered++;

            p5$2.push();
            //Draw separator line
            p5$2.strokeWeight(2);
            p5$2.line(real_x*1.5, real_y, unit_w+15, real_y);

            p5$2.textFont("Poppins");
            p5$2.fill("#636363");
            let last_pos_drawn = 0;
            //Draw inverse sequence
            p5$2.strokeWeight(0.5);
            p5$2.fill(120);
            p5$2.textAlign(p5$2.CENTER);
            p5$2.textSize(12);
            for(let i = 0; i < maxAminoacids; i++){
                let k = (real_x*1.5) + (i*10) + 5;
                if(seq_start + i >= sequence.length) break;
                if(k > unit_w+15){ last_pos_drawn = seq_start + i; break; }
                p5$2.text(this.get_amino_inverse(sequence[seq_start+i]), k, real_y-12);
            }
            //Draw regular sequence
            p5$2.fill(0);
            for(let i = 0; i < maxAminoacids; i++){
                let k = (real_x*1.5) + (i*10) + 5;
                if(k > unit_w+15) break;
                p5$2.text(sequence[seq_start+i], k, real_y-30);
                
                //Draw character position lines + numbers
                if(i % 10 == 0) {
                    let pos = (real_x*1.5) + ((i+1)*10) + 5;
                    p5$2.line(real_x+pos,real_y,real_x+pos,real_y+10);
                    p5$2.text((seq_start+i+2).toString(),real_x+pos, real_y+22);
                }
            }
            p5$2.noStroke();
            //Draw codons
            for(let i = 0; i < maxAminoacids; i+=3){
                let k = (real_x*1.5) + (i*10);

                //Draw end of sequence if its the end 
                if(seq_start + i >= sequence.length){
                    p5$2.fill(230);
                    p5$2.rect(k,real_y-61,3, 60);
                    break;
                }

                //TO-DO: Fix this so it renders the right codons LOL 
                let [isCDS, index] = this.featureListContainsCDS(feature_data);

                if(isCDS){
                    if(k > unit_w) break;
                    let codon = this.getCodon(sequence[seq_start+i]+sequence[seq_start+i+1]+sequence[seq_start+i+2]);
                    p5$2.fill(parseInt(codon[0]));
                    let color = this.getCodonColor(codon);
                    p5$2.fill(color);
                    p5$2.rect(k+1,real_y-60,30,15);
                    p5$2.fill(12);
                    p5$2.text(codon, k+15, real_y-48);
                }            
            }

            //Draw highlighted genes & markers
            if(markers_info.num_shown != 0){
                // console.log(markers_info)
                for(let i = 0; i < maxAminoacids; i++){
                    let k = (real_x*1.5) + (i*10);
                    if(k > unit_w) break;

                    if(markers_info.num_shown > 0 && seq_start+i == markers_info.m1){
                        //Drawing the cursor
                        p5$2.fill("#4479FF");
                        p5$2.stroke("#4479FF");
                        p5$2.rect(k,real_y, 1,-45);
                        p5$2.triangle(k-3,real_y-45, k+4, real_y-45, k+1, real_y-40);
                
                        //Drawing the square with the position
                        p5$2.fill(255);
                        p5$2.stroke(220);
                        p5$2.rect(k-19, real_y+2, 40, 20, 20);
                        p5$2.fill(0);
                        p5$2.textSize(9);
                        p5$2.textAlign(p5$2.CENTER);
                        p5$2.text(markers_info.m1.toString(), k+1, real_y+15);
                    }

                    if(seq_start+i == markers_info.m2){
                        //Drawing the cursor
                        p5$2.fill("#4479FF");
                        p5$2.stroke("#4479FF");
                        p5$2.rect(k,real_y, 1,-45);
                        p5$2.triangle(k-3,real_y-45, k+4, real_y-45, k+1, real_y-40);
                
                        //Drawing the square with the position
                        p5$2.fill(255);
                        p5$2.stroke(220);
                        p5$2.rect(k-19, real_y+2, 40, 20, 20);
                        p5$2.fill(0);
                        p5$2.textSize(9);
                        p5$2.textAlign(p5$2.CENTER);
                        p5$2.text(markers_info.m2.toString(), k+1, real_y+15);
                    }

                    p5$2.noStroke();
                    if(markers_info.num_shown == 2){
                        if(seq_start+i >= markers_info.m1 && seq_start+i < markers_info.m2){
                            p5$2.fill(68, 121, 255, 23);
                            p5$2.rect(k+1,real_y-40,10,39);
                        }    
                    }
                }       
            }

            if(feature_data.length == 0){
                p5$2.noStroke();
                p5$2.fill("#00e676");
                p5$2.rect(real_x,real_y-80, unit_w-10, 12, 20, 0,0,20);
                p5$2.triangle(unit_w-10, real_y-80+12, unit_w-10, real_y-80, unit_w, real_y-80+6);
                p5$2.fill("#fff");
                p5$2.stroke("#fff");
                p5$2.textSize(11);
                p5$2.text("source", real_x+80, real_y-80+10);
            }

            //Draw feature titles 
            for(let k = 0; k < feature_data.length; k++){
                let f = feature_data[k];
                let y = real_y-80 - (k*20);

                p5$2.noStroke();

                let direction = f.direction === undefined? "right" : "left";

                if(direction === "right"){
                    p5$2.fill("#4479FF");
                    p5$2.rect(real_x,y, unit_w-10, 12, 20, 0,0,20);
                    p5$2.triangle(unit_w-10, y+12, unit_w-10, y, unit_w, y+6);
                }else {
                    p5$2.fill("#89ACFF");
                    p5$2.rect(real_x+15,y, unit_w, 12, 0, 20, 20, 0);
                    p5$2.triangle(real_x+15, y, real_x+15, y+12, real_x, y+6);
                }

                p5$2.fill("#fff");
                p5$2.stroke("#fff");
                p5$2.textSize(11);
                p5$2.text(f.label, real_x+80, y+10);
            }

            p5$2.pop();
            return last_pos_drawn;
        }

        render_units(){
            let sequence = GeneAMA.getSequence();
            maxamino = this.getMaxAminosPerLine(sequence);
            for(let i = 0; i < 10; i++){
                let maxsize = (i*150 + ((h$1/4) - ((h$1/4)/10))) + 150 > h$1;
                if(maxsize) break;
                let pos = i*maxamino;
                n_rendered = i;
                let ft = GeneAMA.getFeatureDataFromPosition(sp+(pos)); 
                this.renderUnit(0, i*150, sequence, sp+(pos), ft, i);
            } 
        }

        hitboxCheck(){
            let unit_w = w$1-(w$1/10);
            let unit_h = h$1/4;
            GeneAMA.getSequence();

            let bx = -1; 

            for(let i = 0; i < 10; i++){
                let maxsize = (i*150 + ((h$1/4) - ((h$1/4)/10))) + 150 > h$1;
                if(maxsize) break;

                let mx = p5$2.mouseX;
                let my = p5$2.mouseY;

                if(mx > 0 && mx < unit_w+15 && my > (i*150)+(2*unit_h/3.5)){
                    bx = i;
                }
            } 

            return bx;
        }

        mouse_to_sequence(unit){
            let mx = p5$2.mouseX;
            p5$2.mouseY;
            let real_x = 0;

            for(let i = 0; i < maxamino; i++){
                let k = (real_x*1.5) + (i*10) + 5;
                if(mx > k-5 && mx < k+5){
                    return i;
                }
            }
        } 

        drawCursor(unit, pos, dynamic_sp, color){

            //If nothing has ben clicked, don't draw a cursor
            if(unit == null || pos == null){
                return;
            }

            //This decided when and when not to show the cursor
            let pos_map = (sp+(maxamino*unit)+pos);
            if(dynamic_sp != null && pos_map != dynamic_sp+(maxamino*unit)+pos){
                return;
            }

            if(pos_map < 0 || pos_map < sp){
                return;
            }

            let unit_h = h$1/4;
            let real_y = unit*150 + (unit_h - (unit_h/10));
            let k = (pos*10) + 5;

            p5$2.push();
            //Drawing the cursor
            p5$2.fill(color);
            p5$2.stroke(color);
            p5$2.rect(k-6,real_y, 1,-45);
            p5$2.triangle(k-9,real_y-45, k-2, real_y-45, k-5, real_y-40);

            //Drawing the square with the position
            p5$2.fill(255);
            p5$2.stroke(220);
            p5$2.rect(k-25, real_y+2, 40, 20, 20);
            p5$2.fill(0);
            p5$2.textSize(9);
            p5$2.textAlign(p5$2.CENTER);
            p5$2.noStroke();
            p5$2.text(pos_map.toString(), k-5, real_y+15);
            p5$2.pop();
        }
        draw(){
            this.render_units();
            this.drawCursor(cursor_info.unit, cursor_info.pos, null, "#000");
        }

    }

    let self, p5$1, w, h, r, plasmid_name;

    let sequence = "ACAAA";
    let c_x = 0;
    let c_y = 0;

    let number_of_clicks = 0;

    let showSelection = false;
    let selectionCords = {
        p1: {
            x: 0,
            y: 0,
        },

        p2: {
            x: 0,
            y: 0,
        }
    };

    //To control arrow layers
    let allArrows = [];

    // {start: x, end: y}
    let lvl0 = [];
    let lvl1 = [];
    let lvl2 = [];

    let highlighted_feature = "";


    class CircularMap {

        constructor(ctx, width, height) {
            self = this;
            p5$1 = ctx;
            w = width/2;
            h = height/2;

            sequence = GeneAMA.getSequence();

            //Circle center
            c_x = w / 2;
            c_y = h / 2;
            r = (h - ((h / 2)));

            //Plasmid setup
            plasmid_name = GeneAMA.getName();

            this.calculateArrows();
        }

        static destroy(){
            console.log("destroy called");
            p5$1 = null;
            self = null;
        }

        static updateSequence(newSequence) {
            sequence = newSequence;
        }

        //To toggle plasmid selection
        static activateSelection() {
            showSelection = !showSelection;
            number_of_clicks = 0;
            selectionCords = {
                p1: {
                    x: 0,
                    y: 0,
                },

                p2: {
                    x: 0,
                    y: 0,
                }
            };
            SequenceMap.clearMarkers();
            p5$1.loop();
        }

        static clearSelection(){
            showSelection = false;
            number_of_clicks = 0;
            selectionCords = {
                p1: {
                    x: 0,
                    y: 0,
                },

                p2: {
                    x: 0,
                    y: 0,
                }
            };
            p5$1.loop();
        }

        static loop(){
            sequence = GeneAMA.getSequence();
            allArrows = [];
            lvl0 = [];
            lvl1 = [];
            lvl2 = [];
            self.calculateArrows();
            p5$1.loop();
        }

        static resize(newWidth, newHeight) {
            w = newWidth;
            h = newHeight;
            //Recalculate sizes please bro
            c_x = w / 2;
            c_y = h / 2;
            r = (h - ((h / 2)));
        }

        handleSelection() {
            if (number_of_clicks == 0) {
                selectionCords.p1.x = p5$1.mouseX;
                selectionCords.p1.y = p5$1.mouseY;
            }

            if (number_of_clicks == 1) {
                selectionCords.p2.x = p5$1.mouseX;
                selectionCords.p2.y = p5$1.mouseY;

                let b1 = this.angle_to_base(this.point_to_angle(selectionCords.p1.x, selectionCords.p1.y));
                let b2 = this.angle_to_base(this.point_to_angle(selectionCords.p2.x, selectionCords.p2.y));
                SequenceMap.updateMarkers(b1, b2);
            }

            if (number_of_clicks <= 2) {
                number_of_clicks++;
            }
        }


        featureClicked(e){
            for (let i = 0; i < allArrows.length; i++) {
                let arrow = allArrows[i];

                let level = arrow.level;
                let minR = 40 + (level * 50);

                let maxR;

                if (level == 0) {
                    maxR = 70 + (level * 70);
                } else {
                    maxR = 70 + (level * 70) - (20 * level);
                }

                let lessThanMinR = p5$1.dist(c_x, c_y, p5$1.mouseX, p5$1.mouseY) < (r-minR)/2; 
                let lessThanMaxR = p5$1.dist(c_x, c_y, p5$1.mouseX, p5$1.mouseY) > (r-maxR)/2;
                
                if(lessThanMinR && lessThanMaxR){

                    let angleLessThanEnd = this.point_to_angle(p5$1.mouseX, p5$1.mouseY) < this.base_to_angle(arrow.end);
                    let angleBiggerThanStart = this.point_to_angle(p5$1.mouseX, p5$1.mouseY) > this.base_to_angle(arrow.start);
                    if(angleBiggerThanStart && angleLessThanEnd){
                        return arrow.label;
                    }
                }
            }
            return "";
        }

        mouseClicked(e) {
            if (showSelection) {
                this.handleSelection();
            }else {
                highlighted_feature = this.featureClicked();
                if(highlighted_feature.length !== 0){
                    SequenceMap.goToFeature(highlighted_feature);
                }
            }
        }

        rad_to_ang(rad) {
            return (rad * 180) / Math.PI
        }

        base_to_angle(number) {
            return Math.floor(p5$1.map(number, 0, sequence.length, 0, 360, true));
        }

        angle_to_base(angle) {
            return Math.floor(p5$1.map(angle, 0, 360, 0, sequence.length, true));
        }


        point_to_angle(x, y) {
            //Getting the angle of the individual vectors
            let ang = this.rad_to_ang(Math.atan2(y - c_y, x - c_x)) + 90;

            //Since we're adding 90, our current range is from -90 to 270. We use this "if" to convert it back to the 0-360 range
            if (ang < 0) {
                return (ang + 360)
            }

            return ang;
        }



        draw_arrow(start_bp_num, end_bp_num, direction, text, level, color) {
            let s_angle = this.base_to_angle(start_bp_num);
            let e_angle = this.base_to_angle(end_bp_num);

            if (e_angle - s_angle < 5) return;

            let start_angle;
            let end_angle;

            //How transparent should the fill be (in hex) (0-F)
            let stroke_color;
            let fill_color;

            switch (color) {
                case 0:
                    //#fab ?
                    stroke_color = "#8B64BA";
                    fill_color = "#D7C7EB";
                    break;

                case 1:
                    stroke_color = "#DBB083";
                    fill_color = "#F8DEC1";
                    break;

                case 2:
                    stroke_color = "#59BACC";
                    fill_color = "#AAE4EF";
                    break;

                case 3:
                    stroke_color = "#589BE8";
                    fill_color = "#83b9ff";
                    break;


                case 4:
                    stroke_color = "#DBDB36";
                    fill_color = "#ffffb3";
                    break;
            }

            //When you click it, the stroke of the arrow should change
            if(highlighted_feature != text){
                stroke_color = fill_color;
            }

            //To specify which level the arrow should go to 
            let minR = 40 + (level * 50);

            let maxR;

            if (level == 0) {
                maxR = 70 + (level * 70);
            } else {
                maxR = 70 + (level * 70) - (20 * level);
            }

            //Length of the arrow
            if (direction == "right") {
                start_angle = s_angle - 90;
                end_angle = e_angle - 95;
            } else {
                start_angle = s_angle - 90;
                end_angle = e_angle - 90;
            }
            let rl = -r / 2;

            // Draw the Triangle (Arrow's tip)
            p5$1.push();
            p5$1.translate(c_x, c_y);
            p5$1.stroke(255, 255, 255, 0);
            p5$1.fill(fill_color);
            p5$1.strokeWeight(2);

            let mink = 40;
            let maxk = 70 + (level * 70) - (9 - (level * 4));

            if (direction == "right") {
                p5$1.rotate(Math.floor(e_angle));
                p5$1.triangle(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) - 5, (-12) + (2 * level), rl + (maxk / 3), -12, rl + (maxk / 3) + 16 + (2 * level));
                // p5.triangle(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) - 5, -10 + (2 * level), rl + (maxk / 3),rl + (maxk / 3) + 16 + (2 * level),  )
                p5$1.stroke(stroke_color);
                p5$1.line(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) - 5, -10 + (2 * level), rl + (maxk / 3));
                p5$1.line(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) - 5, -10, rl + (maxk / 3) + 16 + (2 * level));

            } else {
                p5$1.rotate(s_angle);
                p5$1.triangle(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) + 2, -10, rl + (maxk / 3) + 7, 0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) - 13, -10, rl + (maxk / 3) + 7, 0, 0);
                p5$1.stroke(stroke_color);
                p5$1.line(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) + 2, -10, rl + (maxk / 3) + 7);
                p5$1.line(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) - 13, -10, rl + (maxk / 3) + 7);
            }

            p5$1.pop();

            //Draw un Arc
            p5$1.push();
            p5$1.translate(c_x, c_y);
            p5$1.rotate(start_angle);
            p5$1.fill(fill_color);
            p5$1.stroke(stroke_color);
            //Draw inner arc (with color)
            p5$1.strokeWeight(2);
            p5$1.arc(0, 0, r - minR, r - minR, 0, end_angle - start_angle);
            //Draw outter arc (white)
            p5$1.fill(255);
            p5$1.arc(0, 0, r - maxR, r - maxR, 0, end_angle - start_angle);
            p5$1.pop();

            //Draw the arrow's base line 
            p5$1.push();
            p5$1.stroke(stroke_color);
            p5$1.strokeWeight(2);
            p5$1.translate(c_x, c_y);

            //Draw line
            if (direction == "left") {
                p5$1.rotate(Math.floor(e_angle));
            } else {
                p5$1.rotate(Math.floor(s_angle));
            }
            p5$1.line(0, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) + 1, 0, rl + (maxk / 3));
            p5$1.pop();

            //Text
            p5$1.push();
            p5$1.translate(c_x, c_y);
            p5$1.rotate(((e_angle - s_angle) / 2) + s_angle);
            p5$1.textSize(9);

            //To verify arrow text fits the circunference
            let arc_len = Math.abs(e_angle) + Math.abs(s_angle);
            let calc = (arc_len / 9 / text.length) > 3;
            //If text fits, slow it!
            if (calc) {
                p5$1.text(text, -(text.length / 4) * 9, Math.round(rl + (mink / 3)) + Math.round((maxk / 3)) - 3);
            }
            p5$1.pop();


        }


        draw_scale_rects() {
            let r_height = 6;
            let r_width = 2;
            //TO-DO: Fix so it adds every 500 bp, not every 1/5th of sequence length
            for (let i = 0; i < sequence.length; i += Math.floor(sequence.length / 4)) {

                p5$1.push();
                p5$1.translate(c_x, c_y);
                p5$1.angleMode(p5$1.DEGREES);
                p5$1.rotate(this.base_to_angle(i));

                //If it's the origin, display a big marker
                p5$1.noStroke();
                if (i == 0) {
                    p5$1.fill(50);
                    p5$1.rect(0, -(c_y / 2), 3, 10);
                } else {
                    p5$1.fill(121);
                    p5$1.rect(0, -(c_y / 2), r_width, r_height);
                }

                //If it's the origin, don't display text
                if (i == 0) {
                    p5$1.pop();
                    continue;
                }
                p5$1.fill(77);
                p5$1.textFont('Verdana');
                p5$1.textSize(12);
                let bp_str = Math.round(i).toString();
                p5$1.text(bp_str, -(bp_str.length * 12) + 3, -(c_y / 2) + 4, 30, 100);
                p5$1.pop();
            }
        }

        drawSelectionLine(base, vec, myColor) {
            p5$1.push();
            p5$1.stroke(myColor);
            p5$1.strokeWeight(3);
            p5$1.fill(myColor);
            p5$1.translate(base.x, base.y);
            p5$1.line(0, 0, vec.x, vec.y);
            p5$1.rotate(vec.heading());
            let arrowSize = 7;
            p5$1.translate(vec.mag() + arrowSize + 3, 0);
            p5$1.triangle(0, (arrowSize / 2), 0, -arrowSize / 2, arrowSize - 15, 0);
            p5$1.pop();
        }

        drawFilledArc(start_angle, end_angle) {
            //Draw Filled Arc
            p5$1.push();
            p5$1.translate(c_x, c_y);
            p5$1.rotate(start_angle);
            p5$1.fill(255, 229, 199, 100);
            p5$1.stroke(210, 110, 99);
            p5$1.strokeWeight(3);
            p5$1.arc(0, 0, r, r, 0, end_angle - start_angle);
            p5$1.pop();
        }

        draw_selection() {

            if (showSelection == false) return;


            let center_vector = p5$1.createVector(c_x, c_y);

            let first_point_exists = selectionCords.p1.x != 0 && selectionCords.p1.y != 0;
            let second_point_exists = selectionCords.p2.x != 0 && selectionCords.p2.y != 0;

            if (!second_point_exists) {
                p5$1.push();
                //Draw Ghost selection line that follows mouse
                let ghostVec = p5$1.createVector(p5$1.mouseX - c_x, p5$1.mouseY - c_y).normalize().mult((c_y / 2));
                this.drawSelectionLine(center_vector, ghostVec, '#eaeaea');
                p5$1.pop();

            }


            //If first point is already selected
            if (first_point_exists && !second_point_exists) {

                p5$1.push();
                //Draw Ghost selection line that follows mouse
                let ghostVec = p5$1.createVector(p5$1.mouseX - c_x, p5$1.mouseY - c_y).normalize().mult((c_y / 2));
                this.drawSelectionLine(center_vector, ghostVec, '#eaeaea');
                //Draw real selection line for the first point
                let fp = p5$1.createVector(selectionCords.p1.x - c_x, selectionCords.p1.y - c_y).normalize().mult((c_y / 2));
                this.drawSelectionLine(center_vector, fp, '#000');
                p5$1.pop();

                this.drawFilledArc(fp.heading(), ghostVec.heading());

            }

            if (second_point_exists) {
                //Draw Ghost selection line that follows mouse
                let fp = p5$1.createVector(selectionCords.p1.x - c_x, selectionCords.p1.y - c_y).normalize().mult((c_y / 2));
                this.drawSelectionLine(center_vector, fp, '#000');

                //Draw real selection line for the first point
                let sp = p5$1.createVector(selectionCords.p2.x - c_x, selectionCords.p2.y - c_y).normalize().mult((c_y / 2));
                this.drawSelectionLine(center_vector, sp, '#000');

                this.drawFilledArc(fp.heading(), sp.heading());
            }
        }

        draw_circle() {
            p5$1.push();
            if (showSelection) {
                p5$1.stroke("#000");
            } else {
                p5$1.stroke(121);
            }
            p5$1.strokeWeight(3);
            p5$1.circle(c_x, c_y, r);
            p5$1.pop();
        }

        draw_plasmid_name() {
            p5$1.push();
            p5$1.translate(c_x, c_y);


            p5$1.noStroke();
            p5$1.fill('white');
            p5$1.circle(0, 0, (c_y / 3));
            p5$1.fill('#131313');
            p5$1.textFont('Verdana');
            p5$1.textStyle(p5$1.BOLD);
            p5$1.textSize(12);
            p5$1.textAlign(p5$1.CENTER);
            p5$1.text(plasmid_name, -(plasmid_name.length / 2) * 12, -7, (plasmid_name.length) * 12, 14);

            let bp_len = (sequence.length.toString() + " bp").length;
            p5$1.textStyle(p5$1.NORMAL);
            p5$1.fill("#838383");
            p5$1.text(sequence.length.toString() + " bp", -(bp_len / 2) * 12, 12, (bp_len) * 12, 14);

            p5$1.pop();
        }

        canFitInLevel(start, end, level) {

            let lvl = [];

            switch (level) {
                case 0: lvl = lvl0.slice(); break;
                case 1: lvl = lvl1.slice(); break;
                case 2: lvl = lvl2.slice(); break;
                default: console.warn("Level you tried to get does not exist!");
            }

            if (lvl.length == 0) {
                return true;
            }

            let canBeInLevel = true;
            for (let i = 0; i < lvl.length; lvl++) {
                if (this.collides(lvl[i].start, lvl[i].end, start, end)) {
                    canBeInLevel = false;
                }
            }

            return canBeInLevel;

        }

        collides(a, b, c, d) {
            if (c >= a && c <= b) {
                return true;
            }

            if (d >= a && d <= b) {
                return true;
            }
            return false;
        }

        calculateArrows() {
            allArrows = [];
            let features = GeneAMA.getFeatures();
            features.forEach(f => {

                if (f.label == undefined || f.label == "") {
                    return
                }

                let arrow = {
                    start: f.start,
                    end: f.end,
                    label: f.label,
                    level: 0,
                    color: 0,
                };

                if (f.direction != undefined && f.direction != null) {
                    arrow.direction = f.direction.toLowerCase();
                } else {
                    arrow.direction = "right";
                }

                fitloop:
                for (let k = 0; k < 3; k++) {
                    if (this.canFitInLevel(f.start, f.end, k)) {
                        arrow.level = k;
                        arrow.color = k;
                        switch (k) {
                            case 0: lvl0.push({ start: f.start, end: f.end }); break fitloop;
                            case 1: lvl1.push({ start: f.start, end: f.end }); break fitloop;
                            case 2: lvl2.push({ start: f.start, end: f.end }); break fitloop;
                            default: console.warn("Level index out of range!");
                        }
                    }
                }

                allArrows.push(arrow);
            });
        }

        drawAllArrows() {
            let numColors = 5;

            for (let i = 0; i < allArrows.length; i++) {
                let arrow = allArrows[i];
                if (arrow.level == 0) {
                    this.draw_arrow(arrow.start, arrow.end, arrow.direction, arrow.label, arrow.level, i % numColors);
                }
            }

            for (let i = 0; i < allArrows.length; i++) {
                let arrow = allArrows[i];
                if (arrow.level == 1) {
                    this.draw_arrow(arrow.start, arrow.end, arrow.direction, arrow.label, arrow.level, i % numColors);
                }
            }

            for (let i = 0; i < allArrows.length; i++) {
                let arrow = allArrows[i];
                if (arrow.level == 2) {
                    this.draw_arrow(arrow.start, arrow.end, arrow.direction, arrow.label, arrow.level, i % numColors);
                }
            }
        }

        draw() {
            this.draw_circle();
            this.draw_scale_rects();
            this.drawAllArrows();
            this.draw_selection();
            this.draw_plasmid_name();

            let first_point_exists = selectionCords.p1.x != 0 && selectionCords.p1.y != 0;
            let second_point_exists = selectionCords.p2.x != 0 && selectionCords.p2.y != 0;

            if (first_point_exists && second_point_exists){
                p5$1.noLoop();
            }else {
                if (showSelection == true){
                    p5$1.loop();
                }else {
                p5$1.noLoop();
                }
            }
        }


    }

    let proteins = [

    	{
    		name: "GFP",
    		desc: "This protein glows in the dark",
    		sequence: "MSKGEELFTGVVPILVELDGDVNGHKFSVSGEGEGDATYGKLTLKFICTTGKLPVPWPTLVTTFSYGVQCFSRYPDHMKQHDFFKSAMPEGYVQERTIFFKDDGNYKTRAEVKFEGDTLVNRIELKGIDFKEDGNILGHKLEYNYNSHNVYIMADKQKNGIKVNFKIRHNIEDGSVQLADHYQQNTPIGDGPVLLPDNHYLSTQSALSKDPNEKRDHMVLLEFVTAAGITHGMDELYK"
    	},
    	{
    		name: "Ovalbumin",
    		desc: "Egg white",
    		sequence: "MGSIGAASMEFCFDVFKELKVHHANENIFYCPIAIMSALAMVYLGAKDSTRTQINKVVRFDKLPGFGDSIEAQCGTSVNVHSSLRDILNQITKPNDVYSFSLASRLYAEERYPILPEYLQCVKELYRGGLEPINFQTAADQARELINSWVESQTNGIIRNVLQPSSVDSQTAMVLVNAIVFKGLWEKAFKDEDTQAMPFRVTEQESKPVQMMYQIGLFRVASMASEKMKILELPFASGTMSMLVLLPDEVSGLEQLESIINFEKLTEWTSSNVMEERKIKVYLPRMKMEEKYNLTSVLMAMGITDVFSSSANLSGISSAESLKISQAVHAAHAEINEAGREVVGSAEAGVDAASVSEEFRADHPFLFCIKHIATNAVLFFGRCVSP"
    	},

    ];


    class Proteins {

    	static getProteins(){
    		return proteins;
    	}

    	static lookUp(protname){

    		if (protname.replace(/ /g,"") == "") return proteins;
    		if (protname == "") return proteins;

    		let prots = [];
    		for(let i = 0; i < proteins.length; i++){
    			let is_in_name = proteins[i].name.toLowerCase().includes(protname.toLowerCase()); 
    			let is_in_desc = proteins[i].desc.toLowerCase().includes(protname.toLowerCase()); 
    			if(is_in_name || is_in_desc){
    				prots.push(proteins[i]);
    			}

    		}
    		return prots;
    	}

    }

    /* src\editor\plasmid\Insert.svelte generated by Svelte v3.40.3 */
    const file$9 = "src\\editor\\plasmid\\Insert.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i].name;
    	child_ctx[15] = list[i].desc;
    	child_ctx[16] = list[i].sequence;
    	return child_ctx;
    }

    // (125:1) {#if screenToShow == "menu"}
    function create_if_block_2$4(ctx) {
    	let div2;
    	let h1;
    	let t1;
    	let div0;
    	let svg0;
    	let path0;
    	let t2;
    	let h20;
    	let t4;
    	let div1;
    	let svg1;
    	let path1;
    	let t5;
    	let h21;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Insert";
    			t1 = space();
    			div0 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t2 = space();
    			h20 = element("h2");
    			h20.textContent = "Sequence";
    			t4 = space();
    			div1 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t5 = space();
    			h21 = element("h2");
    			h21.textContent = "Protein";
    			attr_dev(h1, "class", "svelte-el0w2x");
    			add_location(h1, file$9, 126, 7, 3124);
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "stroke-width", "2");
    			attr_dev(path0, "d", "M4 6h16M4 12h8m-8 6h16");
    			add_location(path0, file$9, 129, 5, 3312);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "class", "h-6 w-6 svelte-el0w2x");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke", "#4479FF");
    			add_location(svg0, file$9, 128, 3, 3200);
    			attr_dev(h20, "class", "svelte-el0w2x");
    			add_location(h20, file$9, 131, 3, 3427);
    			attr_dev(div0, "class", "c-option svelte-el0w2x");
    			add_location(div0, file$9, 127, 2, 3143);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "stroke-width", "2");
    			attr_dev(path1, "d", "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z");
    			add_location(path1, file$9, 135, 5, 3626);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "class", "h-6 w-6 svelte-el0w2x");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke", "#4479FF");
    			add_location(svg1, file$9, 134, 3, 3514);
    			attr_dev(h21, "class", "svelte-el0w2x");
    			add_location(h21, file$9, 137, 3, 3960);
    			attr_dev(div1, "class", "c-option svelte-el0w2x");
    			add_location(div1, file$9, 133, 2, 3458);
    			attr_dev(div2, "class", "container svelte-el0w2x");
    			add_location(div2, file$9, 125, 1, 3092);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h1);
    			append_dev(div2, t1);
    			append_dev(div2, div0);
    			append_dev(div0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div0, t2);
    			append_dev(div0, h20);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, svg1);
    			append_dev(svg1, path1);
    			append_dev(div1, t5);
    			append_dev(div1, h21);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*showSequenceScreen*/ ctx[4], false, false, false),
    					listen_dev(div1, "click", /*showProteinScreen*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(125:1) {#if screenToShow == \\\"menu\\\"}",
    		ctx
    	});

    	return block;
    }

    // (144:1) {#if screenToShow == "sequence"}
    function create_if_block_1$5(ctx) {
    	let div1;
    	let h1;
    	let t1;
    	let input;
    	let t2;
    	let div0;
    	let button0;
    	let t4;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Insert sequence";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "Cancel";
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "Insert";
    			attr_dev(h1, "class", "svelte-el0w2x");
    			add_location(h1, file$9, 145, 8, 4079);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Type any codon or sequence here...");
    			attr_dev(input, "class", "svelte-el0w2x");
    			add_location(input, file$9, 146, 8, 4113);
    			attr_dev(button0, "class", "cancel svelte-el0w2x");
    			add_location(button0, file$9, 148, 9, 4258);
    			attr_dev(button1, "class", "ok svelte-el0w2x");
    			add_location(button1, file$9, 149, 9, 4329);
    			attr_dev(div0, "class", "buttons svelte-el0w2x");
    			add_location(div0, file$9, 147, 8, 4226);
    			attr_dev(div1, "class", "container svelte-el0w2x");
    			add_location(div1, file$9, 144, 2, 4046);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, input);
    			set_input_value(input, /*insert_sequence_input*/ ctx[1]);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t4);
    			append_dev(div0, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[9]),
    					listen_dev(button0, "click", /*stopInsert*/ ctx[6], false, false, false),
    					listen_dev(button1, "click", /*handleInsertSequence*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*insert_sequence_input*/ 2 && input.value !== /*insert_sequence_input*/ ctx[1]) {
    				set_input_value(input, /*insert_sequence_input*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(144:1) {#if screenToShow == \\\"sequence\\\"}",
    		ctx
    	});

    	return block;
    }

    // (155:1) {#if screenToShow == "protein"}
    function create_if_block$6(ctx) {
    	let div2;
    	let h1;
    	let t1;
    	let input;
    	let t2;
    	let div0;
    	let t3;
    	let div1;
    	let button;
    	let mounted;
    	let dispose;
    	let each_value = /*proteins_to_display*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Insert protein";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t3 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Cancel";
    			attr_dev(h1, "class", "svelte-el0w2x");
    			add_location(h1, file$9, 156, 4, 4514);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "What are you looking for?");
    			attr_dev(input, "class", "svelte-el0w2x");
    			add_location(input, file$9, 157, 7, 4546);
    			attr_dev(div0, "class", "protein-container svelte-el0w2x");
    			add_location(div0, file$9, 159, 7, 4711);
    			attr_dev(button, "class", "cancel svelte-el0w2x");
    			add_location(button, file$9, 169, 9, 5026);
    			attr_dev(div1, "class", "buttons svelte-el0w2x");
    			add_location(div1, file$9, 168, 7, 4994);
    			attr_dev(div2, "class", "container bigcontainer  svelte-el0w2x");
    			add_location(div2, file$9, 155, 2, 4471);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h1);
    			append_dev(div2, t1);
    			append_dev(div2, input);
    			set_input_value(input, /*protein_input*/ ctx[2]);
    			append_dev(div2, t2);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_handler*/ ctx[10], false, false, false),
    					listen_dev(input, "input", /*input_input_handler_1*/ ctx[11]),
    					listen_dev(button, "click", /*stopInsert*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*protein_input*/ 4 && input.value !== /*protein_input*/ ctx[2]) {
    				set_input_value(input, /*protein_input*/ ctx[2]);
    			}

    			if (dirty & /*insertProtein, proteins_to_display*/ 264) {
    				each_value = /*proteins_to_display*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(155:1) {#if screenToShow == \\\"protein\\\"}",
    		ctx
    	});

    	return block;
    }

    // (162:8) {#each proteins_to_display as {name, desc, sequence}}
    function create_each_block$4(ctx) {
    	let div;
    	let h2;
    	let t0_value = /*name*/ ctx[14] + "";
    	let t0;
    	let t1;
    	let h3;
    	let t2_value = /*desc*/ ctx[15] + "";
    	let t2;
    	let t3;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[12](/*sequence*/ ctx[16]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			h3 = element("h3");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(h2, "class", "svelte-el0w2x");
    			add_location(h2, file$9, 163, 11, 4893);
    			attr_dev(h3, "class", "svelte-el0w2x");
    			add_location(h3, file$9, 164, 11, 4921);
    			attr_dev(div, "class", "protein svelte-el0w2x");
    			add_location(div, file$9, 162, 9, 4818);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(div, t1);
    			append_dev(div, h3);
    			append_dev(h3, t2);
    			append_dev(div, t3);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*proteins_to_display*/ 8 && t0_value !== (t0_value = /*name*/ ctx[14] + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*proteins_to_display*/ 8 && t2_value !== (t2_value = /*desc*/ ctx[15] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(162:8) {#each proteins_to_display as {name, desc, sequence}}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let main;
    	let t0;
    	let t1;
    	let if_block0 = /*screenToShow*/ ctx[0] == "menu" && create_if_block_2$4(ctx);
    	let if_block1 = /*screenToShow*/ ctx[0] == "sequence" && create_if_block_1$5(ctx);
    	let if_block2 = /*screenToShow*/ ctx[0] == "protein" && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(main, "class", "svelte-el0w2x");
    			add_location(main, file$9, 122, 0, 3050);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t0);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t1);
    			if (if_block2) if_block2.m(main, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*screenToShow*/ ctx[0] == "menu") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$4(ctx);
    					if_block0.c();
    					if_block0.m(main, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*screenToShow*/ ctx[0] == "sequence") {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$5(ctx);
    					if_block1.c();
    					if_block1.m(main, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*screenToShow*/ ctx[0] == "protein") {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$6(ctx);
    					if_block2.c();
    					if_block2.m(main, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function RNA_to_DNA$1(RNA) {
    	return RNA.toLowerCase().replace(/u/g, "t");
    }

    function codon_to_RNA$1(codon) {
    	switch (codon) {
    		case 'A':
    			return "GCU";
    		case 'I':
    			return "AUU";
    		case 'R':
    			return "CGU";
    		case 'L':
    			return "CUU";
    		case 'N':
    			return "AAU";
    		case 'K':
    			return "AAA";
    		case 'D':
    			return "GAU";
    		case 'M':
    			return "AUG";
    		case 'F':
    			return "UUU";
    		case 'C':
    			return "UGU";
    		case 'P':
    			return "CCU";
    		case 'Q':
    			return "CAA";
    		case 'S':
    			return "UCU";
    		case 'E':
    			return "GAA";
    		case 'T':
    			return "ACU";
    		case 'W':
    			return "UGG";
    		case 'G':
    			return "GGU";
    		case 'Y':
    			return "UAU";
    		case 'H':
    			return "CAU";
    		case 'V':
    			return "GUU";
    		case 'X':
    			return "UAA";
    		default:
    			return "";
    	}
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Insert', slots, []);
    	let editorinfo;

    	editor_info.subscribe(value => {
    		editorinfo = value;
    	});

    	//Screens: menu, sequence, protein
    	let screenToShow = "menu";

    	function showSequenceScreen() {
    		$$invalidate(0, screenToShow = "sequence");
    	}

    	function showProteinScreen() {
    		$$invalidate(0, screenToShow = "protein");
    	}

    	let insert_sequence_input = "";

    	function stopInsert() {
    		$$invalidate(0, screenToShow = "menu");
    		let new_editinfo = editorinfo;
    		new_editinfo.show_insert = false;
    		new_editinfo.screen_on_top_showing = false;
    		editor_info.set(new_editinfo);
    		$$invalidate(1, insert_sequence_input = "");
    	}

    	function handleInsertSequence() {
    		let [cursor, _] = SequenceMap.getSelected();
    		if (cursor == null) return;
    		let oldseq = GeneAMA.getSequence();
    		let final_sequence = "";

    		for (let i = 0; i < insert_sequence_input.length; i++) {
    			let c = insert_sequence_input[i];
    			let isAmino = c == 'a' || c == 't' || c == 'g' || c == 'c';

    			if (isAmino) {
    				final_sequence += c;
    			} else {
    				final_sequence += RNA_to_DNA$1(codon_to_RNA$1(c.toUpperCase()));
    			}
    		}

    		let newseq = oldseq.substring(0, cursor) + final_sequence + oldseq.substring(cursor);
    		GeneAMA.updateSequence(newseq);
    		let f = GeneAMA.getFeatures();
    		let newF = [];

    		for (let i = 0; i < f.length; i++) {
    			if (cursor > f[i].start && cursor < f[i].end) {
    				f[i].end += final_sequence.length;
    			}

    			if (cursor < f[i].start) {
    				f[i].start += final_sequence.length;
    				f[i].end += final_sequence.length;
    			}

    			newF.push(f[i]);
    		}

    		SequenceMap.updateMarkers(cursor, cursor + final_sequence.length);
    		SequenceMap.loop();
    		CircularMap.loop();
    		stopInsert();
    	}

    	let protein_input = "";
    	let proteins_to_display = Proteins.lookUp(protein_input);

    	function insertProtein(seq) {
    		$$invalidate(1, insert_sequence_input = seq);
    		handleInsertSequence();
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Insert> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		insert_sequence_input = this.value;
    		$$invalidate(1, insert_sequence_input);
    	}

    	const input_handler = () => $$invalidate(3, proteins_to_display = Proteins.lookUp(protein_input));

    	function input_input_handler_1() {
    		protein_input = this.value;
    		$$invalidate(2, protein_input);
    	}

    	const click_handler = sequence => insertProtein(sequence);

    	$$self.$capture_state = () => ({
    		editor_info,
    		SequenceMap,
    		CircularMap,
    		GeneAMA,
    		Proteins,
    		editorinfo,
    		screenToShow,
    		showSequenceScreen,
    		showProteinScreen,
    		insert_sequence_input,
    		stopInsert,
    		handleInsertSequence,
    		RNA_to_DNA: RNA_to_DNA$1,
    		codon_to_RNA: codon_to_RNA$1,
    		protein_input,
    		proteins_to_display,
    		insertProtein
    	});

    	$$self.$inject_state = $$props => {
    		if ('editorinfo' in $$props) editorinfo = $$props.editorinfo;
    		if ('screenToShow' in $$props) $$invalidate(0, screenToShow = $$props.screenToShow);
    		if ('insert_sequence_input' in $$props) $$invalidate(1, insert_sequence_input = $$props.insert_sequence_input);
    		if ('protein_input' in $$props) $$invalidate(2, protein_input = $$props.protein_input);
    		if ('proteins_to_display' in $$props) $$invalidate(3, proteins_to_display = $$props.proteins_to_display);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		screenToShow,
    		insert_sequence_input,
    		protein_input,
    		proteins_to_display,
    		showSequenceScreen,
    		showProteinScreen,
    		stopInsert,
    		handleInsertSequence,
    		insertProtein,
    		input_input_handler,
    		input_handler,
    		input_input_handler_1,
    		click_handler
    	];
    }

    class Insert extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Insert",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var collectionUtils = createCommonjsModule(function (module) {

    var utils = module.exports = {};

    /**
     * Loops through the collection and calls the callback for each element. if the callback returns truthy, the loop is broken and returns the same value.
     * @public
     * @param {*} collection The collection to loop through. Needs to have a length property set and have indices set from 0 to length - 1.
     * @param {function} callback The callback to be called for each element. The element will be given as a parameter to the callback. If this callback returns truthy, the loop is broken and the same value is returned.
     * @returns {*} The value that a callback has returned (if truthy). Otherwise nothing.
     */
    utils.forEach = function(collection, callback) {
        for(var i = 0; i < collection.length; i++) {
            var result = callback(collection[i]);
            if(result) {
                return result;
            }
        }
    };
    });

    var elementUtils = function(options) {
        var getState = options.stateHandler.getState;

        /**
         * Tells if the element has been made detectable and ready to be listened for resize events.
         * @public
         * @param {element} The element to check.
         * @returns {boolean} True or false depending on if the element is detectable or not.
         */
        function isDetectable(element) {
            var state = getState(element);
            return state && !!state.isDetectable;
        }

        /**
         * Marks the element that it has been made detectable and ready to be listened for resize events.
         * @public
         * @param {element} The element to mark.
         */
        function markAsDetectable(element) {
            getState(element).isDetectable = true;
        }

        /**
         * Tells if the element is busy or not.
         * @public
         * @param {element} The element to check.
         * @returns {boolean} True or false depending on if the element is busy or not.
         */
        function isBusy(element) {
            return !!getState(element).busy;
        }

        /**
         * Marks the object is busy and should not be made detectable.
         * @public
         * @param {element} element The element to mark.
         * @param {boolean} busy If the element is busy or not.
         */
        function markBusy(element, busy) {
            getState(element).busy = !!busy;
        }

        return {
            isDetectable: isDetectable,
            markAsDetectable: markAsDetectable,
            isBusy: isBusy,
            markBusy: markBusy
        };
    };

    var listenerHandler = function(idHandler) {
        var eventListeners = {};

        /**
         * Gets all listeners for the given element.
         * @public
         * @param {element} element The element to get all listeners for.
         * @returns All listeners for the given element.
         */
        function getListeners(element) {
            var id = idHandler.get(element);

            if (id === undefined) {
                return [];
            }

            return eventListeners[id] || [];
        }

        /**
         * Stores the given listener for the given element. Will not actually add the listener to the element.
         * @public
         * @param {element} element The element that should have the listener added.
         * @param {function} listener The callback that the element has added.
         */
        function addListener(element, listener) {
            var id = idHandler.get(element);

            if(!eventListeners[id]) {
                eventListeners[id] = [];
            }

            eventListeners[id].push(listener);
        }

        function removeListener(element, listener) {
            var listeners = getListeners(element);
            for (var i = 0, len = listeners.length; i < len; ++i) {
                if (listeners[i] === listener) {
                  listeners.splice(i, 1);
                  break;
                }
            }
        }

        function removeAllListeners(element) {
          var listeners = getListeners(element);
          if (!listeners) { return; }
          listeners.length = 0;
        }

        return {
            get: getListeners,
            add: addListener,
            removeListener: removeListener,
            removeAllListeners: removeAllListeners
        };
    };

    var idGenerator = function() {
        var idCount = 1;

        /**
         * Generates a new unique id in the context.
         * @public
         * @returns {number} A unique id in the context.
         */
        function generate() {
            return idCount++;
        }

        return {
            generate: generate
        };
    };

    var idHandler = function(options) {
        var idGenerator     = options.idGenerator;
        var getState        = options.stateHandler.getState;

        /**
         * Gets the resize detector id of the element.
         * @public
         * @param {element} element The target element to get the id of.
         * @returns {string|number|null} The id of the element. Null if it has no id.
         */
        function getId(element) {
            var state = getState(element);

            if (state && state.id !== undefined) {
                return state.id;
            }

            return null;
        }

        /**
         * Sets the resize detector id of the element. Requires the element to have a resize detector state initialized.
         * @public
         * @param {element} element The target element to set the id of.
         * @returns {string|number|null} The id of the element.
         */
        function setId(element) {
            var state = getState(element);

            if (!state) {
                throw new Error("setId required the element to have a resize detection state.");
            }

            var id = idGenerator.generate();

            state.id = id;

            return id;
        }

        return {
            get: getId,
            set: setId
        };
    };

    /* global console: false */

    /**
     * Reporter that handles the reporting of logs, warnings and errors.
     * @public
     * @param {boolean} quiet Tells if the reporter should be quiet or not.
     */
    var reporter = function(quiet) {
        function noop() {
            //Does nothing.
        }

        var reporter = {
            log: noop,
            warn: noop,
            error: noop
        };

        if(!quiet && window.console) {
            var attachFunction = function(reporter, name) {
                //The proxy is needed to be able to call the method with the console context,
                //since we cannot use bind.
                reporter[name] = function reporterProxy() {
                    var f = console[name];
                    if (f.apply) { //IE9 does not support console.log.apply :)
                        f.apply(console, arguments);
                    } else {
                        for (var i = 0; i < arguments.length; i++) {
                            f(arguments[i]);
                        }
                    }
                };
            };

            attachFunction(reporter, "log");
            attachFunction(reporter, "warn");
            attachFunction(reporter, "error");
        }

        return reporter;
    };

    var browserDetector = createCommonjsModule(function (module) {

    var detector = module.exports = {};

    detector.isIE = function(version) {
        function isAnyIeVersion() {
            var agent = navigator.userAgent.toLowerCase();
            return agent.indexOf("msie") !== -1 || agent.indexOf("trident") !== -1 || agent.indexOf(" edge/") !== -1;
        }

        if(!isAnyIeVersion()) {
            return false;
        }

        if(!version) {
            return true;
        }

        //Shamelessly stolen from https://gist.github.com/padolsey/527683
        var ieVersion = (function(){
            var undef,
                v = 3,
                div = document.createElement("div"),
                all = div.getElementsByTagName("i");

            do {
                div.innerHTML = "<!--[if gt IE " + (++v) + "]><i></i><![endif]-->";
            }
            while (all[0]);

            return v > 4 ? v : undef;
        }());

        return version === ieVersion;
    };

    detector.isLegacyOpera = function() {
        return !!window.opera;
    };
    });

    var utils_1 = createCommonjsModule(function (module) {

    var utils = module.exports = {};

    utils.getOption = getOption;

    function getOption(options, name, defaultValue) {
        var value = options[name];

        if((value === undefined || value === null) && defaultValue !== undefined) {
            return defaultValue;
        }

        return value;
    }
    });

    var batchProcessor = function batchProcessorMaker(options) {
        options             = options || {};
        var reporter        = options.reporter;
        var asyncProcess    = utils_1.getOption(options, "async", true);
        var autoProcess     = utils_1.getOption(options, "auto", true);

        if(autoProcess && !asyncProcess) {
            reporter && reporter.warn("Invalid options combination. auto=true and async=false is invalid. Setting async=true.");
            asyncProcess = true;
        }

        var batch = Batch();
        var asyncFrameHandler;
        var isProcessing = false;

        function addFunction(level, fn) {
            if(!isProcessing && autoProcess && asyncProcess && batch.size() === 0) {
                // Since this is async, it is guaranteed to be executed after that the fn is added to the batch.
                // This needs to be done before, since we're checking the size of the batch to be 0.
                processBatchAsync();
            }

            batch.add(level, fn);
        }

        function processBatch() {
            // Save the current batch, and create a new batch so that incoming functions are not added into the currently processing batch.
            // Continue processing until the top-level batch is empty (functions may be added to the new batch while processing, and so on).
            isProcessing = true;
            while (batch.size()) {
                var processingBatch = batch;
                batch = Batch();
                processingBatch.process();
            }
            isProcessing = false;
        }

        function forceProcessBatch(localAsyncProcess) {
            if (isProcessing) {
                return;
            }

            if(localAsyncProcess === undefined) {
                localAsyncProcess = asyncProcess;
            }

            if(asyncFrameHandler) {
                cancelFrame(asyncFrameHandler);
                asyncFrameHandler = null;
            }

            if(localAsyncProcess) {
                processBatchAsync();
            } else {
                processBatch();
            }
        }

        function processBatchAsync() {
            asyncFrameHandler = requestFrame(processBatch);
        }

        function cancelFrame(listener) {
            // var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.clearTimeout;
            var cancel = clearTimeout;
            return cancel(listener);
        }

        function requestFrame(callback) {
            // var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(fn) { return window.setTimeout(fn, 20); };
            var raf = function(fn) { return setTimeout(fn, 0); };
            return raf(callback);
        }

        return {
            add: addFunction,
            force: forceProcessBatch
        };
    };

    function Batch() {
        var batch       = {};
        var size        = 0;
        var topLevel    = 0;
        var bottomLevel = 0;

        function add(level, fn) {
            if(!fn) {
                fn = level;
                level = 0;
            }

            if(level > topLevel) {
                topLevel = level;
            } else if(level < bottomLevel) {
                bottomLevel = level;
            }

            if(!batch[level]) {
                batch[level] = [];
            }

            batch[level].push(fn);
            size++;
        }

        function process() {
            for(var level = bottomLevel; level <= topLevel; level++) {
                var fns = batch[level];

                for(var i = 0; i < fns.length; i++) {
                    var fn = fns[i];
                    fn();
                }
            }
        }

        function getSize() {
            return size;
        }

        return {
            add: add,
            process: process,
            size: getSize
        };
    }

    var prop = "_erd";

    function initState(element) {
        element[prop] = {};
        return getState(element);
    }

    function getState(element) {
        return element[prop];
    }

    function cleanState(element) {
        delete element[prop];
    }

    var stateHandler = {
        initState: initState,
        getState: getState,
        cleanState: cleanState
    };

    /**
     * Resize detection strategy that injects objects to elements in order to detect resize events.
     * Heavily inspired by: http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
     */



    var object = function(options) {
        options             = options || {};
        var reporter        = options.reporter;
        var batchProcessor  = options.batchProcessor;
        var getState        = options.stateHandler.getState;

        if(!reporter) {
            throw new Error("Missing required dependency: reporter.");
        }

        /**
         * Adds a resize event listener to the element.
         * @public
         * @param {element} element The element that should have the listener added.
         * @param {function} listener The listener callback to be called for each resize event of the element. The element will be given as a parameter to the listener callback.
         */
        function addListener(element, listener) {
            function listenerProxy() {
                listener(element);
            }

            if(browserDetector.isIE(8)) {
                //IE 8 does not support object, but supports the resize event directly on elements.
                getState(element).object = {
                    proxy: listenerProxy
                };
                element.attachEvent("onresize", listenerProxy);
            } else {
                var object = getObject(element);

                if(!object) {
                    throw new Error("Element is not detectable by this strategy.");
                }

                object.contentDocument.defaultView.addEventListener("resize", listenerProxy);
            }
        }

        function buildCssTextString(rules) {
            var seperator = options.important ? " !important; " : "; ";

            return (rules.join(seperator) + seperator).trim();
        }

        /**
         * Makes an element detectable and ready to be listened for resize events. Will call the callback when the element is ready to be listened for resize changes.
         * @private
         * @param {object} options Optional options object.
         * @param {element} element The element to make detectable
         * @param {function} callback The callback to be called when the element is ready to be listened for resize changes. Will be called with the element as first parameter.
         */
        function makeDetectable(options, element, callback) {
            if (!callback) {
                callback = element;
                element = options;
                options = null;
            }

            options = options || {};
            options.debug;

            function injectObject(element, callback) {
                var OBJECT_STYLE = buildCssTextString(["display: block", "position: absolute", "top: 0", "left: 0", "width: 100%", "height: 100%", "border: none", "padding: 0", "margin: 0", "opacity: 0", "z-index: -1000", "pointer-events: none"]);

                //The target element needs to be positioned (everything except static) so the absolute positioned object will be positioned relative to the target element.

                // Position altering may be performed directly or on object load, depending on if style resolution is possible directly or not.
                var positionCheckPerformed = false;

                // The element may not yet be attached to the DOM, and therefore the style object may be empty in some browsers.
                // Since the style object is a reference, it will be updated as soon as the element is attached to the DOM.
                var style = window.getComputedStyle(element);
                var width = element.offsetWidth;
                var height = element.offsetHeight;

                getState(element).startSize = {
                    width: width,
                    height: height
                };

                function mutateDom() {
                    function alterPositionStyles() {
                        if(style.position === "static") {
                            element.style.setProperty("position", "relative", options.important ? "important" : "");

                            var removeRelativeStyles = function(reporter, element, style, property) {
                                function getNumericalValue(value) {
                                    return value.replace(/[^-\d\.]/g, "");
                                }

                                var value = style[property];

                                if(value !== "auto" && getNumericalValue(value) !== "0") {
                                    reporter.warn("An element that is positioned static has style." + property + "=" + value + " which is ignored due to the static positioning. The element will need to be positioned relative, so the style." + property + " will be set to 0. Element: ", element);
                                    element.style.setProperty(property, "0", options.important ? "important" : "");
                                }
                            };

                            //Check so that there are no accidental styles that will make the element styled differently now that is is relative.
                            //If there are any, set them to 0 (this should be okay with the user since the style properties did nothing before [since the element was positioned static] anyway).
                            removeRelativeStyles(reporter, element, style, "top");
                            removeRelativeStyles(reporter, element, style, "right");
                            removeRelativeStyles(reporter, element, style, "bottom");
                            removeRelativeStyles(reporter, element, style, "left");
                        }
                    }

                    function onObjectLoad() {
                        // The object has been loaded, which means that the element now is guaranteed to be attached to the DOM.
                        if (!positionCheckPerformed) {
                            alterPositionStyles();
                        }

                        /*jshint validthis: true */

                        function getDocument(element, callback) {
                            //Opera 12 seem to call the object.onload before the actual document has been created.
                            //So if it is not present, poll it with an timeout until it is present.
                            //TODO: Could maybe be handled better with object.onreadystatechange or similar.
                            if(!element.contentDocument) {
                                var state = getState(element);
                                if (state.checkForObjectDocumentTimeoutId) {
                                    window.clearTimeout(state.checkForObjectDocumentTimeoutId);
                                }
                                state.checkForObjectDocumentTimeoutId = setTimeout(function checkForObjectDocument() {
                                    state.checkForObjectDocumentTimeoutId = 0;
                                    getDocument(element, callback);
                                }, 100);

                                return;
                            }

                            callback(element.contentDocument);
                        }

                        //Mutating the object element here seems to fire another load event.
                        //Mutating the inner document of the object element is fine though.
                        var objectElement = this;

                        //Create the style element to be added to the object.
                        getDocument(objectElement, function onObjectDocumentReady(objectDocument) {
                            //Notify that the element is ready to be listened to.
                            callback(element);
                        });
                    }

                    // The element may be detached from the DOM, and some browsers does not support style resolving of detached elements.
                    // The alterPositionStyles needs to be delayed until we know the element has been attached to the DOM (which we are sure of when the onObjectLoad has been fired), if style resolution is not possible.
                    if (style.position !== "") {
                        alterPositionStyles();
                        positionCheckPerformed = true;
                    }

                    //Add an object element as a child to the target element that will be listened to for resize events.
                    var object = document.createElement("object");
                    object.style.cssText = OBJECT_STYLE;
                    object.tabIndex = -1;
                    object.type = "text/html";
                    object.setAttribute("aria-hidden", "true");
                    object.onload = onObjectLoad;

                    //Safari: This must occur before adding the object to the DOM.
                    //IE: Does not like that this happens before, even if it is also added after.
                    if(!browserDetector.isIE()) {
                        object.data = "about:blank";
                    }

                    if (!getState(element)) {
                        // The element has been uninstalled before the actual loading happened.
                        return;
                    }

                    element.appendChild(object);
                    getState(element).object = object;

                    //IE: This must occur after adding the object to the DOM.
                    if(browserDetector.isIE()) {
                        object.data = "about:blank";
                    }
                }

                if(batchProcessor) {
                    batchProcessor.add(mutateDom);
                } else {
                    mutateDom();
                }
            }

            if(browserDetector.isIE(8)) {
                //IE 8 does not support objects properly. Luckily they do support the resize event.
                //So do not inject the object and notify that the element is already ready to be listened to.
                //The event handler for the resize event is attached in the utils.addListener instead.
                callback(element);
            } else {
                injectObject(element, callback);
            }
        }

        /**
         * Returns the child object of the target element.
         * @private
         * @param {element} element The target element.
         * @returns The object element of the target.
         */
        function getObject(element) {
            return getState(element).object;
        }

        function uninstall(element) {
            if (!getState(element)) {
                return;
            }

            var object = getObject(element);

            if (!object) {
                return;
            }

            if (browserDetector.isIE(8)) {
                element.detachEvent("onresize", object.proxy);
            } else {
                element.removeChild(object);
            }

            if (getState(element).checkForObjectDocumentTimeoutId) {
                window.clearTimeout(getState(element).checkForObjectDocumentTimeoutId);
            }

            delete getState(element).object;
        }

        return {
            makeDetectable: makeDetectable,
            addListener: addListener,
            uninstall: uninstall
        };
    };

    /**
     * Resize detection strategy that injects divs to elements in order to detect resize events on scroll events.
     * Heavily inspired by: https://github.com/marcj/css-element-queries/blob/master/src/ResizeSensor.js
     */

    var forEach$1 = collectionUtils.forEach;

    var scroll = function(options) {
        options             = options || {};
        var reporter        = options.reporter;
        var batchProcessor  = options.batchProcessor;
        var getState        = options.stateHandler.getState;
        options.stateHandler.hasState;
        var idHandler       = options.idHandler;

        if (!batchProcessor) {
            throw new Error("Missing required dependency: batchProcessor");
        }

        if (!reporter) {
            throw new Error("Missing required dependency: reporter.");
        }

        //TODO: Could this perhaps be done at installation time?
        var scrollbarSizes = getScrollbarSizes();

        var styleId = "erd_scroll_detection_scrollbar_style";
        var detectionContainerClass = "erd_scroll_detection_container";

        function initDocument(targetDocument) {
            // Inject the scrollbar styling that prevents them from appearing sometimes in Chrome.
            // The injected container needs to have a class, so that it may be styled with CSS (pseudo elements).
            injectScrollStyle(targetDocument, styleId, detectionContainerClass);
        }

        initDocument(window.document);

        function buildCssTextString(rules) {
            var seperator = options.important ? " !important; " : "; ";

            return (rules.join(seperator) + seperator).trim();
        }

        function getScrollbarSizes() {
            var width = 500;
            var height = 500;

            var child = document.createElement("div");
            child.style.cssText = buildCssTextString(["position: absolute", "width: " + width*2 + "px", "height: " + height*2 + "px", "visibility: hidden", "margin: 0", "padding: 0"]);

            var container = document.createElement("div");
            container.style.cssText = buildCssTextString(["position: absolute", "width: " + width + "px", "height: " + height + "px", "overflow: scroll", "visibility: none", "top: " + -width*3 + "px", "left: " + -height*3 + "px", "visibility: hidden", "margin: 0", "padding: 0"]);

            container.appendChild(child);

            document.body.insertBefore(container, document.body.firstChild);

            var widthSize = width - container.clientWidth;
            var heightSize = height - container.clientHeight;

            document.body.removeChild(container);

            return {
                width: widthSize,
                height: heightSize
            };
        }

        function injectScrollStyle(targetDocument, styleId, containerClass) {
            function injectStyle(style, method) {
                method = method || function (element) {
                    targetDocument.head.appendChild(element);
                };

                var styleElement = targetDocument.createElement("style");
                styleElement.innerHTML = style;
                styleElement.id = styleId;
                method(styleElement);
                return styleElement;
            }

            if (!targetDocument.getElementById(styleId)) {
                var containerAnimationClass = containerClass + "_animation";
                var containerAnimationActiveClass = containerClass + "_animation_active";
                var style = "/* Created by the element-resize-detector library. */\n";
                style += "." + containerClass + " > div::-webkit-scrollbar { " + buildCssTextString(["display: none"]) + " }\n\n";
                style += "." + containerAnimationActiveClass + " { " + buildCssTextString(["-webkit-animation-duration: 0.1s", "animation-duration: 0.1s", "-webkit-animation-name: " + containerAnimationClass, "animation-name: " + containerAnimationClass]) + " }\n";
                style += "@-webkit-keyframes " + containerAnimationClass +  " { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }\n";
                style += "@keyframes " + containerAnimationClass +          " { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }";
                injectStyle(style);
            }
        }

        function addAnimationClass(element) {
            element.className += " " + detectionContainerClass + "_animation_active";
        }

        function addEvent(el, name, cb) {
            if (el.addEventListener) {
                el.addEventListener(name, cb);
            } else if(el.attachEvent) {
                el.attachEvent("on" + name, cb);
            } else {
                return reporter.error("[scroll] Don't know how to add event listeners.");
            }
        }

        function removeEvent(el, name, cb) {
            if (el.removeEventListener) {
                el.removeEventListener(name, cb);
            } else if(el.detachEvent) {
                el.detachEvent("on" + name, cb);
            } else {
                return reporter.error("[scroll] Don't know how to remove event listeners.");
            }
        }

        function getExpandElement(element) {
            return getState(element).container.childNodes[0].childNodes[0].childNodes[0];
        }

        function getShrinkElement(element) {
            return getState(element).container.childNodes[0].childNodes[0].childNodes[1];
        }

        /**
         * Adds a resize event listener to the element.
         * @public
         * @param {element} element The element that should have the listener added.
         * @param {function} listener The listener callback to be called for each resize event of the element. The element will be given as a parameter to the listener callback.
         */
        function addListener(element, listener) {
            var listeners = getState(element).listeners;

            if (!listeners.push) {
                throw new Error("Cannot add listener to an element that is not detectable.");
            }

            getState(element).listeners.push(listener);
        }

        /**
         * Makes an element detectable and ready to be listened for resize events. Will call the callback when the element is ready to be listened for resize changes.
         * @private
         * @param {object} options Optional options object.
         * @param {element} element The element to make detectable
         * @param {function} callback The callback to be called when the element is ready to be listened for resize changes. Will be called with the element as first parameter.
         */
        function makeDetectable(options, element, callback) {
            if (!callback) {
                callback = element;
                element = options;
                options = null;
            }

            options = options || {};

            function debug() {
                if (options.debug) {
                    var args = Array.prototype.slice.call(arguments);
                    args.unshift(idHandler.get(element), "Scroll: ");
                    if (reporter.log.apply) {
                        reporter.log.apply(null, args);
                    } else {
                        for (var i = 0; i < args.length; i++) {
                            reporter.log(args[i]);
                        }
                    }
                }
            }

            function isDetached(element) {
                function isInDocument(element) {
                    var isInShadowRoot = element.getRootNode && element.getRootNode().contains(element);
                    return element === element.ownerDocument.body || element.ownerDocument.body.contains(element) || isInShadowRoot;
                }

                if (!isInDocument(element)) {
                    return true;
                }

                // FireFox returns null style in hidden iframes. See https://github.com/wnr/element-resize-detector/issues/68 and https://bugzilla.mozilla.org/show_bug.cgi?id=795520
                if (window.getComputedStyle(element) === null) {
                    return true;
                }

                return false;
            }

            function isUnrendered(element) {
                // Check the absolute positioned container since the top level container is display: inline.
                var container = getState(element).container.childNodes[0];
                var style = window.getComputedStyle(container);
                return !style.width || style.width.indexOf("px") === -1; //Can only compute pixel value when rendered.
            }

            function getStyle() {
                // Some browsers only force layouts when actually reading the style properties of the style object, so make sure that they are all read here,
                // so that the user of the function can be sure that it will perform the layout here, instead of later (important for batching).
                var elementStyle            = window.getComputedStyle(element);
                var style                   = {};
                style.position              = elementStyle.position;
                style.width                 = element.offsetWidth;
                style.height                = element.offsetHeight;
                style.top                   = elementStyle.top;
                style.right                 = elementStyle.right;
                style.bottom                = elementStyle.bottom;
                style.left                  = elementStyle.left;
                style.widthCSS              = elementStyle.width;
                style.heightCSS             = elementStyle.height;
                return style;
            }

            function storeStartSize() {
                var style = getStyle();
                getState(element).startSize = {
                    width: style.width,
                    height: style.height
                };
                debug("Element start size", getState(element).startSize);
            }

            function initListeners() {
                getState(element).listeners = [];
            }

            function storeStyle() {
                debug("storeStyle invoked.");
                if (!getState(element)) {
                    debug("Aborting because element has been uninstalled");
                    return;
                }

                var style = getStyle();
                getState(element).style = style;
            }

            function storeCurrentSize(element, width, height) {
                getState(element).lastWidth = width;
                getState(element).lastHeight  = height;
            }

            function getExpandChildElement(element) {
                return getExpandElement(element).childNodes[0];
            }

            function getWidthOffset() {
                return 2 * scrollbarSizes.width + 1;
            }

            function getHeightOffset() {
                return 2 * scrollbarSizes.height + 1;
            }

            function getExpandWidth(width) {
                return width + 10 + getWidthOffset();
            }

            function getExpandHeight(height) {
                return height + 10 + getHeightOffset();
            }

            function getShrinkWidth(width) {
                return width * 2 + getWidthOffset();
            }

            function getShrinkHeight(height) {
                return height * 2 + getHeightOffset();
            }

            function positionScrollbars(element, width, height) {
                var expand          = getExpandElement(element);
                var shrink          = getShrinkElement(element);
                var expandWidth     = getExpandWidth(width);
                var expandHeight    = getExpandHeight(height);
                var shrinkWidth     = getShrinkWidth(width);
                var shrinkHeight    = getShrinkHeight(height);
                expand.scrollLeft   = expandWidth;
                expand.scrollTop    = expandHeight;
                shrink.scrollLeft   = shrinkWidth;
                shrink.scrollTop    = shrinkHeight;
            }

            function injectContainerElement() {
                var container = getState(element).container;

                if (!container) {
                    container                   = document.createElement("div");
                    container.className         = detectionContainerClass;
                    container.style.cssText     = buildCssTextString(["visibility: hidden", "display: inline", "width: 0px", "height: 0px", "z-index: -1", "overflow: hidden", "margin: 0", "padding: 0"]);
                    getState(element).container = container;
                    addAnimationClass(container);
                    element.appendChild(container);

                    var onAnimationStart = function () {
                        getState(element).onRendered && getState(element).onRendered();
                    };

                    addEvent(container, "animationstart", onAnimationStart);

                    // Store the event handler here so that they may be removed when uninstall is called.
                    // See uninstall function for an explanation why it is needed.
                    getState(element).onAnimationStart = onAnimationStart;
                }

                return container;
            }

            function injectScrollElements() {
                function alterPositionStyles() {
                    var style = getState(element).style;

                    if(style.position === "static") {
                        element.style.setProperty("position", "relative",options.important ? "important" : "");

                        var removeRelativeStyles = function(reporter, element, style, property) {
                            function getNumericalValue(value) {
                                return value.replace(/[^-\d\.]/g, "");
                            }

                            var value = style[property];

                            if(value !== "auto" && getNumericalValue(value) !== "0") {
                                reporter.warn("An element that is positioned static has style." + property + "=" + value + " which is ignored due to the static positioning. The element will need to be positioned relative, so the style." + property + " will be set to 0. Element: ", element);
                                element.style[property] = 0;
                            }
                        };

                        //Check so that there are no accidental styles that will make the element styled differently now that is is relative.
                        //If there are any, set them to 0 (this should be okay with the user since the style properties did nothing before [since the element was positioned static] anyway).
                        removeRelativeStyles(reporter, element, style, "top");
                        removeRelativeStyles(reporter, element, style, "right");
                        removeRelativeStyles(reporter, element, style, "bottom");
                        removeRelativeStyles(reporter, element, style, "left");
                    }
                }

                function getLeftTopBottomRightCssText(left, top, bottom, right) {
                    left = (!left ? "0" : (left + "px"));
                    top = (!top ? "0" : (top + "px"));
                    bottom = (!bottom ? "0" : (bottom + "px"));
                    right = (!right ? "0" : (right + "px"));

                    return ["left: " + left, "top: " + top, "right: " + right, "bottom: " + bottom];
                }

                debug("Injecting elements");

                if (!getState(element)) {
                    debug("Aborting because element has been uninstalled");
                    return;
                }

                alterPositionStyles();

                var rootContainer = getState(element).container;

                if (!rootContainer) {
                    rootContainer = injectContainerElement();
                }

                // Due to this WebKit bug https://bugs.webkit.org/show_bug.cgi?id=80808 (currently fixed in Blink, but still present in WebKit browsers such as Safari),
                // we need to inject two containers, one that is width/height 100% and another that is left/top -1px so that the final container always is 1x1 pixels bigger than
                // the targeted element.
                // When the bug is resolved, "containerContainer" may be removed.

                // The outer container can occasionally be less wide than the targeted when inside inline elements element in WebKit (see https://bugs.webkit.org/show_bug.cgi?id=152980).
                // This should be no problem since the inner container either way makes sure the injected scroll elements are at least 1x1 px.

                var scrollbarWidth          = scrollbarSizes.width;
                var scrollbarHeight         = scrollbarSizes.height;
                var containerContainerStyle = buildCssTextString(["position: absolute", "flex: none", "overflow: hidden", "z-index: -1", "visibility: hidden", "width: 100%", "height: 100%", "left: 0px", "top: 0px"]);
                var containerStyle          = buildCssTextString(["position: absolute", "flex: none", "overflow: hidden", "z-index: -1", "visibility: hidden"].concat(getLeftTopBottomRightCssText(-(1 + scrollbarWidth), -(1 + scrollbarHeight), -scrollbarHeight, -scrollbarWidth)));
                var expandStyle             = buildCssTextString(["position: absolute", "flex: none", "overflow: scroll", "z-index: -1", "visibility: hidden", "width: 100%", "height: 100%"]);
                var shrinkStyle             = buildCssTextString(["position: absolute", "flex: none", "overflow: scroll", "z-index: -1", "visibility: hidden", "width: 100%", "height: 100%"]);
                var expandChildStyle        = buildCssTextString(["position: absolute", "left: 0", "top: 0"]);
                var shrinkChildStyle        = buildCssTextString(["position: absolute", "width: 200%", "height: 200%"]);

                var containerContainer      = document.createElement("div");
                var container               = document.createElement("div");
                var expand                  = document.createElement("div");
                var expandChild             = document.createElement("div");
                var shrink                  = document.createElement("div");
                var shrinkChild             = document.createElement("div");

                // Some browsers choke on the resize system being rtl, so force it to ltr. https://github.com/wnr/element-resize-detector/issues/56
                // However, dir should not be set on the top level container as it alters the dimensions of the target element in some browsers.
                containerContainer.dir              = "ltr";

                containerContainer.style.cssText    = containerContainerStyle;
                containerContainer.className        = detectionContainerClass;
                container.className                 = detectionContainerClass;
                container.style.cssText             = containerStyle;
                expand.style.cssText                = expandStyle;
                expandChild.style.cssText           = expandChildStyle;
                shrink.style.cssText                = shrinkStyle;
                shrinkChild.style.cssText           = shrinkChildStyle;

                expand.appendChild(expandChild);
                shrink.appendChild(shrinkChild);
                container.appendChild(expand);
                container.appendChild(shrink);
                containerContainer.appendChild(container);
                rootContainer.appendChild(containerContainer);

                function onExpandScroll() {
                    getState(element).onExpand && getState(element).onExpand();
                }

                function onShrinkScroll() {
                    getState(element).onShrink && getState(element).onShrink();
                }

                addEvent(expand, "scroll", onExpandScroll);
                addEvent(shrink, "scroll", onShrinkScroll);

                // Store the event handlers here so that they may be removed when uninstall is called.
                // See uninstall function for an explanation why it is needed.
                getState(element).onExpandScroll = onExpandScroll;
                getState(element).onShrinkScroll = onShrinkScroll;
            }

            function registerListenersAndPositionElements() {
                function updateChildSizes(element, width, height) {
                    var expandChild             = getExpandChildElement(element);
                    var expandWidth             = getExpandWidth(width);
                    var expandHeight            = getExpandHeight(height);
                    expandChild.style.setProperty("width", expandWidth + "px", options.important ? "important" : "");
                    expandChild.style.setProperty("height", expandHeight + "px", options.important ? "important" : "");
                }

                function updateDetectorElements(done) {
                    var width           = element.offsetWidth;
                    var height          = element.offsetHeight;

                    // Check whether the size has actually changed since last time the algorithm ran. If not, some steps may be skipped.
                    var sizeChanged = width !== getState(element).lastWidth || height !== getState(element).lastHeight;

                    debug("Storing current size", width, height);

                    // Store the size of the element sync here, so that multiple scroll events may be ignored in the event listeners.
                    // Otherwise the if-check in handleScroll is useless.
                    storeCurrentSize(element, width, height);

                    // Since we delay the processing of the batch, there is a risk that uninstall has been called before the batch gets to execute.
                    // Since there is no way to cancel the fn executions, we need to add an uninstall guard to all fns of the batch.

                    batchProcessor.add(0, function performUpdateChildSizes() {
                        if (!sizeChanged) {
                            return;
                        }

                        if (!getState(element)) {
                            debug("Aborting because element has been uninstalled");
                            return;
                        }

                        if (!areElementsInjected()) {
                            debug("Aborting because element container has not been initialized");
                            return;
                        }

                        if (options.debug) {
                            var w = element.offsetWidth;
                            var h = element.offsetHeight;

                            if (w !== width || h !== height) {
                                reporter.warn(idHandler.get(element), "Scroll: Size changed before updating detector elements.");
                            }
                        }

                        updateChildSizes(element, width, height);
                    });

                    batchProcessor.add(1, function updateScrollbars() {
                        // This function needs to be invoked event though the size is unchanged. The element could have been resized very quickly and then
                        // been restored to the original size, which will have changed the scrollbar positions.

                        if (!getState(element)) {
                            debug("Aborting because element has been uninstalled");
                            return;
                        }

                        if (!areElementsInjected()) {
                            debug("Aborting because element container has not been initialized");
                            return;
                        }

                        positionScrollbars(element, width, height);
                    });

                    if (sizeChanged && done) {
                        batchProcessor.add(2, function () {
                            if (!getState(element)) {
                                debug("Aborting because element has been uninstalled");
                                return;
                            }

                            if (!areElementsInjected()) {
                              debug("Aborting because element container has not been initialized");
                              return;
                            }

                            done();
                        });
                    }
                }

                function areElementsInjected() {
                    return !!getState(element).container;
                }

                function notifyListenersIfNeeded() {
                    function isFirstNotify() {
                        return getState(element).lastNotifiedWidth === undefined;
                    }

                    debug("notifyListenersIfNeeded invoked");

                    var state = getState(element);

                    // Don't notify if the current size is the start size, and this is the first notification.
                    if (isFirstNotify() && state.lastWidth === state.startSize.width && state.lastHeight === state.startSize.height) {
                        return debug("Not notifying: Size is the same as the start size, and there has been no notification yet.");
                    }

                    // Don't notify if the size already has been notified.
                    if (state.lastWidth === state.lastNotifiedWidth && state.lastHeight === state.lastNotifiedHeight) {
                        return debug("Not notifying: Size already notified");
                    }


                    debug("Current size not notified, notifying...");
                    state.lastNotifiedWidth = state.lastWidth;
                    state.lastNotifiedHeight = state.lastHeight;
                    forEach$1(getState(element).listeners, function (listener) {
                        listener(element);
                    });
                }

                function handleRender() {
                    debug("startanimation triggered.");

                    if (isUnrendered(element)) {
                        debug("Ignoring since element is still unrendered...");
                        return;
                    }

                    debug("Element rendered.");
                    var expand = getExpandElement(element);
                    var shrink = getShrinkElement(element);
                    if (expand.scrollLeft === 0 || expand.scrollTop === 0 || shrink.scrollLeft === 0 || shrink.scrollTop === 0) {
                        debug("Scrollbars out of sync. Updating detector elements...");
                        updateDetectorElements(notifyListenersIfNeeded);
                    }
                }

                function handleScroll() {
                    debug("Scroll detected.");

                    if (isUnrendered(element)) {
                        // Element is still unrendered. Skip this scroll event.
                        debug("Scroll event fired while unrendered. Ignoring...");
                        return;
                    }

                    updateDetectorElements(notifyListenersIfNeeded);
                }

                debug("registerListenersAndPositionElements invoked.");

                if (!getState(element)) {
                    debug("Aborting because element has been uninstalled");
                    return;
                }

                getState(element).onRendered = handleRender;
                getState(element).onExpand = handleScroll;
                getState(element).onShrink = handleScroll;

                var style = getState(element).style;
                updateChildSizes(element, style.width, style.height);
            }

            function finalizeDomMutation() {
                debug("finalizeDomMutation invoked.");

                if (!getState(element)) {
                    debug("Aborting because element has been uninstalled");
                    return;
                }

                var style = getState(element).style;
                storeCurrentSize(element, style.width, style.height);
                positionScrollbars(element, style.width, style.height);
            }

            function ready() {
                callback(element);
            }

            function install() {
                debug("Installing...");
                initListeners();
                storeStartSize();

                batchProcessor.add(0, storeStyle);
                batchProcessor.add(1, injectScrollElements);
                batchProcessor.add(2, registerListenersAndPositionElements);
                batchProcessor.add(3, finalizeDomMutation);
                batchProcessor.add(4, ready);
            }

            debug("Making detectable...");

            if (isDetached(element)) {
                debug("Element is detached");

                injectContainerElement();

                debug("Waiting until element is attached...");

                getState(element).onRendered = function () {
                    debug("Element is now attached");
                    install();
                };
            } else {
                install();
            }
        }

        function uninstall(element) {
            var state = getState(element);

            if (!state) {
                // Uninstall has been called on a non-erd element.
                return;
            }

            // Uninstall may have been called in the following scenarios:
            // (1) Right between the sync code and async batch (here state.busy = true, but nothing have been registered or injected).
            // (2) In the ready callback of the last level of the batch by another element (here, state.busy = true, but all the stuff has been injected).
            // (3) After the installation process (here, state.busy = false and all the stuff has been injected).
            // So to be on the safe side, let's check for each thing before removing.

            // We need to remove the event listeners, because otherwise the event might fire on an uninstall element which results in an error when trying to get the state of the element.
            state.onExpandScroll && removeEvent(getExpandElement(element), "scroll", state.onExpandScroll);
            state.onShrinkScroll && removeEvent(getShrinkElement(element), "scroll", state.onShrinkScroll);
            state.onAnimationStart && removeEvent(state.container, "animationstart", state.onAnimationStart);

            state.container && element.removeChild(state.container);
        }

        return {
            makeDetectable: makeDetectable,
            addListener: addListener,
            uninstall: uninstall,
            initDocument: initDocument
        };
    };

    var forEach                 = collectionUtils.forEach;









    //Detection strategies.



    function isCollection(obj) {
        return Array.isArray(obj) || obj.length !== undefined;
    }

    function toArray(collection) {
        if (!Array.isArray(collection)) {
            var array = [];
            forEach(collection, function (obj) {
                array.push(obj);
            });
            return array;
        } else {
            return collection;
        }
    }

    function isElement(obj) {
        return obj && obj.nodeType === 1;
    }

    /**
     * @typedef idHandler
     * @type {object}
     * @property {function} get Gets the resize detector id of the element.
     * @property {function} set Generate and sets the resize detector id of the element.
     */

    /**
     * @typedef Options
     * @type {object}
     * @property {boolean} callOnAdd    Determines if listeners should be called when they are getting added.
                                        Default is true. If true, the listener is guaranteed to be called when it has been added.
                                        If false, the listener will not be guarenteed to be called when it has been added (does not prevent it from being called).
     * @property {idHandler} idHandler  A custom id handler that is responsible for generating, setting and retrieving id's for elements.
                                        If not provided, a default id handler will be used.
     * @property {reporter} reporter    A custom reporter that handles reporting logs, warnings and errors.
                                        If not provided, a default id handler will be used.
                                        If set to false, then nothing will be reported.
     * @property {boolean} debug        If set to true, the the system will report debug messages as default for the listenTo method.
     */

    /**
     * Creates an element resize detector instance.
     * @public
     * @param {Options?} options Optional global options object that will decide how this instance will work.
     */
    var elementResizeDetector = function(options) {
        options = options || {};

        //idHandler is currently not an option to the listenTo function, so it should not be added to globalOptions.
        var idHandler$1;

        if (options.idHandler) {
            // To maintain compatability with idHandler.get(element, readonly), make sure to wrap the given idHandler
            // so that readonly flag always is true when it's used here. This may be removed next major version bump.
            idHandler$1 = {
                get: function (element) { return options.idHandler.get(element, true); },
                set: options.idHandler.set
            };
        } else {
            var idGenerator$1 = idGenerator();
            var defaultIdHandler = idHandler({
                idGenerator: idGenerator$1,
                stateHandler: stateHandler
            });
            idHandler$1 = defaultIdHandler;
        }

        //reporter is currently not an option to the listenTo function, so it should not be added to globalOptions.
        var reporter$1 = options.reporter;

        if(!reporter$1) {
            //If options.reporter is false, then the reporter should be quiet.
            var quiet = reporter$1 === false;
            reporter$1 = reporter(quiet);
        }

        //batchProcessor is currently not an option to the listenTo function, so it should not be added to globalOptions.
        var batchProcessor$1 = getOption(options, "batchProcessor", batchProcessor({ reporter: reporter$1 }));

        //Options to be used as default for the listenTo function.
        var globalOptions = {};
        globalOptions.callOnAdd     = !!getOption(options, "callOnAdd", true);
        globalOptions.debug         = !!getOption(options, "debug", false);

        var eventListenerHandler    = listenerHandler(idHandler$1);
        var elementUtils$1            = elementUtils({
            stateHandler: stateHandler
        });

        //The detection strategy to be used.
        var detectionStrategy;
        var desiredStrategy = getOption(options, "strategy", "object");
        var importantCssRules = getOption(options, "important", false);
        var strategyOptions = {
            reporter: reporter$1,
            batchProcessor: batchProcessor$1,
            stateHandler: stateHandler,
            idHandler: idHandler$1,
            important: importantCssRules
        };

        if(desiredStrategy === "scroll") {
            if (browserDetector.isLegacyOpera()) {
                reporter$1.warn("Scroll strategy is not supported on legacy Opera. Changing to object strategy.");
                desiredStrategy = "object";
            } else if (browserDetector.isIE(9)) {
                reporter$1.warn("Scroll strategy is not supported on IE9. Changing to object strategy.");
                desiredStrategy = "object";
            }
        }

        if(desiredStrategy === "scroll") {
            detectionStrategy = scroll(strategyOptions);
        } else if(desiredStrategy === "object") {
            detectionStrategy = object(strategyOptions);
        } else {
            throw new Error("Invalid strategy name: " + desiredStrategy);
        }

        //Calls can be made to listenTo with elements that are still being installed.
        //Also, same elements can occur in the elements list in the listenTo function.
        //With this map, the ready callbacks can be synchronized between the calls
        //so that the ready callback can always be called when an element is ready - even if
        //it wasn't installed from the function itself.
        var onReadyCallbacks = {};

        /**
         * Makes the given elements resize-detectable and starts listening to resize events on the elements. Calls the event callback for each event for each element.
         * @public
         * @param {Options?} options Optional options object. These options will override the global options. Some options may not be overriden, such as idHandler.
         * @param {element[]|element} elements The given array of elements to detect resize events of. Single element is also valid.
         * @param {function} listener The callback to be executed for each resize event for each element.
         */
        function listenTo(options, elements, listener) {
            function onResizeCallback(element) {
                var listeners = eventListenerHandler.get(element);
                forEach(listeners, function callListenerProxy(listener) {
                    listener(element);
                });
            }

            function addListener(callOnAdd, element, listener) {
                eventListenerHandler.add(element, listener);

                if(callOnAdd) {
                    listener(element);
                }
            }

            //Options object may be omitted.
            if(!listener) {
                listener = elements;
                elements = options;
                options = {};
            }

            if(!elements) {
                throw new Error("At least one element required.");
            }

            if(!listener) {
                throw new Error("Listener required.");
            }

            if (isElement(elements)) {
                // A single element has been passed in.
                elements = [elements];
            } else if (isCollection(elements)) {
                // Convert collection to array for plugins.
                // TODO: May want to check so that all the elements in the collection are valid elements.
                elements = toArray(elements);
            } else {
                return reporter$1.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");
            }

            var elementsReady = 0;

            var callOnAdd = getOption(options, "callOnAdd", globalOptions.callOnAdd);
            var onReadyCallback = getOption(options, "onReady", function noop() {});
            var debug = getOption(options, "debug", globalOptions.debug);

            forEach(elements, function attachListenerToElement(element) {
                if (!stateHandler.getState(element)) {
                    stateHandler.initState(element);
                    idHandler$1.set(element);
                }

                var id = idHandler$1.get(element);

                debug && reporter$1.log("Attaching listener to element", id, element);

                if(!elementUtils$1.isDetectable(element)) {
                    debug && reporter$1.log(id, "Not detectable.");
                    if(elementUtils$1.isBusy(element)) {
                        debug && reporter$1.log(id, "System busy making it detectable");

                        //The element is being prepared to be detectable. Do not make it detectable.
                        //Just add the listener, because the element will soon be detectable.
                        addListener(callOnAdd, element, listener);
                        onReadyCallbacks[id] = onReadyCallbacks[id] || [];
                        onReadyCallbacks[id].push(function onReady() {
                            elementsReady++;

                            if(elementsReady === elements.length) {
                                onReadyCallback();
                            }
                        });
                        return;
                    }

                    debug && reporter$1.log(id, "Making detectable...");
                    //The element is not prepared to be detectable, so do prepare it and add a listener to it.
                    elementUtils$1.markBusy(element, true);
                    return detectionStrategy.makeDetectable({ debug: debug, important: importantCssRules }, element, function onElementDetectable(element) {
                        debug && reporter$1.log(id, "onElementDetectable");

                        if (stateHandler.getState(element)) {
                            elementUtils$1.markAsDetectable(element);
                            elementUtils$1.markBusy(element, false);
                            detectionStrategy.addListener(element, onResizeCallback);
                            addListener(callOnAdd, element, listener);

                            // Since the element size might have changed since the call to "listenTo", we need to check for this change,
                            // so that a resize event may be emitted.
                            // Having the startSize object is optional (since it does not make sense in some cases such as unrendered elements), so check for its existance before.
                            // Also, check the state existance before since the element may have been uninstalled in the installation process.
                            var state = stateHandler.getState(element);
                            if (state && state.startSize) {
                                var width = element.offsetWidth;
                                var height = element.offsetHeight;
                                if (state.startSize.width !== width || state.startSize.height !== height) {
                                    onResizeCallback(element);
                                }
                            }

                            if(onReadyCallbacks[id]) {
                                forEach(onReadyCallbacks[id], function(callback) {
                                    callback();
                                });
                            }
                        } else {
                            // The element has been unisntalled before being detectable.
                            debug && reporter$1.log(id, "Element uninstalled before being detectable.");
                        }

                        delete onReadyCallbacks[id];

                        elementsReady++;
                        if(elementsReady === elements.length) {
                            onReadyCallback();
                        }
                    });
                }

                debug && reporter$1.log(id, "Already detecable, adding listener.");

                //The element has been prepared to be detectable and is ready to be listened to.
                addListener(callOnAdd, element, listener);
                elementsReady++;
            });

            if(elementsReady === elements.length) {
                onReadyCallback();
            }
        }

        function uninstall(elements) {
            if(!elements) {
                return reporter$1.error("At least one element is required.");
            }

            if (isElement(elements)) {
                // A single element has been passed in.
                elements = [elements];
            } else if (isCollection(elements)) {
                // Convert collection to array for plugins.
                // TODO: May want to check so that all the elements in the collection are valid elements.
                elements = toArray(elements);
            } else {
                return reporter$1.error("Invalid arguments. Must be a DOM element or a collection of DOM elements.");
            }

            forEach(elements, function (element) {
                eventListenerHandler.removeAllListeners(element);
                detectionStrategy.uninstall(element);
                stateHandler.cleanState(element);
            });
        }

        function initDocument(targetDocument) {
            detectionStrategy.initDocument && detectionStrategy.initDocument(targetDocument);
        }

        return {
            listenTo: listenTo,
            removeListener: eventListenerHandler.removeListener,
            removeAllListeners: eventListenerHandler.removeAllListeners,
            uninstall: uninstall,
            initDocument: initDocument
        };
    };

    function getOption(options, name, defaultValue) {
        var value = options[name];

        if((value === undefined || value === null) && defaultValue !== undefined) {
            return defaultValue;
        }

        return value;
    }

    var erd = elementResizeDetector({ strategy: "scroll" });
    function watchResize(element, handler) {
        erd.listenTo(element, handler);
        var currentHandler = handler;
        return {
            update: function (newHandler) {
                erd.removeListener(element, currentHandler);
                erd.listenTo(element, newHandler);
                currentHandler = newHandler;
            },
            destroy: function () {
                erd.removeListener(element, currentHandler);
            },
        };
    }

    /* src\editor\plasmid\Plasmid.svelte generated by Svelte v3.40.3 */

    const { Object: Object_1$2, console: console_1$2 } = globals;
    const file$8 = "src\\editor\\plasmid\\Plasmid.svelte";

    // (412:2) {#if editorinfo.split_window == false}
    function create_if_block_4$1(ctx) {
    	let div8;
    	let div6;
    	let div0;
    	let svg0;
    	let path0;
    	let t0;
    	let div1;
    	let svg1;
    	let path1;
    	let t1;
    	let div2;
    	let svg2;
    	let path2;
    	let t2;
    	let div3;
    	let svg3;
    	let path3;
    	let t3;
    	let div4;
    	let svg4;
    	let path4;
    	let t4;
    	let div5;
    	let svg5;
    	let path5;
    	let t5;
    	let div7;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div8 = element("div");
    			div6 = element("div");
    			div0 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t0 = space();
    			div1 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t1 = space();
    			div2 = element("div");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t2 = space();
    			div3 = element("div");
    			svg3 = svg_element("svg");
    			path3 = svg_element("path");
    			t3 = space();
    			div4 = element("div");
    			svg4 = svg_element("svg");
    			path4 = svg_element("path");
    			t4 = space();
    			div5 = element("div");
    			svg5 = svg_element("svg");
    			path5 = svg_element("path");
    			t5 = space();
    			div7 = element("div");
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "stroke-width", "2");
    			attr_dev(path0, "d", "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3");
    			add_location(path0, file$8, 417, 8, 10276);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "class", "h-6 w-6");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke", "currentColor");
    			add_location(svg0, file$8, 416, 8, 10156);
    			attr_dev(div0, "class", "icon svelte-f994t");
    			add_location(div0, file$8, 415, 6, 10104);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "stroke-width", "2");
    			attr_dev(path1, "d", "M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z");
    			add_location(path1, file$8, 423, 8, 10719);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "class", "h-6 w-6");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke", "currentColor");
    			add_location(svg1, file$8, 422, 7, 10599);
    			attr_dev(div1, "class", "icon svelte-f994t");
    			add_location(div1, file$8, 421, 6, 10549);
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "stroke-width", "2");
    			attr_dev(path2, "d", "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16");
    			add_location(path2, file$8, 429, 10, 11177);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "class", "h-6 w-6");
    			attr_dev(svg2, "fill", "none");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			attr_dev(svg2, "stroke", "currentColor");
    			add_location(svg2, file$8, 428, 8, 11055);
    			attr_dev(div2, "class", "icon svelte-f994t");
    			add_location(div2, file$8, 427, 6, 11001);
    			attr_dev(path3, "stroke-linecap", "round");
    			attr_dev(path3, "stroke-linejoin", "round");
    			attr_dev(path3, "stroke-width", "2");
    			attr_dev(path3, "d", "M12 4v16m8-8H4");
    			add_location(path3, file$8, 435, 8, 11586);
    			attr_dev(svg3, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg3, "class", "h-6 w-6");
    			attr_dev(svg3, "fill", "none");
    			attr_dev(svg3, "viewBox", "0 0 24 24");
    			attr_dev(svg3, "stroke", "currentColor");
    			add_location(svg3, file$8, 434, 8, 11466);
    			attr_dev(div3, "class", "icon svelte-f994t");
    			add_location(div3, file$8, 433, 6, 11416);
    			attr_dev(path4, "stroke-linecap", "round");
    			attr_dev(path4, "stroke-linejoin", "round");
    			attr_dev(path4, "stroke-width", "2");
    			attr_dev(path4, "d", "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z");
    			add_location(path4, file$8, 441, 8, 11891);
    			attr_dev(svg4, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg4, "class", "h-6 w-6");
    			attr_dev(svg4, "fill", "none");
    			attr_dev(svg4, "viewBox", "0 0 24 24");
    			attr_dev(svg4, "stroke", "currentColor");
    			add_location(svg4, file$8, 440, 8, 11771);
    			attr_dev(div4, "class", "icon svelte-f994t");
    			add_location(div4, file$8, 439, 6, 11717);
    			attr_dev(path5, "stroke-linecap", "round");
    			attr_dev(path5, "stroke-linejoin", "round");
    			attr_dev(path5, "stroke-width", "2");
    			attr_dev(path5, "d", "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z");
    			add_location(path5, file$8, 447, 10, 12274);
    			attr_dev(svg5, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg5, "class", "h-6 w-6");
    			attr_dev(svg5, "fill", "none");
    			attr_dev(svg5, "viewBox", "0 0 24 24");
    			attr_dev(svg5, "stroke", "currentColor");
    			add_location(svg5, file$8, 446, 8, 12152);
    			attr_dev(div5, "class", "icon svelte-f994t");
    			add_location(div5, file$8, 445, 6, 12104);
    			attr_dev(div6, "class", "tooltip svelte-f994t");
    			add_location(div6, file$8, 413, 4, 10067);
    			attr_dev(div7, "id", "sequencemap");
    			attr_dev(div7, "class", "second-canvas canvtracker svelte-f994t");
    			add_location(div7, file$8, 452, 4, 12444);
    			attr_dev(div8, "class", "right-side svelte-f994t");
    			add_location(div8, file$8, 412, 2, 10037);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div8, anchor);
    			append_dev(div8, div6);
    			append_dev(div6, div0);
    			append_dev(div0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div6, t0);
    			append_dev(div6, div1);
    			append_dev(div1, svg1);
    			append_dev(svg1, path1);
    			append_dev(div6, t1);
    			append_dev(div6, div2);
    			append_dev(div2, svg2);
    			append_dev(svg2, path2);
    			append_dev(div6, t2);
    			append_dev(div6, div3);
    			append_dev(div3, svg3);
    			append_dev(svg3, path3);
    			append_dev(div6, t3);
    			append_dev(div6, div4);
    			append_dev(div4, svg4);
    			append_dev(svg4, path4);
    			append_dev(div6, t4);
    			append_dev(div6, div5);
    			append_dev(div5, svg5);
    			append_dev(svg5, path5);
    			append_dev(div8, t5);
    			append_dev(div8, div7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*copySequence*/ ctx[10], false, false, false),
    					listen_dev(div1, "click", /*cutSequence*/ ctx[11], false, false, false),
    					listen_dev(div2, "click", /*deleteSequence*/ ctx[12], false, false, false),
    					listen_dev(div3, "click", /*showInsert*/ ctx[13], false, false, false),
    					listen_dev(div4, "click", /*showNewFeature*/ ctx[14], false, false, false),
    					listen_dev(div5, "click", /*showGoto*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div8);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(412:2) {#if editorinfo.split_window == false}",
    		ctx
    	});

    	return block;
    }

    // (457:2) {#if editorinfo.show_replace == true}
    function create_if_block_3$2(ctx) {
    	let div2;
    	let div1;
    	let h1;
    	let t1;
    	let input;
    	let t2;
    	let div0;
    	let button0;
    	let t4;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Replace";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "Cancel";
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "Done";
    			attr_dev(h1, "class", "svelte-f994t");
    			add_location(h1, file$8, 459, 6, 12632);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Type any codon or sequence here...");
    			attr_dev(input, "class", "svelte-f994t");
    			add_location(input, file$8, 460, 6, 12656);
    			attr_dev(button0, "class", "cancel svelte-f994t");
    			add_location(button0, file$8, 462, 6, 12788);
    			attr_dev(button1, "class", "ok svelte-f994t");
    			add_location(button1, file$8, 463, 6, 12857);
    			attr_dev(div0, "class", "buttons");
    			add_location(div0, file$8, 461, 6, 12759);
    			attr_dev(div1, "class", "replace svelte-f994t");
    			add_location(div1, file$8, 458, 4, 12603);
    			attr_dev(div2, "class", "whitebg svelte-f994t");
    			add_location(div2, file$8, 457, 2, 12572);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, input);
    			set_input_value(input, /*replace_input*/ ctx[8]);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t4);
    			append_dev(div0, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[24]),
    					listen_dev(button0, "click", /*stopReplace*/ ctx[20], false, false, false),
    					listen_dev(button1, "click", /*handleReplace*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*replace_input*/ 256 && input.value !== /*replace_input*/ ctx[8]) {
    				set_input_value(input, /*replace_input*/ ctx[8]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(457:2) {#if editorinfo.show_replace == true}",
    		ctx
    	});

    	return block;
    }

    // (471:2) {#if editorinfo.show_new_feature == true}
    function create_if_block_2$3(ctx) {
    	let div2;
    	let div1;
    	let h1;
    	let t1;
    	let input;
    	let t2;
    	let div0;
    	let button0;
    	let t4;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Name feature";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "Cancel";
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "Done";
    			attr_dev(h1, "class", "svelte-f994t");
    			add_location(h1, file$8, 473, 6, 13072);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Type a name...");
    			attr_dev(input, "class", "svelte-f994t");
    			add_location(input, file$8, 474, 6, 13101);
    			attr_dev(button0, "class", "cancel svelte-f994t");
    			add_location(button0, file$8, 476, 6, 13213);
    			attr_dev(button1, "class", "ok svelte-f994t");
    			add_location(button1, file$8, 477, 6, 13285);
    			attr_dev(div0, "class", "buttons");
    			add_location(div0, file$8, 475, 6, 13184);
    			attr_dev(div1, "class", "replace svelte-f994t");
    			add_location(div1, file$8, 472, 4, 13043);
    			attr_dev(div2, "class", "whitebg svelte-f994t");
    			add_location(div2, file$8, 471, 2, 13012);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, input);
    			set_input_value(input, /*feature_input*/ ctx[6]);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t4);
    			append_dev(div0, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler_1*/ ctx[25]),
    					listen_dev(button0, "click", /*stopNewFeature*/ ctx[15], false, false, false),
    					listen_dev(button1, "click", /*handleNewFeature*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*feature_input*/ 64 && input.value !== /*feature_input*/ ctx[6]) {
    				set_input_value(input, /*feature_input*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(471:2) {#if editorinfo.show_new_feature == true}",
    		ctx
    	});

    	return block;
    }

    // (485:2) {#if editorinfo.show_goto == true}
    function create_if_block_1$4(ctx) {
    	let div2;
    	let div1;
    	let h1;
    	let t1;
    	let input;
    	let t2;
    	let div0;
    	let button0;
    	let t4;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Go to";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "Cancel";
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "Go";
    			attr_dev(h1, "class", "svelte-f994t");
    			add_location(h1, file$8, 487, 6, 13496);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Where do you want to go?");
    			attr_dev(input, "class", "svelte-f994t");
    			add_location(input, file$8, 488, 6, 13518);
    			attr_dev(button0, "class", "cancel svelte-f994t");
    			add_location(button0, file$8, 490, 6, 13621);
    			attr_dev(button1, "class", "ok svelte-f994t");
    			add_location(button1, file$8, 491, 6, 13687);
    			add_location(div0, file$8, 489, 6, 13608);
    			attr_dev(div1, "class", "replace svelte-f994t");
    			add_location(div1, file$8, 486, 4, 13467);
    			attr_dev(div2, "class", "whitebg svelte-f994t");
    			add_location(div2, file$8, 485, 2, 13436);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, input);
    			set_input_value(input, /*goto_input*/ ctx[7]);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t4);
    			append_dev(div0, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler_2*/ ctx[26]),
    					listen_dev(button0, "click", /*stopGoto*/ ctx[18], false, false, false),
    					listen_dev(button1, "click", /*handleGoto*/ ctx[19], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*goto_input*/ 128 && input.value !== /*goto_input*/ ctx[7]) {
    				set_input_value(input, /*goto_input*/ ctx[7]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(485:2) {#if editorinfo.show_goto == true}",
    		ctx
    	});

    	return block;
    }

    // (498:2) {#if editorinfo.show_insert == true}
    function create_if_block$5(ctx) {
    	let insert_1;
    	let current;
    	insert_1 = new Insert({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(insert_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(insert_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(insert_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(insert_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(insert_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(498:2) {#if editorinfo.show_insert == true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let main;
    	let div;
    	let div_resize_listener;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let textarea_1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*editorinfo*/ ctx[0].split_window == false && create_if_block_4$1(ctx);
    	let if_block1 = /*editorinfo*/ ctx[0].show_replace == true && create_if_block_3$2(ctx);
    	let if_block2 = /*editorinfo*/ ctx[0].show_new_feature == true && create_if_block_2$3(ctx);
    	let if_block3 = /*editorinfo*/ ctx[0].show_goto == true && create_if_block_1$4(ctx);
    	let if_block4 = /*editorinfo*/ ctx[0].show_insert == true && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			if (if_block3) if_block3.c();
    			t4 = space();
    			if (if_block4) if_block4.c();
    			t5 = space();
    			textarea_1 = element("textarea");
    			attr_dev(div, "id", "circularmap");
    			attr_dev(div, "class", "main-canvas canvtracker svelte-f994t");
    			add_render_callback(() => /*div_elementresize_handler*/ ctx[23].call(div));
    			add_location(div, file$8, 410, 2, 9856);
    			attr_dev(textarea_1, "class", "copyarea svelte-f994t");
    			add_location(textarea_1, file$8, 502, 2, 13858);
    			attr_dev(main, "class", "svelte-f994t");
    			add_location(main, file$8, 409, 0, 9829);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			div_resize_listener = add_resize_listener(div, /*div_elementresize_handler*/ ctx[23].bind(div));
    			append_dev(main, t0);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t1);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t2);
    			if (if_block2) if_block2.m(main, null);
    			append_dev(main, t3);
    			if (if_block3) if_block3.m(main, null);
    			append_dev(main, t4);
    			if (if_block4) if_block4.m(main, null);
    			append_dev(main, t5);
    			append_dev(main, textarea_1);
    			set_input_value(textarea_1, /*copyval*/ ctx[3]);
    			/*textarea_1_binding*/ ctx[28](textarea_1);
    			/*main_binding*/ ctx[29](main);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(watchResize.call(null, div, /*handleResize*/ ctx[9])),
    					listen_dev(textarea_1, "input", /*textarea_1_input_handler*/ ctx[27])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*editorinfo*/ ctx[0].split_window == false) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4$1(ctx);
    					if_block0.c();
    					if_block0.m(main, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*editorinfo*/ ctx[0].show_replace == true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_3$2(ctx);
    					if_block1.c();
    					if_block1.m(main, t2);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*editorinfo*/ ctx[0].show_new_feature == true) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_2$3(ctx);
    					if_block2.c();
    					if_block2.m(main, t3);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*editorinfo*/ ctx[0].show_goto == true) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_1$4(ctx);
    					if_block3.c();
    					if_block3.m(main, t4);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*editorinfo*/ ctx[0].show_insert == true) {
    				if (if_block4) {
    					if (dirty[0] & /*editorinfo*/ 1) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block$5(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(main, t5);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*copyval*/ 8) {
    				set_input_value(textarea_1, /*copyval*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block4);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block4);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			div_resize_listener();
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			/*textarea_1_binding*/ ctx[28](null);
    			/*main_binding*/ ctx[29](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getLowestVal(v1, v2) {
    	let v = v1 > v2 ? v1 : v2;
    	return v;
    }

    function isNumeric(value) {
    	return (/^-?\d+$/).test(value);
    }

    function RNA_to_DNA(RNA) {
    	return RNA.toLowerCase().replace(/u/g, "t");
    }

    function codon_to_RNA(codon) {
    	switch (codon) {
    		case 'A':
    			return "GCU";
    		case 'I':
    			return "AUU";
    		case 'R':
    			return "CGU";
    		case 'L':
    			return "CUU";
    		case 'N':
    			return "AAU";
    		case 'K':
    			return "AAA";
    		case 'D':
    			return "GAU";
    		case 'M':
    			return "AUG";
    		case 'F':
    			return "UUU";
    		case 'C':
    			return "UGU";
    		case 'P':
    			return "CCU";
    		case 'Q':
    			return "CAA";
    		case 'S':
    			return "UCU";
    		case 'E':
    			return "GAA";
    		case 'T':
    			return "ACU";
    		case 'W':
    			return "UGG";
    		case 'G':
    			return "GGU";
    		case 'Y':
    			return "UAU";
    		case 'H':
    			return "CAU";
    		case 'V':
    			return "GUU";
    		case 'X':
    			return "UAA";
    		default:
    			return "";
    	}
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Plasmid', slots, []);
    	let { src = {} } = $$props;
    	let prevsrc = {};

    	function loadNew() {
    		if (JSON.stringify(prevsrc) === JSON.stringify(src)) {
    			return;
    		} else {
    			prevsrc = Object.assign({}, src);
    			let new_src = Object.assign({}, src);
    			ProjectManager.loadNewPlasmid(new_src);
    		}
    	}

    	let editorinfo;

    	editor_info.subscribe(value => {
    		$$invalidate(0, editorinfo = value);
    	});

    	let w;
    	let h;

    	function handleResize(node) {
    		try {
    			CircularMap.resize(w, h);
    			SequenceMap.resize(w, h);
    			CircularMap.loop();
    			SequenceMap.loop();
    		} catch(e) {
    			
    		}
    	}

    	//Variables to handle sequence copying
    	let copyval;

    	let textarea;
    	let k;

    	document.onkeypress = function (event) {
    		let char = typeof event !== "undefined"
    		? event.keyCode
    		: event.which;

    		k = String.fromCharCode(char);

    		//If the window is split then SequenceMap is not showing
    		if (editorinfo.split_window) return;

    		if (editorinfo.screen_on_top_showing) return;

    		switch (k) {
    			case "s":
    				CircularMap.activateSelection();
    				break;
    			case "m":
    				{
    					SequenceMap.addMarker();
    					let numShown = SequenceMap.getNumberOfMarkers();

    					if (numShown == 2) {
    						let [start, end] = SequenceMap.getSelected();
    						if (start === null || end === null) return;
    						let seq = GeneAMA.getSequence().substring(start, end);
    						$$invalidate(3, copyval = seq);
    					}
    				}
    				break;
    			case "r":
    				{
    					let new_editinfo = editorinfo;
    					new_editinfo.show_replace = true;
    					new_editinfo.screen_on_top_showing = true;
    					editor_info.set(new_editinfo);
    				}
    				break;
    			case "g":
    				{
    					showGoto();
    				}
    				break;
    		}
    	};

    	/*---------------- Circular Map -------------------------- */
    	let CM;

    	let circularmap = p5 => {
    		CM = new CircularMap(p5, getLowestVal(w, h), getLowestVal(w, h));

    		p5.setup = () => {
    			let sz = getLowestVal(w, h);
    			p5.createCanvas(sz, sz);
    		};

    		p5.draw = () => {
    			let sz = getLowestVal(w, h);
    			p5.resizeCanvas(sz, sz);
    			p5.background(255);
    			CM.draw();
    		};

    		// reset board when mouse is pressed
    		p5.mousePressed = e => {
    			try {
    				CM.mouseClicked(e);
    				p5.loop();
    			} catch(e) {
    				
    			}
    		};
    	};

    	/*---------------- Sequence Map -------------------------- */
    	let SM;

    	let sequencemap = p5 => {
    		SM = new SequenceMap(p5, getLowestVal(w, h), getLowestVal(w, h));

    		p5.setup = () => {
    			let sz = getLowestVal(w, h);
    			p5.createCanvas(sz, sz);
    		};

    		p5.draw = () => {
    			let sz = getLowestVal(w, h);
    			p5.resizeCanvas(sz, sz);
    			p5.background(255);
    			SM.draw();
    			p5.noLoop();
    		};

    		// reset board when mouse is pressed
    		p5.mousePressed = e => {
    			try {
    				SM.mouseClicked(e);
    				p5.loop();
    			} catch(e) {
    				
    			}
    		};

    		p5.mouseWheel = e => {
    			try {
    				let dir = e.delta < 0 ? "up" : "down";
    				SM.scroll(dir);
    			} catch(e) {
    				
    			}
    		};
    	};

    	let cm, sm;
    	let root;

    	onMount(function () {
    		cm = new p5(circularmap, "circularmap");

    		if (editorinfo.split_window === false) {
    			sm = new p5(sequencemap, "sequencemap");
    		}

    		CircularMap.resize(w, h);
    		SequenceMap.resize(w, h);
    	});

    	onDestroy(function () {
    		const removeElements = elms => elms.forEach(el => el.remove());
    		removeElements(document.querySelectorAll(".canvtracker"));
    		CircularMap.destroy();
    		SequenceMap.destroy();
    		cm = null;
    		CM = null;
    		sm = null;
    		SM = null;
    	});

    	/*----------- COPY -------------*/
    	function copySequence() {
    		textarea.select();
    		document.execCommand('copy');
    	}

    	/*----------- CUT -------------*/
    	function cutSequence() {
    		textarea.select();
    		document.execCommand('copy');
    		deleteSequence();
    	}

    	/*----------- DELETE -------------*/
    	function deleteSequence() {
    		let [start, end] = SequenceMap.getSelected();
    		if (start === null || end === null) return;
    		let oldseq = GeneAMA.getSequence();
    		let newseq = oldseq.substring(0, start) + oldseq.substring(end);
    		GeneAMA.updateSequence(newseq);
    		let lenDeleted = end - start;
    		let Allf = GeneAMA.getFeatures();
    		let newF = [];

    		for (let i = 0; i < Allf.length; i++) {
    			if (start < Allf[i].start && end > Allf[i].end) {
    				continue;
    			}

    			if (start > Allf[i].start && end < Allf[i].end) {
    				let f = Allf[i];
    				f.end = Allf[i].end - lenDeleted;
    				newF.push(f);
    				continue;
    			}

    			if (start < Allf[i].end) {
    				let f = Allf[i];
    				f.start = Allf[i].start - lenDeleted;
    				f.end = Allf[i].end - lenDeleted;
    				newF.push(f);
    			} else {
    				newF.push(Allf[i]);
    			}
    		}

    		GeneAMA.updateFeatures(newF);
    		SequenceMap.loop();
    		CircularMap.loop();
    	}

    	/*----------- INSERT -------------*/
    	function showInsert() {
    		let new_editinfo = editorinfo;
    		new_editinfo.show_insert = true;
    		new_editinfo.screen_on_top_showing = true;
    		editor_info.set(new_editinfo);
    	}

    	/*----------- NEW FEATURE -------------*/
    	let feature_input = "";

    	function showNewFeature() {
    		let new_editinfo = editorinfo;
    		new_editinfo.show_new_feature = true;
    		new_editinfo.screen_on_top_showing = true;
    		editor_info.set(new_editinfo);
    	}

    	function stopNewFeature() {
    		let new_editinfo = editorinfo;
    		new_editinfo.show_new_feature = false;
    		new_editinfo.screen_on_top_showing = false;
    		editor_info.set(new_editinfo);
    	}

    	function handleNewFeature() {
    		let [start, end] = SequenceMap.getSelected();
    		if (start === null || end === null) return;
    		GeneAMA.addFeature(start, end, feature_input);
    		SequenceMap.loop();
    		CircularMap.loop();
    		stopNewFeature();
    	}

    	/*----------- GOTO -------------*/
    	let goto_input = "";

    	function showGoto() {
    		let new_editinfo = editorinfo;
    		if (editorinfo.screen_on_top_showing) return;
    		new_editinfo.show_goto = true;
    		new_editinfo.screen_on_top_showing = true;
    		editor_info.set(new_editinfo);
    		$$invalidate(7, goto_input = "");
    	}

    	function stopGoto() {
    		let new_editinfo = editorinfo;
    		new_editinfo.show_goto = false;
    		new_editinfo.screen_on_top_showing = false;
    		editor_info.set(new_editinfo);
    		$$invalidate(7, goto_input = "");
    	}

    	function handleGoto() {
    		if (goto_input == "" || !isNumeric(goto_input)) {
    			stopGoto();
    			return;
    		}

    		SequenceMap.goto(parseInt(goto_input), true);
    		SequenceMap.loop();
    		stopGoto();
    	}

    	/*----------- REPLACE -------------*/
    	let replace_input = "";

    	function stopReplace() {
    		let new_editinfo = editorinfo;
    		new_editinfo.show_replace = false;
    		new_editinfo.screen_on_top_showing = false;
    		editor_info.set(new_editinfo);
    		$$invalidate(8, replace_input = "");
    	}

    	function handleReplace() {
    		let [start, end] = SequenceMap.getSelected();
    		if (replace_input === "" || start === null || end === null) return;

    		//Can't replace if input is bigger than the thing to replace.
    		let final_sequence = "";

    		for (let i = 0; i < replace_input.length; i++) {
    			let c = replace_input[i];
    			let isAmino = c == 'a' || c == 't' || c == 'g' || c == 'c';

    			if (isAmino) {
    				final_sequence += c;
    			} else {
    				final_sequence += RNA_to_DNA(codon_to_RNA(c.toUpperCase()));
    			}
    		}

    		/*if the thing replacing isn't the same length, don't replace
    This is important because if the change the size of
    the gene sequence, we must also alter the features
    */
    		if (final_sequence.length != end - start) {
    			stopReplace();
    			console.log("Out of bounds replace error. e-s was: ", end - start, " but len was: ", final_sequence, "final_sequence");
    			return;
    		}

    		let oldseq = GeneAMA.getSequence();
    		let newseq = oldseq.substring(0, start) + final_sequence + oldseq.substring(end);
    		GeneAMA.updateSequence(newseq);
    		SequenceMap.loop();
    		stopReplace();
    	}

    	const writable_props = ['src'];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Plasmid> was created with unknown prop '${key}'`);
    	});

    	function div_elementresize_handler() {
    		w = this.clientWidth;
    		h = this.clientHeight;
    		$$invalidate(1, w);
    		$$invalidate(2, h);
    	}

    	function input_input_handler() {
    		replace_input = this.value;
    		$$invalidate(8, replace_input);
    	}

    	function input_input_handler_1() {
    		feature_input = this.value;
    		$$invalidate(6, feature_input);
    	}

    	function input_input_handler_2() {
    		goto_input = this.value;
    		$$invalidate(7, goto_input);
    	}

    	function textarea_1_input_handler() {
    		copyval = this.value;
    		$$invalidate(3, copyval);
    	}

    	function textarea_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			textarea = $$value;
    			$$invalidate(4, textarea);
    		});
    	}

    	function main_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			root = $$value;
    			$$invalidate(5, root);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('src' in $$props) $$invalidate(22, src = $$props.src);
    	};

    	$$self.$capture_state = () => ({
    		CircularMap,
    		SequenceMap,
    		Insert,
    		editor_info,
    		GeneAMA,
    		watchResize,
    		ProjectManager,
    		src,
    		prevsrc,
    		loadNew,
    		editorinfo,
    		w,
    		h,
    		handleResize,
    		getLowestVal,
    		copyval,
    		textarea,
    		k,
    		CM,
    		circularmap,
    		SM,
    		sequencemap,
    		onMount,
    		onDestroy,
    		cm,
    		sm,
    		root,
    		copySequence,
    		cutSequence,
    		deleteSequence,
    		showInsert,
    		feature_input,
    		showNewFeature,
    		stopNewFeature,
    		handleNewFeature,
    		goto_input,
    		showGoto,
    		stopGoto,
    		handleGoto,
    		isNumeric,
    		replace_input,
    		stopReplace,
    		handleReplace,
    		RNA_to_DNA,
    		codon_to_RNA
    	});

    	$$self.$inject_state = $$props => {
    		if ('src' in $$props) $$invalidate(22, src = $$props.src);
    		if ('prevsrc' in $$props) prevsrc = $$props.prevsrc;
    		if ('editorinfo' in $$props) $$invalidate(0, editorinfo = $$props.editorinfo);
    		if ('w' in $$props) $$invalidate(1, w = $$props.w);
    		if ('h' in $$props) $$invalidate(2, h = $$props.h);
    		if ('copyval' in $$props) $$invalidate(3, copyval = $$props.copyval);
    		if ('textarea' in $$props) $$invalidate(4, textarea = $$props.textarea);
    		if ('k' in $$props) k = $$props.k;
    		if ('CM' in $$props) CM = $$props.CM;
    		if ('circularmap' in $$props) circularmap = $$props.circularmap;
    		if ('SM' in $$props) SM = $$props.SM;
    		if ('sequencemap' in $$props) sequencemap = $$props.sequencemap;
    		if ('cm' in $$props) cm = $$props.cm;
    		if ('sm' in $$props) sm = $$props.sm;
    		if ('root' in $$props) $$invalidate(5, root = $$props.root);
    		if ('feature_input' in $$props) $$invalidate(6, feature_input = $$props.feature_input);
    		if ('goto_input' in $$props) $$invalidate(7, goto_input = $$props.goto_input);
    		if ('replace_input' in $$props) $$invalidate(8, replace_input = $$props.replace_input);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*src*/ 4194304) {
    			(loadNew());
    		}

    		if ($$self.$$.dirty[0] & /*editorinfo*/ 1) {
    			(handleResize());
    		}
    	};

    	return [
    		editorinfo,
    		w,
    		h,
    		copyval,
    		textarea,
    		root,
    		feature_input,
    		goto_input,
    		replace_input,
    		handleResize,
    		copySequence,
    		cutSequence,
    		deleteSequence,
    		showInsert,
    		showNewFeature,
    		stopNewFeature,
    		handleNewFeature,
    		showGoto,
    		stopGoto,
    		handleGoto,
    		stopReplace,
    		handleReplace,
    		src,
    		div_elementresize_handler,
    		input_input_handler,
    		input_input_handler_1,
    		input_input_handler_2,
    		textarea_1_input_handler,
    		textarea_1_binding,
    		main_binding
    	];
    }

    class Plasmid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { src: 22 }, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Plasmid",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get src() {
    		throw new Error("<Plasmid>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<Plasmid>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\editor\FilePicker.svelte generated by Svelte v3.40.3 */

    const { Object: Object_1$1, window: window_1 } = globals;
    const file$7 = "src\\editor\\FilePicker.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	child_ctx[30] = i;
    	return child_ctx;
    }

    // (144:3) {#if file.type == "plasmid"}
    function create_if_block_3$1(ctx) {
    	let div;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 \t\t0 \t\t118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 \t\t0-1.457.39-2.823 1.07-4");
    			attr_dev(path, "class", "svelte-1hgbg84");
    			add_location(path, file$7, 146, 14, 3729);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-6 w-6 svelte-1hgbg84");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "#767C89");
    			add_location(svg, file$7, 145, 10, 3606);
    			attr_dev(div, "class", "icon file-icon svelte-1hgbg84");
    			add_location(div, file$7, 144, 3, 3566);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(144:3) {#if file.type == \\\"plasmid\\\"}",
    		ctx
    	});

    	return block;
    }

    // (152:6) {#if file.type == "text-editor"}
    function create_if_block_2$2(ctx) {
    	let div;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z");
    			attr_dev(path, "class", "svelte-1hgbg84");
    			add_location(path, file$7, 154, 14, 4338);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-6 w-6 svelte-1hgbg84");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "#767C89");
    			add_location(svg, file$7, 153, 10, 4217);
    			attr_dev(div, "class", "icon file-icon svelte-1hgbg84");
    			add_location(div, file$7, 152, 6, 4177);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(152:6) {#if file.type == \\\"text-editor\\\"}",
    		ctx
    	});

    	return block;
    }

    // (164:3) {:else}
    function create_else_block(ctx) {
    	let h2;
    	let t0_value = /*file*/ ctx[28].name + "";
    	let t0;
    	let t1;
    	let div;
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[24](/*i*/ ctx[30]);
    	}

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[25](/*i*/ ctx[30]);
    	}

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(h2, "class", "svelte-1hgbg84");
    			add_location(h2, file$7, 164, 3, 4878);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z");
    			attr_dev(path, "class", "svelte-1hgbg84");
    			add_location(path, file$7, 167, 6, 5105);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-6 w-6 svelte-1hgbg84");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			add_location(svg, file$7, 166, 4, 4987);
    			attr_dev(div, "class", "icon ham svelte-1hgbg84");
    			add_location(div, file$7, 165, 3, 4931);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = [
    					listen_dev(h2, "click", click_handler_1, false, false, false),
    					listen_dev(div, "click", click_handler_2, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*editorinfo*/ 4 && t0_value !== (t0_value = /*file*/ ctx[28].name + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(164:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (160:6) {#if show_rename && i == indexclicked}
    function create_if_block_1$3(ctx) {
    	let input;
    	let t0;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			t0 = space();
    			button = element("button");
    			button.textContent = "Done";
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "svelte-1hgbg84");
    			add_location(input, file$7, 160, 3, 4775);
    			attr_dev(button, "class", "svelte-1hgbg84");
    			add_location(button, file$7, 161, 3, 4820);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*in_val*/ ctx[6]);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[23]),
    					listen_dev(button, "click", /*rename*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*in_val*/ 64 && input.value !== /*in_val*/ ctx[6]) {
    				set_input_value(input, /*in_val*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(160:6) {#if show_rename && i == indexclicked}",
    		ctx
    	});

    	return block;
    }

    // (142:2) {#each editorinfo.current_project.inventory as file, i}
    function create_each_block$3(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let if_block0 = /*file*/ ctx[28].type == "plasmid" && create_if_block_3$1(ctx);
    	let if_block1 = /*file*/ ctx[28].type == "text-editor" && create_if_block_2$2(ctx);

    	function select_block_type(ctx, dirty) {
    		if (/*show_rename*/ ctx[5] && /*i*/ ctx[30] == /*indexclicked*/ ctx[3]) return create_if_block_1$3;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block2 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if_block2.c();
    			t2 = space();
    			attr_dev(div, "class", "file svelte-1hgbg84");
    			add_location(div, file$7, 142, 2, 3510);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if_block2.m(div, null);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (/*file*/ ctx[28].type == "plasmid") {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_3$1(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*file*/ ctx[28].type == "text-editor") {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_2$2(ctx);
    					if_block1.c();
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(div, t2);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(142:2) {#each editorinfo.current_project.inventory as file, i}",
    		ctx
    	});

    	return block;
    }

    // (179:1) {#if showSubMenu}
    function create_if_block$4(ctx) {
    	let div;
    	let h10;
    	let t1;
    	let h11;
    	let t3;
    	let h12;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h10 = element("h1");
    			h10.textContent = "Rename";
    			t1 = space();
    			h11 = element("h1");
    			h11.textContent = "Clone";
    			t3 = space();
    			h12 = element("h1");
    			h12.textContent = "Delete";
    			attr_dev(h10, "class", "svelte-1hgbg84");
    			add_location(h10, file$7, 180, 7, 5493);
    			attr_dev(h11, "class", "svelte-1hgbg84");
    			add_location(h11, file$7, 181, 7, 5539);
    			attr_dev(h12, "class", "svelte-1hgbg84");
    			add_location(h12, file$7, 182, 7, 5579);
    			attr_dev(div, "class", "submenu svelte-1hgbg84");
    			set_style(div, "left", /*left*/ ctx[0] + 250 + "px");
    			set_style(div, "top", /*top*/ ctx[1] + 40 + /*indexclicked*/ ctx[3] * 40 + "px");
    			add_location(div, file$7, 179, 5, 5400);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h10);
    			append_dev(div, t1);
    			append_dev(div, h11);
    			append_dev(div, t3);
    			append_dev(div, h12);

    			if (!mounted) {
    				dispose = [
    					listen_dev(h10, "click", /*showRename*/ ctx[14], false, false, false),
    					listen_dev(h11, "click", /*clone*/ ctx[13], false, false, false),
    					listen_dev(h12, "click", /*deleteItem*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*left*/ 1) {
    				set_style(div, "left", /*left*/ ctx[0] + 250 + "px");
    			}

    			if (dirty & /*top, indexclicked*/ 10) {
    				set_style(div, "top", /*top*/ ctx[1] + 40 + /*indexclicked*/ ctx[3] * 40 + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(179:1) {#if showSubMenu}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let main;
    	let div5;
    	let div4;
    	let h1;
    	let t1;
    	let input;
    	let t2;
    	let div3;
    	let div0;
    	let svg0;
    	let path0;
    	let t3;
    	let div1;
    	let svg1;
    	let path1;
    	let t4;
    	let div2;
    	let svg2;
    	let path2;
    	let t5;
    	let t6;
    	let mounted;
    	let dispose;
    	let each_value = /*editorinfo*/ ctx[2].current_project.inventory;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	let if_block = /*showSubMenu*/ ctx[4] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div5 = element("div");
    			div4 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Inventory";
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			div3 = element("div");
    			div0 = element("div");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t3 = space();
    			div1 = element("div");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t4 = space();
    			div2 = element("div");
    			svg2 = svg_element("svg");
    			path2 = svg_element("path");
    			t5 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			if (if_block) if_block.c();
    			attr_dev(h1, "class", "svelte-1hgbg84");
    			add_location(h1, file$7, 113, 3, 2235);
    			set_style(input, "display", "none");
    			attr_dev(input, "type", "file");
    			attr_dev(input, "accept", ".gbk");
    			attr_dev(input, "class", "svelte-1hgbg84");
    			add_location(input, file$7, 115, 3, 2260);
    			attr_dev(path0, "stroke-linecap", "round");
    			attr_dev(path0, "stroke-linejoin", "round");
    			attr_dev(path0, "stroke-width", "2");
    			attr_dev(path0, "d", "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12");
    			attr_dev(path0, "class", "svelte-1hgbg84");
    			add_location(path0, file$7, 121, 7, 2617);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "class", "h-6 w-6 svelte-1hgbg84");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			attr_dev(svg0, "stroke", "currentColor");
    			add_location(svg0, file$7, 120, 4, 2498);
    			attr_dev(div0, "class", "icon tool-icon svelte-1hgbg84");
    			add_location(div0, file$7, 119, 4, 2429);
    			attr_dev(path1, "stroke-linecap", "round");
    			attr_dev(path1, "stroke-linejoin", "round");
    			attr_dev(path1, "stroke-width", "2");
    			attr_dev(path1, "d", "M12 4v16m8-8H4");
    			attr_dev(path1, "class", "svelte-1hgbg84");
    			add_location(path1, file$7, 127, 7, 2979);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "class", "h-6 w-6 svelte-1hgbg84");
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "stroke", "currentColor");
    			add_location(svg1, file$7, 126, 4, 2860);
    			attr_dev(div1, "class", "icon tool-icon svelte-1hgbg84");
    			add_location(div1, file$7, 125, 4, 2804);
    			attr_dev(path2, "stroke-linecap", "round");
    			attr_dev(path2, "stroke-linejoin", "round");
    			attr_dev(path2, "stroke-width", "2");
    			attr_dev(path2, "d", "M6 18L18 6M6 6l12 12");
    			attr_dev(path2, "class", "svelte-1hgbg84");
    			add_location(path2, file$7, 134, 6, 3301);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "class", "h-6 w-6 svelte-1hgbg84");
    			attr_dev(svg2, "fill", "none");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			attr_dev(svg2, "stroke", "currentColor");
    			add_location(svg2, file$7, 133, 4, 3183);
    			attr_dev(div2, "class", "icon tool-icon svelte-1hgbg84");
    			add_location(div2, file$7, 132, 4, 3122);
    			attr_dev(div3, "class", "tools svelte-1hgbg84");
    			add_location(div3, file$7, 116, 3, 2377);
    			attr_dev(div4, "class", "tooltip svelte-1hgbg84");
    			add_location(div4, file$7, 111, 2, 2178);
    			attr_dev(div5, "class", "container svelte-1hgbg84");
    			set_style(div5, "left", /*left*/ ctx[0] + "px");
    			set_style(div5, "top", /*top*/ ctx[1] + "px");
    			add_location(div5, file$7, 109, 1, 2114);
    			attr_dev(main, "class", "svelte-1hgbg84");
    			add_location(main, file$7, 108, 0, 2105);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div5);
    			append_dev(div5, div4);
    			append_dev(div4, h1);
    			append_dev(div4, t1);
    			append_dev(div4, input);
    			/*input_binding*/ ctx[21](input);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, svg0);
    			append_dev(svg0, path0);
    			append_dev(div3, t3);
    			append_dev(div3, div1);
    			append_dev(div1, svg1);
    			append_dev(svg1, path1);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, svg2);
    			append_dev(svg2, path2);
    			append_dev(div5, t5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div5, null);
    			}

    			append_dev(main, t6);
    			if (if_block) if_block.m(main, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "mouseup", /*onMouseUp*/ ctx[10], false, false, false),
    					listen_dev(window_1, "mousemove", /*onMouseMove*/ ctx[9], false, false, false),
    					listen_dev(input, "change", /*change_handler*/ ctx[20], false, false, false),
    					listen_dev(div0, "click", /*click_handler*/ ctx[22], false, false, false),
    					listen_dev(div1, "click", /*addNewItem*/ ctx[18], false, false, false),
    					listen_dev(div2, "click", /*closeFilePicker*/ ctx[11], false, false, false),
    					listen_dev(div4, "mousedown", /*onMouseDown*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*rename, in_val, show_rename, indexclicked, showSub, openTab, editorinfo*/ 168044) {
    				each_value = /*editorinfo*/ ctx[2].current_project.inventory;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div5, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*left*/ 1) {
    				set_style(div5, "left", /*left*/ ctx[0] + "px");
    			}

    			if (dirty & /*top*/ 2) {
    				set_style(div5, "top", /*top*/ ctx[1] + "px");
    			}

    			if (/*showSubMenu*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(main, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			/*input_binding*/ ctx[21](null);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FilePicker', slots, []);
    	let editorinfo;

    	editor_info.subscribe(value => {
    		$$invalidate(2, editorinfo = value);
    	});

    	let { left = 100 } = $$props;
    	let { top = 200 } = $$props;
    	let moving = false;

    	function onMouseDown() {
    		moving = true;
    	}

    	function onMouseMove(e) {
    		if (moving) {
    			$$invalidate(0, left += e.movementX);
    			$$invalidate(1, top += e.movementY);
    		}
    	}

    	function onMouseUp() {
    		moving = false;
    	}

    	function closeFilePicker() {
    		let new_editinfo = editorinfo;
    		$$invalidate(4, showSubMenu = false);
    		new_editinfo.show_filepicker = false;
    		editor_info.set(new_editinfo);
    	}

    	let inventory = editorinfo.current_project.inventory;
    	let indexclicked = 1;
    	let showSubMenu = false;

    	function showSub(index) {
    		$$invalidate(4, showSubMenu = !showSubMenu);
    		$$invalidate(3, indexclicked = index);
    	}

    	function clone() {
    		let ft = inventory[indexclicked];
    		let ft_clone = Object.assign({}, ft);
    		ProjectManager.addItemToInventory(ft_clone);
    	}

    	let show_rename = false;
    	let in_val = "";

    	function showRename() {
    		$$invalidate(6, in_val = inventory[indexclicked].name);
    		$$invalidate(5, show_rename = true);
    	}

    	function rename() {
    		$$invalidate(5, show_rename = false);
    		$$invalidate(4, showSubMenu = false);
    		ProjectManager.changeItemName(indexclicked, in_val);
    	}

    	function deleteItem() {
    		$$invalidate(5, show_rename = false);
    		$$invalidate(4, showSubMenu = false);
    		ProjectManager.deleteItemFromInventory(indexclicked);
    	}

    	function openTab(i) {
    		inventory[i];
    		ProjectManager.createNewTab(i);
    	}

    	function addNewItem() {
    		let item = {
    			name: "Unnamed lab",
    			type: "text-editor",
    			html: "",
    			text: ""
    		};

    		ProjectManager.addItemToInventory(item);
    	}

    	let fileinput;

    	const onFileSelected = e => {
    		let fd = e.target.files[0];
    		let reader = new FileReader();
    		reader.readAsText(fd);

    		reader.onload = e => {
    			let data_b64 = getData("gbk?data=" + window.btoa(e.target.result));
    			ProjectManager.addPlasmid(data_b64);
    		};
    	};

    	const writable_props = ['left', 'top'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FilePicker> was created with unknown prop '${key}'`);
    	});

    	const change_handler = e => onFileSelected(e);

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			fileinput = $$value;
    			$$invalidate(7, fileinput);
    		});
    	}

    	const click_handler = () => fileinput.click();

    	function input_input_handler() {
    		in_val = this.value;
    		$$invalidate(6, in_val);
    	}

    	const click_handler_1 = i => openTab(i);
    	const click_handler_2 = i => showSub(i);

    	$$self.$$set = $$props => {
    		if ('left' in $$props) $$invalidate(0, left = $$props.left);
    		if ('top' in $$props) $$invalidate(1, top = $$props.top);
    	};

    	$$self.$capture_state = () => ({
    		ProjectManager,
    		getData,
    		editor_info,
    		editorinfo,
    		left,
    		top,
    		moving,
    		onMouseDown,
    		onMouseMove,
    		onMouseUp,
    		closeFilePicker,
    		inventory,
    		indexclicked,
    		showSubMenu,
    		showSub,
    		clone,
    		show_rename,
    		in_val,
    		showRename,
    		rename,
    		deleteItem,
    		openTab,
    		addNewItem,
    		fileinput,
    		onFileSelected
    	});

    	$$self.$inject_state = $$props => {
    		if ('editorinfo' in $$props) $$invalidate(2, editorinfo = $$props.editorinfo);
    		if ('left' in $$props) $$invalidate(0, left = $$props.left);
    		if ('top' in $$props) $$invalidate(1, top = $$props.top);
    		if ('moving' in $$props) moving = $$props.moving;
    		if ('inventory' in $$props) inventory = $$props.inventory;
    		if ('indexclicked' in $$props) $$invalidate(3, indexclicked = $$props.indexclicked);
    		if ('showSubMenu' in $$props) $$invalidate(4, showSubMenu = $$props.showSubMenu);
    		if ('show_rename' in $$props) $$invalidate(5, show_rename = $$props.show_rename);
    		if ('in_val' in $$props) $$invalidate(6, in_val = $$props.in_val);
    		if ('fileinput' in $$props) $$invalidate(7, fileinput = $$props.fileinput);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		left,
    		top,
    		editorinfo,
    		indexclicked,
    		showSubMenu,
    		show_rename,
    		in_val,
    		fileinput,
    		onMouseDown,
    		onMouseMove,
    		onMouseUp,
    		closeFilePicker,
    		showSub,
    		clone,
    		showRename,
    		rename,
    		deleteItem,
    		openTab,
    		addNewItem,
    		onFileSelected,
    		change_handler,
    		input_binding,
    		click_handler,
    		input_input_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class FilePicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { left: 0, top: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FilePicker",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get left() {
    		throw new Error("<FilePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<FilePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get top() {
    		throw new Error("<FilePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set top(value) {
    		throw new Error("<FilePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\editor\Menu.svelte generated by Svelte v3.40.3 */

    const { console: console_1$1 } = globals;
    const file$6 = "src\\editor\\Menu.svelte";

    // (66:2) {#if key == 0}
    function create_if_block_2$1(ctx) {
    	let h10;
    	let t1;
    	let h11;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h10 = element("h1");
    			h10.textContent = "Save";
    			t1 = space();
    			h11 = element("h1");
    			h11.textContent = "Exit without saving";
    			attr_dev(h10, "class", "item svelte-kc8i3q");
    			add_location(h10, file$6, 66, 2, 1421);
    			attr_dev(h11, "class", "item svelte-kc8i3q");
    			add_location(h11, file$6, 67, 2, 1477);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h10, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h11, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(h10, "click", /*saveEverything*/ ctx[5], false, false, false),
    					listen_dev(h11, "click", /*goToHome*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h10);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h11);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(66:2) {#if key == 0}",
    		ctx
    	});

    	return block;
    }

    // (72:2) {#if key == 1}
    function create_if_block_1$2(ctx) {
    	let h10;
    	let t1;
    	let h11;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h10 = element("h1");
    			h10.textContent = "Inventory";
    			t1 = space();
    			h11 = element("h1");
    			h11.textContent = "Split window";
    			attr_dev(h10, "class", "item svelte-kc8i3q");
    			add_location(h10, file$6, 72, 2, 1588);
    			attr_dev(h11, "class", "item svelte-kc8i3q");
    			add_location(h11, file$6, 73, 2, 1648);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h10, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h11, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(h10, "click", /*showInventory*/ ctx[3], false, false, false),
    					listen_dev(h11, "click", /*splitScreen*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h10);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h11);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(72:2) {#if key == 1}",
    		ctx
    	});

    	return block;
    }

    // (78:2) {#if key == 2}
    function create_if_block$3(ctx) {
    	let h10;
    	let t1;
    	let h11;
    	let t3;
    	let h12;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h10 = element("h1");
    			h10.textContent = "Go to NCBI";
    			t1 = space();
    			h11 = element("h1");
    			h11.textContent = "Go to AddGene";
    			t3 = space();
    			h12 = element("h1");
    			h12.textContent = "Go to UniProt";
    			attr_dev(h10, "class", "item svelte-kc8i3q");
    			add_location(h10, file$6, 78, 2, 1755);
    			attr_dev(h11, "class", "item svelte-kc8i3q");
    			add_location(h11, file$6, 79, 2, 1853);
    			attr_dev(h12, "class", "item svelte-kc8i3q");
    			add_location(h12, file$6, 80, 2, 1949);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h10, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h11, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, h12, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(h10, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(h11, "click", /*click_handler_1*/ ctx[7], false, false, false),
    					listen_dev(h12, "click", /*click_handler_2*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h10);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h11);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(h12);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(78:2) {#if key == 2}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let main;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;
    	let if_block0 = /*key*/ ctx[0] == 0 && create_if_block_2$1(ctx);
    	let if_block1 = /*key*/ ctx[0] == 1 && create_if_block_1$2(ctx);
    	let if_block2 = /*key*/ ctx[0] == 2 && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div0, "class", "getoff svelte-kc8i3q");
    			add_location(div0, file$6, 61, 1, 1281);
    			attr_dev(div1, "class", "menu svelte-kc8i3q");
    			set_style(div1, "left", /*key*/ ctx[0] * 90 + "px");
    			add_location(div1, file$6, 63, 1, 1339);
    			attr_dev(main, "class", "svelte-kc8i3q");
    			add_location(main, file$6, 59, 0, 1270);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(main, t0);
    			append_dev(main, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t1);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t2);
    			if (if_block2) if_block2.m(div1, null);

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*stopShowingMenu*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*key*/ ctx[0] == 0) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					if_block0.m(div1, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*key*/ ctx[0] == 1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					if_block1.m(div1, t2);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*key*/ ctx[0] == 2) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$3(ctx);
    					if_block2.c();
    					if_block2.m(div1, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty & /*key*/ 1) {
    				set_style(div1, "left", /*key*/ ctx[0] * 90 + "px");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function goToWebsite(url) {
    	window.open(url);
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	let editorinfo;
    	let current_screen_value;

    	current_screen.subscribe(value => {
    		current_screen_value = value;
    	});

    	editor_info.subscribe(value => {
    		editorinfo = value;
    	});

    	let { key = 0 } = $$props;

    	function stopShowingMenu() {
    		let new_editinfo = editorinfo;
    		new_editinfo.show_menu = false;
    		editor_info.set(new_editinfo);
    	}

    	function goToHome() {
    		current_screen.set("HOME");
    	}

    	function showInventory() {
    		let new_editinfo = editorinfo;
    		new_editinfo.show_filepicker = !new_editinfo.show_filepicker;
    		editor_info.set(new_editinfo);
    	}

    	function splitScreen() {
    		let new_editinfo = editorinfo;
    		new_editinfo.split_window = !new_editinfo.split_window;
    		editor_info.set(new_editinfo);
    	}

    	function saveEverything() {
    		let path = editorinfo.project_path;
    		let proj = JSON.stringify(editorinfo.current_project);
    		let data = window.btoa(path + "|" + proj);
    		console.log(data);
    		getData("save?data=" + data);
    		console.log("everything saved!");
    	}

    	const writable_props = ['key'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => goToWebsite("https://www.ncbi.nlm.nih.gov/");
    	const click_handler_1 = () => goToWebsite("https://www.addgene.org/");
    	const click_handler_2 = () => goToWebsite("https://www.uniprot.org/");

    	$$self.$$set = $$props => {
    		if ('key' in $$props) $$invalidate(0, key = $$props.key);
    	};

    	$$self.$capture_state = () => ({
    		editor_info,
    		editorinfo,
    		current_screen,
    		current_screen_value,
    		getData,
    		key,
    		stopShowingMenu,
    		goToHome,
    		showInventory,
    		splitScreen,
    		goToWebsite,
    		saveEverything
    	});

    	$$self.$inject_state = $$props => {
    		if ('editorinfo' in $$props) editorinfo = $$props.editorinfo;
    		if ('current_screen_value' in $$props) current_screen_value = $$props.current_screen_value;
    		if ('key' in $$props) $$invalidate(0, key = $$props.key);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		key,
    		stopShowingMenu,
    		goToHome,
    		showInventory,
    		splitScreen,
    		saveEverything,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { key: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get key() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    let t = {};

    const exec = (command, value = null) => {
      document.execCommand(command, false, value);
    };

    const getTagsRecursive = (element, tags) => {
      tags = tags || (element && element.tagName ? [element.tagName] : []);

      if (element && element.parentNode) {
        element = element.parentNode;
      } else {
        return tags;
      }

      const tag = element.tagName;
      if (element.style && element.getAttribute) {
        [element.style.textAlign || element.getAttribute('align'), element.style.color || tag === 'FONT' && 'forecolor', element.style.backgroundColor && 'backcolor']
          .filter((item) => item)
          .forEach((item) => tags.push(item));
      }

      if (tag === 'DIV') {
        return tags;
      }

      tags.push(tag);

      return getTagsRecursive(element, tags).filter((_tag) => _tag != null);
    };

    const saveRange = (editor) => {
      const documentSelection = document.getSelection();

      t.range = null;

      if (documentSelection.rangeCount) {
        let savedRange = t.range = documentSelection.getRangeAt(0);
        let range = document.createRange();
        let rangeStart;
        range.selectNodeContents(editor);
        range.setEnd(savedRange.startContainer, savedRange.startOffset);
        rangeStart = (range + '').length;
        t.metaRange = {
          start: rangeStart,
          end: rangeStart + (savedRange + '').length
        };
      }
    };
    const restoreRange = (editor) => {
      let metaRange = t.metaRange;
      let savedRange = t.range;
      let documentSelection = document.getSelection();
      let range;

      if (!savedRange) {
        return;
      }

      if (metaRange && metaRange.start !== metaRange.end) { // Algorithm from http://jsfiddle.net/WeWy7/3/
        let charIndex = 0,
            nodeStack = [editor],
            node,
            foundStart = false,
            stop = false;

        range = document.createRange();

        while (!stop && (node = nodeStack.pop())) {
          if (node.nodeType === 3) {
            let nextCharIndex = charIndex + node.length;
            if (!foundStart && metaRange.start >= charIndex && metaRange.start <= nextCharIndex) {
              range.setStart(node, metaRange.start - charIndex);
              foundStart = true;
            }
            if (foundStart && metaRange.end >= charIndex && metaRange.end <= nextCharIndex) {
              range.setEnd(node, metaRange.end - charIndex);
              stop = true;
            }
            charIndex = nextCharIndex;
          } else {
            let cn = node.childNodes;
            let i = cn.length;

            while (i > 0) {
              i -= 1;
              nodeStack.push(cn[i]);
            }
          }
        }
      }

      documentSelection.removeAllRanges();
      documentSelection.addRange(range || savedRange);
    };

    const cleanHtml = (input) => {
      const html = input.match(/<!--StartFragment-->(.*?)<!--EndFragment-->/);
      let output = html && html[1] || input;
      output = output
        .replace(/\r?\n|\r/g, ' ')
        .replace(/<!--(.*?)-->/g, '')
        .replace(new RegExp('<(/)*(meta|link|span|\\?xml:|st1:|o:|font|w:sdt)(.*?)>', 'gi'), '')
        .replace(/<!\[if !supportLists\]>(.*?)<!\[endif\]>/gi, '')
        .replace(/style="[^"]*"/gi, '')
        .replace(/style='[^']*'/gi, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/>(\s+)</g, '><')
        .replace(/class="[^"]*"/gi, '')
        .replace(/class='[^']*'/gi, '')
        .replace(/<[^/].*?>/g, i => i.split(/[ >]/g)[0] + '>')
        .trim();

        output = removeBadTags(output);
        return output;
    };

    const unwrap = (wrapper) => {
    	const docFrag = document.createDocumentFragment();
    	while (wrapper.firstChild) {
    		const child = wrapper.removeChild(wrapper.firstChild);
    		docFrag.appendChild(child);
    	}

    	// replace wrapper with document fragment
    	wrapper.parentNode.replaceChild(docFrag, wrapper);
    };

    const removeBlockTagsRecursive = (elements, tagsToRemove) => {
      Array.from(elements).forEach((item) => {
        if (tagsToRemove.some((tag) => tag === item.tagName.toLowerCase())) {
          if (item.children.length) {
            removeBlockTagsRecursive(item.children, tagsToRemove);
          }
          unwrap(item);
        }
      });
    };

    const getActionBtns = (actions) => {
      return Object.keys(actions).map((action) => actions[action]);
    };

    const getNewActionObj = (actions, userActions = []) => {
        if (userActions && userActions.length) {
          const newActions = {};
          userActions.forEach((action) => {
            if (typeof action === 'string') {
              newActions[action] = Object.assign({}, actions[action]);
            } else if (actions[action.name]) {
              newActions[action.name] = Object.assign(actions[action.name], action);
            } else {
              newActions[action.name] = Object.assign({}, action);
            }
          });

          return newActions;
        } else {
          return actions;
        }
    };

    const removeBadTags = (html) => {
      ['style', 'script', 'applet', 'embed', 'noframes', 'noscript'].forEach((badTag) => {
        html = html.replace(new RegExp(`<${badTag}.*?${badTag}(.*?)>`, 'gi'), '');
      });

      return html;
    };

    const isEditorClick = (target, editorWrapper) => {
      if (target === editorWrapper) {
        return true;
      }
      if (target.parentElement) {
        return isEditorClick(target.parentElement, editorWrapper);
      }
      return false;
    };

    const linkSvg =
    	'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M31.1 48.9l-6.7 6.7c-.8.8-1.6.9-2.1.9s-1.4-.1-2.1-.9L15 50.4c-1.1-1.1-1.1-3.1 0-4.2l6.1-6.1.2-.2 6.5-6.5c-1.2-.6-2.5-.9-3.8-.9-2.3 0-4.6.9-6.3 2.6L11 41.8c-3.5 3.5-3.5 9.2 0 12.7l5.2 5.2c1.7 1.7 4 2.6 6.3 2.6s4.6-.9 6.3-2.6l6.7-6.7c2.5-2.6 3.1-6.7 1.5-10l-5.9 5.9zM38.7 22.5l6.7-6.7c.8-.8 1.6-.9 2.1-.9s1.4.1 2.1.9l5.2 5.2c1.1 1.1 1.1 3.1 0 4.2l-6.1 6.1-.2.2L42 38c1.2.6 2.5.9 3.8.9 2.3 0 4.6-.9 6.3-2.6l6.7-6.7c3.5-3.5 3.5-9.2 0-12.7l-5.2-5.2c-1.7-1.7-4-2.6-6.3-2.6s-4.6.9-6.3 2.6l-6.7 6.7c-2.7 2.7-3.3 6.9-1.7 10.2l6.1-6.1c0 .1 0 .1 0 0z"></path><path d="M44.2 30.5c.2-.2.4-.6.4-.9 0-.3-.1-.6-.4-.9l-2.3-2.3c-.3-.2-.6-.4-.9-.4-.3 0-.6.1-.9.4L25.9 40.6c-.2.2-.4.6-.4.9 0 .3.1.6.4.9l2.3 2.3c.2.2.6.4.9.4.3 0 .6-.1.9-.4l14.2-14.2zM49.9 55.4h-8.5v-5h8.5v-8.9h5.2v8.9h8.5v5h-8.5v8.9h-5.2v-8.9z"></path></svg>';
    const unlinkSvg =
    	'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M30.9 49.1l-6.7 6.7c-.8.8-1.6.9-2.1.9s-1.4-.1-2.1-.9l-5.2-5.2c-1.1-1.1-1.1-3.1 0-4.2l6.1-6.1.2-.2 6.5-6.5c-1.2-.6-2.5-.9-3.8-.9-2.3 0-4.6.9-6.3 2.6L10.8 42c-3.5 3.5-3.5 9.2 0 12.7l5.2 5.2c1.7 1.7 4 2.6 6.3 2.6s4.6-.9 6.3-2.6l6.7-6.7C38 50.5 38.6 46.3 37 43l-6.1 6.1zM38.5 22.7l6.7-6.7c.8-.8 1.6-.9 2.1-.9s1.4.1 2.1.9l5.2 5.2c1.1 1.1 1.1 3.1 0 4.2l-6.1 6.1-.2.2-6.5 6.5c1.2.6 2.5.9 3.8.9 2.3 0 4.6-.9 6.3-2.6l6.7-6.7c3.5-3.5 3.5-9.2 0-12.7l-5.2-5.2c-1.7-1.7-4-2.6-6.3-2.6s-4.6.9-6.3 2.6l-6.7 6.7c-2.7 2.7-3.3 6.9-1.7 10.2l6.1-6.1z"></path><path d="M44.1 30.7c.2-.2.4-.6.4-.9 0-.3-.1-.6-.4-.9l-2.3-2.3c-.2-.2-.6-.4-.9-.4-.3 0-.6.1-.9.4L25.8 40.8c-.2.2-.4.6-.4.9 0 .3.1.6.4.9l2.3 2.3c.2.2.6.4.9.4.3 0 .6-.1.9-.4l14.2-14.2zM41.3 55.8v-5h22.2v5H41.3z"></path></svg>';

    var defaultActions = {
    	viewHtml: {
    		icon:
    			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path fill="none" stroke="currentColor" stroke-width="8" stroke-miterlimit="10" d="M26.9 17.9L9 36.2 26.9 54M45 54l17.9-18.3L45 17.9"></path></svg>',
    		title: "View HTML",
    		result: function() {
    			let refs = get_store_value(this.references);
    			let actionObj = get_store_value(this.state).actionObj;
    			let helper = get_store_value(this.helper);

    			helper.showEditor = !helper.showEditor;
    			refs.editor.style.display = helper.showEditor ? "block" : "none";
    			refs.raw.style.display = helper.showEditor ? "none" : "block";
    			if (helper.showEditor) {
    				refs.editor.innerHTML = refs.raw.value;
    			} else {
    				refs.raw.value = refs.editor.innerHTML;
    			}
    			setTimeout(() => {
    				Object.keys(actionObj).forEach(
    					action => (actionObj[action].disabled = !helper.showEditor)
    				);
    				actionObj.viewHtml.disabled = false;
    				actionObj.viewHtml.active = !helper.showEditor;

    				this.state.update(state => {
    					state.actionBtns = getActionBtns(actionObj);
    					state.actionObj = actionObj;
    					return state;
    				});
    			});
    		}
    	},
    	undo: {
    		icon:
    			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M61.2 51.2c0-5.1-2.1-9.7-5.4-13.1-3.3-3.3-8-5.4-13.1-5.4H26.1v-12L10.8 36l15.3 15.3V39.1h16.7c3.3 0 6.4 1.3 8.5 3.5 2.2 2.2 3.5 5.2 3.5 8.5h6.4z"></path></svg>',
    		title: "Undo",
    		result: () => exec("undo")
    	},
    	redo: {
    		icon:
    			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M10.8 51.2c0-5.1 2.1-9.7 5.4-13.1 3.3-3.3 8-5.4 13.1-5.4H46v-12L61.3 36 45.9 51.3V39.1H29.3c-3.3 0-6.4 1.3-8.5 3.5-2.2 2.2-3.5 5.2-3.5 8.5h-6.5z"></path></svg>',
    		title: "Redo",
    		result: () => exec("redo")
    	},
    	b: {
    		icon: "<b>B</b>",
    		title: "Bold",
    		result: () => exec("bold")
    	},
    	i: {
    		icon: "<i>I</i>",
    		title: "Italic",
    		result: () => exec("italic")
    	},
    	u: {
    		icon: "<u>U</u>",
    		title: "Underline",
    		result: () => exec("underline")
    	},
    	strike: {
    		icon: "<strike>S</strike>",
    		title: "Strike-through",
    		result: () => exec("strikeThrough")
    	},
    	sup: {
    		icon: "A<sup>2</sup>",
    		title: "Superscript",
    		result: () => exec("superscript")
    	},
    	sub: {
    		icon: "A<sub>2</sub>",
    		title: "Subscript",
    		result: () => exec("subscript")
    	},
    	h1: {
    		icon: "<b>H<sub>1</sub></b>",
    		title: "Heading 1",
    		result: () => exec("formatBlock", "<H1>")
    	},
    	h2: {
    		icon: "<b>H<sub>2</sub></b>",
    		title: "Heading 2",
    		result: () => exec("formatBlock", "<H2>")
    	},
    	p: {
    		icon: "&#182;",
    		title: "Paragraph",
    		result: () => exec("formatBlock", "<P>")
    	},
    	blockquote: {
    		icon: "&#8220; &#8221;",
    		title: "Quote",
    		result: () => exec("formatBlock", "<BLOCKQUOTE>")
    	},
    	ol: {
    		icon:
    			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M27 14h36v8H27zM27 50h36v8H27zM27 32h36v8H27zM11.8 15.8V22h1.8v-7.8h-1.5l-2.1 1 .3 1.3zM12.1 38.5l.7-.6c1.1-1 2.1-2.1 2.1-3.4 0-1.4-1-2.4-2.7-2.4-1.1 0-2 .4-2.6.8l.5 1.3c.4-.3 1-.6 1.7-.6.9 0 1.3.5 1.3 1.1 0 .9-.9 1.8-2.6 3.3l-1 .9V40H15v-1.5h-2.9zM13.3 53.9c1-.4 1.4-1 1.4-1.8 0-1.1-.9-1.9-2.6-1.9-1 0-1.9.3-2.4.6l.4 1.3c.3-.2 1-.5 1.6-.5.8 0 1.2.3 1.2.8 0 .7-.8.9-1.4.9h-.7v1.3h.7c.8 0 1.6.3 1.6 1.1 0 .6-.5 1-1.4 1-.7 0-1.5-.3-1.8-.5l-.4 1.4c.5.3 1.3.6 2.3.6 2 0 3.2-1 3.2-2.4 0-1.1-.8-1.8-1.7-1.9z"></path></svg>',
    		title: "Ordered List",
    		result: () => exec("insertOrderedList")
    	},
    	ul: {
    		icon:
    			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M27 14h36v8H27zM27 50h36v8H27zM9 50h9v8H9zM9 32h9v8H9zM9 14h9v8H9zM27 32h36v8H27z"></path></svg>',
    		title: "Unordered List",
    		result: () => exec("insertUnorderedList")
    	},
    	hr: {
    		icon: "&#8213;",
    		title: "Horizontal Line",
    		result: () => exec("insertHorizontalRule")
    	},
    	left: {
    		icon:
    			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M9 14h54v8H9zM9 50h54v8H9zM9 32h36v8H9z"></path></svg>',
    		title: "Justify left",
    		result: () => exec("justifyLeft")
    	},
    	right: {
    		icon:
    			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M9 14h54v8H9zM9 50h54v8H9zM27 32h36v8H27z"></path></svg>',
    		title: "Justify right",
    		result: () => exec("justifyRight")
    	},
    	center: {
    		icon:
    			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M9 14h54v8H9zM9 50h54v8H9zM18 32h36v8H18z"></path></svg>',
    		title: "Justify center",
    		result: () => exec("justifyCenter")
    	},
    	justify: {
    		icon:
    			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M9 14h54v8H9zM9 50h54v8H9zM9 32h54v8H9z"></path></svg>',
    		title: "Justify full",
    		result: () => exec("justifyFull")
    	},
    	a: {
    		icon: linkSvg,
    		title: "Insert link",
    		result: function() {
    			const actionObj = get_store_value(this.state).actionObj;
    			const refs = get_store_value(this.references);

    			if (actionObj.a.active) {
    				const selection = window.getSelection();
    				const range = document.createRange();
    				range.selectNodeContents(document.getSelection().focusNode);
    				selection.removeAllRanges();
    				selection.addRange(range);
    				exec("unlink");
    				actionObj.a.title = "Insert link";
    				actionObj.a.icon = linkSvg;
    				this.state.update(state => {
    					state.actionBtn = getActionBtns(actionObj);
    					state.actionObj = actionObj;
    					return state;
    				});
    			} else {
    				saveRange(refs.editor);
    				refs.modal.$set({
    					show: true,
    					event: "linkUrl",
    					title: "Insert link",
    					label: "Url"
    				});
    				if (!get_store_value(this.helper).link) {
    					this.helper.update(state => {
    						state.link = true;
    						return state;
    					});
    					refs.modal.$on("linkUrl", event => {
    						restoreRange(refs.editor);
    						exec("createLink", event.detail);
    						actionObj.a.title = "Unlink";
    						actionObj.a.icon = unlinkSvg;

    						this.state.update(state => {
    							state.actionBtn = getActionBtns(actionObj);
    							state.actionObj = actionObj;
    							return state;
    						});
    					});
    				}
    			}
    		}
    	},
    	image: {
    		icon:
    			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M64 17v38H8V17h56m8-8H0v54h72V9z"></path><path d="M17.5 22C15 22 13 24 13 26.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zM16 50h27L29.5 32zM36 36.2l8.9-8.5L60.2 50H45.9S35.6 35.9 36 36.2z"></path></svg>',
    		title: "Image",
    		result: function() {
    			const refs = get_store_value(this.references);
    			saveRange(refs.editor);
    			refs.modal.$set({
    				show: true,
    				event: "imageUrl",
    				title: "Insert image",
    				label: "Url"
    			});
    			if (!get_store_value(this.helper).image) {
    				this.helper.update(state => {
    					state.image = true;
    					return state;
    				});
    				refs.modal.$on("imageUrl", event => {
    					restoreRange(refs.editor);
    					exec("insertImage", event.detail);
    				});
    			}
    		}
    	},
    	forecolor: {
    		icon:
    			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M32 15h7.8L56 57.1h-7.9l-4-11.1H27.4l-4 11.1h-7.6L32 15zm-2.5 25.4h12.9L36 22.3h-.2l-6.3 18.1z"></path></svg>',
    		title: "Text color",
    		colorPicker: true,
    		result: function() {
    			showColorPicker.call(this, "foreColor");
    		}
    	},
    	backcolor: {
    		icon:
    			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M36.5 22.3l-6.3 18.1H43l-6.3-18.1z"></path><path d="M9 8.9v54.2h54.1V8.9H9zm39.9 48.2L45 46H28.2l-3.9 11.1h-7.6L32.8 15h7.8l16.2 42.1h-7.9z"></path></svg>',
    		title: "Background color",
    		colorPicker: true,
    		result: function() {
    			showColorPicker.call(this, "backColor");
    		}
    	},
    	removeFormat: {
    		icon:
    			'<svg viewBox="0 0 72 72" width="17px" height="100%"><path d="M58.2 54.6L52 48.5l3.6-3.6 6.1 6.1 6.4-6.4 3.8 3.8-6.4 6.4 6.1 6.1-3.6 3.6-6.1-6.1-6.4 6.4-3.7-3.8 6.4-6.4zM21.7 52.1H50V57H21.7zM18.8 15.2h34.1v6.4H39.5v24.2h-7.4V21.5H18.8v-6.3z"></path></svg>',
    		title: "Remove format",
    		result: function() {
    			const refs = get_store_value(this.references);
    			const selection = window.getSelection();
    			if (!selection.toString().length) {
    				removeBlockTagsRecursive(
    					refs.editor.children,
    					this.removeFormatTags
    				);
    				const range = document.createRange();
    				range.selectNodeContents(refs.editor);
    				selection.removeAllRanges();
    				selection.addRange(range);
    			}
    			exec("removeFormat");
    			selection.removeAllRanges();
    		}
    	}
    };

    const showColorPicker = function(cmd) {
    	const refs = get_store_value(this.references);
    	saveRange(refs.editor);
    	console.log(refs.colorPicker);
    	refs.colorPicker.$set({show: true, event: cmd});
    	if (!get_store_value(this.helper)[cmd]) {
    		this.helper.update(state => {
    			state[cmd] = true;
    			return state;
    		});
    		refs.colorPicker.$on(cmd, event => {
    			let item = event.detail;
    			if (item.modal) {
    				this.modal.$set({
    					show: true,
    					event: "colorHref",
    					title: "Text color",
    					label:
    						cmd === "foreColor" ? "Text color" : "Background color"
    				});
    				const command = cmd;
    				if (!get_store_value(this.helper)[`${command}Modal`]) {
    					get_store_value(this.helper)[`${command}Modal`] = true;
    					this.modal.$on("colorHref", event => {
    						let color = event.detail;
    						restoreRange(refs.editor);
    						exec(command, color);
    					});
    				}
    			} else {
    				restoreRange(refs.editor);
    				exec(cmd, item.color);
    			}
    		});
    	}
    };

    /* node_modules\cl-editor\src\helpers\EditorModal.svelte generated by Svelte v3.40.3 */

    const { console: console_1 } = globals;
    const file$5 = "node_modules\\cl-editor\\src\\helpers\\EditorModal.svelte";

    // (12:12) {#if error}
    function create_if_block$2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Required";
    			attr_dev(span, "class", "msg-error svelte-42yfje");
    			add_location(span, file$5, 12, 12, 600);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(12:12) {#if error}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div2;
    	let div1;
    	let span0;
    	let t1;
    	let t2;
    	let form;
    	let label_1;
    	let input;
    	let t3;
    	let span2;
    	let span1;
    	let t4;
    	let t5;
    	let t6;
    	let button0;
    	let t8;
    	let button1;
    	let mounted;
    	let dispose;
    	let if_block = /*error*/ ctx[2] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			span0 = element("span");
    			t1 = text(/*title*/ ctx[3]);
    			t2 = space();
    			form = element("form");
    			label_1 = element("label");
    			input = element("input");
    			t3 = space();
    			span2 = element("span");
    			span1 = element("span");
    			t4 = text(/*label*/ ctx[4]);
    			t5 = space();
    			if (if_block) if_block.c();
    			t6 = space();
    			button0 = element("button");
    			button0.textContent = "Confirm";
    			t8 = space();
    			button1 = element("button");
    			button1.textContent = "Cancel";
    			attr_dev(div0, "class", "cl-editor-overlay svelte-42yfje");
    			add_location(div0, file$5, 2, 2, 102);
    			attr_dev(span0, "class", "modal-title svelte-42yfje");
    			add_location(span0, file$5, 5, 6, 226);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "name", "text");
    			attr_dev(input, "class", "svelte-42yfje");
    			add_location(input, file$5, 8, 10, 398);
    			attr_dev(span1, "class", "svelte-42yfje");
    			add_location(span1, file$5, 10, 12, 543);
    			attr_dev(span2, "class", "input-info svelte-42yfje");
    			add_location(span2, file$5, 9, 10, 505);
    			attr_dev(label_1, "class", "modal-label svelte-42yfje");
    			toggle_class(label_1, "input-error", /*error*/ ctx[2]);
    			add_location(label_1, file$5, 7, 8, 334);
    			attr_dev(button0, "class", "modal-button modal-submit svelte-42yfje");
    			attr_dev(button0, "type", "submit");
    			add_location(button0, file$5, 16, 8, 701);
    			attr_dev(button1, "class", "modal-button modal-reset svelte-42yfje");
    			attr_dev(button1, "type", "reset");
    			add_location(button1, file$5, 17, 8, 782);
    			add_location(form, file$5, 6, 6, 273);
    			attr_dev(div1, "class", "modal-box svelte-42yfje");
    			add_location(div1, file$5, 4, 4, 196);
    			attr_dev(div2, "class", "cl-editor-modal svelte-42yfje");
    			add_location(div2, file$5, 3, 2, 162);
    			set_style(div3, "display", /*show*/ ctx[0] ? 'block' : 'none');
    			add_location(div3, file$5, 1, 0, 51);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, span0);
    			append_dev(span0, t1);
    			append_dev(div1, t2);
    			append_dev(div1, form);
    			append_dev(form, label_1);
    			append_dev(label_1, input);
    			/*input_binding*/ ctx[10](input);
    			set_input_value(input, /*text*/ ctx[1]);
    			append_dev(label_1, t3);
    			append_dev(label_1, span2);
    			append_dev(span2, span1);
    			append_dev(span1, t4);
    			append_dev(span2, t5);
    			if (if_block) if_block.m(span2, null);
    			append_dev(form, t6);
    			append_dev(form, button0);
    			append_dev(form, t8);
    			append_dev(form, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*cancel*/ ctx[7], false, false, false),
    					listen_dev(input, "keyup", /*hideError*/ ctx[8], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[11]),
    					listen_dev(button1, "click", /*cancel*/ ctx[7], false, false, false),
    					listen_dev(form, "submit", prevent_default(/*submit_handler*/ ctx[12]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 8) set_data_dev(t1, /*title*/ ctx[3]);

    			if (dirty & /*text*/ 2 && input.value !== /*text*/ ctx[1]) {
    				set_input_value(input, /*text*/ ctx[1]);
    			}

    			if (dirty & /*label*/ 16) set_data_dev(t4, /*label*/ ctx[4]);

    			if (/*error*/ ctx[2]) {
    				if (if_block) ; else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(span2, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*error*/ 4) {
    				toggle_class(label_1, "input-error", /*error*/ ctx[2]);
    			}

    			if (dirty & /*show*/ 1) {
    				set_style(div3, "display", /*show*/ ctx[0] ? 'block' : 'none');
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			/*input_binding*/ ctx[10](null);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EditorModal', slots, []);
    	let dispatcher = new createEventDispatcher();
    	let { show = false } = $$props;
    	let { text = '' } = $$props;
    	let { event = '' } = $$props;
    	let { title = '' } = $$props;
    	let { label = '' } = $$props;
    	let { error = false } = $$props;
    	let refs = {};

    	function confirm() {
    		if (text) {
    			console.log('dispatcher', text, event);
    			dispatcher(event, text);
    			cancel();
    		} else {
    			$$invalidate(2, error = true);
    			refs.text.focus();
    		}
    	}

    	function cancel() {
    		$$invalidate(0, show = false);
    		$$invalidate(1, text = '');
    		$$invalidate(2, error = false);
    	}

    	function hideError() {
    		$$invalidate(2, error = false);
    	}

    	const writable_props = ['show', 'text', 'event', 'title', 'label', 'error'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<EditorModal> was created with unknown prop '${key}'`);
    	});

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			refs.text = $$value;
    			$$invalidate(5, refs);
    		});
    	}

    	function input_input_handler() {
    		text = this.value;
    		$$invalidate(1, text);
    	}

    	const submit_handler = event => confirm();

    	$$self.$$set = $$props => {
    		if ('show' in $$props) $$invalidate(0, show = $$props.show);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('event' in $$props) $$invalidate(9, event = $$props.event);
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('label' in $$props) $$invalidate(4, label = $$props.label);
    		if ('error' in $$props) $$invalidate(2, error = $$props.error);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		dispatcher,
    		show,
    		text,
    		event,
    		title,
    		label,
    		error,
    		refs,
    		confirm,
    		cancel,
    		hideError
    	});

    	$$self.$inject_state = $$props => {
    		if ('dispatcher' in $$props) dispatcher = $$props.dispatcher;
    		if ('show' in $$props) $$invalidate(0, show = $$props.show);
    		if ('text' in $$props) $$invalidate(1, text = $$props.text);
    		if ('event' in $$props) $$invalidate(9, event = $$props.event);
    		if ('title' in $$props) $$invalidate(3, title = $$props.title);
    		if ('label' in $$props) $$invalidate(4, label = $$props.label);
    		if ('error' in $$props) $$invalidate(2, error = $$props.error);
    		if ('refs' in $$props) $$invalidate(5, refs = $$props.refs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*show, refs*/ 33) {
    			{
    				if (show) {
    					setTimeout(() => {
    						refs.text.focus();
    					});
    				}
    			}
    		}
    	};

    	return [
    		show,
    		text,
    		error,
    		title,
    		label,
    		refs,
    		confirm,
    		cancel,
    		hideError,
    		event,
    		input_binding,
    		input_input_handler,
    		submit_handler
    	];
    }

    class EditorModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			show: 0,
    			text: 1,
    			event: 9,
    			title: 3,
    			label: 4,
    			error: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditorModal",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get show() {
    		return this.$$.ctx[0];
    	}

    	set show(show) {
    		this.$$set({ show });
    		flush();
    	}

    	get text() {
    		return this.$$.ctx[1];
    	}

    	set text(text) {
    		this.$$set({ text });
    		flush();
    	}

    	get event() {
    		return this.$$.ctx[9];
    	}

    	set event(event) {
    		this.$$set({ event });
    		flush();
    	}

    	get title() {
    		return this.$$.ctx[3];
    	}

    	set title(title) {
    		this.$$set({ title });
    		flush();
    	}

    	get label() {
    		return this.$$.ctx[4];
    	}

    	set label(label) {
    		this.$$set({ label });
    		flush();
    	}

    	get error() {
    		return this.$$.ctx[2];
    	}

    	set error(error) {
    		this.$$set({ error });
    		flush();
    	}
    }

    /* node_modules\cl-editor\src\helpers\EditorColorPicker.svelte generated by Svelte v3.40.3 */
    const file$4 = "node_modules\\cl-editor\\src\\helpers\\EditorColorPicker.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (4:4) {#each btns as btn}
    function create_each_block$2(ctx) {
    	let button;
    	let t_value = (/*btn*/ ctx[9].text || '') + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[5](/*btn*/ ctx[9], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "color-picker-btn svelte-njq4pk");
    			set_style(button, "background-color", /*btn*/ ctx[9].color);
    			add_location(button, file$4, 4, 4, 176);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*btns*/ 2 && t_value !== (t_value = (/*btn*/ ctx[9].text || '') + "")) set_data_dev(t, t_value);

    			if (dirty & /*btns*/ 2) {
    				set_style(button, "background-color", /*btn*/ ctx[9].color);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(4:4) {#each btns as btn}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div2;
    	let div0;
    	let t;
    	let div1;
    	let mounted;
    	let dispose;
    	let each_value = /*btns*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "color-picker-overlay svelte-njq4pk");
    			add_location(div0, file$4, 1, 2, 51);
    			attr_dev(div1, "class", "color-picker-wrapper svelte-njq4pk");
    			add_location(div1, file$4, 2, 2, 113);
    			set_style(div2, "display", /*show*/ ctx[0] ? 'block' : 'none');
    			add_location(div2, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", /*close*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*btns, selectColor*/ 10) {
    				each_value = /*btns*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*show*/ 1) {
    				set_style(div2, "display", /*show*/ ctx[0] ? 'block' : 'none');
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EditorColorPicker', slots, []);
    	const dispatcher = new createEventDispatcher();

    	const colors = [
    		'ffffff',
    		'000000',
    		'eeece1',
    		'1f497d',
    		'4f81bd',
    		'c0504d',
    		'9bbb59',
    		'8064a2',
    		'4bacc6',
    		'f79646',
    		'ffff00',
    		'f2f2f2',
    		'7f7f7f',
    		'ddd9c3',
    		'c6d9f0',
    		'dbe5f1',
    		'f2dcdb',
    		'ebf1dd',
    		'e5e0ec',
    		'dbeef3',
    		'fdeada',
    		'fff2ca',
    		'd8d8d8',
    		'595959',
    		'c4bd97',
    		'8db3e2',
    		'b8cce4',
    		'e5b9b7',
    		'd7e3bc',
    		'ccc1d9',
    		'b7dde8',
    		'fbd5b5',
    		'ffe694',
    		'bfbfbf',
    		'3f3f3f',
    		'938953',
    		'548dd4',
    		'95b3d7',
    		'd99694',
    		'c3d69b',
    		'b2a2c7',
    		'b7dde8',
    		'fac08f',
    		'f2c314',
    		'a5a5a5',
    		'262626',
    		'494429',
    		'17365d',
    		'366092',
    		'953734',
    		'76923c',
    		'5f497a',
    		'92cddc',
    		'e36c09',
    		'c09100',
    		'7f7f7f',
    		'0c0c0c',
    		'1d1b10',
    		'0f243e',
    		'244061',
    		'632423',
    		'4f6128',
    		'3f3151',
    		'31859b',
    		'974806',
    		'7f6000'
    	];

    	const getBtns = () => {
    		const btns = colors.map(color => ({ color: `#${color}` }));
    		btns.push({ text: '#', modal: true });
    		return btns;
    	};

    	let { show = false } = $$props;
    	let { btns = [] } = $$props;
    	let { event = '' } = $$props;

    	onMount(() => {
    		$$invalidate(1, btns = getBtns());
    	});

    	function close() {
    		$$invalidate(0, show = false);
    	}

    	function selectColor(btn) {
    		dispatcher(event, btn);
    		close();
    	}

    	const writable_props = ['show', 'btns', 'event'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<EditorColorPicker> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (btn, event) => selectColor(btn);

    	$$self.$$set = $$props => {
    		if ('show' in $$props) $$invalidate(0, show = $$props.show);
    		if ('btns' in $$props) $$invalidate(1, btns = $$props.btns);
    		if ('event' in $$props) $$invalidate(4, event = $$props.event);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		dispatcher,
    		colors,
    		getBtns,
    		show,
    		btns,
    		event,
    		close,
    		selectColor
    	});

    	$$self.$inject_state = $$props => {
    		if ('show' in $$props) $$invalidate(0, show = $$props.show);
    		if ('btns' in $$props) $$invalidate(1, btns = $$props.btns);
    		if ('event' in $$props) $$invalidate(4, event = $$props.event);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [show, btns, close, selectColor, event, click_handler];
    }

    class EditorColorPicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { show: 0, btns: 1, event: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditorColorPicker",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get show() {
    		throw new Error("<EditorColorPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<EditorColorPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get btns() {
    		throw new Error("<EditorColorPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set btns(value) {
    		throw new Error("<EditorColorPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get event() {
    		throw new Error("<EditorColorPicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set event(value) {
    		throw new Error("<EditorColorPicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const state = (function(name) {
      let state = {
        actionBtns: [],
        actionObj: {}
      };

      const { subscribe, set, update } = writable(state);

      return {
        name,
        set,
        update,
        subscribe
      }
    });

    const createStateStore = state;

    /* node_modules\cl-editor\src\Editor.svelte generated by Svelte v3.40.3 */

    const { Object: Object_1 } = globals;
    const file$3 = "node_modules\\cl-editor\\src\\Editor.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[37] = list[i];
    	return child_ctx;
    }

    // (8:4) {#each $state.actionBtns as action}
    function create_each_block$1(ctx) {
    	let button;
    	let html_tag;
    	let raw_value = /*action*/ ctx[37].icon + "";
    	let t;
    	let button_class_value;
    	let button_title_value;
    	let button_disabled_value;
    	let mounted;
    	let dispose;

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[23](/*action*/ ctx[37], ...args);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			html_tag = new HtmlTag();
    			t = space();
    			html_tag.a = t;
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", button_class_value = "cl-button " + (/*action*/ ctx[37].active ? 'active' : '') + " svelte-1a534py");
    			attr_dev(button, "title", button_title_value = /*action*/ ctx[37].title);
    			button.disabled = button_disabled_value = /*action*/ ctx[37].disabled;
    			add_location(button, file$3, 8, 6, 302);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			html_tag.m(raw_value, button);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$state*/ 8 && raw_value !== (raw_value = /*action*/ ctx[37].icon + "")) html_tag.p(raw_value);

    			if (dirty[0] & /*$state*/ 8 && button_class_value !== (button_class_value = "cl-button " + (/*action*/ ctx[37].active ? 'active' : '') + " svelte-1a534py")) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty[0] & /*$state*/ 8 && button_title_value !== (button_title_value = /*action*/ ctx[37].title)) {
    				attr_dev(button, "title", button_title_value);
    			}

    			if (dirty[0] & /*$state*/ 8 && button_disabled_value !== (button_disabled_value = /*action*/ ctx[37].disabled)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(8:4) {#each $state.actionBtns as action}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let textarea;
    	let t2;
    	let editormodal;
    	let t3;
    	let editorcolorpicker;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*$state*/ ctx[3].actionBtns;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	let editormodal_props = {};
    	editormodal = new EditorModal({ props: editormodal_props, $$inline: true });
    	/*editormodal_binding*/ ctx[30](editormodal);
    	let editorcolorpicker_props = {};

    	editorcolorpicker = new EditorColorPicker({
    			props: editorcolorpicker_props,
    			$$inline: true
    		});

    	/*editorcolorpicker_binding*/ ctx[31](editorcolorpicker);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			textarea = element("textarea");
    			t2 = space();
    			create_component(editormodal.$$.fragment);
    			t3 = space();
    			create_component(editorcolorpicker.$$.fragment);
    			attr_dev(div0, "class", "cl-actionbar svelte-1a534py");
    			add_location(div0, file$3, 6, 2, 229);
    			attr_dev(div1, "id", /*contentId*/ ctx[1]);
    			attr_dev(div1, "class", "cl-content svelte-1a534py");
    			set_style(div1, "height", /*height*/ ctx[0]);
    			attr_dev(div1, "contenteditable", "true");
    			add_location(div1, file$3, 17, 2, 568);
    			attr_dev(textarea, "class", "cl-textarea svelte-1a534py");
    			set_style(textarea, "max-height", /*height*/ ctx[0]);
    			set_style(textarea, "min-height", /*height*/ ctx[0]);
    			add_location(textarea, file$3, 28, 2, 911);
    			attr_dev(div2, "class", "cl svelte-1a534py");
    			add_location(div2, file$3, 5, 0, 172);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			/*div1_binding*/ ctx[24](div1);
    			append_dev(div2, t1);
    			append_dev(div2, textarea);
    			/*textarea_binding*/ ctx[29](textarea);
    			append_dev(div2, t2);
    			mount_component(editormodal, div2, null);
    			append_dev(div2, t3);
    			mount_component(editorcolorpicker, div2, null);
    			/*div2_binding*/ ctx[32](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "click", /*click_handler*/ ctx[22], false, false, false),
    					listen_dev(div1, "input", /*input_handler*/ ctx[25], false, false, false),
    					listen_dev(div1, "mouseup", /*mouseup_handler*/ ctx[26], false, false, false),
    					listen_dev(div1, "keyup", /*keyup_handler*/ ctx[27], false, false, false),
    					listen_dev(div1, "paste", /*paste_handler*/ ctx[28], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$state, _btnClicked*/ 136) {
    				each_value = /*$state*/ ctx[3].actionBtns;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty[0] & /*contentId*/ 2) {
    				attr_dev(div1, "id", /*contentId*/ ctx[1]);
    			}

    			if (!current || dirty[0] & /*height*/ 1) {
    				set_style(div1, "height", /*height*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*height*/ 1) {
    				set_style(textarea, "max-height", /*height*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*height*/ 1) {
    				set_style(textarea, "min-height", /*height*/ ctx[0]);
    			}

    			const editormodal_changes = {};
    			editormodal.$set(editormodal_changes);
    			const editorcolorpicker_changes = {};
    			editorcolorpicker.$set(editorcolorpicker_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(editormodal.$$.fragment, local);
    			transition_in(editorcolorpicker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(editormodal.$$.fragment, local);
    			transition_out(editorcolorpicker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			/*div1_binding*/ ctx[24](null);
    			/*textarea_binding*/ ctx[29](null);
    			/*editormodal_binding*/ ctx[30](null);
    			destroy_component(editormodal);
    			/*editorcolorpicker_binding*/ ctx[31](null);
    			destroy_component(editorcolorpicker);
    			/*div2_binding*/ ctx[32](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const editors = [];

    function instance$3($$self, $$props, $$invalidate) {
    	let $references;
    	let $helper;
    	let $state;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Editor', slots, []);
    	let dispatcher = new createEventDispatcher();
    	let { actions = [] } = $$props;
    	let { height = '300px' } = $$props;
    	let { html = '' } = $$props;
    	let { contentId = '' } = $$props;
    	let { removeFormatTags = ['h1', 'h2', 'blockquote'] } = $$props;

    	let helper = writable({
    		foreColor: false,
    		backColor: false,
    		foreColorModal: false,
    		backColorModal: false,
    		image: false,
    		link: false,
    		showEditor: true,
    		blurActive: false
    	});

    	validate_store(helper, 'helper');
    	component_subscribe($$self, helper, value => $$invalidate(33, $helper = value));
    	editors.push({});
    	let contextKey = "editor_" + editors.length;
    	let state = createStateStore(contextKey);
    	validate_store(state, 'state');
    	component_subscribe($$self, state, value => $$invalidate(3, $state = value));
    	let references = writable({});
    	validate_store(references, 'references');
    	component_subscribe($$self, references, value => $$invalidate(2, $references = value));
    	set_store_value(state, $state.actionObj = getNewActionObj(defaultActions, actions), $state);

    	let context = {
    		exec: exec$1,
    		getHtml,
    		getText,
    		setHtml,
    		saveRange: saveRange$1,
    		restoreRange: restoreRange$1,
    		helper,
    		references,
    		state,
    		removeFormatTags
    	};

    	setContext(contextKey, context);

    	onMount(() => {
    		set_store_value(state, $state.actionBtns = getActionBtns($state.actionObj), $state);
    		setHtml(html);
    	});

    	function _btnClicked(action) {
    		$references.editor.focus();
    		saveRange$1($references.editor);
    		restoreRange$1($references.editor);
    		action.result.call(context);
    		_handleButtonStatus();
    	}

    	function _handleButtonStatus(clearBtns) {
    		const tags = clearBtns
    		? []
    		: getTagsRecursive(document.getSelection().focusNode);

    		Object.keys($state.actionObj).forEach(action => set_store_value(state, $state.actionObj[action].active = false, $state));
    		tags.forEach(tag => ($state.actionObj[tag.toLowerCase()] || {}).active = true);
    		set_store_value(state, $state.actionBtns = getActionBtns($state.actionObj), $state);
    		state.set($state);
    	}

    	function _onPaste(event) {
    		event.preventDefault();

    		exec$1('insertHTML', event.clipboardData.getData('text/html')
    		? cleanHtml(event.clipboardData.getData('text/html'))
    		: event.clipboardData.getData('text'));
    	}

    	function _onChange(event) {
    		dispatcher('change', event);
    	}

    	function _documentClick(event) {
    		if (!isEditorClick(event.target, $references.editorWrapper) && $helper.blurActive) {
    			dispatcher('blur', event);
    		}

    		set_store_value(helper, $helper.blurActive = true, $helper);
    	}

    	function exec$1(cmd, value) {
    		exec(cmd, value);
    	}

    	

    	function getHtml(sanitize) {
    		return sanitize
    		? removeBadTags($references.editor.innerHTML)
    		: $references.editor.innerHTML;
    	}

    	function getText() {
    		return $references.editor.innerText;
    	}

    	function setHtml(html, sanitize) {
    		const htmlData = sanitize ? removeBadTags(html) : html || '';
    		set_store_value(references, $references.editor.innerHTML = htmlData, $references);
    		set_store_value(references, $references.raw.value = htmlData, $references);
    	}

    	function saveRange$1() {
    		saveRange($references.editor);
    	}

    	function restoreRange$1() {
    		restoreRange($references.editor);
    	}

    	const refs = $references;
    	const writable_props = ['actions', 'height', 'html', 'contentId', 'removeFormatTags'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Editor> was created with unknown prop '${key}'`);
    	});

    	const click_handler = event => _documentClick(event);
    	const click_handler_1 = (action, event) => _btnClicked(action);

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			$references.editor = $$value;
    			references.set($references);
    		});
    	}

    	const input_handler = event => _onChange(event.target.innerHTML);
    	const mouseup_handler = () => _handleButtonStatus();
    	const keyup_handler = () => _handleButtonStatus();
    	const paste_handler = event => _onPaste(event);

    	function textarea_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			$references.raw = $$value;
    			references.set($references);
    		});
    	}

    	function editormodal_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			$references.modal = $$value;
    			references.set($references);
    		});
    	}

    	function editorcolorpicker_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			$references.colorPicker = $$value;
    			references.set($references);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			$references.editorWrapper = $$value;
    			references.set($references);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('actions' in $$props) $$invalidate(12, actions = $$props.actions);
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    		if ('html' in $$props) $$invalidate(13, html = $$props.html);
    		if ('contentId' in $$props) $$invalidate(1, contentId = $$props.contentId);
    		if ('removeFormatTags' in $$props) $$invalidate(14, removeFormatTags = $$props.removeFormatTags);
    	};

    	$$self.$capture_state = () => ({
    		editors,
    		getTagsRecursive,
    		_saveRange: saveRange,
    		_restoreRange: restoreRange,
    		_exec: exec,
    		cleanHtml,
    		getActionBtns,
    		getNewActionObj,
    		removeBadTags,
    		isEditorClick,
    		defaultActions,
    		EditorModal,
    		EditorColorPicker,
    		onMount,
    		createEventDispatcher,
    		setContext,
    		getContext,
    		createStateStore,
    		writable,
    		dispatcher,
    		actions,
    		height,
    		html,
    		contentId,
    		removeFormatTags,
    		helper,
    		contextKey,
    		state,
    		references,
    		context,
    		_btnClicked,
    		_handleButtonStatus,
    		_onPaste,
    		_onChange,
    		_documentClick,
    		exec: exec$1,
    		getHtml,
    		getText,
    		setHtml,
    		saveRange: saveRange$1,
    		restoreRange: restoreRange$1,
    		refs,
    		$references,
    		$helper,
    		$state
    	});

    	$$self.$inject_state = $$props => {
    		if ('dispatcher' in $$props) dispatcher = $$props.dispatcher;
    		if ('actions' in $$props) $$invalidate(12, actions = $$props.actions);
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    		if ('html' in $$props) $$invalidate(13, html = $$props.html);
    		if ('contentId' in $$props) $$invalidate(1, contentId = $$props.contentId);
    		if ('removeFormatTags' in $$props) $$invalidate(14, removeFormatTags = $$props.removeFormatTags);
    		if ('helper' in $$props) $$invalidate(4, helper = $$props.helper);
    		if ('contextKey' in $$props) contextKey = $$props.contextKey;
    		if ('state' in $$props) $$invalidate(5, state = $$props.state);
    		if ('references' in $$props) $$invalidate(6, references = $$props.references);
    		if ('context' in $$props) context = $$props.context;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		height,
    		contentId,
    		$references,
    		$state,
    		helper,
    		state,
    		references,
    		_btnClicked,
    		_handleButtonStatus,
    		_onPaste,
    		_onChange,
    		_documentClick,
    		actions,
    		html,
    		removeFormatTags,
    		exec$1,
    		getHtml,
    		getText,
    		setHtml,
    		saveRange$1,
    		restoreRange$1,
    		refs,
    		click_handler,
    		click_handler_1,
    		div1_binding,
    		input_handler,
    		mouseup_handler,
    		keyup_handler,
    		paste_handler,
    		textarea_binding,
    		editormodal_binding,
    		editorcolorpicker_binding,
    		div2_binding
    	];
    }

    class Editor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$3,
    			create_fragment$3,
    			safe_not_equal,
    			{
    				actions: 12,
    				height: 0,
    				html: 13,
    				contentId: 1,
    				removeFormatTags: 14,
    				exec: 15,
    				getHtml: 16,
    				getText: 17,
    				setHtml: 18,
    				saveRange: 19,
    				restoreRange: 20,
    				refs: 21
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Editor",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get actions() {
    		return this.$$.ctx[12];
    	}

    	set actions(actions) {
    		this.$$set({ actions });
    		flush();
    	}

    	get height() {
    		return this.$$.ctx[0];
    	}

    	set height(height) {
    		this.$$set({ height });
    		flush();
    	}

    	get html() {
    		return this.$$.ctx[13];
    	}

    	set html(html) {
    		this.$$set({ html });
    		flush();
    	}

    	get contentId() {
    		return this.$$.ctx[1];
    	}

    	set contentId(contentId) {
    		this.$$set({ contentId });
    		flush();
    	}

    	get removeFormatTags() {
    		return this.$$.ctx[14];
    	}

    	set removeFormatTags(removeFormatTags) {
    		this.$$set({ removeFormatTags });
    		flush();
    	}

    	get exec() {
    		return this.$$.ctx[15];
    	}

    	set exec(value) {
    		throw new Error("<Editor>: Cannot set read-only property 'exec'");
    	}

    	get getHtml() {
    		return this.$$.ctx[16];
    	}

    	set getHtml(value) {
    		throw new Error("<Editor>: Cannot set read-only property 'getHtml'");
    	}

    	get getText() {
    		return this.$$.ctx[17];
    	}

    	set getText(value) {
    		throw new Error("<Editor>: Cannot set read-only property 'getText'");
    	}

    	get setHtml() {
    		return this.$$.ctx[18];
    	}

    	set setHtml(value) {
    		throw new Error("<Editor>: Cannot set read-only property 'setHtml'");
    	}

    	get saveRange() {
    		return this.$$.ctx[19];
    	}

    	set saveRange(value) {
    		throw new Error("<Editor>: Cannot set read-only property 'saveRange'");
    	}

    	get restoreRange() {
    		return this.$$.ctx[20];
    	}

    	set restoreRange(value) {
    		throw new Error("<Editor>: Cannot set read-only property 'restoreRange'");
    	}

    	get refs() {
    		return this.$$.ctx[21];
    	}

    	set refs(value) {
    		throw new Error("<Editor>: Cannot set read-only property 'refs'");
    	}
    }

    /* src\editor\TextEditor.svelte generated by Svelte v3.40.3 */
    const file$2 = "src\\editor\\TextEditor.svelte";

    function create_fragment$2(ctx) {
    	let main;
    	let editor_1;
    	let current;

    	let editor_1_props = {
    		html: /*html2*/ ctx[0],
    		actions: [
    			"h1",
    			"h2",
    			"b",
    			"i",
    			"strike",
    			"ul",
    			"left",
    			"center",
    			"justify",
    			"undo",
    			"redo"
    		]
    	};

    	editor_1 = new Editor({ props: editor_1_props, $$inline: true });
    	/*editor_1_binding*/ ctx[5](editor_1);
    	editor_1.$on("change", /*change_handler*/ ctx[6]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(editor_1.$$.fragment);
    			attr_dev(main, "class", "svelte-t7vahp");
    			add_location(main, file$2, 37, 0, 801);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(editor_1, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const editor_1_changes = {};
    			if (dirty & /*html2*/ 1) editor_1_changes.html = /*html2*/ ctx[0];
    			editor_1.$set(editor_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(editor_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(editor_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			/*editor_1_binding*/ ctx[5](null);
    			destroy_component(editor_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let html2;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TextEditor', slots, []);
    	let { inventory_id = 0 } = $$props;
    	let editorinfo;

    	editor_info.subscribe(value => {
    		$$invalidate(4, editorinfo = value);
    	});

    	function handleContentEditor(e) {
    		let new_editinfo = editorinfo;
    		new_editinfo.current_project.inventory[inventory_id].html = e.detail;
    		editor_info.set(new_editinfo);
    	}

    	let editor;

    	onMount(() => {
    		(editor.setHtml(html2));
    	});

    	function hack() {
    		if (editor != undefined) {
    			if (editor.getHtml() != html2) {
    				editor.setHtml(html2, 1);
    			}
    		}
    	}

    	const writable_props = ['inventory_id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TextEditor> was created with unknown prop '${key}'`);
    	});

    	function editor_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			editor = $$value;
    			$$invalidate(1, editor);
    		});
    	}

    	const change_handler = evt => handleContentEditor(evt);

    	$$self.$$set = $$props => {
    		if ('inventory_id' in $$props) $$invalidate(3, inventory_id = $$props.inventory_id);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		inventory_id,
    		editor_info,
    		editorinfo,
    		handleContentEditor,
    		Editor,
    		editor,
    		hack,
    		html2
    	});

    	$$self.$inject_state = $$props => {
    		if ('inventory_id' in $$props) $$invalidate(3, inventory_id = $$props.inventory_id);
    		if ('editorinfo' in $$props) $$invalidate(4, editorinfo = $$props.editorinfo);
    		if ('editor' in $$props) $$invalidate(1, editor = $$props.editor);
    		if ('html2' in $$props) $$invalidate(0, html2 = $$props.html2);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*editorinfo, inventory_id*/ 24) {
    			$$invalidate(0, html2 = editorinfo.current_project.inventory[inventory_id].html);
    		}

    		if ($$self.$$.dirty & /*html2*/ 1) {
    			(hack());
    		}
    	};

    	return [
    		html2,
    		editor,
    		handleContentEditor,
    		inventory_id,
    		editorinfo,
    		editor_1_binding,
    		change_handler
    	];
    }

    class TextEditor extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { inventory_id: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextEditor",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get inventory_id() {
    		throw new Error("<TextEditor>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inventory_id(value) {
    		throw new Error("<TextEditor>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\editor\IDE.svelte generated by Svelte v3.40.3 */
    const file$1 = "src\\editor\\IDE.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (41:2) {#if editorinfo.show_filepicker == true}
    function create_if_block_6(ctx) {
    	let filepicker;
    	let current;
    	filepicker = new FilePicker({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(filepicker.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(filepicker, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(filepicker.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(filepicker.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(filepicker, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(41:2) {#if editorinfo.show_filepicker == true}",
    		ctx
    	});

    	return block;
    }

    // (49:2) {#if editorinfo.show_menu == true}
    function create_if_block_5(ctx) {
    	let menu;
    	let current;

    	menu = new Menu({
    			props: { key: /*menuIndex*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(menu.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menu, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menu_changes = {};
    			if (dirty & /*menuIndex*/ 2) menu_changes.key = /*menuIndex*/ ctx[1];
    			menu.$set(menu_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menu, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(49:2) {#if editorinfo.show_menu == true}",
    		ctx
    	});

    	return block;
    }

    // (56:8) {#each editorinfo.left_panel.tabs as t, i}
    function create_each_block_1(ctx) {
    	let tab;
    	let current;

    	tab = new Tab({
    			props: {
    				key: /*i*/ ctx[11],
    				id: /*i*/ ctx[11],
    				panel: "left",
    				active: /*editorinfo*/ ctx[0].activePanel == "left" && /*editorinfo*/ ctx[0].activeTab == /*i*/ ctx[11],
    				text: /*t*/ ctx[9].name,
    				icon_type: /*t*/ ctx[9].type
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tab_changes = {};
    			if (dirty & /*editorinfo*/ 1) tab_changes.active = /*editorinfo*/ ctx[0].activePanel == "left" && /*editorinfo*/ ctx[0].activeTab == /*i*/ ctx[11];
    			if (dirty & /*editorinfo*/ 1) tab_changes.text = /*t*/ ctx[9].name;
    			if (dirty & /*editorinfo*/ 1) tab_changes.icon_type = /*t*/ ctx[9].type;
    			tab.$set(tab_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(56:8) {#each editorinfo.left_panel.tabs as t, i}",
    		ctx
    	});

    	return block;
    }

    // (60:8) {#if editorinfo.left_panel.tabs.length == 0}
    function create_if_block_4(ctx) {
    	let tab;
    	let current;

    	tab = new Tab({
    			props: {
    				active: true,
    				text: "Empty Tab",
    				icon_type: "empty"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(60:8) {#if editorinfo.left_panel.tabs.length == 0}",
    		ctx
    	});

    	return block;
    }

    // (66:8) {#if editorinfo.left_panel.tabs[editorinfo.left_panel.current_tab] != undefined && editorinfo.left_panel.tabs[editorinfo.left_panel.current_tab].type == "plasmid"}
    function create_if_block_3(ctx) {
    	let plasmid;
    	let current;

    	plasmid = new Plasmid({
    			props: {
    				src: /*editorinfo*/ ctx[0].current_project.inventory[/*editorinfo*/ ctx[0].left_panel.tabs[/*editorinfo*/ ctx[0].left_panel.current_tab].uuid]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(plasmid.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(plasmid, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const plasmid_changes = {};
    			if (dirty & /*editorinfo*/ 1) plasmid_changes.src = /*editorinfo*/ ctx[0].current_project.inventory[/*editorinfo*/ ctx[0].left_panel.tabs[/*editorinfo*/ ctx[0].left_panel.current_tab].uuid];
    			plasmid.$set(plasmid_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(plasmid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(plasmid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(plasmid, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(66:8) {#if editorinfo.left_panel.tabs[editorinfo.left_panel.current_tab] != undefined && editorinfo.left_panel.tabs[editorinfo.left_panel.current_tab].type == \\\"plasmid\\\"}",
    		ctx
    	});

    	return block;
    }

    // (70:8) {#if editorinfo.left_panel.tabs[editorinfo.left_panel.current_tab] != undefined && editorinfo.left_panel.tabs[editorinfo.left_panel.current_tab].type == "text-editor"}
    function create_if_block_2(ctx) {
    	let texteditor;
    	let current;

    	texteditor = new TextEditor({
    			props: {
    				inventory_id: /*editorinfo*/ ctx[0].left_panel.tabs[/*editorinfo*/ ctx[0].left_panel.current_tab].uuid
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(texteditor.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(texteditor, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const texteditor_changes = {};
    			if (dirty & /*editorinfo*/ 1) texteditor_changes.inventory_id = /*editorinfo*/ ctx[0].left_panel.tabs[/*editorinfo*/ ctx[0].left_panel.current_tab].uuid;
    			texteditor.$set(texteditor_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(texteditor.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(texteditor.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(texteditor, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(70:8) {#if editorinfo.left_panel.tabs[editorinfo.left_panel.current_tab] != undefined && editorinfo.left_panel.tabs[editorinfo.left_panel.current_tab].type == \\\"text-editor\\\"}",
    		ctx
    	});

    	return block;
    }

    // (76:4) {#if editorinfo.split_window == true}
    function create_if_block$1(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let each_value = /*editorinfo*/ ctx[0].right_panel.tabs;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = /*editorinfo*/ ctx[0].right_panel.tabs.length == 0 && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			attr_dev(div0, "class", "tabs hide-native-scrollbar svelte-1h30ys2");
    			add_location(div0, file$1, 77, 6, 2637);
    			attr_dev(div1, "class", "panel svelte-1h30ys2");
    			add_location(div1, file$1, 87, 6, 3057);
    			attr_dev(div2, "class", "window svelte-1h30ys2");
    			add_location(div2, file$1, 76, 4, 2609);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div0, t0);
    			if (if_block) if_block.m(div0, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*editorinfo*/ 1) {
    				each_value = /*editorinfo*/ ctx[0].right_panel.tabs;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, t0);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*editorinfo*/ ctx[0].right_panel.tabs.length == 0) {
    				if (if_block) {
    					if (dirty & /*editorinfo*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(76:4) {#if editorinfo.split_window == true}",
    		ctx
    	});

    	return block;
    }

    // (79:8) {#each editorinfo.right_panel.tabs as t, i}
    function create_each_block(ctx) {
    	let tab;
    	let current;

    	tab = new Tab({
    			props: {
    				id: /*i*/ ctx[11],
    				panel: "right",
    				active: /*editorinfo*/ ctx[0].activePanel == "right" && /*editorinfo*/ ctx[0].activeTab == /*i*/ ctx[11],
    				text: /*t*/ ctx[9].name,
    				icon_type: /*t*/ ctx[9].type
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tab_changes = {};
    			if (dirty & /*editorinfo*/ 1) tab_changes.active = /*editorinfo*/ ctx[0].activePanel == "right" && /*editorinfo*/ ctx[0].activeTab == /*i*/ ctx[11];
    			if (dirty & /*editorinfo*/ 1) tab_changes.text = /*t*/ ctx[9].name;
    			if (dirty & /*editorinfo*/ 1) tab_changes.icon_type = /*t*/ ctx[9].type;
    			tab.$set(tab_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(79:8) {#each editorinfo.right_panel.tabs as t, i}",
    		ctx
    	});

    	return block;
    }

    // (83:8) {#if editorinfo.right_panel.tabs.length == 0}
    function create_if_block_1$1(ctx) {
    	let tab;
    	let current;

    	tab = new Tab({
    			props: {
    				active: false,
    				text: "Empty Tab",
    				icon_type: "empty"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(83:8) {#if editorinfo.right_panel.tabs.length == 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let t0;
    	let div0;
    	let h10;
    	let t2;
    	let h11;
    	let t4;
    	let h12;
    	let t6;
    	let t7;
    	let div4;
    	let div3;
    	let div1;
    	let t8;
    	let t9;
    	let div2;
    	let t10;
    	let t11;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*editorinfo*/ ctx[0].show_filepicker == true && create_if_block_6(ctx);
    	let if_block1 = /*editorinfo*/ ctx[0].show_menu == true && create_if_block_5(ctx);
    	let each_value_1 = /*editorinfo*/ ctx[0].left_panel.tabs;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block2 = /*editorinfo*/ ctx[0].left_panel.tabs.length == 0 && create_if_block_4(ctx);
    	let if_block3 = /*editorinfo*/ ctx[0].left_panel.tabs[/*editorinfo*/ ctx[0].left_panel.current_tab] != undefined && /*editorinfo*/ ctx[0].left_panel.tabs[/*editorinfo*/ ctx[0].left_panel.current_tab].type == "plasmid" && create_if_block_3(ctx);
    	let if_block4 = /*editorinfo*/ ctx[0].left_panel.tabs[/*editorinfo*/ ctx[0].left_panel.current_tab] != undefined && /*editorinfo*/ ctx[0].left_panel.tabs[/*editorinfo*/ ctx[0].left_panel.current_tab].type == "text-editor" && create_if_block_2(ctx);
    	let if_block5 = /*editorinfo*/ ctx[0].split_window == true && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			h10 = element("h1");
    			h10.textContent = "FILE";
    			t2 = space();
    			h11 = element("h1");
    			h11.textContent = "VIEW";
    			t4 = space();
    			h12 = element("h1");
    			h12.textContent = "HELP";
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			div4 = element("div");
    			div3 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			if (if_block2) if_block2.c();
    			t9 = space();
    			div2 = element("div");
    			if (if_block3) if_block3.c();
    			t10 = space();
    			if (if_block4) if_block4.c();
    			t11 = space();
    			if (if_block5) if_block5.c();
    			attr_dev(h10, "class", "menubar-item svelte-1h30ys2");
    			add_location(h10, file$1, 44, 4, 1119);
    			attr_dev(h11, "class", "menubar-item svelte-1h30ys2");
    			add_location(h11, file$1, 45, 4, 1188);
    			attr_dev(h12, "class", "menubar-item svelte-1h30ys2");
    			add_location(h12, file$1, 46, 4, 1257);
    			attr_dev(div0, "class", "menubar svelte-1h30ys2");
    			add_location(div0, file$1, 43, 2, 1092);
    			attr_dev(div1, "class", "tabs hide-native-scrollbar svelte-1h30ys2");
    			add_location(div1, file$1, 54, 6, 1467);
    			attr_dev(div2, "class", "panel svelte-1h30ys2");
    			add_location(div2, file$1, 64, 6, 1890);
    			attr_dev(div3, "class", "window svelte-1h30ys2");
    			add_location(div3, file$1, 53, 4, 1439);
    			attr_dev(div4, "class", "windows svelte-1h30ys2");
    			add_location(div4, file$1, 52, 2, 1412);
    			attr_dev(main, "class", "svelte-1h30ys2");
    			add_location(main, file$1, 39, 0, 1010);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t0);
    			append_dev(main, div0);
    			append_dev(div0, h10);
    			append_dev(div0, t2);
    			append_dev(div0, h11);
    			append_dev(div0, t4);
    			append_dev(div0, h12);
    			append_dev(main, t6);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t7);
    			append_dev(main, div4);
    			append_dev(div4, div3);
    			append_dev(div3, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t8);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div3, t9);
    			append_dev(div3, div2);
    			if (if_block3) if_block3.m(div2, null);
    			append_dev(div2, t10);
    			if (if_block4) if_block4.m(div2, null);
    			append_dev(div4, t11);
    			if (if_block5) if_block5.m(div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(h10, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(h11, "click", /*click_handler_1*/ ctx[4], false, false, false),
    					listen_dev(h12, "click", /*click_handler_2*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*editorinfo*/ ctx[0].show_filepicker == true) {
    				if (if_block0) {
    					if (dirty & /*editorinfo*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_6(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(main, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*editorinfo*/ ctx[0].show_menu == true) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*editorinfo*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_5(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(main, t7);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*editorinfo*/ 1) {
    				each_value_1 = /*editorinfo*/ ctx[0].left_panel.tabs;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, t8);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*editorinfo*/ ctx[0].left_panel.tabs.length == 0) {
    				if (if_block2) {
    					if (dirty & /*editorinfo*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_4(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div1, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*editorinfo*/ ctx[0].left_panel.tabs[/*editorinfo*/ ctx[0].left_panel.current_tab] != undefined && /*editorinfo*/ ctx[0].left_panel.tabs[/*editorinfo*/ ctx[0].left_panel.current_tab].type == "plasmid") {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty & /*editorinfo*/ 1) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_3(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div2, t10);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*editorinfo*/ ctx[0].left_panel.tabs[/*editorinfo*/ ctx[0].left_panel.current_tab] != undefined && /*editorinfo*/ ctx[0].left_panel.tabs[/*editorinfo*/ ctx[0].left_panel.current_tab].type == "text-editor") {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty & /*editorinfo*/ 1) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_2(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div2, null);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (/*editorinfo*/ ctx[0].split_window == true) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);

    					if (dirty & /*editorinfo*/ 1) {
    						transition_in(if_block5, 1);
    					}
    				} else {
    					if_block5 = create_if_block$1(ctx);
    					if_block5.c();
    					transition_in(if_block5, 1);
    					if_block5.m(div4, null);
    				}
    			} else if (if_block5) {
    				group_outros();

    				transition_out(if_block5, 1, 1, () => {
    					if_block5 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			transition_in(if_block5);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			transition_out(if_block5);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_each(each_blocks, detaching);
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IDE', slots, []);
    	let editorinfo;

    	//Current tab in left panel
    	let left_tab;

    	//Current tab in right panel
    	let right_tab;

    	editor_info.subscribe(value => {
    		$$invalidate(0, editorinfo = value);
    	});

    	function isPlasmidTab() {
    		if (editorinfo.left_panel.tabs[editorinfo.left_panel.current_tab] == undefined) return false;
    		if (editorinfo.left_panel.tabs[editorinfo.left_panel.current_tab].type == "plasmid") return true;
    		return false;
    	}

    	let menuIndex = 0;

    	function showMenu(index) {
    		$$invalidate(1, menuIndex = index);
    		let new_editinfo = editorinfo;
    		new_editinfo.show_menu = true;
    		editor_info.set(new_editinfo);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IDE> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => showMenu(0);
    	const click_handler_1 = () => showMenu(1);
    	const click_handler_2 = () => showMenu(2);

    	$$self.$capture_state = () => ({
    		Tab,
    		Plasmid,
    		FilePicker,
    		Menu,
    		TextEditor,
    		GeneAMA,
    		getData,
    		editor_info,
    		editorinfo,
    		left_tab,
    		right_tab,
    		isPlasmidTab,
    		menuIndex,
    		showMenu
    	});

    	$$self.$inject_state = $$props => {
    		if ('editorinfo' in $$props) $$invalidate(0, editorinfo = $$props.editorinfo);
    		if ('left_tab' in $$props) left_tab = $$props.left_tab;
    		if ('right_tab' in $$props) right_tab = $$props.right_tab;
    		if ('menuIndex' in $$props) $$invalidate(1, menuIndex = $$props.menuIndex);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		editorinfo,
    		menuIndex,
    		showMenu,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class IDE extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IDE",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.40.3 */
    const file = "src\\App.svelte";

    // (18:1) {#if current_screen_value == "HOME"}
    function create_if_block_1(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(18:1) {#if current_screen_value == \\\"HOME\\\"}",
    		ctx
    	});

    	return block;
    }

    // (22:1) {#if current_screen_value == "EDITOR"}
    function create_if_block(ctx) {
    	let ide;
    	let current;
    	ide = new IDE({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(ide.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(ide, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ide.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ide.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(ide, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(22:1) {#if current_screen_value == \\\"EDITOR\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let t;
    	let current;
    	let if_block0 = /*current_screen_value*/ ctx[0] == "HOME" && create_if_block_1(ctx);
    	let if_block1 = /*current_screen_value*/ ctx[0] == "EDITOR" && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			add_location(main, file, 16, 0, 350);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t);
    			if (if_block1) if_block1.m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*current_screen_value*/ ctx[0] == "HOME") {
    				if (if_block0) {
    					if (dirty & /*current_screen_value*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(main, t);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*current_screen_value*/ ctx[0] == "EDITOR") {
    				if (if_block1) {
    					if (dirty & /*current_screen_value*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(main, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let current_screen_value;

    	current_screen.subscribe(value => {
    		$$invalidate(0, current_screen_value = value);
    	});

    	new ProjectManager();
    	ProjectManager.getSettings();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Home,
    		IDE,
    		current_screen,
    		current_screen_value,
    		ProjectManager
    	});

    	$$self.$inject_state = $$props => {
    		if ('current_screen_value' in $$props) $$invalidate(0, current_screen_value = $$props.current_screen_value);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [current_screen_value];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
