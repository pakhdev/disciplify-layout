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
        targetElement.style.width = this.width.toString()+'px';
        this.bindClickHandler(targetElement);
    }

    createPopup(targetElement) {
        const popup = document.createElement('div');
        popup.className = this.popupClass;
        this.populatePopup(popup, targetElement);

        const { top, left} = this.calculatePosition(targetElement);
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
        this.popup.style.width = this.width.toString()+'px';
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
            top: bottom - parentTop.toString()+'px',
            left: left - parentLeft.toString()+'px'
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