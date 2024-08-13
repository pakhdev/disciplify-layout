class Chart {
    lineColor = 'rgba(168,229,242, 1)';
    pointColor = 'rgba(168,229,242, 1)';
    gridColor = '#F5F8FA';
    padding = 20;
    pointRadius = 5;

    constructor({ width, height, labels, dataNumbers, container }) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        this.width = width;
        this.height = height;
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const maxDataValue = Math.max(...dataNumbers);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawGrid(ctx);
        this.drawGraph(ctx, dataNumbers, maxDataValue);
        this.onPointHover(canvas, dataNumbers, labels, maxDataValue);
    }

    drawGrid(ctx) {
        ctx.strokeStyle = this.gridColor;
        ctx.lineWidth = 1;
        const steps = 5;
        const stepHeight = (this.height - this.padding * 2) / steps;

        for (let i = 0; i <= steps; i++) {
            const y = this.padding + stepHeight * i;
            ctx.beginPath();
            ctx.moveTo(this.padding, y);
            ctx.lineTo(this.width - this.padding, y);
            ctx.stroke();
        }
    }

    drawGraph(ctx, dataNumbers, maxDataValue) {
        const width = this.width - this.padding * 2;
        const height = this.height - this.padding * 2;

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = this.lineColor;

        for (let i = 0; i < dataNumbers.length; i++) {
            const x = this.padding + (width / (dataNumbers.length - 1)) * i;
            const y = this.height - this.padding - (dataNumbers[i] / maxDataValue) * height;

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }

        ctx.stroke();

        // Points
        for (let i = 0; i < dataNumbers.length; i++) {
            const x = this.padding + (width / (dataNumbers.length - 1)) * i;
            const y = this.height - this.padding - (dataNumbers[i] / maxDataValue) * height;

            ctx.beginPath();
            ctx.arc(x, y, this.pointRadius, 0, Math.PI * 2);
            ctx.fillStyle = this.pointColor;
            ctx.fill();
        }
    }

    onPointHover(canvas, dataNumbers, labels, maxDataValue) {
        const tooltip = document.createElement('div');
        tooltip.className = 'chart__tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.display = 'none';
        canvas.parentNode.appendChild(tooltip);

        const width = this.width - this.padding * 2;
        const height = this.height - this.padding * 2;

        canvas.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            let showTooltip = false;

            for (let i = 0; i < dataNumbers.length; i++) {
                const x = this.padding + (width / (dataNumbers.length - 1)) * i;
                const y = this.height - this.padding - (dataNumbers[i] / maxDataValue) * height;

                if (Math.abs(mouseX - x) < this.pointRadius && Math.abs(mouseY - y) < this.pointRadius) {
                    tooltip.style.left = event.pageX + 10 + 'px';
                    tooltip.style.top = event.pageY + 10 + 'px';
                    tooltip.style.display = 'block';
                    tooltip.innerHTML = `Date: ${labels[i]}<br>Result: ${dataNumbers[i]}`;
                    showTooltip = true;
                    break;
                }
            }

            if (!showTooltip) {
                tooltip.style.display = 'none';
            }
        });
    }
}
