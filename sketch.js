//學習5程式碼所在
function setup() {
  createCanvas(windowWidth, windowHeight); // 建立全螢幕畫布
  background('#3bceac'); // 設定畫布背景顏色
  ellipseMode(CENTER); // 設定圓心為定位點
}

function draw() {
  // 繪製圓形
  strokeWeight(5); // 設定框線粗細
  stroke('#bdb2ff'); // 設定框線顏色
  fill('#9bf6ff'); // 設定圓形填充顏色
  ellipse(width / 2, height / 2, 200, 200); // 在畫布中心繪製直徑200的圓
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 當視窗大小改變時，重新調整畫布大小
  background('#3bceac'); // 重新設定背景顏色
}
let circles = [];
const NUM_CIRCLES = 100;
let colors = ['#cdb4db','#b5e48c','#99d98c','#78936cff','#52b69a','#34a0a4','#168aad','#1a759f','#1e6091','#184e77'];
let explosions = [];
let explosionSound = null;
let score = 0; // 得分變數

function preload() {
  soundFormats('mp3','wav');
  // 改為載入同資料夾中的 pop-402322.mp3
  // 請放置於 c:\Users\shann\Downloads\20251013\20251013\pop-402322.mp3
  try {
    explosionSound = loadSound('pop-402322.mp3');
  } catch (e) {
    explosionSound = null;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#3bceac');
  ellipseMode(CENTER);

  for (let i = 0; i < NUM_CIRCLES; i++) {
    createNewCircle(i, height + random(0, 200));
  }
}

function createNewCircle(index, startY) {
  let r = random(40, 160);
  let x = random(r / 2, width - r / 2);
  let c = color(random(colors));
  c.setAlpha(random(80, 255));
  circles[index] = {
    x: x,
    y: startY,
    r: r,
    c: c,
    speed: random(0.6, 3.2),
    exploded: false,
    explosionThreshold: random(height * 0.15, height * 0.85)
  };
}

function draw() {
  background('#3bceac');
  noStroke();

  // 顯示文字
  fill('#a2d2ff');
  textSize(32);
  text('學號為414730308', 10, 30); // 左上角文字
  text('Score: ' + score, width - 150, 30); // 右上角得分

  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];

    if (!circle.exploded) {
      fill(circle.c);
      ellipse(circle.x, circle.y, circle.r, circle.r);

      let diamondSize = circle.r / 8;
      let diag = diamondSize * Math.SQRT2;
      let offset = (circle.r / 2) - (diag / 2);
      let dx = circle.x + offset * Math.cos(-PI / 4);
      let dy = circle.y + offset * Math.sin(-PI / 4);
      push();
      translate(dx, dy);
      rotate(PI / 4);
      fill(255, 180);
      rectMode(CENTER);
      rect(0, 0, diamondSize, diamondSize);
      pop();
    }

    circle.y -= circle.speed;

    if (circle.y < -circle.r / 2) {
      createNewCircle(i, height + circle.r / 2 + random(0, 180));
    }
  }

  for (let ei = explosions.length - 1; ei >= 0; ei--) {
    let ex = explosions[ei];
    for (let pi = ex.particles.length - 1; pi >= 0; pi--) {
      let p = ex.particles[pi];
      noStroke();
      fill(p.c.levels[0], p.c.levels[1], p.c.levels[2],
           map(p.life, 0, p.maxLife, 0, p.alpha));
      ellipse(p.x, p.y, p.size);

      p.vx *= 0.96;
      p.vy *= 0.96;
      p.vy += 0.18;
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) ex.particles.splice(pi, 1);
    }
    if (ex.particles.length === 0) explosions.splice(ei, 1);
  }
}

function mousePressed() {
  for (let i = circles.length - 1; i >= 0; i--) {
    let circle = circles[i];
    let d = dist(mouseX, mouseY, circle.x, circle.y);
    if (d < circle.r / 2) {
      circle.exploded = true; // 設定為已爆炸
      spawnExplosion(circle.x, circle.y, circle.r, i);
      
      // 根據顏色更新得分 (比較 RGB 值，忽略透明度)
      let targetColor = color('#cdb4db');
      if (red(circle.c) === red(targetColor) &&
          green(circle.c) === green(targetColor) &&
          blue(circle.c) === blue(targetColor)) {
        score += 1; // 得分
      } else {
        score -= 1; // 扣分
      }
      break; // 只處理一個氣球
    }
  }
}

function spawnExplosion(x, y, r, circleIndex) {
  if (explosionSound && typeof explosionSound.isLoaded === 'function' && explosionSound.isLoaded()) {
    explosionSound.setVolume(0.35);
    explosionSound.play();
  }

  let particles = [];
  let numParticles = int(random(18, 34));
  for (let i = 0; i < numParticles; i++) {
    let angle = random(TWO_PI);
    let speed = random(3, 9);
    let col = color(random(['#ffb703','#fb8500','#ff006e','#8338ec']));
    let palpha = random(180,255);
    col.setAlpha(palpha);
    particles.push({
      x: x,
      y: y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed - random(1,3),
      life: int(random(18, 44)),
      maxLife: int(random(18, 44)),
      c: col,
      size: random(3.5, 9),
      alpha: palpha
    });
  }

  explosions.push({ particles: particles, circleIndex: circleIndex });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background('#3bceac');
}




