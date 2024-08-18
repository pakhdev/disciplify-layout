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
    options = [];
    width = 0;
    hasPlaceholder = false;

    constructor(args) {
        const {
            element: targetElement,
            placeholder,
            activeClass,
        } = args;

        if (placeholder) this.addPlaceholder(targetElement, placeholder);
        if (activeClass) this.activeClass = activeClass;

        this.extractOptions(targetElement);
        this.setWidth(targetElement);
        targetElement.style.width = this.width.toString() + 'px';
        this.bindClickHandler(targetElement);
    }

    createPopup(targetElement) {
        const popup = document.createElement('div');
        popup.className = this.popupClass;
        this.populatePopup(popup, targetElement);

        const { top, left } = this.calculatePosition(targetElement);
        popup.style.top = top;
        popup.style.left = left;
        return popup;
    }

    populatePopup(popup, selectElement) {
        const startIdx = this.hasPlaceholder ? 1 : 0;
        this.options.slice(startIdx).forEach(({ value, text }) => {
            const optionLink = document.createElement('a');
            optionLink.innerText = text;
            optionLink.addEventListener('click', () => {
                selectElement.value = value;
                this.closePopup(selectElement);
            });
            popup.appendChild(optionLink);
        });
    }

    addPlaceholder(targetElement, text) {
        this.hasPlaceholder = true;
        const placeHolder = document.createElement('option');
        placeHolder.text = text;
        placeHolder.selected = true;
        targetElement.insertBefore(placeHolder, targetElement.firstChild);
    }

    openPopup(targetElement) {
        if (this.activeClass) targetElement.classList.add(this.activeClass);
        this.popup = this.createPopup(targetElement);
        this.popup.style.width = this.width.toString() + 'px';
        targetElement.parentNode.insertBefore(this.popup, targetElement.nextSibling);
    }

    closePopup(targetElement) {
        if (this.activeClass) targetElement.classList.remove(this.activeClass);
        this.popup.remove();
        this.popup = null;
    }

    setWidth(selectElement) {
        const tempPopup = this.createPopup(selectElement);
        tempPopup.style.visibility = 'hidden';
        selectElement.parentNode.insertBefore(tempPopup, selectElement.nextSibling);

        const popupWidth = tempPopup.getBoundingClientRect().width;
        const selectWidth = selectElement.getBoundingClientRect().width;
        this.width = Math.max(popupWidth, selectWidth);
        tempPopup.remove();
    }

    calculatePosition(targetElement) {
        const { bottom, left } = targetElement.getBoundingClientRect();
        const { top: parentTop, left: parentLeft } = targetElement.parentElement.getBoundingClientRect();
        return {
            top: bottom - parentTop.toString() + 'px',
            left: left - parentLeft.toString() + 'px'
        };
    }

    extractOptions(selectElement) {
        this.options = Array.from(selectElement.querySelectorAll('option')).map(option => ({
            value: option.value,
            text: option.text
        }));
    }

    bindClickHandler(selectElement) {
        selectElement.addEventListener('mousedown', (event) => {
            event.preventDefault();
            this.popup ? this.closePopup(selectElement) : this.openPopup(selectElement);
        });
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
