class SelectPopup {

    popupClassName = 'select-popup';
    popupElement = null;
    options = [];

    constructor(args) {
        const { element: targetElement, placeHolder } = args;
        if (placeHolder)
            this.setPlaceHolder(targetElement, placeHolder);

        this.scanSelectOptions(targetElement);
        this.handleSelectOnClick(targetElement);
    }

    createPopup(targetElement) {
        const popup = document.createElement('div');
        popup.className = this.popupClassName;
        this.createOptions(popup, targetElement);

        const position = this.calculatePopupPosition(targetElement);
        popup.style.top = position.top;
        popup.style.left = position.left;

        const width = this.findMaxWidth(targetElement, popup);
        popup.style.width = width.toString()+'px';
        targetElement.style.width = width.toString()+'px';

        targetElement.parentNode.insertBefore(popup, targetElement.nextSibling);
        this.popupElement = popup;
    }

    createOptions(popup, targetElement) {
        for (const option of this.options) {
            const optionElement = document.createElement('a');
            optionElement.innerText = option.text;
            optionElement.addEventListener('click', (event) => {
                targetElement.value = option.value;
                this.destroyPopup();
            });
            popup.appendChild(optionElement);
        }
    }

    setPlaceHolder(targetElement, text) {
        const placeHolder = document.createElement('option');
        placeHolder.text = text;
        placeHolder.selected = true;
        targetElement.insertBefore(placeHolder, targetElement.firstChild);
    }

    destroyPopup() {
        this.popupElement.remove();
        this.popupElement = null;
    }

    findMaxWidth(firstElement, secondElement) {
        const firstElementWidth = firstElement.getBoundingClientRect().width;
        const secondElementWidth = secondElement.getBoundingClientRect().width;
        return firstElementWidth > secondElementWidth ? firstElementWidth : secondElementWidth;
    }

    calculatePopupPosition(targetElement) {
        const targetElementRect = targetElement.getBoundingClientRect();
        const parentRect = targetElement.parentElement.getBoundingClientRect();
        const offsetTop = targetElementRect.bottom - parentRect.top;
        const offsetLeft = targetElementRect.left - parentRect.left;
        return {
            top: offsetTop.toString()+'px',
            left: offsetLeft.toString()+'px'
        };
    }

    scanSelectOptions(targetElement) {
        const options = targetElement.querySelectorAll('option');
        options.forEach((option) => {
            this.options.push({
                value: option.value,
                text: option.text
            });
        });
    }

    handleSelectOnClick(targetElement) {
        targetElement.addEventListener('mousedown', (event) => {
            event.preventDefault();
            if (this.popupElement === null)
                this.createPopup(targetElement);
            else
                this.destroyPopup();
        });
    }
}