class NavBar extends HTMLElement {
    get open(){ return this.hasAttribute('open') }
    set open(val){
        if(val){ this.setAttribute('open','') }
        else { this.removeAttribute('open') }
    }
    get barHeight(){ return this.getAttribute('height') || `3.5em` }
    constructor(){
        super();
        this.open = false;
        this.barHeight;
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML += `
        <style>
        :host{
            display:flex;
            width: 100%;
            z-index: 1001;
            height:${this.barHeight};
            top: 0;
            background-color: var(--color1);
            box-shadow: 0 10px 15px rgba(0,0,0,0.19),
             0 6px 6px rgba(0,0,0,0.23);
        }
        :host([fixed]){
            position: fixed;
        }
        #navBarContent{
            display:flex;
            align-items: center;
            justify-content: space-between;
            width:90%;
            margin:auto;
        }
        #navBarResponsiveContent{
            display:flex;
        }
        ::slotted(nav){
            display:flex;
            align-items: center;
        }
        @media (max-width: 650px){
            :host([sticky]){
                position: fixed;
            }
            #toggle-button {
                display: inline-flex;
                align-self:center;
                width:35px;
                cursor: pointer;
                margin: 0 8px 0 8px;
                padding: 0 6px 0 6px;
                border-radius: 4px;
                border: 1px solid black;
            }
            .barra1, .barra2, .barra3 {
                width: 35px;
                height: 5px;
                margin: 6px 0;
                transition: all .3s ease;
                background-color: black;
            }
            :host([open]) .barra1 {
                transform: rotate(-45deg) translate(-9px, 6px) ;
            }
            :host([open]) .barra2 {
                opacity: 0;
            }
            :host([open]) .barra3 {
                transform: rotate(45deg) translate(-8px, -8px) ;
            }
            #navBarResponsiveContent{
                position:fixed;
                height:calc(100vh - ${this.barHeight});
                top:${this.barHeight};
                left: -100%;
                width: 80%;
                transition: all .5s ease;
                flex-direction:column;
            }
            :host([open]) #navBarResponsiveContent{
                left:0
            }
            ::slotted(nav){
                flex-direction: column;
            }
        }
        @media (min-width: 650px){
            :host([sticky]){
                position: sticky;
            }
            #toggle-button{
                display:none;
            }
        }
    </style>
    <div id="toggle-button">
        <div class="icon-menu">
            <div class="barra1"></div>
            <div class="barra2"></div>
            <div class="barra3"></div>
        </div>
    </div>
    <div id="navBarContent">
        <slot name="barBefore"></slot>
        <div id="navBarResponsiveContent">
            <slot></slot>
        </div>
        <slot name="barAfter"></slot>
    </div>
        `;
    }
    toggleOpen(){
        if(this.open){ this.open = false } 
        else{ this.open = true }
    }
    toggleIfOutside(e){
        if(window.matchMedia('(max-width: 650px)').matches){
            if(this.open){
                if(e.target == this || this.contains(e.target)){
                    if(e.path[1].tagName == 'NAV'){ this.toggleOpen() }
                    return 0;
                }
                else{ this.toggleOpen() }
            }
        }
    }
    connectedCallback(){
        this.shadowRoot.getElementById('toggle-button').addEventListener('click', () => this.toggleOpen());
        document.addEventListener('click', this.listener = (e)=> this.toggleIfOutside(e));
    }
    disconnectedCallback(){
        document.removeEventListener('click', this.listener)
    }
}
document.body.innerHTML += `

<style>
    nav a{
        position:relative;
        display: inline-flex;
        padding:15px;
        margin: 5px;
        text-align:center;
        text-decoration: none;
        font-weight: 700;
        font-size: 13px;
        letter-spacing: -.01em;
        color: var(--color5);
        transition: 200ms linear
    }
    nav a:hover{
        color: var(--color4);
    }
    nav a::before{
        content: '';
        position:absolute;
        width: 100%;
        height: 100%;
        top:0;
        left:0;
        background: radial-gradient(ellipse at center, var(--color4) 0%, var(--color5) 100%);
        opacity: 0;
        filter: blur(10px);
        transition: 200ms linear
    }
    nav a:hover::before{
        opacity: .1;
    }
    .dropdown:focus-within > nav{
        height: auto;
    }
    .dropdown nav{
        height: 0;
        overflow: hidden;
        flex-wrap: wrap;
    }
    nav-bar figure > img{
        height:45px;
    }
    @media (max-width: 650px){
        .dropdown{
            display:flex;
            flex-direction: column;
            align-items: center;
        }
        .dropdown > nav{
            display:flex;
            flex-direction: column;
        }
    }
    @media (min-width: 650px){
        .dropdown > nav{
            position:absolute;
        }
    }
</style>
`
window.customElements.define('nav-bar', NavBar)

export { NavBar }