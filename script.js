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

// 事件狀態
let isDrawing = false;

// 開始刮
function startScratch(e) {
    isDrawing = true;
    scratch(e);
}

// 停止刮
function stopScratch() {
    isDrawing = false;
}

// 刮除效果
function scratch(e) {
    if (!isDrawing) return;

    // 獲取座標（支援觸控和滑鼠）
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // 刮除畫布
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();

    // 檢查完成度
    checkScratchCompletion();
}

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
        canvas.removeEventListener('mousemove', scratch);
        canvas.removeEventListener('mousedown', startScratch);
        canvas.removeEventListener('mouseup', stopScratch);
        canvas.removeEventListener('touchmove', scratch);
        canvas.removeEventListener('touchstart', startScratch);
        canvas.removeEventListener('touchend', stopScratch);
    }
}

// 初始化畫布
initCanvas();

// 滑鼠事件
canvas.addEventListener('mousedown', startScratch);
canvas.addEventListener('mousemove', scratch);
canvas.addEventListener('mouseup', stopScratch);

// 觸控事件
canvas.addEventListener('touchstart', startScratch);
canvas.addEventListener('touchmove', scratch);
canvas.addEventListener('touchend', stopScratch);
