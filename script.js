const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
const message = document.getElementById('message');

// 初始化畫布
function initCanvas() {
    ctx.fillStyle = '#ccc'; // 遮罩顏色
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000'; // 文字顏色
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('刮開看看！', canvas.width / 2, canvas.height / 2);
}

// 刮除效果
let isDrawing = false;
canvas.addEventListener('mousedown', () => (isDrawing = true));
canvas.addEventListener('mouseup', () => (isDrawing = false));
canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
    checkScratchCompletion();
});

// 檢查刮開範圍
function checkScratchCompletion() {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let cleared = 0;

    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) cleared++; // 透明像素
    }

    const percentage = (cleared / (pixels.length / 4)) * 100;
    if (percentage > 60) {
        message.textContent = '恭喜中獎！🎉';
        canvas.removeEventListener('mousemove', null);
    }
}

// 初始化
initCanvas();
