// ================================
//            USAGE OPTIONS
// ================================
//
// 1. **Auto Assign**
// --------------------------------
// To automatically initialize custom select elements, follow these steps:
//
// - Add the following JavaScript code at the end of your HTML file.
// new CustomSelectManager();
//
// - Include the following attributes in your <select> element:
// <select
//   custom-select="true"                                                // Required
//   custom-select-active-class="input-multi-select__add-button--active" // Optional
//   custom-select-placeholder="Select Category"                         // Optional
// >
//
// 2. **Manual Assign**
// --------------------------------
// If you prefer to manually initialize a specific select element, use the following code:
//
// const categoriesSelect = document.getElementById('categories-select');
// new SelectPopup({
//   element: categoriesSelect,
//   placeholder: 'Select Category',
//   activeClass: 'input-multi-select__add-button--active'
// });


class SelectPopup {

    popupClass = 'select-popup';
    activeClass = null;
    popup = null;
    targetElement = null;
    options = [];
    width = 0;
    hasPlaceholder = false;

    constructor(args) {
        const {
            element,
            placeholder,
            activeClass,
        } = args;

        this.targetElement = element;
        if (placeholder) this.addPlaceholder(placeholder);
        if (activeClass) this.activeClass = activeClass;

        this.targetElement.style.appearance = 'none';

        this.setWidth();
        this.targetElement.style.width = this.width.toString() + 'px';
        this.bindClickHandler();
    }

    createPopup() {
        const popup = document.createElement('div');
        popup.className = this.popupClass;
        this.populatePopup(popup);

        const { top, left } = this.calculatePosition();
        popup.style.top = top;
        popup.style.left = left;
        return popup;
    }

    populatePopup(popup) {
        this.extractOptions(this.targetElement);
        const startIdx = this.hasPlaceholder ? 1 : 0;
        this.options.slice(startIdx).forEach(({ value, text }) => {
            const optionLink = document.createElement('a');
            optionLink.innerText = text;
            optionLink.addEventListener('click', () => {
                this.targetElement.value = value;
                this.closePopup(this.targetElement);
                this.createChangeEvent(this.targetElement);
            });
            popup.appendChild(optionLink);
        });
    }

    addPlaceholder(text) {
        if (this.isOptionSelected(this.targetElement)) return;
        this.hasPlaceholder = true;
        const placeHolder = document.createElement('option');
        placeHolder.text = text;
        placeHolder.selected = true;
        this.targetElement.insertBefore(placeHolder, this.targetElement.firstChild);
    }

    openPopup() {
        if (this.activeClass) this.targetElement.classList.add(this.activeClass);
        this.popup = this.createPopup();
        this.popup.style.width = this.width.toString() + 'px';
        this.targetElement.parentNode.insertBefore(this.popup, this.targetElement.nextSibling);
    }

    closePopup() {
        if (this.activeClass) this.targetElement.classList.remove(this.activeClass);
        this.popup.remove();
        this.popup = null;
    }

    setWidth() {
        const tempPopup = this.createPopup();
        tempPopup.style.visibility = 'hidden';
        this.targetElement.parentNode.insertBefore(tempPopup, this.targetElement.nextSibling);

        const popupWidth = tempPopup.getBoundingClientRect().width;
        const selectWidth = this.targetElement.getBoundingClientRect().width;
        this.width = Math.max(popupWidth, selectWidth);
        tempPopup.remove();
    }

    calculatePosition() {
        const { bottom, left } = this.targetElement.getBoundingClientRect();
        const { top: parentTop, left: parentLeft } = this.targetElement.parentElement.getBoundingClientRect();
        return {
            top: bottom - parentTop.toString() + 'px',
            left: left - parentLeft.toString() + 'px'
        };
    }

    extractOptions() {
        this.options = Array.from(this.targetElement.querySelectorAll('option')).map(option => ({
            value: option.value,
            text: option.text
        }));
    }

    bindClickHandler() {
        document.addEventListener('mousedown', (event) => {
            if (event.target === this.targetElement)
                this.handleClickOnSelect(event);
            else if (this.popup)
                this.handleClickOutside(event);
        });
    }

    handleClickOutside(event) {
        if (!this.popup.contains(event.target)) {
            this.closePopup();
        }
    }

    handleClickOnSelect(event) {
        event.preventDefault();
        this.popup ? this.closePopup() : this.openPopup();
    }

    createChangeEvent() {
        const event = new Event('change', {
            bubbles: true,
            cancelable: true
        });
        this.targetElement.dispatchEvent(event);
    }

    isOptionSelected() {
        if (!(this.targetElement instanceof HTMLSelectElement))
            throw new Error('Provided element is not a select element.');
        return Array.from(this.targetElement.options).some(option => option.hasAttribute('selected'));
    }
}

class CustomSelectManager {
    constructor() {
        this.observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    this.checkAndInitSelects();
                }
            }
        });

        this.observer.observe(document.body, { childList: true, subtree: true });
        this.checkAndInitSelects();
    }

    checkAndInitSelects() {
        const selectElements = document.querySelectorAll('select[custom-select="true"]:not(.initialized)');
        selectElements.forEach(select => {
            this.initSelectPopup(select);
            select.classList.add('initialized');
        });
    }

    initSelectPopup(element) {
        const placeholder = element.getAttribute('custom-select-placeholder') || undefined;
        const activeClass = element.getAttribute('custom-select-active-class') || undefined;

        new SelectPopup({
            element: element,
            placeholder: placeholder,
            activeClass: activeClass
        });
    }

    disconnect() {
        this.observer.disconnect();
    }
}
