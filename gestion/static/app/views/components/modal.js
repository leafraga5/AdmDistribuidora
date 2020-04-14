class Modal extends HTMLElement {
    get size(){ 
        switch (this.getAttribute('size')) {
            case 'fullscreen':
                return '100%';
            case 'content':
                return 'auto';
            default:
                return this.getAttribute('size') || '80%'
        }
     }
    set size(val){ val ? this.setAttribute('size', val) : false; }

    constructor(){
        super();
        this.size;
        const shadowRoot = this.attachShadow({mode: 'open'});


        shadowRoot.innerHTML =`
            <div class="modal-content">
                <slot></slot>
            </div>     
            <style>
                :host{
                    position: fixed;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    top: 0px;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                }
                .modal-content{
                    min-width: ${this.size};
                    min-height: ${this.size};
                    background-color: #f1f1f1;
                }
            </style>
        `
    }
    detectModal(e){
        e.path[0] == this ? this.remove() : false;
    }
    connectedCallback(){
        this.addEventListener('click', (e) => this.detectModal(e), false);
        window.addEventListener('keyup', this.listener = (e) => { if (e.key === "Escape"){ this.remove() } } )
        const buttons = this.getElementsByClassName('close-modal-button')
        for (const button in buttons) { buttons.hasOwnProperty(button) ? buttons[button].addEventListener('click', () => this.remove()) : false }
    }
    disconnectedCallback(){
        window.removeEventListener('keyup', this.listener)
    }
}
window.customElements.define('modal-window', Modal)

export { Modal }